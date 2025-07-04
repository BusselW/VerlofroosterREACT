<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nieuwe Gebruiker Registratie - Verlofrooster</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="data:," />

    <!-- React Libraries -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <!-- Configuration -->
    <script src="../../js/config/configLijst.js"></script>

    <!-- Instellingen Styles -->
    <link href="css/instellingencentrum_s.css" rel="stylesheet">

    <!-- Additional styles for registration flow -->
    <style>
        .registration-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }

        .step-indicator {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 2rem;
            gap: 1rem;
        }

        .step-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .step-number.active {
            background-color: #4a90e2;
            color: white;
        }

        .step-number.completed {
            background-color: #27ae60;
            color: white;
        }

        .step-number.inactive {
            background-color: #e2e8f0;
            color: #64748b;
        }

        .step-connector {
            width: 60px;
            height: 2px;
            background-color: #e2e8f0;
        }

        .step-connector.completed {
            background-color: #27ae60;
        }

        .step-title {
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            margin-left: 0.5rem;
        }

        .step-title.active {
            color: #4a90e2;
        }

        .step-title.completed {
            color: #27ae60;
        }

        .registration-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .navigation-buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background-color: #e5e7eb;
            border-radius: 4px;
            margin-bottom: 2rem;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a90e2 0%, #357abd 100%);
            transition: width 0.3s ease;
            border-radius: 4px;
        }

        .welcome-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .welcome-header h1 {
            color: #1f2937;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .welcome-header p {
            color: #6b7280;
            font-size: 1.1rem;
        }

        .success-message {
            text-align: center;
            padding: 2rem;
        }

        .success-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1rem;
            background-color: #d1fae5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .btn-group {
            display: flex;
            gap: 1rem;
        }

        .btn-group .btn {
            flex: 1;
        }

        @media (max-width: 768px) {
            .step-indicator {
                flex-direction: column;
                gap: 0.5rem;
            }

            .step-connector {
                width: 2px;
                height: 30px;
            }

            .registration-container {
                padding: 1rem;
            }

            .navigation-buttons {
                flex-direction: column;
                gap: 1rem;
            }

            .btn-group {
                flex-direction: column;
            }
        }
    </style>
</head>

