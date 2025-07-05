<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verlofaanvragen Behandelen</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <!-- Hoofdbanner -->
    <div id="page-banner" class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 md:p-8 shadow-lg relative">
        <a href="../../verlofRooster.aspx" class="btn-back">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
            </svg>
            <span>Terug naar rooster</span>
        </a>
        
        <div class="w-full px-4 md:px-8 pr-24 md:pr-48">
            <div class="flex justify-between items-center">
                <div class="flex-1 pr-4">
                    <h1 class="text-3xl md:text-4xl font-bold">
                        Verlofaanvragen Behandelcentrum
                    </h1>
                    <p class="mt-2 text-blue-100 text-sm md:text-base">
                        Goedkeuring en behandeling van verlofaanvragen
                    </p>
                </div>
                <div class="text-right min-w-0 flex-shrink-0 max-w-48">
                    <div class="text-sm font-medium text-blue-100 truncate">
                        <span id="huidige-gebruiker">Gebruiker wordt laden...</span>
                    </div>
                    <div class="text-xs mt-1 text-blue-200 truncate">
                        <span id="team-leader-info" title="Uw teamleider">TL: <span id="team-leader-name">Laden...</span></span>
                    </div>
                    <div class="text-xs mt-1 text-blue-200 truncate">
                        <span id="verbinding-status">Verbinden...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="app-container" class="w-full p-4 md:p-6 mt-[-2rem] md:mt-[-2.5rem]">        
        <div class="bg-white shadow-xl rounded-lg mb-8 overflow-hidden">
            <div class="px-4 md:px-6 border-b border-gray-200">
                <div class="overflow-x-auto">
                    <nav class="flex -mb-px space-x-2 sm:space-x-4 md:space-x-6 whitespace-nowrap" aria-label="Tabbladen" id="tab-navigatie">
                        <button data-tab="alle-aanvragen" class="tab-button active">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clip-rule="evenodd"></path>
                            </svg>
                            Wachtende Aanvragen (<span id="aantal-wachtend">0</span>)
                        </button>
                        <button data-tab="verlof" class="tab-button">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                            </svg>
                            Verlof
                        </button>
                        <button data-tab="compensatie" class="tab-button">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M12 8l-3 3 3 3m6-3H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                            Compensatie Uren
                        </button>
                    </nav>
                </div>
            </div>

            <div class="p-4 md:p-6">
                <!-- Filter sectie -->
                <div class="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                    <div class="flex gap-4 items-center flex-wrap">
                        <select id="status-filter" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Alle statussen</option>
                            <option value="Nieuw">Nieuw</option>
                            <option value="Ingediend">Ingediend</option>
                            <option value="Goedgekeurd">Goedgekeurd</option>
                            <option value="Afgewezen">Afgewezen</option>
                        </select>
                        <input type="text" id="medewerker-filter" placeholder="Zoek op medewerker..." class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button id="refresh-knop" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                            </svg>
                            Vernieuwen
                        </button>
                        <div class="text-sm text-gray-600 ml-auto" id="debug-info">
                            SharePoint URL: <span id="debug-url">-</span>
                        </div>
                    </div>
                </div>

                <main id="tab-inhoud-container">
                    <!-- Alle Aanvragen Tab -->
                    <div id="tab-content-alle-aanvragen" class="tab-content active">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <h2 class="text-xl font-semibold text-gray-800">Wachtende Verlofaanvragen</h2>
                            <div class="text-sm text-gray-600" id="totaal-aanvragen">
                                Totaal: <span id="aantal-wachtend-display">0</span> wachtende verlofaanvragen
                            </div>
                        </div>
                        
                        <div class="bg-gray-100 p-4 md:p-6 rounded-lg shadow-inner">
                            <div class="overflow-x-auto">
                                <table class="data-tabel" id="alle-aanvragen-tabel">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Medewerker</th>
                                            <th>Periode</th>
                                            <th>Status</th>
                                            <th>Aangevraagd</th>
                                            <th>Acties</th>
                                        </tr>
                                    </thead>
                                    <tbody id="alle-aanvragen-lijst">
                                        <tr><td colspan="6" class="text-center text-gray-500 py-8">Data wordt geladen...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="alle-aanvragen-status" class="mt-3 text-sm text-gray-500">
                                Data wordt laden...
                            </div>
                        </div>
                    </div>

                    <!-- Verlof Tab -->
                    <div id="tab-content-verlof" class="tab-content">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <h2 class="text-xl font-semibold text-gray-800">Verlofaanvragen</h2>
                        </div>
                        
                        <div class="bg-gray-100 p-4 md:p-6 rounded-lg shadow-inner">
                            <div class="overflow-x-auto">
                                <table class="data-tabel" id="verlof-tabel">
                                    <thead>
                                        <tr>
                                            <th>Medewerker</th>
                                            <th>Startdatum</th>
                                            <th>Einddatum</th>
                                            <th>Reden</th>
                                            <th>Status</th>
                                            <th>Acties</th>
                                        </tr>
                                    </thead>
                                    <tbody id="verlof-lijst">
                                        <tr><td colspan="6" class="text-center text-gray-500 py-8">Data wordt geladen...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="verlof-status" class="mt-3 text-sm text-gray-500">
                                Data wordt laden...
                            </div>
                        </div>
                    </div>

                    <!-- Compensatie Tab -->
                    <div id="tab-content-compensatie" class="tab-content">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <h2 class="text-xl font-semibold text-gray-800">Compensatie Uren Aanvragen</h2>
                        </div>
                        
                        <div class="bg-gray-100 p-4 md:p-6 rounded-lg shadow-inner">
                            <div class="overflow-x-auto">
                                <table class="data-tabel" id="compensatie-tabel">
                                    <thead>
                                        <tr>
                                            <th>Medewerker</th>
                                            <th>Datum Gewerkt</th>
                                            <th>Tijd</th>
                                            <th>Totaal Uren</th>
                                            <th>Ruildag</th>
                                            <th>Status</th>
                                            <th>Acties</th>
                                        </tr>
                                    </thead>
                                    <tbody id="compensatie-lijst">
                                        <tr><td colspan="7" class="text-center text-gray-500 py-8">Data wordt geladen...</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div id="compensatie-status" class="mt-3 text-sm text-gray-500">
                                Data wordt laden...
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>

        <footer class="text-center mt-10 py-6 border-t border-gray-200">
            <p class="text-xs text-gray-500">
                © <span id="huidig-jaar"></span> Verlofrooster Applicatie
            </p>
        </footer>
    </div>

    <!-- Loading Indicator -->
    <div id="globale-loading" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span id="loading-bericht" class="text-gray-800">Laden...</span>
        </div>
    </div>

    <!-- Notificatie -->
    <div id="globale-notificatie" class="hidden fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white z-50">
        <span id="notificatie-bericht"></span>
    </div>

    <!-- Details Modal -->
    <div id="details-modal" class="hidden modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modal-titel" class="modal-title">Aanvraag Details</h3>
                <button id="modal-sluiten" class="sluit-knop">&times;</button>
            </div>
            <div class="modal-body">
                <div id="modal-details">
                    <!-- Details worden hier dynamisch toegevoegd -->
                </div>
                <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                    <button id="modal-afwijzen" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" style="display: none;">Afwijzen</button>
                    <button id="modal-goedkeuren" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors" style="display: none;">Goedkeuren</button>
                    <button id="modal-sluiten-knop" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">Sluiten</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bevestig Modal -->
    <div id="bevestig-modal" class="hidden modal-overlay">
        <div class="modal-content" style="max-width: 400px;">
            <div class="p-6">
                <div class="flex items-start">
                    <div class="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <h3 class="text-lg font-medium text-gray-900">Bevestiging</h3>
                        <div class="mt-2">
                            <p id="bevestig-bericht" class="text-sm text-gray-600"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                <button id="bevestig-annuleren" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">Annuleren</button>
                <button id="bevestig-actie" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Bevestigen</button>
            </div>
        </div>
    </div>

    <!-- Services & Utilities -->
    <script src="../../../../js/services/linkInfo-global.js"></script>
    <script src="js/config.js"></script>
    <script src="js/ui-helpers.js"></script>
    <script src="js/sharepoint-service.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
