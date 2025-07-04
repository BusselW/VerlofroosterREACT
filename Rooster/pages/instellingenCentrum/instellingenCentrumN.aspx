<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instellingen Template</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="data:," />

    <!-- React Libraries -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <!-- Configuration -->
    <script src="../../js/config/configLijst.js"></script>

    <!-- Instellingen Styles -->
    <link href="css/instellingencentrum_s.css" rel="stylesheet">
</head>

<body>
    <div id="root"></div>

    <script type="module">
        // Import services (adjust paths as needed)
        import { fetchSharePointList, getCurrentUser, getUserInfo } from '../../js/services/sharepointService.js';

        // React setup
        const { useState, useEffect, useMemo, useCallback, createElement: h, Fragment } = React;

        // =====================
        // Main Application Component
        // =====================
        const App = () => {
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);
            const [user, setUser] = useState(null);
            const [data, setData] = useState({});

            // Initialize application
            useEffect(() => {
                const initializeApp = async () => {
                    try {
                        setLoading(true);
                        setError(null);

                        // Load current user
                        const currentUser = await getCurrentUser();
                        setUser(currentUser);

                        // Load additional data as needed
                        // const someData = await fetchSharePointList('SomeList');
                        // setData({ someData });

                        console.log('App initialized successfully');
                    } catch (err) {
                        console.error('Error initializing app:', err);
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                };

                initializeApp();
            }, []);

            // Handle loading state
            if (loading) {
                return h('div', { className: 'loading' },
                    h('div', null,
                        h('div', { className: 'spinner' }),
                        h('p', { className: 'mt-4 text-muted' }, 'Laden...')
                    )
                );
            }

            // Handle error state
            if (error) {
                return h('div', { className: 'container' },
                    h('div', { className: 'error' },
                        h('h3', null, 'Er is een fout opgetreden'),
                        h('p', null, error)
                    )
                );
            }

            // Main application render
            return h('div', null,
                h(Header, { user }),
                h('div', { className: 'container' },
                    h(MainContent, { user, data })
                )
            );
        };

        // =====================
        // Header Component
        // =====================
        const Header = ({ user }) => {
            return h('div', { className: 'header' },
                h('div', { className: 'container' },
                    h('h1', null, 'Instellingen Template'),
                    h('p', null, `Welkom, ${user?.Title || 'Gebruiker'}`)
                )
            );
        };

        // =====================
        // Main Content Component
        // =====================
        const MainContent = ({ user, data }) => {
            const [activeTab, setActiveTab] = useState('profile');

            return h('div', null,
                h('div', { className: 'tab-navigation' },
                    ...tabs.map(tab =>
                        h('button', {
                            key: tab.id,
                            className: `btn tab-btn ${activeTab === tab.id ? 'btn-primary active' : 'btn-secondary'}`,
                            onClick: () => setActiveTab(tab.id)
                        },
                            h('span', { className: 'tab-icon' }, tab.icon),
                            h('span', { className: 'tab-label' }, tab.label)
                        )
                    )
                ),
                h(TabContent, { activeTab, user, data })
            );
        };

        // Tab definitions moved here for reuse
        const tabs = [
            { 
                id: 'profile', 
                label: 'Mijn profiel', 
                icon: h('svg', { 
                    width: '20', 
                    height: '20', 
                    fill: 'currentColor', 
                    viewBox: '0 0 20 20' 
                }, 
                    h('path', { 
                        fillRule: 'evenodd', 
                        d: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z', 
                        clipRule: 'evenodd' 
                    })
                )
            },
            { 
                id: 'workhours', 
                label: 'Mijn werktijden', 
                icon: h('svg', { 
                    width: '20', 
                    height: '20', 
                    fill: 'currentColor', 
                    viewBox: '0 0 20 20' 
                }, 
                    h('path', { 
                        fillRule: 'evenodd', 
                        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z', 
                        clipRule: 'evenodd' 
                    })
                )
            },
            { 
                id: 'settings', 
                label: 'Instellingen', 
                icon: h('svg', { 
                    width: '20', 
                    height: '20', 
                    fill: 'currentColor', 
                    viewBox: '0 0 20 20' 
                }, 
                    h('path', { 
                        fillRule: 'evenodd', 
                        d: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z', 
                        clipRule: 'evenodd' 
                    })
                )
            }
        ];

        // =====================
        // Tab Content Component
        // =====================
        const TabContent = ({ activeTab, user, data }) => {
            switch (activeTab) {
                case 'profile':
                    return h(ProfileTab, { user, data });
                case 'workhours':
                    return h(WorkHoursTab, { user, data });
                case 'settings':
                    return h(SettingsTab, { user, data });
                default:
                    return h('div', { className: 'card' },
                        h('p', null, 'Selecteer een tabblad')
                    );
            }
        };

        // =====================
        // Profile Tab Component
        // =====================
        const ProfileTab = ({ user, data }) => {
            const [isEditing, setIsEditing] = useState(false);
            const [sharePointUser, setSharePointUser] = useState({ PictureURL: null, IsLoading: true });
            const [formData, setFormData] = useState({
                naam: user?.Title || '',
                email: user?.Email || '',
                geboortedatum: '',
                telefoon: '',
                functie: '',
                afdeling: '',
                manager: '',
                startdatum: ''
            });

            const fallbackAvatar = 'https://placehold.co/96x96/4a90e2/ffffff?text=';

            // Fetch user avatar info
            useEffect(() => {
                let isMounted = true;
                const fetchUserData = async () => {
                    if (user && user.Username) {
                        if (isMounted) setSharePointUser({ PictureURL: null, IsLoading: true });
                        const userData = await getUserInfo(user.Username);
                        if (isMounted) {
                            setSharePointUser({ ...(userData || {}), IsLoading: false });
                        }
                    } else if (isMounted) {
                        setSharePointUser({ PictureURL: null, IsLoading: false });
                    }
                };
                fetchUserData();
                return () => { isMounted = false; };
            }, [user?.Username]);

            const getAvatarUrl = () => {
                if (sharePointUser.IsLoading) return '';
                if (sharePointUser.PictureURL) return sharePointUser.PictureURL;
                // Robuuste initialen extractie
                const match = user?.Title ? String(user.Title).match(/\b\w/g) : null;
                const initials = match ? match.join('') : '?';
                return `${fallbackAvatar}${initials}`;
            };

            const handleImageError = (e) => {
                e.target.onerror = null;
                // Robuuste initialen extractie
                const match = user?.Title ? String(user.Title).match(/\b\w/g) : null;
                const initials = match ? match.join('') : '?';
                e.target.src = `${fallbackAvatar}${initials}`;
            };

            const handleInputChange = (field, value) => {
                setFormData(prev => ({
                    ...prev,
                    [field]: value
                }));
            };

            const handleSave = () => {
                // Save logic here
                setIsEditing(false);
                console.log('Profiel opgeslagen:', formData);
            };

            return h('div', null,
                h('div', { className: 'tab-header' },
                    h('h2', null, 
                        h('svg', { 
                            width: '24', 
                            height: '24', 
                            fill: 'currentColor', 
                            viewBox: '0 0 20 20',
                            style: { marginRight: '0.5rem' }
                        }, 
                            h('path', { 
                                fillRule: 'evenodd', 
                                d: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z', 
                                clipRule: 'evenodd' 
                            })
                        ),
                        'Mijn Profiel'
                    ),
                    h('p', { className: 'text-muted mb-4' }, 'Bekijk en beheer uw persoonlijke informatie.')
                ),

                // Profile Header Card
                h('div', { className: 'card profile-header-card' },
                    h('div', { className: 'profile-avatar-section' },
                        h('div', { className: 'profile-avatar' },
                            sharePointUser.IsLoading ? 
                                h('div', { className: 'avatar-placeholder' }, '...') :
                                h('img', {
                                    src: getAvatarUrl(),
                                    className: 'avatar-image',
                                    alt: `Profielfoto van ${user?.Title || 'gebruiker'}`,
                                    onError: handleImageError,
                                    style: {
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '3px solid #1e3a8a',
                                        boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
                                    }
                                })
                        ),
                        h('div', { className: 'profile-info' },
                            h('h3', null, user?.Title || 'Gebruiker'),
                            h('p', { className: 'text-muted' }, user?.Email || 'Geen e-mail beschikbaar'),
                            h('div', { className: 'profile-badges' },
                                h('span', { className: 'badge badge-primary' }, 'Actief'),
                                h('span', { className: 'badge badge-secondary' }, 'Medewerker')
                            )
                        ),
                        h('div', { className: 'profile-actions' },
                            h('button', {
                                className: `btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`,
                                onClick: () => setIsEditing(!isEditing)
                            }, isEditing ? 'Annuleren' : 'Bewerken')
                        )
                    )
                ),

                // Personal Information Card
                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 'Persoonlijke Gegevens'),
                    h('div', { className: 'form-row' },
                        h('div', { className: 'form-group' },
                            h('label', { className: 'form-label' }, 'Volledige naam'),
                            h('input', {
                                type: 'text',
                                className: 'form-input',
                                value: formData.naam,
                                readOnly: !isEditing,
                                onChange: (e) => handleInputChange('naam', e.target.value)
                            })
                        ),
                        h('div', { className: 'form-group' },
                            h('label', { className: 'form-label' }, 'E-mailadres'),
                            h('input', {
                                type: 'email',
                                className: 'form-input',
                                value: formData.email,
                                readOnly: true
                            })
                        )
                    ),
                    h('div', { className: 'form-row' },
                        h('div', { className: 'form-group' },
                            h('label', { className: 'form-label' }, 'Geboortedatum'),
                            h('input', {
                                type: 'date',
                                className: 'form-input',
                                value: formData.geboortedatum,
                                readOnly: !isEditing,
                                onChange: (e) => handleInputChange('geboortedatum', e.target.value)
                            })
                        ),
                        h('div', { className: 'form-group' },
                            h('label', { className: 'form-label' }, 'Telefoonnummer'),
                            h('input', {
                                type: 'tel',
                                className: 'form-input',
                                value: formData.telefoon,
                                readOnly: !isEditing,
                                placeholder: '+31 6 12345678',
                                onChange: (e) => handleInputChange('telefoon', e.target.value)
                            })
                        )
                    )
                ),

                // Work Information Card
                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 'Werk Informatie'),
                    h('div', { className: 'form-row' },
                        h('div', { className: 'form-group' },
                            h('label', { className: 'form-label' }, 'Functie'),
                            h('input', {
                                type: 'text',
                                className: 'form-input',
                                value: formData.functie,
                                readOnly: !isEditing,
                                placeholder: 'Uw functietitel...',
                                onChange: (e) => handleInputChange('functie', e.target.value)
                            })
                        ),
                        h('div', { className: 'form-group' },
                            h('label', { className: 'form-label' }, 'Afdeling'),
                            h('select', {
                                className: 'form-input',
                                value: formData.afdeling,
                                disabled: !isEditing,
                                onChange: (e) => handleInputChange('afdeling', e.target.value)
                            },
                                h('option', { value: '' }, 'Selecteer afdeling...'),
                                h('option', { value: 'ICT' }, 'ICT'),
                                h('option', { value: 'HR' }, 'Human Resources'),
                                h('option', { value: 'Finance' }, 'Finance'),
                                h('option', { value: 'Operations' }, 'Operations'),
                                h('option', { value: 'Marketing' }, 'Marketing')
                            )
                        )
                    ),
                    h('div', { className: 'form-row' },
                        h('div', { className: 'form-group' },
                            h('label', { className: 'form-label' }, 'Manager'),
                            h('input', {
                                type: 'text',
                                className: 'form-input',
                                value: formData.manager,
                                readOnly: !isEditing,
                                placeholder: 'Naam van uw manager...',
                                onChange: (e) => handleInputChange('manager', e.target.value)
                            })
                        ),
                        h('div', { className: 'form-group' },
                            h('label', { className: 'form-label' }, 'Startdatum'),
                            h('input', {
                                type: 'date',
                                className: 'form-input',
                                value: formData.startdatum,
                                readOnly: !isEditing,
                                onChange: (e) => handleInputChange('startdatum', e.target.value)
                            })
                        )
                    )
                ),

                // Save Actions (only show when editing)
                isEditing && h('div', { className: 'card' },
                    h('div', { className: 'settings-actions' },
                        h('button', { 
                            className: 'btn btn-primary',
                            onClick: handleSave
                        }, 'Wijzigingen Opslaan'),
                        h('button', { 
                            className: 'btn btn-secondary',
                            onClick: () => setIsEditing(false)
                        }, 'Annuleren')
                    )
                )
            );
        };

        // =====================
        // Work Hours Tab Component
        // =====================
        const WorkHoursTab = ({ user, data }) => {
            const [isEditing, setIsEditing] = useState(false);
            const [scheduleType, setScheduleType] = useState('fixed'); // 'fixed' or 'rotating'
            const [activeWeek, setActiveWeek] = useState('A');
            const [workHours, setWorkHours] = useState({
                monday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false },
                tuesday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false },
                wednesday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false },
                thursday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false },
                friday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false }
            });
            const [workHoursB, setWorkHoursB] = useState({
                monday: { start: '10:00', end: '18:00', hours: 8, type: 'Normaal', isFreeDag: false },
                tuesday: { start: '10:00', end: '18:00', hours: 8, type: 'Normaal', isFreeDag: false },
                wednesday: { start: '10:00', end: '18:00', hours: 8, type: 'Normaal', isFreeDag: false },
                thursday: { start: '10:00', end: '18:00', hours: 8, type: 'Normaal', isFreeDag: false },
                friday: { start: '--:--', end: '--:--', hours: 0, type: 'VVD', isFreeDag: true }
            });

            const [bulkTimes, setBulkTimes] = useState({ start: '09:00', end: '17:00' });

            const days = [
                { key: 'monday', label: 'Maandag', short: 'Ma' },
                { key: 'tuesday', label: 'Dinsdag', short: 'Di' },
                { key: 'wednesday', label: 'Woensdag', short: 'Wo' },
                { key: 'thursday', label: 'Donderdag', short: 'Do' },
                { key: 'friday', label: 'Vrijdag', short: 'Vr' }
            ];

            const dayTypes = [
                { value: 'Normaal', label: 'Normaal', color: '#27ae60' },
                { value: 'VVD', label: 'Volledige Vrije Dag', color: '#e74c3c' },
                { value: 'VVO', label: 'Vrije Voormiddag', color: '#f39c12' },
                { value: 'VVM', label: 'Vrije Namiddag', color: '#f39c12' }
            ];

            const calculateHours = (start, end) => {
                if (!start || !end || start === '--:--' || end === '--:--') return 0;
                const startTime = new Date(`2000-01-01T${start}:00`);
                const endTime = new Date(`2000-01-01T${end}:00`);
                if (endTime <= startTime) return 0;
                return Math.round(((endTime - startTime) / (1000 * 60 * 60)) * 10) / 10;
            };

            const getCurrentWeekHours = () => {
                const currentHours = scheduleType === 'rotating' && activeWeek === 'B' ? workHoursB : workHours;
                return days.reduce((total, day) => total + currentHours[day.key].hours, 0);
            };

            const handleTimeChange = (day, field, value) => {
                const currentWeekData = scheduleType === 'rotating' && activeWeek === 'B' ? workHoursB : workHours;
                const setCurrentWeekData = scheduleType === 'rotating' && activeWeek === 'B' ? setWorkHoursB : setWorkHours;
                
                setCurrentWeekData(prev => {
                    const updated = { ...prev };
                    updated[day] = { ...updated[day], [field]: value };
                    
                    // Recalculate hours if start or end time changed
                    if (field === 'start' || field === 'end') {
                        const hours = calculateHours(
                            field === 'start' ? value : updated[day].start,
                            field === 'end' ? value : updated[day].end
                        );
                        updated[day].hours = hours;
                        
                        // Auto-determine day type based on times
                        if (updated[day].isFreeDag) {
                            updated[day].type = 'VVD';
                        } else if (!value || value === '--:--') {
                            updated[day].type = 'VVD';
                        } else {
                            updated[day].type = 'Normaal';
                        }
                    }
                    
                    return updated;
                });
            };

            const handleBulkTimeSet = () => {
                const currentWeekData = scheduleType === 'rotating' && activeWeek === 'B' ? workHoursB : workHours;
                const setCurrentWeekData = scheduleType === 'rotating' && activeWeek === 'B' ? setWorkHoursB : setWorkHours;
                
                setCurrentWeekData(prev => {
                    const updated = { ...prev };
                    days.forEach(day => {
                        if (!updated[day.key].isFreeDag) {
                            updated[day.key].start = bulkTimes.start;
                            updated[day.key].end = bulkTimes.end;
                            updated[day.key].hours = calculateHours(bulkTimes.start, bulkTimes.end);
                            updated[day.key].type = 'Normaal';
                        }
                    });
                    return updated;
                });
            };

            const getDayTypeStyle = (type) => {
                const dayType = dayTypes.find(dt => dt.value === type);
                return {
                    backgroundColor: dayType?.color || '#e0e0e0',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                };
            };

            return h('div', null,
                h('div', { className: 'tab-header' },
                    h('h2', null, 
                        h('svg', { 
                            width: '24', 
                            height: '24', 
                            fill: 'currentColor', 
                            viewBox: '0 0 20 20',
                            style: { marginRight: '0.5rem' }
                        }, 
                            h('path', { 
                                fillRule: 'evenodd', 
                                d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z', 
                                clipRule: 'evenodd' 
                            })
                        ),
                        'Mijn Werktijden'
                    ),
                    h('p', { className: 'text-muted mb-4' }, 'Beheer uw standaard werktijden en werkschema.')
                ),

                // Schedule Type Selection Card
                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 'Werkschema Type'),
                    h('div', { className: 'schedule-type-selector' },
                        h('label', { className: 'radio-option' },
                            h('input', {
                                type: 'radio',
                                name: 'scheduleType',
                                value: 'fixed',
                                checked: scheduleType === 'fixed',
                                onChange: (e) => setScheduleType(e.target.value),
                                disabled: !isEditing
                            }),
                            h('span', null, 'Vast schema'),
                            h('small', { className: 'text-muted' }, 'Elke week dezelfde tijden')
                        ),
                        h('label', { className: 'radio-option' },
                            h('input', {
                                type: 'radio',
                                name: 'scheduleType',
                                value: 'rotating',
                                checked: scheduleType === 'rotating',
                                onChange: (e) => setScheduleType(e.target.value),
                                disabled: !isEditing
                            }),
                            h('span', null, 'Roulerend schema'),
                            h('small', { className: 'text-muted' }, 'Afwisselend Week A en Week B')
                        )
                    )
                ),

                // Weekly Summary Card
                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 'Weekoverzicht'),
                    h('div', { className: 'work-hours-overview' },
                        h('div', { className: 'hours-summary' },
                            h('div', { className: 'summary-item' },
                                h('span', { className: 'summary-label' }, 
                                    scheduleType === 'rotating' ? `Week ${activeWeek} totaal:` : 'Totaal per week:'
                                ),
                                h('span', { className: 'summary-value' }, `${getCurrentWeekHours()} uur`)
                            ),
                            h('div', { className: 'summary-item' },
                                h('span', { className: 'summary-label' }, 'Gemiddeld per dag:'),
                                h('span', { className: 'summary-value' }, `${(getCurrentWeekHours() / 5).toFixed(1)} uur`)
                            )
                        ),
                        
                        // Week selector for rotating schedules
                        scheduleType === 'rotating' && h('div', { className: 'week-selector' },
                            h('button', {
                                className: `btn ${activeWeek === 'A' ? 'btn-primary' : 'btn-secondary'}`,
                                onClick: () => setActiveWeek('A')
                            }, 'Week A'),
                            h('button', {
                                className: `btn ${activeWeek === 'B' ? 'btn-primary' : 'btn-secondary'}`,
                                onClick: () => setActiveWeek('B')
                            }, 'Week B')
                        )
                    )
                ),

                // Bulk Operations Card (only when editing)
                isEditing && h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 'Snelle Acties'),
                    h('div', { className: 'bulk-operations' },
                        h('div', { className: 'bulk-time-setter' },
                            h('label', { className: 'form-label' }, 'Alle dagen instellen:'),
                            h('div', { className: 'bulk-time-inputs' },
                                h('input', {
                                    type: 'time',
                                    className: 'form-input',
                                    value: bulkTimes.start,
                                    onChange: (e) => setBulkTimes(prev => ({ ...prev, start: e.target.value }))
                                }),
                                h('span', { className: 'time-separator' }, 'tot'),
                                h('input', {
                                    type: 'time',
                                    className: 'form-input',
                                    value: bulkTimes.end,
                                    onChange: (e) => setBulkTimes(prev => ({ ...prev, end: e.target.value }))
                                }),
                                h('button', {
                                    className: 'btn btn-secondary',
                                    onClick: handleBulkTimeSet
                                }, 'Toepassen')
                            )
                        )
                    )
                ),

                // Detailed Schedule Card
                h('div', { className: 'card' },
                    h('div', { className: 'card-header-with-actions' },
                        h('h3', { className: 'card-title' }, 
                            scheduleType === 'rotating' ? `Werkschema - Week ${activeWeek}` : 'Werkschema'
                        ),
                        h('button', {
                            className: `btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`,
                            onClick: () => setIsEditing(!isEditing)
                        }, isEditing ? 'Annuleren' : 'Bewerken')
                    ),
                    
                    h('div', { className: 'schedule-table-container' },
                        h('table', { className: 'schedule-table' },
                            h('thead', null,
                                h('tr', null,
                                    h('th', null, 'Dag'),
                                    h('th', null, 'Starttijd'),
                                    h('th', null, 'Eindtijd'),
                                    h('th', null, 'Uren'),
                                    h('th', null, 'Type'),
                                    isEditing && h('th', null, 'Vrije dag')
                                )
                            ),
                            h('tbody', null,
                                ...days.map(day => {
                                    const currentHours = scheduleType === 'rotating' && activeWeek === 'B' ? workHoursB : workHours;
                                    const dayData = currentHours[day.key];
                                    
                                    return h('tr', { key: day.key, className: dayData.isFreeDag ? 'free-day-row' : '' },
                                        h('td', { className: 'day-cell' },
                                            h('strong', null, day.label)
                                        ),
                                        h('td', null,
                                            isEditing ? h('input', {
                                                type: 'time',
                                                className: 'form-input time-input',
                                                value: dayData.start,
                                                onChange: (e) => handleTimeChange(day.key, 'start', e.target.value),
                                                disabled: dayData.isFreeDag
                                            }) : h('span', { className: 'time-display' }, dayData.start)
                                        ),
                                        h('td', null,
                                            isEditing ? h('input', {
                                                type: 'time',
                                                className: 'form-input time-input',
                                                value: dayData.end,
                                                onChange: (e) => handleTimeChange(day.key, 'end', e.target.value),
                                                disabled: dayData.isFreeDag
                                            }) : h('span', { className: 'time-display' }, dayData.end)
                                        ),
                                        h('td', { className: 'hours-cell' },
                                            h('span', { className: 'hours-badge' }, `${dayData.hours}h`)
                                        ),
                                        h('td', null,
                                            h('span', { 
                                                className: 'day-type-badge',
                                                style: getDayTypeStyle(dayData.type)
                                            }, dayData.type)
                                        ),
                                        isEditing && h('td', null,
                                            h('input', {
                                                type: 'checkbox',
                                                checked: dayData.isFreeDag,
                                                onChange: (e) => handleTimeChange(day.key, 'isFreeDag', e.target.checked),
                                                className: 'setting-checkbox'
                                            })
                                        )
                                    );
                                })
                            )
                        )
                    )
                ),

                // Save Actions (only show when editing)
                isEditing && h('div', { className: 'card' },
                    h('div', { className: 'settings-actions' },
                        h('button', { 
                            className: 'btn btn-primary',
                            onClick: () => {
                                setIsEditing(false);
                                console.log('Werktijden opgeslagen');
                            }
                        }, 'Wijzigingen Opslaan'),
                        h('button', { 
                            className: 'btn btn-secondary',
                            onClick: () => setIsEditing(false)
                        }, 'Annuleren')
                    )
                )
            );
        };

        // =====================
        // Settings Tab Component
        // =====================
        const SettingsTab = ({ user, data }) => {
            const [notifications, setNotifications] = useState(true);
            const [emailUpdates, setEmailUpdates] = useState(false);
            const [weekendDisplay, setWeekendDisplay] = useState(true);
            const [autoRefresh, setAutoRefresh] = useState(true);
            const [theme, setTheme] = useState('light');
            const [language, setLanguage] = useState('nl');
            const [dateFormat, setDateFormat] = useState('dd-mm-yyyy');
            const [timeFormat, setTimeFormat] = useState('24h');
            const [defaultView, setDefaultView] = useState('week');

            const handleSaveSettings = () => {
                const settings = {
                    notifications,
                    emailUpdates,
                    weekendDisplay,
                    autoRefresh,
                    theme,
                    language,
                    dateFormat,
                    timeFormat,
                    defaultView
                };
                console.log('Instellingen opgeslagen:', settings);
            };

            const handleResetSettings = () => {
                setNotifications(true);
                setEmailUpdates(false);
                setWeekendDisplay(true);
                setAutoRefresh(true);
                setTheme('light');
                setLanguage('nl');
                setDateFormat('dd-mm-yyyy');
                setTimeFormat('24h');
                setDefaultView('week');
            };

            return h('div', null,
                h('div', { className: 'tab-header' },
                    h('h2', null, 
                        h('svg', { 
                            width: '24', 
                            height: '24', 
                            fill: 'currentColor', 
                            viewBox: '0 0 20 20',
                            style: { marginRight: '0.5rem' }
                        }, 
                            h('path', { 
                                fillRule: 'evenodd', 
                                d: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z', 
                                clipRule: 'evenodd' 
                            })
                        ),
                        'Instellingen'
                    ),
                    h('p', { className: 'text-muted mb-4' }, 'Configureer uw persoonlijke voorkeuren en applicatie-instellingen.')
                ),

                // Notification Settings Card
                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 
                        h('svg', { 
                            width: '20', 
                            height: '20', 
                            fill: 'currentColor', 
                            viewBox: '0 0 20 20',
                            style: { marginRight: '0.5rem' }
                        }, 
                            h('path', { 
                                d: 'M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' 
                            })
                        ),
                        'Meldingen'
                    ),
                    h('div', { className: 'settings-section' },
                        h('div', { className: 'setting-item' },
                            h('label', { className: 'setting-label' },
                                h('input', {
                                    type: 'checkbox',
                                    checked: notifications,
                                    onChange: (e) => setNotifications(e.target.checked),
                                    className: 'setting-checkbox'
                                }),
                                h('div', { className: 'setting-content' },
                                    h('span', { className: 'setting-text' }, 'Push meldingen'),
                                    h('span', { className: 'setting-description' }, 'Ontvang direct meldingen voor belangrijke updates')
                                )
                            )
                        ),
                        h('div', { className: 'setting-item' },
                            h('label', { className: 'setting-label' },
                                h('input', {
                                    type: 'checkbox',
                                    checked: emailUpdates,
                                    onChange: (e) => setEmailUpdates(e.target.checked),
                                    className: 'setting-checkbox'
                                }),
                                h('div', { className: 'setting-content' },
                                    h('span', { className: 'setting-text' }, 'E-mail samenvattingen'),
                                    h('span', { className: 'setting-description' }, 'Ontvang dagelijkse/wekelijkse samenvattingen per e-mail')
                                )
                            )
                        ),
                        h('div', { className: 'setting-item' },
                            h('label', { className: 'setting-label' },
                                h('input', {
                                    type: 'checkbox',
                                    checked: autoRefresh,
                                    onChange: (e) => setAutoRefresh(e.target.checked),
                                    className: 'setting-checkbox'
                                }),
                                h('div', { className: 'setting-content' },
                                    h('span', { className: 'setting-text' }, 'Automatisch vernieuwen'),
                                    h('span', { className: 'setting-description' }, 'Vernieuw gegevens automatisch elke 5 minuten')
                                )
                            )
                        )
                    )
                ),

                // Display Settings Card
                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 
                        h('svg', { 
                            width: '20', 
                            height: '20', 
                            fill: 'currentColor', 
                            viewBox: '0 0 20 20',
                            style: { marginRight: '0.5rem' }
                        }, 
                            h('path', { 
                                fillRule: 'evenodd', 
                                d: 'M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z', 
                                clipRule: 'evenodd' 
                            })
                        ),
                        'Weergave'
                    ),
                    h('div', { className: 'settings-section' },
                        h('div', { className: 'form-row' },
                            h('div', { className: 'form-group' },
                                h('label', { className: 'form-label' }, 'Thema'),
                                h('select', {
                                    value: theme,
                                    onChange: (e) => setTheme(e.target.value),
                                    className: 'form-input'
                                },
                                    h('option', { value: 'light' }, 'Licht thema'),
                                    h('option', { value: 'dark' }, 'Donker thema'),
                                    h('option', { value: 'auto' }, 'Automatisch (systeem)')
                                )
                            ),
                            h('div', { className: 'form-group' },
                                h('label', { className: 'form-label' }, 'Standaard weergave'),
                                h('select', {
                                    value: defaultView,
                                    onChange: (e) => setDefaultView(e.target.value),
                                    className: 'form-input'
                                },
                                    h('option', { value: 'week' }, 'Weekweergave'),
                                    h('option', { value: 'month' }, 'Maandweergave'),
                                    h('option', { value: 'list' }, 'Lijstweergave')
                                )
                            )
                        ),
                        
                        h('div', { className: 'setting-item' },
                            h('label', { className: 'setting-label' },
                                h('input', {
                                    type: 'checkbox',
                                    checked: weekendDisplay,
                                    onChange: (e) => setWeekendDisplay(e.target.checked),
                                    className: 'setting-checkbox'
                                }),
                                h('div', { className: 'setting-content' },
                                    h('span', { className: 'setting-text' }, 'Weekenden tonen'),
                                    h('span', { className: 'setting-description' }, 'Toon zaterdag en zondag in de kalenderweergave')
                                )
                            )
                        )
                    )
                ),

                // Regional Settings Card
                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 
                        h('svg', { 
                            width: '20', 
                            height: '20', 
                            fill: 'currentColor', 
                            viewBox: '0 0 20 20',
                            style: { marginRight: '0.5rem' }
                        }, 
                            h('path', { 
                                fillRule: 'evenodd', 
                                d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z', 
                                clipRule: 'evenodd' 
                            })
                        ),
                        'Regionale instellingen'
                    ),
                    h('div', { className: 'settings-section' },
                        h('div', { className: 'form-row' },
                            h('div', { className: 'form-group' },
                                h('label', { className: 'form-label' }, 'Taal'),
                                h('select', {
                                    value: language,
                                    onChange: (e) => setLanguage(e.target.value),
                                    className: 'form-input'
                                },
                                    h('option', { value: 'nl' }, 'Nederlands'),
                                    h('option', { value: 'en' }, 'English'),
                                    h('option', { value: 'de' }, 'Deutsch'),
                                    h('option', { value: 'fr' }, 'Français')
                                )
                            ),
                            h('div', { className: 'form-group' },
                                h('label', { className: 'form-label' }, 'Datumformaat'),
                                h('select', {
                                    value: dateFormat,
                                    onChange: (e) => setDateFormat(e.target.value),
                                    className: 'form-input'
                                },
                                    h('option', { value: 'dd-mm-yyyy' }, 'DD-MM-YYYY (31-12-2024)'),
                                    h('option', { value: 'mm-dd-yyyy' }, 'MM-DD-YYYY (12-31-2024)'),
                                    h('option', { value: 'yyyy-mm-dd' }, 'YYYY-MM-DD (2024-12-31)'),
                                    h('option', { value: 'dd/mm/yyyy' }, 'DD/MM/YYYY (31/12/2024)')
                                )
                            )
                        ),
                        
                        h('div', { className: 'form-group' },
                            h('label', { className: 'form-label' }, 'Tijdformaat'),
                            h('select', {
                                value: timeFormat,
                                onChange: (e) => setTimeFormat(e.target.value),
                                className: 'form-input'
                            },
                                h('option', { value: '24h' }, '24-uurs (14:30)'),
                                h('option', { value: '12h' }, '12-uurs (2:30 PM)')
                            )
                        )
                    )
                ),

                // System Information Card
                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 'ℹ️ Systeem informatie'),
                    h('div', { className: 'info-grid' },
                        h('div', { className: 'info-item' },
                            h('span', { className: 'info-label' }, 'Versie:'),
                            h('span', { className: 'info-value' }, 'v2.1.0')
                        ),
                        h('div', { className: 'info-item' },
                            h('span', { className: 'info-label' }, 'Laatst bijgewerkt:'),
                            h('span', { className: 'info-value' }, 'Vandaag, 14:30')
                        ),
                        h('div', { className: 'info-item' },
                            h('span', { className: 'info-label' }, 'Browser:'),
                            h('span', { className: 'info-value' }, navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                                navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                                navigator.userAgent.includes('Safari') ? 'Safari' : 'Onbekend')
                        ),
                        h('div', { className: 'info-item' },
                            h('span', { className: 'info-label' }, 'Gebruiker ID:'),
                            h('span', { className: 'info-value' }, user?.Id || 'N/A')
                        )
                    )
                ),

                // Action Buttons Card
                h('div', { className: 'card' },
                    h('div', { className: 'settings-actions' },
                        h('button', { 
                            className: 'btn btn-primary',
                            onClick: handleSaveSettings
                        }, 
                            h('svg', { 
                                width: '16', 
                                height: '16', 
                                fill: 'currentColor', 
                                viewBox: '0 0 20 20',
                                style: { marginRight: '0.5rem' }
                            }, 
                                h('path', { 
                                    d: 'M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z' 
                                })
                            ),
                            'Alle Instellingen Opslaan'
                        ),
                        h('button', { 
                            className: 'btn btn-secondary',
                            onClick: handleResetSettings
                        }, 
                            h('svg', { 
                                width: '16', 
                                height: '16', 
                                fill: 'currentColor', 
                                viewBox: '0 0 20 20',
                                style: { marginRight: '0.5rem' }
                            }, 
                                h('path', { 
                                    fillRule: 'evenodd', 
                                    d: 'M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z', 
                                    clipRule: 'evenodd' 
                                })
                            ),
                            'Standaardwaarden'
                        ),
                        h('button', { 
                            className: 'btn btn-secondary',
                            onClick: () => window.location.reload()
                        }, '↻ Pagina Vernieuwen')
                    )
                )
            );
        };

        // =====================
        // Application Initialization
        // =====================
        const initializeApplication = () => {
            const container = document.getElementById('root');
            if (container) {
                const root = ReactDOM.createRoot(container);
                root.render(h(App));
                console.log('Template application initialized successfully');
            } else {
                console.error('Root container not found');
            }
        };

        // Start the application
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApplication);
        } else {
            initializeApplication();
        }

    </script>
</body>

</html>
