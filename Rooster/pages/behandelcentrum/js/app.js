import { sharepointService } from './sharepoint-service.js';

const h = (tag, props, ...children) => {
    const el = document.createElement(tag);
    if (props) {
        for (const key in props) {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                el.addEventListener(key.substring(2).toLowerCase(), props[key]);
            } else {
                el.setAttribute(key, props[key]);
            }
        }
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
            el.appendChild(child);
        }
    });
    return el;
};

class BehandelcentrumApp {
    constructor() {
        this.root = document.getElementById('behandelcentrum-root');
        this.verlofAanvragen = [];
        this.ziekteAanvragen = [];
        this.compensatieAanvragen = [];
        this.zittingsvrijAanvragen = [];
        this.verlofInBehandeling = [];
        this.compensatieInBehandeling = [];
        this.activeTab = 'verlof-behandeling';
    }

    async init() {
        await sharepointService.initialize();
        const currentUser = await sharepointService.getCurrentUser();
        if (currentUser) {
            document.getElementById('huidige-gebruiker').textContent = currentUser.Title;
        }
        document.getElementById('verbinding-status').textContent = 'Verbonden';
        document.getElementById('huidig-jaar').textContent = new Date().getFullYear();

        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        // Haal alle verlof aanvragen op
        const allVerlofItems = await sharepointService.getListItems('Verlof');
        
        // Verdeel in verlof en ziekte op basis van reden
        const verlofItems = allVerlofItems.filter(item => 
            !item.Reden || item.Reden.toLowerCase().includes('verlof') || item.Reden.toLowerCase().includes('vakantie')
        );
        this.ziekteAanvragen = allVerlofItems.filter(item => 
            item.Reden && item.Reden.toLowerCase().includes('ziekte')
        );
        
        // Filter verlof voor nieuwe items (in behandeling)
        this.verlofInBehandeling = verlofItems.filter(item => 
            this.isInBehandeling(item.Status)
        );
        this.verlofAanvragen = verlofItems; // Alle verlof items voor volledig overzicht
        
        // Haal compensatie-uren op
        const allCompensatieItems = await sharepointService.getListItems('CompensatieUren');
        
        // Filter compensatie voor nieuwe items (in behandeling)
        this.compensatieInBehandeling = allCompensatieItems.filter(item => 
            this.isInBehandeling(item.Status)
        );
        this.compensatieAanvragen = allCompensatieItems; // Alle compensatie items voor volledig overzicht
        
        // Haal zittingsvrij op (aangenomen dat er een lijst is)
        try {
            this.zittingsvrijAanvragen = await sharepointService.getListItems('Zittingsvrij');
        } catch (error) {
            console.warn('Zittingsvrij lijst niet gevonden:', error);
            this.zittingsvrijAanvragen = [];
        }
    }

    isInBehandeling(status) {
        if (!status) return true; // Geen status = nieuw = in behandeling
        const statusLower = status.toLowerCase();
        return statusLower === 'nieuw' || 
               statusLower === 'new' || 
               statusLower === 'in behandeling' || 
               statusLower === 'pending' ||
               statusLower === '';
    }

    render() {
        this.root.innerHTML = '';
        const app = h('div', { class: 'behandelcentrum-app' },
            this.renderTabs(),
            this.renderTabContent()
        );
        this.root.appendChild(app);
    }

