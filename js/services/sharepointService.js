/**
 * @file sharepointService.js
 * @description Dit bestand bevat functies om te communiceren met de SharePoint REST API.
 * Het is specifiek opgezet om gebruikersinformatie op te halen op basis van de loginnaam.
 */

/**
 * Haalt gebruikersinformatie op uit SharePoint op basis van een loginnaam.
 * Deze functie is ontworpen om te werken met Windows-login namen (bijv. 'domein\gebruiker').
 *
 * @param {string} loginName De loginnaam van de gebruiker, bijvoorbeeld 'org\busselw'.
 * @returns {Promise<object|null>} Een Promise die wordt vervuld met een object met gebruikersdata,
 * inclusief de 'PictureURL', of null als de gebruiker niet gevonden is
 * of er een fout optreedt.
 */
/**
 * @file sharepointService.js
 * @description Functies voor communicatie met de SharePoint REST API.
 */

/**
 * Haalt gebruikersinformatie op uit SharePoint op basis van een loginnaam.
 */
export async function getUserInfo(loginName) {
    if (!loginName || !loginName.includes('\\')) {
        console.warn("Ongeldige of ontbrekende loginName voor getUserInfo:", loginName);
        return null;
    }

    const siteUrl = window.appConfiguratie.instellingen.siteUrl;
    const claimBasedLoginName = `i:0#.w|${loginName}`;
    const apiUrl = `${siteUrl.replace(/\/$/, '')}/_api/web/siteusers?$filter=LoginName eq '${encodeURIComponent(claimBasedLoginName)}'`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json;odata=nometadata' }
        });

        if (!response.ok) {
            throw new Error(`Fout bij ophalen gebruiker (${response.status}): ${response.statusText}`);
        }

        const data = await response.json();

        if (data.value && data.value.length > 0) {
            const user = data.value[0];
            const pictureUrl = `${siteUrl.replace(/\/$/, '')}/_layouts/15/userphoto.aspx?size=M&accountname=${encodeURIComponent(user.LoginName)}`;
            
            return {
                Id: user.Id,
                Title: user.Title,
                Email: user.Email,
                LoginName: user.LoginName,
                PictureURL: pictureUrl
            };
        } else {
            console.warn(`Gebruiker met loginnaam '${loginName}' niet gevonden.`);
            return null;
        }

    } catch (error) {
        console.error("Fout tijdens het ophalen van gebruikersinformatie:", error);
        return null;
    }
}

/**
 * Genereert een directe URL naar de profielfoto van een gebruiker.
 * Dit is een snelle alternatieve functie als je ALLEEN de foto nodig hebt.
 *
 * @param {string} loginName De loginnaam van de gebruiker (bijv. 'org\busselw').
 * @param {'S' | 'M' | 'L'} size De gewenste grootte van de foto (Small, Medium, Large).
 * @returns {string|null} De volledige URL naar de afbeelding, of null bij een ongeldige input.
 */
export function getProfilePictureUrl(loginName, size = 'M') {
    if (!loginName || !loginName.includes('\\')) {
        console.warn("Ongeldige of ontbrekende loginName voor getProfilePictureUrl:", loginName);
        return null;
    }

    const siteUrl = window.appConfiguratie.instellingen.siteUrl;
    const claimBasedLoginName = `i:0#.w|${loginName}`;
    const imageUrl = `${siteUrl.replace(/\/$/, '')}/_layouts/15/userphoto.aspx?size=${size}&accountname=${encodeURIComponent(claimBasedLoginName)}`;
    
    return imageUrl;
}
