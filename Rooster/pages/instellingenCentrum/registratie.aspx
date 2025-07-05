<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registratie - Verlofrooster</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="data:," />

    <!-- React Libraries -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <!-- Configuration -->
    <script src="../../js/config/configLijst.js"></script>

    <!-- Instellingen Styles -->
    <link href="css/instellingencentrum_s.css" rel="stylesheet">
    
    <!-- Minimal registration wizard styles -->
    <style>
        .progress-bar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            position: relative;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .progress-bar::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 10%;
            right: 10%;
            height: 2px;
            background: #e9ecef;
            z-index: 1;
        }
        
        .progress-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 2;
            flex: 1;
        }
        
        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e9ecef;
            color: #6c757d;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-bottom: 8px;
            transition: all 0.3s ease;
        }
        
        .progress-step.active .step-number {
            background: #007bff;
            color: white;
        }
        
        .progress-step.current .step-number {
            background: #28a745;
            color: white;
        }
        
        .step-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
            font-size: 14px;
            text-align: center;
        }
        
        .progress-step.active .step-title {
            color: #007bff;
        }
        
        .progress-step.current .step-title {
            color: #28a745;
        }
        
        .step-label {
            font-size: 12px;
            color: #6c757d;
            text-align: center;
        }
        
        .navigation-buttons {
            display: flex;
            justify-content: space-between;
            padding: 20px 0;
            margin-top: 20px;
        }
        
        .btn-group {
            display: flex;
            gap: 10px;
        }
    </style>
</head>

