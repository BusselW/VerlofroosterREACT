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
            'incidenteel-zitting-vrij': 'IncidenteelZittingVrij',
            'compensatie-uren': 'CompensatieUren'
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
                body.className = 'dark-theme';
                werkElementenBijVoorDarkTheme();
            } else {
                body.className = 'light-theme';
                werkElementenBijVoorLightTheme();
            }
            
            werkAlleDynamischeInhoudStylesBij();
            console.log(`${isDarkTheme ? 'Donker' : 'Licht'} thema toegepast`);
        }

        function werkElementenBijVoorDarkTheme() {
            // Loading overlay en andere elementen worden door CSS geregeld
            const loadingCard = document.querySelector('#globale-loading .modal-content');
            if (loadingCard) {
                loadingCard.className = 'loading-content';
            }

            // Header styling wordt door CSS geregeld via banner classes
            
            // User info styling wordt door CSS geregeld
            document.getElementById('huidige-gebruiker').className = 'user-info';
            document.getElementById('verbinding-status').className = 'connection-status';

            // Navigatie en footer styling wordt door CSS geregeld
            const tabNavigatie = document.getElementById('tab-navigatie');
            if (tabNavigatie) tabNavigatie.className = 'tab-navigation';
            
            const paginaFooter = document.getElementById('pagina-footer');
            if (paginaFooter) {
                paginaFooter.className = 'page-footer';
                const footerLink = paginaFooter.querySelector('a');
                if (footerLink) footerLink.className = 'footer-link';
            }
        }

        function werkElementenBijVoorLightTheme() {
            // Loading overlay en andere elementen worden door CSS geregeld
            const loadingCard = document.querySelector('#globale-loading .modal-content');
            if (loadingCard) {
                loadingCard.className = 'loading-content';
            }

            // Header styling wordt door CSS geregeld via banner classes
            
            // User info styling wordt door CSS geregeld
            document.getElementById('huidige-gebruiker').className = 'user-info';
            document.getElementById('verbinding-status').className = 'connection-status';

            // Navigatie en footer styling wordt door CSS geregeld
            const tabNavigatie = document.getElementById('tab-navigatie');
            if (tabNavigatie) tabNavigatie.className = 'tab-navigation';
            
            const paginaFooter = document.getElementById('pagina-footer');
            if (paginaFooter) {
                paginaFooter.className = 'page-footer';
                const footerLink = paginaFooter.querySelector('a');
                if (footerLink) footerLink.className = 'footer-link';
            }
        }

        function werkAlleDynamischeInhoudStylesBij() {
            // Tab knoppen worden nu door CSS gestyled
            
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
                const scrollWrapper = tabelWrapper.querySelector('.table-scroll-wrapper');
                const tabel = tabelWrapper.querySelector('table');
                
                if (scrollWrapper) {
                    // Add enhanced horizontal scrolling styles
                    scrollWrapper.className = `table-scroll-wrapper overflow-x-auto ${isDarkTheme ? 'scrollbar-dark' : 'scrollbar-light'}`;
                    scrollWrapper.style.cssText = `
                        scrollbar-width: thin;
                        scrollbar-color: ${isDarkTheme ? '#4B5563 #374151' : '#D1D5DB #F3F4F6'};
                    `;
                    
                    // Special handling for tabs with many columns (like UrenPerWeek)
                    if (huidigeTab && (huidigeTab.toLowerCase().includes('uren') || huidigeTab.toLowerCase().includes('week'))) {
                        scrollWrapper.style.maxHeight = '70vh';
                        scrollWrapper.style.overflowY = 'auto';
                        tabel.style.fontSize = '0.875rem'; // Slightly smaller text for better fit
                    }
                    
                    // Add scroll indicators for better UX
                    const tableRect = tabel?.getBoundingClientRect();
                    const wrapperRect = scrollWrapper.getBoundingClientRect();
                    
                    if (tableRect && wrapperRect && tableRect.width > wrapperRect.width) {
                        scrollWrapper.setAttribute('data-scrollable', 'true');
                        if (!scrollWrapper.querySelector('.scroll-indicator')) {
                            const indicator = document.createElement('div');
                            indicator.className = 'scroll-indicator absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl opacity-75';
                            indicator.textContent = '← Scroll horizontaal →';
                            indicator.style.cssText = 'pointer-events: none; z-index: 10;';
                            scrollWrapper.style.position = 'relative';
                            scrollWrapper.appendChild(indicator);
                            
                            // Hide indicator after scroll or after 3 seconds
                            let hideTimeout = setTimeout(() => {
                                indicator.style.opacity = '0';
                                setTimeout(() => indicator.remove(), 300);
                            }, 3000);
                            
                            scrollWrapper.addEventListener('scroll', () => {
                                clearTimeout(hideTimeout);
                                indicator.style.opacity = '0';
                                setTimeout(() => indicator.remove(), 300);
                            }, { once: true });
                        }
                    }
                }
                
                if (tabel) {
                    tabel.className = 'data-table';
                    
                    // Werk tabel rijen bij
                    tabel.querySelectorAll('tbody tr').forEach(rij => {
                        rij.className = 'data-row';
                        
                        // Werk actie knoppen bij
                        rij.querySelectorAll('button[title="Bewerken"]').forEach(btn => {
                            btn.className = 'btn btn-action btn-edit';
                        });
                        
                        rij.querySelectorAll('button[title="Verwijderen"]').forEach(btn => {
                            btn.className = 'btn btn-action btn-delete';
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

            // Tab-specifieke veld verberging
            if (huidigeTab === 'dagen-indicators') {
                const dagenIndicatorsVerborgen = ['patroon', 'validatie'];
                if (dagenIndicatorsVerborgen.includes(genormaliseerdNaam)) return true;
            }

            if (huidigeTab === 'verlofredenen') {
                const verlofredenenenVerborgen = ['title'];
                if (verlofredenenenVerborgen.includes(genormaliseerdNaam)) return true;
            }

            if (huidigeTab === 'teams') {
                const teamsVerborgen = ['title'];
                if (teamsVerborgen.includes(genormaliseerdNaam)) return true;
            }

            if (huidigeTab === 'seniors') {
                const seniorsVerborgen = ['title', 'titel'];
                if (seniorsVerborgen.includes(genormaliseerdNaam)) return true;
            }

            if (huidigeTab === 'compensatie-uren') {
                // Voor compensatie-uren tab: verberg computed/hidden velden
                const compensatieVerborgen = ['title', 'medewerkerid', 'startcompensatieureniso', 'eindecompensatieureniso'];
                if (compensatieVerborgen.includes(genormaliseerdNaam)) return true;
            }

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

        // Functie voor het herordenen van velden per tab
        function herordenvelden(velden, tabNaam) {
            if (tabNaam === 'verlofredenen') {
                // Gewenste volgorde: Naam, Afkorting, Kleur, VerlofDag
                const gewensteVolgorde = ['naam', 'afkorting', 'kleur', 'verlofdag'];
                const geherordendVelden = [];
                
                // Voeg velden toe in gewenste volgorde
                gewensteVolgorde.forEach(veldNaam => {
                    const veld = velden.find(v => v.interneNaam.toLowerCase() === veldNaam);
                    if (veld) geherordendVelden.push(veld);
                });
                
                // Voeg overige velden toe die niet in de gewenste volgorde staan
                velden.forEach(veld => {
                    if (!gewensteVolgorde.includes(veld.interneNaam.toLowerCase()) && 
                        !geherordendVelden.find(v => v.interneNaam === veld.interneNaam)) {
                        geherordendVelden.push(veld);
                    }
                });
                
                return geherordendVelden;
            }

            if (tabNaam === 'teams') {
                // Gewenste volgorde: Team (Naam), Teamleider, TeamleiderId, Kleur, Actief
                const gewensteVolgorde = ['naam', 'teamleider', 'teamleiderid', 'kleur', 'actief'];
                const geherordendVelden = [];
                
                // Voeg velden toe in gewenste volgorde
                gewensteVolgorde.forEach(veldNaam => {
                    const veld = velden.find(v => v.interneNaam.toLowerCase() === veldNaam);
                    if (veld) geherordendVelden.push(veld);
                });
                
                // Voeg overige velden toe die niet in de gewenste volgorde staan
                velden.forEach(veld => {
                    if (!gewensteVolgorde.includes(veld.interneNaam.toLowerCase()) && 
                        !geherordendVelden.find(v => v.interneNaam === veld.interneNaam)) {
                        geherordendVelden.push(veld);
                    }
                });
                
                return geherordendVelden;
            }

            if (tabNaam === 'seniors') {
                // Gewenste volgorde: Team, Medewerker (Senior), MedewerkerID, TeamID
                const gewensteVolgorde = ['team', 'medewerker', 'medewerkerid', 'teamid'];
                const geherordendVelden = [];
                
                // Voeg velden toe in gewenste volgorde
                gewensteVolgorde.forEach(veldNaam => {
                    const veld = velden.find(v => v.interneNaam.toLowerCase() === veldNaam);
                    if (veld) geherordendVelden.push(veld);
                });
                
                // Voeg overige velden toe die niet in de gewenste volgorde staan
                velden.forEach(veld => {
                    if (!gewensteVolgorde.includes(veld.interneNaam.toLowerCase()) && 
                        !geherordendVelden.find(v => v.interneNaam === veld.interneNaam)) {
                        geherordendVelden.push(veld);
                    }
                });
                
                return geherordendVelden;
            }

            if (tabNaam === 'uren-per-week') {
                // Gewenste volgorde: Titel/Title, MedewerkerID, dan per dag: start, eind, totaal, soort
                const gewensteVolgorde = [
                    'title', 'titel', 'medewerkerid',
                    // Maandag
                    'maandagstart', 'maandageind', 'maandagstotaal', 'maandagsoort',
                    // Dinsdag
                    'dinsdagstart', 'dinsdageind', 'dinsdagstotaal', 'dinsdagsoort',
                    // Woensdag
                    'woensdagstart', 'woensdageind', 'woensdagstotaal', 'woensdagsoort',
                    // Donderdag
                    'donderdagstart', 'donderdageind', 'donderdagstotaal', 'donderdagsoort',
                    // Vrijdag
                    'vrijdagstart', 'vrijdageind', 'vrijdagstotaal', 'vrijdagsoort',
                    // Zaterdag
                    'zaterdagstart', 'zaterdageind', 'zaterdagstotaal', 'zaterdagsoort',
                    // Zondag
                    'zondagstart', 'zondageind', 'zondagstotaal', 'zondagsoort'
                ];
                
                const geherordendVelden = [];
                
                // Voeg velden toe in gewenste volgorde
                gewensteVolgorde.forEach(veldNaam => {
                    const veld = velden.find(v => v.interneNaam.toLowerCase() === veldNaam.toLowerCase());
                    if (veld) geherordendVelden.push(veld);
                });
                
                // Voeg overige velden toe die niet in de gewenste volgorde staan
                velden.forEach(veld => {
                    if (!gewensteVolgorde.some(gewenst => gewenst.toLowerCase() === veld.interneNaam.toLowerCase()) && 
                        !geherordendVelden.find(v => v.interneNaam === veld.interneNaam)) {
                        geherordendVelden.push(veld);
                    }
                });
                
                return geherordendVelden;
            }

            if (tabNaam === 'compensatie-uren') {
                // Gewenste volgorde: Medewerker, StartCompensatieUren, EindeCompensatieUren, UrenTotaal, Omschrijving, Status, AanvraagTijdstip, Commentaar
                const gewensteVolgorde = ['medewerker', 'startcompensatieuren', 'eindecompensatieuren', 'urentotaal', 'omschrijving', 'status', 'aanvraagtijdstip', 'commentaar'];
                const geherordendVelden = [];
                
                // Voeg velden toe in gewenste volgorde
                gewensteVolgorde.forEach(veldNaam => {
                    const veld = velden.find(v => v.interneNaam.toLowerCase() === veldNaam);
                    if (veld) geherordendVelden.push(veld);
                });
                
                // Voeg overige velden toe die niet in de gewenste volgorde staan
                velden.forEach(veld => {
                    if (!gewensteVolgorde.includes(veld.interneNaam.toLowerCase()) && 
                        !geherordendVelden.find(v => v.interneNaam === veld.interneNaam)) {
                        geherordendVelden.push(veld);
                    }
                });
                
                return geherordendVelden;
            }
            
            // Voor andere tabs, behoud de originele volgorde
            return velden;
        }

        // Functie voor het krijgen van aangepaste veld labels per tab
        function krijgVeldLabel(veld, tabNaam) {
            const fieldName = veld.interneNaam?.toLowerCase() || '';
            
            // Tab-specifieke label overrides
            if (tabNaam === 'seniors' && fieldName === 'medewerker') {
                return 'Senior';
            }
            
            // UrenPerWeek specific labels for better readability
            if (tabNaam === 'uren-per-week') {
                // Day-specific labels with proper formatting
                const dayLabels = {
                    'maandagstart': 'Ma Start',
                    'maandageind': 'Ma Eind', 
                    'maandagstotaal': 'Ma Totaal',
                    'maandagsoort': 'Ma Soort',
                    'dinsdagstart': 'Di Start',
                    'dinsdageind': 'Di Eind',
                    'dinsdagstotaal': 'Di Totaal', 
                    'dinsdagsoort': 'Di Soort',
                    'woensdagstart': 'Wo Start',
                    'woensdageind': 'Wo Eind',
                    'woensdagstotaal': 'Wo Totaal',
                    'woensdagsoort': 'Wo Soort',
                    'donderdagstart': 'Do Start',
                    'donderdageind': 'Do Eind', 
                    'donderdagstotaal': 'Do Totaal',
                    'donderdagsoort': 'Do Soort',
                    'vrijdagstart': 'Vr Start',
                    'vrijdageind': 'Vr Eind',
                    'vrijdagstotaal': 'Vr Totaal',
                    'vrijdagsoort': 'Vr Soort',
                    'zaterdagstart': 'Za Start',
                    'zaterdageind': 'Za Eind',
                    'zaterdagstotaal': 'Za Totaal',
                    'zaterdagsoort': 'Za Soort',
                    'zondagstart': 'Zo Start', 
                    'zondageind': 'Zo Eind',
                    'zondagstotaal': 'Zo Totaal',
                    'zondagsoort': 'Zo Soort'
                };
                
                if (dayLabels[fieldName]) {
                    return dayLabels[fieldName];
                }
                
                // Other specific labels
                if (fieldName === 'medewerkerid') {
                    return 'Medewerker ID';
                }
            }

            // CompensatieUren specific labels for better readability
            if (tabNaam === 'compensatie-uren') {
                const compensatieLabels = {
                    'startcompensatieuren': 'Start Datum/Tijd',
                    'eindecompensatieuren': 'Einde Datum/Tijd',
                    'urentotaal': 'Totaal Uren',
                    'omschrijving': 'Omschrijving',
                    'aanvraagtijdstip': 'Aangevraagd op',
                    'commentaar': 'Beheerder Commentaar',
                    'status': 'Status'
                };
                
                if (compensatieLabels[fieldName]) {
                    return compensatieLabels[fieldName];
                }
            }
            
            // Standaard label
            return veld.titel;
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
            label.textContent = krijgVeldLabel(veld, huidigeTab);
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
                        toggleContainer.className = 'toggle-container';
                        
                        const toggleWrapper = document.createElement('div');
                        toggleWrapper.className = 'toggle-switch';
                        
                        input = document.createElement('input');
                        input.type = 'checkbox';
                        input.className = 'toggle-input';
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
                        slider.className = 'toggle-slider';
                        
                        toggleWrapper.appendChild(input);
                        toggleWrapper.appendChild(slider);
                        
                        const statusTekst = document.createElement('span');
                        statusTekst.className = 'toggle-status';
                        statusTekst.textContent = input.checked ? 'Ja' : 'Nee';
                        
                        // Add click handler on the entire toggle component
                        toggleWrapper.addEventListener('click', (e) => {
                            // Don't toggle if clicking directly on the input (it will toggle itself)
                            if (e.target !== input) {
                                input.checked = !input.checked;
                                // Trigger the change event
                                input.dispatchEvent(new Event('change'));
                            }
                        });
                        
                        // Voeg event listener toe om status tekst bij te werken
                        input.addEventListener('change', () => {
                            statusTekst.textContent = input.checked ? 'Ja' : 'Nee';
                        });
                        
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

            // Special readonly logic for compensatie-uren fields
            if (huidigeTab === 'compensatie-uren' && itemData) {
                const readOnlyFields = ['medewerker', 'startcompensatieuren', 'eindecompensatieuren', 'urentotaal', 'omschrijving', 'aanvraagtijdstip'];
                if (readOnlyFields.includes(veldNaamLower)) {
                    input.readOnly = true;
                    input.disabled = true;
                    input.className += ' bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed';
                    
                    // Add explanation for readonly fields
                    const helpText = document.createElement('div');
                    helpText.className = 'text-xs text-gray-500 dark:text-gray-400 mt-1';
                    helpText.textContent = 'Dit veld kan niet worden bewerkt voor bestaande compensatie-uren aanvragen.';
                    container.appendChild(label);
                    container.appendChild(input);
                    container.appendChild(helpText);
                    return container;
                }
                
                // Special styling for Commentaar field
                if (veldNaamLower === 'commentaar') {
                    const helpText = document.createElement('div');
                    helpText.className = 'text-xs text-blue-600 dark:text-blue-400 mt-1';
                    helpText.textContent = 'Gebruik dit veld om opmerkingen toe te voegen bij het goedkeuren of afwijzen van de aanvraag.';
                    container.appendChild(label);
                    container.appendChild(input);
                    container.appendChild(helpText);
                    return container;
                }
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
                            <p class="text-lg ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}">
                                ${tabNaam === 'compensatie-uren' ? 
                                'Beheer en goedkeuring van compensatie-uren aanvragen. Nieuwe aanvragen worden ingediend via het hoofdrooster.' : 
                                `Beheer ${weergaveNaam.toLowerCase()} in het systeem`}
                            </p>
                        </div>
                        <button onclick="openNieuwModal('${tabNaam}')" class="btn btn-success ${tabNaam === 'compensatie-uren' ? 'hidden' : ''}">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                            </svg>
                            ${enkelvoudNaam} toevoegen
                        </button>
                    </div>
                    
                    <div class="table-container ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg">
                        <div class="table-scroll-wrapper overflow-x-auto">
                            <table class="data-table min-w-full">
                                <thead id="tabel-header-${tabNaam}"></thead>
                                <tbody id="tabel-body-${tabNaam}"></tbody>
                            </table>
                        </div>
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
                        <div id="pagination-${tabNaam}" class="px-6 py-4 border-t ${isDarkTheme ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}">
                            <!-- Pagination controls will be inserted here -->
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

            const zichtbareVelden = herordenvelden(
                (config.velden || []).filter(veld => 
                    !moetVeldVerbergen(veld.interneNaam) && veld.titel.toLowerCase() !== 'id'
                ), 
                tabNaam
            );

            // Maak verbeterde tabel header
            headerElement.innerHTML = `
                <tr>
                    ${zichtbareVelden.map(veld => {
                        // Determine column width based on field type and name
                        let minWidth = '';
                        const fieldName = veld.interneNaam?.toLowerCase() || '';
                        
                        // Special handling for UrenPerWeek tab
                        if (tabNaam === 'uren-per-week') {
                            if (fieldName.includes('title') || fieldName.includes('titel')) {
                                minWidth = 'min-w-[160px]'; // Title column
                            } else if (fieldName.includes('medewerkerid')) {
                                minWidth = 'min-w-[120px]'; // Employee ID
                            } else if (fieldName.includes('start') || fieldName.includes('eind')) {
                                minWidth = 'min-w-[90px]'; // Time columns (start/end)
                            } else if (fieldName.includes('totaal')) {
                                minWidth = 'min-w-[80px]'; // Total hours column
                            } else if (fieldName.includes('soort')) {
                                minWidth = 'min-w-[100px]'; // Type column
                            } else {
                                minWidth = 'min-w-[100px]'; // Default for this tab
                            }
                        } else {
                            // Standard column width logic for other tabs
                            if (fieldName.includes('dag') || fieldName.includes('week') || fieldName.includes('uur')) {
                                minWidth = 'min-w-[100px]'; // Day/week/hour columns
                            } else if (fieldName.includes('naam') || fieldName.includes('title')) {
                                minWidth = 'min-w-[150px]'; // Name columns
                            } else if (fieldName.includes('omschrijving') || fieldName.includes('beschrijving')) {
                                minWidth = 'min-w-[200px]'; // Description columns
                            } else {
                                minWidth = 'min-w-[120px]'; // Default column width
                            }
                        }
                        
                        return `
                            <th class="data-header ${minWidth}">
                                ${krijgVeldLabel(veld, tabNaam)}
                            </th>
                        `;
                    }).join('')}
                    <th class="data-header actions-header">
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
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2v-2H4a1 1 0 110-2h3V7a1 1 0 011-1z" clip-rule="evenodd"></path>
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
                            ${zichtbareVelden.map(veld => {
                                // Match column width with header
                                let minWidth = '';
                                const fieldName = veld.interneNaam?.toLowerCase() || '';
                                
                                // Special handling for UrenPerWeek tab
                                if (tabNaam === 'uren-per-week') {
                                    if (fieldName.includes('title') || fieldName.includes('titel')) {
                                        minWidth = 'min-w-[160px]'; // Title column
                                    } else if (fieldName.includes('medewerkerid')) {
                                        minWidth = 'min-w-[120px]'; // Employee ID
                                    } else if (fieldName.includes('start') || fieldName.includes('eind')) {
                                        minWidth = 'min-w-[90px]'; // Time columns (start/end)
                                    } else if (fieldName.includes('totaal')) {
                                        minWidth = 'min-w-[80px]'; // Total hours column
                                    } else if (fieldName.includes('soort')) {
                                        minWidth = 'min-w-[100px]'; // Type column
                                    } else {
                                        minWidth = 'min-w-[100px]'; // Default for this tab
                                    }
                                } else {
                                    // Standard column width logic for other tabs
                                    if (fieldName.includes('dag') || fieldName.includes('week') || fieldName.includes('uur')) {
                                        minWidth = 'min-w-[100px]';
                                    } else if (fieldName.includes('naam') || fieldName.includes('title')) {
                                        minWidth = 'min-w-[150px]';
                                    } else if (fieldName.includes('omschrijving') || fieldName.includes('beschrijving')) {
                                        minWidth = 'min-w-[200px]';
                                    } else {
                                        minWidth = 'min-w-[120px]';
                                    }
                                }
                                
                                return `
                                    <td class="data-cell ${minWidth}">
                                        ${formateerVeldWaarde(item, veld, config)}
                                    </td>
                                `;
                            }).join('')}
                            <td class="actions-column">
                                <div class="action-buttons-wrapper">
                                    <button onclick="openBewerkModal('${tabNaam}', ${item.Id})" 
                                            title="Bewerken" 
                                            class="btn btn-action btn-edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="bevestigVerwijdering('${tabNaam}', ${item.Id}, '${itemWeergaveNaam}')" 
                                            title="Verwijderen" 
                                            class="btn btn-action btn-delete">
                                        <i class="fas fa-trash"></i>
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
                return `<span class="username-block">${saneertGebruikersnaam(waarde.Title || waarde)}</span>`;
            }
            
            // Behandel hex kleurcodes
            if (typeof waarde === 'string' && /^#[0-9A-Fa-f]{6}$/i.test(waarde)) {
                return `
                    <div class="color-preview">
                        <div class="color-swatch" style="background-color: ${waarde};" title="${waarde}"></div>
                        <span class="color-code">${waarde.toUpperCase()}</span>
                    </div>
                `;
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
                        
                        // Special handling for compensatie-uren datetime fields
                        if (huidigeTab === 'compensatie-uren' && 
                            (veldNaamLower.includes('compensatieuren') || veldNaamLower === 'aanvraagtijdstip')) {
                            return `<span class="font-mono text-sm">${datum.toLocaleString('nl-NL', { 
                                year: 'numeric', 
                                month: '2-digit', 
                                day: '2-digit', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}</span>`;
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

            // Special handling for compensatie-uren status field - show accept/reject buttons for pending items
            if (huidigeTab === 'compensatie-uren' && veldNaamLower === 'status') {
                if (waarde === 'Ingediend' || waarde === 'Nieuw') {
                    return `
                        <div class="compensatie-actions">
                            <div class="action-buttons-wrapper">
                                <button onclick="accepteerCompensatie(${item.Id})" 
                                        class="btn btn-action btn-accept"
                                        title="Keur deze compensatie-uren aanvraag goed">
                                    <i class="fas fa-check"></i> Goedkeuren
                                </button>
                                <button onclick="weigerCompensatie(${item.Id})" 
                                        class="btn btn-action btn-reject"
                                        title="Keur deze compensatie-uren aanvraag af">
                                    <i class="fas fa-times"></i> Afkeuren
                                </button>
                            </div>
                            <span class="status-text pending">Wachtend op goedkeuring</span>
                        </div>
                    `;
                } else if (waarde === 'Goedgekeurd') {
                    return `<span class="status-badge approved"><i class="fas fa-check"></i> Goedgekeurd</span>`;
                } else if (waarde === 'Afgekeurd') {
                    return `<span class="status-badge rejected"><i class="fas fa-times"></i> Afgekeurd</span>`;
                } else {
                    return `<span class="status-badge pending">${waarde}</span>`;
                }
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
            
            toonLading(`Laden van ${krijgWeergaveNaam(tabNaam)} (tot 5000 items)...`);
            
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
            
            // Load initial data with higher default page size for better performance
            await laadLijstData(lijstNaam, config, 0, 500);
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

        async function laadLijstData(lijstNaam, config, skip = 0, top = 500) {
            try {
                const selectVelden = krijgSelectVelden(config);
                const expandVelden = krijgExpandVelden(config);
                
                let url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(config.lijstTitel)}')/items`;
                url += `?$select=${selectVelden.map(encodeURIComponent).join(',')}`;
                if (expandVelden.length > 0) {
                    url += `&$expand=${expandVelden.map(encodeURIComponent).join(',')}`;
                }
                url += `&$top=${top}&$skip=${skip}&$inlinecount=allpages`;

                const response = await fetch(url, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                if (!response.ok) throw new Error(`Fout bij ophalen data: ${response.status} ${response.statusText}`);

                const data = await response.json();
                
                // Debug logging to see what we get from SharePoint
                console.log('SharePoint response data:', data);
                
                // Extract count from various possible locations
                let totalCount = 0;
                let hasInlineCount = false;
                
                if (data.d && typeof data.d.__count !== 'undefined' && data.d.__count !== null) {
                    totalCount = parseInt(data.d.__count) || 0;
                    hasInlineCount = true;
                    console.log('Using SharePoint __count:', totalCount);
                } else if (data.d && data.d['odata.count']) {
                    // Alternative OData count format
                    totalCount = parseInt(data.d['odata.count']) || 0;
                    hasInlineCount = true;
                    console.log('Using OData count:', totalCount);
                } else if (data['odata.count']) {
                    totalCount = parseInt(data['odata.count']) || 0;
                    hasInlineCount = true;
                    console.log('Using top-level OData count:', totalCount);
                } else if (data.d && data.d.results && Array.isArray(data.d.results)) {
                    // Fallback: if no count provided, estimate based on results
                    const resultsLength = data.d.results.length;
                    if (resultsLength < top) {
                        // If we got fewer results than requested, we're likely on the last page
                        totalCount = skip + resultsLength;
                    } else {
                        // We don't know the exact total, but we know there are at least this many
                        totalCount = skip + resultsLength + 1; // +1 to indicate there might be more
                    }
                    console.warn('SharePoint did not return a count, estimating from results:', totalCount);
                } else {
                    totalCount = 0;
                    console.error('Could not determine total count from SharePoint response');
                }
                
                // Ensure we have valid numbers
                const validTotalCount = Math.max(0, totalCount);
                const validTop = Math.max(1, top);
                const validSkip = Math.max(0, skip);
                
                // Store pagination info with proper validation
                window.currentListPagination = {
                    totalItems: validTotalCount,
                    currentSkip: validSkip,
                    pageSize: validTop,
                    totalPages: Math.max(1, Math.ceil(validTotalCount / validTop)),
                    currentPage: Math.floor(validSkip / validTop) + 1
                };
                
                toonTabelData(huidigeTab, config, data.d.results || []);
                updatePaginationControls(huidigeTab);
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
        // Paginatie Management Functies
        // ===============================================

        // Functie voor het updaten van paginatie controls
        function updatePaginationControls(tabNaam) {
            const pagination = window.currentListPagination;
            if (!pagination) {
                console.warn('No pagination data available for updatePaginationControls');
                return;
            }

            // Validate pagination data
            const totalItems = isNaN(pagination.totalItems) ? 0 : pagination.totalItems;
            const totalPages = isNaN(pagination.totalPages) ? 1 : Math.max(1, pagination.totalPages);
            const currentPage = isNaN(pagination.currentPage) ? 1 : Math.max(1, pagination.currentPage);
            const pageSize = isNaN(pagination.pageSize) ? 500 : Math.max(1, pagination.pageSize);
            const currentSkip = isNaN(pagination.currentSkip) ? 0 : Math.max(0, pagination.currentSkip);

            console.log('Pagination data:', { totalItems, totalPages, currentPage, pageSize, currentSkip });

            const statusElement = document.getElementById(`tabel-status-${tabNaam}`);
            const paginationElement = document.getElementById(`pagination-${tabNaam}`);
            
            if (statusElement) {
                const startItem = currentSkip + 1;
                const endItem = Math.min(currentSkip + pageSize, totalItems);
                statusElement.textContent = `Getoond: ${startItem}-${endItem} van ${totalItems} items`;
            }

            if (paginationElement) {
                const canGoPrevious = currentPage > 1;
                const canGoNext = currentPage < totalPages;
                
                // Hide pagination controls if there's only one page
                if (totalPages <= 1) {
                    paginationElement.style.display = 'none';
                    return;
                } else {
                    paginationElement.style.display = 'block';
                }
                
                paginationElement.innerHTML = `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <button 
                                onclick="gaNaarPagina(${currentPage - 1})" 
                                class="btn btn-secondary btn-sm ${!canGoPrevious ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${!canGoPrevious ? 'disabled' : ''}
                            >
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                </svg>
                                Vorige
                            </button>
                            
                            <span class="text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}">
                                Pagina ${currentPage} van ${totalPages}
                            </span>
                            
                            <button 
                                onclick="gaNaarPagina(${currentPage + 1})" 
                                class="btn btn-secondary btn-sm ${!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}"
                                ${!canGoNext ? 'disabled' : ''}
                            >
                                Volgende
                                <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="flex items-center space-x-2">
                            <label class="text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}">Items per pagina:</label>
                            <select onchange="wijzigPaginaGrootte(this.value)" class="form-select text-sm py-1 px-2">
                                <option value="25" ${pageSize === 25 ? 'selected' : ''}>25</option>
                                <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
                                <option value="100" ${pageSize === 100 ? 'selected' : ''}>100</option>
                                <option value="250" ${pageSize === 250 ? 'selected' : ''}>250</option>
                                <option value="500" ${pageSize === 500 ? 'selected' : ''}>500</option>
                            </select>
                        </div>
                    </div>
                `;
            }
        }

        // Paginatie navigatie functies
        async function gaNaarPagina(pageNumber) {
            if (!window.currentListPagination || !huidigeTab) return;
            
            const config = window.getLijstConfig(TAB_CONFIGURATIE[huidigeTab]);
            if (!config) return;

            const skip = (pageNumber - 1) * window.currentListPagination.pageSize;
            toonLading(`Laden van pagina ${pageNumber}...`);
            await laadLijstData(huidigeTab, config, skip, window.currentListPagination.pageSize);
            verbergLading();
        }

        async function wijzigPaginaGrootte(newSize) {
            if (!huidigeTab) return;
            
            const config = window.getLijstConfig(TAB_CONFIGURATIE[huidigeTab]);
            if (!config) return;

            toonLading('Laden...');
            await laadLijstData(huidigeTab, config, 0, parseInt(newSize));
            verbergLading();
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
            
            // Standaard form rendering met reordering
            const veldenContainer = document.getElementById('modal-velden');
            veldenContainer.innerHTML = '';
            
            const beschikbareVelden = (config.velden || []).filter(veld => 
                !moetVeldVerbergen(veld.interneNaam) && veld.titel.toLowerCase() !== 'id'
            );
            const geherordendVelden = herordenvelden(beschikbareVelden, huidigeTab);
            
            for (const veld of geherordendVelden) {
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
            if (!huidigeTab) return;
            
            const config = window.getLijstConfig(TAB_CONFIGURATIE[huidigeTab]);
            if (!config) return;
            
            // Preserve current pagination state if it exists
            const currentPagination = window.currentListPagination;
            let skip = 0;
            let pageSize = 500; // Default page size
            
            if (currentPagination) {
                skip = currentPagination.currentSkip;
                pageSize = currentPagination.pageSize;
            }
            
            toonLading('Vernieuwen...');
            try {
                await laadLijstData(huidigeTab, config, skip, pageSize);
            } catch (error) {
                toonNotificatie('Fout bij vernieuwen: ' + error.message, 'error');
            } finally {
                verbergLading();
            }
        }

        // ===============================================
        // Helper Functies voor Weergave Namen
        // ===============================================
        
        function krijgWeergaveNaam(tabNaam) {
            const namen = { 
                'medewerkers': 'Medewerkers', 
                'dagen-indicators': 'Dag Indicatoren', 
                'functies': 'Functies', 
                'verlofredenen': 'Verlof redenen', 
                'teams': 'Teams', 
                'seniors': 'Seniors', 
                'uren-per-week': 'Uren Per Week', 
                'incidenteel-zitting-vrij': 'Incidenteel Zitting Vrij',
                'compensatie-uren': 'Compensatie Uren'
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
                'incidenteel-zitting-vrij': 'Incidenteel Zitting Vrij Item',
                'compensatie-uren': 'Compensatie Uren Aanvraag'
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

        // ===============================================
        // Compensatie Uren Accept/Reject Functies
        // ===============================================
        
        async function accepteerCompensatie(itemId) {
            const commentaar = prompt('Optioneel commentaar bij acceptatie:');
            if (commentaar === null) return; // User cancelled
            
            await updateCompensatieStatus(itemId, 'Goedgekeurd', commentaar || 'Geaccepteerd door beheerder');
        }
        
        async function weigerCompensatie(itemId) {
            const commentaar = prompt('Reden voor weigering (verplicht):');
            if (!commentaar || commentaar.trim() === '') {
                toonNotificatie('Commentaar is verplicht bij weigering', 'error');
                return;
            }
            
            await updateCompensatieStatus(itemId, 'Afgekeurd', commentaar);
        }
        
        async function updateCompensatieStatus(itemId, nieuweStatus, commentaar) {
            try {
                toonLading(`${nieuweStatus === 'Goedgekeurd' ? 'Goedkeuren' : 'Afkeuren'} van compensatie-uren...`);
                
                const updateData = {
                    Status: nieuweStatus,
                    Commentaar: commentaar
                };
                
                const url = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('CompensatieUren')/items(${itemId})`;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose',
                        'X-RequestDigest': sharePointContext.requestDigest,
                        'X-HTTP-Method': 'MERGE',
                        'If-Match': '*'
                    },
                    body: JSON.stringify(updateData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                toonNotificatie(`Compensatie-uren ${nieuweStatus.toLowerCase()}`, 'success');
                await vernieuwHuidigeTab();
                
            } catch (error) {
                console.error('Fout bij updateCompensatieStatus:', error);
                toonNotificatie('Fout bij updaten van status: ' + error.message, 'error');
            } finally {
                verbergLading();
            }
        }

        // Exporteer globale functies voor onclick handlers en externe scripts
        window.openNieuwModal = openNieuwModal;
        window.openBewerkModal = openBewerkModal;
        window.bevestigVerwijdering = bevestigVerwijdering;
        window.vernieuwHuidigeTab = vernieuwHuidigeTab;
        window.verbergNotificatie = verbergNotificatie;
        window.laadLijstData = laadLijstData; // Export voor eventuele uitbreidingen
        window.accepteerCompensatie = accepteerCompensatie;
        window.weigerCompensatie = weigerCompensatie;

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

        // Initialiseer applicatie
        document.addEventListener('DOMContentLoaded', async () => {
            console.log('DOM loaded, checking configuration...');
            console.log('window.appConfiguratie:', window.appConfiguratie);
            console.log('window.getLijstConfig:', window.getLijstConfig);
            console.log('window.sharepointLijstConfiguraties:', window.sharepointLijstConfiguraties);
            
            // Voeg toetsenbord hulp tooltip toe
            const toetsenbordHulp = document.createElement('div');
            toetsenbordHulp.id = 'toetsenbord-hulp';
            toetsenbordHulp.className = 'sr-only';
            toetsenbordHulp.textContent = 'Gebruik Tab om te navigeren, Enter om te selecteren, Escape om te sluiten, Ctrl+S om op te slaan';
            document.body.appendChild(toetsenbordHulp);
            
            // Set current year if element exists
            const huidigJaarElement = document.getElementById('huidig-jaar');
            if (huidigJaarElement) {
                huidigJaarElement.textContent = new Date().getFullYear();
            }
            
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

        // ===============================================
        // Temporary Debug Function (remove after fixing pagination)
        // ===============================================
        
        window.debugSharePointResponse = async function(listName) {
            try {
                const testUrl = `${sharePointContext.siteUrl}/_api/web/lists/getbytitle('${encodeURIComponent(listName)}')/items?$top=5&$inlinecount=allpages`;
                console.log('Debug URL:', testUrl);
                
                const response = await fetch(testUrl, { 
                    headers: { 'Accept': 'application/json;odata=verbose' } 
                });
                
                const data = await response.json();
                console.log('Full SharePoint response structure:', data);
                console.log('Available properties in data:', Object.keys(data));
                if (data.d) {
                    console.log('Available properties in data.d:', Object.keys(data.d));
                }
                
                return data;
            } catch (error) {
                console.error('Debug error:', error);
            }
        };
        
        // ===============================================