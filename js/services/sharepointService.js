/**
 * @file sharepointService.js
 * @description Dit bestand bevat functies om te communiceren met de SharePoint REST API.
 * Het is specifiek opgezet om gebruikersinformatie op te halen op basis van de loginnaam.
 */

/**
 * Ophalen van gebruikersinformatie uit SharePoint op basis van een loginnaam.
 *
 * Deze functie maakt gebruik van de SharePoint REST API om informatie op te halen over een gebruiker.
 * De loginnaam moet in het formaat 'domein\\gebruiker' zijn. De functie retourneert een object met
 * de belangrijkste gebruikersgegevens, inclusief een URL naar de profielfoto. Als de gebruiker niet
 * gevonden wordt of er een fout optreedt, wordt null geretourneerd.
 *
 * @param {string} loginName - De loginnaam van de gebruiker, bijvoorbeeld 'org\\busselw'.
 * @returns {Promise<object|null>} Een Promise die wordt vervuld met een object met gebruikersdata,
 * inclusief de 'PictureURL', of null als de gebruiker niet gevonden is of er een fout optreedt.
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
 * Genereert een directe URL naar de profielfoto van een gebruiker in SharePoint.
 *
 * Gebruik deze functie als je alleen de foto-URL nodig hebt en niet de volledige gebruikersinformatie.
 * De loginnaam moet in het formaat 'domein\\gebruiker' zijn. De grootte van de foto kan worden opgegeven
 * als 'S' (Small), 'M' (Medium), of 'L' (Large).
 *
 * @param {string} loginName - De loginnaam van de gebruiker (bijv. 'org\\busselw').
 * @param {'S' | 'M' | 'L'} [size='M'] - De gewenste grootte van de foto.
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

/**
 * Haalt een lijst met items op uit SharePoint op basis van de lijstnaam uit de appConfiguratie.
 *
 * Deze functie maakt gebruik van de SharePoint REST API om alle items van een opgegeven lijst op te halen.
 * De lijstnaam moet overeenkomen met een configuratie in window.appConfiguratie. Bij een fout wordt een
 * error gegooid. De functie retourneert een array met lijstitems.
 *
 * @param {string} lijstNaam - De naam van de lijst zoals gedefinieerd in appConfiguratie.
 * @returns {Promise<Array>} Een Promise met de lijstitems of een lege array bij fout.
 */
export async function fetchSharePointList(lijstNaam) {
    try {
        if (!window.appConfiguratie || !window.appConfiguratie.instellingen) {
            throw new Error('App configuratie niet gevonden.');
        }
        const siteUrl = window.appConfiguratie.instellingen.siteUrl;
        const lijstConfig = window.appConfiguratie[lijstNaam];
        if (!lijstConfig) throw new Error(`Configuratie voor lijst '${lijstNaam}' niet gevonden.`);

        const lijstTitel = lijstConfig.lijstTitel;
        const apiUrl = `${siteUrl.replace(/\/$/, "")}/_api/web/lists/getbytitle('${lijstTitel}')/items?$top=5000`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json;odata=nometadata' },
            credentials: 'same-origin'
        });
        if (!response.ok) throw new Error(`Fout bij ophalen van ${lijstNaam}: ${response.statusText}`);
        const data = await response.json();
        return data.value || [];
    } catch (error) {
        console.error(`Fout bij ophalen van lijst ${lijstNaam}:`, error);
        throw error;
    }
}

/**
 * Haalt de informatie van de huidige ingelogde gebruiker op.
 * @returns {Promise<object|null>} Een Promise die wordt vervuld met een object met gebruikersdata, of null bij een fout.
 */
export async function getCurrentUserInfo() {
    if (!window.appConfiguratie || !window.appConfiguratie.instellingen || !window.appConfiguratie.instellingen.siteUrl) {
        console.error("SiteUrl configuratie is niet beschikbaar.");
        return null;
    }
    const siteUrl = window.appConfiguratie.instellingen.siteUrl;
    const apiUrl = `${siteUrl.replace(/\/$/, '')}/_api/web/currentuser`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json;odata=nometadata' }
        });

        if (!response.ok) {
            throw new Error(`Fout bij ophalen huidige gebruiker (${response.status}): ${response.statusText}`);
        }

        const user = await response.json();

        if (user) {
            const pictureUrl = `${siteUrl.replace(/\/$/, '')}/_layouts/15/userphoto.aspx?size=M&accountname=${encodeURIComponent(user.LoginName)}`;
            return {
                ...user,
                PictureURL: pictureUrl
            };
        }
        return null;
    } catch (error) {
        console.error("Fout tijdens het ophalen van huidige gebruikersinformatie:", error);
        return null;
    }
}