    renderTabs() {
        return h('div', { class: 'tab-container gradient-border' },
            h('div', { class: 'tab-navigation' },
                h('button', { 
                    class: `tab-button ${this.activeTab === 'verlof-behandeling' ? 'active' : ''}`,
                    'data-tab': 'verlof-behandeling',
                    'data-tooltip': 'Verlofaanvragen die nog goedkeuring behoeven'
                }, 
                    'Verlofaanvragen - In behandeling',
                    h('span', { class: 'badge' }, this.verlofInBehandeling.length.toString())
                ),
                h('button', { 
                    class: `tab-button ${this.activeTab === 'compensatie-behandeling' ? 'active' : ''}`,
                    'data-tab': 'compensatie-behandeling',
                    'data-tooltip': 'Compensatie-uren aanvragen die nog goedkeuring behoeven'
                }, 
                    'Compensatie-uren - In behandeling',
                    h('span', { class: 'badge' }, this.compensatieInBehandeling.length.toString())
                ),
                h('button', { 
                    class: `tab-button ${this.activeTab === 'verlof' ? 'active' : ''}`,
                    'data-tab': 'verlof',
                    'data-tooltip': 'Alle verlofaanvragen (inclusief verwerkte)'
                }, 
                    'Alle Verlof',
                    h('span', { class: 'badge' }, this.verlofAanvragen.length.toString())
                ),
                h('button', { 
                    class: `tab-button ${this.activeTab === 'ziekte' ? 'active' : ''}`,
                    'data-tab': 'ziekte',
                    'data-tooltip': 'Alle ziektemeldingen'
                }, 
                    'Ziekte',
                    h('span', { class: 'badge' }, this.ziekteAanvragen.length.toString())
                ),
                h('button', { 
                    class: `tab-button ${this.activeTab === 'compensatie' ? 'active' : ''}`,
                    'data-tab': 'compensatie',
                    'data-tooltip': 'Alle compensatie-uren (inclusief verwerkte)'
                }, 
                    'Alle Compensatie-uren',
                    h('span', { class: 'badge' }, this.compensatieAanvragen.length.toString())
                ),
                h('button', { 
                    class: `tab-button ${this.activeTab === 'zittingsvrij' ? 'active' : ''}`,
                    'data-tab': 'zittingsvrij',
                    'data-tooltip': 'Zittingsvrije dagen'
                }, 
                    'Zittingsvrij',
                    h('span', { class: 'badge' }, this.zittingsvrijAanvragen.length.toString())
                )
            )
        );
    }

