<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verlofrooster - Beheercentrum</title>
    <link rel="icon" type="image/svg+xml" href="../Icons/favicon/favicon.svg">
    <!-- Load configuration from external file -->
    <script src="../js/config/configLijst.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/beheerCentrum_styles.css">
    
    <!-- React imports -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <script src="js/beheerCentrum_logic.js"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        
        .tab-button {
            position: relative;
            transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;
            padding-bottom: 0.75rem; 
            border-bottom: 3px solid transparent;
        }
        .tab-button.active {
            font-weight: 600;
        }
        
        .tab-content {
            display: none;
            animation: fadeIn 0.4s ease-out;
        }
        .tab-content.active {
            display: block;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="light-theme">
    <!-- Hoofd Banner -->
    <div id="page-banner" class="page-banner">
        <!-- Terug Knop -->
        <a href="../verlofRooster.aspx" class="btn-back">
            <svg class="icon-small" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
            </svg>
            <span>Terug naar rooster</span>
        </a>
        
        <div class="banner-content">
            <div class="banner-info">
                <div class="banner-main">
                    <h1 class="banner-title">
                        Verlofrooster Beheercentrum
                    </h1>
                    <p class="banner-subtitle">
                        Beheer medewerkers, teams, verlofredenen en andere kerngegevens
                    </p>
                </div>
                <div class="banner-user">
                    <div class="user-info">
                        <span id="huidige-gebruiker">Gebruiker wordt geladen...</span>
                    </div>
                    <div class="connection-status">
                        <span id="verbinding-status">Verbinden...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Hoofd Container -->
    <div id="app-container" class="app-container">        
        <div class="tab-wrapper-card">
            <div class="tab-header">
                <nav class="tab-navigation" aria-label="Tabs" id="tab-navigatie">
                    <button data-tab="medewerkers" class="tab-button">
                        <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                        </svg>
                        Medewerkers
                    </button>
                    <button data-tab="dagen-indicators" class="tab-button">
                        <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                        Dag Indicatoren
                    </button>
                    <button data-tab="functies" class="tab-button">
                        <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        Functies
                    </button>
                    <button data-tab="verlofredenen" class="tab-button">
                        <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                        </svg>
                        Verlofredenen
                    </button>
                    <button data-tab="teams" class="tab-button">
                        <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                        </svg>
                        Teams
                    </button>
                    <button data-tab="seniors" class="tab-button">
                        <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        Seniors
                    </button>
                    <button data-tab="uren-per-week" class="tab-button">
                        <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                        </svg>
                        Uren Per Week
                    </button>
                    <button data-tab="incidenteel-zitting-vrij" class="tab-button">
                        <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                        Incidenteel Zitting Vrij
                    </button>
                    <button data-tab="compensatie-uren" class="tab-button">
                        <svg class="tab-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                        </svg>
                        Compensatie Uren
                    </button>
                </nav>
            </div>

            <div class="tab-content-area">
                <!-- Hoofd Inhoud -->
                <main id="tab-inhoud-container" class="tab-contents-wrapper">
                    <!-- Inhoud wordt dynamisch geladen -->
                </main>
            </div>
        </div>

        <!-- Footer -->
        <footer class="page-footer" id="pagina-footer">
            <p class="footer-text">
                © <span id="huidig-jaar"></span> Verlofrooster Applicatie
            </p>
        </footer>
    </div>

    <!-- Globale Loading Overlay -->
    <div id="globale-loading" class="modal-overlay hidden">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <span id="loading-bericht">Laden...</span>
        </div>
    </div>

    <!-- Globale Notificatie -->
    <div id="globale-notificatie" class="notification-item hidden">
        <div class="message-content">
            <span id="notificatie-bericht"></span>
        </div>
        <button onclick="verbergNotificatie()" class="close-button">
            <svg class="icon-small" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
        </button>
    </div>

    <!-- Bewerkings Modal -->
    <div id="bewerkings-modal" class="modal-overlay hidden">
        <div class="modal-content-card">
            <div class="modal-header">
                <h3 id="modal-titel" class="modal-title">Item bewerken</h3>
                <button id="modal-sluiten" class="btn btn-secondary btn-icon-only">
                    <svg class="icon-medium" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            <div id="modal-status" class="modal-status"></div>
            <div id="modal-inhoud" class="modal-form-content">
                <form id="modal-formulier">
                    <div id="modal-velden"></div>
                </form>
            </div>
            <div class="modal-actions">
                <button id="modal-annuleren" class="btn btn-secondary">
                    Annuleren
                </button>
                <button id="modal-opslaan" class="btn btn-primary">
                    <svg class="icon-small" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Opslaan
                </button>
            </div>
        </div>
    </div>

    <!-- Bevestigings Modal -->
    <div id="bevestigings-modal" class="modal-overlay hidden">
        <div class="modal-content-card">
            <div class="modal-header-warning">
                <div class="warning-icon">
                    <svg class="icon-medium text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="warning-title">
                    <h3 class="modal-title">Bevestiging vereist</h3>
                </div>
            </div>
            <div class="modal-message">
                <p id="bevestig-bericht" class="modal-text"></p>
            </div>
            <div class="modal-actions">
                <button id="bevestig-annuleren" class="btn btn-secondary">
                    Annuleren
                </button>
                <button id="bevestig-verwijderen" class="btn btn-danger">
                    <svg class="icon-small" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    Verwijderen
                </button>
            </div>
        </div>
    </div>
</body>
</html>