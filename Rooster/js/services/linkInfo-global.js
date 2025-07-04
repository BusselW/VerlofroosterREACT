/**
 * @file linkInfo-global.js
 * @description Non-module version of linkInfo.js for use in non-module contexts.
 * Exposes functions to match employees to their team leaders through team membership.
 */

// Immediately-invoked function expression to avoid polluting the global scope
(function() {
    // Cache for teams and employees data to avoid repeated fetching
    let teamsCache = null;
    let medewerkersCache = null;
    let lastFetchTime = 0;
    const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

    /**
     * Refreshes the cache if it's expired or doesn't exist
     * @returns {Promise<{teams: Array, medewerkers: Array}>} The cached teams and employees data
     */
    async function refreshCacheIfNeeded() {
        const now = Date.now();
        
        // If cache is older than the expiry time or doesn't exist, refresh it
        if (!teamsCache || !medewerkersCache || now - lastFetchTime > CACHE_EXPIRY_MS) {
            try {
                // Fetch teams and employees data in parallel
                const [teamsData, medewerkersData] = await Promise.all([
                    fetchSharePointList('Teams'),
                    fetchSharePointList('Medewerkers')
                ]);
                
                // Filter out inactive teams
                teamsCache = teamsData.filter(team => team.Actief !== false);
                medewerkersCache = medewerkersData;
                lastFetchTime = now;
                
                console.log(`Cache refreshed with ${teamsCache.length} teams and ${medewerkersCache.length} employees`);
            } catch (error) {
                console.error('Error refreshing team/employee cache:', error);
                // If cache already exists, keep using it despite the error
                if (!teamsCache || !medewerkersCache) {
                    throw new Error('Failed to initialize team/employee data cache');
                }
            }
        }
        
        return { teams: teamsCache, medewerkers: medewerkersCache };
    }

    /**
     * Gets the team information for a given employee
     * @param {string} employeeUsername - The username of the employee (domain\username format)
     * @returns {Promise<Object|null>} Team information or null if not found
     */
    async function getTeamForEmployee(employeeUsername) {
        const { teams, medewerkers } = await refreshCacheIfNeeded();
        
        // Normalize the username for comparison
        const normalizedUsername = employeeUsername.toLowerCase();
        
        // Find the employee
        const employee = medewerkers.find(m => 
            m.Username && m.Username.toLowerCase() === normalizedUsername
        );
        
        if (!employee || !employee.Team) {
            return null;
        }
        
        // Find the team
        const team = teams.find(t => 
            t.Naam && t.Naam.toLowerCase() === employee.Team.toLowerCase()
        );
        
        return team || null;
    }

    /**
     * Gets the team leader information for a given employee
     * @param {string} employeeUsername - The username of the employee (domain\username format)
     * @returns {Promise<Object|null>} Team leader information or null if not found
     */
    async function getTeamLeaderForEmployee(employeeUsername) {
        const { teams, medewerkers } = await refreshCacheIfNeeded();
        
        // Find the team for this employee
        const team = await getTeamForEmployee(employeeUsername);
        
        if (!team || !team.TeamleiderId) {
            return null;
        }
        
        // Normalize the team leader username for comparison
        const normalizedTeamLeaderId = team.TeamleiderId.toLowerCase();
        
        // Find the team leader
        const teamLeader = medewerkers.find(m => 
            m.Username && m.Username.toLowerCase() === normalizedTeamLeaderId
        );
        
        return teamLeader || null;
    }

    /**
     * Gets all employees for a given team leader
     * @param {string} teamLeaderUsername - The username of the team leader (domain\username format)
     * @returns {Promise<Array>} Array of employees that have this person as their team leader
     */
    async function getEmployeesForTeamLeader(teamLeaderUsername) {
        const { teams, medewerkers } = await refreshCacheIfNeeded();
        
        // Normalize the team leader username for comparison
        const normalizedTeamLeaderUsername = teamLeaderUsername.toLowerCase();
        
        // Find all teams where this person is a team leader
        const leadingTeams = teams.filter(t => 
            t.TeamleiderId && t.TeamleiderId.toLowerCase() === normalizedTeamLeaderUsername
        );
        
        if (leadingTeams.length === 0) {
            return [];
        }
        
        // Get team names led by this person
        const teamNames = leadingTeams.map(t => t.Naam.toLowerCase());
        
        // Find all employees in these teams
        const teamEmployees = medewerkers.filter(m => 
            m.Team && teamNames.includes(m.Team.toLowerCase()) &&
            // Exclude the team leader from the list (unless you want to include them)
            m.Username.toLowerCase() !== normalizedTeamLeaderUsername
        );
        
        return teamEmployees;
    }

    /**
     * Checks if one employee is a team leader for another
     * @param {string} potentialLeaderUsername - Username of the potential leader
     * @param {string} employeeUsername - Username of the employee
     * @returns {Promise<boolean>} True if the potential leader is a team leader for the employee
     */
    async function isTeamLeaderFor(potentialLeaderUsername, employeeUsername) {
        // Don't check if they are the same person
        if (potentialLeaderUsername.toLowerCase() === employeeUsername.toLowerCase()) {
            return false;
        }
        
        const teamLeader = await getTeamLeaderForEmployee(employeeUsername);
        
        if (!teamLeader || !teamLeader.Username) {
            return false;
        }
        
        return teamLeader.Username.toLowerCase() === potentialLeaderUsername.toLowerCase();
    }

    /**
     * Gets all team information
     * @returns {Promise<Array>} Array of all teams
     */
    async function getAllTeams() {
        const { teams } = await refreshCacheIfNeeded();
        return [...teams]; // Return a copy to prevent cache modification
    }

    /**
     * Gets the team name for a given team leader
     * @param {string} teamLeaderUsername - The username of the team leader
     * @returns {Promise<Array>} Array of team names led by this person
     */
    async function getTeamNamesForTeamLeader(teamLeaderUsername) {
        const { teams } = await refreshCacheIfNeeded();
        
        // Normalize the team leader username for comparison
        const normalizedTeamLeaderUsername = teamLeaderUsername.toLowerCase();
        
        // Find all teams where this person is a team leader
        const leadingTeams = teams.filter(t => 
            t.TeamleiderId && t.TeamleiderId.toLowerCase() === normalizedTeamLeaderUsername
        );
        
        return leadingTeams.map(t => t.Naam);
    }

    /**
     * Checks if a user is a team leader for any team
     * @param {string} username - The username to check
     * @returns {Promise<boolean>} True if the user is a team leader for any team
     */
    async function isTeamLeader(username) {
        const { teams } = await refreshCacheIfNeeded();
        
        // Normalize the username for comparison
        const normalizedUsername = username.toLowerCase();
        
        // Check if this person is a team leader for any team
        return teams.some(t => 
            t.TeamleiderId && t.TeamleiderId.toLowerCase() === normalizedUsername
        );
    }

    /**
     * Gets all employees in a given team
     * @param {string} teamName - The name of the team
     * @returns {Promise<Array>} Array of employees in this team
     */
    async function getEmployeesInTeam(teamName) {
        const { medewerkers } = await refreshCacheIfNeeded();
        
        // Normalize the team name for comparison
        const normalizedTeamName = teamName.toLowerCase();
        
        // Find all employees in this team
        return medewerkers.filter(m => 
            m.Team && m.Team.toLowerCase() === normalizedTeamName
        );
    }

    /**
     * Invalidates the cache, forcing a refresh on the next data request
     */
    function invalidateCache() {
        teamsCache = null;
        medewerkersCache = null;
        lastFetchTime = 0;
    }

    // Expose the functions to the global scope through the LinkInfo object
    window.LinkInfo = {
        getTeamForEmployee,
        getTeamLeaderForEmployee,
        getEmployeesForTeamLeader,
        isTeamLeaderFor,
        getAllTeams,
        getTeamNamesForTeamLeader,
        isTeamLeader,
        getEmployeesInTeam,
        invalidateCache
    };
})();
