<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nieuwe Gebruiker Registratie - Verlofrooster</title>
    <link rel="icon" type="image/svg+xml" href="../../../../Icoon/favicon.svg">
    <script src="https://cdn.tailwindcss.com"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="../js/config/configLijst.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f4f7fa;
            min-height: 100vh;
            margin: 0;
        }

        .header-gradient {
            background-color: #2c3e50;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .registration-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            padding: 2rem;
        }

        .step-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            padding: 0 1rem;
        }

        .step {
            display: flex;
            align-items: center;
            position: relative;
        }

        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            transition: all 0.3s ease;
            flex-shrink: 0;
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
            margin: 0 1rem;
        }

        .step-connector.completed {
            background-color: #27ae60;
        }

        .form-input, .form-select {
            border-radius: 6px;
            border: 1px solid #d1d5db;
            padding: 0.75rem 1rem;
            transition: all 0.2s ease;
            background: white;
            width: 100%;
            box-sizing: border-box;
        }

        .form-input:focus, .form-select:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }

        .form-input:disabled,
        .form-input[readonly] {
            background-color: #f8f9fa;
            color: #6c757d;
            cursor: not-allowed;
            border-color: #ced4da;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: none;
            cursor: pointer;
        }

        .btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .btn-primary {
            background-color: #4a90e2;
            color: white;
            border-color: #4a90e2;
        }

        .btn-primary:hover:not(:disabled) {
            background-color: #357abd;
            border-color: #357abd;
        }

        .btn-secondary {
            background-color: #f0f0f0;
            color: #333;
            border-color: #ccc;
        }

        .btn-success {
            background-color: #27ae60;
            color: white;
            border-color: #27ae60;
        }

        .btn-success:hover:not(:disabled) {
            background-color: #229954;
            border-color: #229954;
        }

        .profile-pic-container {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease;
            overflow: hidden;
            margin: 0 auto;
        }

        .schedule-table {
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .schedule-table th {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 16px;
            font-weight: 600;
            color: #475569;
        }

        .schedule-table td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
        }

        .status-message {
            border-radius: 8px;
            padding: 12px 16px;
            margin: 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .status-success {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #047857;
        }

        .status-error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #dc2626;
        }

        .loading-spinner {
            border: 2px solid #f3f4f6;
            border-top: 2px solid #4f46e5;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .gradient-text {
            color: #2c3e50;
            font-weight: 600;
        }

        /* Fix for responsive grid layout */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        @media (min-width: 768px) {
            .form-grid {
                grid-template-columns: 1fr 1fr;
            }
            
            .form-grid-full {
                grid-column: 1 / -1;
            }
        }

        /* Ensure proper spacing and alignment */
        .form-field {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .form-field label {
            font-weight: 500;
            color: #374151;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div id="registratie-app"></div>

    <script type="module">
        // Globale variabelen voor alle modules
        let getLijstConfig, krijgBeschikbareLijsten;
        let trimLoginNaamPrefix, getProfilePhotoUrl, isGebruikerAdmin;
        let hasAccessToSection, isUserInGroup, getUserAuthorizedSections;

        // Functie om alle benodigde modules te laden
        async function laadAlleModules() {
            console.log('Using fallback configuration immediately');
            
            if (!window.appConfiguratie) {
                window.appConfiguratie = {
                    instellingen: {
                        siteUrl: '/sites/MulderT/CustomPW/Verlof/'
                    }
                };
            }
            
            getLijstConfig = (identifier) => {
                const configs = {
                    Teams: { lijstTitel: 'Teams', lijstId: null },
                    keuzelijstFuncties: { lijstTitel: 'Functies', lijstId: null },
                    Medewerkers: { lijstTitel: 'Medewerkers', lijstId: null },
                    gebruikersInstellingen: { lijstTitel: 'GebruikersInstellingen', lijstId: null },
                    UrenPerWeek: { lijstTitel: 'UrenPerWeek', lijstId: null }
                };
                return configs[identifier] || null;
            };
            
            krijgBeschikbareLijsten = () => ['Teams', 'keuzelijstFuncties', 'Medewerkers', 'gebruikersInstellingen', 'UrenPerWeek'];
            
            console.log('Fallback configuratie geladen');

            try {
                const sharepointService = await import('../js/services/sharepointService.js');
                
                trimLoginNaamPrefix = (loginNaam) => {
                    if (!loginNaam || typeof loginNaam !== 'string') return loginNaam;
                    const parts = loginNaam.split('\\');
                    return parts.length > 1 ? parts[parts.length - 1] : loginNaam;
                };
                
                console.log('sharepointService.js succesvol geladen');
            } catch (error) {
                console.warn('sharepointService.js loading failed:', error);
            }
        }

        // React alias
        const { useState, useEffect, useCallback } = React;
        const h = React.createElement;

        // Constanten
        const REGISTRATIE_SITE_URL = "/sites/MulderT/CustomPW/Verlof/";
        const DAGEN_VAN_DE_WEEK_DISPLAY = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];

        // SharePoint Service voor registratie
        class RegistratieService {
            constructor() {
                this.siteUrl = null;
                this.sharepointService = null;
            }

            async initialiseer() {
                try {
                    this.sharepointService = await import('../js/services/sharepointService.js');
                    this.siteUrl = window.appConfiguratie?.instellingen?.siteUrl || REGISTRATIE_SITE_URL;
                    console.log('RegistratieService geinitialiseerd met siteUrl:', this.siteUrl);
                    return true;
                } catch (error) {
                    console.error('Fout bij initialiseren van RegistratieService:', error);
                    throw error;
                }
            }

            async haalLijstItemsOp(lijstIdentifier) {
                try {
                    return await this.sharepointService.fetchSharePointList(lijstIdentifier);
                } catch (error) {
                    console.error(`Fout bij ophalen van lijst ${lijstIdentifier}:`, error);
                    throw error;
                }
            }

            async krijgHuidigeGebruiker() {
                try {
                    return await this.sharepointService.getCurrentUser();
                } catch (error) {
                    console.error('Fout bij ophalen huidige gebruiker:', error);
                    throw error;
                }
            }

            async registreerNieuweGebruiker(registratieData) {
                try {
                    const { profiel, werkrooster, instellingen } = registratieData;

                    // Helper function to format date properly for SharePoint
                    const formatDateForSharePoint = (dateString) => {
                        if (!dateString) return null;
                        const [year, month, day] = dateString.split('-');
                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0, 0);
                        return date.toISOString();
                    };

                    // 1. Create employee record
                    const medewerkerData = {
                        Naam: profiel.naam,
                        Username: profiel.username,
                        E_x002d_mail: profiel.email,
                        Geboortedatum: formatDateForSharePoint(profiel.geboortedatum),
                        Team: profiel.team,
                        Functie: profiel.functie
                    };

                    const savedMedewerker = await this.sharepointService.createSharePointListItem('Medewerkers', medewerkerData);
                    console.log('Medewerker aangemaakt:', savedMedewerker);

                    // 2. Create work schedule record
                    const werkroosterData = {
                        MedewerkerID: profiel.username,
                        ...werkrooster
                    };

                    const savedWerkrooster = await this.sharepointService.createSharePointListItem('UrenPerWeek', werkroosterData);
                    console.log('Werkrooster aangemaakt:', savedWerkrooster);

                    // 3. Create user settings record (without Thema field)
                    const instellingenData = {
                        Title: profiel.username,
                        EigenTeamWeergeven: instellingen.eigenTeam,
                        WeekendenWeergeven: instellingen.weekenden
                        // Removed Thema field as it doesn't exist in SharePoint list
                    };

                    const savedInstellingen = await this.sharepointService.createSharePointListItem('gebruikersInstellingen', instellingenData);
                    console.log('Instellingen aangemaakt:', savedInstellingen);

                    return {
                        medewerker: savedMedewerker,
                        werkrooster: savedWerkrooster,
                        instellingen: savedInstellingen
                    };

                } catch (error) {
                    console.error('Fout bij registreren nieuwe gebruiker:', error);
                    throw error;
                }
            }
        }

        // Globale service instantie
        const registratieService = new RegistratieService();

        // Hulpfuncties
        function genereerInitialen(naam) {
            if (!naam) return 'NG';
            const delen = naam.split(' ');
            if (delen.length >= 2) {
                return `${delen[0].charAt(0)}${delen[delen.length - 1].charAt(0)}`.toUpperCase();
            }
            return naam.substring(0, 2).toUpperCase();
        }

        // Header Component
        function HeaderComponent({ currentStep }) {
            return h('div', { className: 'header-gradient text-white p-6 md:p-8' },
                h('div', { className: 'container mx-auto max-w-4xl' },
                    h('div', { className: 'flex justify-between items-center' },
                        h('div', null,
                            h('h1', { className: 'text-3xl md:text-4xl font-bold' }, 'Nieuwe Gebruiker Registratie'),
                            h('p', { className: 'mt-2 text-blue-100 text-sm md:text-base' },
                                `Stap ${currentStep} van 3: Stel uw account in voor het Verlofrooster systeem`
                            )
                        ),
                        h('a', { 
                            href: '../../../verlofRooster.aspx',
                            className: 'btn btn-secondary text-sm'
                        },
                            h('svg', { 
                                className: 'w-4 h-4', 
                                fill: 'none', 
                                stroke: 'currentColor', 
                                viewBox: '0 0 24 24'
                            },
                                h('path', { 
                                    strokeLinecap: 'round', 
                                    strokeLinejoin: 'round', 
                                    strokeWidth: 2, 
                                    d: 'M19 12H5M12 19l-7-7 7-7'
                                })
                            ),
                            'Terug naar Rooster'
                        )
                    )
                )
            );
        }

        // Step Indicator Component
        function StepIndicator({ currentStep }) {
            const steps = [
                { number: 1, title: 'Profiel' },
                { number: 2, title: 'Werktijden' },
                { number: 3, title: 'Instellingen' }
            ];

            return h('div', { className: 'step-indicator' },
                steps.map((step, index) => [
                    h('div', { key: step.number, className: 'step' },
                        h('div', { 
                            className: `step-number ${
                                currentStep === step.number ? 'active' :
                                currentStep > step.number ? 'completed' : 'inactive'
                            }`
                        }, currentStep > step.number ? '✓' : step.number),
                        h('span', { 
                            className: `ml-2 text-sm font-medium ${
                                currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                            }`
                        }, step.title)
                    ),
                    index < steps.length - 1 && h('div', { 
                        key: `connector-${step.number}`,
                        className: `step-connector ${currentStep > step.number ? 'completed' : ''}`
                    })
                ]).flat().filter(Boolean)
            );
        }

        // Status Bericht Component
        function StatusBericht({ bericht, type, onSluit }) {
            if (!bericht) return null;

            const iconMap = {
                success: '✓',
                error: '!',
                info: 'i',
                warning: '!'
            };

            return h('div', { className: `status-message status-${type}` },
                h('span', { className: 'font-bold' }, iconMap[type] || 'i'),
                h('span', null, bericht),
                onSluit && h('button', {
                    className: 'ml-auto text-current hover:opacity-70',
                    onClick: onSluit
                }, '×')
            );
        }

        // Stap 1: Profiel Component
        function ProfielStap({ formData, setFormData, teams, functies, gebruiker }) {
            useEffect(() => {
                // Only pre-fill username and email from current user, not the name
                if (gebruiker && !formData.username && !formData.email) {
                    // Extract clean username from SharePoint LoginName
                    let cleanUsername = '';
                    if (gebruiker.LoginName) {
                        // Remove claim prefix if present (i:0#.w|)
                        if (gebruiker.LoginName.startsWith('i:0#.w|')) {
                            cleanUsername = gebruiker.LoginName.replace('i:0#.w|', '');
                        } else {
                            cleanUsername = gebruiker.LoginName;
                        }
                    }
                    
                    setFormData(prev => ({
                        ...prev,
                        username: cleanUsername,
                        email: gebruiker.Email || ''
                        // Don't prefill naam - let user enter it manually
                    }));
                }
            }, [gebruiker, formData.username, formData.email, setFormData]);

            return h('div', { className: 'space-y-6' },
                h('div', { className: 'text-center mb-8' },
                    h('h2', { className: 'text-2xl font-bold gradient-text mb-2' }, 'Persoonlijke Gegevens'),
                    h('p', { className: 'text-gray-600' }, 'Vul uw persoonlijke informatie in voor uw profiel')
                ),

                h('div', { className: 'flex justify-center mb-6' },
                    h('div', { className: 'profile-pic-container' },
                        h('div', { 
                            className: 'text-white text-2xl font-bold w-full h-full flex items-center justify-center'
                        },
                            genereerInitialen(formData.naam)
                        )
                    )
                ),

                h('div', { className: 'form-grid' },
                    h('div', { className: 'form-grid-full' },
                        h('div', { className: 'form-field' },
                            h('label', null, 'Volledige Naam *'),
                            h('input', {
                                type: 'text',
                                className: 'form-input',
                                value: formData.naam,
                                onChange: (e) => setFormData(prev => ({ ...prev, naam: e.target.value })),
                                placeholder: 'Bijv. Jan de Vries'
                            })
                        )
                    ),
                    h('div', null,
                        h('div', { className: 'form-field' },
                            h('label', null, 'Gebruikersnaam'),
                            h('input', {
                                type: 'text',
                                className: 'form-input',
                                value: formData.username,
                                readOnly: true,
                                title: 'Automatisch ingevuld vanuit SharePoint'
                            })
                        )
                    ),
                    h('div', null,
                        h('div', { className: 'form-field' },
                            h('label', null, 'E-mailadres'),
                            h('input', {
                                type: 'email',
                                className: 'form-input',
                                value: formData.email,
                                readOnly: true,
                                title: 'Automatisch ingevuld vanuit SharePoint'
                            })
                        )
                    ),
                    h('div', null,
                        h('div', { className: 'form-field' },
                            h('label', null, 'Geboortedatum *'),
                            h('input', {
                                type: 'date',
                                className: 'form-input',
                                value: formData.geboortedatum,
                                onChange: (e) => setFormData(prev => ({ ...prev, geboortedatum: e.target.value }))
                            })
                        )
                    ),
                    h('div', null,
                        h('div', { className: 'form-field' },
                            h('label', null, 'Team *'),
                            h('select', {
                                className: 'form-select',
                                value: formData.team,
                                onChange: (e) => setFormData(prev => ({ ...prev, team: e.target.value }))
                            },
                                h('option', { value: '' }, 'Selecteer een team...'),
                                teams.map(team =>
                                    h('option', { key: team.ID, value: team.Naam }, team.Naam)
                                )
                            )
                        )
                    ),
                    h('div', null,
                        h('div', { className: 'form-field' },
                            h('label', null, 'Functie *'),
                            h('select', {
                                className: 'form-select',
                                value: formData.functie,
                                onChange: (e) => setFormData(prev => ({ ...prev, functie: e.target.value }))
                            },
                                h('option', { value: '' }, 'Selecteer een functie...'),
                                functies.map(functie =>
                                    h('option', { key: functie.ID, value: functie.Title }, functie.Title)
                                )
                            )
                        )
                    )
                ),

                h('div', { className: 'text-xs text-gray-500 mt-4' },
                    '* Verplichte velden'
                )
            );
        }

        // Stap 2: Werktijden Component
        function WerktijdenStap({ formData, setFormData }) {
            const [bulkStartTime, setBulkStartTime] = useState('08:00');
            const [bulkEndTime, setBulkEndTime] = useState('17:00');

            // Helper function to calculate hours worked
            const calculateHoursWorked = (startTime, endTime) => {
                if (!startTime || !endTime) return '-';
                
                const start = new Date(`2000-01-01T${startTime}:00`);
                const end = new Date(`2000-01-01T${endTime}:00`);
                
                if (end <= start) return '-';
                
                const diffMs = end - start;
                const diffHours = diffMs / (1000 * 60 * 60);
                
                return diffHours % 1 === 0 ? diffHours.toString() : diffHours.toFixed(1);
            };

            // Helper function to determine work day type
            const determineWorkDayType = (startTime, endTime) => {
                if (!startTime || !endTime) return 'ZV';
                
                const start = new Date(`2000-01-01T${startTime}:00`);
                const end = new Date(`2000-01-01T${endTime}:00`);
                
                const startMinutes = start.getHours() * 60 + start.getMinutes();
                const endMinutes = end.getHours() * 60 + end.getMinutes();
                
                const morningEnd = 12 * 60 + 59;
                const afternoonStart = 13 * 60;
                const fullDayStart = 10 * 60;
                const fullDayEnd = 15 * 60;
                
                if (startMinutes < fullDayStart && endMinutes > fullDayEnd) {
                    return 'VVD';
                }
                
                const workedMorning = startMinutes <= morningEnd;
                const workedAfternoon = endMinutes > afternoonStart;
                
                if (workedMorning && !workedAfternoon) {
                    return 'VVM';
                }
                
                if (!workedMorning && workedAfternoon) {
                    return 'VVO';
                }
                
                if (workedMorning && workedAfternoon) {
                    return 'VVD';
                }
                
                return 'ZV';
            };

            const getWorkDayTypeDisplay = (type) => {
                switch (type) {
                    case 'VVD': return 'Volledige werkdag';
                    case 'VVO': return 'Vrije ochtend';
                    case 'VVM': return 'Vrije middag';
                    case 'ZV': return 'Zittingsvrij';
                    default: return type || '-';
                }
            };

            const handleSetAllTimes = () => {
                const updatedFormData = { ...formData };
                
                DAGEN_VAN_DE_WEEK_DISPLAY.forEach(dag => {
                    const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                    updatedFormData[`${dagCapitalized}Start`] = bulkStartTime;
                    updatedFormData[`${dagCapitalized}Eind`] = bulkEndTime;
                    updatedFormData[`${dagCapitalized}Soort`] = determineWorkDayType(bulkStartTime, bulkEndTime);
                });
                
                setFormData(updatedFormData);
            };

            const handleClearAllTimes = () => {
                const updatedFormData = { ...formData };
                
                DAGEN_VAN_DE_WEEK_DISPLAY.forEach(dag => {
                    const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                    updatedFormData[`${dagCapitalized}Start`] = '';
                    updatedFormData[`${dagCapitalized}Eind`] = '';
                    updatedFormData[`${dagCapitalized}Soort`] = 'ZV';
                });
                
                setFormData(updatedFormData);
            };

            const handleTimeChange = (dag, type, value) => {
                const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                const updatedFormData = { ...formData };
                updatedFormData[`${dagCapitalized}${type}`] = value;
                
                // Auto-calculate day type when both times are set
                const startTime = type === 'Start' ? value : formData[`${dagCapitalized}Start`];
                const endTime = type === 'Eind' ? value : formData[`${dagCapitalized}Eind`];
                updatedFormData[`${dagCapitalized}Soort`] = determineWorkDayType(startTime, endTime);
                
                setFormData(updatedFormData);
            };

            return h('div', { className: 'space-y-6' },
                h('div', { className: 'text-center mb-8' },
                    h('h2', { className: 'text-2xl font-bold gradient-text mb-2' }, 'Standaard Werktijden'),
                    h('p', { className: 'text-gray-600' }, 'Stel uw standaard werkrooster in voor elke weekdag')
                ),

                // Bulk time setting controls
                h('div', { className: 'mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg' },
                    h('h4', { className: 'text-sm font-medium mb-3 text-blue-800' }, 'Snelle Tijdsinstellingen'),
                    h('div', { className: 'flex flex-col sm:flex-row gap-3 items-start sm:items-center' },
                        h('div', { className: 'flex gap-2 items-center' },
                            h('label', { className: 'text-sm text-blue-700 font-medium' }, 'Van:'),
                            h('input', {
                                type: 'time',
                                className: 'form-input text-sm w-24',
                                value: bulkStartTime,
                                onChange: (e) => setBulkStartTime(e.target.value)
                            }),
                            h('span', { className: 'text-blue-600' }, 'tot'),
                            h('input', {
                                type: 'time',
                                className: 'form-input text-sm w-24',
                                value: bulkEndTime,
                                onChange: (e) => setBulkEndTime(e.target.value)
                            })
                        ),
                        h('div', { className: 'flex gap-2' },
                            h('button', {
                                className: 'btn btn-primary text-sm px-3 py-2',
                                onClick: handleSetAllTimes,
                                disabled: !bulkStartTime || !bulkEndTime
                            },
                                'Alles Instellen'
                            ),
                            h('button', {
                                className: 'btn btn-secondary text-sm px-3 py-2',
                                onClick: handleClearAllTimes
                            },
                                'Alles Wissen'
                            )
                        )
                    ),
                    h('p', { className: 'text-xs text-blue-600 mt-2' },
                        'Gebruik "Alles Instellen" om alle dagen dezelfde werktijden te geven, of pas individuele dagen hieronder aan.'
                    )
                ),

                // Legend for day types
                h('div', { className: 'mb-4 p-3 bg-gray-50 rounded-lg' },
                    h('h4', { className: 'text-sm font-medium mb-2 text-gray-700' }, 'Dagtype Legenda:'),
                    h('div', { className: 'flex flex-wrap gap-2 text-xs' },
                        h('span', { className: 'inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800' },
                            h('span', { className: 'font-bold mr-1' }, 'VVD'),
                            'Volledige werkdag'
                        ),
                        h('span', { className: 'inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800' },
                            h('span', { className: 'font-bold mr-1' }, 'VVO'),
                            'Vrije ochtend'
                        ),
                        h('span', { className: 'inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800' },
                            h('span', { className: 'font-bold mr-1' }, 'VVM'),
                            'Vrije middag'
                        ),
                        h('span', { className: 'inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800' },
                            h('span', { className: 'font-bold mr-1' }, 'ZV'),
                            'Zittingsvrij'
                        )
                    )
                ),

                h('div', { className: 'schedule-table overflow-x-auto' },
                    h('table', { className: 'w-full' },
                        h('thead', null,
                            h('tr', null,
                                h('th', { className: 'text-left' }, 'Dag'),
                                h('th', { className: 'text-left' }, 'Werktijden'),
                                h('th', { className: 'text-center' }, 'Uren'),
                                h('th', { className: 'text-left' }, 'Dagtype')
                            )
                        ),
                        h('tbody', null,
                            DAGEN_VAN_DE_WEEK_DISPLAY.map(dag => {
                                const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                                const startTijd = formData[`${dagCapitalized}Start`] || '';
                                const eindTijd = formData[`${dagCapitalized}Eind`] || '';
                                const hoursWorked = calculateHoursWorked(startTijd, eindTijd);
                                const dayType = formData[`${dagCapitalized}Soort`] || determineWorkDayType(startTijd, eindTijd);

                                return h('tr', { key: dag, className: 'hover:bg-gray-50' },
                                    h('td', { className: 'font-medium py-3' }, dag),
                                    h('td', { className: 'py-3' },
                                        h('div', { className: 'flex gap-2 items-center' },
                                            h('input', {
                                                type: 'time',
                                                className: 'form-input text-sm w-24',
                                                value: startTijd,
                                                onChange: (e) => handleTimeChange(dag, 'Start', e.target.value)
                                            }),
                                            h('span', { className: 'text-gray-500' }, '-'),
                                            h('input', {
                                                type: 'time',
                                                className: 'form-input text-sm w-24',
                                                value: eindTijd,
                                                onChange: (e) => handleTimeChange(dag, 'Eind', e.target.value)
                                            })
                                        )
                                    ),
                                    h('td', { className: 'py-3 text-center' },
                                        hoursWorked !== '-' ? `${hoursWorked}u` : '-'
                                    ),
                                    h('td', { className: 'py-3' },
                                        h('span', { 
                                            className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                dayType === 'VVD' ? 'bg-green-100 text-green-800' :
                                                dayType === 'VVO' ? 'bg-blue-100 text-blue-800' :
                                                dayType === 'VVM' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`
                                        },
                                            h('span', { className: 'mr-1 text-xs font-bold' }, dayType),
                                            getWorkDayTypeDisplay(dayType)
                                        )
                                    )
                                );
                            })
                        )
                    )
                )
            );
        }

        // Stap 3: Instellingen Component
        function InstellingenStap({ formData, setFormData }) {
            return h('div', { className: 'space-y-6' },
                h('div', { className: 'text-center mb-8' },
                    h('h2', { className: 'text-2xl font-bold gradient-text mb-2' }, 'Rooster Voorkeuren'),
                    h('p', { className: 'text-gray-600' }, 'Personaliseer de weergave van uw verlofrooster')
                ),

                h('div', { className: 'space-y-6' },
                    h('div', { className: 'flex items-center justify-between p-6 rounded-lg bg-gray-50' },
                        h('div', null,
                            h('label', { className: 'text-base font-medium text-gray-700' }, 
                                'Standaard alleen eigen team tonen'
                            ),
                            h('p', { className: 'text-sm text-gray-500 mt-1' },
                                'Toon alleen medewerkers van uw eigen team in het rooster bij opstarten'
                            )
                        ),
                        h('label', { className: 'relative inline-flex items-center cursor-pointer' },
                            h('input', {
                                type: 'checkbox',
                                className: 'sr-only',
                                checked: formData.eigenTeam,
                                onChange: (e) => setFormData(prev => ({ ...prev, eigenTeam: e.target.checked }))
                            }),
                            h('div', { 
                                className: `w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`
                            })
                        )
                    ),

                    h('div', { className: 'flex items-center justify-between p-6 rounded-lg bg-gray-50' },
                        h('div', null,
                            h('label', { className: 'text-base font-medium text-gray-700' }, 
                                'Weekenden weergeven'
                            ),
                            h('p', { className: 'text-sm text-gray-500 mt-1' },
                                'Toon zaterdag en zondag in het rooster'
                            )
                        ),
                        h('label', { className: 'relative inline-flex items-center cursor-pointer' },
                            h('input', {
                                type: 'checkbox',
                                className: 'sr-only',
                                checked: formData.weekenden,
                                onChange: (e) => setFormData(prev => ({ ...prev, weekenden: e.target.checked }))
                            }),
                            h('div', { 
                                className: `w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`
                            })
                        )
                    ),

                    h('div', { className: 'p-6 rounded-lg bg-gray-50' },
                        h('label', { className: 'block text-base font-medium mb-3 text-gray-700' }, 'Thema Voorkeur'),
                        h('select', {
                            className: 'form-select w-full max-w-xs',
                            value: formData.thema,
                            onChange: (e) => setFormData(prev => ({ ...prev, thema: e.target.value }))
                        },
                            h('option', { value: 'light' }, 'Licht Thema'),
                            h('option', { value: 'dark' }, 'Donker Thema (Binnenkort beschikbaar)')
                        ),
                        h('p', { className: 'text-sm text-gray-500 mt-2' },
                            'Het donkere thema wordt in een toekomstige update toegevoegd.'
                        )
                    )
                )
            );
        }

        // Overzicht Component
        function OverzichtStap({ registratieData }) {
            const { profiel, werkrooster, instellingen } = registratieData;

            const renderWerktijdenOverzicht = () => {
                return DAGEN_VAN_DE_WEEK_DISPLAY.map(dag => {
                    const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                    const startTijd = werkrooster[`${dagCapitalized}Start`];
                    const eindTijd = werkrooster[`${dagCapitalized}Eind`];
                    
                    return h('div', { key: dag, className: 'flex justify-between py-2 border-b border-gray-100' },
                        h('span', { className: 'font-medium' }, dag),
                        h('span', null, 
                            startTijd && eindTijd 
                                ? `${startTijd} - ${eindTijd}`
                                : 'Niet ingeroosterd'
                        )
                    );
                });
            };

            return h('div', { className: 'space-y-8' },
                h('div', { className: 'text-center mb-8' },
                    h('h2', { className: 'text-2xl font-bold gradient-text mb-2' }, 'Controleer Uw Gegevens'),
                    h('p', { className: 'text-gray-600' }, 'Controleer onderstaande informatie voordat u uw account aanmaakt')
                ),

                h('div', { className: 'grid md:grid-cols-2 gap-8' },
                    // Profiel Overzicht
                    h('div', { className: 'bg-gray-50 p-6 rounded-lg' },
                        h('h3', { className: 'text-lg font-semibold mb-4 text-gray-800' }, 'Profiel Gegevens'),
                        h('div', { className: 'space-y-3' },
                            h('div', { className: 'flex justify-between' },
                                h('span', { className: 'font-medium' }, 'Naam:'),
                                h('span', null, profiel.naam)
                            ),
                            h('div', { className: 'flex justify-between' },
                                h('span', { className: 'font-medium' }, 'Gebruikersnaam:'),
                                h('span', null, profiel.username)
                            ),
                            h('div', { className: 'flex justify-between' },
                                h('span', { className: 'font-medium' }, 'E-mail:'),
                                h('span', null, profiel.email)
                            ),
                            h('div', { className: 'flex justify-between' },
                                h('span', { className: 'font-medium' }, 'Geboortedatum:'),
                                h('span', null, profiel.geboortedatum)
                            ),
                            h('div', { className: 'flex justify-between' },
                                h('span', { className: 'font-medium' }, 'Team:'),
                                h('span', null, profiel.team)
                            ),
                            h('div', { className: 'flex justify-between' },
                                h('span', { className: 'font-medium' }, 'Functie:'),
                                h('span', null, profiel.functie)
                            )
                        )
                    ),

                    // Instellingen Overzicht
                    h('div', { className: 'bg-gray-50 p-6 rounded-lg' },
                        h('h3', { className: 'text-lg font-semibold mb-4 text-gray-800' }, 'Rooster Voorkeuren'),
                        h('div', { className: 'space-y-3' },
                            h('div', { className: 'flex justify-between' },
                                h('span', { className: 'font-medium' }, 'Thema:'),
                                h('span', null, instellingen.thema === 'light' ? 'Licht' : 'Donker')
                            ),
                            h('div', { className: 'flex justify-between' },
                                h('span', { className: 'font-medium' }, 'Alleen eigen team:'),
                                h('span', null, instellingen.eigenTeam ? 'Ja' : 'Nee')
                            ),
                            h('div', { className: 'flex justify-between' },
                                h('span', { className: 'font-medium' }, 'Weekenden tonen:'),
                                h('span', null, instellingen.weekenden ? 'Ja' : 'Nee')
                            )
                        )
                    )
                ),

                // Werktijden Overzicht
                h('div', { className: 'bg-gray-50 p-6 rounded-lg' },
                    h('h3', { className: 'text-lg font-semibold mb-4 text-gray-800' }, 'Standaard Werktijden'),
                    h('div', { className: 'space-y-1' },
                        renderWerktijdenOverzicht()
                    )
                )
            );
        }

        // Hoofd Registratie App Component
        function RegistratieApp() {
            const [isLoading, setIsLoading] = useState(true);
            const [error, setError] = useState(null);
            const [currentStep, setCurrentStep] = useState(1);
            const [isSubmitting, setIsSubmitting] = useState(false);
            const [statusBericht, setStatusBericht] = useState(null);

            // Data state
            const [gebruiker, setGebruiker] = useState(null);
            const [teams, setTeams] = useState([]);
            const [functies, setFuncties] = useState([]);

            // Form data for all steps
            const [registratieData, setRegistratieData] = useState({
                // Profiel data
                naam: '',
                username: '',
                email: '',
                geboortedatum: '',
                team: '',
                functie: '',
                
                // Werkrooster data
                MaandagStart: '',
                MaandagEind: '',
                MaandagSoort: 'ZV',
                DinsdagStart: '',
                DinsdagEind: '',
                DinsdagSoort: 'ZV',
                WoensdagStart: '',
                WoensdagEind: '',
                WoensdagSoort: 'ZV',
                DonderdagStart: '',
                DonderdagEind: '',
                DonderdagSoort: 'ZV',
                VrijdagStart: '',
                VrijdagEind: '',
                VrijdagSoort: 'ZV',
                
                // Instellingen data
                thema: 'light',
                eigenTeam: false,
                weekenden: true
            });

            const toonStatusBericht = useCallback((bericht, type = 'info') => {
                setStatusBericht({
                    bericht,
                    type,
                    onSluit: () => setStatusBericht(null)
                });

                if (type !== 'error') {
                    setTimeout(() => {
                        setStatusBericht(null);
                    }, 5000);
                }
            }, []);

            // Data loading
            useEffect(() => {
                async function initialiseerApp() {
                    try {
                        setIsLoading(true);
                        setError(null);

                        await laadAlleModules();
                        await registratieService.initialiseer();

                        const gebruikerInfo = await registratieService.krijgHuidigeGebruiker();
                        console.log('Loaded user:', gebruikerInfo);
                        
                        if (gebruikerInfo) {
                            setGebruiker({
                                LoginName: gebruikerInfo.LoginName || '',
                                Email: gebruikerInfo.Email || '',
                                Title: gebruikerInfo.Title || ''
                            });
                        }

                        try {
                            const [teamsData, functiesData] = await Promise.all([
                                registratieService.haalLijstItemsOp("Teams"),
                                registratieService.haalLijstItemsOp("keuzelijstFuncties")
                            ]);
                            
                            setTeams(teamsData || []);
                            setFuncties(functiesData || []);
                        } catch (error) {
                            console.warn('Could not load teams/functions:', error);
                            setTeams([]);
                            setFuncties([]);
                        }

                    } catch (error) {
                        console.error('[RegistratieApp] Initialization error:', error);
                        setError(error.message);
                    } finally {
                        setIsLoading(false);
                    }
                }

                initialiseerApp();
            }, []);

            // Validation functions
            const validateStep1 = () => {
                const { naam, geboortedatum, team, functie } = registratieData;
                return naam && geboortedatum && team && functie;
            };

            const validateStep2 = () => {
                // At least one day should have working hours or all should be empty
                return true; // Optional step, always valid
            };

            const validateStep3 = () => {
                return true; // Always valid as it has defaults
            };

            // Step navigation
            const handleNext = () => {
                let isValid = false;
                
                switch (currentStep) {
                    case 1:
                        isValid = validateStep1();
                        if (!isValid) {
                            toonStatusBericht('Vul alle verplichte velden in om door te gaan.', 'warning');
                            return;
                        }
                        break;
                    case 2:
                        isValid = validateStep2();
                        break;
                    case 3:
                        isValid = validateStep3();
                        break;
                }

                if (isValid && currentStep < 4) {
                    setCurrentStep(currentStep + 1);
                }
            };

            const handlePrevious = () => {
                if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                }
            };

            const handleSubmit = async () => {
                if (!validateStep1() || !validateStep2() || !validateStep3()) {
                    toonStatusBericht('Controleer alle stappen en probeer opnieuw.', 'error');
                    return;
                }

                setIsSubmitting(true);
                try {
                    // Organize data for submission
                    const submissionData = {
                        profiel: {
                            naam: registratieData.naam,
                            username: registratieData.username,
                            email: registratieData.email,
                            geboortedatum: registratieData.geboortedatum,
                            team: registratieData.team,
                            functie: registratieData.functie
                        },
                        werkrooster: {
                            MaandagStart: registratieData.MaandagStart,
                            MaandagEind: registratieData.MaandagEind,
                            MaandagSoort: registratieData.MaandagSoort,
                            DinsdagStart: registratieData.DinsdagStart,
                            DinsdagEind: registratieData.DinsdagEind,
                            DinsdagSoort: registratieData.DinsdagSoort,
                            WoensdagStart: registratieData.WoensdagStart,
                            WoensdagEind: registratieData.WoensdagEind,
                            WoensdagSoort: registratieData.WoensdagSoort,
                            DonderdagStart: registratieData.DonderdagStart,
                            DonderdagEind: registratieData.DonderdagEind,
                            DonderdagSoort: registratieData.DonderdagSoort,
                            VrijdagStart: registratieData.VrijdagStart,
                            VrijdagEind: registratieData.VrijdagEind,
                            VrijdagSoort: registratieData.VrijdagSoort
                        },
                        instellingen: {
                            thema: registratieData.thema,
                            eigenTeam: registratieData.eigenTeam,
                            weekenden: registratieData.weekenden
                        }
                    };

                    await registratieService.registreerNieuweGebruiker(submissionData);
                    toonStatusBericht('Registratie succesvol! Uw account is aangemaakt.', 'success');
                    
                    // Redirect after successful registration
                    setTimeout(() => {
                        window.location.href = 'gInstellingen.aspx';
                    }, 2000);

                } catch (error) {
                    console.error('Registration error:', error);
                    toonStatusBericht(`Fout bij registratie: ${error.message}`, 'error');
                } finally {
                    setIsSubmitting(false);
                }
            };

            // Render step content
            const renderStepContent = () => {
                switch (currentStep) {
                    case 1:
                        return h(ProfielStap, {
                            formData: registratieData,
                            setFormData: setRegistratieData,
                            teams,
                            functies,
                            gebruiker
                        });
                    case 2:
                        return h(WerktijdenStap, {
                            formData: registratieData,
                            setFormData: setRegistratieData
                        });
                    case 3:
                        return h(InstellingenStap, {
                            formData: registratieData,
                            setFormData: setRegistratieData
                        });
                    case 4:
                        return h(OverzichtStap, {
                            registratieData: {
                                profiel: {
                                    naam: registratieData.naam,
                                    username: registratieData.username,
                                    email: registratieData.email,
                                    geboortedatum: registratieData.geboortedatum,
                                    team: registratieData.team,
                                    functie: registratieData.functie
                                },
                                werkrooster: {
                                    MaandagStart: registratieData.MaandagStart,
                                    MaandagEind: registratieData.MaandagEind,
                                    DinsdagStart: registratieData.DinsdagStart,
                                    DinsdagEind: registratieData.DinsdagEind,
                                    WoensdagStart: registratieData.WoensdagStart,
                                    WoensdagEind: registratieData.WoensdagEind,
                                    DonderdagStart: registratieData.DonderdagStart,
                                    DonderdagEind: registratieData.DonderdagEind,
                                    VrijdagStart: registratieData.VrijdagStart,
                                    VrijdagEind: registratieData.VrijdagEind
                                },
                                instellingen: {
                                    thema: registratieData.thema,
                                    eigenTeam: registratieData.eigenTeam,
                                    weekenden: registratieData.weekenden
                                }
                            }
                        });
                    default:
                        return null;
                }
            };

            // Render navigation buttons
            const renderNavigationButtons = () => {
                return h('div', { className: 'flex justify-between pt-6 border-t border-gray-200' },
                    h('button', {
                        className: 'btn btn-secondary',
                        onClick: handlePrevious,
                        disabled: currentStep === 1
                    },
                        h('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                            h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 12H5M12 19l-7-7 7-7' })
                        ),
                        'Vorige'
                    ),
                    currentStep < 4 
                        ? h('button', {
                            className: 'btn btn-primary',
                            onClick: handleNext
                        },
                            'Volgende',
                            h('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M5 12h14M12 5l7 7-7 7' })
                            )
                        )
                        : h('button', {
                            className: 'btn btn-success',
                            onClick: handleSubmit,
                            disabled: isSubmitting
                        },
                            isSubmitting && h('div', { className: 'loading-spinner mr-2' }),
                            h('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' })
                            ),
                            isSubmitting ? 'Registreren...' : 'Account Aanmaken'
                        )
                );
            };

            if (isLoading) {
                return h('div', null,
                    h(HeaderComponent, { currentStep: 1 }),
                    h('div', { className: 'container mx-auto p-4 md:p-6 max-w-4xl mt-[-2rem] md:mt-[-2.5rem]' },
                        h('div', { className: 'registration-card p-12 text-center' },
                            h('div', { className: 'loading-spinner mx-auto mb-4' }),
                            h('p', { className: 'text-gray-500' }, 'Registratie wordt voorbereid...'),
                            h('p', { className: 'text-gray-400 text-sm mt-2' }, 'Teams en functies worden geladen...')
                        )
                    )
                );
            }

            if (error) {
                return h('div', null,
                    h(HeaderComponent, { currentStep: 1 }),
                    h('div', { className: 'container mx-auto p-4 md:p-6 max-w-4xl mt-[-2rem] md:mt-[-2.5rem]' },
                        h('div', { className: 'registration-card p-12 text-center' },
                            h('div', { className: 'text-red-600 mb-4' },
                                h('svg', { className: 'w-12 h-12 mx-auto mb-2', fill: 'currentColor', viewBox: '0 0 20 20' },
                                    h('path', { fillRule: 'evenodd', d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z', clipRule: 'evenodd' })
                                )
                            ),
                            h('h3', { className: 'text-lg font-medium mb-2' }, 'Kon registratie niet laden'),
                            h('p', { className: 'text-gray-500 mb-4' }, error),
                            h('button', { 
                                className: 'btn btn-primary',
                                onClick: () => window.location.reload()
                            }, 'Probeer opnieuw')
                        )
                    )
                );
            }

            return h('div', null,
                h(HeaderComponent, { currentStep }),
                h('div', { className: 'container mx-auto p-4 md:p-6 max-w-4xl mt-[-2rem] md:mt-[-2.5rem]' },
                    h('div', { className: 'registration-card overflow-hidden' },
                        h(StepIndicator, { currentStep }),
                        statusBericht && h(StatusBericht, { 
                            bericht: statusBericht.bericht, 
                            type: statusBericht.type,
                            onSluit: statusBericht.onSluit
                        }),
                        renderStepContent(),
                        renderNavigationButtons()
                    ),
                    h('footer', { className: 'text-center mt-10 py-6 border-t border-gray-200' },
                        h('p', { className: 'text-xs text-gray-500' }, 
                            `© ${new Date().getFullYear()} Verlofrooster Applicatie`
                        )
                    )
                )
            );
        }

        // Render de registratie-app
        function renderApp() {
            const container = document.getElementById('registratie-app');
            if (container) {
                const root = ReactDOM.createRoot(container);
                root.render(h(RegistratieApp));
                console.log('Registratie React App gerenderd met ES6 modules');
            } else {
                console.error('Container element #registratie-app niet gevonden');
            }
        }

        // Start de applicatie
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderApp);
        } else {
            renderApp();
        }

        console.log('Registratie React App geladen met moderne ES6 structuur');
    </script>
</body>
</html>