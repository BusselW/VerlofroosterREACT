<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Rooster Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Enkel het gecombineerde CSS bestand wordt nu geladen -->
    <link href="css/verlofrooster_stijl.css" rel="stylesheet">
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
        import ContextMenu from './js/ui/ContextMenu.js';
        import FAB from './js/ui/FloatingActionButton.js';
        import Modal from './js/ui/Modal.js';
        import DagCell, { renderCompensatieMomenten } from './js/ui/dagCell.js';
        import VerlofAanvraagForm from './js/ui/forms/VerlofAanvraagForm.js';
        import CompensatieUrenForm from './js/ui/forms/CompensatieUrenForm.js';
        import ZiekteMeldingForm from './js/ui/forms/ZiekteMeldingForm.js';
        import ZittingsvrijForm from './js/ui/forms/ZittingsvrijForm.js';
        import { tutorialSteps, highlightElement, removeHighlight } from './js/tutorial/roosterTutorial.js';


        const { useState, useEffect, useMemo, useCallback, createElement: h, Fragment } = React;

        // Hulpfuncties voor datum en tijd
        import { maandNamenVolledig, getPasen, getFeestdagen, getWeekNummer, getWekenInJaar, getDagenInMaand, formatteerDatum, getInitialen, getDagenInWeek, isVandaag } from './js/utils/dateHelpers.js';

        import InteractiveTutorial from './js/ui/InteractiveTutorial.js';

        // =====================
        // Permission-based Navigation Component
        // =====================
        import NavigationButtons from './js/ui/NavigationButtons.js';
            const [userPermissions, setUserPermissions] = useState({
                isAdmin: false,
                isFunctional: false,
                isTaakbeheer: false,
                loading: true
            });

            const [userInfo, setUserInfo] = useState({
                naam: '',
                pictureUrl: '',
                loading: true
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
                                loading: false
                            });
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

        import ErrorBoundary from './js/ui/ErrorBoundary.js';

        import UserRegistrationCheck from './js/ui/UserRegistrationCheck.js';

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
            const [isVerlofModalOpen, setIsVerlofModalOpen] = useState(false);
            const [isCompensatieModalOpen, setIsCompensatieModalOpen] = useState(false);
            const [isZiekModalOpen, setIsZiekModalOpen] = useState(false);
            const [isZittingsvrijModalOpen, setIsZittingsvrijModalOpen] = useState(false);
            const [selection, setSelection] = useState(null);
            const [firstClickData, setFirstClickData] = useState(null);
            const [isTutorialActive, setIsTutorialActive] = useState(false);

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
                    window.startTutorial = () => setIsTutorialActive(true);
                    window.stopTutorial = () => setIsTutorialActive(false);

                    return () => {
                        delete window.startTutorial;
                        delete window.stopTutorial;
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
            function handleCellClick(medewerker, dag) {
                if (!firstClickData) {
                    // First click: Set start of selection
                    setFirstClickData({ medewerker, dag });
                    setSelection({ start: dag, end: dag, medewerkerId: medewerker.Username });
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
                } else {
                    // Click on different employee: Start new selection
                    setFirstClickData({ medewerker, dag });
                    setSelection({ start: dag, end: dag, medewerkerId: medewerker.Username });
                }
            }

            // Context menu handler
            function showContextMenu(e, medewerker, dag, item) {
                console.log('showContextMenu called:', { medewerker: medewerker?.Username, dag, item: item?.ID, hasItem: !!item });

                // Helper to determine item type and list
                function getItemTypeAndList(item) {
                    if (!item) return { type: null, list: null };
                    if ('RedenId' in item) return { type: 'verlof', list: 'Verlof' };
                    if ('ZittingsVrijeDagTijd' in item) return { type: 'zittingsvrij', list: 'IncidenteelZittingVrij' };
                    if ('StartCompensatieUren' in item) return { type: 'compensatie', list: 'CompensatieUren' };
                    if ('Status' in item && item.Status === 'Ziek') return { type: 'ziekte', list: 'Verlof' };
                    return { type: null, list: null };
                }

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
                                    console.log('Compensatie clicked');
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
                                    setIsCompensatieModalOpen(true);
                                    setContextMenu(null);
                                }
                            },
                            {
                                label: 'Zittingsvrij maken',
                                icon: 'fa-gavel',
                                onClick: () => {
                                    console.log('Zittingsvrij clicked');
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
                                    setIsZittingsvrijModalOpen(true);
                                    setContextMenu(null);
                                },
                                requiredGroups: ["1. Sharepoint beheer", "1.1. Mulder MT", "2.6. Roosteraars", "2.3. Senioren beoordelen"]
                            }
                        ]
                    }
                ];

                // Only add edit/delete/comment options if there's an item
                if (item) {
                    console.log('Adding edit/delete/comment options for item:', item);
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

            // FAB handler for Zittingsvrij maken
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
                    setUrenPerWeekItems((urenPerWeekData || []).map(u => ({ ...u, Ingangsdatum: new Date(u.Ingangsdatum) })));
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
                    console.log("Submitting compensatie form data:", formData);
                    const result = await createSharePointListItem('CompensatieUren', formData);
                    console.log('Compensatie-uren ingediend:', result);
                    setIsCompensatieModalOpen(false);
                    refreshData();
                } catch (error) {
                    console.error('Fout bij het indienen van compensatie-uren:', error);
                    alert('Fout bij het indienen van compensatie-uren: ' + error.message);
                }
            }, [refreshData]);

            const handleZittingsvrijSubmit = useCallback(async (formData) => {
                try {
                    console.log("Submitting zittingsvrij form data:", formData);
                    const result = await createSharePointListItem('Zittingsvrij', formData);
                    console.log('Zittingsvrij ingediend:', result);
                    setIsZittingsvrijModalOpen(false);
                    refreshData();
                } catch (error) {
                    console.error('Fout bij het indienen van zittingsvrij:', error);
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
                    }
                };

                document.addEventListener('keydown', handleKeyDown);
                return () => document.removeEventListener('keydown', handleKeyDown);
            }, []);

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
                // Sorteer de items per medewerker op ingangsdatum (nieuwste eerst)
                const sortedItems = [...urenPerWeekItems].sort((a, b) => b.Ingangsdatum - a.Ingangsdatum);

                for (const item of sortedItems) {
                    if (!map[item.MedewerkerID]) {
                        map[item.MedewerkerID] = [];
                    }
                    map[item.MedewerkerID].push(item);
                }
                return map;
            }, [urenPerWeekItems]);

            const getUrenPerWeekForDate = useCallback((medewerkerId, date) => {
                const schedules = urenPerWeekByMedewerker[medewerkerId];
                if (!schedules) return null;
                // Vind het meest recente schema dat geldig is voor de gegeven datum
                return schedules.find(s => s.Ingangsdatum <= date) || null;
            }, [urenPerWeekByMedewerker]);

            const compensatieMomentenByDate = useMemo(() => {
                const moments = {};
                const addMoment = (date, type, item) => {
                    if (!date || isNaN(date)) return; // Skip invalid dates
                    const key = date.toISOString().split('T')[0];
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
                const key = datum.toISOString().split('T')[0];
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

            const getCompensatieUrenVoorDag = useCallback((medewerkerUsername, datum) => {
                if (!medewerkerUsername) return null;
                const datumCheck = new Date(datum).setHours(12, 0, 0, 0);
                return compensatieUrenItems.filter(c => c.MedewerkerID === medewerkerUsername && new Date(c.StartCompensatieUren).setHours(12, 0, 0, 0) <= datumCheck && datumCheck <= new Date(c.EindeCompensatieUren).setHours(12, 0, 0, 0));
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
                                h('h1', null, 'Team Rooster Manager')
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
                                        return h('th', { key: dag.toISOString(), className: classes, title: feestdagNaam || '' },
                                            h('div', { className: 'dag-header' },
                                                h('span', { className: 'dag-naam' }, formatteerDatum(dag).dagNaam),
                                                h('span', { className: 'dag-nummer' }, formatteerDatum(dag).dagNummer),
                                                isToday && h('div', { className: 'vandaag-indicator' }, '●')
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
                                                    const dagenMetBlokInfo = periodeData.map((dag) => ({
                                                        dag,
                                                        item: getVerlofVoorDag(medewerker.Username, dag) || getZittingsvrijVoorDag(medewerker.Username, dag),
                                                        compensatieMomenten: getCompensatieMomentenVoorDag(dag).filter(m => m.item.MedewerkerID === medewerker.Username)
                                                    }));

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
                                                        
                                                        // Check if this is the first-clicked cell
                                                        const isFirstClick = firstClickData &&
                                                            firstClickData.medewerker.Username === medewerker.Username &&
                                                            firstClickData.dag.toDateString() === dag.toDateString();
                                                            
                                                        const classes = `dag-kolom ${isWeekend ? 'weekend' : ''} ${feestdagNaam ? 'feestdag' : ''} ${isToday ? 'vandaag' : ''} ${isSelected ? 'selected' : ''} ${isFirstClick ? 'first-click' : ''}`;


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
                                                                    title: indicator.Beschrijving
                                                                }, indicator.Title);
                                                            }
                                                        }

                                                        if (item && !teRenderenBlok) { // Alleen tonen als er geen UrenPerWeek blok is
                                                            const blokClasses = ['verlof-blok'];
                                                            if (isStart) blokClasses.push('start-blok');
                                                            if (isEnd) blokClasses.push('eind-blok');

                                                            const isVerlof = 'RedenId' in item;
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

                                                        const compensatieMomentenBlokken = renderCompensatieMomenten(compensatieMomenten);

                                                        return h('td', {
                                                            key: dag.toISOString(),
                                                            className: classes,
                                                            id: medewerker.id === 1 && dag.getDate() === 1 ? 'dag-cel' : undefined, // Add ID to first cell for tutorial
                                                            onClick: () => handleCellClick(medewerker, dag),
                                                            onContextMenu: (e) => {
                                                                e.preventDefault();
                                                                showContextMenu(e, medewerker, dag, item);
                                                            }
                                                        }, teRenderenBlok, compensatieMomentenBlokken);
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
                                    setSelection(null); // No preselection from FAB
                                    setIsVerlofModalOpen(true);
                                }
                            },
                            {
                                label: 'Ziek melden',
                                icon: 'fa-notes-medical',
                                onClick: () => {
                                    setSelection(null); // No preselection from FAB
                                    setIsZiekModalOpen(true);
                                }
                            },
                            {
                                label: 'Compensatieuren doorgeven',
                                icon: 'fa-clock',
                                onClick: () => {
                                    setSelection(null); // No preselection from FAB
                                    setIsCompensatieModalOpen(true);
                                }
                            },
                            {
                                label: 'Zittingsvrij maken',
                                icon: 'fa-gavel',
                                onClick: () => {
                                    setSelection(null); // No preselection from FAB
                                    setIsZittingsvrijModalOpen(true);
                                },
                                requiredGroups: ["1. Sharepoint beheer", "1.1. Mulder MT", "2.6. Roosteraars", "2.3. Senioren beoordelen"]
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
                    })),
                    h(InteractiveTutorial, {
                        isActive: isTutorialActive,
                        onClose: () => setIsTutorialActive(false)
                    })
                )
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(h(ErrorBoundary, null, h(RoosterApp)));

        import { canManageOthersEvents } from './js/services/permissionUtils.js';
    </script>

</body>

</html>