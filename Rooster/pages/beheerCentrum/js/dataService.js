/**
 * dataService.js - Service for SharePoint data operations
 * 
 * This module handles CRUD operations for SharePoint lists
 */

// Import core context
import { spContext } from './sharepointContext.js';

/**
 * Get items from a SharePoint list
 * @param {string} listName - The name of the list to fetch from
 * @param {string} selectFields - Fields to select (comma-separated)
 * @param {string} filterQuery - OData filter query
 * @param {string} orderBy - Order by field and direction (e.g., "Title asc")
 * @param {number} top - Maximum number of items to return
 * @returns {Promise<Array>} Array of list items
 */
async function getListItems(listName, selectFields = '*', filterQuery = '', orderBy = 'Id', top = 1000) {
    try {
        let url = `${spContext.siteUrl}/_api/web/lists/getbytitle('${listName}')/items`;
        const queryParams = [];
        
        if (selectFields && selectFields !== '*') {
            queryParams.push(`$select=${selectFields}`);
        }
        
        if (filterQuery) {
            queryParams.push(`$filter=${filterQuery}`);
        }
        
        if (orderBy) {
            queryParams.push(`$orderby=${orderBy}`);
        }
        
        if (top) {
            queryParams.push(`$top=${top}`);
        }
        
        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.d.results;
    } catch (error) {
        console.error(`Fout bij ophalen items uit ${listName}:`, error);
        throw error;
    }
}

/**
 * Create a new item in a SharePoint list
 * @param {string} listName - The name of the list
 * @param {Object} itemData - Data for the new item
 * @returns {Promise<Object>} Created item
 */
async function createListItem(listName, itemData) {
    try {
        const url = `${spContext.siteUrl}/_api/web/lists/getbytitle('${listName}')/items`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': spContext.requestDigest
            },
            body: JSON.stringify({ 
                '__metadata': { 'type': `SP.Data.${listName}ListItem` },
                ...itemData
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.d;
    } catch (error) {
        console.error(`Fout bij aanmaken item in ${listName}:`, error);
        throw error;
    }
}

/**
 * Update an existing item in a SharePoint list
 * @param {string} listName - The name of the list
 * @param {number} itemId - ID of the item to update
 * @param {Object} itemData - Updated data for the item
 * @returns {Promise<void>}
 */
async function updateListItem(listName, itemId, itemData) {
    try {
        const url = `${spContext.siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': spContext.requestDigest,
                'IF-MATCH': '*',
                'X-HTTP-Method': 'MERGE'
            },
            body: JSON.stringify({
                '__metadata': { 'type': `SP.Data.${listName}ListItem` },
                ...itemData
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return true;
    } catch (error) {
        console.error(`Fout bij bijwerken item in ${listName}:`, error);
        throw error;
    }
}

/**
 * Delete an item from a SharePoint list
 * @param {string} listName - The name of the list
 * @param {number} itemId - ID of the item to delete
 * @returns {Promise<void>}
 */
async function deleteListItem(listName, itemId) {
    try {
        const url = `${spContext.siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-RequestDigest': spContext.requestDigest,
                'IF-MATCH': '*',
                'X-HTTP-Method': 'DELETE'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return true;
    } catch (error) {
        console.error(`Fout bij verwijderen item uit ${listName}:`, error);
        throw error;
    }
}

/**
 * Get choice field options from a SharePoint list
 * @param {string} listName - The name of the list
 * @param {string} fieldName - The name of the choice field
 * @returns {Promise<Array<string>>} Array of choice options
 */
async function getChoiceFieldOptions(listName, fieldName) {
    try {
        const url = `${spContext.siteUrl}/_api/web/lists/getbytitle('${listName}')/fields?$filter=EntityPropertyName eq '${fieldName}'`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.d.results.length === 0) {
            throw new Error(`Veld ${fieldName} niet gevonden in lijst ${listName}`);
        }
        
        const field = data.d.results[0];
        
        if (field.TypeAsString !== 'Choice' && field.TypeAsString !== 'MultiChoice') {
            throw new Error(`Veld ${fieldName} is geen keuzeveld (${field.TypeAsString})`);
        }
        
        return field.Choices.results;
    } catch (error) {
        console.error(`Fout bij ophalen keuzeopties voor ${fieldName} in ${listName}:`, error);
        throw error;
    }
}

/**
 * Get the user profile by login name
 * @param {string} loginName - The login name of the user
 * @returns {Promise<Object>} User profile data
 */
async function getUserProfile(loginName) {
     try {
         const url = `${spContext.siteUrl}/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='${encodeURIComponent(loginName)}'`;
        
         const response = await fetch(url, {
             method: 'GET',
             headers: {
                 'Accept': 'application/json;odata=verbose'
             }
         });
        
         if (!response.ok) {
             throw new Error(`Error ${response.status}: ${response.statusText}`);
         }
        
         const data = await response.json();
         return data.d;
     } catch (error) {
         console.error(`Fout bij ophalen van gebruikersprofiel voor ${loginName}:`, error);
         throw error;
     }
}

/**
 * Search for users in the site collection.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} Array of user objects matching the query.
 */
async function searchSiteUsers(query) {
    if (!query || query.length < 3) {
        return [];
    }
    try {
        // Searches in Title (DisplayName), Email, and LoginName
        const filter = `substringof('${query}', Title) or substringof('${query}', Email) or substringof('${query}', LoginName)`;
        const url = `${spContext.siteUrl}/_api/web/siteusers?$filter=${filter}&$top=10`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.d.results.filter(user => user.PrincipalType === 1); // Filter for users only
    } catch (error) {
        console.error('Fout bij zoeken naar gebruikers:', error);
        throw error;
    }
}

// Export functions
export {
    getListItems,
    createListItem,
    updateListItem,
    deleteListItem,
    getChoiceFieldOptions,
    getUserProfile,
    searchSiteUsers
};
