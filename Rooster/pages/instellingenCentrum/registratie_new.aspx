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
        /* Registration specific styles that extend instellingencentrum_s.css */
        .registration-container {
            width: 100%;
            max-width: none; /* Make it full width */
            margin: 0;
            padding: 1rem;
        }

        /* Welcome header matching main header style */
        .welcome-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 85%, #c2410c 100%);
            color: white;
            padding: 2rem 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(30, 58, 138, 0.3);
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .welcome-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            pointer-events: none;
        }

        .welcome-header h1 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            position: relative;
            z-index: 1;
        }

        .welcome-header p {
            font-size: 1.125rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        /* Progress bar */
        .progress-bar {
            width: 100%;
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            margin-bottom: 2rem;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%);
            transition: width 0.3s ease;
            border-radius: 3px;
        }

        /* Step indicator matching tab design */
        .step-indicator {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .step-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            min-width: 120px;
        }

        .step-number {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 0.5rem;
            transition: all 0.3s ease;
            background: #f1f5f9;
            color: #64748b;
            border: 2px solid #e2e8f0;
        }

        .step-number.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .step-number.completed {
            background: #10b981;
            color: white;
            border-color: #10b981;
        }

        .step-title {
            font-weight: 500;
            font-size: 14px;
            margin-bottom: 0.25rem;
            color: #64748b;
        }

        .step-title.active {
            color: #1e293b;
            font-weight: 600;
        }

        .step-title.completed {
            color: #10b981;
        }

        .step-connector {
            width: 60px;
            height: 2px;
            background: #e2e8f0;
            margin-top: 20px;
        }

        .step-connector.completed {
            background: #10b981;
        }

        /* Registration card matching main card style */
        .registration-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            padding: 2rem;
            margin-bottom: 1rem;
            border: 1px solid rgba(0, 0, 0, 0.04);
        }

        /* Form styling matching existing form components */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        @media (min-width: 768px) {
            .form-grid {
                grid-template-columns: 1fr 1fr;
            }
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #374151;
            font-size: 14px;
        }

        .form-input {
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.2s ease;
            background: white;
            font-family: inherit;
        }

        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input:disabled,
        .form-input[readonly] {
            background-color: #f8f9fa;
            color: #6c757d;
            cursor: not-allowed;
            border-color: #ced4da;
            opacity: 0.6;
        }

        .form-help {
            font-size: 13px;
            color: #6b7280;
            margin-top: 0.5rem;
            line-height: 1.4;
        }

        /* Checkbox styling */
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-weight: 500;
            color: #374151;
        }

        /* Navigation buttons */
        .navigation-buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            font-weight: 500;
            font-size: 14px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background: #3b82f6;
            color: white;
        }

        .btn-primary:hover:not(:disabled) {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-secondary {
            background: #f8fafc;
            color: #64748b;
            border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover:not(:disabled) {
            background: #f1f5f9;
            color: #475569;
        }

        .btn-success {
            background: #10b981;
            color: white;
        }

        .btn-success:hover:not(:disabled) {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }

        /* Success screen */
        .success-message {
            text-align: center;
            padding: 2rem 1rem;
        }

        .success-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: #d1fae5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .success-message h2 {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1e293b;
        }

        .success-message p {
            font-size: 1.125rem;
            color: #64748b;
            margin-bottom: 2rem;
            line-height: 1.5;
        }

        .btn-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        /* Loading and error states */
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            flex-direction: column;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error {
            text-align: center;
            padding: 2rem;
            color: #dc2626;
        }

        .error h3 {
            margin-bottom: 1rem;
        }

        .text-muted {
            color: #6b7280;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .registration-container {
                padding: 0.5rem;
            }

            .welcome-header {
                padding: 1.5rem 1rem;
                margin-bottom: 1rem;
            }

            .welcome-header h1 {
                font-size: 1.5rem;
            }

            .welcome-header p {
                font-size: 1rem;
            }

            .registration-card {
                padding: 1.5rem;
            }

            .step-indicator {
                gap: 0.5rem;
            }

            .step-item {
                min-width: 80px;
            }

            .step-number {
                width: 32px;
                height: 32px;
                font-size: 14px;
            }

            .step-connector {
                width: 40px;
                margin-top: 16px;
            }

            .navigation-buttons {
                flex-direction: column;
                gap: 1rem;
            }

            .btn-group {
                flex-direction: column;
                align-items: center;
            }
        }

        @media (max-width: 480px) {
            .step-indicator {
                flex-direction: column;
                gap: 1rem;
            }

            .step-connector {
                display: none;
            }
        }
    </style>
