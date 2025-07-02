<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verlofrooster - Beheercentrum</title>
    <link rel="icon" type="image/svg+xml" href="../Icoon/favicon.svg">
    <!-- ConfigLijst.js inline om loading problemen te voorkomen -->
    <script>
        // js/configLijst.js - Inline geïncludeerd om 404 fouten te voorkomen
        if (typeof window.sharepointLijstConfiguraties === 'undefined') {
            window.sharepointLijstConfiguraties = {
              "CompensatieUren": {
                "lijstId": "91f54142-f439-4646-a9f8-ca4d96820e12",
                "lijstTitel": "CompensatieUren",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" },
                  { "titel": "Medewerker", "interneNaam": "Medewerker", "type": "Text" },
                  { "titel": "AanvraagTijdstip", "interneNaam": "AanvraagTijdstip", "type": "DateTime" },
                  { "titel": "EindeCompensatieUren", "interneNaam": "EindeCompensatieUren", "type": "DateTime" },
                  { "titel": "MedewerkerID", "interneNaam": "MedewerkerID", "type": "Text" },
                  { "titel": "Omschrijving", "interneNaam": "Omschrijving", "type": "Text" },
                  { "titel": "StartCompensatieUren", "interneNaam": "StartCompensatieUren", "type": "DateTime" },
                  { "titel": "Status", "interneNaam": "Status", "type": "Choice" },
                  { "titel": "UrenTotaal", "interneNaam": "UrenTotaal", "type": "Text" }
                ]
              },
              "DagenIndicators": {
                "lijstId": "45528ed2-cdff-4958-82e4-e3eb032fd0aa",
                "lijstTitel": "DagenIndicators",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" }, 
                  { "titel": "Beschrijving", "interneNaam": "Beschrijving", "type": "Text" },
                  { "titel": "Kleur", "interneNaam": "Kleur", "type": "Text" },
                  { "titel": "Patroon", "interneNaam": "Patroon", "type": "Choice" },
                  { "titel": "Validatie", "interneNaam": "Validatie", "type": "Text" }
                ]
              },
              "gebruikersInstellingen": {
                "lijstId": "c83b6af8-fee3-4b3a-affd-b1ad6bddd513",
                "lijstTitel": "gebruikersInstellingen",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" },
                  { "titel": "EigenTeamWeergeven", "interneNaam": "EigenTeamWeergeven", "type": "Boolean" },
                  { "titel": "soortWeergave", "interneNaam": "soortWeergave", "type": "Text" },
                  { "titel": "WeekendenWeergeven", "interneNaam": "WeekendenWeergeven", "type": "Boolean" }
                ]
              },
              "keuzelijstFuncties": {
                "lijstId": "f33ffe6d-7237-4688-9ac9-8a72f402a92d",
                "lijstTitel": "keuzelijstFuncties",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" }
                ]
              },
              "IncidenteelZittingVrij": {
                "lijstId": "be6841e2-f4c0-4485-93a6-14f2fb146742",
                "lijstTitel": "IncidenteelZittingVrij",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" },
                  { "titel": "Gebruikersnaam", "interneNaam": "Gebruikersnaam", "type": "Text" },
                  { "titel": "Opmerking", "interneNaam": "Opmerking", "type": "Note" },
                  { "titel": "TerugkeerPatroon", "interneNaam": "TerugkeerPatroon", "type": "Choice" },
                  { "titel": "Terugkerend", "interneNaam": "Terugkerend", "type": "Boolean" },
                  { "titel": "TerugkerendTot", "interneNaam": "TerugkerendTot", "type": "DateTime" },
                  { "titel": "ZittingsVrijeDagTijdEind", "interneNaam": "ZittingsVrijeDagTijdEind", "type": "DateTime" },
                  { "titel": "ZittingsVrijeDagTijdStart", "interneNaam": "ZittingsVrijeDagTijd", "type": "DateTime" }
                ]
              },
              "Medewerkers": {
                "lijstId": "835ae977-8cd1-4eb8-a787-23aa2d76228d",
                "lijstTitel": "Medewerkers",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" },
                  { "titel": "Naam", "interneNaam": "Naam", "type": "Text" },
                  { "titel": "Geboortedatum", "interneNaam": "Geboortedatum", "type": "DateTime", "format": "DateOnly" },
                  { "titel": "E-mail", "interneNaam": "E_x002d_mail", "type": "Text" },
                  { "titel": "Functie", "interneNaam": "Functie", "type": "Text" },
                  { "titel": "Team", "interneNaam": "Team", "type": "Text" },
                  { "titel": "Username", "interneNaam": "Username", "type": "Text" },
                  { "titel": "Opmerking", "interneNaam": "Opmekring", "type": "Note" },
                  { "titel": "OpmerkingGeldigTot", "interneNaam": "OpmerkingGeldigTot", "type": "DateTime" },
                  { "titel": "Horen", "interneNaam": "Horen", "type": "Boolean" },
                  { "titel": "Verbergen", "interneNaam": "Verbergen", "type": "Boolean" },
                  { "titel": "Actief", "interneNaam": "Actief", "type": "Boolean" }
                ]
              },
              "Seniors": {
                "lijstId": "2e9b5974-7d69-4711-b9e6-f8db85f96f5f",
                "lijstTitel": "Seniors",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" },
                  { "titel": "Medewerker", "interneNaam": "Medewerker", "type": "Text" },
                  { "titel": "MedewerkerID", "interneNaam": "MedewerkerID", "type": "Text" },
                  { "titel": "Team", "interneNaam": "Team", "type": "Text" },
                  { "titel": "TeamID", "interneNaam": "TeamID", "type": "Text" }
                ]
              },
              "Teams": {
                "lijstId": "dc2911c5-b0b7-4092-9c99-5fe957fdf6fc",
                "lijstTitel": "Teams",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" },
                  { "titel": "Naam", "interneNaam": "Naam", "type": "Text" },
                  { "titel": "Actief", "interneNaam": "Actief", "type": "Boolean" },
                  { "titel": "Kleur", "interneNaam": "Kleur", "type": "Text" },
                  { "titel": "Teamleider", "interneNaam": "Teamleider", "type": "Text" },
                  { "titel": "TeamleiderId", "interneNaam": "TeamleiderId", "type": "Text" }
                ]
              },
              "UrenPerWeek": {
                "lijstId": "55bf75d8-d9e6-4614-8ac0-c3528bdb0ea8",
                "lijstTitel": "UrenPerWeek",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" },
                  { "titel": "MedewerkerID", "interneNaam": "MedewerkerID", "type": "Text" },
                  { "titel": "Ingangsdatum", "interneNaam": "Ingangsdatum", "type": "DateTime" },
                  { "titel": "VeranderingsDatum", "interneNaam": "VeranderingsDatum", "type": "DateTime" },
                  { "titel": "MaandagStart", "interneNaam": "MaandagStart", "type": "Text" },
                  { "titel": "MaandagEind", "interneNaam": "MaandagEind", "type": "Text" },
                  { "titel": "MaandagSoort", "interneNaam": "MaandagSoort", "type": "Text" },
                  { "titel": "DinsdagStart", "interneNaam": "DinsdagStart", "type": "Text" },
                  { "titel": "DinsdagEind", "interneNaam": "DinsdagEind", "type": "Text" },
                  { "titel": "DinsdagSoort", "interneNaam": "DinsdagSoort", "type": "Text" },
                  { "titel": "WoensdagStart", "interneNaam": "WoensdagStart", "type": "Text" },
                  { "titel": "WoensdagEind", "interneNaam": "WoensdagEind", "type": "Text" },
                  { "titel": "WoensdagSoort", "interneNaam": "WoensdagSoort", "type": "Text" },
                  { "titel": "DonderdagStart", "interneNaam": "DonderdagStart", "type": "Text" },
                  { "titel": "DonderdagEind", "interneNaam": "DonderdagEind", "type": "Text" },
                  { "titel": "DonderdagSoort", "interneNaam": "DonderdagSoort", "type": "Text" },
                  { "titel": "VrijdagStart", "interneNaam": "VrijdagStart", "type": "Text" },
                  { "titel": "VrijdagEind", "interneNaam": "VrijdagEind", "type": "Text" },
                  { "titel": "VrijdagSoort", "interneNaam": "VrijdagSoort", "type": "Text" }
                ]
              },
              "Verlofredenen": {
                "lijstId": "6ca65cc0-ad60-49c9-9ee4-371249e55c7d",
                "lijstTitel": "Verlofredenen",
                "verborgen": false,
                "baseTemplate": 100,
                "velden": [
                  { "titel": "Id", "interneNaam": "ID", "type": "Counter" },
                  { "titel": "Titel", "interneNaam": "Title", "type": "Text" },
                  { "titel": "Naam", "interneNaam": "Naam", "type": "Text" },
                  { "titel": "Kleur", "interneNaam": "Kleur", "type": "Text" },
                  { "titel": "VerlofDag", "interneNaam": "VerlofDag", "type": "Boolean" }
                ]
              }
            };
        }

        if (typeof window.getLijstConfig === 'undefined') {
            window.getLijstConfig = function(lijstKey) {
              if (window.sharepointLijstConfiguraties && window.sharepointLijstConfiguraties[lijstKey]) {
                return window.sharepointLijstConfiguraties[lijstKey];
              }
              console.warn(`[getLijstConfig] Configuratie voor sleutel '${lijstKey}' niet gevonden.`);
              return null;
            };
        }

        console.log("configLijst.js inline geladen en getLijstConfig is globaal beschikbaar.");
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/beheerCentrum_styles.css">
    <script src="https://cdn.tailwindcss.com"></script>
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
    <div id="page-banner" class="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-gray-900 text-white p-6 md:p-8 shadow-lg relative">
        <!-- Terug Knop -->
        <a href="../verlofRooster.aspx" class="btn-back">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
            </svg>
            <span>Terug naar rooster</span>
        </a>
        
        <div class="w-full px-4 md:px-8 pr-24 md:pr-48">
            <div class="flex justify-between items-center">
                <div class="flex-1 pr-4">
                    <h1 class="text-3xl md:text-4xl font-bold">
                        Verlofrooster Beheercentrum
                    </h1>
                    <p class="mt-2 text-blue-100 dark:text-gray-300 text-sm md:text-base">
                        Beheer medewerkers, teams, verlofredenen en andere kerngegevens
                    </p>
                </div>
                <div class="text-right min-w-0 flex-shrink-0 max-w-48">
                    <div class="text-sm font-medium text-blue-100 dark:text-gray-200 truncate">
                        <span id="huidige-gebruiker">Gebruiker wordt geladen...</span>
                    </div>
                    <div class="text-xs mt-1 text-blue-200 dark:text-gray-300 truncate">
                        <span id="verbinding-status">Verbinden...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Hoofd Container -->
    <div id="app-container" class="w-full p-4 md:p-6 mt-[-2rem] md:mt-[-2.5rem]">        
        <div class="tab-wrapper-card bg-white dark:bg-gray-800 shadow-xl rounded-lg p-0 md:p-0 mb-8 overflow-hidden">
            <div class="px-4 md:px-6 border-b border-gray-200 dark:border-gray-700">
                <nav class="flex flex-wrap -mb-px space-x-2 sm:space-x-4 md:space-x-6" aria-label="Tabs" id="tab-navigatie">
                    <button data-tab="medewerkers" class="tab-button">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                        </svg>
                        Medewerkers
                    </button>
                    <button data-tab="dagen-indicators" class="tab-button">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                        </svg>
                        Dag Indicatoren
                    </button>
                    <button data-tab="functies" class="tab-button">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        Functies
                    </button>
                    <button data-tab="verlofredenen" class="tab-button">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                        </svg>
                        Verlofredenen
                    </button>
                    <button data-tab="teams" class="tab-button">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                        </svg>
                        Teams
                    </button>
                    <button data-tab="seniors" class="tab-button">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        Seniors
                    </button>
                    <button data-tab="uren-per-week" class="tab-button">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                        </svg>
                        Uren Per Week
                    </button>
                    <button data-tab="incidenteel-zitting-vrij" class="tab-button">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                        Incidenteel Zitting Vrij
                    </button>
                </nav>
            </div>

            <div class="p-4 md:p-6">
                <!-- Hoofd Inhoud -->
                <main id="tab-inhoud-container" class="tab-contents-wrapper">
                    <!-- Inhoud wordt dynamisch geladen -->
                </main>
            </div>
        </div>

        <!-- Footer -->
        <footer class="text-center mt-10 py-6 border-t border-gray-200 dark:border-gray-700" id="pagina-footer">
            <p class="text-xs text-gray-500 dark:text-gray-400">
                © <span id="huidig-jaar"></span> Verlofrooster Applicatie
            </p>
        </footer>
    </div>

    <!-- Globale Loading Overlay -->
    <div id="globale-loading" class="hidden modal-overlay">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <span id="loading-bericht">Laden...</span>
        </div>
    </div>

    <!-- Globale Notificatie -->
    <div id="globale-notificatie" class="hidden notification-item">
        <div class="message-content">
            <span id="notificatie-bericht"></span>
        </div>
        <button onclick="verbergNotificatie()" class="close-button">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
        </button>
    </div>

    <!-- Bewerkings Modal -->
    <div id="bewerkings-modal" class="hidden modal-overlay">
        <div class="modal-content-card">
            <div class="flex justify-between items-center mb-6">
                <h3 id="modal-titel" class="modal-title">Item bewerken</h3>
                <button id="modal-sluiten" class="btn btn-secondary btn-icon-only">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
            <div id="modal-status" class="mb-4"></div>
            <div id="modal-inhoud" class="modal-form-content overflow-y-auto">
                <form id="modal-formulier">
                    <div id="modal-velden"></div>
                </form>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
                <button id="modal-annuleren" class="btn btn-secondary">
                    Annuleren
                </button>
                <button id="modal-opslaan" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    Opslaan
                </button>
            </div>
        </div>
    </div>

    <!-- Bevestigings Modal -->
    <div id="bevestigings-modal" class="hidden modal-overlay">
        <div class="modal-content-card">
            <div class="flex items-center mb-6">
                <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <div class="ml-4">
                    <h3 class="modal-title">Bevestiging vereist</h3>
                </div>
            </div>
            <div class="mb-6">
                <p id="bevestig-bericht" class="modal-text"></p>
            </div>
            <div class="flex justify-end space-x-3">
                <button id="bevestig-annuleren" class="btn btn-secondary">
                    Annuleren
                </button>
                <button id="bevestig-verwijderen" class="btn btn-danger">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    Verwijderen
                </button>
            </div>
        </div>
    </div>

    <script>
        // ===============================================
        // Globale Variabelen en Configuratie
        // ===============================================
        
        // Tab configuratie mapping naar SharePoint lijsten
        const TAB_CONFIGURATIE = {
            'medewerkers': 'Medewerkers',
            'dagen-indicators': 'DagenIndicators', 
            'functies': 'keuzelijstFuncties',
            'verlofredenen': 'Verlofredenen',
            'teams': 'Teams',
            'seniors': 'Seniors',
            'uren-per-week': 'UrenPerWeek',
            'incidenteel-zitting-vrij': 'IncidenteelZittingVrij'
        };

        // Globale status beheer
        let sharePointContext = {
            siteUrl: '',
            requestDigest: ''
        };
        let huidigeTab = null;
        let huidigeModalData = null;
        let gebruikersInstellingen = null;
        let isDarkTheme = false;

        // ===============================================
        // Theme Management Functies
        // ===============================================
        
        function pasThemaToe(theme) {
            isDarkTheme = theme === 'dark';
            const body = document.body;
            
            if (isDarkTheme) {
                body.classList.remove('bg-gray-50', 'text-gray-900');
                body.classList.add('bg-gray-900', 'text-gray-100', 'dark');
                werkElementenBijVoorDarkTheme();
            } else {
                body.classList.remove('bg-gray-900', 'text-gray-100', 'dark');
                body.classList.add('bg-gray-50', 'text-gray-900');
                werkElementenBijVoorLightTheme();
            }
            
            werkAlleDynamischeInhoudStylesBij();
            console.log(`${isDarkTheme ? 'Donker' : 'Licht'} thema toegepast`);
        }

        function werkElementenBijVoorDarkTheme() {
            // Werk loading overlay bij
            const loadingCard = document.querySelector('#globale-loading .modal-content');
            if (loadingCard) {
                loadingCard.className = 'bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 modal-content';
                const loadingText = loadingCard.querySelector('span');
                if (loadingText) loadingText.className = 'text-gray-100 font-medium';
            }

            // Werk headers bij
            const hoofdTitel = document.querySelector('h1');
            if (hoofdTitel) hoofdTitel.className = 'text-4xl font-bold text-white mb-2';
            
            const subTitel = document.querySelector('header p');
            if (subTitel) subTitel.className = 'text-gray-300 text-lg';

            document.getElementById('huidige-gebruiker').className = 'text-sm text-gray-300 font-medium';
            document.getElementById('verbinding-status').className = 'text-xs text-gray-400 mt-1';

            // Werk navigatie en footer bij
            const tabNavigatie = document.getElementById('tab-navigatie');
            if (tabNavigatie) tabNavigatie.className = 'flex flex-wrap -mb-px space-x-2 sm:space-x-4 md:space-x-6';
            
            const paginaFooter = document.getElementById('pagina-footer');
            if (paginaFooter) {
                paginaFooter.className = 'text-center mt-16 py-8 border-t border-gray-700';
                const footerLink = paginaFooter.querySelector('a');
                if (footerLink) footerLink.className = 'text-blue-400 hover:text-blue-300 hover:underline transition-colors';
            }
        }

        function werkElementenBijVoorLightTheme() {
            // Werk loading overlay bij
            const loadingCard = document.querySelector('#globale-loading .modal-content');
            if (loadingCard) {
                loadingCard.className = 'bg-white p-8 rounded-xl shadow-2xl border border-gray-200 modal-content';
                const loadingText = loadingCard.querySelector('span');
                if (loadingText) loadingText.className = 'text-gray-900 font-medium';
            }

            // Werk headers bij
            const hoofdTitel = document.querySelector('h1');
            if (hoofdTitel) hoofdTitel.className = 'text-4xl font-bold text-gray-900 mb-2';
            
            const subTitel = document.querySelector('header p');
            if (subTitel) subTitel.className = 'text-gray-600 text-lg';

            document.getElementById('huidige-gebruiker').className = 'text-sm text-gray-600 font-medium';
            document.getElementById('verbinding-status').className = 'text-xs text-gray-500 mt-1';

            // Werk navigatie en footer bij
            const tabNavigatie = document.getElementById('tab-navigatie');
            if (tabNavigatie) tabNavigatie.className = 'flex flex-wrap -mb-px space-x-2 sm:space-x-4 md:space-x-6';
            
            const paginaFooter = document.getElementById('pagina-footer');
            if (paginaFooter) {
                paginaFooter.className = 'text-center mt-16 py-8 border-t border-gray-300';
                const footerLink = paginaFooter.querySelector('a');
                if (footerLink) footerLink.className = 'text-blue-600 hover:text-blue-700 hover:underline transition-colors';
            }
        }

        function werkAlleDynamischeInhoudStylesBij() {
            // Werk tab knoppen bij
            document.querySelectorAll('.tab-button').forEach(btn => {
                const basisClasses = 'tab-button py-3 px-4 text-sm font-medium text-center rounded-t-lg whitespace-nowrap';
                if (btn.classList.contains('active')) {
                    btn.className = `${basisClasses} active text-blue-600 border-blue-600`;
                } else {
                    btn.className = `${basisClasses} ${isDarkTheme ? 'text-gray-400 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'}`;
                }
            });

            // Werk tab inhoud bij
            const tabContainer = document.getElementById('tab-inhoud-container');
            if (tabContainer && tabContainer.firstChild) {
                werkTabelStylesBij(tabContainer);
                werkModalStylesBij();
                werkFormulierStylesBij();
            }
        }

        function werkTabelStylesBij(container) {
            const tabelWrapper = container.querySelector('.table-container');
            if (tabelWrapper) {
                const tabel = tabelWrapper.querySelector('table');
                if (tabel) {
                    tabel.className = `data-table ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`;
                    
                    // Werk tabel rijen bij
                    tabel.querySelectorAll('tbody tr').forEach(rij => {
                        rij.className = `transition-all duration-200 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`;
                        
                        // Werk actie knoppen bij
                        rij.querySelectorAll('button[title="Bewerken"]').forEach(btn => {
                            btn.className = `${isDarkTheme ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors p-1 rounded hover:bg-gray-100`;
                        });
                        
                        rij.querySelectorAll('button[title="Verwijderen"]').forEach(btn => {
                            btn.className = `${isDarkTheme ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors p-1 rounded hover:bg-gray-100`;
                        });
                    });
                }
            }
        }

        function werkModalStylesBij() {
            // Werk bewerkings modal bij
            const bewerkingsModal = document.getElementById('bewerkings-modal');
            if (!bewerkingsModal.classList.contains('hidden')) {
                const modalInhoud = bewerkingsModal.querySelector('.modal-content');
                if (modalInhoud) {
                    modalInhoud.className = `${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden modal-content`;
                }
                
                const modalTitel = bewerkingsModal.querySelector('#modal-titel');
                if (modalTitel) modalTitel.className = `text-xl font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`;
                
                const modalFooter = bewerkingsModal.querySelector('.border-t');
                if (modalFooter) modalFooter.className = `flex justify-end space-x-3 p-6 border-t ${isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`;
            }

            // Werk bevestigings modal bij
            const bevestigingsModal = document.getElementById('bevestigings-modal');
            if (!bevestigingsModal.classList.contains('hidden')) {
                const modalInhoud = bevestigingsModal.querySelector('.modal-content');
                if (modalInhoud) {
                    modalInhoud.className = `${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-2xl max-w-md w-full modal-content`;
                }
            }
        }

        function werkFormulierStylesBij() {
            // Werk formulier velden bij in modal
            document.querySelectorAll('.form-field').forEach(veld => {
                const label = veld.querySelector('label');
                if (label) {
                    label.className = `form-label block font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`;
                }
                
                const input = veld.querySelector('input, select, textarea');
                if (input && !input.type === 'color') {
                    input.className = `form-input w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;
                }
            });
        }

        // ===============================================
        // Veld Type Detectie en Validatie
        // ===============================================
        
        function krijgVeldTypeInfo(veld) {
            const veldNaam = veld.interneNaam.toLowerCase();
            const veldType = veld.type;
            
            // Geboortedatum detectie - alleen datum, geen tijd
            if (veldNaam.includes('geboortedatum') || veldNaam.includes('birthdate')) {
                return { inputType: 'date', validation: 'date' };
            }
            
            // Verbeterde detectie voor tijd/datum velden gebaseerd op veldnamen
            if (veldNaam.includes('start') || veldNaam.includes('einde') || veldNaam.includes('eind')) {
                if (veldType === 'DateTime') {
                    return { inputType: 'datetime-local', validation: 'datetime' };
                } else {
                    return { inputType: 'time', validation: 'time', placeholder: '09:30' };
                }
            }
            
            // Telefoonnummer detectie
            if (veldNaam.includes('telefoon') || veldNaam.includes('phone')) {
                return { 
                    inputType: 'tel', 
                    validation: 'phone', 
                    placeholder: '06 123 456 78', 
                    pattern: '[0-9\\s]+' 
                };
            }
            
            // Kleur veld detectie
            if (veldNaam.includes('kleur') || veldNaam.includes('color')) {
                return { 
                    inputType: 'color', 
                    validation: 'color', 
                    showHexInput: true 
                };
            }
            
            // E-mail detectie
            if (veldNaam.includes('mail') || veldNaam.includes('email')) {
                return { inputType: 'email', validation: 'email' };
            }

            // Keuze veld afhandeling
            if (veldType === 'Choice') {
                if (veldNaam.includes('patroon')) {
                    return { 
                        inputType: 'select', 
                        options: ['', 'Effen', 'Diagonale lijn (rechts)', 'Diagonale lijn (links)', 'Kruis', 'Plus', 'Louis Vuitton'] 
                    };
                }
                if (veldNaam.includes('terugkeerpatroon')) {
                    return { 
                        inputType: 'select', 
                        options: ['', 'Dagelijks', 'Wekelijks', 'Maandelijks'] 
                    };
                }
            }
            
            // Lookup veld afhandeling
            if (veldNaam === 'team') {
                return { inputType: 'select', populateFrom: 'Teams', populateField: 'Naam' };
            }
            if (veldNaam === 'functie') {
                return { inputType: 'select', populateFrom: 'keuzelijstFuncties', populateField: 'Title' };
            }
            
            // DateTime veld afhandeling
            if (veldType === 'DateTime') {
                if (veld.format === 'DateOnly') {
                    return { inputType: 'date', validation: 'date' };
                }
                return { inputType: 'datetime-local', validation: 'datetime' };
            }
            
            if (veldType === 'Date') {
                return { inputType: 'date', validation: 'date' };
            }

            // Standaard veld type mapping
            return {
                inputType: veldType === 'Note' ? 'textarea' :
                           veldType === 'Number' || veldType === 'Currency' ? 'number' :
                           veldType === 'Boolean' ? 'select' : 'text'
            };
        }

        // Verbeterde veld verberg logica - verbeterde ID detectie
        function moetVeldVerbergen(veldNaam) {
            if (!veldNaam) return false;

            const genormaliseerdNaam = veldNaam.toLowerCase();

            // Verberg exacte ID matches maar niet velden die eindigen met ID (zoals MedewerkerID)
            if (genormaliseerdNaam === 'id') return true;

            // Extra velden om te verbergen op de Medewerkers tab
            const extraVerborgen = [
                'halvedagtype',
                'halvedagweekdag',
                'urenperweek',
                'werkdagen',
                'werkschema'
            ];
            if (extraVerborgen.includes(genormaliseerdNaam)) return true;

            // Verberg geen velden die eindigen met 'id' maar langer zijn (zoals "MedewerkerID", "TeamID", etc.)
            return false;
        }

        // Verbeterde gebruikersnaam sanering - behoudt domein prefix voor authenticatie
        function saneertGebruikersnaam(gebruikersnaam) {
            if (!gebruikersnaam) return '';
            
            let gesaneerd = String(gebruikersnaam).trim();
            
            // Verwijder SharePoint claim prefix indien aanwezig, maar behoud domein\gebruikersnaam formaat
            if (gesaneerd.includes('i:0#.w|')) {
                const delen = gesaneerd.split('i:0#.w|');
                if (delen.length > 1) gesaneerd = delen[1];
            } else if (gesaneerd.includes('|')) {
                const delen = gesaneerd.split('|');
                gesaneerd = delen[delen.length - 1] || gesaneerd;
            }
            
            // Behoud domein\gebruikersnaam formaat voor authenticatie (bijv. "org\busselw")
            // Verwijder niet het domein prefix omdat het nodig is voor login
            
            return gesaneerd.toLowerCase();
        }

        function formateerGebruikersnaamVoorOpslaan(gebruikersnaam) {
            if (!gebruikersnaam) return '';
            
            const gesaneerd = saneertGebruikersnaam(gebruikersnaam);
            
            // Als het nog geen claim prefix heeft, voeg het toe
            if (!String(gebruikersnaam).includes('i:0#.w|')) {
                return `i:0#.w|${gesaneerd}`;
            }
            
            return gebruikersnaam;
        }

        // Krijg genormaliseerde gebruikersnaam van SharePoint gebruikersdata - behoudt domein\gebruikersnaam formaat
        async function krijgGenormaliseerdGebruikersnaamVanSharePoint(inputWaarde) {
            if (!inputWaarde) return '';
            
            try {
                // Probeer eerst gebruiker te vinden met verschillende methodes
                let gebruikerUrl;
                const gesaneerdInput = saneertGebruikersnaam(inputWaarde);
                
                // Probeer meerdere zoek benaderingen
                const zoekMethodes = [
                    `LoginName eq '${encodeURIComponent(formateerGebruikersnaamVoorOpslaan(gesaneerdInput))}'`,
                    `Title eq '${encodeURIComponent(inputWaarde)}'`,
                    `substringof('${encodeURIComponent(gesaneerdInput)}', LoginName)`,
                    `substringof('${encodeURIComponent(inputWaarde)}', Title)`
                ];
                
                for (const zoekMethode of zoekMethodes) {
                    gebruikerUrl = `${sharePointContext.siteUrl}/_api/web/siteusers?$filter=${zoekMethode}&$top=1`;
                    
                    const response = await fetch(gebruikerUrl, { 
                        headers: { 'Accept': 'application/json;odata=verbose' } 
                    });
                    
                    if (response.ok) {
                        const gebruikerData = await response.json();
                        if (gebruikerData.d.results && gebruikerData.d.results.length > 0) {
                            const gebruiker = gebruikerData.d.results[0];
                            console.log('Gevonden gebruiker:', gebruiker);
                            
                            // Return de genormaliseerde gebruikersnaam met domein prefix (bijv. "org\busselw")
                            // Verwijder alleen de SharePoint claim prefix, behoud domein\gebruikersnaam
                            let genormaliseerdGebruikersnaam = saneertGebruikersnaam(gebruiker.LoginName || gebruiker.Title || inputWaarde);
                            
                            // Zorg ervoor dat we domein\gebruikersnaam formaat hebben
                            if (!genormaliseerdGebruikersnaam.includes('\\') && gebruiker.LoginName && gebruiker.LoginName.includes('\\')) {
                                // Extract domein\gebruikersnaam van LoginName indien beschikbaar
                                const loginNaam = saneertGebruikersnaam(gebruiker.LoginName);
                                if (loginNaam.includes('\\')) {
                                    genormaliseerdGebruikersnaam = loginNaam;
                                }
                            }
                            
                            return genormaliseerdGebruikersnaam;
                        }
                    }
                }
                
                // Als geen gebruiker gevonden, return gesaneerde input (behoud domein indien aanwezig)
                console.log('Geen gebruiker gevonden, gebruik gesaneerde input');
                return gesaneerdInput;
                
            } catch (error) {
                console.warn('Fout bij ophalen genormaliseerde gebruikersnaam:', error);
                return saneertGebruikersnaam(inputWaarde);
            }
        }

        // Helper functie om datum van SharePoint te parsen en beoogde datum te behouden
        function parseSharePointDatum(datumWaarde, isAlleenDatum = false) {
            if (!datumWaarde) return null;
            
            const datum = new Date(datumWaarde);
            if (isNaN(datum.getTime())) return null;
            
            if (isAlleenDatum) {
                // Voor alleen-datum velden, gebruik lokale datum om tijdzone verschuivingen te voorkomen
                // Dit zorgt ervoor dat de datum wordt getoond zoals bedoeld ongeacht server tijdzone
                return {
                    jaar: datum.getFullYear(),
                    maand: datum.getMonth() + 1,
                    dag: datum.getDate(),
                    geformatteerd: `${datum.getFullYear()}-${String(datum.getMonth() + 1).padStart(2, '0')}-${String(datum.getDate()).padStart(2, '0')}`
                };
            }
            
            return datum;
        }

        // Verbeterde gebruikersinstellingen laden
        async function laadGebruikersInstellingen() {
            try {
                if (!sharePointContext.siteUrl) {
                    console.warn('SharePoint context niet beschikbaar voor gebruikersinstellingen');
                    pasThemaToe('light');
                    return;
                }

                const gebruikerResponse = await fetch(`${sharePointContext.siteUrl}/_api/web/currentuser`, {
                    headers: { 'Accept': 'application/json;odata=verbose' }
                });

                if (!gebruikerResponse.ok) throw new Error('Kon huidige gebruiker niet ophalen');
                
                const gebruikerData = await gebruikerResponse.json();
                const huidigeGebruiker = gebruikerData.d;
                
                const instellingenUrl = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('gebruikersInstellingen')/items?$filter=Title eq '${encodeURIComponent(huidigeGebruiker.LoginName)}'&$top=1`;
                
                const instellingenResponse = await fetch(instellingenUrl, {
                    headers: { 'Accept': 'application/json;odata=verbose' }
                });

                if (instellingenResponse.ok) {
                    const instellingenData = await instellingenResponse.json();
                    if (instellingenData.d.results && instellingenData.d.results.length > 0) {
                        gebruikersInstellingen = instellingenData.d.results[0];
                        const soortWeergave = gebruikersInstellingen.SoortWeergave;
                        console.log('Gebruikersinstellingen geladen:', soortWeergave);
                        if (soortWeergave) {
                            pasThemaToe(soortWeergave);
                            return;
                        }
                    }
                }
                
                console.log('Geen gebruikersinstellingen gevonden, standaard lichte thema wordt toegepast');
                pasThemaToe('light');
            } catch (error) {
                console.warn('Kon gebruikersinstellingen niet laden:', error);
                pasThemaToe('light');
            }
        }

        // Verbeterde validatie met betere foutmeldingen
        function valideerVeld(veld, waarde) {
            const veldInfo = krijgVeldTypeInfo(veld);
            const fouten = [];
            
            if (veld.isRequired && (!waarde || String(waarde).trim() === '')) {
                fouten.push(`${veld.titel} is verplicht`);
                return fouten;
            }
            
            if (!waarde || String(waarde).trim() === '') return fouten;
            
            switch (veldInfo.validation) {
                case 'phone':
                    if (!/^[0-9\s]+$/.test(waarde)) {
                        fouten.push(`${veld.titel} mag alleen cijfers en spaties bevatten`);
                    }
                    if (waarde.replace(/\s/g, '').length < 8) {
                        fouten.push(`${veld.titel} moet minimaal 8 cijfers bevatten`);
                    }
                    break;
                    
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waarde)) {
                        fouten.push(`${veld.titel} moet een geldig e-mailadres zijn`);
                    }
                    break;
                    
                case 'color':
                    if (!/^#[0-9A-Fa-f]{6}$/i.test(waarde)) {
                        fouten.push(`${veld.titel} moet een geldige hex kleurcode zijn (bijv. #FF0000)`);
                    }
                    break;
                    
                case 'time':
                    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(waarde)) {
                        fouten.push(`${veld.titel} moet in HH:MM formaat zijn (bijv. 09:30)`);
                    }
                    break;
                    
                case 'datetime':
                    const datum = new Date(waarde);
                    if (isNaN(datum.getTime())) {
                        fouten.push(`${veld.titel} bevat een ongeldige datum/tijd`);
                    }
                    break;
                    
                case 'date':
                    const alleenDatum = new Date(waarde);
                    if (isNaN(alleenDatum.getTime())) {
                        fouten.push(`${veld.titel} bevat een ongeldige datum`);
                    }
                    break;
            }
            
            return fouten;
        }

        // ===============================================
        // Formulier Veld Creatie
        // ===============================================
        
        // Verbeterde formulier veld creatie met betere styling
        async function maakFormulierVeld(veld, itemData, lijstConfig) {
            const container = document.createElement('div');
            container.className = 'form-field mb-6';

            const label = document.createElement('label');
            label.className = `form-label block font-medium mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`;
            label.textContent = veld.titel;
            if (veld.isRequired) {
                const vereist = document.createElement('span');
                vereist.className = 'text-red-500 ml-1';
                vereist.textContent = '*';
                label.appendChild(vereist);
            }

            let input;
            const ruweWaarde = itemData ? itemData[veld.interneNaam] : undefined;
            let weergaveWaarde = ruweWaarde;

            const veldInfo = krijgVeldTypeInfo(veld);
            const veldNaamLower = veld.interneNaam.toLowerCase();

            // Behandel verschillende veld types voor weergave waardes
            if (veld.type === 'User' || veld.type === 'Lookup') {
                weergaveWaarde = ruweWaarde?.Title || ruweWaarde?.Name || (typeof ruweWaarde === 'string' ? ruweWaarde : '');
                if (['username', 'gebruikersnaam', 'gnaam', 'medewerkerid', 'teamleiderid'].some(key => veldNaamLower.includes(key))) {
                    weergaveWaarde = saneertGebruikersnaam(ruweWaarde?.LoginName || weergaveWaarde);
                }
            } else if (veld.type === 'DateTime') {
                if (ruweWaarde) {
                    const veldNaamLower = veld.interneNaam.toLowerCase();
                    const isAlleenDatum = lijstConfig.velden.find(f => f.interneNaam === veld.interneNaam)?.format === 'DateOnly';
                    const isGeboortedatum = veldNaamLower.includes('geboortedatum') || veldNaamLower.includes('birthdate');
                    
                    if (isGeboortedatum || isAlleenDatum || veldInfo.inputType === 'date') {
                        // Gebruik helper functie om datum te parsen en originele datum te behouden
                        const geparsedDatum = parseSharePointDatum(ruweWaarde, true);
                        weergaveWaarde = geparsedDatum ? geparsedDatum.geformatteerd : '';
                        console.log(`Geboortedatum laden: ${ruweWaarde} -> ${weergaveWaarde} (originele datum behouden)`);
                    } else {
                        const datum = new Date(ruweWaarde);
                        weergaveWaarde = !isNaN(datum.getTime()) ? datum.toISOString().slice(0, 16) : '';
                    }
                } else {
                    weergaveWaarde = '';
                }
            }

            // Maak input gebaseerd op veld type
            switch (veldInfo.inputType) {
                case 'tel':
                    input = document.createElement('input');
                    input.type = 'tel';
                    input.placeholder = veldInfo.placeholder || '06 123 456 78';
                    if (veldInfo.pattern) input.pattern = veldInfo.pattern;
                    input.value = weergaveWaarde || '';
                    break;

                case 'email':
                    input = document.createElement('input');
                    input.type = 'email';
                    input.value = weergaveWaarde || '';
                    break;

                case 'color':
                    const kleurContainer = document.createElement('div');
                    kleurContainer.className = 'color-input-container flex gap-2';
                    
                    input = document.createElement('input');
                    input.type = 'color';
                    input.value = weergaveWaarde || '#000000';
                    input.className = 'color-picker w-12 h-10 rounded border-2';
                    
                    const hexInput = document.createElement('input');
                    hexInput.type = 'text';
                    hexInput.placeholder = '#RRGGBB';
                    hexInput.value = weergaveWaarde || '';
                    hexInput.className = 'form-input flex-1';
                    hexInput.name = veld.interneNaam;

                    input.addEventListener('input', () => {
                        hexInput.value = input.value.toUpperCase();
                    });
                    
                    hexInput.addEventListener('input', () => {
                        if (/^#[0-9A-Fa-f]{6}$/i.test(hexInput.value)) {
                            input.value = hexInput.value;
                        }
                    });
                    
                    kleurContainer.appendChild(input);
                    kleurContainer.appendChild(hexInput);
                    container.appendChild(label);
                    container.appendChild(kleurContainer);
                    return container;

                case 'select':
                    input = document.createElement('select');
                    const standaardOptie = document.createElement('option');
                    standaardOptie.value = '';
                    standaardOptie.textContent = '-- Selecteer --';
                    input.appendChild(standaardOptie);
                    
                    if (veldInfo.options) {
                        veldInfo.options.slice(1).forEach(opt => {
                            const optie = document.createElement('option');
                            optie.value = opt;
                            optie.textContent = opt;
                            if (opt === weergaveWaarde) optie.selected = true;
                            input.appendChild(optie);
                        });
                    } else if (veld.type === 'Boolean') {
                        // Maak toggle switch in plaats van dropdown
                        const toggleContainer = document.createElement('div');
                        toggleContainer.className = 'toggle-container flex items-center justify-between';
                        
                        const toggleWrapper = document.createElement('div');
                        toggleWrapper.className = 'toggle-switch relative inline-block w-11 h-6';
                        
                        input = document.createElement('input');
                        input.type = 'checkbox';
                        input.className = 'toggle-input sr-only';
                        input.name = veld.interneNaam;
                        input.id = `toggle-${veld.interneNaam}`;
                        
                        let effectieveWaarde = weergaveWaarde;
                        if (itemData === null) {
                            if (veldNaamLower.includes('actief')) {
                                effectieveWaarde = true;
                            } else if (veldNaamLower.includes('terugkerend')) {
                                effectieveWaarde = false;
                            }
                        }
                        
                        input.checked = effectieveWaarde === true || String(effectieveWaarde) === 'true';
                        
                        const slider = document.createElement('span');
                        slider.className = 'toggle-slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 transition-all duration-300 rounded-full';
                        
                        const sliderKnop = document.createElement('span');
                        sliderKnop.className = 'toggle-button absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-300';
                        
                        slider.appendChild(sliderKnop);
                        toggleWrapper.appendChild(input);
                        toggleWrapper.appendChild(slider);
                        
                        const statusTekst = document.createElement('span');
                        statusTekst.className = 'toggle-status text-sm font-medium ml-3';
                        statusTekst.textContent = input.checked ? 'Ja' : 'Nee';
                        
                        // Voeg event listener toe om status tekst en styling bij te werken
                        input.addEventListener('change', () => {
                            statusTekst.textContent = input.checked ? 'Ja' : 'Nee';
                            if (input.checked) {
                                slider.classList.add('bg-blue-600');
                                slider.classList.remove('bg-gray-300', 'dark:bg-gray-600');
                                sliderKnop.style.transform = 'translateX(20px)';
                            } else {
                                slider.classList.remove('bg-blue-600');
                                slider.classList.add('bg-gray-300', 'dark:bg-gray-600');
                                sliderKnop.style.transform = 'translateX(0)';
                            }
                        });
                        
                        // Stel initiële status in
                        if (input.checked) {
                            slider.classList.add('bg-blue-600');
                            slider.classList.remove('bg-gray-300', 'dark:bg-gray-600');
                            sliderKnop.style.transform = 'translateX(20px)';
                        }

                        toggleContainer.appendChild(toggleWrapper);
                        toggleContainer.appendChild(statusTekst);
                        container.appendChild(label);
                        container.appendChild(toggleContainer);
                        return container;
                    } else if (veldInfo.populateFrom) {
                        const ladenOpt = document.createElement('option');
                        ladenOpt.textContent = 'Laden...';
                        ladenOpt.disabled = true;
                        input.appendChild(ladenOpt);
                        
                        vulDropdownOpties(veldInfo).then(opties => {
                            input.removeChild(ladenOpt);
                            opties.forEach(opt => {
                                const optie = document.createElement('option');
                                optie.value = opt;
                                optie.textContent = opt;
                                if (opt === weergaveWaarde) optie.selected = true;
                                input.appendChild(optie);
                            });
                        });
                    }
                    break;

                case 'textarea':
                    input = document.createElement('textarea');
                    input.rows = 4;
                    input.value = weergaveWaarde || '';
                    break;

                case 'number':
                    input = document.createElement('input');
                    input.type = 'number';
                    input.value = weergaveWaarde || '';
                    break;

                case 'time':
                    input = document.createElement('input');
                    input.type = 'time';
                    input.value = weergaveWaarde || '';
                    break;

                case 'datetime-local':
                    input = document.createElement('input');
                    input.type = 'datetime-local';
                    input.value = weergaveWaarde || '';
                    break;

                case 'date':
                    input = document.createElement('input');
                    input.type = 'date';
                    input.value = weergaveWaarde || '';
                    break;

                default:
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = weergaveWaarde || '';
                    break;
            }

            input.name = veld.interneNaam;
            if (veld.isRequired) input.required = true;
            
            // Pas verbeterde styling toe (gebruikersnaam velden zijn nu bewerkbaar)
            if (input.tagName.toLowerCase() !== 'select') {
                input.className = `form-input w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;
            } else {
                input.className = `form-input w-full px-3 py-2 rounded-md border-2 transition-all duration-200 ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`;
            }

            container.appendChild(label);
            container.appendChild(input);
            return container;
        }

        // ===============================================
        // Tabel Inhoud Creatie
        // ===============================================
        
        // Verbeterde tabel inhoud creatie met betere responsiviteit
        function maakTabInhoudHTML(tabNaam, config) {
            const weergaveNaam = krijgWeergaveNaam(tabNaam);
            const enkelvoudNaam = krijgEnkelvoudNaam(tabNaam);
            
            return `
                <div class="space-y-8 w-full fade-in">
                    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                        <div>
                            <h2 class="text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-2">${weergaveNaam}</h2>
                            <p class="text-lg ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}">Beheer ${weergaveNaam.toLowerCase()} in het systeem</p>
                        </div>
                        <button onclick="openNieuwModal('${tabNaam}')" class="btn btn-success">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                            </svg>
                            ${enkelvoudNaam} toevoegen
                        </button>
                    </div>
                    
                    <div class="table-container ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg">
                        <table class="data-table">
                            <thead id="tabel-header-${tabNaam}"></thead>
                            <tbody id="tabel-body-${tabNaam}"></tbody>
                        </table>
                        <div class="px-6 py-4 border-t ${isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <span id="tabel-status-${tabNaam}" class="text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}">Laden...</span>
                                <button onclick="vernieuwHuidigeTab()" class="btn btn-secondary text-sm">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                                    </svg>
                                    Vernieuwen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Verbeterde tabel data weergave met betere formattering
        function toonTabelData(tabNaam, config, items) {
            const headerElement = document.getElementById(`tabel-header-${tabNaam}`);
            const bodyElement = document.getElementById(`tabel-body-${tabNaam}`);
            const statusElement = document.getElementById(`tabel-status-${tabNaam}`);

            if (!headerElement || !bodyElement || !statusElement) {
                console.error('Tabel elementen niet gevonden voor tab:', tabNaam);
                return;
            }

            const zichtbareVelden = (config.velden || []).filter(veld => 
                !moetVeldVerbergen(veld.interneNaam) && veld.titel.toLowerCase() !== 'id'
            );

            // Maak verbeterde tabel header
            headerElement.innerHTML = `
                <tr>
                    ${zichtbareVelden.map(veld => `
                        <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-100'}">
                            ${veld.titel}
                        </th>
                    `).join('')}
                    <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkTheme ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-100'}">
                        Acties
                    </th>
                </tr>
            `;

            if (items.length === 0) {
                bodyElement.innerHTML = `
                    <tr>
                        <td colspan="${zichtbareVelden.length + 1}" class="px-6 py-12 text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}">
                            <div class="flex flex-col items-center">
                                <svg class="w-16 h-16 mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd"></path>
                                </svg>
                                <p class="text-lg font-medium">Geen items gevonden</p>
                                <p class="text-sm">Voeg een item toe om te beginnen</p>
                            </div>
                        </td>
                    </tr>
                `;
                statusElement.textContent = 'Geen items';
            } else {
                bodyElement.innerHTML = items.map(item => {
                    const itemWeergaveNaam = krijgItemWeergaveNaam(item, config).replace(/'/g, "\\'");
                    return `
                        <tr class="transition-all duration-200 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}">
                            ${zichtbareVelden.map(veld => `
                                <td class="px-6 py-4 text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'}">
                                    ${formateerVeldWaarde(item, veld, config)}
                                </td>
                            `).join('')}
                            <td class="px-6 py-4 text-right">
                                <div class="flex justify-end space-x-2">
                                    <button onclick="openBewerkModal('${tabNaam}', ${item.Id})" 
                                            title="Bewerken" 
                                            class="p-2 rounded-lg transition-colors ${isDarkTheme ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-600' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'}">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                                        </svg>
                                    </button>
                                    <button onclick="bevestigVerwijdering('${tabNaam}', ${item.Id}, '${itemWeergaveNaam}')" 
                                            title="Verwijderen" 
                                            class="p-2 rounded-lg transition-colors ${isDarkTheme ? 'text-red-400 hover:text-red-300 hover:bg-gray-600' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
                
                statusElement.textContent = `${items.length} item${items.length !== 1 ? 's' : ''} geladen`;
            }
        }

        // Verbeterde veld waarde formattering
        function formateerVeldWaarde(item, veldConfig, lijstConfig) {
            let waarde = item[veldConfig.interneNaam];
            
            if (waarde === null || waarde === undefined) {
                return `<span class="${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}">-</span>`;
            }

            const veldNaamLower = veldConfig.interneNaam.toLowerCase();
            
            // Behandel gebruikersnaam velden
            if (['username', 'gebruikersnaam', 'gnaam', 'medewerkerid', 'teamleiderid'].some(key => veldNaamLower.includes(key))) {
                return `<span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">${saneertGebruikersnaam(waarde.Title || waarde)}</span>`;
            }
            
            const veldInfo = krijgVeldTypeInfo(veldConfig);

            switch (veldConfig.type) {
                case 'Boolean':
                    return waarde ? 
                        '<span class="inline-flex items-center justify-center"><span class="status-indicator status-active" title="Ja"></span></span>' : 
                        '<span class="inline-flex items-center justify-center"><span class="status-indicator status-inactive" title="Nee"></span></span>';
                        
                case 'DateTime':
                    try {
                        const datum = new Date(waarde);
                        const veldNaamLower = veldConfig.interneNaam.toLowerCase();
                        
                        // Controleer of dit een geboortedatum veld is - toon altijd alleen datum
                        if (veldNaamLower.includes('geboortedatum') || veldNaamLower.includes('birthdate')) {
                            return `<span class="date-field">${datum.toLocaleDateString('nl-NL')}</span>`;
                        }
                        
                        // Controleer of veld is geconfigureerd als alleen-datum
                        const isAlleenDatum = lijstConfig.velden.find(f => f.interneNaam === veldConfig.interneNaam)?.format === 'DateOnly';
                        
                        if (isAlleenDatum) {
                            return `<span class="date-field">${datum.toLocaleDateString('nl-NL')}</span>`;
                        }
                        
                        return `<span class="font-mono text-sm">${datum.toLocaleString('nl-NL', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}</span>`;
                    } catch (e) {
                        return '<span class="text-red-500">Ongeldige datum</span>';
                    }
                    
                case 'User':
                case 'Lookup':
                    const weergaveTekst = waarde.Title || waarde.Name || (typeof waarde === 'string' ? waarde : '-');
                    return `<span class="font-medium">${weergaveTekst}</span>`;
            }

            // Speciale formattering voor verschillende veld types
            if (veldInfo.validation === 'color' && waarde) {
                return `
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm" style="background-color: ${waarde}"></div>
                        <span class="font-mono text-sm">${waarde.toUpperCase()}</span>
                    </div>
                `;
            }
            
            if (veldInfo.validation === 'phone' && waarde) {
                const schoongemaakt = String(waarde).replace(/\s/g, '');
                if (schoongemaakt.length === 10) {
                    const geformatteerd = `${schoongemaakt.slice(0,2)} ${schoongemaakt.slice(2,5)} ${schoongemaakt.slice(5,8)} ${schoongemaakt.slice(8)}`;
                    return `<a href="tel:${schoongemaakt}" class="text-blue-600 hover:text-blue-800 underline font-mono">${geformatteerd}</a>`;
                }
                return `<span class="font-mono">${waarde}</span>`;
            }
            
            if (veldInfo.validation === 'email' && waarde) {
                return `<a href="mailto:${waarde}" class="text-blue-600 hover:text-blue-800 underline">${waarde}</a>`;
            }
            
            if (veldInfo.inputType === 'time' && waarde) {
                if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(waarde)) {
                    return `<span class="font-mono bg-gray-100 px-2 py-1 rounded text-sm">${waarde}</span>`;
                }
                return waarde;
            }

            const strWaarde = String(waarde);
            
            // Behandel lange tekst met betere afkapping
            if (strWaarde.length > 50) {
                return `
                    <span title="${strWaarde.replace(/"/g, '&quot;')}" class="cursor-help">
                        ${strWaarde.substring(0, 50)}...
                    </span>
                `;
            }
            
            // Behandel meerregelige tekst
            if (veldConfig.type === 'Note' && strWaarde.includes('\n')) {
                return `<div class="whitespace-pre-wrap max-w-xs text-sm">${strWaarde}</div>`;
            }
            
            return strWaarde;
        }

        // ===============================================
        // SharePoint Context en Data Functies
        // ===============================================
        
        // Verbeterde SharePoint context initialisatie
        async function initialiseertSharePointContext() {
            try {
                const huidigeUrl = window.location.href;
                console.log('Huidige URL:', huidigeUrl);
                
                // Try different URL patterns to extract the SharePoint site URL
                let siteUrl = null;
                
                // Pattern 1: Look for /cpw/ (lowercase)
                if (huidigeUrl.includes('/cpw/')) {
                    const urlDelen = huidigeUrl.split('/cpw/');
                    siteUrl = urlDelen[0];
                    console.log('Gevonden via /cpw/ patroon:', siteUrl);
                }
                // Pattern 2: Look for /CPW/ (uppercase) - fallback
                else if (huidigeUrl.includes('/CPW/')) {
                    const urlDelen = huidigeUrl.split('/CPW/');
                    siteUrl = urlDelen[0];
                    console.log('Gevonden via /CPW/ patroon:', siteUrl);
                }
                // Pattern 3: Extract from known SharePoint structure
                else {
                    const url = new URL(huidigeUrl);
                    const pathParts = url.pathname.split('/').filter(part => part.length > 0);
                    
                    // Look for SharePoint site structure: /sites/sitename
                    if (pathParts[0] === 'sites' && pathParts.length >= 2) {
                        siteUrl = `${url.origin}/sites/${pathParts[1]}`;
                        console.log('Gevonden via SharePoint sites patroon:', siteUrl);
                    }
                    // Fallback: try to find by looking for 'Verlof' in path
                    else {
                        const verlofIndex = pathParts.findIndex(part => part.toLowerCase().includes('verlof'));
                        if (verlofIndex >= 0) {
                            siteUrl = `${url.origin}/${pathParts.slice(0, verlofIndex + 1).join('/')}`;
                            console.log('Gevonden via Verlof patroon:', siteUrl);
                        }
                    }
                }
                
                if (!siteUrl) {
                    throw new Error('Kon SharePoint site URL niet bepalen uit de huidige URL');
                }
                
                sharePointContext.siteUrl = siteUrl;

                document.getElementById('verbinding-status').textContent = `Verbonden met: ${sharePointContext.siteUrl}`;
                
                const response = await fetch(`${sharePointContext.siteUrl}/_api/contextinfo`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json;odata=verbose' }
                });
                
                if (!response.ok) throw new Error(`SharePoint context fout: ${response.status}`);
                
                const data = await response.json();
                sharePointContext.requestDigest = data.d.GetContextWebInformation.FormDigestValue;
                console.log('SharePoint context geïnitialiseerd:', sharePointContext.siteUrl);
            } catch (error) {
                console.error('Fout bij initialiseren SharePoint context:', error.message);
                throw new Error('Kan geen verbinding maken met SharePoint: ' + error.message);
            }
        }

        async function laadHuidigeGebruiker() {
            try {
                const response = await fetch(`${sharePointContext.siteUrl}/_api/web/currentuser`, {
                    headers: { 'Accept': 'application/json;odata=verbose' }
                });
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('huidige-gebruiker').textContent = data.d.Title || 'Onbekende gebruiker';
                } else {
                    document.getElementById('huidige-gebruiker').textContent = 'Gebruiker onbekend (fout)';
                }
            } catch (error) {
                console.warn('Kon huidige gebruiker niet laden:', error);
                document.getElementById('huidige-gebruiker').textContent = 'Gebruiker onbekend';
            }
        }

        // ===============================================
        // Event Listeners Setup
        // ===============================================
        
        function setupEventListeners() {
            document.getElementById('tab-navigatie').addEventListener('click', async (e) => {
                const knop = e.target.closest('.tab-button');
                if (knop) {
                    const tabNaam = knop.dataset.tab;
                    await schakelTab(tabNaam);
                }
            });

            document.getElementById('modal-sluiten').addEventListener('click', sluitModal);
            document.getElementById('modal-annuleren').addEventListener('click', sluitModal);
            document.getElementById('modal-opslaan').addEventListener('click', slaModalDataOp);
            
            document.getElementById('bevestig-annuleren').addEventListener('click', sluitBevestigingsModal);
            document.getElementById('bevestig-verwijderen').addEventListener('click', voerVerwijderingUit);

            document.getElementById('bewerkings-modal').addEventListener('click', (e) => {
                if (e.target.id === 'bewerkings-modal') sluitModal();
            });
            document.getElementById('bevestigings-modal').addEventListener('click', (e) => {
                if (e.target.id === 'bevestigings-modal') sluitBevestigingsModal();
            });
        }

        // ===============================================
        // Tab Management Functies
        // ===============================================
        
        async function schakelTab(tabNaam) {
            if (!TAB_CONFIGURATIE[tabNaam]) {
                toonNotificatie('Onbekende tab: ' + tabNaam, 'error');
                return;
            }
            
            huidigeTab = tabNaam;
            
            // Werk tab knop status bij
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.tab === tabNaam) {
                    btn.classList.add('active');
                }
            });
            
            toonLading(`Laden van ${krijgWeergaveNaam(tabNaam)}...`);
            
            try {
                await laadTabInhoud(tabNaam);
            } catch (error) {
                toonNotificatie('Fout bij laden van gegevens: ' + error.message, 'error');
                document.getElementById('tab-inhoud-container').innerHTML = `
                    <div class="text-center py-16">
                        <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-red-700 mb-2">Fout bij laden</h3>
                        <p class="text-red-600">Kon inhoud niet laden voor ${krijgWeergaveNaam(tabNaam)}.</p>
                    </div>
                `;
            } finally {
                verbergLading();
                werkAlleDynamischeInhoudStylesBij();
            }
        }

        async function laadTabInhoud(tabNaam) {
            const lijstNaam = TAB_CONFIGURATIE[tabNaam];
            const config = window.getLijstConfig ? window.getLijstConfig(lijstNaam) : null;
            
            if (!config) throw new Error(`Configuratie niet gevonden voor ${lijstNaam}`);

            const container = document.getElementById('tab-inhoud-container');
            container.innerHTML = maakTabInhoudHTML(tabNaam, config);
            await laadLijstData(lijstNaam, config);
        }

        // ===============================================
        // Data Loading Functies
        // ===============================================
        
        // Extra hulp functies voor data loading...
        async function vulDropdownOpties(veldInfo) {
            if (!veldInfo.populateFrom) return [];
            
            try {
                const url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(veldInfo.populateFrom)}')/items?$select=${encodeURIComponent(veldInfo.populateField)}&$top=1000`;
                const response = await fetch(url, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const uniekewaardes = [...new Set(data.d.results
                        .map(item => item[veldInfo.populateField])
                        .filter(Boolean)
                    )];
                    return uniekewaardes.sort();
                }
            } catch (error) {
                console.warn(`Kon dropdown niet vullen voor ${veldInfo.populateFrom}:`, error);
            }
            return [];
        }

        function krijgSelectVelden(config) {
            const velden = ['Id'];
            if (config.velden) {
                config.velden.forEach(veld => {
                    if (veld.interneNaam && !velden.includes(veld.interneNaam) && !moetVeldVerbergen(veld.interneNaam)) {
                        if (veld.type === 'Lookup' || veld.type === 'User') {
                            velden.push(`${veld.interneNaam}/${veld.lookupKolom || 'Title'}`);
                            velden.push(`${veld.interneNaam}/Id`);
                        }
                        velden.push(veld.interneNaam);
                    }
                });
            }
            return [...new Set(velden)];
        }

        function krijgExpandVelden(config) {
            const expandVelden = [];
            if (config.velden) {
                config.velden.forEach(veld => {
                    if ((veld.type === 'Lookup' || veld.type === 'User') && !moetVeldVerbergen(veld.interneNaam)) {
                        if (veld.interneNaam && veld.interneNaam !== 'Author' && veld.interneNaam !== 'Editor') {
                            expandVelden.push(veld.interneNaam);
                        }
                    }
                });
            }
            return [...new Set(expandVelden)];
        }

        async function laadLijstData(lijstNaam, config) {
            try {
                const selectVelden = krijgSelectVelden(config);
                const expandVelden = krijgExpandVelden(config);
                
                let url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items`;
                url += `?$select=${selectVelden.map(encodeURIComponent).join(',')}`;
                if (expandVelden.length > 0) {
                    url += `&$expand=${expandVelden.map(encodeURIComponent).join(',')}`;
                }
                url += '&$top=1000';

                const response = await fetch(url, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                if (!response.ok) throw new Error(`Fout bij ophalen data: ${response.status} ${response.statusText}`);

                const data = await response.json();
                toonTabelData(huidigeTab, config, data.d.results || []);
            } catch (error) {
                console.error('Fout bij laden lijstdata:', error);
                document.getElementById(`tabel-status-${huidigeTab}`).textContent = 'Fout bij laden: ' + error.message;
                const bodyElement = document.getElementById(`tabel-body-${huidigeTab}`);
                if (bodyElement) {
                    bodyElement.innerHTML = `
                        <tr>
                            <td colspan="100%" class="text-red-500 p-8 text-center">
                                <div class="flex flex-col items-center">
                                    <svg class="w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                        </svg>
                                        <p class="font-medium">Data kon niet geladen worden</p>
                                        <p class="text-sm mt-1">${error.message}</p>
                                    </div>
                                </td>
                            </tr>
                        `;
                }
                throw error;
            }
        }

        function krijgItemWeergaveNaam(item, config) {
            return item.Title || item.Naam || 
                   (config.velden.find(f => f.titel === 'Naam' || f.titel === 'Titel') && 
                    item[config.velden.find(f => f.titel === 'Naam' || f.titel === 'Titel').interneNaam]) || 
                   `Item ${item.Id}`;
        }

        // ===============================================
        // Modal Management Functies
        // ===============================================
        
        async function openNieuwModal(tabNaam) {
            const lijstNaam = TAB_CONFIGURATIE[tabNaam];
            const config = window.getLijstConfig ? window.getLijstConfig(lijstNaam) : null;
            if (!config) { 
                toonNotificatie('Configuratie niet gevonden', 'error'); 
                return; 
            }
            const enkelvoudNaam = krijgEnkelvoudNaam(tabNaam);
            await openModal(`${enkelvoudNaam} toevoegen`, config, null);
        }

        async function openBewerkModal(tabNaam, itemId) {
            const lijstNaam = TAB_CONFIGURATIE[tabNaam];
            const config = window.getLijstConfig ? window.getLijstConfig(lijstNaam) : null;
            if (!config) { 
                toonNotificatie('Configuratie niet gevonden', 'error'); 
                return; 
            }

            toonLading('Item laden...');
            
            try {
                const selectVelden = krijgSelectVelden(config);
                const expandVelden = krijgExpandVelden(config);
                let url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items(${itemId})`;
                url += `?$select=${selectVelden.map(encodeURIComponent).join(',')}`;
                if (expandVelden.length > 0) url += `&$expand=${expandVelden.map(encodeURIComponent).join(',')}`;

                const response = await fetch(url, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                if (!response.ok) throw new Error(`Fout bij ophalen item: ${response.status}`);
                
                const data = await response.json();
                const enkelvoudNaam = krijgEnkelvoudNaam(tabNaam);
                await openModal(`${enkelvoudNaam} bewerken`, config, data.d);
            } catch (error) {
                toonNotificatie('Fout bij laden item: ' + error.message, 'error');
            } finally {
                verbergLading();
            }
        }

        async function openModal(titel, config, itemData = null) {
            document.getElementById('modal-titel').textContent = titel;
            
            // Standaard form rendering
            const veldenContainer = document.getElementById('modal-velden');
            veldenContainer.innerHTML = '';
            
            for (const veld of (config.velden || [])) {
                if (moetVeldVerbergen(veld.interneNaam) || veld.titel.toLowerCase() === 'id') continue;
                const veldElement = await maakFormulierVeld(veld, itemData, config);
                veldenContainer.appendChild(veldElement);
            }

            setupVeldValidatie(veldenContainer, config);
            huidigeModalData = { config: config, itemData: itemData, isEdit: !!itemData };
            document.getElementById('bewerkings-modal').classList.remove('hidden');
            werkAlleDynamischeInhoudStylesBij();
        }

        function setupVeldValidatie(container, config) {
            const inputs = container.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const veld = config.velden?.find(f => f.interneNaam === input.name);
                if (!veld) return;
                
                input.addEventListener('blur', () => {
                    const fouten = valideerVeld(veld, input.value);
                    const bestaandeFout = input.parentNode.querySelector('.field-error');
                    if (bestaandeFout) bestaandeFout.remove();
                    
                    // Reset border classes
                    input.classList.remove('border-red-500', 'border-green-500');
                    const basisBorderClass = isDarkTheme ? 'border-gray-600' : 'border-gray-300';
                    input.classList.add(basisBorderClass);

                    if (fouten.length > 0) {
                        input.classList.remove(basisBorderClass);
                        input.classList.add('border-red-500');
                        const foutDiv = document.createElement('div');
                        foutDiv.className = 'field-error text-red-500 text-xs mt-1';
                        foutDiv.textContent = fouten[0];
                        input.parentNode.appendChild(foutDiv);
                    } else if (input.value.trim() !== '' || veld.type === 'Boolean') {
                        input.classList.remove(basisBorderClass);
                        input.classList.add('border-green-500');
                    }
                });

                // Verbeterde telefoonnummer formattering
                const veldInfo = krijgVeldTypeInfo(veld);
                const veldNaamLower = veld.interneNaam.toLowerCase();
                
                if (veldInfo.validation === 'phone') {
                    input.addEventListener('input', (e) => {
                        let waarde = e.target.value.replace(/[^0-9\s]/g, '');
                        // Basis auto-formattering voor Nederlandse telefoonnummers
                        if (waarde.replace(/\s/g, '').length >= 2) {
                            waarde = waarde.replace(/\s/g, '').replace(/(\d{2})(\d{0,3})?(\d{0,3})?(\d{0,2})?/, (_, p1, p2, p3, p4) => 
                                [p1, p2, p3, p4].filter(Boolean).join(' ')
                            );
                        }
                        e.target.value = waarde;
                    });
                }
                
                // Verbeterde gebruikersnaam veld afhandeling - auto-normaliseer bij blur
                if (['username', 'gebruikersnaam', 'gnaam', 'medewerkerid', 'teamleiderid'].some(key => veldNaamLower.includes(key))) {
                    input.addEventListener('blur', async () => {
                        if (input.value.trim()) {
                            try {
                                const genormaliseerdGebruikersnaam = await krijgGenormaliseerdGebruikersnaamVanSharePoint(input.value);
                                if (genormaliseerdGebruikersnaam && genormaliseerdGebruikersnaam !== input.value) {
                                    input.value = genormaliseerdGebruikersnaam;
                                    console.log(`Auto-genormaliseerde gebruikersnaam: ${input.value} -> ${genormaliseerdGebruikersnaam}`);
                                    
                                    // Toon korte notificatie dat gebruikersnaam werd genormaliseerd
                                    const hint = document.createElement('div');
                                    hint.className = 'text-blue-600 text-xs mt-1 username-hint';
                                    hint.textContent = 'Gebruikersnaam automatisch genormaliseerd';
                                    
                                    const bestaandeHint = input.parentNode.querySelector('.username-hint');
                                    if (bestaandeHint) bestaandeHint.remove();
                                    
                                    input.parentNode.appendChild(hint);
                                    setTimeout(() => hint.remove(), 3000);
                                }
                            } catch (error) {
                                console.warn('Kon gebruikersnaam niet auto-normaliseren:', error);
                            }
                        }
                    });
                }
            });
        }

        function sluitModal() {
            document.getElementById('bewerkings-modal').classList.add('hidden');
            document.getElementById('modal-status').innerHTML = '';
            huidigeModalData = null;
        }

        async function slaModalDataOp() {
            if (!huidigeModalData) return;

            const formulier = document.getElementById('modal-formulier');
            const statusElement = document.getElementById('modal-status');
            statusElement.innerHTML = '';
            
            const formulierData = new FormData(formulier);
            const alleFouten = [];
            const gevalideerdeData = {};
            
            // Verbeterde validatie en data verwerking
            for (const veld of (huidigeModalData.config.velden || [])) {
                if (moetVeldVerbergen(veld.interneNaam) || veld.titel.toLowerCase() === 'id' || veld.readOnlyInModal) continue;
                
                let waarde;
                const veldNaam = veld.interneNaam.toLowerCase();
                
                // Speciale afhandeling voor Boolean velden met toggle switches
                if (veld.type === 'Boolean') {
                    const toggleInput = formulier.querySelector(`input[type="checkbox"][name="${veld.interneNaam}"]`);
                    if (toggleInput) {
                        waarde = toggleInput.checked ? 'true' : 'false';
                    } else {
                        waarde = formulierData.get(veld.interneNaam) || 'false';
                    }
                } else {
                    waarde = formulierData.get(veld.interneNaam);
                }
                
                const veldFouten = valideerVeld(veld, waarde);
                
                if (veldFouten.length > 0) {
                    alleFouten.push(...veldFouten);
                    continue;
                }

                let verwerkteWaarde = waarde;
                const isGebruikerVeldType = ['username', 'gebruikersnaam', 'gnaam', 'medewerkerid', 'teamleiderid'].some(key => veldNaam.includes(key));

                if (isGebruikerVeldType && verwerkteWaarde) {
                    // Sla altijd de genormaliseerde gebruikersnaam op voor gebruiker velden om authenticatie problemen te voorkomen
                    // Verwijder SharePoint claim prefix (i:0#.w|) bij opslaan
                    verwerkteWaarde = saneertGebruikersnaam(waarde);
                    console.log(`Genormaliseerde gebruikersnaam voor opslaan: ${waarde} -> ${verwerkteWaarde}`);
                } else {
                    switch (veld.type) {
                        case 'Boolean': 
                            // Behandel zowel checkbox (van toggle) als select (legacy)
                            const input = formulier.querySelector(`[name="${veld.interneNaam}"]`);
                            if (input.type === 'checkbox') {
                                verwerkteWaarde = input.checked;
                            } else {
                                verwerkteWaarde = (waarde === 'true'); 
                            }
                            break;
                        case 'Number': 
                        case 'Currency':
                            verwerkteWaarde = (waarde && waarde.trim() !== '') ? parseFloat(waarde) : null;
                            if (waarde && waarde.trim() !== '' && isNaN(verwerkteWaarde)) {
                                alleFouten.push(`${veld.titel} moet een geldig nummer zijn`); 
                                continue;
                            }
                            break;
                        case 'DateTime':
                            if (waarde && waarde.trim() !== '') {
                                // Speciale afhandeling voor geboortedatum om tijdzone problemen te voorkomen
                                if (veldNaam.includes('geboortedatum') || veldNaam.includes('birthdate')) {
                                    // Voor alleen-datum velden, maak datum in lokale tijdzone om dag verschuivingen te voorkomen
                                    const datumDelen = waarde.split('-');
                                    if (datumDelen.length === 3) {
                                        const jaar = parseInt(datumDelen[0]);
                                        const maand = parseInt(datumDelen[1]) - 1; // Maand is 0-gebaseerd
                                        const dag = parseInt(datumDelen[2]);
                                        
                                        // Maak datum in lokale tijdzone (Nederland) op middag om edge cases te vermijden
                                        const lokaleDatum = new Date(jaar, maand, dag, 12, 0, 0, 0);
                                        verwerkteWaarde = lokaleDatum.toISOString();
                                        
                                        console.log(`Geboortedatum opslaan: ${waarde} -> ${verwerkteWaarde} (lokale tijdzone)`);
                                    } else {
                                        alleFouten.push(`${veld.titel} heeft een ongeldig datumformaat`);
                                        continue;
                                    }
                                } else {
                                    const datum = new Date(waarde);
                                    if (!isNaN(datum)) verwerkteWaarde = datum.toISOString();
                                    else { alleFouten.push(`${veld.titel} bevat een ongeldige datum/tijd`); continue; }
                                }
                            } else verwerkteWaarde = null;
                            break;
                        default:
                            const veldInfo = krijgVeldTypeInfo(veld);
                            if (veldInfo.inputType === 'time') {
                                // Tijd waarde is al in HH:MM formaat
                            } else if (veldInfo.validation === 'color') {
                                // Kleur waarde is al in #RRGGBB formaat
                            }
                            if (waarde && waarde.trim() === '' && !veld.isRequired) verwerkteWaarde = null;
                            else if (!waarde && !veld.isRequired) verwerkteWaarde = null;
                    }
                }
                
                if (verwerkteWaarde !== undefined) {
                    gevalideerdeData[veld.interneNaam] = verwerkteWaarde;
                }
            }

            if (alleFouten.length > 0) {
                statusElement.innerHTML = `<div class="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">${alleFouten.join('<br>')}</div>`;
                return;
            }

            toonLading('Opslaan...');
            
            const itemPayload = { 
                '__metadata': { 
                    'type': `SP.Data.${huidigeModalData.config.lijstTitel.replace(/ /g, '_x0020_')}ListItem` 
                } 
            };
            Object.assign(itemPayload, gevalideerdeData);

            const url = huidigeModalData.isEdit 
                ? `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(huidigeModalData.config.lijstTitel)}')/items(${huidigeModalData.itemData.Id})`
                : `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(huidigeModalData.config.lijstTitel)}')/items`;

            const headers = {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': sharePointContext.requestDigest
            };
            
            if (huidigeModalData.isEdit) {
                headers['IF-MATCH'] = huidigeModalData.itemData.__metadata?.etag || '*';
                headers['X-HTTP-Method'] = 'MERGE';
            }

            try {
                const response = await fetch(url, {
                    method: 'POST', 
                    headers: headers, 
                    body: JSON.stringify(itemPayload)
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error?.message?.value || `Fout bij opslaan: ${response.status}`);
                }
                
                toonNotificatie(
                    huidigeModalData.isEdit ? 'Item succesvol bijgewerkt' : 'Item succesvol toegevoegd', 
                    'success'
                );
                sluitModal();
                await vernieuwHuidigeTab();
            } catch (error) {
                console.error('Opslaan fout:', error);
                statusElement.innerHTML = `<div class="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">${error.message}</div>`;
            } finally {
                verbergLading();
            }
        }

        function bevestigVerwijdering(tabNaam, itemId, itemNaam) {
            document.getElementById('bevestig-bericht').textContent = 
                `Weet u zeker dat u "${itemNaam}" wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`;
            document.getElementById('bevestigings-modal').classList.remove('hidden');
            werkAlleDynamischeInhoudStylesBij();
            window.pendingDelete = { tabNaam, itemId, itemNaam };
        }

        function sluitBevestigingsModal() {
            document.getElementById('bevestigings-modal').classList.add('hidden');
            window.pendingDelete = null;
        }

        async function voerVerwijderingUit() {
            if (!window.pendingDelete) return;
            
            const { tabNaam, itemId, itemNaam } = window.pendingDelete;
            const lijstNaam = TAB_CONFIGURATIE[tabNaam];
            const config = window.getLijstConfig ? window.getLijstConfig(lijstNaam) : null;
            
            if (!config) { 
                toonNotificatie('Configuratie niet gevonden', 'error'); 
                return; 
            }

            toonLading('Verwijderen...');
            sluitBevestigingsModal();

            try {
                const response = await fetch(
                    `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items(${itemId})`,
                    { 
                        method: 'POST', 
                        headers: { 
                            'Accept': 'application/json;odata=verbose', 
                            'X-RequestDigest': sharePointContext.requestDigest, 
                            'IF-MATCH': '*', 
                            'X-HTTP-Method': 'DELETE' 
                        } 
                    }
                );
                
                if (!response.ok) throw new Error(`Fout bij verwijderen: ${response.status}`);
                
                toonNotificatie(`"${itemNaam}" succesvol verwijderd`, 'success');
                await vernieuwHuidigeTab();
            } catch (error) {
                console.error('Verwijderfout:', error);
                toonNotificatie('Fout bij verwijderen: ' + error.message, 'error');
            } finally {
                verbergLading();
            }
        }

        async function vernieuwHuidigeTab() {
            if (huidigeTab) await schakelTab(huidigeTab);
        }

        // ===============================================
        // Helper Functies voor Weergave Namen
        // ===============================================
        
        function krijgWeergaveNaam(tabNaam) {
            const namen = { 
                'medewerkers': 'Medewerkers', 
                'dagen-indicators': 'Dag Indicatoren', 
                'functies': 'Functies', 
                'verlofredenen': 'Verlofredenen', 
                'teams': 'Teams', 
                'seniors': 'Seniors', 
                'uren-per-week': 'Uren Per Week', 
                'incidenteel-zitting-vrij': 'Incidenteel Zitting Vrij' 
            };
            return namen[tabNaam] || tabNaam.charAt(0).toUpperCase() + tabNaam.slice(1);
        }

        function krijgEnkelvoudNaam(tabNaam) {
            const namen = { 
                'medewerkers': 'Medewerker', 
                'dagen-indicators': 'Dag Indicator', 
                'functies': 'Functie', 
                'verlofredenen': 'Verlofreden', 
                'teams': 'Team', 
                'seniors': 'Senior', 
                'uren-per-week': 'Uren Per Week Item', 
                'incidenteel-zitting-vrij': 'Incidenteel Zitting Vrij Item' 
            };
            return namen[tabNaam] || tabNaam;
        }

        // ===============================================
        // Loading en Notificatie Functies
        // ===============================================
        
        function toonLading(bericht = 'Laden...') {
            document.getElementById('loading-bericht').textContent = bericht;
            document.getElementById('globale-loading').classList.remove('hidden');
        }

        function verbergLading() { 
            document.getElementById('globale-loading').classList.add('hidden'); 
        }

        function toonNotificatie(bericht, type = 'info') {
            const notificatie = document.getElementById('globale-notificatie');
            const berichtEl = document.getElementById('notificatie-bericht');
            const notificatieKaart = notificatie.firstElementChild;
            
            berichtEl.textContent = bericht;
            notificatieKaart.className = 'notification text-white p-4'; // Reset classes
            
            switch (type) {
                case 'success': 
                    notificatieKaart.classList.add('bg-green-500'); 
                    break;
                case 'error': 
                    notificatieKaart.classList.add('bg-red-500'); 
                    break;
                case 'warning': 
                    notificatieKaart.classList.add('bg-yellow-500', 'text-gray-800'); 
                    break;
                default: 
                    notificatieKaart.classList.add('bg-blue-500');
            }
            
            notificatie.classList.remove('hidden');
            
            // Auto-verberg na 5 seconden
            setTimeout(() => {
                notificatie.classList.add('hidden');
            }, 5000);
        }

        function verbergNotificatie() { 
            document.getElementById('globale-notificatie').classList.add('hidden'); 
        }

        // ===============================================
        // Verbeterde Gebruikersnaam Auto-Fill Functie
        // ===============================================
        
        async function behandelGebruikersnaamWijziging(inputElement, config) {
            const gebruikersnaamWaarde = inputElement.value.trim();
            if (!gebruikersnaamWaarde) return;

            try {
                const gebruikerUrl = `${sharePointContext.siteUrl}/_api/web/siteusers?$filter=LoginName eq '${encodeURIComponent(formateerGebruikersnaamVoorOpslaan(gebruikersnaamWaarde))}' or Title eq '${encodeURIComponent(gebruikersnaamWaarde)}'&$top=1`;
                const response = await fetch(gebruikerUrl, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.d.results && data.d.results.length > 0) {
                        const gebruiker = data.d.results[0];
                        
                        // Auto-vul e-mail als veld bestaat en leeg is
                        const emailVeld = document.querySelector('input[name="E_x002d_mail"], input[name="Email"]');
                        if (emailVeld && !emailVeld.value && gebruiker.Email) {
                            emailVeld.value = gebruiker.Email;
                            emailVeld.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        
                        // Auto-vul naam als veld bestaat en leeg is
                        const naamVeld = document.querySelector('input[name="Naam"], input[name="Title"]');
                        if (naamVeld && !naamVeld.value && gebruiker.Title) {
                            naamVeld.value = gebruiker.Title;
                            naamVeld.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        
                        // Werk het input veld bij met de gesaneerde gebruikersnaam
                        inputElement.value = saneertGebruikersnaam(gebruiker.LoginName); 

                        console.log('Automatisch aangevulde gebruikersdata:', gebruiker);
                        toonNotificatie('Gebruikersgegevens automatisch aangevuld', 'success');
                    }
                }
            } catch (error) {
                console.warn('Kon gebruikersdata niet automatisch aanvullen:', error);
            }
        }

        // ===============================================
        // Applicatie Initialisatie
        // ===============================================
        
        // Wacht op configLijst.js met verbeterde foutafhandeling
        if (typeof window.getLijstConfig !== 'function') {
            console.log('Wachten op configLijst.js...');
            let pogingen = 0;
            const controleerConfig = setInterval(() => {
                pogingen++;
                if (typeof window.getLijstConfig === 'function') {
                    console.log('configLijst.js succesvol geladen');
                    clearInterval(controleerConfig);
                } else if (pogingen > 100) {
                    console.error('configLijst.js kon niet geladen worden na meerdere pogingen');
                    toonNotificatie('Configuratiebestand (configLijst.js) kon niet worden geladen. De applicatie werkt mogelijk niet correct.', 'error');
                    clearInterval(controleerConfig);
                    
                    document.getElementById('tab-inhoud-container').innerHTML = `
                        <div class="text-center py-16">
                            <svg class="w-24 h-24 mx-auto text-red-500 mb-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <h2 class="text-2xl font-bold text-red-700 mb-4">Kritieke fout</h2>
                            <p class="text-red-600 mb-4">Configuratiebestand ontbreekt</p>
                            <p class="text-gray-600">Neem contact op met de beheerder.</p>
                        </div>
                    `;
                    verbergLading();
                }
            }, 100);
        }

        // Exporteer globale functies voor onclick handlers en externe scripts
        window.openNieuwModal = openNieuwModal;
        window.openBewerkModal = openBewerkModal;
        window.bevestigVerwijdering = bevestigVerwijdering;
        window.vernieuwHuidigeTab = vernieuwHuidigeTab;
        window.verbergNotificatie = verbergNotificatie;
        window.laadLijstData = laadLijstData; // Export voor eventuele uitbreidingen

        // Verbeterde toetsenbord snelkoppelingen
        document.addEventListener('keydown', (e) => {
            // ESC om modals te sluiten
            if (e.key === 'Escape') {
                if (!document.getElementById('bewerkings-modal').classList.contains('hidden')) {
                    sluitModal();
                }
                if (!document.getElementById('bevestigings-modal').classList.contains('hidden')) {
                    sluitBevestigingsModal();
                }
            }
            
            // Ctrl+S om op te slaan in modal (voorkom browser opslaan)
            if (e.ctrlKey && e.key === 's' && !document.getElementById('bewerkings-modal').classList.contains('hidden')) {
                e.preventDefault();
                slaModalDataOp();
            }
            
            // Ctrl+R om huidige tab te vernieuwen
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                vernieuwHuidigeTab();
            }
        });

        // Verbeterde toegankelijkheidsverbeteringen
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, select, textarea, button')) {
                e.target.setAttribute('aria-describedby', 'toetsenbord-hulp');
            }
        });

        // Voeg toetsenbord hulp tooltip toe
        const toetsenbordHulp = document.createElement('div');
        toetsenbordHulp.id = 'toetsenbord-hulp';
        toetsenbordHulp.className = 'sr-only';
        toetsenbordHulp.textContent = 'Gebruik Tab om te navigeren, Enter om te selecteren, Escape om te sluiten, Ctrl+S om op te slaan';
        document.body.appendChild(toetsenbordHulp);

        // Initialiseer applicatie
        document.addEventListener('DOMContentLoaded', async () => {
            document.getElementById('huidig-jaar').textContent = new Date().getFullYear();
            toonLading('Verbinding maken met SharePoint...');
            
            try {
                await initialiseertSharePointContext();
                await laadHuidigeGebruiker();
                
                toonLading('Gebruikersinstellingen laden...');
                await laadGebruikersInstellingen();
                
                setupEventListeners();
                
                const eersteTab = Object.keys(TAB_CONFIGURATIE)[0];
                if (eersteTab) {
                    await schakelTab(eersteTab);
                } else {
                    toonNotificatie('Geen tabs geconfigureerd.', 'error');
                }
                
                toonNotificatie('Beheercentrum succesvol geladen', 'success');
            } catch (error) {
                console.error('Initialisatiefout:', error);
                toonNotificatie('Fout bij laden van beheercentrum: ' + error.message, 'error');
                document.getElementById('verbinding-status').textContent = 'Verbindingsfout';
                pasThemaToe('light');
            } finally {
                verbergLading();
            }
        });

        console.log('Verlofrooster Beheercentrum JavaScript geladen en klaar voor gebruik');
    </script>
</body>
</html>