<body>
    <div id="root"></div>

    <script type="module">
        // Import services (adjust paths as needed)
        import { fetchSharePointList, getCurrentUser, getUserInfo } from '../../js/services/sharepointService.js';
        
        // Import tab components
        import { ProfileTab } from './js/componenten/profielTab.js';
        import { WorkHoursTab } from './js/componenten/werktijdenTab.js';
        import { SettingsTab } from './js/componenten/instellingenTab.js';

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
                    h('h1', null, 'Account registratie'),
                    h('p', null, `Welkom ${user?.Title || 'nieuwe gebruiker'}! Stel je account in voor het verlofrooster.`)
                )
            );
        };

        // =====================
        // Main Content Component
        // =====================
        const MainContent = ({ user, data }) => {
            const [currentStep, setCurrentStep] = useState(1);
            const [registrationData, setRegistrationData] = useState({
                profile: {},
                workHours: {},
                preferences: {}
            });
            const [isCompleted, setIsCompleted] = useState(false);
            const [errors, setErrors] = useState({});
            const [isSubmitting, setIsSubmitting] = useState(false);

            const steps = [
                { id: 1, title: 'Profiel', description: 'Persoonlijke gegevens' },
                { id: 2, title: 'Werktijden', description: 'Werk schema instellingen' },
                { id: 3, title: 'Voorkeuren', description: 'App instellingen' }
            ];

            const validateStep = (step, data) => {
                const errors = {};
                
                switch (step) {
                    case 1: // Profile validation
                        if (!data.naam || data.naam.trim() === '') {
                            errors.naam = 'Volledige naam is verplicht';
                        }
                        if (!data.email || data.email.trim() === '') {
                            errors.email = 'E-mail is verplicht';
                        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
                            errors.email = 'Voer een geldig e-mailadres in';
                        }
                        break;
                    case 2: // Work hours validation
                        if (!data.team || data.team.trim() === '') {
                            errors.team = 'Team is verplicht';
                        }
                        break;
                    case 3: // Preferences validation
                        // Preferences are optional, so minimal validation
                        break;
                }
                
                return {
                    isValid: Object.keys(errors).length === 0,
                    errors
                };
            };

            const handleNext = () => {
                const stepData = getCurrentStepData();
                const validation = validateStep(currentStep, stepData);
                
                if (!validation.isValid) {
                    setErrors(validation.errors);
                    return;
                }
                
                setErrors({});
                if (currentStep < 3) {
                    setCurrentStep(currentStep + 1);
                }
            };

            const getCurrentStepData = () => {
                switch (currentStep) {
                    case 1: return registrationData.profile;
                    case 2: return registrationData.workHours;
                    case 3: return registrationData.preferences;
                    default: return {};
                }
            };

            const handlePrevious = () => {
                if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                }
            };

            const handleFinish = async () => {
                try {
                    setIsSubmitting(true);
                    setErrors({});
                    
                    // Validate final step
                    const stepData = getCurrentStepData();
                    const validation = validateStep(currentStep, stepData);
                    
                    if (!validation.isValid) {
                        setErrors(validation.errors);
                        return;
                    }
                    
                    // Here you would normally save the registration data to SharePoint
                    console.log('Registration data:', registrationData);
                    
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    setIsCompleted(true);
                } catch (error) {
                    console.error('Registration failed:', error);
                    setErrors({ general: 'Registratie mislukt. Probeer het opnieuw.' });
                } finally {
                    setIsSubmitting(false);
                }
            };

            const updateRegistrationData = (stepKey, data) => {
                setRegistrationData(prev => ({
                    ...prev,
                    [stepKey]: { ...prev[stepKey], ...data }
                }));
            };

            if (isCompleted) {
                return h('div', null,
                    h('div', { style: { textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } },
                        h('div', { style: { fontSize: '4rem', marginBottom: '20px' } }, '✅'),
                        h('h1', null, '🎉 Registratie voltooid!'),
                        h('p', null, 'Welkom bij Verlofrooster! Je account is succesvol aangemaakt.'),
                        h('div', { style: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' } },
                            h('button', {
                                className: 'btn btn-primary',
                                onClick: () => window.location.href = '../../verlofRooster.aspx'
                            }, 'Naar de app'),
                            h('button', {
                                className: 'btn btn-secondary',
                                onClick: () => window.location.href = 'instellingenCentrumN.aspx'
                            }, 'Instellingen aanpassen')
                        )
                    )
                );
            }

            return h('div', null,
                // Progress bar
                h('div', { className: 'progress-bar' },
                    ...steps.map(step =>
                        h('div', {
                            key: step.id,
                            className: `progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`
                        },
                            h('div', { className: 'step-number' }, step.id),
                            h('div', { className: 'step-title' }, step.title),
                            h('div', { className: 'step-label' }, step.description)
                        )
                    )
                ),
                
                // Validation errors
                Object.keys(errors).length > 0 && h('div', { 
                    style: { 
                        backgroundColor: '#f8d7da', 
                        borderColor: '#f5c6cb', 
                        color: '#721c24',
                        padding: '15px',
                        borderRadius: '8px',
                        margin: '20px 0'
                    } 
                },
                    h('h6', { style: { marginBottom: '10px', fontWeight: '600' } }, '⚠️ Corrigeer de volgende fouten:'),
                    h('ul', { style: { marginBottom: '0', paddingLeft: '20px' } },
                        ...Object.values(errors).map((error, index) =>
                            h('li', { key: index }, error)
                        )
                    )
                ),
                
                // Step content - using same structure as original tabs
                h(StepContent, { 
                    currentStep, 
                    user, 
                    data, 
                    registrationData,
                    updateRegistrationData,
                    errors
                }),
                
                // Navigation buttons
                h('div', { className: 'navigation-buttons' },
                    h('div', null,
                        currentStep > 1 && h('button', {
                            className: 'btn btn-secondary',
                            onClick: handlePrevious,
                            disabled: isSubmitting
                        }, 'Vorige')
                    ),
                    h('div', { className: 'btn-group' },
                        currentStep < 3 && h('button', {
                            className: 'btn btn-primary',
                            onClick: handleNext,
                            disabled: isSubmitting
                        }, 'Volgende'),
                        currentStep === 3 && h('button', {
                            className: 'btn btn-success',
                            onClick: handleFinish,
                            disabled: isSubmitting
                        }, isSubmitting ? 'Bezig met registreren...' : 'Registratie voltooien')
                    )
                )
            );
        };

        // =====================
        // Step Content Component
        // =====================
        const StepContent = ({ currentStep, user, data, registrationData, updateRegistrationData, errors }) => {
            const handleProfileUpdate = (profileData) => {
                updateRegistrationData('profile', profileData);
            };

            const handleWorkHoursUpdate = (workHoursData) => {
                updateRegistrationData('workHours', workHoursData);
            };

            const handlePreferencesUpdate = (preferencesData) => {
                updateRegistrationData('preferences', preferencesData);
            };

            switch (currentStep) {
                case 1:
                    return h(ProfileTab, { 
                        user, 
                        data,
                        isRegistration: true,
                        onDataUpdate: handleProfileUpdate,
                        registrationData: registrationData.profile,
                        errors
                    });
                case 2:
                    return h(WorkHoursTab, { 
                        user, 
                        data,
                        isRegistration: true,
                        onDataUpdate: handleWorkHoursUpdate,
                        registrationData: registrationData.workHours,
                        errors
                    });
                case 3:
                    return h(SettingsTab, { 
                        user, 
                        data,
                        isRegistration: true,
                        onDataUpdate: handlePreferencesUpdate,
                        registrationData: registrationData.preferences,
                        errors
                    });
                default:
                    return h('div', null,
                        h('p', null, 'Ongeldige stap')
                    );
            }
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
