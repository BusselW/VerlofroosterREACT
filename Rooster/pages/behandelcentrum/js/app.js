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
        this.activeTab = 'verlof';
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
        this.verlofAanvragen = allVerlofItems.filter(item => 
            !item.Reden || item.Reden.toLowerCase().includes('verlof') || item.Reden.toLowerCase().includes('vakantie')
        );
        this.ziekteAanvragen = allVerlofItems.filter(item => 
            item.Reden && item.Reden.toLowerCase().includes('ziekte')
        );
        
        // Haal compensatie-uren op
        this.compensatieAanvragen = await sharepointService.getListItems('CompensatieUren');
        
        // Haal zittingsvrij op (aangenomen dat er een lijst is)
        try {
            this.zittingsvrijAanvragen = await sharepointService.getListItems('Zittingsvrij');
        } catch (error) {
            console.warn('Zittingsvrij lijst niet gevonden:', error);
            this.zittingsvrijAanvragen = [];
        }
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
        return h('div', { class: 'tab-container' },
            h('div', { class: 'tab-navigation' },
                h('button', { 
                    class: `tab-button ${this.activeTab === 'verlof' ? 'active' : ''}`,
                    'data-tab': 'verlof'
                }, `Verlof (${this.verlofAanvragen.length})`),
                h('button', { 
                    class: `tab-button ${this.activeTab === 'ziekte' ? 'active' : ''}`,
                    'data-tab': 'ziekte'
                }, `Ziekte (${this.ziekteAanvragen.length})`),
                h('button', { 
                    class: `tab-button ${this.activeTab === 'compensatie' ? 'active' : ''}`,
                    'data-tab': 'compensatie'
                }, `Compensatie-uren (${this.compensatieAanvragen.length})`),
                h('button', { 
                    class: `tab-button ${this.activeTab === 'zittingsvrij' ? 'active' : ''}`,
                    'data-tab': 'zittingsvrij'
                }, `Zittingsvrij (${this.zittingsvrijAanvragen.length})`)
            )
        );
    }

    renderTabContent() {
        return h('div', { class: 'tab-content-container' },
            h('div', { 
                class: `tab-content ${this.activeTab === 'verlof' ? 'active' : ''}`,
                id: 'tab-verlof'
            }, 
                h('h2', null, 'Verlof Aanvragen'),
                this.renderActionableTable(this.verlofAanvragen, ['Medewerker', 'StartDatum', 'EindDatum', 'Reden', 'Status', 'Acties'])
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
                h('h2', null, 'Compensatie Uren'),
                this.renderActionableTable(this.compensatieAanvragen, ['Medewerker', 'Datum', 'AantalUren', 'Reden', 'Status', 'Acties'])
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
        const itemId = event.target.dataset.itemId;
        const itemType = event.target.dataset.itemType;
        
        try {
            await sharepointService.updateListItem(itemType, itemId, { Status: 'Goedgekeurd' });
            await this.loadData();
            this.render();
            this.bindEvents();
        } catch (error) {
            console.error('Fout bij goedkeuren:', error);
            alert('Er is een fout opgetreden bij het goedkeuren van de aanvraag.');
        }
    }

    async handleReject(event) {
        const itemId = event.target.dataset.itemId;
        const itemType = event.target.dataset.itemType;
        
        try {
            await sharepointService.updateListItem(itemType, itemId, { Status: 'Afgekeurd' });
            await this.loadData();
            this.render();
            this.bindEvents();
        } catch (error) {
            console.error('Fout bij afwijzen:', error);
            alert('Er is een fout opgetreden bij het afwijzen van de aanvraag.');
        }
    }

    renderTable(items, columns) {
        if (!items || items.length === 0) {
            return h('div', { class: 'empty-state' }, 
                h('p', null, 'Geen gegevens beschikbaar')
            );
        }

        return h('table', { class: 'data-tabel' },
            h('thead', null,
                h('tr', null, ...columns.map(col => h('th', null, col)))
            ),
            h('tbody', null,
                ...items.map(item =>
                    h('tr', null,
                        ...columns.map(col => {
                            let value = item[col];
                            if (col === 'Status') {
                                return h('td', null, this.renderStatusBadge(value));
                            }
                            if (col.includes('Datum') && value) {
                                value = new Date(value).toLocaleDateString('nl-NL');
                            }
                            return h('td', null, value ? value.toString() : '-');
                        })
                    )
                )
            )
        );
    }

    renderActionableTable(items, columns) {
        if (!items || items.length === 0) {
            return h('div', { class: 'empty-state' }, 
                h('p', null, 'Geen gegevens beschikbaar')
            );
        }

        return h('table', { class: 'data-tabel' },
            h('thead', null,
                h('tr', null, ...columns.map(col => h('th', null, col)))
            ),
            h('tbody', null,
                ...items.map(item =>
                    h('tr', null,
                        ...columns.map(col => {
                            if (col === 'Acties') {
                                return h('td', null, this.renderActionButtons(item));
                            }
                            
                            let value = item[col];
                            if (col === 'Status') {
                                return h('td', null, this.renderStatusBadge(value));
                            }
                            if (col.includes('Datum') && value) {
                                value = new Date(value).toLocaleDateString('nl-NL');
                            }
                            if (col === 'AantalUren' && value) {
                                value = `${value > 0 ? '+' : ''}${value} uur`;
                            }
                            return h('td', null, value ? value.toString() : '-');
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

        const listType = this.activeTab === 'verlof' ? 'Verlof' : 'CompensatieUren';

        return h('div', { class: 'action-buttons' },
            h('button', { 
                class: 'btn-action btn-approve',
                'data-item-id': item.ID || item.Id,
                'data-item-type': listType
            }, 'Goedkeuren'),
            h('button', { 
                class: 'btn-action btn-reject',
                'data-item-id': item.ID || item.Id,
                'data-item-type': listType
            }, 'Afwijzen')
        );
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
