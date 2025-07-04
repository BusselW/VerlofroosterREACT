<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gebruikersinstellingen - Verlofrooster</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="../js/config/configLijst.js"></script>
      <link rel="icon" href="../icons/favicon/favicon.svg" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f4f7fa;  /* Match k.aspx background */
            min-height: 100vh;
            margin: 0;
        }

        .header-gradient {
            background-color: #2c3e50;  /* Match k.aspx header */
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .settings-card {
            background: white;  /* Pure white instead of rgba */
            backdrop-filter: none;  /* Remove blur effect */
            border-radius: 8px;  /* Match k.aspx border radius */
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);  /* Match k.aspx shadow */
        }

        .tab-button {
            position: relative;
            transition: all 0.3s ease;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 500;
        }

        .tab-button:hover {
            background: rgba(79, 70, 229, 0.1);
            transform: translateY(-1px);
        }

        .tab-button.active {
            background-color: #4a90e2;  /* Match primary color */
            color: white;
            box-shadow: 0 4px 6px -1px rgba(74, 144, 226, 0.3);
        }

        .tab-button.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }

        .form-input, .form-select {
            border-radius: 6px;  /* Match k.aspx form styling */
            border: 1px solid #ccc;
            padding: 0.75rem 1rem;
            transition: all 0.2s ease;
            background: white;
        }

        .form-input:focus, .form-select:focus {
            outline: none;
            border-color: #4a90e2;  /* Match k.aspx focus color */
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }

        /* Grey out disabled fields */
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
            background-color: #4a90e2;  /* Match k.aspx primary color */
            color: white;
            border-color: #4a90e2;
        }

        .btn-primary:hover:not(:disabled) {
            background-color: #357abd;
            border-color: #357abd;
        }

        .btn-secondary {
            background-color: #f0f0f0;  /* Match k.aspx secondary */
            color: #333;
            border-color: #ccc;
        }

        .btn-success {
            background-color: #27ae60;  /* Match k.aspx success color */
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
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);  /* Match primary colors */
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease;
            overflow: hidden;
        }

        .profile-pic-container:hover {
            transform: scale(1.05);
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

        .schedule-table tr:hover {
            background: rgba(79, 70, 229, 0.05);
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

        .status-info {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            color: #1d4ed8;
        }

        .status-warning {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.3);
            color: #d97706;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
            transition: .3s;
            border-radius: 24px;
        }

        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input:checked + .toggle-slider {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }

        input:checked + .toggle-slider:before {
            transform: translateX(24px);
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
            color: #2c3e50;  /* Solid color instead of gradient */
            font-weight: 600;
        }

        .permission-warning {
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            color: #92400e;
        }

        /* New styles for DagenIndicators colors */
        .dag-type-tag {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 500;
            margin-right: 8px;
            margin-bottom: 8px;
            color: #ffffff;
        }
    </style>
</head>
<body>
    <div id="ginstellingen-app"></div>

    <script type="module">
        // Globale variabelen voor alle modules
        let getLijstConfig, krijgBeschikbareLijsten;
        let trimLoginNaamPrefix, getProfilePhotoUrl, isGebruikerAdmin;
        let hasAccessToSection, isUserInGroup, getUserAuthorizedSections;

        // Global variables for day type colors
        let dagenIndicatorColors = {};
        let colorsLoaded = false;

        // Functie om alle benodigde modules te laden
        async function laadAlleModules() {
            // Skip the waiting logic and immediately use fallback configuration
            console.log('⚠ Using fallback configuration immediately');
           
            // Create fallback configuration
            if (!window.appConfiguratie) {
                window.appConfiguratie = {
                    instellingen: {
                        siteUrl: '/sites/MulderT/CustomPW/Verlof/'
                    }
                };
            }
           
            // Create fallback functions
            getLijstConfig = (identifier) => {
                const configs = {
                    Teams: { lijstTitel: 'Teams', lijstId: null },
                    keuzelijstFuncties: { lijstTitel: 'Functies', lijstId: null },
                    Medewerkers: { lijstTitel: 'Medewerkers', lijstId: null },
                    gebruikersInstellingen: { lijstTitel: 'GebruikersInstellingen', lijstId: null },
                    Werkrooster: { lijstTitel: 'Werkrooster', lijstId: null }
                };
                return configs[identifier] || null;
            };
           
            krijgBeschikbareLijsten = () => ['Teams', 'keuzelijstFuncties', 'Medewerkers', 'gebruikersInstellingen', 'Werkrooster'];
           
            console.log('✓ Fallback configuratie geladen');

            try {
                // Correct the import path
                const sharepointService = await import('../js/services/sharepointService.js');
               
                trimLoginNaamPrefix = (loginNaam) => {
                    if (!loginNaam || typeof loginNaam !== 'string') return loginNaam;
                    const parts = loginNaam.split('\\');
                    return parts.length > 1 ? parts[parts.length - 1] : loginNaam;
                };
               
                getProfilePhotoUrl = (gebruiker, grootte = 'M') => {
                    const loginName = gebruiker?.Username || gebruiker?.LoginName;
                    if (!loginName) return null;
                    return sharepointService.getProfilePictureUrl(loginName, grootte);
                };
               
                isGebruikerAdmin = async () => false; // Simplified for now
               
                console.log('✓ sharepointService.js succesvol geladen');
            } catch (error) {
                console.warn('⚠ sharepointService.js loading failed:', error);
                // Keep fallback functions
            }

            // Create simple permission functions
            hasAccessToSection = async (sectionName) => true;
            isUserInGroup = async (groupName) => false;
            getUserAuthorizedSections = async () => ['Profiel', 'Werkrooster', 'Instellingen'];
        }

        // React alias
        const { useState, useEffect, useCallback } = React;
        const h = React.createElement;

        // Constanten
        const GINSTELLINGEN_SITE_URL = "/sites/MulderT/CustomPW/Verlof/";
        const DAGEN_VAN_DE_WEEK_GINST_EDIT = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];
        const DAGEN_VAN_DE_WEEK_DISPLAY = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];

        // SharePoint Service (aangepast voor nieuwe structuur)
        class GInstellingenService {
            constructor() {
                this.siteUrl = null;
                this.sharepointService = null;
            }

            async initialiseer() {
                try {
                    // Import your existing service
                    this.sharepointService = await import('../js/services/sharepointService.js');
                   
                    this.siteUrl = window.appConfiguratie?.instellingen?.siteUrl || GINSTELLINGEN_SITE_URL;
                    console.log('GInstellingenService geïnitialiseerd met siteUrl:', this.siteUrl);
                    return true;
                } catch (error) {
                    console.error('Fout bij initialiseren van GInstellingenService:', error);
                    throw error;
                }
            }

            async haalLijstItemsOp(lijstIdentifier, selectQuery = "", filterQuery = "", expandQuery = "", orderbyQuery = "") {
                try {
                    // Use the correct SharePoint service function name
                    return await this.sharepointService.fetchSharePointList(lijstIdentifier);
                } catch (error) {
                    console.error(`Fout bij ophalen van lijst ${lijstIdentifier}:`, error);
                    throw error;
                }
            }

            async krijgHuidigeGebruiker() {
                try {
                    // Use your existing service
                    return await this.sharepointService.getCurrentUser();
                } catch (error) {
                    console.error('Fout bij ophalen huidige gebruiker:', error);
                    throw error;
                }
            }

            async opslaanMedewerkerGegevens(medewerkerData) {
                try {
                    // Helper function to format date properly for SharePoint
                    const formatDateForSharePoint = (dateString) => {
                        if (!dateString) return null;
                       
                        // Create date object with explicit time to avoid timezone issues
                        const [year, month, day] = dateString.split('-');
                        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0, 0);
                       
                        // Format as ISO string for SharePoint
                        return date.toISOString();
                    };

                    // Map the form field names to the actual SharePoint field names
                    const sharePointData = {
                        // Map form fields to SharePoint internal field names
                        Naam: medewerkerData.naam,
                        Username: medewerkerData.username,
                        E_x002d_mail: medewerkerData.email, // SharePoint encodes hyphens as _x002d_
                        Geboortedatum: formatDateForSharePoint(medewerkerData.geboortedatum),
                        Team: medewerkerData.team,
                        Functie: medewerkerData.functie
                    };
                   
                    // Use your existing service to update employee data
                    if (medewerkerData.Id) {
                        return await this.sharepointService.updateSharePointListItem('Medewerkers', medewerkerData.Id, sharePointData);
                    } else {
                        return await this.sharepointService.createSharePointListItem('Medewerkers', sharePointData);
                    }
                } catch (error) {
                    console.error('Fout bij opslaan medewerkergegevens:', error);
                    throw error;
                }
            }

            async opslaanWerkrooster(werkroosterData) {
                try {
                    console.log('opslaanWerkrooster called with data:', werkroosterData);
                   
                    // Validate required fields for new rotation system
                    if (!werkroosterData.MedewerkerID) {
                        throw new Error('MedewerkerID is verplicht voor werkrooster opslag');
                    }
                   
                    if (!werkroosterData.WeekType) {
                        throw new Error('WeekType is verplicht voor werkrooster opslag');
                    }
                   
                    if (werkroosterData.IsRotatingSchedule === undefined || werkroosterData.IsRotatingSchedule === null) {
                        throw new Error('IsRotatingSchedule is verplicht voor werkrooster opslag');
                    }
                   
                    // Use the correct list name from your config
                    if (werkroosterData.Id) {
                        console.log(`Updating existing UrenPerWeek record with ID: ${werkroosterData.Id}`);
                        return await this.sharepointService.updateSharePointListItem('UrenPerWeek', werkroosterData.Id, werkroosterData);
                    } else {
                        console.log('Creating new UrenPerWeek record');
                        return await this.sharepointService.createSharePointListItem('UrenPerWeek', werkroosterData);
                    }
                } catch (error) {
                    console.error('Fout bij opslaan werkrooster:', error);
                    throw error;
                }
            }

            async opslaanInstellingen(instellingenData) {
                try {
                    // Use your existing service for settings
                    if (instellingenData.Id) {
                        return await this.sharepointService.updateSharePointListItem('gebruikersInstellingen', instellingenData.Id, instellingenData);
                    } else {
                        return await this.sharepointService.createSharePointListItem('gebruikersInstellingen', instellingenData);
                    }
                } catch (error) {
                    console.error('Fout bij opslaan instellingen:', error);
                    throw error;
                }
            }
        }

        // Globale service instantie
        const gInstellingenService = new GInstellingenService();

        // Hulpfuncties
        function genereerInitialen(naam) {
            if (!naam) return 'XX';
            const delen = naam.split(' ');
            if (delen.length >= 2) {
                return `${delen[0].charAt(0)}${delen[delen.length - 1].charAt(0)}`.toUpperCase();
            }
            return naam.substring(0, 2).toUpperCase();
        }

        // Header Component
        function HeaderComponent({ gebruiker, rechten }) {
            return h('div', { className: 'header-gradient text-white p-6 md:p-8' },
                h('div', { className: 'container mx-auto max-w-4xl' },
                    h('div', { className: 'flex justify-between items-center' },
                        h('div', null,
                            h('h1', { className: 'text-3xl md:text-4xl font-bold' }, 'Gebruikersinstellingen'),
                            rechten && rechten.isAdmin && h('span', {
                                className: 'inline-block mt-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full'
                            }, 'Administrator')
                        ),
                        h('a', {
                            href: '../verlofRooster.aspx',
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
                    ),
                    h('p', { className: 'mt-2 text-blue-100 text-sm md:text-base' },
                        'Beheer hier uw persoonlijke gegevens, werkrooster en rooster voorkeuren.'
                    ),
                    gebruiker && h('p', { className: 'mt-1 text-blue-200 text-xs' },
                        `Ingelogd als: ${gebruiker.naam} (${gebruiker.normalizedUsername})`
                    )
                )
            );
        }

        // Status Bericht Component
        function StatusBericht({ bericht, type, onSluit }) {
            if (!bericht) return null;

            const iconMap = {
                success: '✓',
                error: '⚠',
                info: 'ℹ',
                warning: '⚠'
            };

            return h('div', { className: `status-message status-${type}` },
                h('span', { className: 'font-bold' }, iconMap[type] || 'ℹ'),
                h('span', null, bericht),
                onSluit && h('button', {
                    className: 'ml-auto text-current hover:opacity-70',
                    onClick: onSluit
                }, '×')
            );
        }

        // Permission Warning Component
        function PermissionWarning({ sectie }) {
            return h('div', { className: 'permission-warning' },
                h('div', { className: 'flex items-center' },
                    h('svg', { className: 'w-6 h-6 mr-2', fill: 'currentColor', viewBox: '0 0 20 20' },
                        h('path', { fillRule: 'evenodd', d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z', clipRule: 'evenodd' })
                    ),
                    h('div', null,
                        h('h4', { className: 'font-semibold' }, 'Beperkte toegang'),
                        h('p', { className: 'text-sm mt-1' },
                            `U heeft geen toegang tot het '${sectie}' gedeelte. Neem contact op met uw beheerder voor toegang.`
                        )
                    )
                )
            );
        }

        // Tab Navigation Component
        function TabNavigation({ activeTab, onTabChange, rechten }) {
            const tabs = [
                { id: 'profiel', naam: 'Mijn Profiel', icon: 'user', requiredSection: 'Profiel' },
                { id: 'werkuren', naam: 'Mijn Werktijden', icon: 'calendar', requiredSection: 'Werkrooster' },
                { id: 'instellingen', naam: 'Instellingen', icon: 'settings', requiredSection: 'Instellingen' }
            ];

            const renderIcon = (iconType) => {
                switch (iconType) {
                    case 'user':
                        return h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' });
                    case 'calendar':
                        return h('rect', { x: '3', y: '4', width: '18', height: '18', rx: '2', ry: '2' });
                    case 'settings':
                        return h('circle', { cx: '12', cy: '12', r: '3' });
                    default:
                        return null;
                }
            };

            return h('div', { className: 'px-4 md:px-6 border-b border-gray-200' },
                h('nav', { className: 'flex flex-wrap -mb-px space-x-2 sm:space-x-4 md:space-x-6' },
                    tabs.map(tab => {
                        const hasAccess = !tab.requiredSection || rechten?.sectiesToegang?.includes(tab.requiredSection);
                       
                        return h('button', {
                            key: tab.id,
                            className: `tab-button ${activeTab === tab.id ? 'active' : ''} ${!hasAccess ? 'disabled' : ''}`,
                            onClick: () => hasAccess && onTabChange(tab.id),
                            disabled: !hasAccess,
                            title: !hasAccess ? `Geen toegang tot ${tab.naam}` : ''
                        },
                            h('svg', {
                                className: 'w-5 h-5 mr-2 inline',
                                fill: 'none',
                                stroke: 'currentColor',
                                viewBox: '0 0 24 24'
                            }, renderIcon(tab.icon)),
                            tab.naam,
                            !hasAccess && h('svg', {
                                className: 'w-4 h-4 ml-1 inline',
                                fill: 'currentColor',
                                viewBox: '0 0 20 20'
                            },
                                h('path', { fillRule: 'evenodd', d: 'M5 9V7a5 5 0 0110 0v2a2 2 0 002 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z', clipRule: 'evenodd' })
                            )
                        );
                    })
                )
            );
        }

        // Profiel Tab Component
        function ProfielTab({ gebruiker, medewerkerData, teams, functies, statusBericht, rechten, onSave }) {
            const [formData, setFormData] = useState({
                naam: '',
                username: '',
                email: '',
                geboortedatum: '',
                team: '',
                functie: ''
            });
            const [isLoading, setIsLoading] = useState(false);

            useEffect(() => {
                if (medewerkerData) {
                    // Helper function to format date properly for Dutch timezone
                    const formatDateForInput = (dateString) => {
                        if (!dateString) return '';
                       
                        // Create date object and adjust for Dutch timezone
                        const date = new Date(dateString);
                       
                        // Get the timezone offset and adjust
                        const timezoneOffset = date.getTimezoneOffset();
                        const adjustedDate = new Date(date.getTime() + (timezoneOffset * 60000));
                       
                        // Format as YYYY-MM-DD for input field
                        return adjustedDate.toISOString().split('T')[0];
                    };

                    setFormData({
                        naam: medewerkerData.Naam || gebruiker?.naam || '',
                        username: medewerkerData.Username || gebruiker?.normalizedUsername || '',
                        email: medewerkerData.E_x002d_mail || gebruiker?.email || '',
                        geboortedatum: formatDateForInput(medewerkerData.Geboortedatum),
                        team: medewerkerData.Team || '',
                        functie: medewerkerData.Functie || ''
                    });
                }
            }, [medewerkerData, gebruiker]);

            const handleSave = async () => {
                setIsLoading(true);
                try {
                    await onSave(formData);
                } finally {
                    setIsLoading(false);
                }
            };

            const hasProfielToegang = rechten?.sectiesToegang?.includes('Profiel');

            if (!hasProfielToegang) {
                return h('div', { className: 'p-4 md:p-6' },
                    h(PermissionWarning, { sectie: 'Profiel' })
                );
            }

            return h('div', { className: 'p-4 md:p-6' },
                h('h2', { className: 'text-xl font-semibold mb-6 gradient-text' }, 'Mijn Profiel'),
               
                h('div', { className: 'flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6 mb-6' },
                    h('div', { className: 'profile-pic-container mb-4 sm:mb-0 flex-shrink-0' },
                        // Always show initials as profile picture is not working yet
                        h('div', {
                            className: 'text-white text-2xl font-bold w-full h-full flex items-center justify-center'
                        },
                            genereerInitialen(formData.naam)
                        )
                    ),
                    h('div', { className: 'flex-grow space-y-4 w-full' },
                        h('div', null,
                            h('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Volledige Naam'),
                            h('input', {
                                type: 'text',
                                className: 'form-input w-full',
                                value: formData.naam,
                                onChange: (e) => setFormData(prev => ({ ...prev, naam: e.target.value })),
                                disabled: isLoading
                            })
                        ),
                        h('div', null,
                            h('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Gebruikersnaam (Login)'),
                            h('input', {
                                type: 'text',
                                className: 'form-input w-full cursor-not-allowed opacity-75',
                                value: formData.username,
                                readOnly: true
                            })
                        ),
                        h('div', null,
                            h('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'E-mailadres'),
                            h('input', {
                                type: 'email',
                                className: 'form-input w-full cursor-not-allowed opacity-75 bg-gray-50',
                                value: formData.email,
                                readOnly: true,
                                disabled: true,
                                title: 'E-mailadres wordt automatisch opgehaald uit SharePoint'
                            })
                        ),
                        h('div', null,
                            h('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Geboortedatum'),
                            h('input', {
                                type: 'date',
                                className: 'form-input w-full',
                                value: formData.geboortedatum,
                                onChange: (e) => setFormData(prev => ({ ...prev, geboortedatum: e.target.value })),
                                disabled: isLoading
                            })
                        ),
                        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                            h('div', null,
                                h('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Team'),
                                h('select', {
                                    className: 'form-select w-full',
                                    value: formData.team,
                                    onChange: (e) => setFormData(prev => ({ ...prev, team: e.target.value })),
                                    disabled: isLoading
                                },
                                    h('option', { value: '' }, 'Selecteer een team...'),
                                    teams.map(team =>
                                        h('option', { key: team.ID, value: team.Naam }, team.Naam)
                                    )
                                )
                            ),
                            h('div', null,
                                h('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Functie'),
                                h('select', {
                                    className: 'form-select w-full',
                                    value: formData.functie,
                                    onChange: (e) => setFormData(prev => ({ ...prev, functie: e.target.value })),
                                    disabled: isLoading
                                },
                                    h('option', { value: '' }, 'Selecteer een functie...'),
                                    functies.map(functie =>
                                        h('option', { key: functie.ID, value: functie.Title }, functie.Title)
                                    )
                                )
                            )
                        )
                    )
                ),

                h('div', { className: 'pt-4 flex justify-end border-t border-gray-200 mt-6' },
                    h('button', {
                        className: 'btn btn-success',
                        onClick: handleSave,
                        disabled: isLoading
                    },
                        isLoading && h('div', { className: 'loading-spinner mr-2' }),
                        h('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                            h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' })
                        ),
                        isLoading ? 'Opslaan...' : 'Profiel Opslaan'
                    )
                ),

                statusBericht && h(StatusBericht, {
                    bericht: statusBericht.bericht,
                    type: statusBericht.type,
                    onSluit: statusBericht.onSluit
                })
            );
        }

        // Werktijden Tab Component
        function WerktijdenTab({ werkrooster, statusBericht, rechten, onSave }) {
            const [bewerkModus, setBewerkModus] = useState(false);
            const [isRotatingSchedule, setIsRotatingSchedule] = useState(false);
            const [activeWeek, setActiveWeek] = useState('A'); // 'A' or 'B'
            const [formData, setFormData] = useState({
                // Week A data
                MaandagStart: '',
                MaandagEind: '',
                MaandagSoort: 'Normaal',
                MaandagVrijeDag: false,
                DinsdagStart: '',
                DinsdagEind: '',
                DinsdagSoort: 'Normaal',
                DinsdagVrijeDag: false,
                WoensdagStart: '',
                WoensdagEind: '',
                WoensdagSoort: 'Normaal',
                WoensdagVrijeDag: false,
                DonderdagStart: '',
                DonderdagEind: '',
                DonderdagSoort: 'Normaal',
                DonderdagVrijeDag: false,
                VrijdagStart: '',
                VrijdagEind: '',
                VrijdagSoort: 'Normaal',
                VrijdagVrijeDag: false,
               
                // Week B data (for rotating schedules)
                MaandagStartB: '',
                MaandagEindB: '',
                MaandagSoortB: 'Normaal',
                MaandagVrijeDagB: false,
                DinsdagStartB: '',
                DinsdagEindB: '',
                DinsdagSoortB: 'Normaal',
                DinsdagVrijeDagB: false,
                WoensdagStartB: '',
                WoensdagEindB: '',
                WoensdagSoortB: 'Normaal',
                WoensdagVrijeDagB: false,
                DonderdagStartB: '',
                DonderdagEindB: '',
                DonderdagSoortB: 'Normaal',
                DonderdagVrijeDagB: false,
                VrijdagStartB: '',
                VrijdagEindB: '',
                VrijdagSoortB: 'Normaal',
                VrijdagVrijeDagB: false
            });
            const [bulkStartTime, setBulkStartTime] = useState('08:00');
            const [bulkEndTime, setBulkEndTime] = useState('17:00');
            const [timeErrors, setTimeErrors] = useState({});
            const [ingangsdatum, setIngangsdatum] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
            const [cycleStartDate, setCycleStartDate] = useState(new Date().toISOString().split('T')[0]); // Start date for 2-week cycle
            const [isLoading, setIsLoading] = useState(false);

            // Initialize form data when werkrooster changes
            useEffect(() => {
                if (werkrooster) {
                    // Determine if this is a rotating schedule
                    const hasRotatingData = werkrooster.IsRotatingSchedule === true;
                    setIsRotatingSchedule(hasRotatingData);
                   
                    setFormData({
                        // Week A data
                        MaandagStart: werkrooster.MaandagStart || '',
                        MaandagEind: werkrooster.MaandagEind || '',
                        MaandagSoort: werkrooster.MaandagSoort || 'Normaal',
                        MaandagVrijeDag: werkrooster.MaandagSoort === 'VVD' && (!werkrooster.MaandagStart || !werkrooster.MaandagEind),
                        DinsdagStart: werkrooster.DinsdagStart || '',
                        DinsdagEind: werkrooster.DinsdagEind || '',
                        DinsdagSoort: werkrooster.DinsdagSoort || 'Normaal',
                        DinsdagVrijeDag: werkrooster.DinsdagSoort === 'VVD' && (!werkrooster.DinsdagStart || !werkrooster.DinsdagEind),
                        WoensdagStart: werkrooster.WoensdagStart || '',
                        WoensdagEind: werkrooster.WoensdagEind || '',
                        WoensdagSoort: werkrooster.WoensdagSoort || 'Normaal',
                        WoensdagVrijeDag: werkrooster.WoensdagSoort === 'VVD' && (!werkrooster.WoensdagStart || !werkrooster.WoensdagEind),
                        DonderdagStart: werkrooster.DonderdagStart || '',
                        DonderdagEind: werkrooster.DonderdagEind || '',
                        DonderdagSoort: werkrooster.DonderdagSoort || 'Normaal',
                        DonderdagVrijeDag: werkrooster.DonderdagSoort === 'VVD' && (!werkrooster.DonderdagStart || !werkrooster.DonderdagEind),
                        VrijdagStart: werkrooster.VrijdagStart || '',
                        VrijdagEind: werkrooster.VrijdagEind || '',
                        VrijdagSoort: werkrooster.VrijdagSoort || 'Normaal',
                        VrijdagVrijeDag: werkrooster.VrijdagSoort === 'VVD' && (!werkrooster.VrijdagStart || !werkrooster.VrijdagEind),
                       
                        // Week B data (populate from B-week record if available)
                        MaandagStartB: werkrooster.MaandagStartB || '',
                        MaandagEindB: werkrooster.MaandagEindB || '',
                        MaandagSoortB: werkrooster.MaandagSoortB || 'Normaal',
                        MaandagVrijeDagB: werkrooster.MaandagSoortB === 'VVD' && (!werkrooster.MaandagStartB || !werkrooster.MaandagEindB),
                        DinsdagStartB: werkrooster.DinsdagStartB || '',
                        DinsdagEindB: werkrooster.DinsdagEindB || '',
                        DinsdagSoortB: werkrooster.DinsdagSoortB || 'Normaal',
                        DinsdagVrijeDagB: werkrooster.DinsdagSoortB === 'VVD' && (!werkrooster.DinsdagStartB || !werkrooster.DinsdagEindB),
                        WoensdagStartB: werkrooster.WoensdagStartB || '',
                        WoensdagEindB: werkrooster.WoensdagEindB || '',
                        WoensdagSoortB: werkrooster.WoensdagSoortB || 'Normaal',
                        WoensdagVrijeDagB: werkrooster.WoensdagSoortB === 'VVD' && (!werkrooster.WoensdagStartB || !werkrooster.WoensdagEindB),
                        DonderdagStartB: werkrooster.DonderdagStartB || '',
                        DonderdagEindB: werkrooster.DonderdagEindB || '',
                        DonderdagSoortB: werkrooster.DonderdagSoortB || 'Normaal',
                        DonderdagVrijeDagB: werkrooster.DonderdagSoortB === 'VVD' && (!werkrooster.DonderdagStartB || !werkrooster.DonderdagEindB),
                        VrijdagStartB: werkrooster.VrijdagStartB || '',
                        VrijdagEindB: werkrooster.VrijdagEindB || '',
                        VrijdagSoortB: werkrooster.VrijdagSoortB || 'Normaal',
                        VrijdagVrijeDagB: werkrooster.VrijdagSoortB === 'VVD' && (!werkrooster.VrijdagStartB || !werkrooster.VrijdagEindB)
                    });
                   
                    // Load existing Ingangsdatum if available
                    if (werkrooster.Ingangsdatum) {
                        try {
                            // Try to convert the date to YYYY-MM-DD format
                            const date = new Date(werkrooster.Ingangsdatum);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // Set to beginning of day for proper comparison
                           
                            // Only use the existing date if it's today or in the future
                            if (date >= today) {
                                setIngangsdatum(date.toISOString().split('T')[0]);
                            } else {
                                // Otherwise use today's date
                                setIngangsdatum(new Date().toISOString().split('T')[0]);
                                console.log('Using today as the existing Ingangsdatum is in the past.');
                            }
                        } catch (error) {
                            console.warn('Could not parse Ingangsdatum, using today:', error);
                        }
                    } else {
                        setIngangsdatum(new Date().toISOString().split('T')[0]);
                    }
                   
                    // Load cycle start date if available
                    if (werkrooster.CycleStartDate) {
                        try {
                            const cycleDate = new Date(werkrooster.CycleStartDate);
                            setCycleStartDate(cycleDate.toISOString().split('T')[0]);
                        } catch (error) {
                            console.warn('Could not parse CycleStartDate, using today:', error);
                        }
                    }
                }
            }, [werkrooster]);

            // Helper function to validate time entries
            const validateTimes = (startTime, endTime) => {
                if (!startTime || !endTime) return null; // Not enough data to validate

                // Check if times are equal
                if (startTime === endTime) {
                    return 'Start- en eindtijd mogen niet gelijk zijn';
                }

                // Check if start time is after end time
                const start = new Date(`2000-01-01T${startTime}:00`);
                const end = new Date(`2000-01-01T${endTime}:00`);

                if (start > end) {
                    return 'Starttijd mag niet na eindtijd zijn';
                }

                // Check for short workdays (less than minimum required time)
                const diffMs = end - start;
                const diffHours = diffMs / (1000 * 60 * 60);

                if (diffHours < 1) {
                    return 'Werktijd moet minimaal 1 uur zijn';
                }

                return null; // No error
            };

            // Helper function to calculate hours worked
            const calculateHoursWorked = (startTime, endTime) => {
                if (!startTime || !endTime) return '-';
               
                const start = new Date(`2000-01-01T${startTime}:00`);
                const end = new Date(`2000-01-01T${endTime}:00`);
               
                // Handle invalid combinations
                if (end <= start) return '-';
               
                const diffMs = end - start;
                const diffHours = diffMs / (1000 * 60 * 60);
               
                // Show dash for very short times (less than 1 hour)
                if (diffHours < 1) return '-';
               
                // Format to 1 decimal place if needed
                return diffHours % 1 === 0 ? diffHours.toString() : diffHours.toFixed(1);
            };

            // Helper function to determine work day type based on DagenIndicators logic
            const determineWorkDayType = (startTime, endTime, isVrijeDag = false) => {
                console.log(`Determining work day type for: ${startTime} - ${endTime}, isVrijeDag: ${isVrijeDag}`);
               
                // Step 1: Check for explicitly marked free day
                if (isVrijeDag) {
                    console.log('Explicitly marked as free day, returning VVD');
                    return 'VVD'; // Vaste Vrije Dag
                }
               
                // Step 2: Check for flexible working hours (--:-- format or empty)
                if (!startTime || !endTime || startTime === '--:--' || endTime === '--:--') {
                    console.log('Flexible hours detected (--:-- format or empty), returning Flexibele start tijd');
                    return 'Flexibele start tijd';
                }
               
                // Step 3: Parse and validate time inputs
                const start = new Date(`2000-01-01T${startTime}:00`);
                const end = new Date(`2000-01-01T${endTime}:00`);
               
                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    console.log('Invalid time format, returning Flexibele start tijd');
                    return 'Flexibele start tijd';
                }
               
                console.log(`Parsed times: start=${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')}, end=${end.getHours()}:${String(end.getMinutes()).padStart(2, '0')}`);
               
                // Step 4: Check for no work (VVD) - start and end times are the same
                if (startTime === endTime) {
                    console.log('Start and end times are the same, returning VVD');
                    return 'VVD';
                }
               
                // Convert to minutes for easier comparison
                const startMinutes = start.getHours() * 60 + start.getMinutes();
                const endMinutes = end.getHours() * 60 + end.getMinutes();
               
                // Step 5: Define time periods
                const morningStart = 6 * 60;   // 06:00 - Morning period start
                const morningEnd = 13 * 60;    // 13:00 - Morning period end
                const afternoonStart = 12 * 60; // 12:00 - Afternoon period start
               
                // Step 6: Check if working during morning period (06:00-13:00)
                // Work overlaps with morning if it starts before 13:00 AND ends after 06:00
                const worksInMorning = startMinutes < morningEnd && endMinutes > morningStart;
               
                // Step 7: Check if working during afternoon period (12:00+)
                // Work extends into afternoon if it ends after 12:00
                const worksInAfternoon = endMinutes > afternoonStart;
               
                console.log(`Works in morning (06:00-13:00): ${worksInMorning}`);
                console.log(`Works in afternoon (12:00+): ${worksInAfternoon}`);
               
                // Step 8: Apply the logic
                if (!worksInMorning && !worksInAfternoon) {
                    // This case should be rare since step 4 catches same start/end times
                    console.log('Not working in either period, returning VVD');
                    return 'VVD';
                } else if (!worksInMorning && worksInAfternoon) {
                    // Special edge case: if start time is exactly 12:00, it's borderline
                    if (startMinutes === afternoonStart) {
                        console.log('Start time is exactly 12:00 (edge case), returning VVO');
                        return 'VVO';
                    }
                    console.log('Not working morning period but working afternoon, returning VVO');
                    return 'VVO';
                } else if (worksInMorning && !worksInAfternoon) {
                    console.log('Working morning period but not afternoon, returning VVM');
                    return 'VVM';
                } else {
                    console.log('Working both morning and afternoon periods, returning Normaal');
                    return 'Normaal';
                }
            };

            // Helper function to get display text for work day type
            const getWorkDayTypeDisplay = (type) => {
                switch (type) {
                    case 'VVD': return 'Vaste vrije dag';
                    case 'VVO': return 'Vrije ochtend';
                    case 'VVM': return 'Vrije middag';
                    case 'Flexibele start tijd': return 'Flexibele start tijd';
                    case 'Normaal': return 'Normale werkdag';
                    default: return type || '-';
                }
            };

            // Function to set all days to the same time
            // Helper function to copy Week A data to Week B
            const copyWeekAToWeekB = () => {
                const updatedFormData = { ...formData };
               
                DAGEN_VAN_DE_WEEK_DISPLAY.forEach(dag => {
                    const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                    updatedFormData[`${dagCapitalized}StartB`] = formData[`${dagCapitalized}Start`] || '';
                    updatedFormData[`${dagCapitalized}EindB`] = formData[`${dagCapitalized}Eind`] || '';
                    updatedFormData[`${dagCapitalized}SoortB`] = formData[`${dagCapitalized}Soort`] || 'Normaal';
                    updatedFormData[`${dagCapitalized}VrijeDagB`] = formData[`${dagCapitalized}VrijeDag`] || false;
                });
               
                setFormData(updatedFormData);
            };

            const handleSetAllTimes = () => {
                const updatedFormData = { ...formData };
                const newTimeErrors = { ...timeErrors };
               
                // First validate the bulk times
                const errorMessage = validateTimes(bulkStartTime, bulkEndTime);
                if (errorMessage) {
                    // Show an alert for bulk time validation error
                    alert(`Fout in de tijdsinstellingen: ${errorMessage}`);
                    return;
                }
               
                // Determine which week suffix to use
                const weekSuffix = (isRotatingSchedule && activeWeek === 'B') ? 'B' : '';
               
                DAGEN_VAN_DE_WEEK_DISPLAY.forEach(dag => {
                    const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                    // Only set times for days that are not marked as "vrije dag"
                    if (!updatedFormData[`${dagCapitalized}VrijeDag${weekSuffix}`]) {
                        updatedFormData[`${dagCapitalized}Start${weekSuffix}`] = bulkStartTime;
                        updatedFormData[`${dagCapitalized}Eind${weekSuffix}`] = bulkEndTime;
                        const calculatedDayType = determineWorkDayType(bulkStartTime, bulkEndTime, false);
                        updatedFormData[`${dagCapitalized}Soort${weekSuffix}`] = calculatedDayType || 'Normaal';
                       
                        // Clear any existing errors for this day
                        delete newTimeErrors[`${dagCapitalized}${weekSuffix}`];
                    }
                });
               
                setTimeErrors(newTimeErrors);
                setFormData(updatedFormData);
            };

            // Function to clear all times
            const handleClearAllTimes = () => {
                const updatedFormData = { ...formData };
               
                // Determine which week suffix to use
                const weekSuffix = (isRotatingSchedule && activeWeek === 'B') ? 'B' : '';
               
                DAGEN_VAN_DE_WEEK_DISPLAY.forEach(dag => {
                    const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                    updatedFormData[`${dagCapitalized}Start${weekSuffix}`] = '';
                    updatedFormData[`${dagCapitalized}Eind${weekSuffix}`] = '';
                    updatedFormData[`${dagCapitalized}VrijeDag${weekSuffix}`] = true; // Set "vrije dag" checkboxes to true
                    updatedFormData[`${dagCapitalized}Soort${weekSuffix}`] = 'VVD'; // Set to vaste vrije dag
                });
               
                setFormData(updatedFormData);
               
                // Clear errors for the active week
                const newTimeErrors = { ...timeErrors };
                DAGEN_VAN_DE_WEEK_DISPLAY.forEach(dag => {
                    const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                    delete newTimeErrors[`${dagCapitalized}${weekSuffix}`];
                });
                setTimeErrors(newTimeErrors);
            };
           
            const handleTimeChange = (dag, type, value, weekSuffix = '') => {
                const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                const updatedFormData = { ...formData };
                updatedFormData[`${dagCapitalized}${type}${weekSuffix}`] = value;
               
                // Get both time values for validation
                const startTime = type === 'Start' ? value : formData[`${dagCapitalized}Start${weekSuffix}`];
                const endTime = type === 'Eind' ? value : formData[`${dagCapitalized}Eind${weekSuffix}`];
               
                // Validate the times if both are provided
                if (startTime && endTime) {
                    const errorMessage = validateTimes(startTime, endTime);
                    const newTimeErrors = { ...timeErrors };
                    const errorKey = `${dagCapitalized}${weekSuffix}`;
                   
                    if (errorMessage) {
                        newTimeErrors[errorKey] = errorMessage;
                    } else {
                        delete newTimeErrors[errorKey];
                    }
                   
                    setTimeErrors(newTimeErrors);
                }
               
                // Auto-calculate day type when both times are set
                const isVrijeDag = formData[`${dagCapitalized}VrijeDag${weekSuffix}`] || false;
                const calculatedDayType = determineWorkDayType(startTime, endTime, isVrijeDag);
                updatedFormData[`${dagCapitalized}Soort${weekSuffix}`] = calculatedDayType || (isVrijeDag ? 'VVD' : 'Normaal');
               
                setFormData(updatedFormData);
            };
           
            const handleVrijedagChange = (dag, isVrij, weekSuffix = '') => {
                const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                const updatedFormData = { ...formData };
                updatedFormData[`${dagCapitalized}VrijeDag${weekSuffix}`] = isVrij;
               
                if (isVrij) {
                    updatedFormData[`${dagCapitalized}Soort${weekSuffix}`] = 'VVD';
                } else {
                    // If unchecking, recalculate type based on existing times
                    const startTime = formData[`${dagCapitalized}Start${weekSuffix}`];
                    const endTime = formData[`${dagCapitalized}Eind${weekSuffix}`];
                    const calculatedDayType = determineWorkDayType(startTime, endTime, false);
                    updatedFormData[`${dagCapitalized}Soort${weekSuffix}`] = calculatedDayType || 'Normaal';
                }
               
                setFormData(updatedFormData);
            };

            const renderWerkdagenTabel = () => {
                if (!werkrooster && !bewerkModus) {
                    return h('tr', null,
                        h('td', { colSpan: 5, className: 'py-6 text-center text-gray-500 italic' },
                            'Geen standaard werkrooster gevonden.'
                        )
                    );
                }

                return DAGEN_VAN_DE_WEEK_DISPLAY.map(dag => {
                    const dagLower = dag.toLowerCase();
                    const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                   
                    // Determine which data to use based on rotation and active week
                    const weekSuffix = (bewerkModus && isRotatingSchedule && activeWeek === 'B') ? 'B' : '';
                    const startField = `${dagCapitalized}Start${weekSuffix}`;
                    const eindField = `${dagCapitalized}Eind${weekSuffix}`;
                    const vrijeDagField = `${dagCapitalized}VrijeDag${weekSuffix}`;
                    const soortField = `${dagCapitalized}Soort${weekSuffix}`;
                   
                    const startTijd = bewerkModus ? formData[startField] : werkrooster?.[startField];
                    const eindTijd = bewerkModus ? formData[eindField] : werkrooster?.[eindField];
                    const isVrijeDag = bewerkModus ?
                        formData[vrijeDagField] :
                        (werkrooster?.[soortField] === 'VVD' && (!werkrooster?.[startField] || !werkrooster?.[eindField]));
                   
                    // Calculate hours worked
                    const hoursWorked = isVrijeDag ? '-' : calculateHoursWorked(startTijd, eindTijd);
                   
                    // Determine day type automatically
                    let calculatedDayType = isVrijeDag ? 'VVD' : determineWorkDayType(startTijd, eindTijd);
                    // Use stored value if in edit mode, otherwise use calculated
                    const dayType = bewerkModus ?
                        (formData[soortField] || calculatedDayType || 'Normaal') :
                        (calculatedDayType || (isVrijeDag ? 'VVD' : 'Normaal'));

                    return h('tr', { key: `${dag}-${weekSuffix}`, className: 'hover:bg-gray-50' },
                        h('td', { className: 'font-medium py-3' },
                            bewerkModus && isRotatingSchedule ?
                                h('div', { className: 'flex items-center gap-2' },
                                    h('span', null, dag),
                                    h('span', {
                                        className: `text-xs px-2 py-1 rounded-full font-medium ${
                                            activeWeek === 'A' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                        }`
                                    }, `Week ${activeWeek}`)
                                ) :
                                dag
                        ),
                        h('td', { className: 'py-3' },
                            bewerkModus ?
                                h('div', { className: 'flex flex-col' },
                                    h('div', { className: 'flex gap-2 items-center' },
                                        h('input', {
                                            type: 'time',
                                            className: `form-input text-sm w-32 ${isVrijeDag ? 'opacity-50 cursor-not-allowed' : ''} ${timeErrors[dagCapitalized + weekSuffix] ? 'border-red-500 bg-red-50' : ''}`,
                                            value: startTijd || '',
                                            disabled: isVrijeDag,
                                            onChange: (e) => handleTimeChange(dag, 'Start', e.target.value, weekSuffix)
                                        }),
                                        h('span', { className: 'text-gray-500' }, '-'),
                                        h('input', {
                                            type: 'time',
                                            className: `form-input text-sm w-32 ${isVrijeDag ? 'opacity-50 cursor-not-allowed' : ''} ${timeErrors[dagCapitalized + weekSuffix] ? 'border-red-500 bg-red-50' : ''}`,
                                            value: eindTijd || '',
                                            disabled: isVrijeDag,
                                            onChange: (e) => handleTimeChange(dag, 'Eind', e.target.value, weekSuffix)
                                        })
                                    ),
                                    timeErrors[dagCapitalized + weekSuffix] &&
                                    h('div', { className: 'text-red-600 text-xs mt-1' }, timeErrors[dagCapitalized + weekSuffix])
                                ) :
                                (startTijd && eindTijd
                                    ? `${startTijd} - ${eindTijd}`
                                    : h('span', { className: 'italic text-gray-500' }, 'Niet ingeroosterd')
                                )
                        ),
                        h('td', { className: 'py-3 text-center' },
                            hoursWorked !== '-' ? `${hoursWorked}u` : '-'
                        ),
                        h('td', { className: 'py-3 text-center' },
                            bewerkModus ?
                            h('input', {
                                type: 'checkbox',
                                className: 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500',
                                checked: isVrijeDag,
                                onChange: (e) => handleVrijedagChange(dag, e.target.checked, weekSuffix)
                            }) :
                            (isVrijeDag ? 'Ja' : 'Nee')
                        ),
                        h('td', { className: 'py-3' },
                            h('span', {
                                className: 'dag-type-tag inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                                style: {
                                    backgroundColor: getDayTypeColor(dayType),
                                    color: getBrightness(getDayTypeColor(dayType)) > 128 ? '#000000' : '#ffffff'
                                }
                            },
                                h('span', { className: 'mr-1 text-xs font-bold' }, dayType),
                                getWorkDayTypeDisplay(dayType)
                            )
                        )
                    );
                });
            };

            const handleSave = async () => {
                // Check for validation errors before saving
                if (Object.keys(timeErrors).length > 0) {
                    alert('Los alle tijd-gerelateerde fouten op voordat je het werkrooster opslaat.');
                    return;
                }
               
                // Validate ingangsdatum
                if (!ingangsdatum) {
                    alert('Vul een geldige ingangsdatum in.');
                    return;
                }
               
                // Validate cycle start date if rotating schedule is enabled
                if (isRotatingSchedule && !cycleStartDate) {
                    alert('Vul een geldige cyclus start datum in voor het roterend rooster.');
                    return;
                }
               
                setIsLoading(true);
               
                try {
                    // Debug logging to check available user IDs
                    console.log('Debug - Available user data:');
                    console.log('werkrooster?.MedewerkerID:', werkrooster?.MedewerkerID);
                    console.log('medewerkerData?.Username:', medewerkerData?.Username);
                    console.log('gebruiker?.normalizedUsername:', gebruiker?.normalizedUsername);
                    console.log('gebruiker?.LoginName:', gebruiker?.LoginName);
                   
                    // Determine the correct MedewerkerID to use
                    const finalMedewerkerID = werkrooster?.MedewerkerID ||
                                            medewerkerData?.Username ||
                                            gebruiker?.normalizedUsername ||
                                            gebruiker?.LoginName?.split('\\').pop();
                   
                    console.log('Final MedewerkerID to use:', finalMedewerkerID);
                   
                    if (!finalMedewerkerID) {
                        throw new Error('Kan geen geldige MedewerkerID bepalen. Controleer uw gebruikersgegevens.');
                    }
                   
                    // Format dates for SharePoint
                    const formatDateForSharePoint = (dateString) => {
                        if (!dateString) return null;
                        const date = new Date(dateString);
                        return date.toISOString();
                    };
                   
                    const formattedIngangsdatum = formatDateForSharePoint(ingangsdatum);
                    const formattedCycleStartDate = isRotatingSchedule ? formatDateForSharePoint(cycleStartDate) : null;
                   
                    if (isRotatingSchedule) {
                        // For rotating schedules, create/update two separate records: Week A and Week B
                        const weekAData = {};
                        const weekBData = {};
                       
                        // Process Week A data
                        DAGEN_VAN_DE_WEEK_DISPLAY.forEach(dag => {
                            const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                            const startTijd = formData[`${dagCapitalized}Start`];
                            const eindTijd = formData[`${dagCapitalized}Eind`];
                            const isVrijeDag = formData[`${dagCapitalized}VrijeDag`];
                           
                            // Auto-set the day type based on work times and free day status
                            const calculatedDayType = determineWorkDayType(startTijd, eindTijd, isVrijeDag);
                           
                            weekAData[`${dagCapitalized}Start`] = startTijd || '';
                            weekAData[`${dagCapitalized}Eind`] = eindTijd || '';
                            weekAData[`${dagCapitalized}Soort`] = calculatedDayType || (isVrijeDag ? 'VVD' : 'Normaal');
                        });
                       
                        // Process Week B data
                        DAGEN_VAN_DE_WEEK_DISPLAY.forEach(dag => {
                            const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                            const startTijd = formData[`${dagCapitalized}StartB`];
                            const eindTijd = formData[`${dagCapitalized}EindB`];
                            const isVrijeDag = formData[`${dagCapitalized}VrijeDagB`];
                           
                            // Auto-set the day type based on work times and free day status
                            const calculatedDayType = determineWorkDayType(startTijd, eindTijd, isVrijeDag);
                           
                            weekBData[`${dagCapitalized}Start`] = startTijd || '';
                            weekBData[`${dagCapitalized}Eind`] = eindTijd || '';
                            weekBData[`${dagCapitalized}Soort`] = calculatedDayType || (isVrijeDag ? 'VVD' : 'Normaal');
                        });
                       
                        // Add common fields to both records
                        const commonFields = {
                            Ingangsdatum: formattedIngangsdatum,
                            IsRotatingSchedule: true,
                            CycleStartDate: formattedCycleStartDate,
                            MedewerkerID: finalMedewerkerID
                        };
                       
                        // Create Week A record
                        const weekARecord = {
                            ...weekAData,
                            ...commonFields,
                            WeekType: 'A'
                        };
                       
                        // If updating existing schedule, preserve the ID for Week A
                        if (werkrooster?.Id && werkrooster?.WeekType === 'A') {
                            weekARecord.Id = werkrooster.Id;
                        }
                       
                        // Create Week B record
                        const weekBRecord = {
                            ...weekBData,
                            ...commonFields,
                            WeekType: 'B'
                        };
                       
                        // Week B will typically be a new record unless we're updating an existing rotating schedule
                        // In that case, we would need to find the existing Week B record ID
                       
                        console.log('Saving rotating schedule:');
                        console.log('Week A record:', weekARecord);
                        console.log('Week B record:', weekBRecord);
                       
                        // Save both records
                        // Important: For new rotating schedules, these will be new records (no existing IDs)
                        // The service should handle creation vs. update based on the presence of Id field
                        await onSave(weekARecord, 'A');
                        await onSave(weekBRecord, 'B');
                       
                    } else {
                        // For standard (non-rotating) schedules, save single record as before
                        const updatedFormData = { ...formData };
                       
                        DAGEN_VAN_DE_WEEK_DISPLAY.forEach(dag => {
                            const dagCapitalized = dag.charAt(0).toUpperCase() + dag.slice(1);
                            const startTijd = formData[`${dagCapitalized}Start`];
                            const eindTijd = formData[`${dagCapitalized}Eind`];
                            const isVrijeDag = formData[`${dagCapitalized}VrijeDag`];
                           
                            // Auto-set the day type based on work times and free day status
                            const calculatedDayType = determineWorkDayType(startTijd, eindTijd, isVrijeDag);
                            updatedFormData[`${dagCapitalized}Soort`] = calculatedDayType || (isVrijeDag ? 'VVD' : 'Normaal');
                           
                            // Don't include VrijeDag field in the data sent to SharePoint
                            delete updatedFormData[`${dagCapitalized}VrijeDag`];
                           
                            // Clean up any Week B fields that might exist
                            delete updatedFormData[`${dagCapitalized}StartB`];
                            delete updatedFormData[`${dagCapitalized}EindB`];
                            delete updatedFormData[`${dagCapitalized}SoortB`];
                            delete updatedFormData[`${dagCapitalized}VrijeDagB`];
                        });
                       
                        // Add Ingangsdatum and rotation fields
                        updatedFormData.Ingangsdatum = formattedIngangsdatum;
                        updatedFormData.IsRotatingSchedule = false;
                        updatedFormData.WeekType = 'A'; // Default to A for non-rotating
                        updatedFormData.CycleStartDate = null; // No cycle for standard schedules
                        updatedFormData.MedewerkerID = finalMedewerkerID;
                       
                        console.log('Saving standard schedule:', updatedFormData);
                       
                        // For standard schedules, we need to preserve the existing ID if updating
                        const finalData = { ...werkrooster, ...updatedFormData };
                       
                        // If this is a conversion from rotating to standard, keep the Week A record
                        if (werkrooster?.WeekType === 'A') {
                            finalData.Id = werkrooster.Id;
                        }
                       
                        console.log('Final standard schedule data:', finalData);
                       
                        await onSave(finalData);
                    }
                   
                    setBewerkModus(false);
                   
                } catch (error) {
                    console.error('Error saving werkrooster:', error);
                    alert(`Fout bij opslaan: ${error.message}`);
                } finally {
                    setIsLoading(false);
                }
            };

            const hasWerkroosterToegang = rechten?.sectiesToegang?.includes('Werkrooster');

            if (!hasWerkroosterToegang) {
                return h('div', { className: 'p-4 md:p-6' },
                    h(PermissionWarning, { sectie: 'Werkrooster' })
                );
            }

            return h('div', { className: 'p-4 md:p-6' },
                h('div', { className: 'flex flex-col md:flex-row justify-between items-start md:items-center mb-4' },
                    h('h2', { className: 'text-xl font-semibold gradient-text mb-2 md:mb-0' }, 'Mijn Werktijden'),
                    h('button', {
                        className: `btn ${bewerkModus ? 'btn-warning' : 'btn-primary'} text-sm`,
                        onClick: () => {
                            if (!bewerkModus) {
                                // Entering edit mode - refresh form data from current werkrooster
                                if (werkrooster) {
                                    setFormData({
                                        MaandagStart: werkrooster.MaandagStart || '',
                                        MaandagEind: werkrooster.MaandagEind || '',
                                        MaandagSoort: werkrooster.MaandagSoort || 'Normaal',
                                        MaandagVrijeDag: werkrooster.MaandagSoort === 'VVD' && (!werkrooster.MaandagStart || !werkrooster.MaandagEind),
                                        DinsdagStart: werkrooster.DinsdagStart || '',
                                        DinsdagEind: werkrooster.DinsdagEind || '',
                                        DinsdagSoort: werkrooster.DinsdagSoort || 'Normaal',
                                        DinsdagVrijeDag: werkrooster.DinsdagSoort === 'VVD' && (!werkrooster.DinsdagStart || !werkrooster.DinsdagEind),
                                        WoensdagStart: werkrooster.WoensdagStart || '',
                                        WoensdagEind: werkrooster.WoensdagEind || '',
                                        WoensdagSoort: werkrooster.WoensdagSoort || 'Normaal',
                                        WoensdagVrijeDag: werkrooster.WoensdagSoort === 'VVD' && (!werkrooster.WoensdagStart || !werkrooster.WoensdagEind),
                                        DonderdagStart: werkrooster.DonderdagStart || '',
                                        DonderdagEind: werkrooster.DonderdagEind || '',
                                        DonderdagSoort: werkrooster.DonderdagSoort || 'Normaal',
                                        DonderdagVrijeDag: werkrooster.DonderdagSoort === 'VVD' && (!werkrooster.DonderdagStart || !werkrooster.DonderdagEind),
                                        VrijdagStart: werkrooster.VrijdagStart || '',
                                        VrijdagEind: werkrooster.VrijdagEind || '',
                                        VrijdagSoort: werkrooster.VrijdagSoort || 'Normaal',
                                        VrijdagVrijeDag: werkrooster.VrijdagSoort === 'VVD' && (!werkrooster.VrijdagStart || !werkrooster.VrijdagEind)
                                    });
                                   
                                    // Reset timeErrors
                                    setTimeErrors({});
                                }
                            }
                            setBewerkModus(!bewerkModus);
                        }
                    },
                        h('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                            bewerkModus
                                ? h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' })
                                : h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' })
                        ),
                        bewerkModus ? 'Annuleer Wijziging' : 'Werkrooster Wijzigen'
                    )
                ),

                h('p', { className: 'text-sm mb-5 text-gray-600' },
                    bewerkModus
                        ? 'Pas uw werkrooster aan en klik op opslaan. De dagtype wordt automatisch bepaald op basis van uw werktijden.'
                        : 'Hieronder ziet u uw huidige standaard werkrooster. De dagtype wordt automatisch berekend op basis van uw werktijden.'
                ),

                // 2-week rotation controls (only shown in edit mode)
               
               
                bewerkModus && h('div', { className: 'mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg' },
                    h('div', { className: 'flex items-center justify-between mb-3' },
                        h('h4', { className: 'text-sm font-medium text-purple-800' }, '2-weken roterend rooster'),
                        h('label', { className: 'toggle-switch' },
                            h('input', {
                                type: 'checkbox',
                                checked: isRotatingSchedule,
                                onChange: (e) => {
                                    setIsRotatingSchedule(e.target.checked);
                                    if (!e.target.checked) {
                                        // When disabling rotation, set active week to A
                                        setActiveWeek('A');
                                    }
                                }
                            }),
                            h('span', { className: 'toggle-slider' })
                        )
                    ),
                    h('p', { className: 'text-xs text-purple-600 mb-3' },
                        isRotatingSchedule
                            ? 'Uw rooster wisselt elke week tussen Week A en Week B.'
                            : 'Schakel in om een rooster in te stellen dat elke week wisselt (bijv. Week 1: ma-vr, Week 2: ma-do).'
                    ),
                   
                    // Week selector (only shown when rotating is enabled)
                    isRotatingSchedule && h('div', { className: 'mb-4' },
                        h('div', { className: 'flex flex-col sm:flex-row sm:items-center gap-3' },
                            h('div', { className: 'flex items-center gap-2' },
                                h('span', { className: 'text-sm text-purple-700 font-medium' }, 'Bewerk:'),
                                h('div', { className: 'flex bg-purple-100 rounded-lg p-1' },
                                    h('button', {
                                        className: `px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                            activeWeek === 'A'
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'text-purple-600 hover:bg-purple-200'
                                        }`,
                                        onClick: () => setActiveWeek('A')
                                    }, 'Week A'),
                                    h('button', {
                                        className: `px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                            activeWeek === 'B'
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'text-purple-600 hover:bg-purple-200'
                                        }`,
                                        onClick: () => setActiveWeek('B')
                                    }, 'Week B')
                                )
                            ),
                            // Copy Week A to Week B button
                            activeWeek === 'B' && h('button', {
                                className: 'btn btn-secondary text-xs px-2 py-1',
                                onClick: copyWeekAToWeekB,
                                title: 'Kopieer alle tijden van Week A naar Week B'
                            },
                                h('svg', { className: 'w-3 h-3 mr-1', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' })
                                ),
                                'Kopieer Week A'
                            )
                        )
                    ),
                   
                    // Cycle start date (only shown when rotating is enabled)
                    isRotatingSchedule && h('div', { className: 'flex items-center gap-2' },
                        h('label', { className: 'text-sm text-purple-700 font-medium' }, 'Cyclus start datum:'),
                        h('input', {
                            type: 'date',
                            className: 'form-input text-sm w-40',
                            value: cycleStartDate,
                            onChange: (e) => setCycleStartDate(e.target.value),
                            title: 'De datum waarop Week A begint. Het systeem berekent automatisch welke week van toepassing is.'
                        }),
                        h('span', { className: 'text-xs text-purple-600' }, '(Week A start)')
                    )
                ),

                // Bulk time setting controls (only shown in edit mode)
                bewerkModus && h('div', { className: 'mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg' },
                    h('h4', { className: 'text-sm font-medium mb-3 text-blue-800' },
                        isRotatingSchedule ?
                            `Snelle Tijdsinstellingen voor Week ${activeWeek}` :
                            'Snelle Tijdsinstellingen'
                    ),
                    h('div', { className: 'flex flex-col sm:flex-row gap-3 items-start sm:items-center' },
                        h('div', { className: 'flex gap-2 items-center' },
                            h('label', { className: 'text-sm text-blue-700 font-medium' }, 'Van:'),
                            h('input', {
                                type: 'time',
                                className: 'form-input text-sm w-32',
                                value: bulkStartTime,
                                onChange: (e) => setBulkStartTime(e.target.value)
                            }),
                            h('span', { className: 'text-blue-600' }, 'tot'),
                            h('input', {
                                type: 'time',
                                className: 'form-input text-sm w-32',
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
                                h('svg', { className: 'w-4 h-4 mr-1', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 6v6m0 0v6m0-6h6m-6 0H6' })
                                ),
                                isRotatingSchedule ? `Week ${activeWeek} Instellen` : 'Alles Instellen'
                            ),
                            h('button', {
                                className: 'btn btn-secondary text-sm px-3 py-2',
                                onClick: handleClearAllTimes
                            },
                                h('svg', { className: 'w-4 h-4 mr-1', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                    h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' })
                                ),
                                isRotatingSchedule ? `Week ${activeWeek} Wissen` : 'Alles Wissen'
                            )
                        )
                    ),
                    h('p', { className: 'text-xs text-blue-600 mt-2' },
                        isRotatingSchedule ?
                            `Gebruik de knoppen om alle dagen van Week ${activeWeek} dezelfde werktijden te geven of te wissen.` :
                            'Gebruik "Alles Instellen" om alle dagen dezelfde werktijden te geven, of "Alles Wissen" om alle tijden te verwijderen.'
                    )
                ),

                // Legend for day types
                h('div', { className: 'mb-4 p-3 bg-gray-50 rounded-lg' },
                    h('h4', { className: 'text-sm font-medium mb-2 text-gray-700' }, 'Dagtype Legenda:'),
                    h('div', { className: 'flex flex-wrap gap-2 text-xs' },
                        h('span', {
                            className: 'dag-type-tag inline-flex items-center px-2 py-1 rounded-full',
                            style: {
                                backgroundColor: getDayTypeColor('Normaal'),
                                color: getBrightness(getDayTypeColor('Normaal')) > 128 ? '#000000' : '#ffffff'
                            }
                        },
                            h('span', { className: 'font-bold mr-1' }, 'Normaal'),
                            'Normale werkdag'
                        ),
                        h('span', {
                            className: 'dag-type-tag inline-flex items-center px-2 py-1 rounded-full',
                            style: {
                                backgroundColor: getDayTypeColor('VVD'),
                                color: getBrightness(getDayTypeColor('VVD')) > 128 ? '#000000' : '#ffffff'
                            }
                        },
                            h('span', { className: 'font-bold mr-1' }, 'VVD'),
                            'Vaste vrije dag'
                        ),
                        h('span', {
                            className: 'dag-type-tag inline-flex items-center px-2 py-1 rounded-full',
                            style: {
                                backgroundColor: getDayTypeColor('VVO'),
                                color: getBrightness(getDayTypeColor('VVO')) > 128 ? '#000000' : '#ffffff'
                            }
                        },
                            h('span', { className: 'font-bold mr-1' }, 'VVO'),
                            'Vrije ochtend'
                        ),
                        h('span', {
                            className: 'dag-type-tag inline-flex items-center px-2 py-1 rounded-full',
                            style: {
                                backgroundColor: getDayTypeColor('VVM'),
                                color: getBrightness(getDayTypeColor('VVM')) > 128 ? '#000000' : '#ffffff'
                            }
                        },
                            h('span', { className: 'font-bold mr-1' }, 'VVM'),
                            'Vrije middag'
                        ),
                        h('span', {
                            className: 'dag-type-tag inline-flex items-center px-2 py-1 rounded-full',
                            style: {
                                backgroundColor: getDayTypeColor('Flexibele start tijd'),
                                color: getBrightness(getDayTypeColor('Flexibele start tijd')) > 128 ? '#000000' : '#ffffff'
                            }
                        },
                            h('span', { className: 'font-bold mr-1' }, 'Flex'),
                            'Flexibele start tijd'
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
                                h('th', { className: 'text-center' }, 'Vrije dag'),
                                h('th', { className: 'text-left' }, 'Dagtype')
                            )
                        ),
                        h('tbody', null, renderWerkdagenTabel())
                    )
                ),

                bewerkModus && h('div', { className: 'mt-4 mb-4' },
                    h('div', { className: 'flex items-center' },
                        h('label', { className: 'text-sm font-medium mr-2 text-gray-700' }, 'Ingangsdatum:'),
                        h('input', {
                            type: 'date',
                            className: 'form-input text-sm w-40',
                            value: ingangsdatum,
                            onChange: (e) => setIngangsdatum(e.target.value)
                        }),
                        h('span', { className: 'ml-2 text-xs text-gray-500' }, 'Datum waarop het nieuwe werkrooster ingaat.')
                    )
                ),

                bewerkModus && h('div', { className: 'mt-6 pt-4 border-t border-gray-200' },
                    h('div', { className: 'flex justify-end space-x-3' },
                        h('button', {
                            className: 'btn btn-secondary',
                            onClick: () => {
                                setBewerkModus(false);
                                setTimeErrors({});
                                // Reset form data
                                if (werkrooster) {
                                    setFormData({
                                        MaandagStart: werkrooster.MaandagStart || '',
                                        MaandagEind: werkrooster.MaandagEind || '',
                                        MaandagSoort: werkrooster.MaandagSoort || 'Normaal',
                                        MaandagVrijeDag: werkrooster.MaandagSoort === 'VVD' && (!werkrooster.MaandagStart || !werkrooster.MaandagEind),
                                        DinsdagStart: werkrooster.DinsdagStart || '',
                                        DinsdagEind: werkrooster.DinsdagEind || '',
                                        DinsdagSoort: werkrooster.DinsdagSoort || 'Normaal',
                                        DinsdagVrijeDag: werkrooster.DinsdagSoort === 'VVD' && (!werkrooster.DinsdagStart || !werkrooster.DinsdagEind),
                                        WoensdagStart: werkrooster.WoensdagStart || '',
                                        WoensdagEind: werkrooster.WoensdagEind || '',
                                        WoensdagSoort: werkrooster.WoensdagSoort || 'Normaal',
                                        WoensdagVrijeDag: werkrooster.WoensdagSoort === 'VVD' && (!werkrooster.WoensdagStart || !werkrooster.WoensdagEind),
                                        DonderdagStart: werkrooster.DonderdagStart || '',
                                        DonderdagEind: werkrooster.DonderdagEind || '',
                                        DonderdagSoort: werkrooster.DonderdagSoort || 'Normaal',
                                        DonderdagVrijeDag: werkrooster.DonderdagSoort === 'VVD' && (!werkrooster.DonderdagStart || !werkrooster.DonderdagEind),
                                        VrijdagStart: werkrooster.VrijdagStart || '',
                                        VrijdagEind: werkrooster.VrijdagEind || '',
                                        VrijdagSoort: werkrooster.VrijdagSoort || 'Normaal',
                                        VrijdagVrijeDag: werkrooster.VrijdagSoort === 'VVD' && (!werkrooster.VrijdagStart || !werkrooster.VrijdagEind)
                                    });
                                   
                                    // Also reset ingangsdatum from the werkrooster or to today
                                    if (werkrooster.Ingangsdatum) {
                                        try {
                                            // Try to convert the date to YYYY-MM-DD format
                                            const date = new Date(werkrooster.Ingangsdatum);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                           
                                            // Only use the existing date if it's today or in the future
                                            if (date >= today) {
                                                setIngangsdatum(date.toISOString().split('T')[0]);
                                            } else {
                                                setIngangsdatum(today.toISOString().split('T')[0]);
                                            }
                                        } catch (error) {
                                            console.warn('Could not parse Ingangsdatum, using today:', error);
                                            setIngangsdatum(new Date().toISOString().split('T')[0]);
                                        }
                                    } else {
                                        setIngangsdatum(new Date().toISOString().split('T')[0]);
                                    }
                                }
                            }
                        }, 'Annuleren'),
                        h('button', {
                            className: 'btn btn-success',
                            onClick: handleSave,
                            disabled: Object.keys(timeErrors).length > 0 || isLoading
                        },
                            isLoading && h('div', { className: 'loading-spinner mr-2' }),
                            h('svg', { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                                h('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' })
                            ),
                            isLoading ? 'Opslaan...' : 'Opslaan'
                        )
                    )
                ),

                statusBericht && h(StatusBericht, {
                    bericht: statusBericht.bericht,
                    type: statusBericht.type,
                    onSluit: statusBericht.onSluit
                })
            );
        }

        // Instellingen Tab Component
        function InstellingenTab({ instellingen, statusBericht, rechten, onSave }) {
            const [formData, setFormData] = useState({
                thema: 'light',
                eigenTeam: false,
                weekenden: true
            });

            const hasInstellingenToegang = rechten?.sectiesToegang?.includes('Instellingen');

            useEffect(() => {
                if (instellingen) {
                    setFormData({
                        thema: 'light', // Always default to light theme
                        eigenTeam: instellingen.EigenTeamWeergeven || false,
                        weekenden: instellingen.WeekendenWeergeven !== false
                    });
                }
            }, [instellingen]);

            const handleThemaChange = (nieuwThema) => {
                // Disabled for now - no functionality yet
                console.log('Theme change disabled - functionality not implemented yet');
            };

            const handleToggleChange = (field, value) => {
                // Disabled for now
                console.log(`Toggle change disabled for ${field} - functionality not implemented yet`);
            };

            if (!hasInstellingenToegang) {
                return h('div', { className: 'p-4 md:p-6' },
                    h(PermissionWarning, { sectie: 'Instellingen' })
                );
            }

            return h('div', { className: 'p-4 md:p-6' },
                h('h2', { className: 'text-xl font-semibold mb-6 gradient-text' }, 'Rooster Weergave Instellingen'),
               
                // Disabled notice
                h('div', { className: 'mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg' },
                    h('div', { className: 'flex items-center' },
                        h('svg', { className: 'w-5 h-5 mr-2 text-yellow-600', fill: 'currentColor', viewBox: '0 0 20 20' },
                            h('path', { fillRule: 'evenodd', d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z', clipRule: 'evenodd' })
                        ),
                        h('div', null,
                            h('h4', { className: 'text-sm font-medium text-yellow-800' }, 'Instellingen tijdelijk uitgeschakeld'),
                            h('p', { className: 'text-xs text-yellow-700 mt-1' },
                                'Deze functies worden momenteel ontwikkeld en zijn nog niet beschikbaar.'
                            )
                        )
                    )
                ),
               
                h('div', { className: 'space-y-6 opacity-50' },
                    h('div', null,
                        h('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Thema Voorkeur'),
                        h('select', {
                            className: 'form-select w-full max-w-xs cursor-not-allowed',
                            value: formData.thema,
                            onChange: (e) => handleThemaChange(e.target.value),
                            disabled: true
                        },
                            h('option', { value: 'light' }, 'Licht Thema'),
                            h('option', { value: 'dark' }, 'Donker Thema (Binnenkort beschikbaar)')
                        ),
                        h('p', { className: 'text-xs text-gray-500 mt-1' },
                            'Donker thema wordt in een toekomstige update toegevoegd.'
                        )
                    ),

                    h('div', { className: 'space-y-4' },
                        h('div', { className: 'flex items-center justify-between p-4 rounded-lg bg-gray-50 cursor-not-allowed' },
                            h('div', null,
                                h('label', { className: 'text-sm font-medium text-gray-700' },
                                    'Standaard alleen eigen team tonen'
                                ),
                                h('p', { className: 'text-xs text-gray-500 mt-1' },
                                    'Toon alleen medewerkers van uw eigen team in het rooster'
                                )
                            ),
                            h('label', { className: 'toggle-switch' },
                                h('input', {
                                    type: 'checkbox',
                                    checked: formData.eigenTeam,
                                    onChange: (e) => handleToggleChange('eigenTeam', e.target.checked),
                                    disabled: true
                                }),
                                h('span', { className: 'toggle-slider' })
                            )
                        ),

                        h('div', { className: 'flex items-center justify-between p-4 rounded-lg bg-gray-50 cursor-not-allowed' },
                            h('div', null,
                                h('label', { className: 'text-sm font-medium text-gray-700' },
                                    'Weekenden weergeven'
                                ),
                                h('p', { className: 'text-xs text-gray-500 mt-1' },
                                    'Toon zaterdag en zondag in het rooster'
                                )
                            ),
                            h('label', { className: 'toggle-switch' },
                                h('input', {
                                    type: 'checkbox',
                                    checked: formData.weekenden,
                                    onChange: (e) => handleToggleChange('weekenden', e.target.checked),
                                    disabled: true
                                }),
                                h('span', { className: 'toggle-slider' })
                            )
                        )
                    ),

                    rechten?.isAdmin && h('div', { className: 'pt-6 border-t border-gray-200' },
                        h('h3', { className: 'text-lg font-medium mb-4 text-gray-700' }, 'Administratie'),
                        h('div', { className: 'bg-blue-50 border border-blue-200 rounded-lg p-4' },
                            h('p', { className: 'text-sm text-blue-800 mb-3' },
                                'Als administrator heeft u toegang tot alle secties en extra beheer opties.'
                            ),
                            h('div', { className: 'space-y-2 text-xs text-blue-700' },
                                h('div', null, `Toegankelijke secties: ${rechten.sectiesToegang?.join(', ') || 'Geen'}`),
                                h('div', null, `Groepslidmaatschappen: ${rechten.groepen?.join(', ') || 'Geen'}`)
                            )
                        )
                    )
                ),

                statusBericht && h(StatusBericht, {
                    bericht: statusBericht.bericht,
                    type: statusBericht.type,
                    onSluit: statusBericht.onSluit
                })
            );
        }

        // Hoofd App Component
        function GInstellingenApp() {
            const [isLoading, setIsLoading] = useState(true);
            const [error, setError] = useState(null);
            const [activeTab, setActiveTab] = useState('profiel');
            const [statusBerichten, setStatusBerichten] = useState({});

            // Data state
            const [gebruiker, setGebruiker] = useState(null);
            const [medewerkerData, setMedewerkerData] = useState(null);
            const [teams, setTeams] = useState([]);
            const [functies, setFuncties] = useState([]);
            const [werkrooster, setWerkrooster] = useState(null);
            const [instellingen, setInstellingen] = useState(null);
            const [rechten, setRechten] = useState(null);

            const toonStatusBericht = useCallback((tab, bericht, type = 'info') => {
                const id = Date.now();
                setStatusBerichten(prev => ({
                    ...prev,
                    [tab]: {
                        id,
                        bericht,
                        type,
                        onSluit: () => setStatusBerichten(prev => ({ ...prev, [tab]: null }))
                    }
                }));

                if (type !== 'error') {
                    setTimeout(() => {
                        setStatusBerichten(prev => ({ ...prev, [tab]: null }));
                    }, 5000);
                }
            }, []);

            // Data loading
            useEffect(() => {
                async function initialiseerApp() {
                    try {
                        setIsLoading(true);
                        setError(null);

                        // Load modules first
                        await laadAlleModules();

                        // Initialize service
                        await gInstellingenService.initialiseer();

                        // Load current user
                        const gebruikerInfo = await gInstellingenService.krijgHuidigeGebruiker();
                        console.log('Loaded user:', gebruikerInfo);
                       
                        if (gebruikerInfo) {
                            setGebruiker({
                                naam: gebruikerInfo.Title || 'Onbekend',
                                email: gebruikerInfo.Email || '',
                                normalizedUsername: gebruikerInfo.LoginName?.split('\\').pop() || gebruikerInfo.LoginName || ''
                            });
                        }

                        // Set simple permissions for now
                        const rechtenInfo = {
                            isAdmin: false,
                            sectiesToegang: ['Profiel', 'Werkrooster', 'Instellingen']
                        };
                        setRechten(rechtenInfo);

                        // Load teams and functions
                        try {
                            const [teamsData, functiesData] = await Promise.all([
                                gInstellingenService.haalLijstItemsOp("Teams"),
                                gInstellingenService.haalLijstItemsOp("keuzelijstFuncties")
                            ]);
                           
                            console.log('Loaded teams:', teamsData);
                            console.log('Loaded functions:', functiesData);
                           
                            setTeams(teamsData || []);
                            setFuncties(functiesData || []);
                        } catch (error) {
                            console.warn('Could not load teams/functions:', error);
                            setTeams([]);
                            setFuncties([]);
                        }

                        // Load employee data
                        if (gebruikerInfo?.LoginName) {
                            try {
                                const medewerkers = await gInstellingenService.haalLijstItemsOp("Medewerkers");
                                const medewerker = medewerkers.find(m =>
                                    m.Username && gebruikerInfo.LoginName &&
                                    m.Username.toLowerCase().includes(gebruikerInfo.LoginName.split('\\').pop()?.toLowerCase())
                                );
                               
                                console.log('Found employee data:', medewerker);
                                setMedewerkerData(medewerker);
                               
                                // Load work schedule (UrenPerWeek)
                                if (medewerker?.Username) {
                                    const werkroosterData = await gInstellingenService.haalLijstItemsOp("UrenPerWeek");
                                   
                                    // Look for both Week A and Week B records for rotating schedules
                                    const weekARecord = werkroosterData.find(w =>
                                        w.MedewerkerID === medewerker.Username && w.WeekType === 'A'
                                    );
                                    const weekBRecord = werkroosterData.find(w =>
                                        w.MedewerkerID === medewerker.Username && w.WeekType === 'B'
                                    );
                                   
                                    let combinedWerkrooster = null;
                                   
                                    if (weekARecord && weekBRecord) {
                                        // Combine both weeks into a single object for the UI
                                        combinedWerkrooster = {
                                            ...weekARecord, // Base properties from Week A
                                            // Add Week B data with 'B' suffix
                                            MaandagStartB: weekBRecord.MaandagStart,
                                            MaandagEindB: weekBRecord.MaandagEind,
                                            MaandagSoortB: weekBRecord.MaandagSoort,
                                            DinsdagStartB: weekBRecord.DinsdagStart,
                                            DinsdagEindB: weekBRecord.DinsdagEind,
                                            DinsdagSoortB: weekBRecord.DinsdagSoort,
                                            WoensdagStartB: weekBRecord.WoensdagStart,
                                            WoensdagEindB: weekBRecord.WoensdagEind,
                                            WoensdagSoortB: weekBRecord.WoensdagSoort,
                                            DonderdagStartB: weekBRecord.DonderdagStart,
                                            DonderdagEindB: weekBRecord.DonderdagEind,
                                            DonderdagSoortB: weekBRecord.DonderdagSoort,
                                            VrijdagStartB: weekBRecord.VrijdagStart,
                                            VrijdagEindB: weekBRecord.VrijdagEind,
                                            VrijdagSoortB: weekBRecord.VrijdagSoort,
                                            IsRotatingSchedule: true
                                        };
                                    } else if (weekARecord) {
                                        // Only Week A exists (standard schedule or incomplete rotating)
                                        combinedWerkrooster = weekARecord;
                                    } else {
                                        // No specific Week A/B records, try to find any record for this user
                                        combinedWerkrooster = werkroosterData.find(w => w.MedewerkerID === medewerker.Username);
                                    }
                                   
                                    console.log('Found work schedule:', combinedWerkrooster);
                                    setWerkrooster(combinedWerkrooster);
                                }
                            } catch (error) {
                                console.warn('Could not load employee data:', error);
                            }
                        }

                        // Load user settings
                        try {
                            const instellingenData = await gInstellingenService.haalLijstItemsOp("gebruikersInstellingen");
                            const userSettings = instellingenData.find(s =>
                                s.Title === gebruikerInfo?.LoginName ||
                                s.Title === gebruikerInfo?.Title
                            );
                           
                            console.log('Found user settings:', userSettings);
                            setInstellingen(userSettings);
                        } catch (error) {
                            console.warn('Could not load user settings:', error);
                        }

                    } catch (error) {
                        console.error('[GInstellingenApp] Initialization error:', error);
                        setError(error.message);
                    } finally {
                        setIsLoading(false);
                    }
                }

                initialiseerApp();
            }, []);

            // Helper function to refresh data after saving
            const refreshData = async () => {
                try {
                    // Reload work schedule (UrenPerWeek) for the current user
                    if (medewerkerData?.Username) {
                        const werkroosterData = await gInstellingenService.haalLijstItemsOp("UrenPerWeek");
                       
                        // For rotating schedules, we need to fetch both Week A and Week B records
                        // and combine them into a single object for display
                        const weekARecord = werkroosterData.find(w =>
                            w.MedewerkerID === medewerkerData.Username && w.WeekType === 'A'
                        );
                        const weekBRecord = werkroosterData.find(w =>
                            w.MedewerkerID === medewerkerData.Username && w.WeekType === 'B'
                        );
                       
                        let combinedWerkrooster = null;
                       
                        if (weekARecord && weekBRecord) {
                            // Combine both weeks into a single object
                            combinedWerkrooster = {
                                ...weekARecord, // Base properties from Week A
                                // Add Week B data with 'B' suffix
                                MaandagStartB: weekBRecord.MaandagStart,
                                MaandagEindB: weekBRecord.MaandagEind,
                                MaandagSoortB: weekBRecord.MaandagSoort,
                                DinsdagStartB: weekBRecord.DinsdagStart,
                                DinsdagEindB: weekBRecord.DinsdagEind,
                                DinsdagSoortB: weekBRecord.DinsdagSoort,
                                WoensdagStartB: weekBRecord.WoensdagStart,
                                WoensdagEindB: weekBRecord.WoensdagEind,
                                WoensdagSoortB: weekBRecord.WoensdagSoort,
                                DonderdagStartB: weekBRecord.DonderdagStart,
                                DonderdagEindB: weekBRecord.DonderdagEind,
                                DonderdagSoortB: weekBRecord.DonderdagSoort,
                                VrijdagStartB: weekBRecord.VrijdagStart,
                                VrijdagEindB: weekBRecord.VrijdagEind,
                                VrijdagSoortB: weekBRecord.VrijdagSoort,
                                IsRotatingSchedule: true
                            };
                        } else if (weekARecord) {
                            // Only Week A exists (standard schedule or incomplete rotating)
                            combinedWerkrooster = weekARecord;
                        } else {
                            // No specific Week A/B records, try to find any record for this user
                            combinedWerkrooster = werkroosterData.find(w => w.MedewerkerID === medewerkerData.Username);
                        }
                       
                        console.log('Refreshed work schedule:', combinedWerkrooster);
                        setWerkrooster(combinedWerkrooster);
                    }
                } catch (error) {
                    console.warn('Could not refresh work schedule data:', error);
                }
            };

            // Event handlers
            const handleProfielSave = async (formData) => {
                try {
                    // Include the existing employee ID if available
                    const dataToSave = {
                        ...formData,
                        Id: medewerkerData?.Id // Include the ID for updates
                    };
                   
                    await gInstellingenService.opslaanMedewerkerGegevens(dataToSave);
                    toonStatusBericht('profiel', 'Profiel succesvol opgeslagen!', 'success');
                   
                    // Reload employee data after successful save
                    if (gebruiker?.LoginName) {
                        try {
                            const medewerkers = await gInstellingenService.haalLijstItemsOp("Medewerkers");
                            const updatedMedewerker = medewerkers.find(m =>
                                m.Username && gebruiker.LoginName &&
                                m.Username.toLowerCase().includes(gebruiker.LoginName.split('\\').pop()?.toLowerCase())
                            );
                            setMedewerkerData(updatedMedewerker);
                        } catch (error) {
                            console.warn('Could not reload employee data:', error);
                        }
                    }
                } catch (error) {
                    toonStatusBericht('profiel', `Fout bij opslaan: ${error.message}`, 'error');
                }
            };
           
            const handleWerkroosterSave = async (werkroosterData, weekType = null) => {
                try {
                    if (weekType) {
                        // This is a rotating schedule save - save the specific week record
                        console.log(`Saving Week ${weekType} schedule:`, werkroosterData);
                       
                        await gInstellingenService.opslaanWerkrooster(werkroosterData);
                       
                        // Store a reference for when saving the other week
                        if (weekType === 'A') {
                            console.log('Week A saved successfully');
                            // Don't show success message yet - wait for Week B
                        } else if (weekType === 'B') {
                            console.log('Week B saved, rotating schedule complete');
                            // Both weeks are now saved
                            toonStatusBericht('werkuren', 'Roterend werkrooster (Week A & B) succesvol opgeslagen!', 'success');
                           
                            // Refresh the data to show the updated schedule
                            await refreshData();
                        }
                       
                    } else {
                        // This is a standard (non-rotating) schedule save
                        console.log('Saving standard schedule:', werkroosterData);
                        await gInstellingenService.opslaanWerkrooster(werkroosterData);
                        toonStatusBericht('werkuren', 'Werkrooster succesvol opgeslagen!', 'success');
                       
                        // Refresh the data to show the updated schedule
                        await refreshData();
                    }
                   
                } catch (error) {
                    console.error('Error in handleWerkroosterSave:', error);
                    toonStatusBericht('werkuren', `Fout bij opslaan: ${error.message}`, 'error');
                }
            };

            const handleInstellingenSave = async (instellingenData) => {
                try {
                    await gInstellingenService.opslaanInstellingen(instellingenData);
                    toonStatusBericht('instellingen', 'Instellingen succesvol opgeslagen!', 'success');
                } catch (error) {
                    toonStatusBericht('instellingen', `Fout bij opslaan: ${error.message}`, 'error');
                }
            };

            // Render content
            const renderTabContent = () => {
                switch (activeTab) {
                    case 'profiel':
                        return h(ProfielTab, {
                            gebruiker,
                            medewerkerData,
                            teams,
                            functies,
                            statusBericht: statusBerichten.profiel,
                            rechten,
                            onSave: handleProfielSave
                        });
                    case 'werkuren':
                        return h(WerktijdenTab, {
                            werkrooster,
                            statusBericht: statusBerichten.werkuren,
                            rechten,
                            onSave: handleWerkroosterSave
                        });
                    case 'instellingen':
                        return h(InstellingenTab, {
                            instellingen,
                            statusBericht: statusBerichten.instellingen,
                            rechten,
                            onSave: handleInstellingenSave
                        });
                    default:
                        return null;
                }
            };

            // Global function to fetch DagenIndicators colors from SharePoint
            window.fetchDagenIndicatorColors = fetchDagenIndicatorColors;

            // Fetch colors on app load
            useEffect(() => {
                async function loadColors() {
                    await fetchDagenIndicatorColors();
                }

                loadColors();
            }, []);

            // Apply colors to day type tags after they are rendered
            useEffect(() => {
                if (colorsLoaded) {
                    // Small delay to ensure DOM is updated
                    setTimeout(() => {
                        applyDayTypeColors();
                    }, 100);
                }
            }, [formData, colorsLoaded]); // Re-apply when form data changes or colors are loaded

            if (isLoading) {
                return h('div', null,
                    h(HeaderComponent, { gebruiker, rechten }),
                    h('div', { className: 'container mx-auto p-4 md:p-6 max-w-4xl mt-[-2rem] md:mt-[-2.5rem]' },
                        h('div', { className: 'settings-card p-12 text-center' },
                            h('div', { className: 'loading-spinner mx-auto mb-4' }),
                            h('p', { className: 'text-gray-500' }, 'Gebruikersinstellingen worden geladen...'),
                            h('p', { className: 'text-gray-400 text-sm mt-2' }, 'Configuratie en rechten worden gecontroleerd...')
                        )
                    )
                );
            }

            if (error) {
                return h('div', null,
                    h(HeaderComponent, { gebruiker, rechten }),
                    h('div', { className: 'container mx-auto p-4 md:p-6 max-w-4xl mt-[-2rem] md:mt-[-2.5rem]' },
                        h('div', { className: 'settings-card p-12 text-center' },
                            h('div', { className: 'text-red-600 mb-4' },
                                h('svg', { className: 'w-12 h-12 mx-auto mb-2', fill: 'currentColor', viewBox: '0 0 20 20' },
                                    h('path', { fillRule: 'evenodd', d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z', clipRule: 'evenodd' })
                                )
                            ),
                            h('h3', { className: 'text-lg font-medium mb-2' }, 'Kon instellingen niet laden'),
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
                h(HeaderComponent, { gebruiker, rechten }),
                h('div', { className: 'container mx-auto p-4 md:p-6 max-w-4xl mt-[-2rem] md:mt-[-2.5rem]' },
                    h('div', { className: 'settings-card overflow-hidden' },
                        h(TabNavigation, { activeTab, onTabChange: setActiveTab, rechten }),
                        renderTabContent()
                    ),
                    h('footer', { className: 'text-center mt-10 py-6 border-t border-gray-200' },
                        h('p', { className: 'text-xs text-gray-500' },
                            `© ${new Date().getFullYear()} Verlofrooster Applicatie`
                        )
                    )
                )
            );
        }

        // Function to fetch DagenIndicators colors from SharePoint
        async function fetchDagenIndicatorColors() {
            if (colorsLoaded) {
                return dagenIndicatorColors;
            }

            try {
                console.log('Fetching DagenIndicators colors from SharePoint...');
               
                // Import the SharePoint service
                const sharepointService = await import('../js/services/sharepointService.js');
               
                // Fetch the DagenIndicators list
                const dagenIndicatorsData = await sharepointService.fetchSharePointList('DagenIndicators');
               
                // Create color mapping based on Title field
                dagenIndicatorColors = {};
               
                dagenIndicatorsData.forEach(item => {
                    if (item.Title && item.Kleur) {
                        // Map the titles to our day types
                        const title = item.Title.trim();
                        let colorKey = null;
                       
                        // Match titles to our day type categories
                        if (title.toLowerCase().includes('vvo') || title.toLowerCase().includes('vrije ochtend')) {
                            colorKey = 'VVO';
                        } else if (title.toLowerCase().includes('vvm') || title.toLowerCase().includes('vrije middag')) {
                            colorKey = 'VVM';
                        } else if (title.toLowerCase().includes('vvd') || title.toLowerCase().includes('vrije dag')) {
                            colorKey = 'VVD';
                        } else if (title.toLowerCase().includes('normaal') || title.toLowerCase().includes('normale werkdag')) {
                            colorKey = 'Normaal';
                        } else if (title.toLowerCase().includes('flexibel') || title.toLowerCase().includes('flexibele start')) {
                            colorKey = 'Flexibele start tijd';
                        }
                       
                        if (colorKey && item.Kleur) {
                            // Ensure the color is a valid hex code
                            let color = item.Kleur.trim();
                            if (!color.startsWith('#')) {
                                color = '#' + color;
                            }
                            dagenIndicatorColors[colorKey] = color;
                            console.log(`Color mapping: ${colorKey} -> ${color}`);
                        }
                    }
                });
               
                colorsLoaded = true;
                console.log('DagenIndicators colors loaded:', dagenIndicatorColors);
               
                return dagenIndicatorColors;
               
            } catch (error) {
                console.error('Error fetching DagenIndicators colors:', error);
               
                // Fallback colors if fetch fails
                dagenIndicatorColors = {
                    'VVD': '#ff6b6b',     // Red for no work
                    'VVO': '#4ecdc4',     // Teal for free morning
                    'VVM': '#45b7d1',     // Blue for free afternoon  
                    'Normaal': '#96ceb4', // Green for normal work
                    'Flexibele start tijd': '#ffeaa7' // Yellow for flexible
                };
               
                colorsLoaded = true;
                console.log('Using fallback colors:', dagenIndicatorColors);
                return dagenIndicatorColors;
            }
        }

        // Function to get color for a day type
        function getDayTypeColor(dayType) {
            return dagenIndicatorColors[dayType] || '#e0e0e0'; // Default gray if not found
        }

        // Function to apply color to day type tags
        function applyDayTypeColors() {
            const dayTypeTags = document.querySelectorAll('.dag-type-tag');
           
            dayTypeTags.forEach(tag => {
                const dayType = tag.textContent.trim();
                const color = getDayTypeColor(dayType);
               
                if (color) {
                    tag.style.backgroundColor = color;
                   
                    // Determine text color based on background brightness
                    const brightness = getBrightness(color);
                    tag.style.color = brightness > 128 ? '#000000' : '#ffffff';
                }
            });
        }

        // Helper function to calculate color brightness
        function getBrightness(hexColor) {
            const hex = hexColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);  
            const b = parseInt(hex.substr(4, 2), 16);
            return (r * 299 + g * 587 + b * 114) / 1000;
        }

        // Render de app
        async function renderApp() {
            const container = document.getElementById('ginstellingen-app');
            if (container) {
                // Load DagenIndicators colors before rendering
                try {
                    await fetchDagenIndicatorColors();
                    console.log('DagenIndicators colors loaded successfully');
                } catch (error) {
                    console.warn('Failed to load DagenIndicator colors, using fallback:', error);
                }
               
                const root = ReactDOM.createRoot(container);
                root.render(h(GInstellingenApp));
                console.log('gInstellingen React App gerenderd met ES6 modules');
            } else {
                console.error('Container element #ginstellingen-app niet gevonden');
            }
        }

        // Start de applicatie
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderApp);
        } else {
            renderApp();
        }

        console.log('gInstellingen React App geladen met moderne ES6 structuur');
    </script>
</body>
</html>