<body>
    <div id="root"></div>

    <script type="module">
        // Import services and components
        import { fetchSharePointList, getCurrentUser, getUserInfo, createSharePointListItem } from '../../js/services/sharepointService.js';
        
        // Import existing tab components (we'll reuse their logic)
        import { ProfileTab } from './js/componenten/profielTab.js';
        import { WorkHoursTab } from './js/componenten/werktijdenTab.js';
        import { SettingsTab } from './js/componenten/instellingenTab.js';

        // React setup
        const { useState, useEffect, useMemo, useCallback, createElement: h, Fragment } = React;

        // =====================
        // Registration Steps Configuration
        // =====================
        const REGISTRATION_STEPS = [
            { 
                id: 'profile', 
                title: 'Profiel', 
                description: 'Persoonlijke gegevens'
            },
            { 
                id: 'workhours', 
                title: 'Werktijden', 
                description: 'Werkschema instellen'
            },
            { 
                id: 'settings', 
                title: 'Voorkeuren', 
                description: 'Persoonlijke instellingen'
            }
        ];

        // =====================
        // Main Registration App Component
        // =====================
        const RegistrationApp = () => {
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);
            const [user, setUser] = useState(null);
            const [currentStep, setCurrentStep] = useState(0);
            const [registrationData, setRegistrationData] = useState({
                profile: {},
                workhours: {},
                settings: {}
            });
            const [isCompleted, setIsCompleted] = useState(false);
            const [isSubmitting, setIsSubmitting] = useState(false);

            // Initialize application
            useEffect(() => {
                const initializeApp = async () => {
                    try {
                        setLoading(true);
                        setError(null);

                        // Load current user
                        const currentUser = await getCurrentUser();
                        setUser(currentUser);

                        console.log('Registration app initialized successfully');
                    } catch (err) {
                        console.error('Error initializing registration app:', err);
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                };

                initializeApp();
            }, []);

            // Calculate progress percentage
            const progressPercentage = useMemo(() => {
                if (isCompleted) return 100;
                return ((currentStep + 1) / REGISTRATION_STEPS.length) * 100;
            }, [currentStep, isCompleted]);

            // Navigation functions
            const goToNextStep = useCallback(() => {
                if (currentStep < REGISTRATION_STEPS.length - 1) {
                    setCurrentStep(currentStep + 1);
                }
            }, [currentStep]);

            const goToPreviousStep = useCallback(() => {
                if (currentStep > 0) {
                    setCurrentStep(currentStep - 1);
                }
            }, [currentStep]);

            // Complete registration
            const completeRegistration = useCallback(async () => {
                setIsSubmitting(true);
                try {
                    // Here you would submit all the registration data to SharePoint
                    console.log('Submitting registration data:', registrationData);
                    
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    setIsCompleted(true);
                } catch (error) {
                    console.error('Error completing registration:', error);
                    setError('Er is een fout opgetreden bij het voltooien van de registratie.');
                } finally {
                    setIsSubmitting(false);
                }
            }, [registrationData]);

            // Handle loading state
            if (loading) {
                return h('div', { className: 'loading' },
                    h('div', null,
                        h('div', { className: 'spinner' }),
                        h('p', { className: 'mt-4 text-muted' }, 'Registratie laden...')
                    )
                );
            }

            // Handle error state
            if (error) {
                return h('div', { className: 'registration-container' },
                    h('div', { className: 'registration-card' },
                        h('div', { className: 'error' },
                            h('h3', null, 'Er is een fout opgetreden'),
                            h('p', null, error),
                            h('button', {
                                className: 'btn btn-primary',
                                onClick: () => window.location.reload()
                            }, 'Probeer opnieuw')
                        )
                    )
                );
            }

            // Show completion screen
            if (isCompleted) {
                return h('div', { className: 'registration-container' },
                    h('div', { className: 'registration-card' },
                        h('div', { className: 'success-message' },
                            h('div', { className: 'success-icon' },
                                h('svg', {
                                    width: '40',
                                    height: '40',
                                    fill: '#10b981',
                                    viewBox: '0 0 20 20'
                                },
                                    h('path', {
                                        fillRule: 'evenodd',
                                        d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
                                        clipRule: 'evenodd'
                                    })
                                )
                            ),
                            h('h2', null, 'Registratie voltooid!'),
                            h('p', null, `Welkom ${user?.Title || 'bij het verlofrooster systeem'}! Je account is succesvol aangemaakt.`),
                            h('div', { className: 'btn-group', style: { marginTop: '2rem' } },
                                h('button', {
                                    className: 'btn btn-primary',
                                    onClick: () => window.location.href = '../../verlofRooster.aspx'
                                }, 'Naar het rooster'),
                                h('button', {
                                    className: 'btn btn-secondary',
                                    onClick: () => window.location.href = 'instellingenCentrumN.aspx'
                                }, 'Instellingen beheren')
                            )
                        )
                    )
                );
            }

            // Main registration flow
            return h('div', { className: 'registration-container' },
                h('div', { className: 'welcome-header' },
                    h('h1', null, 'Welkom bij het Verlofrooster'),
                    h('p', null, 'Laten we je account instellen in een paar eenvoudige stappen')
                ),

                // Progress bar
                h('div', { className: 'progress-bar' },
                    h('div', { 
                        className: 'progress-fill',
                        style: { width: `${progressPercentage}%` }
                    })
                ),

                // Step indicator
                h(StepIndicator, { currentStep, steps: REGISTRATION_STEPS }),

                // Registration card with current step content
                h('div', { className: 'registration-card' },
                    h(StepContent, { 
                        currentStep, 
                        user, 
                        registrationData, 
                        setRegistrationData 
                    }),

                    // Navigation buttons
                    h('div', { className: 'navigation-buttons' },
                        h('div', null,
                            currentStep > 0 && h('button', {
                                className: 'btn btn-secondary',
                                onClick: goToPreviousStep,
                                disabled: isSubmitting
                            }, 'Vorige')
                        ),
                        h('div', null,
                            currentStep < REGISTRATION_STEPS.length - 1 ? h('button', {
                                className: 'btn btn-primary',
                                onClick: goToNextStep,
                                disabled: isSubmitting
                            }, 'Volgende') : h('button', {
                                className: 'btn btn-success',
                                onClick: completeRegistration,
                                disabled: isSubmitting
                            }, isSubmitting ? 'Bezig met voltooien...' : 'Registratie voltooien')
                        )
                    )
                )
            );
        };

        // =====================
        // Step Indicator Component
        // =====================
        const StepIndicator = ({ currentStep, steps }) => {
            return h('div', { className: 'step-indicator' },
                ...steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return h(Fragment, { key: step.id },
                        h('div', { className: 'step-item' },
                            h('div', { 
                                className: `step-number ${isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}`
                            }, index + 1),
                            h('div', null,
                                h('div', { 
                                    className: `step-title ${isActive ? 'active' : isCompleted ? 'completed' : ''}`
                                }, step.title),
                                h('div', { 
                                    className: 'text-muted',
                                    style: { fontSize: '12px' }
                                }, step.description)
                            )
                        ),
                        index < steps.length - 1 && h('div', { 
                            className: `step-connector ${isCompleted ? 'completed' : ''}`
                        })
                    );
                })
            );
        };

        // =====================
        // Step Content Component
        // =====================
        const StepContent = ({ currentStep, user, registrationData, setRegistrationData }) => {
            const updateStepData = useCallback((stepKey, data) => {
                setRegistrationData(prev => ({
                    ...prev,
                    [stepKey]: { ...prev[stepKey], ...data }
                }));
            }, [setRegistrationData]);

            switch (currentStep) {
                case 0: // Profile step
                    return h('div', null,
                        h('h3', { style: { marginBottom: '1rem' } }, 'Stap 1: Persoonlijke gegevens'),
                        h('p', { className: 'text-muted', style: { marginBottom: '2rem' } }, 
                            'Vul je basisgegevens in voor je profiel.'
                        ),
                        h(RegistrationProfileStep, { 
                            user, 
                            data: registrationData.profile,
                            onChange: (data) => updateStepData('profile', data)
                        })
                    );

                case 1: // Work hours step
                    return h('div', null,
                        h('h3', { style: { marginBottom: '1rem' } }, 'Stap 2: Werktijden instellen'),
                        h('p', { className: 'text-muted', style: { marginBottom: '2rem' } }, 
                            'Stel je standaard werkschema in. Je kunt dit later altijd aanpassen.'
                        ),
                        h(RegistrationWorkHoursStep, { 
                            user, 
                            data: registrationData.workhours,
                            onChange: (data) => updateStepData('workhours', data)
                        })
                    );

                case 2: // Settings step
                    return h('div', null,
                        h('h3', { style: { marginBottom: '1rem' } }, 'Stap 3: Persoonlijke voorkeuren'),
                        h('p', { className: 'text-muted', style: { marginBottom: '2rem' } }, 
                            'Configureer je weergave-instellingen en voorkeuren.'
                        ),
                        h(RegistrationSettingsStep, { 
                            user, 
                            data: registrationData.settings,
                            onChange: (data) => updateStepData('settings', data)
                        })
                    );

                default:
                    return h('div', null, h('p', null, 'Onbekende stap'));
            }
        };

        // =====================
        // Registration Step Components (simplified versions of existing tabs)
        // =====================
        
        // Profile Step Component
        const RegistrationProfileStep = ({ user, data, onChange }) => {
            // This will be a simplified version of ProfileTab
            // focusing only on essential fields for registration
            return h('div', { className: 'form-grid' },
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Volledige naam'),
                    h('input', {
                        type: 'text',
                        className: 'form-input',
                        value: data.naam || user?.Title || '',
                        onChange: (e) => onChange({ naam: e.target.value }),
                        placeholder: 'Voer je volledige naam in'
                    })
                ),
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'E-mailadres'),
                    h('input', {
                        type: 'email',
                        className: 'form-input',
                        value: data.email || user?.Email || '',
                        onChange: (e) => onChange({ email: e.target.value }),
                        placeholder: 'je.naam@organisatie.nl'
                    })
                ),
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Geboortedatum'),
                    h('input', {
                        type: 'date',
                        className: 'form-input',
                        value: data.geboortedatum || '',
                        onChange: (e) => onChange({ geboortedatum: e.target.value })
                    })
                )
            );
        };

        // Work Hours Step Component
        const RegistrationWorkHoursStep = ({ user, data, onChange }) => {
            // Simplified version focusing on basic schedule setup
            // Hide Ingangsdatum as requested (automatically set to today)
            const [scheduleType, setScheduleType] = useState(data.scheduleType || 'fixed');
            
            useEffect(() => {
                // Set ingangsdatum to today automatically
                onChange({ 
                    ...data, 
                    scheduleType,
                    ingangsdatum: new Date().toISOString().split('T')[0]
                });
            }, [scheduleType]);

            return h('div', null,
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Type werkschema'),
                    h('select', {
                        className: 'form-input',
                        value: scheduleType,
                        onChange: (e) => {
                            setScheduleType(e.target.value);
                            onChange({ scheduleType: e.target.value });
                        }
                    },
                        h('option', { value: 'fixed' }, 'Vast schema (elke week hetzelfde)'),
                        h('option', { value: 'rotating' }, 'Roulerend schema (week A/B)')
                    )
                ),
                h('p', { className: 'form-help' }, 
                    'Je kunt je werktijden later gedetailleerd instellen in de instellingen.'
                )
            );
        };

        // Settings Step Component
        const RegistrationSettingsStep = ({ user, data, onChange }) => {
            // Simplified version of settings with defaults
            return h('div', null,
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Kleurenschema'),
                    h('select', {
                        className: 'form-input',
                        value: data.soortWeergave || 'licht',
                        onChange: (e) => onChange({ soortWeergave: e.target.value })
                    },
                        h('option', { value: 'licht' }, 'Lichte modus'),
                        h('option', { value: 'donker' }, 'Donkere modus')
                    )
                ),
                h('div', { className: 'form-group' },
                    h('label', null,
                        h('input', {
                            type: 'checkbox',
                            checked: data.weekendenWeergeven !== false,
                            onChange: (e) => onChange({ weekendenWeergeven: e.target.checked })
                        }),
                        ' Weekenden weergeven in kalender'
                    )
                ),
                h('p', { className: 'form-help' }, 
                    'Deze instellingen kun je later aanpassen in je persoonlijke voorkeuren.'
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
                root.render(h(RegistrationApp));
                console.log('Registration application initialized successfully');
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
