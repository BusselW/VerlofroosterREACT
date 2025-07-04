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
            const [activeTab, setActiveTab] = useState('general');

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
                { id: 'general', label: 'Algemeen' },
                { id: 'profile', label: 'Profiel' },
                { id: 'preferences', label: 'Voorkeuren' }
            ];

            return h('div', { className: 'card' },
                h('div', { style: { display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' } },
                    ...tabs.map(tab =>
                        h('button', {
                            key: tab.id,
                            className: `btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`,
                            onClick: () => setActiveTab(tab.id)
                        },
                            tab.label
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
                case 'general':
                    return h(GeneralTab, { user, data });
                case 'profile':
                    return h(ProfileTab, { user, data });
                case 'preferences':
                    return h(PreferencesTab, { user, data });
                default:
                    return h('div', { className: 'card' },
                        h('p', null, 'Selecteer een tabblad')
                    );
            }
        };

        // =====================
        // General Tab Component
        // =====================
        const GeneralTab = ({ user, data }) => {
            return h('div', { className: 'card' },
                h('h2', null, 'Algemene Instellingen'),
                h('p', { className: 'text-muted mb-4' }, 'Beheer uw algemene applicatie-instellingen.'),

                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Voorbeeld Instelling'),
                    h('input', {
                        type: 'text',
                        className: 'form-input',
                        placeholder: 'Voer een waarde in...'
                    })
                ),

                h('button', { className: 'btn btn-primary' },
                    'Opslaan'
                )
            );
        };

        // =====================
        // Profile Tab Component
        // =====================
        const ProfileTab = ({ user, data }) => {
            return h('div', { className: 'card' },
                h('h2', null, 'Profiel Instellingen'),
                h('p', { className: 'text-muted mb-4' }, 'Beheer uw profiel informatie.'),

                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Gebruikersnaam'),
                    h('input', {
                        type: 'text',
                        className: 'form-input',
                        value: user?.Title || '',
                        readOnly: true
                    })
                ),

                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'E-mail'),
                    h('input', {
                        type: 'email',
                        className: 'form-input',
                        value: user?.Email || '',
                        readOnly: true
                    })
                )
            );
        };

        // =====================
        // Preferences Tab Component
        // =====================
        const PreferencesTab = ({ user, data }) => {
            const [notifications, setNotifications] = useState(true);

            return h('div', { className: 'card' },
                h('h2', null, 'Voorkeuren'),
                h('p', { className: 'text-muted mb-4' }, 'Pas uw persoonlijke voorkeuren aan.'),

                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' },
                        h('input', {
                            type: 'checkbox',
                            checked: notifications,
                            onChange: (e) => setNotifications(e.target.checked),
                            style: { marginRight: '0.5rem' }
                        }),
                        'Meldingen ontvangen'
                    )
                ),

                h('button', { className: 'btn btn-primary' },
                    'Voorkeuren Opslaan'
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