/**
 * Haalt de Form Digest Value op die nodig is voor POST requests.
 * @returns {Promise<string>} De Form Digest Value.
 */
async function getRequestDigest() {
    const siteUrl = window.appConfiguratie.instellingen.siteUrl;
    const apiUrl = `${siteUrl.replace(/\/$/, '')}/_api/contextinfo`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Accept': 'application/json;odata=nometadata' },
        credentials: 'same-origin'
    });

    if (!response.ok) {
        throw new Error(`Fout bij ophalen van request digest: ${response.statusText}`);
    }

    const data = await response.json();
    return data.FormDigestValue;
}

export const getSharePointListItems = async (listName) => {
    try {
        if (!window.appConfiguratie || !window.appConfiguratie.instellingen) {
            throw new Error('App configuratie niet gevonden.');
        }
        const siteUrl = window.appConfiguratie.instellingen.siteUrl;
        const lijstConfig = window.appConfiguratie[listName];
        if (!lijstConfig) throw new Error(`Configuratie voor lijst '${listName}' niet gevonden.`);

        const lijstTitel = lijstConfig.lijstTitel;
        const apiUrl = `${siteUrl.replace(/\/$/, "")}/_api/web/lists/getbytitle('${lijstTitel}')/items?$top=5000`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json;odata=nometadata' },
            credentials: 'same-origin'
        });
        if (!response.ok) throw new Error(`Fout bij ophalen van ${listName}: ${response.statusText}`);
        const data = await response.json();
        return data.value || [];
    } catch (error) {
        console.error(`Fout bij ophalen van lijst ${listName}:`, error);
        throw error;
    }
};

export const createSharePointListItem = async (listName, itemData) => {
    try {
        if (!window.appConfiguratie || !window.appConfiguratie.instellingen) {
            throw new Error('App configuratie niet gevonden.');
        }
        const siteUrl = window.appConfiguratie.instellingen.siteUrl;
        const lijstConfig = window.appConfiguratie[listName];
        if (!lijstConfig) throw new Error(`Configuratie voor lijst '${listName}' niet gevonden.`);

        const lijstTitel = lijstConfig.lijstTitel;
        const apiUrl = `${siteUrl.replace(/\/$/, "")}/_api/web/lists/getbytitle('${lijstTitel}')/items`;
        const requestDigest = await getRequestDigest();

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=nometadata',
                'Content-Type': 'application/json;odata=nometadata',
                'X-RequestDigest': requestDigest,
                'IF-MATCH': '*',
                'X-HTTP-Method': 'POST'
            },
            credentials: 'same-origin',
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            throw new Error(`Fout bij aanmaken van item in ${listName}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Fout bij aanmaken van item in lijst ${listName}:`, error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    if (!window.appConfiguratie || !window.appConfiguratie.instellingen || !window.appConfiguratie.instellingen.siteUrl) {
        console.error("SiteUrl configuratie is niet beschikbaar.");
        return null;
    }
    const siteUrl = window.appConfiguratie.instellingen.siteUrl;
    const apiUrl = `${siteUrl.replace(/\/$/, '')}/_api/web/currentuser`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json;odata=nometadata' }
        });

        if (!response.ok) {
            throw new Error(`Fout bij ophalen huidige gebruiker (${response.status}): ${response.statusText}`);
        }

        const user = await response.json();

        if (user) {
            const pictureUrl = `${siteUrl.replace(/\/$/, '')}/_layouts/15/userphoto.aspx?size=M&accountname=${encodeURIComponent(user.LoginName)}`;
            return {
                ...user,
                PictureURL: pictureUrl
            };
        }
        return null;
    } catch (error) {
        console.error("Fout tijdens het ophalen van huidige gebruikersinformatie:", error);
        return null;
    }
};

window.getSharePointListItems = getSharePointListItems;
window.createSharePointListItem = createSharePointListItem;
window.getCurrentUser = getCurrentUser;
