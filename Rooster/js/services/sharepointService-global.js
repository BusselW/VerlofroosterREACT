/**
 * @file sharepointService-global.js
 * @description Non-module version of sharepointService.js for use in non-module contexts.
 * Provides SharePoint service functions as global variables.
 */

// Create a fallback appConfiguratie if it doesn't exist
if (typeof window.appConfiguratie === "undefined") {
    console.warn("Creating fallback appConfiguratie object because it was not found");
    window.appConfiguratie = {
        instellingen: {
            debounceTimer: 300,
            siteUrl: ""  // Empty site URL will cause graceful fallbacks
        }
    };
}

// Immediately-invoked function expression to avoid polluting the global scope
(function() {
    /**
     * Fetches a SharePoint list using the app configuration
     * @param {string} lijstNaam - The name of the list as defined in appConfiguratie
     * @returns {Promise<Array>} A Promise with the list items or an empty array on error
     */
    async function fetchSharePointList(lijstNaam) {
        try {
            // Use ConfigHelper if available, otherwise fall back to direct access
            let lijstConfig = null;
            let siteUrl = "";
            
            if (window.ConfigHelper) {
                lijstConfig = window.ConfigHelper.getListConfig(lijstNaam);
                siteUrl = window.ConfigHelper.getSiteUrl();
            } else {
                // Use getLijstConfig for compatibility
                lijstConfig = window.getLijstConfig ? window.getLijstConfig(lijstNaam) : null;
                
                // If not found via getLijstConfig, try appConfiguratie
                if (!lijstConfig && window.appConfiguratie) {
                    lijstConfig = window.appConfiguratie[lijstNaam];
                }
                
                siteUrl = window.appConfiguratie?.instellingen?.siteUrl || "";
            }
            
            if (!lijstConfig) {
                console.warn(`Configuratie voor lijst '${lijstNaam}' niet gevonden. Fallback naar lege lijst.`);
                return [];
            }
            
            if (!siteUrl) {
                console.warn('SharePoint site URL niet gevonden. Fallback naar lege lijst.');
                return [];
            }

            const lijstTitel = lijstConfig.lijstTitel;
            const apiUrl = `${siteUrl.replace(/\/$/, "")}/_api/web/lists/getbytitle('${lijstTitel}')/items?$top=5000`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json;odata=nometadata' },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                console.warn(`Fout bij ophalen van ${lijstNaam}: ${response.statusText}. Fallback naar lege lijst.`);
                return [];
            }
            
            const data = await response.json();
            return data.value || [];
        } catch (error) {
            console.error(`Fout bij ophalen van lijst ${lijstNaam}:`, error);
            console.warn('Fallback naar lege lijst vanwege fout.');
            return [];
        }
    }

    /**
     * Gets information about a SharePoint user based on their login name.
     * @param {string} loginName - The login name of the user, e.g., 'org\\username'.
     * @returns {Promise<object|null>} A Promise that resolves to user data or null if not found or on error.
     */
    async function getUserInfo(loginName) {
        if (!loginName) {
            console.warn("Ongeldige of ontbrekende loginName voor getUserInfo:", loginName);
            return null;
        }

        const siteUrl = window.ConfigHelper ? window.ConfigHelper.getSiteUrl() : (window.appConfiguratie?.instellingen?.siteUrl || "");
        if (!siteUrl) {
            console.warn("SiteUrl configuratie is niet beschikbaar.");
            return null;
        }
        
        // Handle different formats of loginName and try multiple approaches
        let processedLoginName = loginName;
        
        // If loginName doesn't contain \, try to construct it
        if (!loginName.includes('\\') && loginName.length > 0) {
            // Assume it's just the username part, try common domain
            processedLoginName = `org\\${loginName}`;
        }
        
        try {
            // Try with claim-based format
            const claimLoginName = `i:0#.w|${processedLoginName}`;
            const url = `${siteUrl.replace(/\/$/, '')}/_api/web/siteusers?$filter=LoginName eq '${encodeURIComponent(claimLoginName)}'`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json;odata=nometadata' },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                console.warn(`Fout bij ophalen van gebruiker ${loginName}: ${response.statusText}`);
                return null;
            }
            
            const data = await response.json();
            const user = data.value && data.value.length > 0 ? data.value[0] : null;
            
            if (user) {
                return {
                    Id: user.Id,
                    Title: user.Title,
                    Email: user.Email,
                    LoginName: user.LoginName,
                    PictureURL: user.Picture ? user.Picture.Url : null
                };
            }
            
            return null;
        } catch (error) {
            console.error(`Fout bij ophalen van gebruiker ${loginName}:`, error);
            return null;
        }
    }

    /**
     * Updates a SharePoint list item.
     * @param {string} lijstNaam - The name of the list as defined in appConfiguratie.
     * @param {number} itemId - The ID of the item to update.
     * @param {object} fields - The fields to update.
     * @returns {Promise<object|null>} A Promise that resolves to the updated item or null on error.
     */
    async function updateListItem(lijstNaam, itemId, fields) {
        try {
            // Use ConfigHelper if available, otherwise fall back to direct access
            let lijstConfig = null;
            let siteUrl = "";
            
            if (window.ConfigHelper) {
                lijstConfig = window.ConfigHelper.getListConfig(lijstNaam);
                siteUrl = window.ConfigHelper.getSiteUrl();
            } else {
                // Use getLijstConfig for compatibility
                lijstConfig = window.getLijstConfig ? window.getLijstConfig(lijstNaam) : null;
                
                // If not found via getLijstConfig, try appConfiguratie
                if (!lijstConfig && window.appConfiguratie) {
                    lijstConfig = window.appConfiguratie[lijstNaam];
                }
                
                siteUrl = window.appConfiguratie?.instellingen?.siteUrl || "";
            }
            
            if (!lijstConfig) {
                console.warn(`Configuratie voor lijst '${lijstNaam}' niet gevonden.`);
                return null;
            }
            
            if (!siteUrl) {
                console.warn('SharePoint site URL niet gevonden.');
                return null;
            }

            const lijstTitel = lijstConfig.lijstTitel;
            const apiUrl = `${siteUrl.replace(/\/$/, "")}/_api/web/lists/getbytitle('${lijstTitel}')/items(${itemId})`;
            
            // Get request digest for form digest value (needed for POST/PATCH operations)
            const digestUrl = `${siteUrl.replace(/\/$/, "")}/_api/contextinfo`;
            const digestResponse = await fetch(digestUrl, {
                method: 'POST',
                headers: { 'Accept': 'application/json;odata=nometadata' },
                credentials: 'same-origin'
            });
            
            if (!digestResponse.ok) {
                throw new Error(`Fout bij ophalen van FormDigestValue: ${digestResponse.statusText}`);
            }
            
            const digestData = await digestResponse.json();
            const formDigestValue = digestData.FormDigestValue;
            
            // Prepare the fields for the update
            const fieldsToUpdate = { ...fields };
            
            // Perform the update
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-Type': 'application/json;odata=verbose',
                    'X-HTTP-Method': 'MERGE',
                    'IF-MATCH': '*',
                    'X-RequestDigest': formDigestValue
                },
                body: JSON.stringify(fieldsToUpdate),
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`Fout bij bijwerken van item in ${lijstNaam}: ${response.statusText}`);
            }
            
            return { success: true, itemId };
        } catch (error) {
            console.error(`Fout bij bijwerken van item in ${lijstNaam}:`, error);
            return null;
        }
    }
    
    // Expose functions to global scope
    window.SharePointService = {
        fetchSharePointList,
        getUserInfo,
        updateListItem
    };
})();
