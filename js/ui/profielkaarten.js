/**
 * @file profielkaarten.js
 * @description Component for displaying employee profile cards on hover
 * This file provides functionality to show detailed information about an employee
 * when hovering over their name or avatar in the schedule view.
 */

import { fetchSharePointList } from '../services/sharepointService.js';
import { getUserInfo } from '../services/sharepointService.js';
import * as linkInfo from '../services/linkInfo.js';

const fallbackAvatar = 'https://placehold.co/96x96/4a90e2/ffffff?text=';

const ProfielKaarten = (() => {
    const h = React.createElement;
    let activeCard = null;
    let cardTimeout = null;

    /**
     * Fetch employee data by username
     * @param {string} username - The employee's username
     * @returns {Promise<Object>} - Employee data
     */
    const fetchMedewerkerData = async (username) => {
        try {
            console.log(`fetchMedewerkerData: Fetching data for username "${username}"`);
            
            // Use the imported fetchSharePointList function
            const medewerkers = await fetchSharePointList('Medewerkers');
            console.log(`fetchMedewerkerData: Received ${medewerkers.length} medewerkers`);
            
            // First try exact match
            let medewerker = medewerkers.find(m => m.Username === username);
            
            // If not found, try different username formats
            if (!medewerker) {
                console.log(`fetchMedewerkerData: Exact match failed, trying alternative formats for "${username}"`);
                
                // Normalize username - try both formats
                let alternativeUsername = null;
                
                if (username.includes('\\')) {
                    // If it has domain\username format, also try without domain
                    alternativeUsername = username.split('\\')[1];
                    console.log(`fetchMedewerkerData: Trying without domain: "${alternativeUsername}"`);
                    medewerker = medewerkers.find(m => 
                        m.Username === alternativeUsername ||
                        (m.Username && m.Username.toLowerCase() === alternativeUsername.toLowerCase())
                    );
                } else {
                    // If it doesn't have domain, also try with som\ prefix
                    alternativeUsername = `som\\${username}`;
                    console.log(`fetchMedewerkerData: Trying with domain: "${alternativeUsername}"`);
                    medewerker = medewerkers.find(m => 
                        m.Username === alternativeUsername ||
                        (m.Username && m.Username.toLowerCase() === alternativeUsername.toLowerCase())
                    );
                }
                
                // Also try case-insensitive matching
                if (!medewerker) {
                    console.log(`fetchMedewerkerData: Trying case-insensitive match for "${username}"`);
                    medewerker = medewerkers.find(m => 
                        m.Username && m.Username.toLowerCase() === username.toLowerCase()
                    );
                }
            }
            
            if (medewerker) {
                console.log('fetchMedewerkerData: Found matching medewerker:', {
                    ID: medewerker.ID,
                    Username: medewerker.Username,
                    Naam: medewerker.Naam || medewerker.Title,
                    Functie: medewerker.Functie,
                    Email: medewerker.E_x002d_mail,
                    Horen: medewerker.Horen
                });
                return medewerker;
            }
            
            console.warn(`fetchMedewerkerData: No medewerker found with username "${username}"`);
            console.log('fetchMedewerkerData: Available usernames sample:', 
                medewerkers.slice(0, 5).map(m => m.Username).filter(u => u)
            );
            return null;
        } catch (error) {
            console.error('Error fetching employee data:', error);
            return null;
        }
    };

    /**
     * Fetch working hours data for an employee
     * @param {string} medewerkerID - The employee's ID or username
     * @returns {Promise<Object>} - Working hours data
     */
    const fetchWerkroosterData = async (medewerkerID) => {
        try {
            console.log(`fetchWerkroosterData: Fetching data for medewerker "${medewerkerID}"`);
            
            // Use the imported fetchSharePointList function
            const urenItems = await fetchSharePointList('UrenPerWeek');
            console.log(`fetchWerkroosterData: Received ${urenItems.length} UrenPerWeek records`);
            
            // Check both Username and MedewerkerID fields
            const filteredItems = urenItems.filter(item => 
                item.MedewerkerID === medewerkerID || 
                item.Username === medewerkerID
            );
            
            console.log(`fetchWerkroosterData: Found ${filteredItems.length} matching records`);
            
            if (filteredItems.length === 0) {
                // If no exact match, try a case-insensitive match
                const lowercaseID = medewerkerID.toLowerCase();
                const altItems = urenItems.filter(item => 
                    (item.MedewerkerID && item.MedewerkerID.toLowerCase() === lowercaseID) || 
                    (item.Username && item.Username.toLowerCase() === lowercaseID)
                );
                
                console.log(`fetchWerkroosterData: Found ${altItems.length} case-insensitive matches`);
                
                if (altItems.length > 0) {
                    // Sort by Ingangsdatum desc
                    altItems.sort((a, b) => new Date(b.Ingangsdatum) - new Date(a.Ingangsdatum));
                    console.log('fetchWerkroosterData: Using case-insensitive match:', altItems[0]);
                    return altItems[0];
                }
                
                return null;
            }
            
            // Sort by Ingangsdatum desc
            filteredItems.sort((a, b) => new Date(b.Ingangsdatum) - new Date(a.Ingangsdatum));
            console.log('fetchWerkroosterData: Using record:', filteredItems[0]);
            return filteredItems[0];
        } catch (error) {
            console.error('Error fetching werkrooster data:', error);
            return null;
        }
    };

    /**
     * Fetch team leader data by username
     * @param {string} username - The employee's username
     * @returns {Promise<Object|null>} - Team leader data or null if not found
     */
    const fetchTeamLeaderData = async (username) => {
        try {
            console.log(`fetchTeamLeaderData: Fetching team leader for username "${username}"`);
            
            // Normalize username - try both formats (same logic as fetchSeniorData)
            let normalizedUsername = username;
            let alternativeUsername = null;
            
            if (username.includes('\\')) {
                // If it has domain\username format, also try without domain
                alternativeUsername = username.split('\\')[1];
                console.log(`fetchTeamLeaderData: Also trying alternative username "${alternativeUsername}"`);
            } else {
                // If it doesn't have domain, also try with som\ prefix
                alternativeUsername = `som\\${username}`;
                console.log(`fetchTeamLeaderData: Also trying alternative username "${alternativeUsername}"`);
            }
            
            // Try original username first
            console.log(`fetchTeamLeaderData: Trying original username "${normalizedUsername}"`);
            let teamLeader = await linkInfo.getTeamLeaderForEmployee(normalizedUsername);
            
            // If not found, try alternative format
            if (!teamLeader && alternativeUsername) {
                console.log(`fetchTeamLeaderData: Original username failed, trying alternative "${alternativeUsername}"`);
                teamLeader = await linkInfo.getTeamLeaderForEmployee(alternativeUsername);
            }
            
            if (teamLeader) {
                console.log('fetchTeamLeaderData: Found team leader:', {
                    Username: teamLeader.Username,
                    Naam: teamLeader.Title || teamLeader.Naam,
                    Functie: teamLeader.Functie
                });
                return teamLeader;
            }
            
            console.log(`fetchTeamLeaderData: No team leader found for "${username}" (tried "${normalizedUsername}" and "${alternativeUsername || 'none'}")`);
            return null;
        } catch (error) {
            console.error('Error fetching team leader data:', error);
            return null;
        }
    };

    /**
     * Fetch senior data by username
     * @param {string} username - The employee's username
     * @returns {Promise<Object|null>} - Senior data or null if not found
     */
    const fetchSeniorData = async (username) => {
        try {
            console.log(`fetchSeniorData: Fetching senior for username "${username}"`);
            
            // Normalize username - try both formats
            let normalizedUsername = username;
            let alternativeUsername = null;
            
            if (username.includes('\\')) {
                // If it has domain\username format, also try without domain
                alternativeUsername = username.split('\\')[1];
                console.log(`fetchSeniorData: Also trying alternative username "${alternativeUsername}"`);
            } else {
                // If it doesn't have domain, also try with som\ prefix
                alternativeUsername = `som\\${username}`;
                console.log(`fetchSeniorData: Also trying alternative username "${alternativeUsername}"`);
            }
            
            // Try original username first
            console.log(`fetchSeniorData: Trying original username "${normalizedUsername}"`);
            let senior = await linkInfo.getSeniorForEmployee(normalizedUsername);
            
            // If not found, try alternative format
            if (!senior && alternativeUsername) {
                console.log(`fetchSeniorData: Original username failed, trying alternative "${alternativeUsername}"`);
                senior = await linkInfo.getSeniorForEmployee(alternativeUsername);
            }
            
            if (senior) {
                console.log('fetchSeniorData: Found senior:', {
                    Username: senior.seniorInfo?.Username,
                    Naam: senior.naam,
                    Team: senior.Team,
                    MedewerkerID: senior.MedewerkerID
                });
                return senior;
            }
            
            console.log(`fetchSeniorData: No senior found for "${username}" (tried "${normalizedUsername}" and "${alternativeUsername || 'none'}")`);
            return null;
        } catch (error) {
            console.error('Error fetching senior data:', error);
            return null;
        }
    };

    /**
     * Get profile photo URL using the same logic as userinfo.js
     * @param {string} username - The employee's username
     * @param {Object} medewerker - The employee data object
     * @returns {Promise<string>} - URL to the profile photo
     */
    const getProfilePhotoUrl = async (username, medewerker) => {
        if (!username) return null;
        
        try {
            console.log(`getProfilePhotoUrl: Fetching photo for username "${username}"`);
            
            // Use the imported getUserInfo function to get SharePoint user data
            const userData = await getUserInfo(username);
            console.log('getProfilePhotoUrl: User data fetched:', userData);
            
            if (userData && userData.PictureURL) {
                console.log('getProfilePhotoUrl: Using PictureURL from SharePoint:', userData.PictureURL);
                return userData.PictureURL;
            }
            
            // Fallback to initials if no picture URL is available
            console.log('getProfilePhotoUrl: No PictureURL found, using initials');
            const match = medewerker && medewerker.Naam ? String(medewerker.Naam).match(/\b\w/g) : null;
            const initials = match ? match.join('') : '?';
            return `${fallbackAvatar}${initials}`;
        } catch (error) {
            console.error('Error getting profile photo URL:', error);
            
            // Fallback to initials on error
            const match = medewerker && medewerker.Naam ? String(medewerker.Naam).match(/\b\w/g) : null;
            const initials = match ? match.join('') : '?';
            return `${fallbackAvatar}${initials}`;
        }
    };

    /**
     * Get special background icon for specific users
     * @param {string} username - The employee's username
     * @returns {string|null} - Path to background icon or null if not applicable
     */
    const getSpecialBackgroundIcon = (username) => {
        if (!username) return null;
        
        // Extract username part from domain\username format (if applicable)
        let normalizedUsername;
        if (username.includes('\\')) {
            normalizedUsername = username.split('\\')[1].toLowerCase();
        } else if (username.includes('@')) {
            normalizedUsername = username.split('@')[0].toLowerCase();
        } else {
            normalizedUsername = username.toLowerCase();
        }
            
        console.log(`Checking for special background for normalized username: "${normalizedUsername}"`);
        
        // Support both "org\busselw" and just "busselw" formats
        // Map of usernames to special icons
        const specialUsers = {
            'busselw': 'roboy.svg',
            'schaikh': 'Hitteschild.svg',
            'tuiln': 'Queen.svg',
            'wittem1': 'Thankyou.svg',
            'nijburgc': 'yeehaw.svg',
            'schieved': 'Queen.svg',
            'biermanl': 'Thankyou.svg'
            // Add more special users here as needed
            // 'username': 'iconname.svg',
        };
        
        // Check if this user should have a special background
        const iconName = specialUsers[normalizedUsername];
        if (!iconName) {
            console.log(`No special background defined for "${normalizedUsername}"`);
            return null;
        }
        
        // Get base URL for icons
        let siteUrl;
        if (window.appConfiguratie && window.appConfiguratie.instellingen && window.appConfiguratie.instellingen.siteUrl) {
            siteUrl = window.appConfiguratie.instellingen.siteUrl;
        } else {
            siteUrl = 'https://som.org.om.local/sites/MulderT/CustomPW/Verlof';
        }
        
        // Use absolute fallback if needed
        const iconUrl = siteUrl ? 
            `${siteUrl}/cpw/Rooster/icons/profilecards/${iconName}` : 
            `https://som.org.om.local/sites/MulderT/CustomPW/Verlof/cpw/Rooster/icons/profilecards/${iconName}`;
            
        console.log(`Special background icon found for "${normalizedUsername}": "${iconUrl}"`);
        return iconUrl;
    };

    /**
     * Format time for display
     * @param {string} time - Time in HH:MM format
     * @returns {string} - Formatted time
     */
    const formatTime = (time) => {
        if (!time) return '-';
        return time;
    };

    /**
     * Get day type display text
     * @param {string} type - Day type code
     * @returns {string} - Human-readable day type
     */
    const getDayTypeDisplay = (type) => {
        switch (type) {
            case 'VVD': return 'Vrij';
            case 'VVO': return 'Ochtend vrij';
            case 'VVM': return 'Middag vrij';
            case 'Normaal': return 'Werkdag';
            default: return type || '-';
        }
    };

    /**
     * Get CSS class for day type
     * @param {string} type - Day type code
     * @returns {string} - CSS class name
     */
    const getDayTypeClass = (type) => {
        switch (type) {
            case 'VVD': return 'day-type-vvd';
            case 'VVO': return 'day-type-vvo';
            case 'VVM': return 'day-type-vvm';
            case 'Normaal': return 'day-type-normaal';
            default: return '';
        }
    };

    /**
     * Create the profile card component
     * @param {Object} medewerker - Employee data
     * @param {Object} werkrooster - Working hours data
     * @param {Object} teamLeader - Team leader data
     * @param {Object} senior - Senior data
     * @returns {HTMLElement} - The card element
     */
    const createProfileCard = (medewerker, werkrooster, teamLeader, senior) => {
        if (!medewerker) return null;
        
        // Get base URL for icons
        let siteUrl;
        if (window.appConfiguratie && window.appConfiguratie.instellingen && window.appConfiguratie.instellingen.siteUrl) {
            siteUrl = window.appConfiguratie.instellingen.siteUrl;
            console.log('Using siteUrl from appConfiguratie:', siteUrl);
        } else {
            siteUrl = 'https://som.org.om.local/sites/MulderT/CustomPW/Verlof';
            console.log('Using hardcoded siteUrl:', siteUrl);
        }
        
        const iconBasePath = `${siteUrl}/cpw/Rooster/icons/profilecards`;
        console.log('Icon base path:', iconBasePath);

        // Use initials as placeholder until the photo is loaded
        const match = medewerker.Naam ? String(medewerker.Naam).match(/\b\w/g) : null;
        const initials = match ? match.join('') : '?';
        const initialPhotoUrl = `${fallbackAvatar}${initials}`;

        // Check if this user should have a special background
        const specialBackground = getSpecialBackgroundIcon(medewerker.Username);
        console.log(`Special background for ${medewerker.Username}: ${specialBackground || 'none'}`);
        const headerStyle = specialBackground ? {
            position: 'relative',
            overflow: 'hidden'
        } : {};

        return h('div', { className: 'profile-card' },
            h('div', { 
                className: 'profile-card-header',
                style: headerStyle
            },
                // Add special background if applicable
                specialBackground && h('div', {
                    style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${specialBackground})`,
                        backgroundSize: 'contain', // Changed from 'cover' to 'contain'
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        opacity: '0.3',
                        zIndex: '0',
                        transform: 'scale(1.5)', // Increased from 1.2 to 1.5 for better centering
                        pointerEvents: 'none'
                    },
                    ref: (div) => {
                        if (div) {
                            // Create an image element to check if the background loads properly
                            const img = new Image();
                            img.onerror = () => {
                                console.error(`Failed to load special background image: ${specialBackground}`);
                                // If image fails to load, hide the background div
                                if (div) div.style.display = 'none';
                            };
                            img.src = specialBackground;
                        }
                    }
                }),
                h('div', { 
                    className: 'profile-card-avatar',
                    style: specialBackground ? { position: 'relative', zIndex: '1' } : {}
                },
                    h('img', {
                        src: initialPhotoUrl, // Start with initials placeholder
                        alt: medewerker.Title || medewerker.Naam,
                        ref: async (img) => {
                            if (img) {
                                // Load the real photo asynchronously
                                try {
                                    const photoUrl = await getProfilePhotoUrl(medewerker.Username, medewerker);
                                    if (photoUrl && img.src !== photoUrl) {
                                        img.src = photoUrl;
                                    }
                                } catch (error) {
                                    console.error('Failed to load profile photo:', error);
                                    img.src = `${iconBasePath}/roboy.svg`;
                                }
                            }
                        },
                        onError: (e) => {
                            console.warn('Failed to load profile photo, using fallback');
                            e.target.src = `${iconBasePath}/roboy.svg`;
                        }
                    })
                ),
                h('div', { 
                    className: 'profile-card-info',
                    style: specialBackground ? { position: 'relative', zIndex: '1' } : {}
                },
                    h('div', { className: 'profile-card-name' }, medewerker.Naam || medewerker.Title || 'Onbekend'),
                    // Check if this person is the senior or team leader themselves
                    (() => {
                        const isSenior = senior && (
                            (senior.seniorInfo?.Username === medewerker.Username) ||
                            (senior.seniorInfo?.Naam === medewerker.Naam) ||
                            (senior.seniorInfo?.Title === medewerker.Naam)
                        );
                        const isTeamLeader = teamLeader && (
                            (teamLeader.Username === medewerker.Username) ||
                            (teamLeader.Naam === medewerker.Naam) ||
                            (teamLeader.Title === medewerker.Naam)
                        );
                        
                        // Style the function based on their role
                        let functionStyle = {};
                        if (isSenior) {
                            functionStyle = {
                                backgroundColor: '#ff8c00',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                display: 'inline-block'
                            };
                        } else if (isTeamLeader) {
                            functionStyle = {
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                display: 'inline-block'
                            };
                        }
                        
                        return h('div', { 
                            className: 'profile-card-function',
                            style: Object.keys(functionStyle).length > 0 ? functionStyle : {}
                        }, medewerker.Functie || '-');
                    })(),
                    // Only show team leader if this person is NOT the team leader themselves
                    teamLeader && !(
                        (teamLeader.Username === medewerker.Username) ||
                        (teamLeader.Naam === medewerker.Naam) ||
                        (teamLeader.Title === medewerker.Naam)
                    ) && h('div', { 
                        className: 'profile-card-team-leader',
                        style: { 
                            fontSize: '0.85rem', 
                            color: '#333',
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }
                    }, 
                        h('span', { 
                            style: { 
                                fontSize: '0.8rem',
                                backgroundColor: '#ff8c00',
                                color: 'white',
                                padding: '1px 4px',
                                borderRadius: '3px',
                                fontWeight: 'bold'
                            }
                        }, 'TL'),
                        `${teamLeader.Title || teamLeader.Naam || teamLeader.Username}`
                    ),
                    // Only show senior if this person is NOT the senior themselves
                    senior && !(
                        (senior.seniorInfo?.Username === medewerker.Username) ||
                        (senior.seniorInfo?.Naam === medewerker.Naam) ||
                        (senior.seniorInfo?.Title === medewerker.Naam)
                    ) && h('div', { 
                        className: 'profile-card-senior',
                        style: { 
                            fontSize: '0.85rem', 
                            color: '#333',
                            marginTop: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }
                    }, 
                        h('span', { 
                            style: { 
                                fontSize: '0.8rem',
                                backgroundColor: '#ff8c00',
                                color: 'white',
                                padding: '1px 4px',
                                borderRadius: '3px',
                                fontWeight: 'bold'
                            }
                        }, 'SR'),
                        `${senior.naam || senior.seniorInfo?.Naam || 'Onbekende senior'}`
                    ),
                    h('div', { className: 'profile-card-email' }, 
                        h('a', { 
                            href: `mailto:${medewerker.E_x002d_mail || ''}`,
                            title: medewerker.E_x002d_mail || 'Geen e-mail beschikbaar'
                        }, medewerker.E_x002d_mail || '-')
                    ),
                    h('div', { className: 'profile-card-hearing' },
                        'Horen: ',
                        h('img', {
                            className: 'profile-card-hearing-icon',
                            src: medewerker.Horen 
                                ? (iconBasePath && iconBasePath !== 'undefined' 
                                    ? `${iconBasePath}/horen-ja.svg` 
                                    : 'https://som.org.om.local/sites/MulderT/customPW/Verlof/cpw/Rooster/icons/profilecards/horen-ja.svg')
                                : (iconBasePath && iconBasePath !== 'undefined'
                                    ? `${iconBasePath}/horen-nee.svg`
                                    : 'https://som.org.om/local/sites/MulderT/customPW/Verlof/cpw/Rooster/icons/profilecards/horen-nee.svg'),
                            alt: medewerker.Horen ? 'Ja' : 'Nee',
                            title: medewerker.Horen ? 'Ja' : 'Nee',
                            onError: (e) => {
                                console.warn('Failed to load hearing icon, showing text instead');
                                e.target.parentNode.innerHTML = `Horen: ${medewerker.Horen ? 'Ja' : 'Nee'}`;
                            }
                        })
                    )
                )
            ),
            werkrooster && h('div', { className: 'profile-card-hours' },
                h('h3', { className: 'profile-card-hours-title' }, 'Werkrooster'),
                h('div', { className: 'profile-card-hours-grid' },
                    h('div', { className: 'day-header' },
                        h('span', null, 'Dag'),
                        h('span', null, 'Tijd'),
                        h('span', null, 'Uren'),
                        h('span', null, 'Type')
                    ),
                    h('div', { className: 'day-row' },
                        h('div', { className: 'day-name' }, 'Ma'),
                        h('div', { className: 'day-time' }, werkrooster.MaandagStart && werkrooster.MaandagEind ? 
                            `${formatTime(werkrooster.MaandagStart)} - ${formatTime(werkrooster.MaandagEind)}` : '-'),
                        h('div', { className: 'day-hours' }, werkrooster.MaandagTotaal || '-'),
                        h('div', { className: 'day-type' }, 
                            h('span', { className: `day-type-chip ${getDayTypeClass(werkrooster.MaandagSoort)}` }, 
                                getDayTypeDisplay(werkrooster.MaandagSoort))
                        )
                    ),
                    h('div', { className: 'day-row' },
                        h('div', { className: 'day-name' }, 'Di'),
                        h('div', { className: 'day-time' }, werkrooster.DinsdagStart && werkrooster.DinsdagEind ? 
                            `${formatTime(werkrooster.DinsdagStart)} - ${formatTime(werkrooster.DinsdagEind)}` : '-'),
                        h('div', { className: 'day-hours' }, werkrooster.DinsdagTotaal || '-'),
                        h('div', { className: 'day-type' }, 
                            h('span', { className: `day-type-chip ${getDayTypeClass(werkrooster.DinsdagSoort)}` }, 
                                getDayTypeDisplay(werkrooster.DinsdagSoort))
                        )
                    ),
                    h('div', { className: 'day-row' },
                        h('div', { className: 'day-name' }, 'Wo'),
                        h('div', { className: 'day-time' }, werkrooster.WoensdagStart && werkrooster.WoensdagEind ? 
                            `${formatTime(werkrooster.WoensdagStart)} - ${formatTime(werkrooster.WoensdagEind)}` : '-'),
                        h('div', { className: 'day-hours' }, werkrooster.WoensdagTotaal || '-'),
                        h('div', { className: 'day-type' }, 
                            h('span', { className: `day-type-chip ${getDayTypeClass(werkrooster.WoensdagSoort)}` }, 
                                getDayTypeDisplay(werkrooster.WoensdagSoort))
                        )
                    ),
                    h('div', { className: 'day-row' },
                        h('div', { className: 'day-name' }, 'Do'),
                        h('div', { className: 'day-time' }, werkrooster.DonderdagStart && werkrooster.DonderdagEind ? 
                            `${formatTime(werkrooster.DonderdagStart)} - ${formatTime(werkrooster.DonderdagEind)}` : '-'),
                        h('div', { className: 'day-hours' }, werkrooster.DonderdagTotaal || '-'),
                        h('div', { className: 'day-type' }, 
                            h('span', { className: `day-type-chip ${getDayTypeClass(werkrooster.DonderdagSoort)}` }, 
                                getDayTypeDisplay(werkrooster.DonderdagSoort))
                        )
                    ),
                    h('div', { className: 'day-row' },
                        h('div', { className: 'day-name' }, 'Vr'),
                        h('div', { className: 'day-time' }, werkrooster.VrijdagStart && werkrooster.VrijdagEind ? 
                            `${formatTime(werkrooster.VrijdagStart)} - ${formatTime(werkrooster.VrijdagEind)}` : '-'),
                        h('div', { className: 'day-hours' }, werkrooster.VrijdagTotaal || '-'),
                        h('div', { className: 'day-type' }, 
                            h('span', { className: `day-type-chip ${getDayTypeClass(werkrooster.VrijdagSoort)}` }, 
                                getDayTypeDisplay(werkrooster.VrijdagSoort))
                        )
                    )
                )
            )
        );
    };

    /**
     * Show profile card on hover
     * @param {Event} event - The mouse event
     * @param {string} username - The employee's username
     * @param {HTMLElement} targetElement - The element that triggered the hover
     */
    const showProfileCard = async (event, username, targetElement) => {
        console.log(`ProfielKaarten: Showing card for username "${username}"`);
        
        if (cardTimeout) {
            clearTimeout(cardTimeout);
            cardTimeout = null;
        }
        
        // Remove any existing card
        hideProfileCard();
        
        // If the targetElement is not provided or no longer in DOM, use the event target
        const element = targetElement || event.currentTarget;
        if (!element || !document.body.contains(element)) {
            console.warn(`ProfielKaarten: Target element is no longer in the DOM for "${username}"`);
            return;
        }
        
        // Fetch data
        console.log(`ProfielKaarten: Fetching medewerker data for "${username}"`);
        const medewerkerData = await fetchMedewerkerData(username);
        if (!medewerkerData) {
            console.warn(`ProfielKaarten: No medewerker data found for "${username}"`);
            return;
        }
        
        // Check again if element is still in DOM after async operation
        if (!document.body.contains(element)) {
            console.warn(`ProfielKaarten: Target element was removed during data fetch for "${username}"`);
            return;
        }
        
        console.log(`ProfielKaarten: Fetching werkrooster data for "${medewerkerData.Username}"`);
        const werkroosterData = await fetchWerkroosterData(medewerkerData.Username);
        
        console.log(`ProfielKaarten: Fetching team leader data for "${medewerkerData.Username}"`);
        const teamLeaderData = await fetchTeamLeaderData(medewerkerData.Username);
        
        console.log(`ProfielKaarten: Fetching senior data for "${medewerkerData.Username}"`);
        const seniorData = await fetchSeniorData(medewerkerData.Username);
        
        console.log('ProfielKaarten: Data fetched:', { 
            medewerker: medewerkerData, 
            werkrooster: werkroosterData, 
            teamLeader: teamLeaderData,
            senior: seniorData
        });
        
        // Create card element
        const cardElement = createProfileCard(medewerkerData, werkroosterData, teamLeaderData, seniorData);
        if (!cardElement) {
            console.warn(`ProfielKaarten: Failed to create card for "${username}"`);
            return;
        }
        
        // Check again if element is still in DOM
        if (!document.body.contains(element)) {
            console.warn(`ProfielKaarten: Target element was removed during render for "${username}"`);
            return;
        }
        
        // Get position
        const rect = element.getBoundingClientRect();
        const cardContainer = document.createElement('div');
        cardContainer.id = 'profile-card-container';
        cardContainer.style.position = 'fixed'; // Use fixed positioning instead of absolute
        cardContainer.style.zIndex = '9999';
        
        // Position the card
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Render the card to get its dimensions
        ReactDOM.render(cardElement, cardContainer);
        document.body.appendChild(cardContainer);
        
        const cardRect = cardContainer.getBoundingClientRect();
        
        // Adjust position to ensure the card is fully visible
        let top = rect.bottom;
        let left = rect.left;
        
        // If card would extend below viewport, position it above the element
        if (top + cardRect.height > viewportHeight) {
            top = rect.top - cardRect.height;
        }
        
        // If card would extend beyond right edge, align right edge with viewport
        if (left + cardRect.width > viewportWidth) {
            left = viewportWidth - cardRect.width - 10;
        }
        
        cardContainer.style.top = `${top}px`;
        cardContainer.style.left = `${left}px`;
        
        console.log(`ProfielKaarten: Card positioned at top:${top}px, left:${left}px`);
        
        // Add mouse events to the card itself
        cardContainer.addEventListener('mouseenter', () => {
            if (cardTimeout) {
                clearTimeout(cardTimeout);
                cardTimeout = null;
            }
        });
        
        cardContainer.addEventListener('mouseleave', () => {
            cardTimeout = setTimeout(hideProfileCard, 300);
        });
        
        activeCard = cardContainer;
    };

    /**
     * Hide the active profile card
     */
    const hideProfileCard = () => {
        if (activeCard) {
            try {
                // Safely unmount React component
                ReactDOM.unmountComponentAtNode(activeCard);
                
                // Remove the element if it's still in the DOM
                if (document.body.contains(activeCard)) {
                    activeCard.remove();
                }
            } catch (error) {
                console.error('Error while hiding profile card:', error);
            }
            
            activeCard = null;
        }
    };

    /**
     * Apply profile card hover behavior to elements
     * @param {string} selector - CSS selector for elements to apply hover behavior to
     */
    const init = (selector = '.medewerker-naam, .medewerker-avatar') => {
        console.log(`ProfielKaarten: Initializing with selector "${selector}"`);
        
        // Apply immediately for existing elements
        applyProfileCardHover();
        
        // Set up a mutation observer to watch for changes and reapply as needed
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    applyProfileCardHover();
                }
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        /**
         * Apply profile card hover behavior to matching elements
         */
        function applyProfileCardHover() {
            const elements = document.querySelectorAll(selector);
            console.log(`ProfielKaarten: Found ${elements.length} elements matching "${selector}"`);
            
            elements.forEach(element => {
                // Skip if already initialized
                if (element.dataset.profileCardInitialized) return;
                
                const username = element.dataset.username;
                if (!username) {
                    console.log('ProfielKaarten: Element missing data-username attribute', element);
                    return;
                }
                
                console.log(`ProfielKaarten: Adding hover behavior to element for username "${username}"`);
                
                element.addEventListener('mouseenter', (event) => {
                    // Store a reference to the element
                    const targetElement = event.currentTarget;
                    
                    // Clear any existing timeout
                    if (cardTimeout) {
                        clearTimeout(cardTimeout);
                    }
                    
                    // Set a delay before showing the card
                    cardTimeout = setTimeout(async () => {
                        try {
                            // First, verify the element is still in the DOM
                            if (!document.body.contains(targetElement)) {
                                console.warn('Target element no longer in DOM');
                                return;
                            }
                            
                            // Create a placeholder div for the card immediately
                            const cardContainer = document.createElement('div');
                            cardContainer.id = 'profile-card-container';
                            cardContainer.style.position = 'fixed';
                            cardContainer.style.zIndex = '9999';
                            cardContainer.innerHTML = '<div class="profile-card-loading">Loading...</div>';
                            document.body.appendChild(cardContainer);
                            
                            // Position it near the target element
                            const rect = targetElement.getBoundingClientRect();
                            cardContainer.style.top = `${rect.bottom + 5}px`;
                            cardContainer.style.left = `${rect.left}px`;
                            
                            // Set as active card
                            if (activeCard) {
                                hideProfileCard();
                            }
                            activeCard = cardContainer;
                            
                            // Add mouse events to the card itself
                            cardContainer.addEventListener('mouseenter', () => {
                                if (cardTimeout) {
                                    clearTimeout(cardTimeout);
                                    cardTimeout = null;
                                }
                            });
                            
                            cardContainer.addEventListener('mouseleave', () => {
                                cardTimeout = setTimeout(hideProfileCard, 300);
                            });
                            
                            // Now fetch data asynchronously
                            console.log(`Fetching medewerker data for username: "${username}"`);
                            const medewerkerData = await fetchMedewerkerData(username);
                            console.log('Medewerker data received:', medewerkerData);
                            
                            if (!medewerkerData) {
                                console.warn(`No medewerker data found for "${username}"`);
                                return hideProfileCard();
                            }
                            
                            console.log(`Fetching werkrooster data for: "${medewerkerData.Username}"`);
                            const werkroosterData = await fetchWerkroosterData(medewerkerData.Username);
                            console.log('Werkrooster data received:', werkroosterData);
                            
                            console.log(`Fetching team leader data for: "${medewerkerData.Username}"`);
                            const teamLeaderData = await fetchTeamLeaderData(medewerkerData.Username);
                            console.log('Team leader data received:', teamLeaderData);
                            
                            console.log(`Fetching senior data for: "${medewerkerData.Username}"`);
                            const seniorData = await fetchSeniorData(medewerkerData.Username);
                            console.log('Senior data received:', seniorData);
                            
                            // Check if card is still active after async operations
                            if (activeCard !== cardContainer) {
                                console.log('Card was hidden during data fetch');
                                return;
                            }
                            
                            // Create the actual card content
                            const cardElement = createProfileCard(medewerkerData, werkroosterData, teamLeaderData, seniorData);
                            if (!cardElement) {
                                console.warn(`Failed to create card for "${username}"`);
                                return hideProfileCard();
                            }
                            
                            // Render the content into our container
                            ReactDOM.render(cardElement, cardContainer);
                            
                            // Reposition the card now that we know its size
                            const cardRect = cardContainer.getBoundingClientRect();
                            const viewportHeight = window.innerHeight;
                            const viewportWidth = window.innerWidth;
                            
                            let top = rect.bottom + 5;
                            let left = rect.left;
                            
                            // If card would extend below viewport, position it above the element
                            if (top + cardRect.height > viewportHeight) {
                                top = rect.top - cardRect.height - 5;
                            }
                            
                            // If card would extend beyond right edge, align right edge with viewport
                            if (left + cardRect.width > viewportWidth) {
                                left = viewportWidth - cardRect.width - 10;
                            }
                            
                            cardContainer.style.top = `${top}px`;
                            cardContainer.style.left = `${left}px`;
                            
                        } catch (error) {
                            console.error('Error showing profile card:', error);
                            hideProfileCard();
                        }
                    }, 500);
                });
                
                element.addEventListener('mouseleave', () => {
                    if (cardTimeout) {
                        clearTimeout(cardTimeout);
                        cardTimeout = null;
                    }
                    
                    cardTimeout = setTimeout(hideProfileCard, 300);
                });
                
                // Mark as initialized
                element.dataset.profileCardInitialized = 'true';
            });
        }
    };

    // Public API
    return {
        init,
        hideProfileCard
    };
})();

// Initialize the profile cards when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing ProfielKaarten...');
    ProfielKaarten.init();
});

export default ProfielKaarten;