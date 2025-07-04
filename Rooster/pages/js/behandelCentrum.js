<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verlofaanvragen Behandelen</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/behandelCentrum.css">
    <!-- Services & Utilities -->
    <script src="../../js/services/linkInfo-global.js"></script>
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
                    <!-- Update the navigation to only show relevant tabs -->
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
                            Verlof & Ziekte
                        </button>
                        <button data-tab="compensatie" class="tab-button">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M12 8l-3 3 3 3m6-3H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                            Compensatie Uren
                        </button>
                    </nav>
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
                                Totaal: <span id="aantal-wachtend">0</span> wachtende verlofaanvragen
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

                    <!-- Remove the compensatie and zittingsvrij tab content sections -->
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

    <script>
        // === Globale Variabelen ===
        let SharePointSiteUrl = "";
        let SharePointRequestDigest = "";
        let HuidigeActieveTab = "alle-aanvragen";
        let AlleAanvragen = [];
        let HuidigDetailsItem = null;

        // === Configuratie (inline versie van configLijst.js) ===
        const appConfiguratie = {
            instellingen: {
                siteUrl: "https://som.org.om.local/sites/MulderT/CustomPW/Verlof/"
            },
            CompensatieUren: { lijstTitel: "CompensatieUren" },
            Verlof: { lijstTitel: "Verlof" },
            IncidenteelZittingVrij: { lijstTitel: "IncidenteelZittingVrij" }
        };

        // === UI Helper Functies ===
        const UI = {
            toonLoading: (toon, bericht = "Laden...") => {
                const loadingElement = document.getElementById('globale-loading');
                const berichtElement = document.getElementById('loading-bericht');
                if (toon) {
                    berichtElement.textContent = bericht;
                    loadingElement.classList.remove('hidden');
                } else {
                    loadingElement.classList.add('hidden');
                }
            },

            toonNotificatie: (bericht, type = "info") => {
                const notificatieElement = document.getElementById('globale-notificatie');
                const berichtElement = document.getElementById('notificatie-bericht');
                berichtElement.textContent = bericht;
                
                notificatieElement.className = 'fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white z-50';
                
                switch (type) {
                    case 'success':
                        notificatieElement.classList.add('bg-green-600');
                        break;
                    case 'error':
                        notificatieElement.classList.add('bg-red-600');
                        break;
                    case 'warning':
                        notificatieElement.classList.add('bg-yellow-600');
                        break;
                    default:
                        notificatieElement.classList.add('bg-blue-600');
                }
                
                notificatieElement.classList.remove('hidden');
                setTimeout(() => notificatieElement.classList.add('hidden'), 5000);
            },

            formateerDatum: (datumString) => {
                if (!datumString) return '-';
                try {
                    const datum = new Date(datumString);
                    return datum.toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                } catch {
                    return '-';
                }
            },

            formateerDatumTijd: (datumString) => {
                if (!datumString) return '-';
                try {
                    const datum = new Date(datumString);
                    return datum.toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } catch {
                    return '-';
                }
            },

            formateerStatus: (status) => {
                if (!status) return '<span class="status-badge status-nieuw">Onbekend</span>';
                const statusLower = status.toLowerCase();
                const statusClass = `status-${statusLower}`;
                return `<span class="status-badge ${statusClass}">${status}</span>`;
            },

            krijgTypeBadge: (type) => {
                const typeClasses = {
                    'Verlof': 'type-verlof',
                    'CompensatieUren': 'type-compensatie',
                    'IncidenteelZittingVrij': 'type-zittingsvrij'
                };
                const typeLabels = {
                    'Verlof': 'Verlof',
                    'CompensatieUren': 'Compensatie',
                    'IncidenteelZittingVrij': 'Zittingsvrij'
                };
                
                const className = typeClasses[type] || 'type-verlof';
                const label = typeLabels[type] || type;
                
                return `<span class="type-badge ${className}">${label}</span>`;
            }
        };

        // Add this function after the UI object definition and before the SharePoint functions
        function bepaalPeriode(item) {
            if (!item) return '-';
            
            // For Verlof items
            if (item.ItemType === 'Verlof') {
                const startDatum = item.StartDatum ? UI.formateerDatum(item.StartDatum) : '-';
                const eindDatum = item.EindDatum ? UI.formateerDatum(item.EindDatum) : '-';
                
                if (startDatum === '-' && eindDatum === '-') {
                    return '-';
                } else if (startDatum === eindDatum) {
                    return startDatum;
                } else {
                    return `${startDatum} - ${eindDatum}`;
                }
            }
            
            // For CompensatieUren items
            if (item.ItemType === 'CompensatieUren') {
                const startDatum = item.StartCompensatieUren ? UI.formateerDatum(item.StartCompensatieUren) : '-';
                const eindDatum = item.EindeCompensatieUren ? UI.formateerDatum(item.EindeCompensatieUren) : '-';
                
                if (startDatum === '-' && eindDatum === '-') {
                    return '-';
                } else if (startDatum === eindDatum) {
                    return startDatum;
                } else {
                    return `${startDatum} - ${eindDatum}`;
                }
            }
            
            // For IncidenteelZittingVrij items
            if (item.ItemType === 'IncidenteelZittingVrij') {
                const startDatum = item.ZittingsVrijeDagTijd ? UI.formateerDatum(item.ZittingsVrijeDagTijd) : '-';
                const eindDatum = item.ZittingsVrijeDagTijdEind ? UI.formateerDatum(item.ZittingsVrijeDagTijdEind) : '-';
                
                if (startDatum === '-' && eindDatum === '-') {
                    return '-';
                } else if (startDatum === eindDatum) {
                    return startDatum;
                } else {
                    return `${startDatum} - ${eindDatum}`;
                }
            }
            
            return '-';
        }

        // Add this function to handle the confirmation dialog
        function bevestigActie(bericht, actieCallback) {
            const modal = document.getElementById('bevestig-modal');
            const berichtElement = document.getElementById('bevestig-bericht');
            const bevestigKnop = document.getElementById('bevestig-actie');
            
            berichtElement.textContent = bericht;
            
            // Remove any existing event listeners
            const nieuweBevestigKnop = bevestigKnop.cloneNode(true);
            bevestigKnop.parentNode.replaceChild(nieuweBevestigKnop, bevestigKnop);
            
            // Add new event listener
            document.getElementById('bevestig-actie').addEventListener('click', () => {
                modal.classList.add('hidden');
                actieCallback();
            });
            
            modal.classList.remove('hidden');
        }

        // === SharePoint Functies ===
        async function krijgSharePointContext() {
            try {
                // Probeer eerst de geconfigureerde URL
                SharePointSiteUrl = appConfiguratie.instellingen.siteUrl;
                
                // Anders bepaal op basis van huidige URL
                if (!SharePointSiteUrl) {
                    const huidigeUrl = window.location.href;
                    console.log("Huidige URL:", huidigeUrl);
                    
                    // Zoek naar /sites/ patroon
                    const sitesMatch = huidigeUrl.match(/(https?:\/\/[^\/]+\/sites\/[^\/]+)\//);
                    if (sitesMatch) {
                        SharePointSiteUrl = sitesMatch[1] + '/';
                    } else {
                        SharePointSiteUrl = window.location.origin + '/';
                    }
                }
                
                if (!SharePointSiteUrl.endsWith('/')) {
                    SharePointSiteUrl += '/';
                }
                
                console.log("Bepaalde SharePoint URL:", SharePointSiteUrl);
                document.getElementById('debug-url').textContent = SharePointSiteUrl;
                document.getElementById('verbinding-status').textContent = 'Verbonden';
                
                // Haal request digest op
                const contextUrl = `${SharePointSiteUrl}_api/contextinfo`;
                console.log("Context URL:", contextUrl);
                
                const response = await fetch(contextUrl, {
                    method: "POST",
                    headers: { 
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose"
                    },
                    credentials: 'same-origin'
                });
                
                if (!response.ok) {
                    throw new Error(`Fout bij ophalen request digest: ${response.status} - ${response.statusText}`);
                }
                
                const data = await response.json();
                SharePointRequestDigest = data.d.GetContextWebInformation.FormDigestValue;
                console.log("Request digest verkregen");
                
                // Haal huidige gebruiker op
                try {
                    const gebruikerResponse = await fetch(`${SharePointSiteUrl}_api/web/currentuser`, {
                        headers: { 
                            'Accept': 'application/json;odata=verbose',
                            'Content-Type': 'application/json;odata=verbose'
                        },
                        credentials: 'same-origin'
                    });
                    
                    if (gebruikerResponse.ok) {
                        const gebruikerData = await gebruikerResponse.json();
                        document.getElementById('huidige-gebruiker').textContent = gebruikerData.d.Title;
                        console.log("Gebruiker geladen:", gebruikerData.d.Title);
                    }
                } catch (userError) {
                    console.warn("Kon gebruiker niet laden:", userError);
                    document.getElementById('huidige-gebruiker').textContent = 'Onbekend';
                }
                
                return true;
            } catch (error) {
                console.error("Fout bij SharePoint context:", error);
                document.getElementById('verbinding-status').textContent = 'Verbindingsfout';
                UI.toonNotificatie(`Verbindingsfout: ${error.message}`, "error");
                return false;
            }
        }

        // Update the haalLijstItemsOp function to include the additional fields
        async function haalLijstItemsOp(lijstNaam, selectVelden = "", filterQuery = "", orderBy = "") {
            try {
                let apiUrl = `${SharePointSiteUrl}_api/web/lists/getbytitle('${encodeURIComponent(lijstNaam)}')/items`;
                const params = [];
                
                // Add specific fields for Verlof list to include the new fields
                if (lijstNaam === 'Verlof' && !selectVelden) {
                    selectVelden = "ID,Title,Medewerker,MedewerkerID,StartDatum,EindDatum,Reden,Omschrijving,Status,Created,Modified,OpmerkingBehandelaar,HerinneringStatus,HerinneringDatum,AanvraagTijdstip";
                }
                
                if (selectVelden) params.push(`$select=${selectVelden}`);
                if (filterQuery) params.push(`$filter=${filterQuery}`);
                if (orderBy) params.push(`$orderby=${orderBy}`);
                params.push('$top=5000');
                
                if (params.length > 0) {
                    apiUrl += `?${params.join('&')}`;
                }
                
                console.log("API URL:", apiUrl);
                
                const response = await fetch(apiUrl, {
                    headers: { 
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose"
                    },
                    credentials: 'same-origin'
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Fout respons voor ${lijstNaam}:`, response.status, errorText);
                    throw new Error(`Fout bij ophalen ${lijstNaam}: ${response.status} - ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log(`${lijstNaam} data geladen:`, data.d.results.length, 'items');
                return data.d.results;
            } catch (error) {
                console.error(`Fout bij ophalen ${lijstNaam}:`, error);
                throw error;
            }
        }

        async function bewerkLijstItem(lijstNaam, itemId, itemData) {
            try {
                // Eerst het huidige item ophalen om de __metadata te krijgen
                const getUrl = `${SharePointSiteUrl}_api/web/lists/getbytitle('${encodeURIComponent(lijstNaam)}')/items(${itemId})`;
                const getResponse = await fetch(getUrl, {
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose"
                    },
                    credentials: 'same-origin'
                });
                
                if (!getResponse.ok) {
                    throw new Error(`Kan item ${itemId} niet ophalen: ${getResponse.status}`);
                }
                
                const currentItem = await getResponse.json();
                const metadata = currentItem.d.__metadata;
                
                // Voeg de metadata toe aan de update data
                const updateData = {
                    __metadata: metadata,
                    ...itemData
                };
                
                console.log('Update data:', updateData);
                
                const updateUrl = `${SharePointSiteUrl}_api/web/lists/getbytitle('${encodeURIComponent(lijstNaam)}')/items(${itemId})`;
                
                const response = await fetch(updateUrl, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose",
                        "X-RequestDigest": SharePointRequestDigest,
                        "IF-MATCH": "*",
                        "X-HTTP-Method": "MERGE"
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(updateData)
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Fout bij bewerken item ${itemId}:`, response.status, errorText);
                    throw new Error(`Fout bij bewerken item: ${response.status} - ${response.statusText}`);
                }
                
                console.log(`Item ${itemId} succesvol bewerkt`);
                return true;
            } catch (error) {
                console.error("Fout bij bewerken item:", error);
                throw error;
            }
        }

        // === Data Laden Functies ===
        async function laadAlleAanvragen() {
            try {
                UI.toonLoading(true, "Verlofaanvragen laden...");
                
                console.log("Laden van verlofaanvragen...");
                
                // Only load Verlof list instead of all three lists
                const lijstNamen = ['Verlof']; // Remove 'CompensatieUren' and 'IncidenteelZittingVrij'
                const resultaten = {};
                
                // Load only Verlof list
                for (const lijstNaam of lijstNamen) {
                    try {
                        console.log(`Laden van ${lijstNaam}...`);
                        const items = await haalLijstItemsOp(lijstNaam, "", "", "Created desc");
                        resultaten[lijstNaam] = items.map(item => ({...item, ItemType: lijstNaam}));
                        console.log(`${lijstNaam}: ${items.length} items geladen`);
                    } catch (error) {
                        console.error(`Fout bij laden ${lijstNaam}:`, error);
                        resultaten[lijstNaam] = [];
                        UI.toonNotificatie(`Kon ${lijstNaam} niet laden: ${error.message}`, "warning");
                    }
                }
                
                // Only use Verlof items
                const alleItems = [
                    ...resultaten.Verlof
                    // Remove the other lists
                ];
                
                // Sort by Created date (newest first)
                alleItems.sort((a, b) => new Date(b.Created) - new Date(a.Created));
                
                AlleAanvragen = alleItems;
                console.log("Totaal verlofaanvragen geladen:", alleItems.length);
                
                vulAlleTabs();
                
                if (alleItems.length === 0) {
                    UI.toonNotificatie("Geen verlofaanvragen gevonden", "info");
                } else {
                    UI.toonNotificatie(`${alleItems.length} verlofaanvragen geladen`, "success");
                }
                
            } catch (error) {
                console.error("Fout bij laden verlofaanvragen:", error);
                UI.toonNotificatie("Kon verlofaanvragen niet laden", "error");
            } finally {
                UI.toonLoading(false);
            }
        }

        // === Tabel Vulling Functies ===
        function vulAlleTabs() {
            const wachtendeItems = AlleAanvragen.filter(item => 
                !item.Status || item.Status === 'Nieuw' || item.Status === 'Ingediend'
            );
            
            vulAlleAanvragenTabel(wachtendeItems);
            vulVerlofTabel(AlleAanvragen.filter(item => item.ItemType === 'Verlof'));
            // Remove the compensatie and zittingsvrij handling
    
            document.getElementById('aantal-wachtend').textContent = wachtendeItems.length;
        }

        function vulAlleAanvragenTabel(items) {
            const tbody = document.getElementById('alle-aanvragen-lijst');
            const statusElement = document.getElementById('alle-aanvragen-status');
            
            if (!items || items.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray-500 py-8">Geen wachtende aanvragen gevonden</td></tr>';
                statusElement.textContent = 'Geen wachtende aanvragen.';
                return;
            }
            
            tbody.innerHTML = items.map(item => {
                const periode = bepaalPeriode(item);
                const status = item.Status || 'Nieuw';
                const aangevraagd = UI.formateerDatum(item.Created || item.AanvraagTijdstip);
                const kanGoedkeuren = status === 'Nieuw' || status === 'Ingediend';
                const heeftOpmerking = item.OpmerkingBehandelaar && item.OpmerkingBehandelaar.trim();
                
                return `
                    <tr>
                        <td>${UI.krijgTypeBadge(item.ItemType)}</td>
                        <td>
                            ${item.Medewerker || item.Gebruikersnaam || 'Onbekend'}
                            ${heeftOpmerking ? '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2" title="Heeft behandelaar opmerking">💬</span>' : ''}
                        </td>
                        <td>${periode}</td>
                        <td>${UI.formateerStatus(status)}</td>
                        <td>${aangevraagd}</td>
                        <td>
                            <div class="actie-knoppen">
                                ${kanGoedkeuren ? `
                                    <button class="actie-knop goedkeuren" onclick="vraagOpmerkingEnVoerActieUit('goedkeuren', '${item.ItemType}', ${item.ID})">Goedkeuren</button>
                                    <button class="actie-knop afwijzen" onclick="vraagOpmerkingEnVoerActieUit('afwijzen', '${item.ItemType}', ${item.ID})">Afwijzen</button>
                                ` : ''}
                                <button class="actie-knop details" onclick="toonDetails('${item.ItemType}', ${item.ID})">Details</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
            
            statusElement.textContent = `${items.length} wachtende aanvragen geladen.`;
        }

        // Update the vulVerlofTabel function to use the new comment prompt function
        function vulVerlofTabel(items) {
            const tbody = document.getElementById('verlof-lijst');
            const statusElement = document.getElementById('verlof-status');
            
            if (!items || items.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray-500 py-8">Geen verlofaanvragen gevonden</td></tr>';
                statusElement.textContent = 'Geen verlofaanvragen gevonden.';
                return;
            }
            
            tbody.innerHTML = items.map(item => {
                const status = item.Status || 'Nieuw';
                const kanGoedkeuren = status === 'Nieuw' || status === 'Ingediend';
                const heeftOpmerking = item.OpmerkingBehandelaar && item.OpmerkingBehandelaar.trim();
                
                return `
                    <tr>
                        <td>
                            ${item.Medewerker || 'Onbekend'}
                            ${heeftOpmerking ? '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2" title="Heeft behandelaar opmerking">💬</span>' : ''}
                        </td>
                        <td>${UI.formateerDatum(item.StartDatum)}</td>
                        <td>${UI.formateerDatum(item.EindDatum)}</td>
                        <td>${item.Reden || '-'}</td>
                        <td>${UI.formateerStatus(status)}</td>
                        <td>
                            <div class="actie-knoppen">
                                ${kanGoedkeuren ? `
                                    <button class="actie-knop goedkeuren" onclick="vraagOpmerkingEnVoerActieUit('goedkeuren', 'Verlof', ${item.ID})">Goedkeuren</button>
                                    <button class="actie-knop afwijzen" onclick="vraagOpmerkingEnVoerActieUit('afwijzen', 'Verlof', ${item.ID})">Afwijzen</button>
                                ` : ''}
                                <button class="actie-knop details" onclick="toonDetails('Verlof', ${item.ID})">Details</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
            
            statusElement.textContent = `${items.length} verlofaanvragen geladen.`;
        }

        // Update the toonDetails function to include the new fields and add approval comment functionality
        function toonDetails(type, id) {
            const item = AlleAanvragen.find(a => a.ItemType === type && a.ID === id);
            if (!item) {
                UI.toonNotificatie("Item niet gevonden", "error");
                return;
            }
            
            HuidigDetailsItem = { type, id, item };
            
            const modal = document.getElementById('details-modal');
            const titel = document.getElementById('modal-titel');
            const details = document.getElementById('modal-details');
            const goedkeurenKnop = document.getElementById('modal-goedkeuren');
            const afwijzenKnop = document.getElementById('modal-afwijzen');
            
            titel.textContent = `${UI.krijgTypeBadge(type).replace(/<[^>]*>/g, '')} - Details`;
            
            let detailsHtml = '';
            
            if (type === 'Verlof') {
                detailsHtml = `
                    <div class="detail-veld"><div class="detail-label">Medewerker:</div><div class="detail-waarde">${item.Medewerker || '-'}</div></div>
                    <div class="detail-veld"><div class="detail-label">Startdatum:</div><div class="detail-waarde">${UI.formateerDatum(item.StartDatum)}</div></div>
                    <div class="detail-veld"><div class="detail-label">Einddatum:</div><div class="detail-waarde">${UI.formateerDatum(item.EindDatum)}</div></div>
                    <div class="detail-veld"><div class="detail-label">Reden:</div><div class="detail-waarde">${item.Reden || '-'}</div></div>
                    <div class="detail-veld"><div class="detail-label">Omschrijving:</div><div class="detail-waarde">${item.Omschrijving || '-'}</div></div>
                    <div class="detail-veld"><div class="detail-label">Status:</div><div class="detail-waarde">${UI.formateerStatus(item.Status || 'Nieuw')}</div></div>
                    <div class="detail-veld"><div class="detail-label">Aangevraagd:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.Created)}</div></div>
                    ${item.OpmerkingBehandelaar ? `
                        <div class="detail-veld"><div class="detail-label">Opmerking behandelaar:</div><div class="detail-waarde">${item.OpmerkingBehandelaar}</div></div>
                    ` : ''}
                    ${item.HerinneringStatus ? `
                        <div class="detail-veld"><div class="detail-label">Herinnering status:</div><div class="detail-waarde">${item.HerinneringStatus}</div></div>
                    ` : ''}
                    ${item.HerinneringDatum ? `
                        <div class="detail-veld"><div class="detail-label">Herinnering datum:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.HerinneringDatum)}</div></div>
                    ` : ''}
                `;
            } else if (type === 'CompensatieUren') {
                detailsHtml = `
                    <div class="detail-veld"><div class="detail-label">Medewerker:</div><div class="detail-waarde">${item.Medewerker || '-'}</div></div>
                    <div class="detail-veld"><div class="detail-label">Start compensatie:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.StartCompensatieUren)}</div></div>
                    <div class="detail-veld"><div class="detail-label">Einde compensatie:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.EindeCompensatieUren)}</div></div>
                    <div class="detail-veld"><div class="detail-label">Totaal uren:</div><div class="detail-waarde">${item.UrenTotaal || '-'}</div></div>
                    <div class="detail-veld"><div class="detail-label">Ruildag:</div><div class="detail-waarde">${item.Ruildag ? 'Ja' : 'Nee'}</div></div>
                    ${item.Ruildag ? `
                        <div class="detail-veld"><div class="detail-label">Ruildag start:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.ruildagStart)}</div></div>
                        <div class="detail-veld"><div class="detail-label">Ruildag einde:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.ruildagEinde)}</div></div>
                    ` : ''}
                    <div class="detail-veld"><div class="detail-label">Omschrijving:</div><div class="detail-waarde">${item.Omschrijving || '-'}</div></div>
                    <div class="detail-veld"><div class="detail-label">Status:</div><div class="detail-waarde">${UI.formateerStatus(item.Status || 'Nieuw')}</div></div>
                    <div class="detail-veld"><div class="detail-label">Aangevraagd:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.Created)}</div></div>
                `;
            } else if (type === 'IncidenteelZittingVrij') {
                detailsHtml = `
                    <div class="detail-veld"><div class="detail-label">Gebruiker:</div><div class="detail-waarde">${item.Gebruikersnaam || '-'}</div></div>
                    <div class="detail-veld"><div class="detail-label">Startdatum:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.ZittingsVrijeDagTijd)}</div></div>
                    <div class="detail-veld"><div class="detail-label">Einddatum:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.ZittingsVrijeDagTijdEind)}</div></div>
                    <div class="detail-veld"><div class="detail-label">Terugkerend:</div><div class="detail-waarde">${item.Terugkerend ? 'Ja' : 'Nee'}</div></div>
                    ${item.Terugkerend ? `
                        <div class="detail-veld"><div class="detail-label">Patroon:</div><div class="detail-waarde">${item.TerugkeerPatroon || '-'}</div></div>
                        <div class="detail-veld"><div class="detail-label">Tot datum:</div><div class="detail-waarde">${UI.formateerDatum(item.TerugkerendTot)}</div></div>
                    ` : ''}
                    <div class="detail-veld"><div class="detail-label">Opmerking:</div><div class="detail-waarde">${item.Opmerking || '-'}</div></div>
                    <div class="detail-veld"><div class="detail-label">Aangemaakt:</div><div class="detail-waarde">${UI.formateerDatumTijd(item.Created)}</div></div>
                `;
            }
            
            // Add approval comment section for Verlof items that can be approved/rejected
            const status = item.Status || 'Nieuw';
            const kanGoedkeuren = (status === 'Nieuw' || status === 'Ingediend') && type === 'Verlof';
            
            if (kanGoedkeuren) {
                detailsHtml += `
                    <div class="detail-veld" style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #e5e7eb;">
                        <div class="detail-label">Opmerking bij behandeling:</div>
                        <div class="detail-waarde">
                            <textarea id="behandelaar-opmerking" placeholder="Optionele opmerking voor de aanvrager..." 
                                     class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                     rows="3"></textarea>
                            <div class="text-xs text-gray-500 mt-1">Deze opmerking wordt verstuurd naar de aanvrager</div>
                        </div>
                    </div>
                `;
            }
            
            details.innerHTML = detailsHtml;
            
            // Toon/verberg goedkeuringsknoppen
            if (kanGoedkeuren) {
                goedkeurenKnop.style.display = 'inline-block';
                afwijzenKnop.style.display = 'inline-block';
                goedkeurenKnop.onclick = () => {
                    const opmerking = document.getElementById('behandelaar-opmerking')?.value || '';
                    modal.classList.add('hidden');
                    keurGoed(type, id, opmerking);
                };
                afwijzenKnop.onclick = () => {
                    const opmerking = document.getElementById('behandelaar-opmerking')?.value || '';
                    modal.classList.add('hidden');
                    wijsAf(type, id, opmerking);
                };
            } else {
                goedkeurenKnop.style.display = 'none';
                afwijzenKnop.style.display = 'none';
            }
            
            modal.classList.remove('hidden');
        }

        // Replace the existing keurGoed and wijsAf functions with these enhanced versions

        // Add this function to handle approval/rejection with comment prompt
        function vraagOpmerkingEnVoerActieUit(actieType, type, id) {
            const modal = document.getElementById('bevestig-modal');
            const modalContent = modal.querySelector('.modal-content');
            
            // Create a custom modal content for comment input
            modalContent.innerHTML = `
                <div class="p-6">
                    <div class="flex items-start">
                        <div class="flex-shrink-0 w-12 h-12 bg-${actieType === 'goedkeuren' ? 'green' : 'red'}-100 rounded-full flex items-center justify-center">
                            <svg class="w-6 h-6 text-${actieType === 'goedkeuren' ? 'green' : 'red'}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${actieType === 'goedkeuren' ? 
                                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
                                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
                                }
                            </svg>
                        </div>
                        <div class="ml-4 w-full">
                            <h3 class="text-lg font-medium text-gray-900">Aanvraag ${actieType === 'goedkeuren' ? 'goedkeuren' : 'afwijzen'}</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-600 mb-4">
                                    Weet je zeker dat je deze aanvraag wilt ${actieType === 'goedkeuren' ? 'goedkeuren' : 'afwijzen'}?
                                </p>
                                <div class="mb-4">
                                    <label for="actie-opmerking" class="block text-sm font-medium text-gray-700 mb-2">
                                        Opmerking voor de aanvrager (optioneel):
                                    </label>
                                    <textarea 
                                        id="actie-opmerking" 
                                        placeholder="Voeg een opmerking toe..." 
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical" 
                                        rows="3"
                                        style="font-family: 'Inter', sans-serif;"
                                    ></textarea>
                                    <div class="text-xs text-gray-500 mt-1">Deze opmerking wordt opgeslagen bij de aanvraag</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                    <button id="actie-annuleren" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                        Annuleren
                    </button>
                    <button id="actie-bevestigen" class="px-4 py-2 bg-${actieType === 'goedkeuren' ? 'green' : 'red'}-600 text-white rounded-md hover:bg-${actieType === 'goedkeuren' ? 'green' : 'red'}-700 transition-colors">
                        ${actieType === 'goedkeuren' ? 'Goedkeuren' : 'Afwijzen'}
                    </button>
                </div>
            `;
            
            // Add event listeners for the new buttons
            document.getElementById('actie-annuleren').addEventListener('click', () => {
                modal.classList.add('hidden');
            });
            
            document.getElementById('actie-bevestigen').addEventListener('click', () => {
                const opmerking = document.getElementById('actie-opmerking').value.trim();
                modal.classList.add('hidden');
                
                if (actieType === 'goedkeuren') {
                    keurGoedMetOpmerking(type, id, opmerking);
                } else {
                    wijsAfMetOpmerking(type, id, opmerking);
                }
            });
            
            modal.classList.remove('hidden');
            
            // Focus on textarea after a short delay to ensure modal is visible
            setTimeout(() => {
                document.getElementById('actie-opmerking')?.focus();
            }, 100);
        }

        // Create separate functions for approval/rejection with comments
        async function keurGoedMetOpmerking(type, id, opmerking = '') {
            try {
                UI.toonLoading(true, "Goedkeuring verwerken...");
                
                const updateData = { 
                    Status: 'Goedgekeurd',
                    HerinneringStatus: 'Goedgekeurd',
                    HerinneringDatum: new Date().toISOString()
                };
                
                // Add approval comment if provided
                if (opmerking) {
                    updateData.OpmerkingBehandelaar = opmerking;
                }
                
                await bewerkLijstItem(type, id, updateData);
                
                UI.toonNotificatie("Aanvraag goedgekeurd", "success");
                await laadAlleAanvragen();
                
            } catch (error) {
                console.error("Fout bij goedkeuren:", error);
                UI.toonNotificatie("Kon aanvraag niet goedkeuren", "error");
            } finally {
                UI.toonLoading(false);
            }
        }

        async function wijsAfMetOpmerking(type, id, opmerking = '') {
            try {
                UI.toonLoading(true, "Afwijzing verwerken...");
                
                const updateData = { 
                    Status: 'Afgewezen',
                    HerinneringStatus: 'Afgewezen',
                    HerinneringDatum: new Date().toISOString()
                };
                
                // Add rejection comment if provided
                if (opmerking) {
                    updateData.OpmerkingBehandelaar = opmerking;
                }
                
                await bewerkLijstItem(type, id, updateData);
                
                UI.toonNotificatie("Aanvraag afgewezen", "success");
                await laadAlleAanvragen();
                
            } catch (error) {
                console.error("Fout bij afwijzen:", error);
                UI.toonNotificatie("Kon aanvraag niet afwijzen", "error");
            } finally {
                UI.toonLoading(false);
            }
        }

        // Update the original keurGoed and wijsAf functions to also support comments (for backwards compatibility)
        async function keurGoed(type, id, opmerking = '') {
            // If no comment provided, use the new prompt function
            if (!opmerking) {
                vraagOpmerkingEnVoerActieUit('goedkeuren', type, id);
                return;
            }
            
            // Otherwise proceed with the approval
            await keurGoedMetOpmerking(type, id, opmerking);
        }

        async function wijsAf(type, id, opmerking = '') {
            // If no comment provided, use the new prompt function
            if (!opmerking) {
                vraagOpmerkingEnVoerActieUit('afwijzen', type, id);
                return;
            }
            
            // Otherwise proceed with the rejection
            await wijsAfMetOpmerking(type, id, opmerking);
        }
        // === Tab Management ===
        function schakelTab(tabNaam) {
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-button').forEach(button => {
                button.classList.remove('active');
            });
            
            const activeContent = document.getElementById(`tab-content-${tabNaam}`);
            const activeButton = document.querySelector(`[data-tab="${tabNaam}"]`);
            
            if (activeContent) activeContent.classList.add('active');
            if (activeButton) activeButton.classList.add('active');
            
            HuidigeActieveTab = tabNaam;
        }

        // === Filter Functies ===
        function toepasFilters() {
            let gefilterdItems = [...AlleAanvragen];
            
            const statusFilter = document.getElementById('status-filter').value;
            const medewerkerFilter = document.getElementById('medewerker-filter').value.toLowerCase();
            
            if (statusFilter) {
                gefilterdItems = gefilterdItems.filter(item => 
                    (item.Status || 'Nieuw') === statusFilter
                );
            }
            
            if (medewerkerFilter) {
                gefilterdItems = gefilterdItems.filter(item => 
                    (item.Medewerker || '').toLowerCase().includes(medewerkerFilter)
                );
            }
            
            // Show results on active tab - only Verlof related tabs now
            if (HuidigeActieveTab === 'alle-aanvragen') {
                const wachtendeItems = gefilterdItems.filter(item => 
                    !item.Status || item.Status === 'Nieuw' || item.Status === 'Ingediend'
                );
                vulAlleAanvragenTabel(wachtendeItems);
            } else if (HuidigeActieveTab === 'verlof') {
                vulVerlofTabel(gefilterdItems.filter(item => item.ItemType === 'Verlof'));
            }
            // Remove the compensatie and zittingsvrij handling
        }

        // === Event Listeners ===
        function setupEventListeners() {
            // Tab navigatie
            document.getElementById('tab-navigatie').addEventListener('click', (e) => {
                const tabButton = e.target.closest('.tab-button');
                if (tabButton) {
                    const tabNaam = tabButton.dataset.tab;
                    schakelTab(tabNaam);
                }
            });
            
            // Modal event listeners
            const detailsModal = document.getElementById('details-modal');
            const bevestigModal = document.getElementById('bevestig-modal');
            
            document.getElementById('modal-sluiten').addEventListener('click', () => {
                detailsModal.classList.add('hidden');
            });
            
            document.getElementById('modal-sluiten-knop').addEventListener('click', () => {
                detailsModal.classList.add('hidden');
            });
            
            document.getElementById('bevestig-annuleren').addEventListener('click', () => {
                bevestigModal.classList.add('hidden');
            });
            
            // Klik buiten modal om te sluiten
            detailsModal.addEventListener('click', (e) => {
                if (e.target === detailsModal) {
                    detailsModal.classList.add('hidden');
                }
            });
            
            bevestigModal.addEventListener('click', (e) => {
                if (e.target === bevestigModal) {
                    bevestigModal.classList.add('hidden');
                }
            });
            
            // Filter event listeners
            document.getElementById('status-filter').addEventListener('change', toepasFilters);
            document.getElementById('medewerker-filter').addEventListener('input', toepasFilters);
            document.getElementById('refresh-knop').addEventListener('click', laadAlleAanvragen);
        }

        // === Initialisatie ===
        async function initializeerBeheercentrum() {
            try {
                document.getElementById('huidig-jaar').textContent = new Date().getFullYear();
                
                console.log("Initialiseren beheercentrum...");
                UI.toonLoading(true, "Beheercentrum initialiseren...");
                
                const contextOK = await krijgSharePointContext();
                if (!contextOK) {
                    throw new Error("SharePoint context kon niet worden geladen");
                }
                
                setupEventListeners();
                await laadAlleAanvragen();
                
                console.log("Beheercentrum succesvol geïnitialiseerd");
                
            } catch (error) {
                console.error("Fatale fout tijdens initialisatie:", error);
                UI.toonNotificatie(`Initialisatiefout: ${error.message}`, "error");
            } finally {
                UI.toonLoading(false);
            }
        }

        // Voorbeeld van het gebruik van de LinkInfo functionaliteit
        async function checkTeamLeaderRelationship(employeeUsername, potentialLeaderUsername) {
            try {
                // Controleer of de potentiële leider een teamleider is voor de medewerker
                const isTeamLeader = await LinkInfo.isTeamLeaderFor(potentialLeaderUsername, employeeUsername);
                console.log(`Is ${potentialLeaderUsername} een teamleider voor ${employeeUsername}? ${isTeamLeader ? 'Ja' : 'Nee'}`);
                
                // Alternatief: Haal de teamleider op voor een specifieke medewerker
                const teamLeader = await LinkInfo.getTeamLeaderForEmployee(employeeUsername);
                if (teamLeader) {
                    console.log(`De teamleider van ${employeeUsername} is ${teamLeader.Title || teamLeader.Naam || teamLeader.Username}`);
                } else {
                    console.log(`Geen teamleider gevonden voor ${employeeUsername}`);
                }
                
                return { isTeamLeader, teamLeader };
            } catch (error) {
                console.error("Fout bij het controleren van teamleider relatie:", error);
                return null;
            }
        }

        // Functie om alle medewerkers van een teamleider op te halen
        async function getMedewerkersByTeamleider(teamLeaderUsername) {
            try {
                const employees = await LinkInfo.getEmployeesForTeamLeader(teamLeaderUsername);
                console.log(`Teamleider ${teamLeaderUsername} heeft ${employees.length} medewerkers:`, 
                    employees.map(e => e.Title || e.Naam || e.Username));
                return employees;
            } catch (error) {
                console.error("Fout bij ophalen medewerkers voor teamleider:", error);
                return [];
            }
        }

        // Start de applicatie wanneer de DOM is geladen
        document.addEventListener('DOMContentLoaded', initializeerBeheercentrum);
    </script>
</body>
</html>