</head>

<body>
    <div id="root"></div>

    <script type="module">
        // Import services
        import { fetchSharePointList, getCurrentUser, getUserInfo } from '../../js/services/sharepointService.js';
        
        // Import day logic components
        import { 
            determineWorkDayType, 
            calculateHoursWorked, 
            DAY_TYPES, 
            DEFAULT_WORK_HOURS, 
            WORK_DAYS,
            generateWorkScheduleData,
            getDayTypeStyle,
            getWorkDayTypeDisplay
        } from './js/componenten/DagIndicators.js';

        // React setup
        const { useState, useEffect, useMemo, useCallback, createElement: h, Fragment } = React;

        // =====================
        // Main Registration App Component
        // =====================
        const RegistrationApp = () => {
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);
            const [user, setUser] = useState(null);
            const [currentStep, setCurrentStep] = useState(1);
            const [isSubmitting, setIsSubmitting] = useState(false);
            const [feedback, setFeedback] = useState(null);

            // Data for dropdowns
            const [teams, setTeams] = useState([]);
            const [functies, setFuncties] = useState([]);

            // Form data using DagIndicators structure
            const [formData, setFormData] = useState({
                // Step 1: Profile
                volledigeNaam: '',
                email: '',
                teamId: '',
                functieId: '',
                
                // Step 2: Work Hours (using DagIndicators structure)
                scheduleType: 'fixed',
                workHours: DEFAULT_WORK_HOURS,
                workHoursB: {
                    monday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
                    tuesday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
                    wednesday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
                    thursday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
                    friday: { start: '--:--', end: '--:--', hours: 0, type: DAY_TYPES.VVD, isFreeDag: true }
                },
                activeWeek: 'A',
                
                // Step 3: Settings
                notifications: true,
                weekendView: false,
                teamView: true
            });

            // Initialize app
            useEffect(() => {
                const initializeApp = async () => {
                    try {
                        setLoading(true);
                        
                        const currentUser = await getCurrentUser();
                        setUser(currentUser);
                        
                        // Auto-fill basic data
                        if (currentUser) {
                            setFormData(prev => ({
                                ...prev,
                                email: currentUser.Email || ''
                            }));
                        }

                        // Load teams with fallback
                        try {
                            const teamsData = await fetchSharePointList('Teams');
                            setTeams(teamsData || []);
                        } catch (err) {
                            console.warn('Could not load teams, using fallback:', err);
                            setTeams([
                                { Id: 1, Title: 'Team A' },
                                { Id: 2, Title: 'Team B' }
                            ]);
                        }

                        // Load functions with fallback
                        try {
                            const functiesData = await fetchSharePointList('keuzelijstFuncties');
                            setFuncties(functiesData || []);
                        } catch (err) {
                            console.warn('Could not load functions, using fallback:', err);
                            setFuncties([
                                { Id: 1, Title: 'Developer' },
                                { Id: 2, Title: 'Manager' }
                            ]);
                        }

                    } catch (err) {
                        console.error('Error initializing app:', err);
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                };

                initializeApp();
            }, []);

            const isStepValid = (step) => {
                switch (step) {
                    case 1:
                        return formData.volledigeNaam.trim() && 
                               formData.email.trim() && 
                               formData.teamId && 
                               formData.functieId;
                    case 2:
                        // Check if at least one day has work hours (or is explicitly a free day)
                        const checkWorkHours = (hours) => {
                            return Object.values(hours).some(day => 
                                day.isFreeDag || (day.start && day.end && day.start !== '--:--' && day.end !== '--:--')
                            );
                        };
                        
                        if (formData.scheduleType === 'rotating') {
                            return checkWorkHours(formData.workHours) && checkWorkHours(formData.workHoursB);
                        } else {
                            return checkWorkHours(formData.workHours);
                        }
                    case 3:
                        return true; // Settings are optional
                    default:
                        return false;
                }
            };

            const nextStep = () => {
                if (currentStep < 3 && isStepValid(currentStep)) {
                    setCurrentStep(currentStep + 1);
                }
            };

            const prevStep = () => {
                if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                }
            };

            const handleSubmit = async () => {
                try {
                    setIsSubmitting(true);
                    
                    console.log('Submitting registration data:', formData);
                    
                    // Prepare work schedule data for SharePoint using DagIndicators logic
                    const workScheduleData = generateWorkScheduleData(
                        formData.workHours,
                        {
                            weekType: formData.scheduleType === 'rotating' ? 'A' : null,
                            isRotating: formData.scheduleType === 'rotating',
                            userId: user?.LoginName,
                            ingangsdatum: new Date().toISOString(),
                            cycleStartDate: formData.scheduleType === 'rotating' ? new Date().toISOString() : null
                        }
                    );
                    
                    // If rotating schedule, also save week B
                    let workScheduleDataB = null;
                    if (formData.scheduleType === 'rotating') {
                        workScheduleDataB = generateWorkScheduleData(
                            formData.workHoursB,
                            {
                                weekType: 'B',
                                isRotating: true,
                                userId: user?.LoginName,
                                ingangsdatum: new Date().toISOString(),
                                cycleStartDate: new Date().toISOString()
                            }
                        );
                    }
                    
                    console.log('Work schedule data A:', workScheduleData);
                    if (workScheduleDataB) {
                        console.log('Work schedule data B:', workScheduleDataB);
                    }
                    
                    // Here you would submit to SharePoint:
                    // 1. Update user profile with team/functie
                    // 2. Save work schedule(s) to UrenPerWeek
                    // 3. Save user settings to gebruikersInstellingen
                    
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // On success, show completion step
                    setCurrentStep(4);
                    
                } catch (error) {
                    console.error('Registration failed:', error);
                    setFeedback({
                        type: 'error',
                        message: 'Er is een fout opgetreden bij het registreren. Probeer het opnieuw.'
                    });
                } finally {
                    setIsSubmitting(false);
                }
            };

            if (loading) {
                return h('div', { className: 'registration-container' },
                    h('div', { className: 'loading' },
                        h('div', { className: 'spinner' }),
                        h('p', { className: 'text-muted', style: { marginTop: '1rem' } }, 'Registratie laden...')
                    )
                );
            }

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

            // Success screen
            if (currentStep === 4) {
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
                            h('p', null, `Welkom ${formData.volledigeNaam || 'bij het verlofrooster systeem'}! Je account is succesvol aangemaakt.`),
                            h('div', { className: 'btn-group' },
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

            // Progress calculation
            const progressPercentage = ((currentStep - 1) / 3) * 100;

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
                h('div', { className: 'step-indicator' },
                    [1, 2, 3].map((stepNum, index) => {
                        const isActive = stepNum === currentStep;
                        const isCompleted = stepNum < currentStep;
                        const stepLabels = ['Profiel', 'Werktijden', 'Voorkeuren'];
                        
                        return h(Fragment, { key: stepNum },
                            h('div', { className: 'step-item' },
                                h('div', { 
                                    className: `step-number ${isActive ? 'active' : isCompleted ? 'completed' : ''}`
                                }, stepNum),
                                h('div', { 
                                    className: `step-title ${isActive ? 'active' : isCompleted ? 'completed' : ''}`
                                }, stepLabels[index])
                            ),
                            index < 2 && h('div', { 
                                className: `step-connector ${isCompleted ? 'completed' : ''}`
                            })
                        );
                    })
                ),

                // Content card
                h('div', { className: 'registration-card' },
                    // Current step content
                    currentStep === 1 && h(RegistrationProfileStep, { 
                        formData, 
                        setFormData, 
                        user, 
                        teams, 
                        functies 
                    }),
                    currentStep === 2 && h(RegistrationWorkHoursStep, { 
                        formData, 
                        setFormData 
                    }),
                    currentStep === 3 && h(RegistrationSettingsStep, { 
                        formData, 
                        setFormData 
                    }),

                    // Feedback message
                    feedback && h('div', { 
                        className: `alert ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`,
                        style: {
                            margin: '1rem 0',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            backgroundColor: feedback.type === 'error' ? '#fef2f2' : '#f0fdf4',
                            color: feedback.type === 'error' ? '#dc2626' : '#16a34a',
                            border: `1px solid ${feedback.type === 'error' ? '#fca5a5' : '#bbf7d0'}`
                        }
                    }, feedback.message),

                    // Navigation
                    h('div', { className: 'navigation-buttons' },
                        h('div', null,
                            currentStep > 1 && h('button', {
                                className: 'btn btn-secondary',
                                onClick: prevStep,
                                disabled: isSubmitting
                            }, 'Vorige')
                        ),
                        h('div', null,
                            currentStep < 3 ? h('button', {
                                className: 'btn btn-primary',
                                onClick: nextStep,
                                disabled: !isStepValid(currentStep) || isSubmitting
                            }, 'Volgende') : h('button', {
                                className: 'btn btn-success',
                                onClick: handleSubmit,
                                disabled: !isStepValid(currentStep) || isSubmitting
                            }, isSubmitting ? 'Bezig met voltooien...' : 'Registratie voltooien')
                        )
                    )
                )
            );
        };

        // =====================
        // Profile Picture Component (matches instellingenCentrumN.aspx logic exactly)
        // =====================
        const ProfilePicture = ({ user, className = '' }) => {
            const [profilePicUrl, setProfilePicUrl] = useState(null);
            const [loading, setLoading] = useState(true);

            useEffect(() => {
                const loadProfilePicture = async () => {
                    if (!user?.LoginName) {
                        setLoading(false);
                        return;
                    }

                    try {
                        console.log('Loading profile picture for:', user.LoginName);
                        
                        // Use the exact same logic as profielTab.js
                        const photoUrl = `/_layouts/15/userphoto.aspx?size=M&username=${encodeURIComponent(user.LoginName)}`;
                        
                        // Test if the image loads successfully
                        const img = new Image();
                        img.onload = () => {
                            console.log('Profile photo loaded successfully from SharePoint');
                            setProfilePicUrl(photoUrl);
                            setLoading(false);
                        };
                        img.onerror = () => {
                            console.log('Profile photo not found in SharePoint, using initials fallback');
                            setProfilePicUrl(null);
                            setLoading(false);
                        };
                        img.src = photoUrl;

                    } catch (error) {
                        console.error('Error loading profile picture:', error);
                        setProfilePicUrl(null);
                        setLoading(false);
                    }
                };

                loadProfilePicture();
            }, [user?.LoginName]);

            const getInitials = () => {
                if (!user?.Title) return 'U';
                return user.Title
                    .split(' ')
                    .map(name => name[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
            };

            if (loading) {
                return h('div', { 
                    className: `profile-picture loading ${className}`,
                    style: { 
                        width: '120px', 
                        height: '120px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                }, h('div', { className: 'spinner-small' }));
            }

            if (profilePicUrl) {
                return h('img', {
                    className: `profile-picture ${className}`,
                    src: profilePicUrl,
                    alt: user?.Title || 'Profielfoto',
                    style: { 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        border: '3px solid #e0e0e0',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }
                });
            }

            // Fallback to initials (same style as profielTab.js)
            return h('div', {
                className: `profile-picture initials ${className}`,
                style: {
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
            }, getInitials());
        };

        // =====================
        // Registration Profile Step Component
        // =====================
        const RegistrationProfileStep = ({ formData, setFormData, user, teams, functies }) => {
            return h('div', { className: 'registration-step' },
                h('h2', null, 'Stap 1: Je profiel'),
                h('p', { className: 'step-description' }, 
                    'Vul je persoonlijke gegevens in. Gebruikersnaam en e-mail zijn automatisch ingevuld vanuit SharePoint.'
                ),

                h('div', { className: 'form-grid' },
                    // Profile picture
                    h('div', { 
                        className: 'form-group',
                        style: { 
                            gridColumn: '1 / -1',
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }
                    },
                        h(ProfilePicture, { user })
                    ),

                    // Full name
                    h('div', { className: 'form-group', style: { gridColumn: '1 / -1' } },
                        h('label', { className: 'form-label' }, 'Volledige naam *'),
                        h('input', {
                            type: 'text',
                            className: 'form-input',
                            value: formData.volledigeNaam || '',
                            onChange: (e) => setFormData({ ...formData, volledigeNaam: e.target.value }),
                            placeholder: 'Bijv. Jan de Vries',
                            required: true
                        }),
                        h('div', { className: 'form-help' }, 'Voer je volledige voor- en achternaam in zoals deze officieel gebruikt wordt.')
                    ),

                    // Username (readonly)
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Gebruikersnaam'),
                        h('input', {
                            type: 'text',
                            className: 'form-input',
                            value: user?.LoginName?.replace('i:0#.w|', '') || '',
                            readOnly: true,
                            disabled: true
                        }),
                        h('div', { className: 'form-help' }, 'Automatisch ingevuld vanuit SharePoint.')
                    ),

                    // Email (readonly)
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'E-mailadres'),
                        h('input', {
                            type: 'email',
                            className: 'form-input',
                            value: formData.email || '',
                            readOnly: true,
                            disabled: true
                        }),
                        h('div', { className: 'form-help' }, 'Je werk e-mailadres vanuit SharePoint.')
                    ),

                    // Team (editable)
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Team *'),
                        h('select', {
                            value: formData.teamId || '',
                            onChange: (e) => setFormData({ ...formData, teamId: e.target.value }),
                            className: 'form-input',
                            required: true
                        },
                            h('option', { value: '' }, 'Selecteer een team...'),
                            ...(teams || []).map(team =>
                                h('option', { key: team.Id, value: team.Id }, team.Title)
                            )
                        ),
                        h('div', { className: 'form-help' }, 'Selecteer het team waarvan je deel uitmaakt.')
                    ),

                    // Function (editable)
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Functie *'),
                        h('select', {
                            value: formData.functieId || '',
                            onChange: (e) => setFormData({ ...formData, functieId: e.target.value }),
                            className: 'form-input',
                            required: true
                        },
                            h('option', { value: '' }, 'Selecteer een functie...'),
                            ...(functies || []).map(functie =>
                                h('option', { key: functie.Id, value: functie.Id }, functie.Title)
                            )
                        ),
                        h('div', { className: 'form-help' }, 'Selecteer je functie binnen de organisatie.')
                    )
                )
            );
        };

        // =====================
        // Registration Work Hours Step Component (using same logic as werktijdenTab.js)
        // =====================
        const RegistrationWorkHoursStep = ({ formData, setFormData }) => {
            const [scheduleType, setScheduleType] = useState(formData.scheduleType || 'fixed');
            const [activeWeek, setActiveWeek] = useState(formData.activeWeek || 'A');
            const [workHours, setWorkHours] = useState(formData.workHours || DEFAULT_WORK_HOURS);
            const [workHoursB, setWorkHoursB] = useState(formData.workHoursB || {
                monday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
                tuesday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
                wednesday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
                thursday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
                friday: { start: '--:--', end: '--:--', hours: 0, type: DAY_TYPES.VVD, isFreeDag: true }
            });
            const [bulkTimes, setBulkTimes] = useState({ start: '09:00', end: '17:00' });

            // Update formData whenever work hours change
            useEffect(() => {
                setFormData({
                    ...formData,
                    scheduleType,
                    workHours,
                    workHoursB,
                    activeWeek
                });
            }, [scheduleType, workHours, workHoursB, activeWeek]);

            const getCurrentWeekHours = () => {
                return scheduleType === 'rotating' && activeWeek === 'B' ? workHoursB : workHours;
            };

            const setCurrentWeekHours = (newHours) => {
                if (scheduleType === 'rotating' && activeWeek === 'B') {
                    setWorkHoursB(newHours);
                } else {
                    setWorkHours(newHours);
                }
            };

            const handleTimeChange = (day, field, value) => {
                const currentHours = getCurrentWeekHours();
                const updatedDay = { ...currentHours[day] };

                if (field === 'isFreeDag') {
                    updatedDay.isFreeDag = value;
                    if (value) {
                        // VVD - clear times
                        updatedDay.start = '--:--';
                        updatedDay.end = '--:--';
                        updatedDay.hours = 0;
                    } else {
                        // Re-enable with default times
                        updatedDay.start = '09:00';
                        updatedDay.end = '17:00';
                        updatedDay.hours = calculateHoursWorked('09:00', '17:00');
                    }
                } else {
                    updatedDay[field] = value;
                    updatedDay.hours = calculateHoursWorked(
                        field === 'start' ? value : updatedDay.start,
                        field === 'end' ? value : updatedDay.end
                    );
                }

                updatedDay.type = determineWorkDayType(
                    updatedDay.start,
                    updatedDay.end,
                    updatedDay.isFreeDag
                );

                const newHours = {
                    ...currentHours,
                    [day]: updatedDay
                };

                setCurrentWeekHours(newHours);
            };

            const handleBulkTimeSet = () => {
                const currentHours = getCurrentWeekHours();
                const newHours = { ...currentHours };

                WORK_DAYS.forEach(({ key }) => {
                    if (!newHours[key].isFreeDag) {
                        newHours[key] = {
                            ...newHours[key],
                            start: bulkTimes.start,
                            end: bulkTimes.end,
                            hours: calculateHoursWorked(bulkTimes.start, bulkTimes.end),
                            type: determineWorkDayType(bulkTimes.start, bulkTimes.end, false)
                        };
                    }
                });

                setCurrentWeekHours(newHours);
            };

            const renderDayRow = (day) => {
                const currentHours = getCurrentWeekHours();
                const dayData = currentHours[day];
                const dayInfo = WORK_DAYS.find(d => d.key === day);

                return h('div', { key: day, className: 'work-day-row' },
                    h('div', { className: 'day-header' },
                        h('div', { className: 'day-label' }, dayInfo.label),
                        h('div', { 
                            className: 'day-type-badge',
                            style: getDayTypeStyle(dayData.type)
                        }, dayData.type),
                        h('div', { className: 'day-hours' }, 
                            dayData.hours > 0 ? `${dayData.hours}u` : '-'
                        )
                    ),
                    h('div', { className: 'day-controls' },
                        h('div', { className: 'checkbox-control' },
                            h('label', { className: 'checkbox-label' },
                                h('input', {
                                    type: 'checkbox',
                                    checked: dayData.isFreeDag || false,
                                    onChange: (e) => handleTimeChange(day, 'isFreeDag', e.target.checked),
                                    className: 'form-checkbox'
                                }),
                                'Vrije dag'
                            )
                        ),
                        h('div', { className: 'time-inputs' },
                            h('input', {
                                type: 'time',
                                value: dayData.start === '--:--' ? '' : dayData.start,
                                onChange: (e) => handleTimeChange(day, 'start', e.target.value || '--:--'),
                                className: `form-input time-input ${dayData.isFreeDag ? 'disabled' : ''}`,
                                disabled: dayData.isFreeDag,
                                placeholder: '--:--'
                            }),
                            h('span', { className: 'time-separator' }, '—'),
                            h('input', {
                                type: 'time',
                                value: dayData.end === '--:--' ? '' : dayData.end,
                                onChange: (e) => handleTimeChange(day, 'end', e.target.value || '--:--'),
                                className: `form-input time-input ${dayData.isFreeDag ? 'disabled' : ''}`,
                                disabled: dayData.isFreeDag,
                                placeholder: '--:--'
                            })
                        )
                    )
                );
            };

            return h('div', { className: 'registration-step' },
                h('h2', null, 'Stap 2: Je werktijden'),
                h('p', { className: 'step-description' }, 
                    'Stel je standaard werktijden in. Deze kun je later altijd aanpassen in je instellingen.'
                ),

                // Day type legend
                h('div', { className: 'day-type-legend' },
                    h('h4', null, 'Uitleg dagtypen:'),
                    h('div', { className: 'legend-items' },
                        h('div', { className: 'legend-item' },
                            h('span', { 
                                className: 'legend-badge',
                                style: getDayTypeStyle(DAY_TYPES.NORMAAL)
                            }, 'Normaal'),
                            h('span', { className: 'legend-text' }, 'Reguliere werkdag')
                        ),
                        h('div', { className: 'legend-item' },
                            h('span', { 
                                className: 'legend-badge',
                                style: getDayTypeStyle(DAY_TYPES.VVO)
                            }, 'VVO'),
                            h('span', { className: 'legend-text' }, 'Vaste Vrije Ochtend (start ≥ 12:00)')
                        ),
                        h('div', { className: 'legend-item' },
                            h('span', { 
                                className: 'legend-badge',
                                style: getDayTypeStyle(DAY_TYPES.VVM)
                            }, 'VVM'),
                            h('span', { className: 'legend-text' }, 'Vaste Vrije Middag (eind ≤ 13:00)')
                        ),
                        h('div', { className: 'legend-item' },
                            h('span', { 
                                className: 'legend-badge',
                                style: getDayTypeStyle(DAY_TYPES.VVD)
                            }, 'VVD'),
                            h('span', { className: 'legend-text' }, 'Vaste Vrije Dag (hele dag vrij)')
                        )
                    )
                ),

                // Schedule type selection
                h('div', { className: 'schedule-type-section' },
                    h('h3', null, 'Type rooster'),
                    h('div', { className: 'radio-group' },
                        h('label', { className: 'radio-label' },
                            h('input', {
                                type: 'radio',
                                name: 'scheduleType',
                                value: 'fixed',
                                checked: scheduleType === 'fixed',
                                onChange: (e) => setScheduleType(e.target.value)
                            }),
                            h('span', null, 'Vast rooster (elke week hetzelfde)')
                        ),
                        h('label', { className: 'radio-label' },
                            h('input', {
                                type: 'radio',
                                name: 'scheduleType',
                                value: 'rotating',
                                checked: scheduleType === 'rotating',
                                onChange: (e) => setScheduleType(e.target.value)
                            }),
                            h('span', null, 'Wisselend rooster (week A en B)')
                        )
                    )
                ),

                // Week tabs for rotating schedule
                scheduleType === 'rotating' && h('div', { className: 'week-tabs' },
                    h('div', { className: 'tab-navigation' },
                        h('button', {
                            className: `btn tab-btn ${activeWeek === 'A' ? 'btn-primary active' : 'btn-secondary'}`,
                            onClick: () => setActiveWeek('A')
                        }, 'Week A'),
                        h('button', {
                            className: `btn tab-btn ${activeWeek === 'B' ? 'btn-primary active' : 'btn-secondary'}`,
                            onClick: () => setActiveWeek('B')
                        }, 'Week B')
                    )
                ),

                // Bulk time setter
                h('div', { className: 'bulk-time-setter' },
                    h('h4', null, 'Snelle instellingen voor alle dagen'),
                    h('div', { className: 'bulk-controls' },
                        h('input', {
                            type: 'time',
                            value: bulkTimes.start,
                            onChange: (e) => setBulkTimes({ ...bulkTimes, start: e.target.value }),
                            className: 'form-input time-input-wide'
                        }),
                        h('span', { className: 'time-separator' }, '—'),
                        h('input', {
                            type: 'time',
                            value: bulkTimes.end,
                            onChange: (e) => setBulkTimes({ ...bulkTimes, end: e.target.value }),
                            className: 'form-input time-input-wide'
                        }),
                        h('button', {
                            type: 'button',
                            onClick: handleBulkTimeSet,
                            className: 'btn btn-secondary bulk-apply-btn'
                        }, 'Toepassen op alle werkdagen')
                    )
                ),

                // Work hours grid
                h('div', { className: 'work-hours-grid' },
                    h('h3', null, `Werktijden${scheduleType === 'rotating' ? ` - Week ${activeWeek}` : ''}`),
                    ...WORK_DAYS.map(({ key }) => renderDayRow(key))
                )
            );
        };

        // =====================
        // Registration Settings Step Component
        // =====================
        const RegistrationSettingsStep = ({ formData, setFormData }) => {
            return h('div', { className: 'registration-step' },
                h('h2', null, 'Stap 3: Je voorkeuren'),
                h('p', { className: 'step-description' }, 
                    'Configureer je weergave-instellingen. Je kunt deze later altijd aanpassen.'
                ),

                h('div', { className: 'form-grid' },
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Kleurenschema'),
                        h('select', {
                            className: 'form-input',
                            value: formData.themeMode || 'light',
                            onChange: (e) => setFormData({ ...formData, themeMode: e.target.value })
                        },
                            h('option', { value: 'light' }, 'Lichte modus'),
                            h('option', { value: 'dark' }, 'Donkere modus')
                        ),
                        h('div', { className: 'form-help' }, 'Kies het kleurenschema dat je prettig vindt.')
                    ),

                    h('div', { className: 'form-group' },
                        h('label', { className: 'checkbox-label' },
                            h('input', {
                                type: 'checkbox',
                                checked: formData.weekendView !== false,
                                onChange: (e) => setFormData({ ...formData, weekendView: e.target.checked })
                            }),
                            'Weekenden weergeven in kalender'
                        ),
                        h('div', { className: 'form-help' }, 'Toon zaterdag en zondag in de kalenderweergave.')
                    ),

                    h('div', { className: 'form-group' },
                        h('label', { className: 'checkbox-label' },
                            h('input', {
                                type: 'checkbox',
                                checked: formData.teamView !== false,
                                onChange: (e) => setFormData({ ...formData, teamView: e.target.checked })
                            }),
                            'Alleen eigen team weergeven'
                        ),
                        h('div', { className: 'form-help' }, 'Filter de kalenderweergave op alleen jouw teamleden.')
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
