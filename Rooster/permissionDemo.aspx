<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Permissie Systeem Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #dee2e6;
            border-radius: 6px;
        }
        
        .section h3 {
            margin-top: 0;
            color: #495057;
        }
        
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            margin: 5px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        button:hover:not(:disabled) {
            background: #0056b3;
        }
        
        button:disabled {
            background: #6c757d;
            cursor: not-allowed;
            opacity: 0.5;
        }
        
        .disabled {
            pointer-events: none;
            opacity: 0.5;
        }
        
        .warning {
            background: #ffc107;
            color: #212529;
        }
        
        .danger {
            background: #dc3545;
        }
        
        .success {
            background: #28a745;
        }
        
        .info-box {
            background: #e9ecef;
            padding: 15px;
            border-radius: 4px;
            margin: 10px 0;
        }
        
        .user-info {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        
        .navigation {
            background: #343a40;
            padding: 15px;
            margin: -20px -20px 20px -20px;
            border-radius: 8px 8px 0 0;
        }
        
        .navigation ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            gap: 20px;
        }
        
        .navigation a {
            color: white;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        
        .navigation a:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .hidden {
            display: none !important;
        }
        
        #permission-log {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            max-height: 200px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verlofrooster Permissie Systeem Demo</h1>
        
        <!-- Gebruikersinformatie -->
        <div id="user-info" class="user-info">
            <strong>Gebruiker:</strong> <span id="current-user">Laden...</span><br>
            <strong>Groepen:</strong> <span id="user-groups">Laden...</span><br>
            <strong>Geautoriseerde gedeeltes:</strong> <span id="authorized-sections">Laden...</span>
        </div>
        
        <!-- Navigatie (wordt dynamisch gebouwd) -->
        <nav class="navigation">
            <ul id="main-menu">
                <!-- Menu items worden hier dynamisch toegevoegd -->
            </ul>
        </nav>
        
        <!-- Sectie 1: Basis Permissie Demonstratie -->
        <div class="section">
            <h3>1. Basis Permissie Controles</h3>
            <p>Deze knoppen demonstreren verschillende permissie controles:</p>
            
            <!-- Automatisch verbergen als geen toegang tot 'verlofbeheer' -->
            <button id="verlof-beheer-btn" 
                    data-permission-section="verlofbeheer" 
                    data-permission-action="hide">
                📅 Verlof Beheren
            </button>
            
            <!-- Automatisch disablen als geen toegang tot 'administratie' -->
            <button id="admin-btn" 
                    data-permission-section="administratie" 
                    data-permission-action="disable">
                ⚙️ Administratie
            </button>
            
            <!-- Waarschuwing tonen als geen toegang tot 'rapportage' -->
            <button id="report-btn" 
                    data-permission-section="rapportage" 
                    data-permission-action="warn"
                    data-permission-warning="U heeft geen toegang tot rapportages. Neem contact op met uw beheerder.">
                📊 Rapporten
            </button>
        </div>
        
        <!-- Sectie 2: Groep-gebaseerde Controles -->
        <div class="section">
            <h3>2. Groep-gebaseerde Controles</h3>
            <p>Deze elementen worden getoond/verborgen op basis van groepslidmaatschap:</p>
            
            <button id="manager-function" class="warning">
                👥 Manager Functie (alleen voor Managers)
            </button>
            
            <button id="hr-function" class="success">
                🏢 HR Functie (alleen voor HR groep)
            </button>
            
            <div id="admin-warning" class="info-box">
                ⚠️ Deze waarschuwing wordt alleen getoond als u GEEN administrator bent.
            </div>
        </div>
        
        <!-- Sectie 3: Interactive Permissie Tests -->
        <div class="section">
            <h3>3. Interactive Permissie Tests</h3>
            <p>Test permissies handmatig:</p>
            
            <button onclick="testSectionAccess('verlofbeheer')">Test Verlofbeheer Toegang</button>
            <button onclick="testSectionAccess('administratie')">Test Administratie Toegang</button>
            <button onclick="testSectionAccess('rapportage')">Test Rapportage Toegang</button>
            <button onclick="testGroupMembership('Managers')">Test Manager Groep</button>
            <button onclick="testGroupMembership('Administrators')">Test Admin Groep</button>
            <button onclick="refreshPermissions()">🔄 Refresh Permissies</button>
        </div>
        
        <!-- Sectie 4: Permissie Log -->
        <div class="section">
            <h3>4. Permissie Log</h3>
            <p>Real-time log van permissie controles:</p>
            <div id="permission-log"></div>
            <button onclick="clearLog()">Log Wissen</button>
        </div>
        
        <!-- Sectie 5: Workflow Simulatie -->
        <div class="section">
            <h3>5. Workflow Simulatie</h3>
            <p>Simuleer verschillende workflows met permissie controles:</p>
            
            <button onclick="simulateVerlofAanvraag()" class="success">
                ➕ Verlof Aanvragen
            </button>
            
            <button onclick="simulateVerlofGoedkeuring()" class="warning">
                ✅ Verlof Goedkeuren
            </button>
            
            <button onclick="simulateRapportageGenereren()" class="info">
                📈 Rapportage Genereren
            </button>
            
            <button onclick="simulateGebruikerBeheer()" class="danger">
                👤 Gebruiker Beheer
            </button>
        </div>
    </div>

    <!-- Scripts -->
    <script type="module">
        // Import de permissie modules
        import { 
            getCurrentUserGroups, 
            hasAccessToSection, 
            isUserInGroup, 
            isUserInAnyGroup,
            getUserAuthorizedSections,
            getCachedCurrentUser,
            clearPermissionCache
        } from './js/services/permissionService.js';
        
        import { 
            toggleElementBySection, 
            toggleElementByGroup,
            toggleElementEnabledBySection,
            initializePagePermissions,
            executeWithPermission
        } from './js/utils/uiPermissions.js';

        // Global functies voor de demo
        window.testSectionAccess = async function(section) {
            const hasAccess = await hasAccessToSection(section);
            logMessage(`Toegang tot '${section}': ${hasAccess ? '✅ JA' : '❌ NEE'}`);
            alert(`Toegang tot '${section}': ${hasAccess ? 'JA' : 'NEE'}`);
        };

        window.testGroupMembership = async function(group) {
            const isMember = await isUserInGroup(group);
            logMessage(`Lid van '${group}': ${isMember ? '✅ JA' : '❌ NEE'}`);
            alert(`Lid van '${group}': ${isMember ? 'JA' : 'NEE'}`);
        };

        window.refreshPermissions = async function() {
            clearPermissionCache();
            await initializeDemo();
            logMessage('🔄 Permissies ververst');
        };

        window.clearLog = function() {
            document.getElementById('permission-log').textContent = '';
        };

        // Workflow simulaties
        window.simulateVerlofAanvraag = async function() {
            await executeWithPermission(
                'verlofaanvraag',
                () => {
                    logMessage('✅ Verlof aanvraag gestart');
                    alert('Verlof aanvraag formulier zou nu openen');
                },
                () => {
                    logMessage('❌ Geen toegang tot verlof aanvragen');
                    alert('U heeft geen rechten om verlof aan te vragen');
                }
            );
        };

        window.simulateVerlofGoedkeuring = async function() {
            await executeWithPermission(
                'verlofgoedkeuring',
                () => {
                    logMessage('✅ Verlof goedkeuring interface geladen');
                    alert('Verlof goedkeuring interface zou nu laden');
                },
                () => {
                    logMessage('❌ Geen toegang tot verlof goedkeuring');
                    alert('U heeft geen rechten om verlof goed te keuren');
                }
            );
        };

        window.simulateRapportageGenereren = async function() {
            await executeWithPermission(
                'rapportage',
                () => {
                    logMessage('✅ Rapportage generatie gestart');
                    alert('Rapportage zou nu gegenereerd worden');
                },
                () => {
                    logMessage('❌ Geen toegang tot rapportages');
                    alert('U heeft geen rechten om rapportages te genereren');
                }
            );
        };

        window.simulateGebruikerBeheer = async function() {
            await executeWithPermission(
                'gebruikersbeheer',
                () => {
                    logMessage('✅ Gebruikersbeheer interface geladen');
                    alert('Gebruikersbeheer interface zou nu laden');
                },
                () => {
                    logMessage('❌ Geen toegang tot gebruikersbeheer');
                    alert('U heeft geen rechten voor gebruikersbeheer');
                }
            );
        };

        // Log functie
        function logMessage(message) {
            const log = document.getElementById('permission-log');
            const timestamp = new Date().toLocaleTimeString();
            log.textContent += `[${timestamp}] ${message}\n`;
            log.scrollTop = log.scrollHeight;
        }

        // Demo initialisatie
        async function initializeDemo() {
            try {
                logMessage('🚀 Demo gestart - initialiseer permissie systeem...');
                
                // Gebruikersinformatie laden
                const currentUser = await getCachedCurrentUser();
                const userGroups = await getCurrentUserGroups();
                const authorizedSections = await getUserAuthorizedSections();
                
                // UI updaten met gebruikersinformatie
                document.getElementById('current-user').textContent = 
                    currentUser ? currentUser.Title : 'Niet beschikbaar';
                document.getElementById('user-groups').textContent = 
                    userGroups.length > 0 ? userGroups.join(', ') : 'Geen groepen gevonden';
                document.getElementById('authorized-sections').textContent = 
                    authorizedSections.length > 0 ? authorizedSections.join(', ') : 'Geen toegang';
                
                logMessage(`👤 Gebruiker geladen: ${currentUser?.Title}`);
                logMessage(`👥 Groepen: ${userGroups.join(', ')}`);
                logMessage(`🔑 Geautoriseerde gedeeltes: ${authorizedSections.join(', ')}`);
                
                // Permissie-gebaseerde UI initialiseren
                await initializePagePermissions();
                logMessage('✅ Automatische permissies toegepast');
                
                // Groep-gebaseerde elementen handmatig instellen
                await toggleElementByGroup('#manager-function', 'Managers');
                await toggleElementByGroup('#hr-function', 'HR');
                await toggleElementByGroup('#admin-warning', 'Administrators', false);
                
                // Menu bouwen
                await buildPermissionBasedMenu();
                
                logMessage('🎉 Demo volledig geïnitialiseerd');
                
            } catch (error) {
                console.error('Fout bij initialiseren demo:', error);
                logMessage(`❌ Fout: ${error.message}`);
            }
        }

        // Menu bouwen op basis van permissies
        async function buildPermissionBasedMenu() {
            const menuItems = [
                { text: '🏠 Home', section: null, action: 'goHome' },
                { text: '📅 Verlof Aanvragen', section: 'verlofaanvraag', action: 'openVerlofForm' },
                { text: '✅ Goedkeuringen', section: 'verlofgoedkeuring', action: 'openGoedkeuringen' },
                { text: '📊 Rapportages', section: 'rapportage', action: 'openRapportages' },
                { text: '⚙️ Administratie', section: 'administratie', action: 'openAdministratie' },
                { text: '👤 Gebruikersbeheer', section: 'gebruikersbeheer', action: 'openGebruikersbeheer' }
            ];
            
            const menuContainer = document.getElementById('main-menu');
            menuContainer.innerHTML = '';
            
            for (const item of menuItems) {
                // Home is altijd beschikbaar
                const hasAccess = item.section ? await hasAccessToSection(item.section) : true;
                
                if (hasAccess) {
                    const menuElement = document.createElement('li');
                    menuElement.innerHTML = `
                        <a href="#" onclick="logMessage('📱 Menu: ${item.text} geklikt')">${item.text}</a>
                    `;
                    menuContainer.appendChild(menuElement);
                }
            }
            
            logMessage(`📋 Menu gebouwd met ${menuContainer.children.length} items`);
        }

        // Start de demo wanneer de pagina geladen is
        document.addEventListener('DOMContentLoaded', initializeDemo);
        
        // Voor debugging - maak functies beschikbaar in console
        window.permissionDemo = {
            getCurrentUserGroups,
            hasAccessToSection,
            isUserInGroup,
            getUserAuthorizedSections,
            clearPermissionCache,
            initializeDemo
        };
        
    </script>
</body>
</html>
