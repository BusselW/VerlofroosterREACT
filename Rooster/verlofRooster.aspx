<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verlofrooster</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- CSS bestanden -->
    <link href="css/verlofrooster_stijl.css" rel="stylesheet">
    <link href="css/verlofrooster_styling.css" rel="stylesheet">
    <link rel="icon" href="data:," />

    <!-- React en configuratie bestanden -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="js/config/configLijst.js"></script>

</head>

<body>
    <div id="root"></div>

    <!-- Hoofd script van de applicatie, nu als module om 'import' te gebruiken -->
    <script type="module">
        // Importeer de benodigde componenten en functies
        import MedewerkerRow from './js/ui/userinfo.js';
        import { fetchSharePointList, getUserInfo, getCurrentUser, createSharePointListItem, updateSharePointListItem, deleteSharePointListItem, trimLoginNaamPrefix } from './js/services/sharepointService.js';
        import { getCurrentUserGroups, isUserInAnyGroup } from './js/services/permissionService.js';
        import * as linkInfo from './js/services/linkInfo.js';
        import ContextMenu, { canManageOthersEvents, canUserModifyItem } from './js/ui/ContextMenu.js';
        import FAB from './js/ui/FloatingActionButton.js';
        import Modal from './js/ui/Modal.js';
        import DagCell, { renderCompensatieMomenten } from './js/ui/dagCell.js';
        import VerlofAanvraagForm from './js/ui/forms/VerlofAanvraagForm.js';
        import CompensatieUrenForm from './js/ui/forms/CompensatieUrenForm.js';
        import ZiekteMeldingForm from './js/ui/forms/ZiekteMeldingForm.js';
        import ZittingsvrijForm from './js/ui/forms/ZittingsvrijForm.js';
        import { roosterTutorial } from './js/tutorial/roosterTutorial.js';
        import { renderHorenStatus, getHorenStatus, filterMedewerkersByHorenStatus } from './js/ui/horen.js';
        import TooltipManager from './js/ui/tooltipbar.js';
        import ProfielKaarten from './js/ui/profielkaarten.js';


        const { useState, useEffect, useMemo, useCallback, createElement: h, Fragment } = React;

        // Initialize tooltip manager as soon as the script runs
        TooltipManager.init();

        // Hulpfuncties voor datum en tijd
        const maandNamenVolledig = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
        const getPasen = (jaar) => {
            const a = jaar % 19; const b = Math.floor(jaar / 100); const c = jaar % 100; const d = Math.floor(b / 4); const e = b % 4; const f = Math.floor((b + 8) / 25); const g = Math.floor((b - f + 1) / 3); const h = (19 * a + b - d - g + 15) % 30; const i = Math.floor(c / 4); const k = c % 4; const l = (32 + 2 * e + 2 * i - h - k) % 7; const m = Math.floor((a + 11 * h + 22 * l) / 451); const maand = Math.floor((h + l - 7 * m + 114) / 31); const dag = ((h + l - 7 * m + 114) % 31) + 1; return new Date(jaar, maand - 1, dag);
        };
        const getFeestdagen = (jaar) => {
            const pasen = getPasen(jaar); const feestdagenMap = {}; const voegFeestdagToe = (datum, naam) => { const key = datum.toISOString().split('T')[0]; feestdagenMap[key] = naam; }; voegFeestdagToe(new Date(jaar, 0, 1), 'Nieuwjaarsdag'); voegFeestdagToe(new Date(pasen.getTime() - 2 * 24 * 3600 * 1000), 'Goede Vrijdag'); voegFeestdagToe(pasen, 'Eerste Paasdag'); voegFeestdagToe(new Date(pasen.getTime() + 1 * 24 * 3600 * 1000), 'Tweede Paasdag'); voegFeestdagToe(new Date(jaar, 3, 27), 'Koningsdag'); voegFeestdagToe(new Date(jaar, 4, 5), 'Bevrijdingsdag'); voegFeestdagToe(new Date(pasen.getTime() + 39 * 24 * 3600 * 1000), 'Hemelvaartsdag'); voegFeestdagToe(new Date(pasen.getTime() + 49 * 24 * 3600 * 1000), 'Eerste Pinksterdag'); voegFeestdagToe(new Date(pasen.getTime() + 50 * 24 * 3600 * 1000), 'Tweede Pinksterdag'); voegFeestdagToe(new Date(jaar, 11, 25), 'Eerste Kerstdag'); voegFeestdagToe(new Date(jaar, 11, 26), 'Tweede Kerstdag'); return feestdagenMap;
        };
        const getWeekNummer = (datum) => {
            const doelDatum = new Date(datum.getTime()); const dagVanWeek = (doelDatum.getDay() + 6) % 7; doelDatum.setDate(doelDatum.getDate() - dagVanWeek + 3); const eersteJanuari = new Date(doelDatum.getFullYear(), 0, 1); return Math.ceil(((doelDatum.getTime() - eersteJanuari.getTime()) / 604800000) + 1);
        };
        const getWekenInJaar = (jaar) => {
            const laatste31Dec = new Date(jaar, 11, 31); const weekNummer = getWeekNummer(laatste31Dec); return weekNummer === 1 ? 52 : weekNummer;
        };
        const getDagenInMaand = (maand, jaar) => {
            const dagen = [];
            const laatstedag = new Date(jaar, maand + 1, 0);
            for (let i = 1; i <= laatstedag.getDate(); i++) {
                dagen.push(new Date(jaar, maand, i));
            }
            return dagen;
        };
        // Format the date to show day name and number
        function formatteerDatum(datum) {
            // Get day name based on index
            let dagNaam;
            switch (datum.getDay()) {
                case 0: dagNaam = "Zo"; break;
                case 1: dagNaam = "Ma"; break;
                case 2: dagNaam = "Di"; break;
                case 3: dagNaam = "Wo"; break;
                case 4: dagNaam = "Do"; break;
                case 5: dagNaam = "Vr"; break;
                case 6: dagNaam = "Za"; break;
                default: dagNaam = "";
            }

            return {
                dagNaam: dagNaam,
                dagNummer: datum.getDate()
            };
        }
        const getInitialen = (naam) => {
            if (!naam) return ''; return naam.split(' ').filter(d => d.length > 0).map(d => d[0]).join('').toUpperCase().slice(0, 2);
        };

        // Helper to get profile photo URL
        const getProfilePhotoUrl = (gebruiker, grootte = 'M') => {
            const loginName = gebruiker?.Username || gebruiker?.LoginName;
            if (!loginName) return null;
            
            // Extract username from domain\username format
            const usernameOnly = loginName.includes('\\') ? loginName.split('\\')[1] : loginName;
            
            // Construct URL to SharePoint profile photo
            const siteUrl = appConfiguratie?.instellingen?.siteUrl || '';
            return `${siteUrl}/_layouts/15/userphoto.aspx?size=${grootte}&accountname=${usernameOnly}@org.om.local`;
        };

        const getDagenInWeek = (weekNummer, jaar) => {
            const dagen = [];
            const eersteJanuari = new Date(jaar, 0, 1);
            const dagVanWeek = (eersteJanuari.getDay() + 6) % 7; // Maandag = 0

            // Bereken de datum van de eerste maandag van het jaar
            const eersteMaandag = new Date(jaar, 0, 1 - dagVanWeek + (dagVanWeek === 0 ? 0 : 7));

            // Bereken de startdatum van de gewenste week
            const startVanWeek = new Date(eersteMaandag);
            startVanWeek.setDate(startVanWeek.getDate() + (weekNummer - 1) * 7);

            // Voeg 7 dagen toe voor de week (maandag t/m vrijdag voor werkdagen)
            for (let i = 0; i < 7; i++) {
                const dag = new Date(startVanWeek);
                dag.setDate(dag.getDate() + i);
                dagen.push(dag);
            }

            return dagen;
        };

        const isVandaag = (datum) => {
            const vandaag = new Date();
            const datumCheck = new Date(datum);
            return datumCheck.getDate() === vandaag.getDate() &&
                datumCheck.getMonth() === vandaag.getMonth() &&
                datumCheck.getFullYear() === vandaag.getFullYear();
        };

        // =====================
        // Interactive Tutorial is now handled by roosterTutorial.js
        // =====================

        // =====================
        // Permission-based Navigation Component
        // =====================
        const NavigationButtons = () => {
            const [userPermissions, setUserPermissions] = useState({
                isAdmin: false,
                isFunctional: false,
                isTaakbeheer: false,
                loading: true
            });

            const [userInfo, setUserInfo] = useState({
                naam: '',
                pictureUrl: '',
                loading: true,
                teamLeader: null,
                teamLeaderLoading: true
            });

            const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

            useEffect(() => {
                const loadUserData = async () => {
                    try {
                        // Load permissions
                        const adminGroups = ["1. Sharepoint beheer", "1.1. Mulder MT"];
                        const functionalGroups = ["1. Sharepoint beheer", "1.1. Mulder MT", "2.6 Roosteraars"];
                        const taakbeheerGroups = ["1. Sharepoint beheer", "1.1. Mulder MT", "2.6 Roosteraars", "2.3. Senioren beoordelen", "2.4. Senioren administratie"];

                        const [isAdmin, isFunctional, isTaakbeheer] = await Promise.all([
                            isUserInAnyGroup(adminGroups),
                            isUserInAnyGroup(functionalGroups),
                            isUserInAnyGroup(taakbeheerGroups)
                        ]);

                        setUserPermissions({
                            isAdmin,
                            isFunctional,
                            isTaakbeheer,
                            loading: false
                        });

                        // Load user info
                        const currentUser = await getCurrentUser();
                        if (currentUser) {
                            // Get medewerker naam from Medewerkers list
                            const medewerkers = await fetchSharePointList('Medewerkers');
                            const medewerker = medewerkers.find(m =>
                                m.MedewerkerID && currentUser.LoginName &&
                                m.MedewerkerID.toLowerCase().includes(currentUser.LoginName.split('|')[1]?.toLowerCase())
                            );

                            setUserInfo({
                                naam: medewerker?.Naam || currentUser.Title || 'Gebruiker',
                                pictureUrl: currentUser.PictureURL || 'https://via.placeholder.com/32x32/6c757d/ffffff?text=U',
                                loading: false,
                                teamLeaderLoading: true,
                                teamLeader: null
                            });
                            
                            // Get team leader info
                            try {
                                if (medewerker && medewerker.Username) {
                                    const teamLeader = await linkInfo.getTeamLeaderForEmployee(medewerker.Username);
                                    if (teamLeader) {
                                        setUserInfo(prevState => ({
                                            ...prevState,
                                            teamLeader: teamLeader.Title || teamLeader.Naam || teamLeader.Username,
                                            teamLeaderLoading: false
                                        }));
                                    } else {
                                        setUserInfo(prevState => ({
                                            ...prevState,
                                            teamLeaderLoading: false
                                        }));
                                    }
                                }
                            } catch (error) {
                                console.error('Error loading team leader info:', error);
                                setUserInfo(prevState => ({
                                    ...prevState,
                                    teamLeaderLoading: false
                                }));
                            }
                        } else {
                            setUserInfo({
                                naam: 'Gebruiker',
                                pictureUrl: 'https://via.placeholder.com/32x32/6c757d/ffffff?text=U',
                                loading: false
                            });
                        }

                        console.log('User data loaded:', { permissions: { isAdmin, isFunctional, isTaakbeheer }, userInfo });

                        // Debug: Log current user and medewerkers for troubleshooting
                        console.log('DEBUG - Current user details:', {
                            LoginName: currentUser?.LoginName,
                            Title: currentUser?.Title,
                            Email: currentUser?.Email
                        });

                    } catch (error) {
                        console.error('Error loading user data:', error);
                        setUserPermissions(prev => ({ ...prev, loading: false }));
                        setUserInfo({
                            naam: 'Gebruiker',
                            pictureUrl: 'https://via.placeholder.com/32x32/6c757d/ffffff?text=U',
                            loading: false
                        });
                    }
                };

                loadUserData();
            }, []);

            // Close dropdown when clicking outside
            useEffect(() => {
                const handleClickOutside = (event) => {
                    if (settingsDropdownOpen && !event.target.closest('.user-dropdown')) {
                        setSettingsDropdownOpen(false);
                    }
                };

                document.addEventListener('click', handleClickOutside);
                return () => document.removeEventListener('click', handleClickOutside);
            }, [settingsDropdownOpen]);

            // Position dropdown correctly when it opens
            useEffect(() => {
                if (settingsDropdownOpen) {
                    // Give time for the DOM to update
                    setTimeout(() => {
                        const dropdownButton = document.querySelector('.user-settings-btn');
                        const dropdownMenu = document.querySelector('.user-dropdown-menu');
                        
                        if (dropdownButton && dropdownMenu) {
                            const buttonRect = dropdownButton.getBoundingClientRect();
                            
                            // Position the dropdown below the button
                            dropdownMenu.style.top = `${buttonRect.bottom + 8}px`;
                            dropdownMenu.style.right = `${window.innerWidth - buttonRect.right}px`;
                        }
                    }, 10);
                }
            }, [settingsDropdownOpen]);

            const navigateTo = (page) => {
                window.location.href = `pages/${page}`;
            };

            if (userPermissions.loading || userInfo.loading) {
                return null; // Don't show buttons while loading
            }

            return h('div', { className: 'navigation-buttons' },
                // Right side navigation buttons
                h('div', { id: 'nav-buttons-right', className: 'nav-buttons-right' },
                    // Admin button - Visible to FullAccess (Admin)
                    userPermissions.isAdmin && h('button', {
                        className: 'btn btn-admin',
                        onClick: () => navigateTo('adminCentrum.aspx'),
                        title: 'Administratie Centrum'
                    },
                        h('i', { className: 'fas fa-cog' }),
                        'Admin'
                    ),

                    // Beheer button - Visible to Functional (beheer)
                    userPermissions.isFunctional && h('button', {
                        className: 'btn btn-functional',
                        onClick: () => navigateTo('beheerCentrum.aspx'),
                        title: 'Beheer Centrum'
                    },
                        h('i', { className: 'fas fa-tools' }),
                        'Beheer'
                    ),

                    // Behandelen button - Visible to Taakbeheer
                    userPermissions.isTaakbeheer && h('button', {
                        className: 'btn btn-taakbeheer',
                        onClick: () => navigateTo('behandelCentrum.aspx'),
                        title: 'Behandel Centrum'
                    },
                        h('i', { className: 'fas fa-tasks' }),
                        'Behandelen'
                    ),

                    // Tour button - Start interactive tutorial
                    h('button', {
                        className: 'btn btn-tour',
                        onClick: () => window.startTutorial && window.startTutorial(),
                        title: 'Start interactieve tour'
                    },
                        h('i', { className: 'fas fa-question-circle' }),
                        'Tour'
                    ),

                    // User Settings Dropdown - Visible to everyone
                    h('div', { id: 'user-dropdown', className: 'user-dropdown' },
                        h('button', {
                            className: 'btn btn-settings user-settings-btn',
                            onClick: () => setSettingsDropdownOpen(!settingsDropdownOpen),
                            title: 'Gebruikersinstellingen'
                        },
                            h('img', {
                                className: 'user-avatar-small',
                                src: userInfo.pictureUrl,
                                alt: userInfo.naam,
                                onError: (e) => {
                                    e.target.src = 'https://via.placeholder.com/32x32/6c757d/ffffff?text=U';
                                }
                            }),
                            h('span', { className: 'user-name' }, userInfo.naam),
                            userInfo.teamLeader && h('span', { 
                                className: 'user-teamleader',
                                style: {
                                    fontSize: '0.7rem',
                                    color: '#b0b0b0',
                                    display: 'block',
                                    lineHeight: '1',
                                    position: 'absolute',
                                    bottom: '3px',
                                    left: '40px'
                                },
                                title: `Uw teamleider is ${userInfo.teamLeader}`
                            }, `TL: ${userInfo.teamLeader}`),
                            h('i', {
                                className: `fas fa-chevron-${settingsDropdownOpen ? 'up' : 'down'}`,
                                style: { fontSize: '0.8rem', marginLeft: '0.5rem' }
                            })
                        ),

                        // Dropdown menu
                        settingsDropdownOpen && h('div', { className: 'user-dropdown-menu' },
                            h('div', { className: 'dropdown-item-group' },
                                h('button', {
                                    className: 'dropdown-item',
                                    onClick: () => {
                                        navigateTo('gInstellingen.aspx');
                                        setSettingsDropdownOpen(false);
                                    }
                                },
                                    h('i', { className: 'fas fa-user-edit' }),
                                    h('div', { className: 'dropdown-item-content' },
                                        h('span', { className: 'dropdown-item-title' }, 'Persoonlijke gegevens & Werkdagen'),
                                        h('span', { className: 'dropdown-item-description' }, 'Beheer uw profiel en werkrooster')
                                    )
                                ),
                                h('button', {
                                    className: 'dropdown-item',
                                    onClick: () => {
                                        navigateTo('gInstellingen.aspx#instellingen');
                                        setSettingsDropdownOpen(false);
                                    }
                                },
                                    h('i', { className: 'fas fa-cog' }),
                                    h('div', { className: 'dropdown-item-content' },
                                        h('span', { className: 'dropdown-item-title' }, 'Rooster instellingen'),
                                        h('span', { className: 'dropdown-item-description' }, 'Configureer weergave voorkeuren')
                                    )
                                )
                            )
                        )
                    )
                )
            );
        };

        // =====================
        // Error Boundary (Ongewijzigd)
        // =====================
        class ErrorBoundary extends React.Component {
            constructor(props) { super(props); this.state = { hasError: false, error: null }; }
            static getDerivedStateFromError(error) { return { hasError: true, error }; }
            componentDidCatch(error, errorInfo) { console.error('Error Boundary gevangen fout:', error, errorInfo); }
            render() { if (this.state.hasError) { return h('div', { className: 'error-message' }, h('h2', null, 'Er is een onverwachte fout opgetreden'), h('p', null, 'Probeer de pagina te vernieuwen.'), h('details', null, h('summary', null, 'Technische details'), h('pre', null, this.state.error?.message || 'Onbekende fout'))); } return this.props.children; }
        }

        // =====================
        // User Registration Check Component
        // =====================
        const UserRegistrationCheck = ({ onUserValidated }) => {
            const [isChecking, setIsChecking] = useState(true);
            const [isRegistered, setIsRegistered] = useState(false);
            const [currentUser, setCurrentUser] = useState(null);

            useEffect(() => {
                checkUserRegistration();
            }, []);

            const checkUserRegistration = async () => {
                try {
                    setIsChecking(true);

                    // Get current user from SharePoint
                    const user = await getCurrentUser();
                    console.log('Current user from SharePoint:', user);

                    if (!user) {
                        throw new Error('Kan huidige gebruiker niet ophalen');
                    }

                    setCurrentUser(user);

                    // Format the username for comparison (domain\username format)
                    let userLoginName = user.LoginName;

                    // Remove claim prefix if present (i:0#.w|domain\username -> domain\username)
                    if (userLoginName.startsWith('i:0#.w|')) {
                        userLoginName = userLoginName.substring(7);
                    }

                    console.log('Formatted login name for comparison:', userLoginName);

                    // Fetch Medewerkers list to check if user exists
                    const medewerkers = await fetchSharePointList('Medewerkers');
                    console.log('Total medewerkers found:', medewerkers.length);
                    console.log('Sample medewerkers data:', medewerkers.slice(0, 3).map(m => ({
                        ID: m.ID,
                        Username: m.Username,
                        Naam: m.Naam,
                        Actief: m.Actief
                    })));

                    // Check if user exists in Medewerkers list
                    const userExists = medewerkers.some(medewerker => {
                        const medewerkersUsername = medewerker.Username;

                        // Skip inactive users
                        if (medewerker.Actief === false) {
                            return false;
                        }

                        console.log(`Comparing: "${userLoginName}" with "${medewerkersUsername}"`);

                        // Direct comparison
                        if (medewerkersUsername === userLoginName) {
                            console.log('✓ Direct match found!');
                            return true;
                        }

                        // Try with just the username part (after domain\)
                        const trimmedLoginName = trimLoginNaamPrefix(userLoginName);
                        const trimmedMedewerkersName = trimLoginNaamPrefix(medewerkersUsername);

                        if (trimmedMedewerkersName === trimmedLoginName) {
                            console.log('✓ Trimmed username match found!');
                            return true;
                        }

                        // Try case insensitive comparison
                        if (medewerkersUsername && medewerkersUsername.toLowerCase() === userLoginName.toLowerCase()) {
                            console.log('✓ Case insensitive match found!');
                            return true;
                        }

                        return false;
                    });

                    console.log('User exists in Medewerkers list:', userExists);

                    setIsRegistered(userExists);

                    if (userExists) {
                        // User is registered, continue to main app
                        onUserValidated(true);
                    }

                } catch (error) {
                    console.error('Error checking user registration:', error);
                    setIsRegistered(false);
                } finally {
                    setIsChecking(false);
                }
            };

            const redirectToRegistration = () => {
                window.location.href = 'pages/registratie.aspx';
            };

            if (isChecking) {
                return h('div', {
                    className: 'flex items-center justify-center min-h-screen bg-gray-50',
                    style: { fontFamily: 'Inter, sans-serif' }
                },
                    h('div', { className: 'text-center' },
                        h('div', { className: 'loading-spinner', style: { margin: '0 auto 16px' } }),
                        h('h2', { className: 'text-xl font-medium text-gray-900' }, 'Gebruiker valideren...'),
                        h('p', { className: 'text-gray-600 mt-2' }, 'Even geduld, we controleren uw toegangsrechten.')
                    )
                );
            }

            if (!isRegistered) {
                return h('div', {
                    className: 'flex items-center justify-center min-h-screen bg-gray-50',
                    style: { fontFamily: 'Inter, sans-serif' }
                },
                    h('div', { className: 'max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center' },
                        h('div', { className: 'mb-6' },
                            h('div', {
                                className: 'mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4'
                            },
                                h('i', { className: 'fas fa-exclamation-triangle text-yellow-600' })
                            ),
                            h('h2', { className: 'text-xl font-semibold text-gray-900 mb-2' }, 'Registratie Vereist'),
                            h('p', { className: 'text-gray-600' },
                                `Uw account (${currentUser?.Title || 'onbekend'}) is nog niet geregistreerd in het verlofrooster systeem.`
                            )
                        ),
                        h('div', { className: 'space-y-4' },
                            h('p', { className: 'text-sm text-gray-500' },
                                'Om toegang te krijgen tot het verlofrooster, moet u eerst uw profiel instellen en registreren in het systeem.'
                            ),
                            h('button', {
                                className: 'w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200',
                                onClick: redirectToRegistration
                            },
                                h('i', { className: 'fas fa-user-plus mr-2' }),
                                'Ga naar Registratie'
                            ),
                            h('button', {
                                className: 'w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 mt-2',
                                onClick: checkUserRegistration
                            },
                                h('i', { className: 'fas fa-sync-alt mr-2' }),
                                'Opnieuw Controleren'
                            ),
                            h('div', { className: 'mt-4 pt-4 border-t border-gray-200' },
                                h('p', { className: 'text-xs text-gray-400 mb-2' },
                                    'Heeft u al toegang tot het oude systeem?'
                                ),
                                h('a', {
                                    href: '../index.html',
                                    className: 'text-xs text-blue-600 hover:text-blue-800 transition duration-200'
                                },
                                    'Ga naar het oude verlofrooster systeem'
                                )
                            )
                        ),
                        currentUser && h('div', { className: 'mt-6 pt-6 border-t border-gray-200' },
                            h('p', { className: 'text-xs text-gray-400' },
                                `Gebruiker: ${currentUser.LoginName}`
                            )
                        )
                    )
                );
            }

            return null; // User is registered, don't render anything
        };

        // =====================
        // Hoofd RoosterApp Component
        // =====================
        const RoosterApp = () => {
            const [isUserValidated, setIsUserValidated] = useState(false);
            const [weergaveType, setWeergaveType] = useState('maand');
            const [huidigJaar, setHuidigJaar] = useState(new Date().getFullYear());
            const [huidigMaand, setHuidigMaand] = useState(new Date().getMonth());
            const [medewerkers, setMedewerkers] = useState([]);
            const [teams, setTeams] = useState([]);
            const [shiftTypes, setShiftTypes] = useState({});
            const [verlofItems, setVerlofItems] = useState([]);
            const [feestdagen, setFeestdagen] = useState({});
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);
            const [huidigWeek, setHuidigWeek] = useState(getWeekNummer(new Date()));
            const [zoekTerm, setZoekTerm] = useState('');
            const [geselecteerdTeam, setGeselecteerdTeam] = useState('');
            const [zittingsvrijItems, setZittingsvrijItems] = useState([]);
            const [compensatieUrenItems, setCompensatieUrenItems] = useState([]);
            const [urenPerWeekItems, setUrenPerWeekItems] = useState([]);
            const [dagenIndicators, setDagenIndicators] = useState({});
            const [contextMenu, setContextMenu] = useState(null);
            const [currentUser, setCurrentUser] = useState(null);
            const [isVerlofModalOpen, setIsVerlofModalOpen] = useState(false);
            const [isCompensatieModalOpen, setIsCompensatieModalOpen] = useState(false);
            const [isZiekModalOpen, setIsZiekModalOpen] = useState(false);
            const [isZittingsvrijModalOpen, setIsZittingsvrijModalOpen] = useState(false);

            // Debug modal state changes
            useEffect(() => {
                console.log('🏠 Modal state changed:', {
                    compensatie: isCompensatieModalOpen,
                    zittingsvrij: isZittingsvrijModalOpen,
                    verlof: isVerlofModalOpen,
                    ziek: isZiekModalOpen
                });
            }, [isCompensatieModalOpen, isZittingsvrijModalOpen, isVerlofModalOpen, isZiekModalOpen]);
            const [selection, setSelection] = useState(null);
            const [showTooltip, setShowTooltip] = useState(false);
            const [tooltipTimeout, setTooltipTimeout] = useState(null);
            const [firstClickData, setFirstClickData] = useState(null);
            
            // Initialize the tooltip manager when the component mounts
            useEffect(() => {
                // Make sure TooltipManager is initialized
                console.log('🔍 Initializing TooltipManager from RoosterApp');
                TooltipManager.init();
            }, []);
            
            // Initialize profile cards after data is loaded
            useEffect(() => {
                if (!loading && medewerkers.length > 0) {
                    console.log('🔍 Initializing ProfielKaarten from RoosterApp');
                    setTimeout(() => {
                        ProfielKaarten.init('.medewerker-naam, .medewerker-avatar');
                    }, 500); // Small delay to ensure DOM is ready
                }
            }, [loading, medewerkers]);

            // Check if required services are available
            useEffect(() => {
                if (typeof fetchSharePointList !== 'function' || typeof getCurrentUser !== 'function') {
                    setError('Required services not available. Please refresh the page.');
                    setLoading(false);
                }
            }, []);

            // Expose tutorial functions globally
            useEffect(() => {
                if (isUserValidated) {
                    window.startTutorial = () => {
                        roosterTutorial.start();
                    };

                    document.addEventListener('tutorial-completed', () => {
                        console.log('Tutorial completed');
                    }, { once: true });

                    return () => {
                        delete window.startTutorial;
                    };
                }
            }, [isUserValidated]);

            // Functies voor het openen van de modals
            const handleVrijvragen = useCallback((start, end, medewerkerId) => {
                console.log('handleVrijvragen called:', { start, end, medewerkerId });
                setSelection({ start, end, medewerkerId });
                setIsVerlofModalOpen(true);
            }, []);

            const handleZiekMelden = useCallback((start, end, medewerkerId) => {
                console.log('handleZiekMelden called:', { start, end, medewerkerId });
                setSelection({ start, end, medewerkerId });
                setIsZiekModalOpen(true);
            }, []);

            const handleCompensatie = useCallback((start, end, medewerkerId) => {
                console.log('handleCompensatie called:', { start, end, medewerkerId });
                setSelection({ start, end, medewerkerId });
                setIsCompensatieModalOpen(true);
            }, []);

            const handleZittingsvrij = useCallback((start, end, medewerkerId) => {
                console.log('handleZittingsvrij called:', { start, end, medewerkerId });
                setSelection({ start, end, medewerkerId });
                setIsZittingsvrijModalOpen(true);
            }, []);

            // Calendar cell click handler with two-click selection support
            function handleCellClick(medewerker, dag, specificItem = null) {
                // If a specific item is provided (e.g., compensatie item), open the appropriate modal directly
                if (specificItem) {
                    console.log('Opening modal for specific item:', specificItem);
                    const { type } = (() => {
                        if ('RedenId' in specificItem) return { type: 'verlof' };
                        if ('ZittingsVrijeDagTijd' in specificItem) return { type: 'zittingsvrij' };
                        if ('StartCompensatieUren' in specificItem) return { type: 'compensatie' };
                        if ('Status' in specificItem && specificItem.Status === 'Ziek') return { type: 'ziekte' };
                        return { type: null };
                    })();

                    const targetMedewerker = medewerkers.find(m => m.Username === medewerker.Username);

                    if (type === 'compensatie') {
                        setSelection({
                            start: new Date(specificItem.StartCompensatieUren),
                            end: new Date(specificItem.EindeCompensatieUren),
                            medewerkerId: specificItem.MedewerkerID,
                            itemData: specificItem,
                            medewerkerData: targetMedewerker
                        });
                        setIsCompensatieModalOpen(true);
                        return;
                    } else if (type === 'verlof') {
                        setSelection({
                            start: new Date(specificItem.StartDatum),
                            end: new Date(specificItem.EindDatum),
                            medewerkerId: specificItem.MedewerkerID,
                            itemData: specificItem,
                            medewerkerData: targetMedewerker
                        });
                        setIsVerlofModalOpen(true);
                        return;
                    } else if (type === 'zittingsvrij') {
                        setSelection({
                            start: new Date(specificItem.StartDatum),
                            end: new Date(specificItem.EindDatum),
                            medewerkerId: specificItem.Gebruikersnaam,
                            itemData: specificItem,
                            medewerkerData: targetMedewerker
                        });
                        setIsZittingsvrijModalOpen(true);
                        return;
                    } else if (type === 'ziekte') {
                        setSelection({
                            start: new Date(specificItem.StartDatum),
                            end: new Date(specificItem.EindDatum),
                            medewerkerId: specificItem.MedewerkerID,
                            itemData: specificItem,
                            medewerkerData: targetMedewerker
                        });
                        setIsZiekModalOpen(true);
                        return;
                    }
                }

                // Regular cell click behavior (date range selection)
                if (!firstClickData) {
                    // First click: Set start of selection
                    setFirstClickData({ medewerker, dag });
                    setSelection({ start: dag, end: dag, medewerkerId: medewerker.Username });

                    // Show tooltip after first click
                    setShowTooltip(true);

                    // Auto-hide tooltip after 5 seconds
                    if (tooltipTimeout) {
                        clearTimeout(tooltipTimeout);
                    }

                    const timeout = setTimeout(() => {
                        setShowTooltip(false);
                    }, 5000);
                    setTooltipTimeout(timeout);

                } else if (firstClickData.medewerker.Username === medewerker.Username) {
                    // Second click on same employee: Set end of selection
                    const startDate = new Date(firstClickData.dag);
                    const endDate = new Date(dag);
                    const actualStart = startDate <= endDate ? startDate : endDate;
                    const actualEnd = startDate <= endDate ? endDate : startDate;

                    setSelection({
                        start: actualStart,
                        end: actualEnd,
                        medewerkerId: medewerker.Username
                    });
                    setFirstClickData(null); // Reset for next selection
                    setShowTooltip(false); // Hide tooltip after selection is complete

                    if (tooltipTimeout) {
                        clearTimeout(tooltipTimeout);
                        setTooltipTimeout(null);
                    }
                } else {
                    // Click on different employee: Start new selection
                    setFirstClickData({ medewerker, dag });
                    setSelection({ start: dag, end: dag, medewerkerId: medewerker.Username });

                    // Show tooltip for this new selection too
                    setShowTooltip(true);

                    // Auto-hide tooltip after 5 seconds
                    if (tooltipTimeout) {
                        clearTimeout(tooltipTimeout);
                    }

                    const timeout = setTimeout(() => {
                        setShowTooltip(false);
                    }, 5000);
                    setTooltipTimeout(timeout);
                }
            }

            // Context menu handler
            async function showContextMenu(e, medewerker, dag, item) {
                console.log('showContextMenu called:', {
                    medewerker: medewerker?.Username,
                    dag: dag.toDateString(),
                    item: item?.ID,
                    hasItem: !!item,
                    itemType: item ? Object.keys(item).filter(key => ['RedenId', 'StartCompensatieUren', 'ZittingsVrijeDagTijd'].includes(key)) : 'none'
                });

                // Additional debugging: check what compensatie items exist for this day
                const debugCompensatieItems = getCompensatieUrenVoorDag(medewerker.Username, dag);
                if (debugCompensatieItems.length > 0) {
                    console.log(`Found ${debugCompensatieItems.length} compensatie items for ${medewerker.Username} on ${dag.toDateString()}:`, debugCompensatieItems);
                }

                // Helper to determine item type and list
                function getItemTypeAndList(item) {
                    if (!item) return { type: null, list: null };

                    console.log('getItemTypeAndList called with item:', item);

                    if ('RedenId' in item) {
                        console.log('Detected verlof item');
                        return { type: 'verlof', list: 'Verlof' };
                    }
                    if ('ZittingsVrijeDagTijd' in item) {
                        console.log('Detected zittingsvrij item');
                        return { type: 'zittingsvrij', list: 'IncidenteelZittingVrij' };
                    }
                    if ('StartCompensatieUren' in item) {
                        console.log('Detected compensatie item');
                        return { type: 'compensatie', list: 'CompensatieUren' };
                    }
                    if ('Status' in item && item.Status === 'Ziek') {
                        console.log('Detected ziekte item');
                        return { type: 'ziekte', list: 'Verlof' };
                    }

                    console.log('No item type detected, item keys:', Object.keys(item));
                    return { type: null, list: null };
                }

                // Check if this is a direct compensatie item click
                const { type: itemType } = getItemTypeAndList(item);
                const isDirectCompensatieClick = itemType === 'compensatie';

                const menuItems = [
                    {
                        label: 'Nieuw',
                        icon: 'fa-plus',
                        subItems: [
                            {
                                label: 'Verlof aanvragen',
                                icon: 'fa-calendar-plus',
                                onClick: () => {
                                    console.log('Verlof aanvragen clicked');
                                    // Use selected date range if available, otherwise use clicked day
                                    const startDate = selection && selection.medewerkerId === medewerker.Username ? selection.start : dag;
                                    const endDate = selection && selection.medewerkerId === medewerker.Username ? selection.end : dag;
                                    const targetMedewerker = medewerkers.find(m => m.Username === medewerker.Username);

                                    setSelection({
                                        start: startDate,
                                        end: endDate,
                                        medewerkerId: medewerker.Username,
                                        medewerkerData: targetMedewerker
                                    });
                                    setIsVerlofModalOpen(true);
                                    setContextMenu(null);
                                }
                            },
                            {
                                label: 'Ziek melden',
                                icon: 'fa-notes-medical',
                                onClick: () => {
                                    console.log('Ziek melden clicked');
                                    // Use selected date range if available, otherwise use clicked day
                                    const startDate = selection && selection.medewerkerId === medewerker.Username ? selection.start : dag;
                                    const endDate = selection && selection.medewerkerId === medewerker.Username ? selection.end : dag;
                                    const targetMedewerker = medewerkers.find(m => m.Username === medewerker.Username);

                                    setSelection({
                                        start: startDate,
                                        end: endDate,
                                        medewerkerId: medewerker.Username,
                                        medewerkerData: targetMedewerker
                                    });
                                    setIsZiekModalOpen(true);
                                    setContextMenu(null);
                                }
                            },
                            {
                                label: 'Compensatieuren doorgeven',
                                icon: './icons/compensatieuren/neutraleuren.svg',
                                iconType: 'svg',
                                onClick: () => {
                                    console.log('📝 Context menu: Compensatieuren doorgeven clicked');
                                    // Use selected date range if available, otherwise use clicked day
                                    const startDate = selection && selection.medewerkerId === medewerker.Username ? selection.start : dag;
                                    const endDate = selection && selection.medewerkerId === medewerker.Username ? selection.end : dag;
                                    const targetMedewerker = medewerkers.find(m => m.Username === medewerker.Username);

                                    setSelection({
                                        start: startDate,
                                        end: endDate,
                                        medewerkerId: medewerker.Username,
                                        medewerkerData: targetMedewerker
                                    });
                                    console.log('📝 Opening compensatie modal...');
                                    setIsCompensatieModalOpen(true);
                                    setContextMenu(null);
                                }
                            },
                            {
                                label: 'Zittingsvrij maken',
                                icon: 'fa-gavel',
                                onClick: () => {
                                    console.log('🔵 Context menu: Zittingsvrij maken clicked');
                                    console.log('🔵 Current selection:', selection);
                                    console.log('🔵 Current modal states before:', {
                                        compensatie: isCompensatieModalOpen,
                                        zittingsvrij: isZittingsvrijModalOpen,
                                        verlof: isVerlofModalOpen,
                                        ziek: isZiekModalOpen
                                    });

                                    // Use selected date range if available, otherwise use clicked day
                                    const startDate = selection && selection.medewerkerId === medewerker.Username ? selection.start : dag;
                                    const endDate = selection && selection.medewerkerId === medewerker.Username ? selection.end : dag;
                                    const targetMedewerker = medewerkers.find(m => m.Username === medewerker.Username);

                                    setSelection({
                                        start: startDate,
                                        end: endDate,
                                        medewerkerId: medewerker.Username,
                                        medewerkerData: targetMedewerker
                                    });
                                    console.log('🔵 Opening zittingsvrij modal ONLY...');
                                    setIsZittingsvrijModalOpen(true);
                                    setContextMenu(null);
                                }
                                // Removed requiredGroups - now everyone can see this option
                            }
                        ]
                    }
                ];

                // Check for compensatie uren items on this day, but only show submenu if this wasn't a direct compensatie click
                const compensatieItemsForDay = getCompensatieUrenVoorDag(medewerker.Username, dag);
                if (compensatieItemsForDay.length > 0 && !isDirectCompensatieClick) {
                    console.log(`Found ${compensatieItemsForDay.length} compensatie items, checking permissions...`);

                    // Check if user has permission to modify ANY of the compensatie items
                    const currentUsername = currentUser?.LoginName?.split('|')[1] || currentUser?.LoginName;
                    const hasPrivilegedAccess = await canManageOthersEvents();

                    const modifiableItems = compensatieItemsForDay.filter(compItem => {
                        const itemOwner = compItem.MedewerkerID;
                        const isOwnItem = itemOwner === currentUsername;
                        return isOwnItem || hasPrivilegedAccess;
                    });

                    console.log(`User can modify ${modifiableItems.length} out of ${compensatieItemsForDay.length} compensatie items`);

                    // Only show submenu if user can modify at least one compensatie item
                    if (modifiableItems.length > 0) {
                        console.log(`Adding compensatie uren submenu for ${modifiableItems.length} modifiable items`);

                        // Add a submenu for compensatie uren items (only the ones user can modify)
                        const compensatieSubItems = modifiableItems.map((compItem, index) => {
                            const startDate = new Date(compItem.StartCompensatieUren);
                            const endDate = new Date(compItem.EindeCompensatieUren);
                            const description = compItem.Omschrijving || `Compensatie uren ${index + 1}`;

                            return {
                                label: `${description} (${startDate.toLocaleDateString()})`,
                                icon: 'fa-edit',
                                onClick: async () => {
                                    console.log('Compensatie item selected from submenu:', compItem);

                                    // Check permissions for this specific compensatie item
                                    const currentUsername = currentUser?.LoginName?.split('|')[1] || currentUser?.LoginName;
                                    const itemOwner = compItem.MedewerkerID;
                                    const isOwnItem = itemOwner === currentUsername;
                                    const hasPrivilegedAccess = await canManageOthersEvents();
                                    const canModify = isOwnItem || hasPrivilegedAccess;

                                    if (canModify) {
                                        // Open edit modal for this compensatie item
                                        const targetMedewerker = medewerkers.find(m => m.Username === compItem.MedewerkerID);
                                        setSelection({
                                            start: startDate,
                                            end: endDate,
                                            medewerkerId: compItem.MedewerkerID,
                                            itemData: compItem,
                                            medewerkerData: targetMedewerker
                                        });
                                        setIsCompensatieModalOpen(true);
                                    } else {
                                        alert('Je hebt geen rechten om dit item te bewerken.');
                                    }
                                    setContextMenu(null);
                                }
                            };
                        });

                        // Add delete submenu for compensatie uren (only for modifiable items)
                        const deleteSubItems = modifiableItems.map((compItem, index) => {
                            const description = compItem.Omschrijving || `Compensatie uren ${index + 1}`;

                            return {
                                label: `${description}`,
                                icon: 'fa-trash',
                                onClick: async () => {
                                    console.log('Delete compensatie item selected:', compItem);

                                    // Double-check permissions for this specific compensatie item
                                    const currentUsername = currentUser?.LoginName?.split('|')[1] || currentUser?.LoginName;
                                    const itemOwner = compItem.MedewerkerID;
                                    const isOwnItem = itemOwner === currentUsername;
                                    const hasPrivilegedAccess = await canManageOthersEvents();
                                    const canModify = isOwnItem || hasPrivilegedAccess;

                                    if (canModify) {
                                        if (confirm(`Weet je zeker dat je "${description}" wilt verwijderen?`)) {
                                            try {
                                                await deleteSharePointListItem('CompensatieUren', compItem.ID);
                                                refreshData();
                                            } catch (err) {
                                                console.error('Error deleting compensatie item:', err);
                                                alert('Fout bij verwijderen: ' + err.message);
                                            }
                                        }
                                    } else {
                                        alert('Je hebt geen rechten om dit item te verwijderen.');
                                    }
                                    setContextMenu(null);
                                }
                            };
                        });

                        // Add compensatie uren management submenu (only show count of modifiable items)
                        menuItems.push({
                            label: `Compensatie Uren (${modifiableItems.length})`,
                            icon: './icons/compensatieuren/neutraleuren.svg',
                            iconType: 'svg',
                            subItems: [
                                {
                                    label: 'Bewerken',
                                    icon: 'fa-edit',
                                    subItems: compensatieSubItems
                                },
                                {
                                    label: 'Verwijderen',
                                    icon: 'fa-trash',
                                    subItems: deleteSubItems
                                }
                            ]
                        });
                    }
                }
                    // Only add edit/delete/comment options if there's a primary item (verlof/zittingsvrij)
                    if (item) {
                        console.log('Adding edit/delete/comment options for item:', item);

                        // Check if user can modify this item
                        const currentUsername = currentUser?.LoginName?.split('|')[1] || currentUser?.LoginName;
                        const itemOwner = item.MedewerkerID || item.Gebruikersnaam;

                        // If currentUser is not available yet, skip permission check for now
                        if (!currentUser || !currentUsername) {
                            console.log('Current user not available yet, skipping edit/delete options');
                        } else {
                            const isOwnItem = itemOwner === currentUsername;
                            const hasPrivilegedAccess = await canManageOthersEvents();
                            const canModify = isOwnItem || hasPrivilegedAccess;

                            console.log('Permission check:', { currentUsername, itemOwner, isOwnItem, hasPrivilegedAccess, canModify });

                            if (canModify) {
                                menuItems.push(
                                    {
                                        label: 'Bewerken',
                                        icon: 'fa-edit',
                                        onClick: () => {
                                            console.log('Bewerken clicked for item:', item);
                                            const { type } = getItemTypeAndList(item);
                                            const targetMedewerker = medewerkers.find(m =>
                                                m.Username === (type === 'zittingsvrij' ? item.Gebruikersnaam : item.MedewerkerID)
                                            );

                                            if (type === 'verlof') {
                                                setSelection({
                                                    start: new Date(item.StartDatum),
                                                    end: new Date(item.EindDatum),
                                                    medewerkerId: item.MedewerkerID,
                                                    itemData: item,
                                                    medewerkerData: targetMedewerker
                                                });
                                                setIsVerlofModalOpen(true);
                                            } else if (type === 'ziekte') {
                                                setSelection({
                                                    start: new Date(item.StartDatum),
                                                    end: new Date(item.EindDatum),
                                                    medewerkerId: item.MedewerkerID,
                                                    itemData: item,
                                                    medewerkerData: targetMedewerker
                                                });
                                                setIsZiekModalOpen(true);
                                            } else if (type === 'compensatie') {
                                                setSelection({
                                                    start: new Date(item.StartCompensatieUren),
                                                    end: new Date(item.EindeCompensatieUren),
                                                    medewerkerId: item.MedewerkerID,
                                                    itemData: item,
                                                    medewerkerData: targetMedewerker
                                                });
                                                setIsCompensatieModalOpen(true);
                                            } else if (type === 'zittingsvrij') {
                                                setSelection({
                                                    start: new Date(item.StartDatum),
                                                    end: new Date(item.EindDatum),
                                                    medewerkerId: item.Gebruikersnaam,
                                                    itemData: item,
                                                    medewerkerData: targetMedewerker
                                                });
                                                setIsZittingsvrijModalOpen(true);
                                            } else {
                                                alert('Kan dit item niet bewerken.');
                                            }
                                            setContextMenu(null);
                                        }
                                    },
                                    {
                                        label: 'Verwijderen',
                                        icon: 'fa-trash',
                                        onClick: async () => {
                                            console.log('Verwijderen clicked for item:', item);
                                            const { list } = getItemTypeAndList(item);
                                            if (!list) {
                                                alert('Kan dit item niet verwijderen.');
                                                setContextMenu(null);
                                                return;
                                            }
                                            if (confirm('Weet je zeker dat je dit item wilt verwijderen?')) {
                                                try {
                                                    await deleteSharePointListItem(list, item.ID);
                                                    refreshData();
                                                } catch (err) {
                                                    console.error('Error deleting item:', err);
                                                    alert('Fout bij verwijderen: ' + err.message);
                                                }
                                            }
                                            setContextMenu(null);
                                        }
                                    },
                                    {
                                        label: 'Commentaar aanpassen',
                                        icon: 'fa-comment-edit',
                                        onClick: async () => {
                                            console.log('Commentaar aanpassen clicked for item:', item);
                                            const { list, type } = getItemTypeAndList(item);
                                            if (!list) {
                                                alert('Kan commentaar niet aanpassen voor dit item.');
                                                setContextMenu(null);
                                                return;
                                            }
                                            let currentComment = '';
                                            if (type === 'verlof') currentComment = item.Omschrijving || '';
                                            else if (type === 'ziekte') currentComment = item.Omschrijving || '';
                                            else if (type === 'compensatie') currentComment = item.Omschrijving || '';
                                            else if (type === 'zittingsvrij') currentComment = item.Opmerking || '';
                                            else currentComment = '';
                                            const newComment = prompt('Voer nieuw commentaar in:', currentComment);
                                            if (newComment !== null) {
                                                try {
                                                    let updateObj = {};
                                                    if (type === 'zittingsvrij') updateObj = { Opmerking: newComment };
                                                    else updateObj = { Omschrijving: newComment };
                                                    await updateSharePointListItem(list, item.ID, updateObj);
                                                    refreshData();
                                                } catch (err) {
                                                    console.error('Error updating comment:', err);
                                                    alert('Fout bij opslaan van commentaar: ' + err.message);
                                                }
                                            }
                                            setContextMenu(null);
                                        }
                                    }
                                );
                            }
                        }
                    }

                    menuItems.push({
                        label: 'Annuleren',
                        icon: 'fa-times',
                        onClick: () => {
                            console.log('Annuleren clicked');
                            setContextMenu(null);
                        }
                    });

                    console.log('Final context menu items:', menuItems);
                    setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        items: menuItems,
                        onClose: () => setContextMenu(null)
                    });
                }

                // FAB handler that uses the same selection logic as ContextMenu
                // This ensures that when a user makes a selection (click 1/click 2),
                // that selection range is passed to the forms when using the FAB
                function handleZittingsvrijMaken() {
                    setSelection(null); // No preselection
                    setIsZittingsvrijModalOpen(true);
                }

                const refreshData = useCallback(async () => {
                    try {
                        console.log('🔄 Starting refreshData...');
                        setLoading(true);
                        setError(null);

                        // Wait for configuration to be available
                        if (!window.appConfiguratie) {
                            console.log('⏳ Waiting for appConfiguratie...');
                            await new Promise(r => setTimeout(r, 100));
                        }

                        // Check if fetchSharePointList is available
                        if (typeof fetchSharePointList !== 'function') {
                            throw new Error('SharePoint service not available');
                        }

                        // Fetch current user info
                        console.log('👤 Fetching current user...');
                        const userInfo = await getCurrentUser();
                        setCurrentUser(userInfo);

                        console.log('📊 Fetching SharePoint lists...');
                        const [medewerkersData, teamsData, verlofredenenData, verlofData, zittingsvrijData, compensatieUrenData, urenPerWeekData, dagenIndicatorsData] = await Promise.all([
                            fetchSharePointList('Medewerkers'),
                            fetchSharePointList('Teams'),
                            fetchSharePointList('Verlofredenen'),
                            fetchSharePointList('Verlof'),
                            fetchSharePointList('IncidenteelZittingVrij'),
                            fetchSharePointList('CompensatieUren'),
                            fetchSharePointList('UrenPerWeek'),
                            fetchSharePointList('DagenIndicators')
                        ]);

                        console.log('✅ Data fetched successfully, processing...');
                        const teamsMapped = (teamsData || []).map(item => ({ id: item.Title || item.ID?.toString(), naam: item.Naam || item.Title, kleur: item.Kleur || '#cccccc' }));
                        setTeams(teamsMapped);
                        const teamNameToIdMap = teamsMapped.reduce((acc, t) => { acc[t.naam] = t.id; return acc; }, {});
                        const transformedShiftTypes = (verlofredenenData || []).reduce((acc, item) => {
                            if (item.Title) { acc[item.ID] = { id: item.ID, label: item.Title, kleur: item.Kleur || '#999999', afkorting: item.Afkorting || '??' }; }
                            return acc;
                        }, {});
                        setShiftTypes(transformedShiftTypes);
                        const medewerkersProcessed = (medewerkersData || [])
                            .filter(item => item.Naam && item.Actief !== false)
                            .map(item => ({ ...item, id: item.ID, naam: item.Naam, team: teamNameToIdMap[item.Team] || '', Username: item.Username || null }));
                        setMedewerkers(medewerkersProcessed);
                        setVerlofItems((verlofData || []).map(v => ({ ...v, StartDatum: new Date(v.StartDatum), EindDatum: new Date(v.EindDatum) })));
                        setZittingsvrijItems((zittingsvrijData || []).map(z => ({ ...z, StartDatum: new Date(z.ZittingsVrijeDagTijd), EindDatum: new Date(z.ZittingsVrijeDagTijdEind) })));
                        setCompensatieUrenItems((compensatieUrenData || []).map(c => ({
                            ...c,
                            StartCompensatieUren: new Date(c.StartCompensatieUren),
                            EindeCompensatieUren: new Date(c.EindeCompensatieUren),
                            ruildagStart: c.ruildagStart ? new Date(c.ruildagStart) : null
                        })));
                        setUrenPerWeekItems((urenPerWeekData || []).map(u => {
                            // Normalize Ingangsdatum by properly parsing and resetting time components
                            let date;
                            
                            try {
                                // Handle Dutch date format (DD-MM-YYYY)
                                if (typeof u.Ingangsdatum === 'string' && u.Ingangsdatum.match(/^\d{1,2}-\d{1,2}-\d{4}/)) {
                                    const parts = u.Ingangsdatum.split(' ')[0].split('-');
                                    const day = parseInt(parts[0], 10);
                                    const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JS
                                    const year = parseInt(parts[2], 10);
                                    
                                    date = new Date(year, month, day);
                                } else {
                                    date = new Date(u.Ingangsdatum);
                                }
                                
                                // Check if date is valid
                                if (isNaN(date.getTime())) {
                                    console.error('Invalid date after parsing:', u.Ingangsdatum);
                                    date = null;
                                } else {
                                    // Reset time components for consistent comparison
                                    date.setHours(0, 0, 0, 0);
                                }
                            } catch (error) {
                                console.error('Error parsing date:', error, u.Ingangsdatum);
                                date = null;
                            }
                            
                            return { ...u, Ingangsdatum: date };
                        }));
                        const indicatorsMapped = (dagenIndicatorsData || []).reduce((acc, item) => {
                            if (item.Title) {
                                acc[item.Title] = { ...item, kleur: item.Kleur || '#cccccc', Beschrijving: item.Beschrijving || '' };
                            }
                            return acc;
                        }, {});
                        setDagenIndicators(indicatorsMapped);

                        console.log('✅ Data processing complete!');

                        // Debug: Log medewerkers data for troubleshooting
                        console.log('DEBUG - Loaded medewerkers:', medewerkersProcessed.slice(0, 5).map(m => ({
                            Id: m.Id,
                            Title: m.Title,
                            Username: m.Username,
                            Team: m.Team
                        })));

                    } catch (err) {
                        console.error('❌ Error in refreshData:', err);
                        setError(`Fout bij laden: ${err.message}`);
                    } finally {
                        console.log('🏁 refreshData complete, setting loading to false');
                        setLoading(false);
                    }
                }, []);

                const handleVerlofSubmit = useCallback(async (formData) => {
                    try {
                        console.log("Submitting verlof form data:", formData);
                        console.log("Detailed form data breakdown:", {
                            Title: formData.Title,
                            Medewerker: formData.Medewerker,
                            MedewerkerID: formData.MedewerkerID,
                            StartDatum: formData.StartDatum,
                            EindDatum: formData.EindDatum,
                            RedenId: formData.RedenId,
                            Omschrijving: formData.Omschrijving,
                            Status: formData.Status
                        });

                        // Validate required fields
                        if (!formData.MedewerkerID) {
                            throw new Error('MedewerkerID is required but missing');
                        }
                        if (!formData.StartDatum || !formData.EindDatum) {
                            throw new Error('Start and end dates are required');
                        }

                        const result = await createSharePointListItem('Verlof', formData);
                        console.log('Verlofaanvraag ingediend:', result);
                        setIsVerlofModalOpen(false);
                        refreshData();
                    } catch (error) {
                        console.error('Fout bij het indienen van verlofaanvraag:', error);
                        console.error('Error details:', {
                            message: error.message,
                            stack: error.stack,
                            formData: formData
                        });
                        alert('Fout bij het indienen van verlofaanvraag: ' + error.message);
                    }
                }, [refreshData]);

                const handleZiekteSubmit = useCallback(async (formData) => {
                    try {
                        console.log("Submitting ziekte form data:", formData);
                        const result = await createSharePointListItem('Verlof', formData);
                        console.log('Ziekmelding ingediend:', result);
                        setIsZiekModalOpen(false);
                        refreshData();
                    } catch (error) {
                        console.error('Fout bij het indienen van ziekmelding:', error);
                        alert('Fout bij het indienen van ziekmelding: ' + error.message);
                    }
                }, [refreshData]);

                const handleCompensatieSubmit = useCallback(async (formData) => {
                    try {
                        console.log("🟡 handleCompensatieSubmit called with data:", formData);
                        console.log("🟡 Current modal states:", {
                            isCompensatieModalOpen,
                            isZittingsvrijModalOpen,
                            isVerlofModalOpen,
                            isZiekModalOpen
                        });
                        const result = await createSharePointListItem('CompensatieUren', formData);
                        console.log('✅ Compensatie-uren ingediend successfully:', result);
                        setIsCompensatieModalOpen(false);
                        refreshData();
                    } catch (error) {
                        console.error('❌ Fout bij het indienen van compensatie-uren:', error);
                        alert('Fout bij het indienen van compensatie-uren: ' + error.message);
                    }
                }, [refreshData]);

                const handleZittingsvrijSubmit = useCallback(async (formData) => {
                    try {
                        console.log("🔵 handleZittingsvrijSubmit called with data:", formData);
                        console.log("🔵 Current modal states:", {
                            isCompensatieModalOpen,
                            isZittingsvrijModalOpen,
                            isVerlofModalOpen,
                            isZiekModalOpen
                        });
                        // Use the list name from formData if provided, otherwise default to 'IncidenteelZittingVrij'
                        const listName = formData._listName || 'IncidenteelZittingVrij';
                        delete formData._listName; // Remove this property before sending to SharePoint

                        const result = await createSharePointListItem(listName, formData);
                        console.log('✅ Zittingsvrij ingediend successfully:', result);
                        setIsZittingsvrijModalOpen(false);
                        refreshData();
                    } catch (error) {
                        console.error('❌ Fout bij het indienen van zittingsvrij:', error);
                        alert('Fout bij het indienen van zittingsvrij: ' + error.message);
                    }
                }, []);

                useEffect(() => {
                    // Only start loading data after user is validated
                    if (isUserValidated) {
                        refreshData();
                    }
                }, [refreshData, isUserValidated]);

                // Handle escape key to clear selection
                useEffect(() => {
                    const handleKeyDown = (e) => {
                        if (e.key === 'Escape') {
                            setSelection(null);
                            setFirstClickData(null);
                            setContextMenu(null);
                            setShowTooltip(false);
                        }
                    };

                    document.addEventListener('keydown', handleKeyDown);

                    return () => {
                        document.removeEventListener('keydown', handleKeyDown);
                        // Clean up tooltip timeout
                        if (tooltipTimeout) {
                            clearTimeout(tooltipTimeout);
                        }
                    };
                }, [tooltipTimeout]);

                useEffect(() => {
                    const jaren = [huidigJaar - 1, huidigJaar, huidigJaar + 1];
                    const alleFeestdagen = jaren.reduce((acc, jaar) => ({ ...acc, ...getFeestdagen(jaar) }), {});
                    setFeestdagen(alleFeestdagen);
                }, [huidigJaar]);

                const ziekteRedenId = useMemo(() => {
                    if (!shiftTypes || Object.keys(shiftTypes).length === 0) return null;
                    const ziekteType = Object.values(shiftTypes).find(st => st.label && st.label.toLowerCase() === 'ziekte');
                    return ziekteType ? ziekteType.id : null;
                }, [shiftTypes]);

                const urenPerWeekByMedewerker = useMemo(() => {
                    const map = {};
                    
                    // Filter out items with invalid dates first
                    const validItems = urenPerWeekItems.filter(item => 
                        item.Ingangsdatum instanceof Date && !isNaN(item.Ingangsdatum.getTime())
                    );
                    
                    // Group items by medewerker
                    for (const item of validItems) {
                        if (!map[item.MedewerkerID]) {
                            map[item.MedewerkerID] = [];
                        }
                        map[item.MedewerkerID].push(item);
                    }
                    
                    // Sort each employee's records by Ingangsdatum (newest first)
                    // This is just for organizing the initial data - the actual selection
                    // logic is in getUrenPerWeekForDate
                    for (const medewerkerId in map) {
                        map[medewerkerId].sort((a, b) => b.Ingangsdatum - a.Ingangsdatum);
                    }
                    
                    return map;
                }, [urenPerWeekItems]);

                const getUrenPerWeekForDate = useCallback((medewerkerId, date) => {
                    const schedules = urenPerWeekByMedewerker[medewerkerId];
                    if (!schedules) return null;
                    
                    // Normalize the input date for proper comparison
                    let normalizedDate;
                    try {
                        normalizedDate = new Date(date);
                        normalizedDate.setHours(0, 0, 0, 0);
                    } catch (error) {
                        console.error('Error normalizing date in getUrenPerWeekForDate:', error, date);
                        return null;
                    }
                    
                    // Sort the applicable records by Ingangsdatum (newest first)
                    // We need to find the most recent record where Ingangsdatum <= target date
                    const applicableRecords = schedules
                        .filter(s => {
                            // Ensure valid date object
                            if (!(s.Ingangsdatum instanceof Date) || isNaN(s.Ingangsdatum.getTime())) {
                                console.warn(`Invalid Ingangsdatum for record ID ${s.Id} for medewerker ${medewerkerId}:`, s.Ingangsdatum);
                                return false;
                            }
                            // Only include records where Ingangsdatum is on or before our target date
                            const isApplicable = s.Ingangsdatum <= normalizedDate;
                            if (medewerkerId.toLowerCase().includes('rauf') && Math.random() < 0.01) {  // Only log occasionally for Rauf
                                console.log(`UrenPerWeek comparison for ${medewerkerId} on ${normalizedDate.toLocaleDateString()}:`, 
                                    `Record ID ${s.Id} with date ${s.Ingangsdatum.toLocaleDateString()} is ${isApplicable ? 'applicable' : 'not applicable'}`);
                            }
                            return isApplicable;
                        })
                        .sort((a, b) => b.Ingangsdatum - a.Ingangsdatum);
                    
                    // Return the first applicable record (most recent one that applies)
                    const selectedRecord = applicableRecords.length > 0 ? applicableRecords[0] : null;
                    
                    // Debug logging for Rauf to help diagnose the issue
                    if (medewerkerId.toLowerCase().includes('rauf') && Math.random() < 0.01) {  // Only log occasionally
                        if (selectedRecord) {
                            console.log(`✅ Selected UrenPerWeek record for ${medewerkerId} on ${normalizedDate.toLocaleDateString()}: Record ID ${selectedRecord.Id} from ${selectedRecord.Ingangsdatum.toLocaleDateString()}`);
                        } else {
                            console.log(`⚠️ No applicable UrenPerWeek record found for ${medewerkerId} on ${normalizedDate.toLocaleDateString()}`);
                        }
                    }
                    
                    return selectedRecord;
                }, [urenPerWeekByMedewerker]);

                const compensatieMomentenByDate = useMemo(() => {
                    const moments = {};
                    const addMoment = (date, type, item) => {
                        if (!date || isNaN(date)) return; // Skip invalid dates
                        // Extract date part as UTC to avoid timezone conversion issues
                        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                        const key = utcDate.toISOString().split('T')[0];
                        if (!moments[key]) {
                            moments[key] = [];
                        }
                        moments[key].push({ type, item });
                    };

                    compensatieUrenItems.forEach(item => {
                        if (item.Ruildag === true) {
                            addMoment(item.StartCompensatieUren, 'ruildag-gewerkt', item);
                            if (item.ruildagStart) {
                                addMoment(item.ruildagStart, 'ruildag-vrij', item);
                            }
                        } else {
                            addMoment(item.StartCompensatieUren, 'compensatie', item);
                        }
                    });
                    return moments;
                }, [compensatieUrenItems]);

                const getCompensatieMomentenVoorDag = useCallback((datum) => {
                    // Use the same UTC date key format as addMoment function to ensure consistency
                    const utcDate = new Date(Date.UTC(datum.getFullYear(), datum.getMonth(), datum.getDate()));
                    const key = utcDate.toISOString().split('T')[0];
                    return compensatieMomentenByDate[key] || [];
                }, [compensatieMomentenByDate]);

                const checkIsFeestdag = useCallback((datum) => feestdagen[datum.toISOString().split('T')[0]], [feestdagen]);
                const getVerlofVoorDag = useCallback((medewerkerUsername, datum) => {
                    if (!medewerkerUsername) return null;
                    const datumCheck = new Date(datum).setHours(12, 0, 0, 0);
                    return verlofItems.find(v => v.MedewerkerID === medewerkerUsername && v.Status !== 'Afgewezen' && datumCheck >= new Date(v.StartDatum).setHours(12, 0, 0, 0) && datumCheck <= new Date(v.EindDatum).setHours(12, 0, 0, 0));
                }, [verlofItems]);
                const getZittingsvrijVoorDag = useCallback((medewerkerUsername, datum) => {
                    if (!medewerkerUsername) return null;
                    const datumCheck = new Date(datum).setHours(12, 0, 0, 0);
                    return zittingsvrijItems.find(z => z.Gebruikersnaam === medewerkerUsername && datumCheck >= new Date(z.StartDatum).setHours(12, 0, 0, 0) && datumCheck <= new Date(z.EindDatum).setHours(12, 0, 0, 0));
                }, [zittingsvrijItems]);

                const getCompensatieUrenVoorDag = useCallback((medewerkerUsername, dag) => {
                    if (!medewerkerUsername || !compensatieUrenItems || compensatieUrenItems.length === 0) {
                        return [];
                    }

                    // Normalize the calendar day to a UTC start and end for accurate comparison
                    const dagStartUTC = new Date(Date.UTC(dag.getFullYear(), dag.getMonth(), dag.getDate(), 0, 0, 0));
                    const dagEindUTC = new Date(Date.UTC(dag.getFullYear(), dag.getMonth(), dag.getDate(), 23, 59, 59));

                    return compensatieUrenItems.filter(item => {
                        if (item.MedewerkerID !== medewerkerUsername) {
                            return false;
                        }

                        // Parse SharePoint dates directly as Date objects (they are already in UTC)
                        const startCompensatie = new Date(item.StartCompensatieUren);
                        const eindeCompensatie = new Date(item.EindeCompensatieUren);

                        // Check if the compensation period overlaps with the current day (in UTC)
                        return startCompensatie <= dagEindUTC && eindeCompensatie >= dagStartUTC;
                    });
                }, [compensatieUrenItems]);

                const periodeData = useMemo(() => {
                    return weergaveType === 'week' ? getDagenInWeek(huidigWeek, huidigJaar) : getDagenInMaand(huidigMaand, huidigJaar);
                }, [weergaveType, huidigWeek, huidigMaand, huidigJaar]);

                const volgende = () => { if (weergaveType === 'week') { const maxWeken = getWekenInJaar(huidigJaar); if (huidigWeek >= maxWeken) { setHuidigWeek(1); setHuidigJaar(huidigJaar + 1); } else { setHuidigWeek(huidigWeek + 1); } } else { if (huidigMaand === 11) { setHuidigMaand(0); setHuidigJaar(huidigJaar + 1); } else { setHuidigMaand(huidigMaand + 1); } } };
                const vorige = () => { if (weergaveType === 'week') { if (huidigWeek === 1) { const vorigJaar = huidigJaar - 1; setHuidigWeek(getWekenInJaar(vorigJaar)); setHuidigJaar(vorigJaar); } else { setHuidigWeek(huidigWeek - 1); } } else { if (huidigMaand === 0) { setHuidigMaand(11); setHuidigJaar(huidigJaar - 1); } else { setHuidigMaand(huidigMaand - 1); } } };

                const gegroepeerdeData = useMemo(() => {
                    const gefilterdeMedewerkers = medewerkers.filter(m => (!zoekTerm || m.naam.toLowerCase().includes(zoekTerm.toLowerCase())) && (!geselecteerdTeam || m.team === geselecteerdTeam));
                    const data = teams.reduce((acc, team) => { if (team && team.id) { acc[team.id] = gefilterdeMedewerkers.filter(m => m.team === team.id); } return acc; }, {});
                    const medewerkersZonderTeam = gefilterdeMedewerkers.filter(m => !m.team);
                    if (medewerkersZonderTeam.length > 0) { data['geen_team'] = medewerkersZonderTeam; }
                    return data;
                }, [medewerkers, teams, zoekTerm, geselecteerdTeam]);

                // =====================
                // Helper: Check if a date is in the current selection for a medewerker
                // =====================
                function isDateInSelection(dag, medewerkerUsername) {
                    if (!selection || !selection.start || !selection.end || !selection.medewerkerId) return false;
                    // Only highlight if the medewerker matches
                    if (medewerkerUsername !== selection.medewerkerId) return false;
                    // Compare only the date part (ignore time)
                    const d = new Date(dag);
                    d.setHours(0, 0, 0, 0);
                    const s = new Date(selection.start);
                    s.setHours(0, 0, 0, 0);
                    const e = new Date(selection.end);
                    e.setHours(0, 0, 0, 0);
                    return d >= s && d <= e;
                }

                // Show user validation check first
                if (!isUserValidated) {
                    return h(UserRegistrationCheck, { onUserValidated: setIsUserValidated });
                }

                // Show loading state while refreshing data
                if (loading) {
                    return h('div', {
                        className: 'flex items-center justify-center min-h-screen bg-gray-50',
                        style: { fontFamily: 'Inter, sans-serif' }
                    },
                        h('div', { className: 'text-center' },
                            h('div', { className: 'loading-spinner', style: { margin: '0 auto 16px' } }),
                            h('h2', { className: 'text-xl font-medium text-gray-900' }, 'Rooster wordt geladen...'),
                            h('p', { className: 'text-gray-600 mt-2' }, 'Even geduld, we laden de roostergegevens.')
                        )
                    );
                }

                // Show error state if there's an error
                if (error) {
                    return h('div', {
                        className: 'flex items-center justify-center min-h-screen bg-gray-50',
                        style: { fontFamily: 'Inter, sans-serif' }
                    },
                        h('div', { className: 'max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center' },
                            h('div', { className: 'mb-6' },
                                h('div', {
                                    className: 'mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4'
                                },
                                    h('i', { className: 'fas fa-exclamation-triangle text-red-600' })
                                ),
                                h('h2', { className: 'text-xl font-semibold text-gray-900 mb-2' }, 'Fout bij laden'),
                                h('p', { className: 'text-gray-600' }, error)
                            ),
                            h('button', {
                                className: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200',
                                onClick: () => window.location.reload()
                            },
                                h('i', { className: 'fas fa-sync-alt mr-2' }),
                                'Pagina Vernieuwen'
                            )
                        )
                    );
                }

                // Render de roosterkop en de medewerkerrijen
                return h(Fragment, null,
                    h('div', { className: 'sticky-header-container' },
                        h('header', { id: 'header', className: 'header' },
                            h('div', { className: 'header-content' },
                                // Left side - Melding button and title
                                h('div', { className: 'header-left' },
                                    h('button', {
                                        className: 'btn btn-melding',
                                        onClick: () => window.location.href = 'pages/meldingMaken.aspx',
                                        title: 'Melding Maken'
                                    },
                                        h('i', { className: 'fas fa-exclamation-triangle' }),
                                        'Melding'
                                    ),
                                    h('h1', null, 'Verlofrooster')
                                ),
                                // Right side - Permission-based navigation
                                h(NavigationButtons)
                            )
                        ),
                        h('div', { id: 'toolbar', className: 'toolbar' },
                            h('div', { className: 'toolbar-content' },
                                h('div', { id: 'periode-navigatie', className: 'periode-navigatie' },
                                    h('button', { onClick: vorige }, h('i', { className: 'fas fa-chevron-left' })),
                                    h('div', { className: 'periode-display' }, weergaveType === 'week' ? `Week ${huidigWeek}, ${huidigJaar}` : `${maandNamenVolledig[huidigMaand]} ${huidigJaar}`),
                                    h('button', { onClick: volgende }, h('i', { className: 'fas fa-chevron-right' })),
                                    h('div', { 'data-weergave': weergaveType, className: 'weergave-toggle', style: { marginLeft: '2rem' } },
                                        h('span', { className: 'glider' }),
                                        h('button', { className: 'weergave-optie', onClick: () => setWeergaveType('week') }, 'Week'),
                                        h('button', { className: 'weergave-optie', onClick: () => setWeergaveType('maand') }, 'Maand')
                                    )
                                ),
                                h('div', { id: 'filter-groep', className: 'filter-groep' },
                                    h('input', { type: 'text', className: 'zoek-input', placeholder: 'Zoek medewerker...', value: zoekTerm, onChange: (e) => setZoekTerm(e.target.value) }),
                                    h('select', { className: 'filter-select', value: geselecteerdTeam, onChange: (e) => setGeselecteerdTeam(e.target.value) },
                                        h('option', { value: '' }, 'Alle teams'),
                                        (teams || []).map(team => h('option', { key: team.id, value: team.id }, team.naam))
                                    )
                                )
                            ),
                            Object.keys(shiftTypes).length > 0 && h('div', { id: 'legenda-container', className: 'legenda-container' },
                                h('span', { className: 'legenda-titel' }, 'Legenda:'),
                                Object.values(shiftTypes || {}).map(type => h('div', { key: type.id, className: 'legenda-item' },
                                    h('div', { className: 'legenda-kleur', style: { backgroundColor: type.kleur } }),
                                    h('span', null, `${type.afkorting} - ${type.label}`)
                                )),
                                Object.values(dagenIndicators || {}).map(indicator => h('div', { key: indicator.Title, className: 'legenda-item' },
                                    h('div', { className: 'legenda-kleur', style: { backgroundColor: indicator.kleur } }),
                                    h('span', null, `${indicator.Title} - ${indicator.Beschrijving}`)
                                ))
                            )
                        )
                    ),
                    h('main', { className: 'main-content' },
                        h('div', { className: 'table-responsive-wrapper' },
                            h('table', {
                                id: 'rooster-table',
                                className: `rooster-table ${weergaveType}-view`,
                                style: { '--day-count': periodeData.length }
                            },
                                h('thead', { className: 'rooster-thead' },
                                    h('tr', null,
                                        h('th', { className: 'medewerker-kolom', id: 'medewerker-kolom' }, 'Medewerker'),
                                        periodeData.map(dag => {
                                            const isWeekend = dag.getDay() === 0 || dag.getDay() === 6;
                                            const feestdagNaam = checkIsFeestdag(dag);
                                            const isToday = isVandaag(dag);
                                            const classes = `dag-kolom ${isWeekend ? 'weekend' : ''} ${feestdagNaam ? 'feestdag' : ''} ${isToday ? 'vandaag' : ''}`;
                                            
                                            // Create a ref callback to add tooltip for holiday
                                            const headerRef = (element) => {
                                                if (element && feestdagNaam && !element.dataset.tooltipAttached) {
                                                    TooltipManager.attach(element, () => {
                                                        return TooltipManager.createFeestdagTooltip(feestdagNaam, dag);
                                                    });
                                                }
                                            };
                                            
                                            return h('th', { 
                                                key: dag.toISOString(), 
                                                className: classes,
                                                ref: headerRef
                                            },
                                                h('div', { className: 'dag-header' },
                                                    h('span', { className: 'dag-naam' }, formatteerDatum(dag).dagNaam),
                                                    h('span', { className: 'dag-nummer' }, formatteerDatum(dag).dagNummer),
                                                    isToday && h('div', { className: 'vandaag-indicator' })
                                                )
                                            );
                                        })
                                    )
                                ),
                                h('tbody', null,
                                    (gegroepeerdeData ? Object.keys(gegroepeerdeData) : []).map(teamId => {
                                        const team = (teams || []).find(t => t.id === teamId) || { id: 'geen_team', naam: 'Geen Team', kleur: '#ccc' };
                                        const teamMedewerkers = gegroepeerdeData[teamId];
                                        if (!teamMedewerkers || teamMedewerkers.length === 0) return null;

                                        return h(Fragment, { key: teamId },
                                            h('tr', { className: 'team-rij' }, h('td', { colSpan: periodeData.length + 1 }, h('div', { className: 'team-header', style: { '--team-kleur': team.kleur } }, team.naam))),
                                            (teamMedewerkers || []).map(medewerker =>
                                                h('tr', { key: medewerker.id, className: 'medewerker-rij' },
                                                    h('td', { className: 'medewerker-kolom' }, h(MedewerkerRow, { medewerker: medewerker || {} })),
                                                    // ===============================================
                                                    // CORRECTE RENDER LOGICA
                                                    // ===============================================
                                                    ...(() => {
                                                        const dagenMetBlokInfo = periodeData.map((dag) => {
                                                            const verlofItem = getVerlofVoorDag(medewerker.Username, dag);
                                                            const zittingsvrijItem = getZittingsvrijVoorDag(medewerker.Username, dag);
                                                            const compensatieItems = getCompensatieUrenVoorDag(medewerker.Username, dag);

                                                            // Debug logging for compensatie uren detection
                                                            if (compensatieItems.length > 0) {
                                                                console.log(`Found ${compensatieItems.length} compensatie items for ${medewerker.Username} on ${dag.toDateString()}:`, compensatieItems);
                                                            }

                                                            // Priority: verlof > zittingsvrij (compensatie uren have their own rendering)
                                                            let item = verlofItem || zittingsvrijItem;
                                                            // Compensatie uren are excluded from primary item selection because they 
                                                            // have their own visual representation via renderCompensatieMomenten

                                                            return {
                                                                dag,
                                                                item: item,
                                                                compensatieMomenten: getCompensatieMomentenVoorDag(dag).filter(m => m.item.MedewerkerID === medewerker.Username)
                                                            };
                                                        });

                                                        for (let i = 0; i < dagenMetBlokInfo.length; i++) {
                                                            if (dagenMetBlokInfo[i].item) {
                                                                const isStart = i === 0 || dagenMetBlokInfo[i].item !== dagenMetBlokInfo[i - 1].item;
                                                                if (isStart) {

                                                                    let length = 1;
                                                                    while (i + length < dagenMetBlokInfo.length && dagenMetBlokInfo[i + length].item === dagenMetBlokInfo[i].item) { length++; }
                                                                    const middleIndex = i + Math.floor((length - 1) / 2);
                                                                    for (let k = 0; k < length; k++) {
                                                                        dagenMetBlokInfo[i + k].isMiddle = (i + k === middleIndex);
                                                                        dagenMetBlokInfo[i + k].isStart = (k === 0);
                                                                        dagenMetBlokInfo[i + k].isEnd = (k === length - 1);
                                                                    }
                                                                }
                                                            }
                                                        }

                                                        return dagenMetBlokInfo.map(({ dag, item, isStart, isEnd, isMiddle, compensatieMomenten }) => {
                                                            const isWeekend = dag.getDay() === 0 || dag.getDay() === 6;
                                                            const feestdagNaam = checkIsFeestdag(dag);
                                                            const isSelected = isDateInSelection(dag, medewerker.Username);
                                                            const isToday = isVandaag(dag);
                                                            const classes = `dag-kolom ${isWeekend ? 'weekend' : ''} ${feestdagNaam ? 'feestdag' : ''} ${isToday ? 'vandaag' : ''} ${isSelected ? 'selected' : ''}`;

                                                            // Check if this is the first-clicked cell
                                                            const isFirstClick = firstClickData &&
                                                                firstClickData.medewerker.Username === medewerker.Username &&
                                                                firstClickData.dag.toDateString() === dag.toDateString(); // Create tooltip component for the first clicked cell
                                                            const tooltipElement = (isFirstClick && showTooltip) ?
                                                                h('div', {
                                                                    className: 'selection-tooltip visible'
                                                                }, 'Selecteer nu een andere dag en klik rechts') : null;

                                                            // onClick: () => openShiftModal(medewerker, dag, item),
                                                            let teRenderenBlok = null;

                                                            // Logica voor UrenPerWeek                                                        
                                                            const urenSchema = getUrenPerWeekForDate(medewerker.Username, dag);
                                                            if (urenSchema) {
                                                                const dagNamen = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
                                                                const dagNaam = dagNamen[dag.getDay()];
                                                                const soortVeld = `${dagNaam}Soort`;
                                                                const dagSoort = urenSchema[soortVeld];

                                                                if (dagSoort && dagenIndicators[dagSoort]) {
                                                                    const indicator = dagenIndicators[dagSoort];
                                                                    teRenderenBlok = h('div', {
                                                                        className: 'verlof-blok',
                                                                        style: { backgroundColor: indicator.kleur, borderRadius: '6px' }, // Ensure it's a full block
                                                                        title: `${indicator.Beschrijving || indicator.Title} (vanaf ${urenSchema.Ingangsdatum.toLocaleDateString()})`
                                                                    }, indicator.Title);
                                                                    
                                                                    console.log(`🔍 Rendered UrenPerWeek block for ${medewerker.Username} on ${dag.toDateString()}: ${dagSoort} (record from ${urenSchema.Ingangsdatum.toLocaleDateString()})`);
                                                                }
                                                            }

                                                            if (item && !teRenderenBlok) { // Alleen tonen als er geen UrenPerWeek blok is
                                                                console.log(`🎯 Rendering primary item block for ${medewerker.Username} on ${dag.toDateString()}:`, item);
                                                                const blokClasses = ['verlof-blok'];
                                                                if (isStart) blokClasses.push('start-blok');
                                                                if (isEnd) blokClasses.push('eind-blok');

                                                                const isVerlof = 'RedenId' in item;
                                                                const isZittingsvrij = 'ZittingsVrijeDagTijd' in item;
                                                                const isCompensatie = 'StartCompensatieUren' in item;

                                                                if (isCompensatie) {
                                                                    console.warn(`⚠️ Compensatie item unexpectedly selected as primary item:`, item);
                                                                }

                                                                const shiftType = isVerlof ? shiftTypes[item.RedenId] : null;
                                                                const afkorting = isVerlof && shiftType ? shiftType.afkorting : (item.Afkorting || 'ZV');
                                                                const kleur = isVerlof && shiftType ? shiftType.kleur : (item.Kleur || '#8e44ad');
                                                                const titel = isVerlof && shiftType ? (item.Omschrijving || shiftType.label) : (item.Opmerking || item.Title);
                                                                const status = isVerlof ? (item.Status || 'Goedgekeurd').toLowerCase() : 'goedgekeurd';

                                                                if (afkorting === 'VER') {
                                                                    blokClasses.push('ver-item');
                                                                }

                                                                teRenderenBlok = h('div', {
                                                                    className: `${blokClasses.join(' ')} status-${status}`,
                                                                    'data-afkorting': afkorting,
                                                                    style: { backgroundColor: kleur },
                                                                    title: titel
                                                                }, isMiddle ? afkorting : '');
                                                            }

                                                            const compensatieMomentenBlokken = renderCompensatieMomenten(compensatieMomenten, {
                                                                onContextMenu: (e, compensatieItem) => {
                                                                    console.log('Compensatie item right-clicked, showing context menu:', compensatieItem);
                                                                    showContextMenu(e, medewerker, dag, compensatieItem);
                                                                },
                                                                onClick: (e, compensatieItem) => {
                                                                    console.log('Compensatie item clicked, opening edit modal:', compensatieItem);
                                                                    handleCellClick(medewerker, dag, compensatieItem);
                                                                }
                                                            });

                                                            return h('td', {
                                                                key: dag.toISOString(),
                                                                className: classes,
                                                                id: medewerker.id === 1 && dag.getDate() === 1 ? 'dag-cel' : undefined, // Add ID to first cell for tutorial
                                                                onClick: () => handleCellClick(medewerker, dag),
                                                                onContextMenu: (e) => {
                                                                    e.preventDefault();
                                                                    showContextMenu(e, medewerker, dag, item);
                                                                },
                                                                style: isFirstClick ? { position: 'relative' } : {}
                                                            },
                                                                teRenderenBlok,
                                                                compensatieMomentenBlokken,
                                                                tooltipElement // Add the tooltip element
                                                            );
                                                        });
                                                    })()
                                                )
                                            )
                                        );
                                    })
                                )
                            )
                        ),
                        // h(ShiftModal, { isOpen: modalOpen, sluit: sluitModal, opslaan: opslaanShift, medewerker: geselecteerdeMedewerker, datum: geselecteerdeDatum, bestaandeShift: bewerkenShift, shiftTypes: shiftTypes }),
                        contextMenu && h(ContextMenu, {
                            x: contextMenu.x,
                            y: contextMenu.y,
                            items: contextMenu.items,
                            onClose: () => setContextMenu(null)
                        }),
                        h(FAB, {
                            id: 'fab-container',
                            actions: [
                                {
                                    label: 'Verlof aanvragen',
                                    icon: 'fa-calendar-plus',
                                    onClick: () => {
                                        // Keep the selection for the form to use
                                        setIsVerlofModalOpen(true);
                                    }
                                },
                                {
                                    label: 'Ziek melden',
                                    icon: 'fa-notes-medical',
                                    onClick: () => {
                                        // Keep the selection for the form to use
                                        setIsZiekModalOpen(true);
                                    }
                                },
                                {
                                    label: 'Compensatieuren doorgeven',
                                    icon: 'fa-clock',
                                    onClick: () => {
                                        console.log('📝 FAB: Compensatieuren doorgeven clicked');
                                        console.log('📝 Opening compensatie modal...');
                                        // Keep the selection for the form to use
                                        setIsCompensatieModalOpen(true);
                                    }
                                },
                                {
                                    label: 'Zittingsvrij maken',
                                    icon: 'fa-gavel',
                                    onClick: () => {
                                        // Keep the selection for the form to use
                                        setIsZittingsvrijModalOpen(true);
                                    }
                                    // Removed requiredGroups - now everyone can see this option
                                }
                            ]
                        }),
                        h(Modal, {
                            isOpen: isVerlofModalOpen,
                            onClose: () => setIsVerlofModalOpen(false),
                            title: selection && selection.itemData ? "Verlof Bewerken" : "Verlof Aanvragen"
                        }, h(VerlofAanvraagForm, {
                            onClose: () => setIsVerlofModalOpen(false),
                            medewerkers: medewerkers,
                            verlofItems: verlofItems,
                            shiftTypes: shiftTypes,
                            selection: selection,
                            initialData: selection && selection.itemData ? selection.itemData : {},
                            onSubmit: handleVerlofSubmit
                        })),
                        h(Modal, {
                            isOpen: isCompensatieModalOpen,
                            onClose: () => setIsCompensatieModalOpen(false),
                            title: selection && selection.itemData ? "Compensatie Uren Bewerken" : "Compensatie Uren Aanvragen"
                        }, h(CompensatieUrenForm, {
                            onClose: () => setIsCompensatieModalOpen(false),
                            medewerkers: medewerkers,
                            compensatieUrenItems: compensatieUrenItems,
                            selection: selection,
                            initialData: selection && selection.itemData ? selection.itemData : {},
                            onSubmit: handleCompensatieSubmit
                        })),
                        h(Modal, {
                            isOpen: isZiekModalOpen,
                            onClose: () => setIsZiekModalOpen(false),
                            title: selection && selection.itemData ? "Ziekmelding Bewerken" : "Ziek Melden"
                        }, h(ZiekteMeldingForm, {
                            onClose: () => setIsZiekModalOpen(false),
                            onSubmit: handleZiekteSubmit,
                            medewerkers: medewerkers,
                            selection: selection,
                            initialData: selection && selection.itemData ? selection.itemData : {},
                            ziekteRedenId: ziekteRedenId
                        })),
                        h(Modal, {
                            isOpen: isZittingsvrijModalOpen,
                            onClose: () => setIsZittingsvrijModalOpen(false),
                            title: selection && selection.itemData ? "Zittingsvrij Bewerken" : "Zittingsvrij Maken"
                        }, h(ZittingsvrijForm, {
                            onClose: () => setIsZittingsvrijModalOpen(false),
                            onSubmit: handleZittingsvrijSubmit,
                            medewerkers: medewerkers,
                            selection: selection,
                            initialData: selection && selection.itemData ? selection.itemData : {}
                        }))
                    )
                );
            };

            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(h(ErrorBoundary, null, h(RoosterApp)));

            // Make functions globally available for use in other components
            window.canManageOthersEvents = canManageOthersEvents;
            window.getProfilePhotoUrl = getProfilePhotoUrl;
            window.fetchSharePointList = fetchSharePointList;
    </script>
</body>
</html>