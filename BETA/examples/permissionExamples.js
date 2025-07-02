/**
 * @file permissionExamples.js
 * @description Voorbeelden van hoe je de permission services en UI utilities kunt gebruiken.
 * Dit bestand toont verschillende use cases voor het implementeren van toegangscontrole.
 */

import { 
    getCurrentUserGroups, 
    hasAccessToSection, 
    isUserInGroup, 
    isUserInAnyGroup,
    getUserAuthorizedSections 
} from '../services/permissionService.js';

import { 
    toggleElementBySection, 
    toggleElementByGroup,
    toggleElementEnabledBySection,
    enforcePageAccess,
    executeWithPermission,
    initializePagePermissions 
} from '../utils/uiPermissions.js';

/**
 * VOORBEELD 1: Basis permissie controles
 */
export async function basicPermissionExamples() {
    console.log('=== VOORBEELD 1: Basis Permissie Controles ===');
    
    // Haal alle groepen op waar de gebruiker lid van is
    const userGroups = await getCurrentUserGroups();
    console.log('Gebruiker groepen:', userGroups);
    
    // Controleer toegang tot een specifiek gedeelte
    const hasVerlofAccess = await hasAccessToSection('verlofbeheer');
    console.log('Heeft toegang tot verlofbeheer:', hasVerlofAccess);
    
    // Controleer of gebruiker lid is van een specifieke groep
    const isManager = await isUserInGroup('Managers');
    console.log('Is gebruiker een manager:', isManager);
    
    // Controleer of gebruiker lid is van een van meerdere groepen
    const isAdminOrManager = await isUserInAnyGroup(['Administrators', 'Managers']);
    console.log('Is gebruiker admin of manager:', isAdminOrManager);
    
    // Haal alle geautoriseerde gedeeltes op
    const authorizedSections = await getUserAuthorizedSections();
    console.log('Geautoriseerde gedeeltes:', authorizedSections);
}

/**
 * VOORBEELD 2: UI Elementen verbergen/tonen op basis van rechten
 */
export async function uiToggleExamples() {
    console.log('=== VOORBEELD 2: UI Toggle Voorbeelden ===');
    
    // Verberg knop als gebruiker geen toegang heeft tot verlofbeheer
    await toggleElementBySection('#verlof-knop', 'verlofbeheer');
    
    // Toon waarschuwing alleen als gebruiker GEEN manager is
    await toggleElementByGroup('#waarschuwing-niet-manager', 'Managers', false);
    
    // Maak knop onklikbaar als geen toegang
    await toggleElementEnabledBySection('#admin-knop', 'administratie');
}

/**
 * VOORBEELD 3: Pagina toegang afdwingen
 */
export async function pageAccessExample() {
    console.log('=== VOORBEELD 3: Pagina Toegang Voorbeeld ===');
    
    // Controleer toegang tot admin pagina en leid om als geen toegang
    const hasAccess = await enforcePageAccess(
        'administratie', 
        '/verlof/index.html', 
        'U heeft geen toegang tot de administratie pagina.'
    );
    
    if (hasAccess) {
        console.log('Toegang tot admin pagina toegestaan');
        // Laad admin functionaliteit
        loadAdminInterface();
    }
}

/**
 * VOORBEELD 4: Functie uitvoeren met permissie controle
 */
export async function executeWithPermissionExample() {
    console.log('=== VOORBEELD 4: Execute With Permission Voorbeeld ===');
    
    // Voer functie uit alleen als gebruiker toegang heeft
    await executeWithPermission(
        'verlofgoedkeuring',
        async () => {
            console.log('Verlofgoedkeuring functie uitgevoerd');
            // Hier zou je de verlofgoedkeuring logica plaatsen
        },
        () => {
            console.log('Geen toegang tot verlofgoedkeuring');
            alert('U heeft geen rechten om verlof goed te keuren');
        }
    );
}

/**
 * VOORBEELD 5: Automatische permissie initialisatie met HTML attributen
 */
export function htmlAttributeExample() {
    console.log('=== VOORBEELD 5: HTML Attribute Voorbeeld ===');
    
    // Voeg deze HTML toe aan je pagina:
    const exampleHtml = `
    <!-- Knop wordt automatisch verborgen als geen toegang tot 'verlofbeheer' -->
    <button id="verlof-btn" 
            data-permission-section="verlofbeheer" 
            data-permission-action="hide">
        Verlof Beheren
    </button>
    
    <!-- Knop wordt automatisch disabled als geen toegang tot 'administratie' -->
    <button id="admin-btn" 
            data-permission-section="administratie" 
            data-permission-action="disable">
        Administratie
    </button>
    
    <!-- Knop toont waarschuwing als geen toegang tot 'rapportage' -->
    <button id="report-btn" 
            data-permission-section="rapportage" 
            data-permission-action="warn"
            data-permission-warning="U heeft geen toegang tot rapportages">
        Rapporten Bekijken
    </button>
    `;
    
    // Dan roep je deze functie aan om alle permissies automatisch in te stellen:
    // initializePagePermissions();
    
    console.log('HTML voorbeeld:', exampleHtml);
}