    renderTabContent() {
        return h('div', { class: 'tab-content-container' },
            h('div', { 
                class: `tab-content ${this.activeTab === 'verlof-behandeling' ? 'active' : ''}`,
                id: 'tab-verlof-behandeling'
            }, 
                h('h2', null, 'Verlofaanvragen - In behandeling'),
                this.renderActionableTable(this.verlofInBehandeling, ['Medewerker', 'StartDatum', 'EindDatum', 'Reden', 'Status', 'Acties'])
            ),
            h('div', { 
                class: `tab-content ${this.activeTab === 'compensatie-behandeling' ? 'active' : ''}`,
                id: 'tab-compensatie-behandeling'
            }, 
                h('h2', null, 'Compensatie-uren - In behandeling'),
                this.renderActionableTable(this.compensatieInBehandeling, ['Medewerker', 'Datum', 'AantalUren', 'Reden', 'Status', 'Acties'])
            ),
            h('div', { 
                class: `tab-content ${this.activeTab === 'verlof' ? 'active' : ''}`,
                id: 'tab-verlof'
            }, 
                h('h2', null, 'Alle Verlof Aanvragen'),
                this.renderTable(this.verlofAanvragen, ['Medewerker', 'StartDatum', 'EindDatum', 'Reden', 'Status'])
            ),
            h('div', { 
                class: `tab-content ${this.activeTab === 'ziekte' ? 'active' : ''}`,
                id: 'tab-ziekte'
            }, 
                h('h2', null, 'Ziekte Meldingen'),
                this.renderTable(this.ziekteAanvragen, ['Medewerker', 'StartDatum', 'EindDatum', 'Reden', 'Status'])
            ),
            h('div', { 
                class: `tab-content ${this.activeTab === 'compensatie' ? 'active' : ''}`,
                id: 'tab-compensatie'
            }, 
                h('h2', null, 'Alle Compensatie Uren'),
                this.renderTable(this.compensatieAanvragen, ['Medewerker', 'Datum', 'AantalUren', 'Reden', 'Status'])
            ),
            h('div', { 
                class: `tab-content ${this.activeTab === 'zittingsvrij' ? 'active' : ''}`,
                id: 'tab-zittingsvrij'
            }, 
                h('h2', null, 'Zittingsvrij'),
                this.renderTable(this.zittingsvrijAanvragen, ['Medewerker', 'StartDatum', 'EindDatum', 'Reden'])
            )
        );
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.activeTab = e.target.dataset.tab;
                this.render();
                this.bindEvents(); // Re-bind after re-render
            });
        });

        // Action button events
        document.querySelectorAll('.btn-approve').forEach(button => {
            button.addEventListener('click', (e) => this.handleApprove(e));
        });

        document.querySelectorAll('.btn-reject').forEach(button => {
            button.addEventListener('click', (e) => this.handleReject(e));
        });
    }

    async handleApprove(event) {
        const button = event.target;
        const itemId = button.dataset.itemId;
        const itemType = button.dataset.itemType;
        const row = button.closest('tr');
        
        // Disable button en toon loading state
        button.disabled = true;
        button.innerHTML = '⟳ Verwerken...';
        button.classList.add('loading');
        
        try {
            await sharepointService.updateListItem(itemType, itemId, { Status: 'Goedgekeurd' });
            
            // Succes feedback
            row.classList.add('success-flash');
            button.innerHTML = '✓ Goedgekeurd';
            button.classList.remove('loading');
            button.classList.add('btn-approved');
            
            // Wacht even voor visuele feedback
            setTimeout(async () => {
                await this.loadData();
                this.render();
                this.bindEvents();
            }, 800);
            
        } catch (error) {
            console.error('Fout bij goedkeuren:', error);
            
            // Error feedback
            row.classList.add('error-flash');
            button.innerHTML = '✗ Fout opgetreden';
            button.classList.remove('loading');
            button.disabled = false;
            
            // Reset na 2 seconden
            setTimeout(() => {
                button.innerHTML = '✓ Goedkeuren';
                row.classList.remove('error-flash');
            }, 2000);
            
            alert('Er is een fout opgetreden bij het goedkeuren van de aanvraag. Probeer het opnieuw.');
        }
    }

    async handleReject(event) {
        const button = event.target;
        const itemId = button.dataset.itemId;
        const itemType = button.dataset.itemType;
        const row = button.closest('tr');
        
        // Confirm dialog
        if (!confirm('Weet u zeker dat u deze aanvraag wilt afwijzen?')) {
            return;
        }
        
        // Disable button en toon loading state
        button.disabled = true;
        button.innerHTML = '⟳ Verwerken...';
        button.classList.add('loading');
        
        try {
            await sharepointService.updateListItem(itemType, itemId, { Status: 'Afgekeurd' });
            
            // Succes feedback
            row.classList.add('success-flash');
            button.innerHTML = '✗ Afgekeurd';
            button.classList.remove('loading');
            button.classList.add('btn-rejected');
            
            // Wacht even voor visuele feedback
            setTimeout(async () => {
                await this.loadData();
                this.render();
                this.bindEvents();
            }, 800);
            
        } catch (error) {
            console.error('Fout bij afwijzen:', error);
            
            // Error feedback
            row.classList.add('error-flash');
            button.innerHTML = '✗ Fout opgetreden';
            button.classList.remove('loading');
            button.disabled = false;
            
            // Reset na 2 seconden
            setTimeout(() => {
                button.innerHTML = '✗ Afwijzen';
                row.classList.remove('error-flash');
            }, 2000);
            
            alert('Er is een fout opgetreden bij het afwijzen van de aanvraag. Probeer het opnieuw.');
        }
    }

    renderTable(items, columns) {
        if (!items || items.length === 0) {
            return h('div', { class: 'empty-state' }, 
                h('p', null, 'Geen gegevens beschikbaar voor deze categorie')
            );
        }

        return h('table', { class: 'data-tabel elevation-2' },
            h('thead', null,
                h('tr', null, ...columns.map(col => 
                    h('th', { 'data-tooltip': this.getColumnTooltip(col) }, col)
                ))
            ),
            h('tbody', null,
                ...items.map((item, index) =>
                    h('tr', { 
                        'data-item-id': item.ID || item.Id,
                        tabindex: 0,
                        'aria-label': `Rij ${index + 1} van ${items.length}`
                    },
                        ...columns.map(col => {
                            let value = item[col];
                            if (col === 'Status') {
                                return h('td', null, this.renderStatusBadge(value));
                            }
                            if (col.includes('Datum') && value) {
                                const date = new Date(value);
                                value = date.toLocaleDateString('nl-NL');
                                return h('td', { 
                                    'data-tooltip': `Exacte tijd: ${date.toLocaleString('nl-NL')}`
                                }, value);
                            }
                            if (col === 'AantalUren' && value !== undefined) {
                                const formatted = `${value > 0 ? '+' : ''}${value} uur`;
                                return h('td', { 
                                    'data-tooltip': value > 0 ? 'Extra uren' : value < 0 ? 'Compensatie uren' : 'Neutrale uren',
                                    class: value > 0 ? 'positive-hours' : value < 0 ? 'negative-hours' : 'neutral-hours'
                                }, formatted);
                            }
                            return h('td', { 
                                'data-tooltip': value ? value.toString() : 'Geen waarde'
                            }, value ? value.toString() : '-');
                        })
                    )
                )
            )
        );
    }

    renderActionableTable(items, columns) {
        if (!items || items.length === 0) {
            return h('div', { class: 'empty-state' }, 
                h('p', null, 'Geen items in behandeling op dit moment')
            );
        }

        return h('table', { class: 'data-tabel elevation-2' },
            h('thead', null,
                h('tr', null, ...columns.map(col => 
                    h('th', { 'data-tooltip': this.getColumnTooltip(col) }, col)
                ))
            ),
            h('tbody', null,
                ...items.map((item, index) =>
                    h('tr', { 
                        'data-item-id': item.ID || item.Id,
                        tabindex: 0,
                        'aria-label': `Actieve rij ${index + 1} van ${items.length}`,
                        class: 'actionable-row'
                    },
                        ...columns.map(col => {
                            if (col === 'Acties') {
                                return h('td', { class: 'action-cell' }, this.renderActionButtons(item));
                            }
                            
                            let value = item[col];
                            if (col === 'Status') {
                                return h('td', null, this.renderStatusBadge(value));
                            }
                            if (col.includes('Datum') && value) {
                                const date = new Date(value);
                                value = date.toLocaleDateString('nl-NL');
                                return h('td', { 
                                    'data-tooltip': `Exacte tijd: ${date.toLocaleString('nl-NL')}`
                                }, value);
                            }
                            if (col === 'AantalUren' && value !== undefined) {
                                const formatted = `${value > 0 ? '+' : ''}${value} uur`;
                                return h('td', { 
                                    'data-tooltip': value > 0 ? 'Extra uren' : value < 0 ? 'Compensatie uren' : 'Neutrale uren',
                                    class: value > 0 ? 'positive-hours' : value < 0 ? 'negative-hours' : 'neutral-hours'
                                }, formatted);
                            }
                            return h('td', { 
                                'data-tooltip': value ? value.toString() : 'Geen waarde'
                            }, value ? value.toString() : '-');
                        })
                    )
                )
            )
        );
    }

    renderActionButtons(item) {
        const status = item.Status || 'Nieuw';
        const canModify = status === 'Nieuw' || status === 'In behandeling';

        if (!canModify) {
            return this.renderStatusBadge(status);
        }

        const listType = this.activeTab === 'verlof-behandeling' ? 'Verlof' : 'CompensatieUren';
        const itemId = item.ID || item.Id;

        return h('div', { class: 'action-buttons' },
            h('button', { 
                class: 'btn-action btn-approve',
                'data-item-id': itemId,
                'data-item-type': listType,
                'data-tooltip': 'Klik om deze aanvraag goed te keuren',
                'aria-label': `Goedkeuren: ${item.Medewerker || 'Onbekende medewerker'}`
            }, '✓ Goedkeuren'),
            h('button', { 
                class: 'btn-action btn-reject',
                'data-item-id': itemId,
                'data-item-type': listType,
                'data-tooltip': 'Klik om deze aanvraag af te wijzen',
                'aria-label': `Afwijzen: ${item.Medewerker || 'Onbekende medewerker'}`
            }, '✗ Afwijzen')
        );
    }

    getColumnTooltip(column) {
        const tooltips = {
            'Medewerker': 'Naam van de medewerker die de aanvraag heeft ingediend',
            'StartDatum': 'Begin datum van de aanvraag',
            'EindDatum': 'Eind datum van de aanvraag',
            'Datum': 'Datum van de aanvraag',
            'Reden': 'Opgegeven reden voor de aanvraag',
            'Status': 'Huidige status van de aanvraag',
            'AantalUren': 'Aantal uren (+ = extra, - = compensatie)',
            'Acties': 'Beschikbare acties voor deze aanvraag'
        };
        return tooltips[column] || `Informatie over ${column}`;
    }

    renderStatusBadge(status) {
        if (!status) status = 'Nieuw';
        
        let badgeClass = 'status-badge ';
        switch (status.toLowerCase()) {
            case 'goedgekeurd':
            case 'approved':
                badgeClass += 'status-approved';
                break;
            case 'afgekeurd':
            case 'rejected':
                badgeClass += 'status-rejected';
                break;
            case 'in behandeling':
            case 'pending':
                badgeClass += 'status-pending';
                break;
            default:
                badgeClass += 'status-new';
                break;
        }

        return h('span', { class: badgeClass }, status);
    }
}

const app = new BehandelcentrumApp();
app.init();
