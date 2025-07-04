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
            return h('div', { className: 'card' },
                h('div', { className: 'tab-header' },
                    h('h2', null, '👤 Mijn Profiel'),
                    h('p', { className: 'text-muted mb-4' }, 'Bekijk en beheer uw persoonlijke informatie.')
                ),

                h('div', { className: 'profile-section' },
                    h('div', { className: 'profile-avatar-section' },
                        h('div', { className: 'profile-avatar' },
                            h('div', { className: 'avatar-placeholder' }, 
                                (user?.Title || 'U').charAt(0).toUpperCase()
                            )
                        ),
                        h('div', { className: 'profile-info' },
                            h('h3', null, user?.Title || 'Gebruiker'),
                            h('p', { className: 'text-muted' }, user?.Email || 'Geen e-mail beschikbaar')
                        )
                    )
                ),

                h('div', { className: 'form-row' },
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Volledige naam'),
                        h('input', {
                            type: 'text',
                            className: 'form-input',
                            value: user?.Title || '',
                            readOnly: true
                        })
                    ),
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'E-mailadres'),
                        h('input', {
                            type: 'email',
                            className: 'form-input',
                            value: user?.Email || '',
                            readOnly: true
                        })
                    )
                ),

                h('div', { className: 'form-row' },
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Functie'),
                        h('input', {
                            type: 'text',
                            className: 'form-input',
                            placeholder: 'Uw functie...',
                            readOnly: true
                        })
                    ),
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Afdeling'),
                        h('input', {
                            type: 'text',
                            className: 'form-input',
                            placeholder: 'Uw afdeling...',
                            readOnly: true
                        })
                    )
                )
            );
        };

        // =====================
        // Work Hours Tab Component
        // =====================
        const WorkHoursTab = ({ user, data }) => {
            const [workHours, setWorkHours] = useState({
                monday: { start: '09:00', end: '17:00', hours: 8 },
                tuesday: { start: '09:00', end: '17:00', hours: 8 },
                wednesday: { start: '09:00', end: '17:00', hours: 8 },
                thursday: { start: '09:00', end: '17:00', hours: 8 },
                friday: { start: '09:00', end: '17:00', hours: 8 }
            });

            const days = [
                { key: 'monday', label: 'Maandag' },
                { key: 'tuesday', label: 'Dinsdag' },
                { key: 'wednesday', label: 'Woensdag' },
                { key: 'thursday', label: 'Donderdag' },
                { key: 'friday', label: 'Vrijdag' }
            ];

            return h('div', { className: 'card' },
                h('div', { className: 'tab-header' },
                    h('h2', null, '🕒 Mijn Werktijden'),
                    h('p', { className: 'text-muted mb-4' }, 'Overzicht van uw standaard werktijden per dag.')
                ),

                h('div', { className: 'work-hours-overview' },
                    h('div', { className: 'hours-summary' },
                        h('div', { className: 'summary-item' },
                            h('span', { className: 'summary-label' }, 'Totaal per week:'),
                            h('span', { className: 'summary-value' }, '40 uur')
                        ),
                        h('div', { className: 'summary-item' },
                            h('span', { className: 'summary-label' }, 'Gemiddeld per dag:'),
                            h('span', { className: 'summary-value' }, '8 uur')
                        )
                    )
                ),

                h('div', { className: 'work-schedule' },
                    h('h3', null, 'Weekrooster'),
                    h('div', { className: 'schedule-grid' },
                        ...days.map(day =>
                            h('div', { key: day.key, className: 'schedule-row' },
                                h('div', { className: 'day-label' }, day.label),
                                h('div', { className: 'time-range' },
                                    h('span', { className: 'time-start' }, workHours[day.key].start),
                                    h('span', { className: 'time-separator' }, ' - '),
                                    h('span', { className: 'time-end' }, workHours[day.key].end)
                                ),
                                h('div', { className: 'hours-total' }, 
                                    `${workHours[day.key].hours}h`
                                )
                            )
                        )
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
            const [theme, setTheme] = useState('light');

            return h('div', { className: 'card' },
                h('div', { className: 'tab-header' },
                    h('h2', null, '⚙️ Instellingen'),
                    h('p', { className: 'text-muted mb-4' }, 'Configureer uw persoonlijke voorkeuren en instellingen.')
                ),

                h('div', { className: 'settings-section' },
                    h('h3', null, 'Meldingen'),
                    h('div', { className: 'setting-item' },
                        h('label', { className: 'setting-label' },
                            h('input', {
                                type: 'checkbox',
                                checked: notifications,
                                onChange: (e) => setNotifications(e.target.checked),
                                className: 'setting-checkbox'
                            }),
                            h('span', { className: 'setting-text' }, 'Push meldingen ontvangen'),
                            h('span', { className: 'setting-description' }, 'Ontvang meldingen voor nieuwe berichten en updates')
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
                            h('span', { className: 'setting-text' }, 'E-mail updates'),
                            h('span', { className: 'setting-description' }, 'Ontvang dagelijkse samenvattingen per e-mail')
                        )
                    )
                ),

                h('div', { className: 'settings-section' },
                    h('h3', null, 'Weergave'),
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Thema'),
                        h('select', {
                            value: theme,
                            onChange: (e) => setTheme(e.target.value),
                            className: 'form-input'
                        },
                            h('option', { value: 'light' }, 'Licht'),
                            h('option', { value: 'dark' }, 'Donker'),
                            h('option', { value: 'auto' }, 'Automatisch')
                        )
                    )
                ),

                h('div', { className: 'settings-actions' },
                    h('button', { className: 'btn btn-primary' },
                        'Instellingen Opslaan'
                    ),
                    h('button', { className: 'btn btn-secondary', style: { marginLeft: '1rem' } },
                        'Standaardwaarden'
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