/**
 * VOORBEELD 6: Event handlers met permissie controle
 */
export function setupPermissionBasedEventHandlers() {
    console.log('=== VOORBEELD 6: Event Handlers met Permissies ===');
    
    // Event handler voor verlof aanvragen knop
    document.addEventListener('click', async (e) => {
        if (e.target.id === 'verlof-aanvragen-btn') {
            const hasAccess = await hasAccessToSection('verlofaanvraag');
            
            if (hasAccess) {
                // Open verlof aanvraag formulier
                openVerlofAanvraagForm();
            } else {
                alert('U heeft geen rechten om verlof aan te vragen');
            }
        }
    });
    
    // Event handler voor goedkeuring acties
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('goedkeuring-btn')) {
            const hasAccess = await hasAccessToSection('verlofgoedkeuring');
            
            if (hasAccess) {
                const verlofId = e.target.dataset.verlofId;
                processVerlofGoedkeuring(verlofId);
            } else {
                alert('U heeft geen rechten om verlof goed te keuren');
            }
        }
    });
}

/**
 * VOORBEELD 7: Conditionele menu items
 */
export async function buildPermissionBasedMenu() {
    console.log('=== VOORBEELD 7: Conditionele Menu Items ===');
    
    const menuItems = [
        { 
            text: 'Verlof Aanvragen', 
            section: 'verlofaanvraag', 
            action: 'openVerlofForm' 
        },
        { 
            text: 'Verlof Goedkeuren', 
            section: 'verlofgoedkeuring', 
            action: 'openGoedkeuringOverzicht' 
        },
        { 
            text: 'Rapportages', 
            section: 'rapportage', 
            action: 'openRapportages' 
        },
        { 
            text: 'Administratie', 
            section: 'administratie', 
            action: 'openAdministratie' 
        }
    ];
    
    const menuContainer = document.getElementById('main-menu');
    if (!menuContainer) return;
    
    menuContainer.innerHTML = ''; // Clear existing menu
    
    for (const item of menuItems) {
        const hasAccess = await hasAccessToSection(item.section);
        
        if (hasAccess) {
            const menuElement = document.createElement('li');
            menuElement.innerHTML = `
                <a href="#" onclick="${item.action}()" class="menu-item">
                    ${item.text}
                </a>
            `;
            menuContainer.appendChild(menuElement);
        }
    }
}

/**
 * VOORBEELD 8: Role-based component rendering
 */
export async function renderRoleBasedComponents() {
    console.log('=== VOORBEELD 8: Role-based Component Rendering ===');
    
    const isManager = await isUserInGroup('Managers');
    const isAdmin = await isUserInGroup('Administrators');
    const isHR = await isUserInGroup('HR');
    
    // Manager dashboard
    if (isManager) {
        renderManagerDashboard();
    }
    
    // Admin panel
    if (isAdmin) {
        renderAdminPanel();
    }
    
    // HR functions
    if (isHR) {
        renderHRFunctions();
    }
    
    // Regular user functions (altijd beschikbaar)
    renderUserFunctions();
}

/**
 * Helper functions (deze zou je vervangen door je echte functionaliteit)
 */
function loadAdminInterface() {
    console.log('Admin interface geladen');
}

function openVerlofAanvraagForm() {
    console.log('Verlof aanvraag formulier geopend');
}

function processVerlofGoedkeuring(verlofId) {
    console.log('Verlof goedkeuring verwerkt voor ID:', verlofId);
}

function renderManagerDashboard() {
    console.log('Manager dashboard gerenderd');
}

function renderAdminPanel() {
    console.log('Admin panel gerenderd');
}

function renderHRFunctions() {
    console.log('HR functies gerenderd');
}

function renderUserFunctions() {
    console.log('Gebruiker functies gerenderd');
}

/**
 * VOORBEELD 9: Initialisatie functie voor complete permissie setup
 */
export async function initializePermissionSystem() {
    console.log('=== Permissie Systeem Initialisatie ===');
    
    try {
        // 1. Controleer basis permissies
        await basicPermissionExamples();
        
        // 2. Setup UI permissies
        await initializePagePermissions();
        
        // 3. Setup event handlers
        setupPermissionBasedEventHandlers();
        
        // 4. Build menu gebaseerd op permissies
        await buildPermissionBasedMenu();
        
        // 5. Render components gebaseerd op rol
        await renderRoleBasedComponents();
        
        console.log('Permissie systeem succesvol geïnitialiseerd');
        
    } catch (error) {
        console.error('Fout bij initialiseren permissie systeem:', error);
    }
}

// Auto-initialisatie als DOM geladen is
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePermissionSystem);
} else {
    initializePermissionSystem();
}

export default {
    basicPermissionExamples,
    uiToggleExamples,
    pageAccessExample,
    executeWithPermissionExample,
    htmlAttributeExample,
    setupPermissionBasedEventHandlers,
    buildPermissionBasedMenu,
    renderRoleBasedComponents,
    initializePermissionSystem
};
