import { isUserInAnyGroup } from './permissionService.js';

export const canManageOthersEvents = async () => {
    const privilegedGroups = [
        "11. Sharepoint beheer",
        "11.1. Mulder MT",
        "2.6. Roosteraars",
        "2.3. Senioren beoordelen"
    ];

    try {
        return await isUserInAnyGroup(privilegedGroups);
    } catch (error) {
        console.error('Error checking user permissions for managing others events:', error);
        return false;
    }
};
