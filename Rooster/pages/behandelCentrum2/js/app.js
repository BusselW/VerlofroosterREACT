document.addEventListener('DOMContentLoaded', async () => {
    const sharepointService = new SharePointService(appConfiguratie);
    let alleAanvragen = [];
    let huidigeActieveTab = 'alle-aanvragen';

    async function initializeerBeheercentrum() {
        try {
            document.getElementById('huidig-jaar').textContent = new Date().getFullYear();
            UI.toonLoading(true, "Beheercentrum initialiseren...");

            const contextOK = await sharepointService.initialize();
            if (!contextOK) {
                throw new Error("SharePoint context kon niet worden geladen");
            }

            document.getElementById('debug-url').textContent = sharepointService.siteUrl;
            document.getElementById('verbinding-status').textContent = 'Verbonden';

            const currentUser = await sharepointService.getCurrentUser();
            if (currentUser) {
                document.getElementById('huidige-gebruiker').textContent = currentUser.Title;
                const username = currentUser.LoginName.split('\\').pop();
                const teamLeader = await LinkInfo.getTeamLeaderForEmployee(username);
                if (teamLeader) {
                    document.getElementById('team-leader-name').textContent = teamLeader.Title || teamLeader.Naam || teamLeader.Username;
                    document.getElementById('team-leader-info').title = `Uw teamleider: ${teamLeader.Title || teamLeader.Naam}`;
                } else {
                    document.getElementById('team-leader-name').textContent = "Niet toegewezen";
                    document.getElementById('team-leader-info').title = "Geen teamleider toegewezen";
                }
            }

            setupEventListeners();
            await laadAlleAanvragen();

        } catch (error) {
            console.error("Fatale fout tijdens initialisatie:", error);
            UI.toonNotificatie(`Initialisatiefout: ${error.message}`, "error");
        } finally {
            UI.toonLoading(false);
        }
    }

    async function laadAlleAanvragen() {
        try {
            UI.toonLoading(true, "Verlofaanvragen laden...");

            const verlofItems = await sharepointService.getListItems(appConfiguratie.Verlof.lijstTitel, "", "", "Created desc");
            const compensatieItems = await sharepointService.getListItems(appConfiguratie.CompensatieUren.lijstTitel, "", "", "Created desc");

            const verlofData = verlofItems.map(item => ({ ...item, ItemType: 'Verlof' }));
            const compensatieData = compensatieItems.map(item => ({ ...item, ItemType: 'CompensatieUren' }));

            alleAanvragen = [...verlofData, ...compensatieData].sort((a, b) => new Date(b.Created) - new Date(a.Created));

            vulAlleTabs();

            if (alleAanvragen.length === 0) {
                UI.toonNotificatie("Geen verlofaanvragen gevonden", "info");
            } else {
                UI.toonNotificatie(`${alleAanvragen.length} verlofaanvragen geladen`, "success");
            }

        } catch (error) {
            console.error("Fout bij laden verlofaanvragen:", error);
            UI.toonNotificatie("Kon verlofaanvragen niet laden", "error");
        } finally {
            UI.toonLoading(false);
        }
    }

    function vulAlleTabs() {
        const wachtendeItems = alleAanvragen.filter(item =>
            !item.Status || item.Status === 'Nieuw' || item.Status === 'Ingediend'
        );

        vulAlleAanvragenTabel(wachtendeItems);
        vulVerlofTabel(alleAanvragen.filter(item => item.ItemType === 'Verlof'));
        vulCompensatieTabel(alleAanvragen.filter(item => item.ItemType === 'CompensatieUren'));

        document.getElementById('aantal-wachtend').textContent = wachtendeItems.length;
        document.getElementById('aantal-wachtend-display').textContent = wachtendeItems.length;
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

            return `
                <tr>
                    <td>${UI.krijgTypeBadge(item.ItemType)}</td>
                    <td>${item.Medewerker || item.Gebruikersnaam || 'Onbekend'}</td>
                    <td>${periode}</td>
                    <td>${UI.formateerStatus(status)}</td>
                    <td>${aangevraagd}</td>
                    <td>
                        <div class="actie-knoppen">
                            ${kanGoedkeuren ? `
                                <button class="actie-knop goedkeuren" onclick="window.app.vraagOpmerkingEnVoerActieUit('goedkeuren', '${item.ItemType}', ${item.ID})">Goedkeuren</button>
                                <button class="actie-knop afwijzen" onclick="window.app.vraagOpmerkingEnVoerActieUit('afwijzen', '${item.ItemType}', ${item.ID})">Afwijzen</button>
                            ` : ''}
                            <button class="actie-knop details" onclick="window.app.toonDetails('${item.ItemType}', ${item.ID})">Details</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        statusElement.textContent = `${items.length} wachtende aanvragen geladen.`;
    }

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

            return `
                <tr>
                    <td>${item.Medewerker || 'Onbekend'}</td>
                    <td>${UI.formateerDatum(item.StartDatum)}</td>
                    <td>${UI.formateerDatum(item.EindDatum)}</td>
                    <td>${item.Reden || '-'}</td>
                    <td>${UI.formateerStatus(status)}</td>
                    <td>
                        <div class="actie-knoppen">
                            ${kanGoedkeuren ? `
                                <button class="actie-knop goedkeuren" onclick="window.app.vraagOpmerkingEnVoerActieUit('goedkeuren', 'Verlof', ${item.ID})">Goedkeuren</button>
                                <button class="actie-knop afwijzen" onclick="window.app.vraagOpmerkingEnVoerActieUit('afwijzen', 'Verlof', ${item.ID})">Afwijzen</button>
                            ` : ''}
                            <button class="actie-knop details" onclick="window.app.toonDetails('Verlof', ${item.ID})">Details</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        statusElement.textContent = `${items.length} verlofaanvragen geladen.`;
    }

    function vulCompensatieTabel(items) {
        const tbody = document.getElementById('compensatie-lijst');
        const statusElement = document.getElementById('compensatie-status');

        if (!items || items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500 py-8">Geen compensatieaanvragen gevonden</td></tr>';
            statusElement.textContent = 'Geen compensatieaanvragen gevonden.';
            return;
        }

        tbody.innerHTML = items.map(item => {
            const status = item.Status || 'Nieuw';
            const kanGoedkeuren = status === 'Nieuw' || status === 'Ingediend';

            return `
                <tr>
                    <td>${item.Medewerker || 'Onbekend'}</td>
                    <td>${UI.formateerDatum(item.StartCompensatieUren)}</td>
                    <td>${UI.formateerDatumTijd(item.StartCompensatieUren)} - ${UI.formateerDatumTijd(item.EindeCompensatieUren)}</td>
                    <td>${item.UrenTotaal || '-'}</td>
                    <td>${item.Ruildag ? 'Ja' : 'Nee'}</td>
                    <td>${UI.formateerStatus(status)}</td>
                    <td>
                        <div class="actie-knoppen">
                            ${kanGoedkeuren ? `
                                <button class="actie-knop goedkeuren" onclick="window.app.vraagOpmerkingEnVoerActieUit('goedkeuren', 'CompensatieUren', ${item.ID})">Goedkeuren</button>
                                <button class="actie-knop afwijzen" onclick="window.app.vraagOpmerkingEnVoerActieUit('afwijzen', 'CompensatieUren', ${item.ID})">Afwijzen</button>
                            ` : ''}
                            <button class="actie-knop details" onclick="window.app.toonDetails('CompensatieUren', ${item.ID})">Details</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        statusElement.textContent = `${items.length} compensatieaanvragen geladen.`;
    }

    function bepaalPeriode(item) {
        if (!item) return '-';

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

        if (item.ItemType === 'CompensatieUren') {
            const startDatum = item.StartCompensatieUren ? UI.formateerDatum(item.StartCompensatieUren) : '-';
            const eindDatum = item.EindDatum ? UI.formateerDatum(item.EindDatum) : '-';

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

        huidigeActieveTab = tabNaam;
    }

    function toepasFilters() {
        let gefilterdItems = [...alleAanvragen];

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

        if (huidigeActieveTab === 'alle-aanvragen') {
            const wachtendeItems = gefilterdItems.filter(item =>
                !item.Status || item.Status === 'Nieuw' || item.Status === 'Ingediend'
            );
            vulAlleAanvragenTabel(wachtendeItems);
        } else if (huidigeActieveTab === 'verlof') {
            vulVerlofTabel(gefilterdItems.filter(item => item.ItemType === 'Verlof'));
        } else if (huidigeActieveTab === 'compensatie') {
            vulCompensatieTabel(gefilterdItems.filter(item => item.ItemType === 'CompensatieUren'));
        }
    }

    function setupEventListeners() {
        document.getElementById('tab-navigatie').addEventListener('click', (e) => {
            const tabButton = e.target.closest('.tab-button');
            if (tabButton) {
                const tabNaam = tabButton.dataset.tab;
                schakelTab(tabNaam);
            }
        });

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

        document.getElementById('status-filter').addEventListener('change', toepasFilters);
        document.getElementById('medewerker-filter').addEventListener('input', toepasFilters);
        document.getElementById('refresh-knop').addEventListener('click', laadAlleAanvragen);
    }

    async function vraagOpmerkingEnVoerActieUit(actieType, type, id) {
        const modal = document.getElementById('bevestig-modal');
        const modalContent = modal.querySelector('.modal-content');

        modalContent.innerHTML = `
            <div class="p-6">
                <div class="flex items-start">
                    <div class="flex-shrink-0 w-12 h-12 bg-${actieType === 'goedkeuren' ? 'green' : 'red'}-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-${actieType === 'goedkeuren' ? 'green' : 'red'}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${actieType === 'goedkeuren' ?
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'}
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

        document.getElementById('actie-annuleren').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        document.getElementById('actie-bevestigen').addEventListener('click', async () => {
            const opmerking = document.getElementById('actie-opmerking').value.trim();
            modal.classList.add('hidden');

            if (actieType === 'goedkeuren') {
                await keurGoedMetOpmerking(type, id, opmerking);
            } else {
                await wijsAfMetOpmerking(type, id, opmerking);
            }
        });

        modal.classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('actie-opmerking')?.focus();
        }, 100);
    }

    async function keurGoedMetOpmerking(type, id, opmerking = '') {
        try {
            UI.toonLoading(true, "Goedkeuring verwerken...");

            const updateData = {
                Status: 'Goedgekeurd',
                HerinneringStatus: 'Goedgekeurd',
                HerinneringDatum: new Date().toISOString()
            };

            if (opmerking) {
                updateData.OpmerkingBehandelaar = opmerking;
            }

            await sharepointService.updateListItem(type, id, updateData);

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

            if (opmerking) {
                updateData.OpmerkingBehandelaar = opmerking;
            }

            await sharepointService.updateListItem(type, id, updateData);

            UI.toonNotificatie("Aanvraag afgewezen", "success");
            await laadAlleAanvragen();

        } catch (error) {
            console.error("Fout bij afwijzen:", error);
            UI.toonNotificatie("Kon aanvraag niet afwijzen", "error");
        } finally {
            UI.toonLoading(false);
        }
    }

    function toonDetails(type, id) {
        const item = alleAanvragen.find(a => a.ItemType === type && a.ID === id);
        if (!item) {
            UI.toonNotificatie("Item niet gevonden", "error");
            return;
        }

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
        }

        const status = item.Status || 'Nieuw';
        const kanGoedkeuren = (status === 'Nieuw' || status === 'Ingediend');

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

        if (kanGoedkeuren) {
            goedkeurenKnop.style.display = 'inline-block';
            afwijzenKnop.style.display = 'inline-block';
            goedkeurenKnop.onclick = async () => {
                const opmerking = document.getElementById('behandelaar-opmerking')?.value || '';
                modal.classList.add('hidden');
                await keurGoedMetOpmerking(type, id, opmerking);
            };
            afwijzenKnop.onclick = async () => {
                const opmerking = document.getElementById('behandelaar-opmerking')?.value || '';
                modal.classList.add('hidden');
                await wijsAfMetOpmerking(type, id, opmerking);
            };
        } else {
            goedkeurenKnop.style.display = 'none';
            afwijzenKnop.style.display = 'none';
        }

        modal.classList.remove('hidden');
    }

    window.app = {
        vraagOpmerkingEnVoerActieUit,
        toonDetails
    };

    initializeerBeheercentrum();
});
