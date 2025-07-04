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
        import { fetchSharePointList, getCurrentUser } from '../../js/services/sharepointService.js';

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
                h(TabNavigation, { activeTab, setActiveTab }),
                h(TabContent, { activeTab, user, data })
            );
        };

        // =====================
        // Tab Navigation Component
        // =====================
        const TabNavigation = ({ activeTab, setActiveTab }) => {
            const tabs = [
                { id: 'profile', label: 'Mijn profiel', icon: '👤' },
                { id: 'workhours', label: 'Mijn werktijden', icon: '🕒' },
                { id: 'settings', label: 'Instellingen', icon: '⚙️' }
            ];

            return h('div', { className: 'card' },
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
                )
            );
        };

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
                    h('h2', null, '👤 Mijn Profiel'),
                    h('p', { className: 'text-muted mb-4' }, 'Bekijk en beheer uw persoonlijke informatie.')
                ),

                // Profile Header Card
                h('div', { className: 'card profile-header-card' },
                    h('div', { className: 'profile-avatar-section' },
                        h('div', { className: 'profile-avatar' },
                            h('div', { className: 'avatar-placeholder' }, 
                                (user?.Title || 'U').charAt(0).toUpperCase()
                            )
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
                    h('h2', null, '🕒 Mijn Werktijden'),
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
                    h('h2', null, '⚙️ Instellingen'),
                    h('p', { className: 'text-muted mb-4' }, 'Configureer uw persoonlijke voorkeuren en applicatie-instellingen.')
                ),

                // Notification Settings Card
                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, '🔔 Meldingen'),
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
                    h('h3', { className: 'card-title' }, '🎨 Weergave'),
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
                    h('h3', { className: 'card-title' }, '🌍 Regionale instellingen'),
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
                        }, '💾 Alle Instellingen Opslaan'),
                        h('button', { 
                            className: 'btn btn-secondary',
                            onClick: handleResetSettings
                        }, '🔄 Standaardwaarden'),
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
