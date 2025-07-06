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
        
        // Lopende aanvragen (nieuwe/in behandeling)
        this.verlofLopend = [];
        this.compensatieLopend = [];
        this.ziekteLopend = [];
        this.zittingsvrijLopend = [];
        
        // Archief (goedgekeurd/afgekeurd)
        this.verlofArchief = [];
        this.compensatieArchief = [];
        this.ziekteArchief = [];
        this.zittingsvrijArchief = [];
        
        // Alle data voor overzicht
        this.alleVerlofAanvragen = [];
        this.alleCompensatieAanvragen = [];
        this.alleZiekteAanvragen = [];
        this.alleZittingsvrijAanvragen = [];
        
        this.activeTab = 'verlof-lopend';
        
        // Voor approve/reject modals
        this.selectedItem = null;
        this.isReactieModalOpen = false;
        this.isApproveModalOpen = false;
        this.isRejectModalOpen = false;
        this.modalAction = null; // 'approve', 'reject', or 'comment'
    }

    async init() {
        await sharepointService.initialize();
        const currentUser = await sharepointService.getCurrentUser();
        if (currentUser) {
            document.getElementById('huidige-gebruiker').textContent = currentUser.Title;
        }
        
        // Status element is optional in new design
        const statusElement = document.getElementById('verbinding-status');
        if (statusElement) {
            statusElement.textContent = 'Verbonden';
        }
        
        document.getElementById('huidig-jaar').textContent = new Date().getFullYear();

        await this.loadData();
        this.render();
        this.bindEvents();
    }

    async loadData() {
        try {
            // Load Verlofredenen first to properly categorize leave requests
            let verlofredenen = [];
            try {
                verlofredenen = await sharepointService.getListItems('Verlofredenen');
            } catch (error) {
                console.warn('Verlofredenen lijst niet gevonden:', error);
            }
            
            // Load all leave requests from Verlof list
            const allVerlofItems = await sharepointService.getListItems('Verlof');
            
            // Split into regular leave and sick leave based on reasons
            const verlofItems = allVerlofItems.filter(item => {
                if (!item.Reden) return true; // No reason = general leave
                
                const reden = item.Reden.toLowerCase();
                // Check if it's NOT sick leave
                return !reden.includes('ziekte') && 
                       !reden.includes('ziek') && 
                       !reden.includes('sick');
            });
            
            const ziekteItems = allVerlofItems.filter(item => {
                if (!item.Reden) return false; // No reason = not sick leave
                
                const reden = item.Reden.toLowerCase();
                // Check if it IS sick leave
                return reden.includes('ziekte') || 
                       reden.includes('ziek') || 
                       reden.includes('sick');
            });
            
            // Load compensation hours from CompensatieUren list
            const allCompensatieItems = await sharepointService.getListItems('CompensatieUren');
            
            // Load incident-free court days from IncidenteelZittingVrij list
            let zittingsvrijItems = [];
            try {
                zittingsvrijItems = await sharepointService.getListItems('IncidenteelZittingVrij');
            } catch (error) {
                console.warn('IncidenteelZittingVrij lijst niet gevonden:', error);
            }
            
            // Split all data into lopende (open) and archief (closed) categories
            // Lopende = requests awaiting treatment (new, pending, in progress)
            // Archief = processed requests (approved, rejected, completed)
            
            // Sort all data by creation date (newest first)
            const sortByDate = (a, b) => {
                const dateA = a.AanvraagTijdstip ? new Date(a.AanvraagTijdstip) : new Date(0);
                const dateB = b.AanvraagTijdstip ? new Date(b.AanvraagTijdstip) : new Date(0);
                return dateB - dateA; // Newest first
            };
            
            // Sort and filter all data collections
            this.verlofLopend = verlofItems.filter(item => this.isInBehandeling(item.Status)).sort(sortByDate);
            this.verlofArchief = verlofItems.filter(item => !this.isInBehandeling(item.Status)).sort(sortByDate);
            this.alleVerlofAanvragen = verlofItems.sort(sortByDate);
            
            this.compensatieLopend = allCompensatieItems.filter(item => this.isInBehandeling(item.Status)).sort(sortByDate);
            this.compensatieArchief = allCompensatieItems.filter(item => !this.isInBehandeling(item.Status)).sort(sortByDate);
            this.alleCompensatieAanvragen = allCompensatieItems.sort(sortByDate);
            
            this.ziekteLopend = ziekteItems.filter(item => this.isInBehandeling(item.Status)).sort(sortByDate);
            this.ziekteArchief = ziekteItems.filter(item => !this.isInBehandeling(item.Status)).sort(sortByDate);
            this.alleZiekteAanvragen = ziekteItems.sort(sortByDate);
            
            this.zittingsvrijLopend = zittingsvrijItems.filter(item => this.isInBehandeling(item.Status)).sort(sortByDate);
            this.zittingsvrijArchief = zittingsvrijItems.filter(item => !this.isInBehandeling(item.Status)).sort(sortByDate);
            this.alleZittingsvrijAanvragen = zittingsvrijItems.sort(sortByDate);
            
            console.log('Data geladen volgens configLijst.js:', {
                verlofLopend: this.verlofLopend.length,
                verlofArchief: this.verlofArchief.length,
                compensatieLopend: this.compensatieLopend.length,
                compensatieArchief: this.compensatieArchief.length,
                ziekteLopend: this.ziekteLopend.length,
                ziekteArchief: this.ziekteArchief.length,
                zittingsvrijLopend: this.zittingsvrijLopend.length,
                zittingsvrijArchief: this.zittingsvrijArchief.length
            });
            
        } catch (error) {
            console.error('Fout bij laden van data:', error);
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
        return h('div', { class: 'tab-container-compact' },
            h('div', { class: 'tab-sections-wrapper' },
                // LOPENDE AANVRAGEN - Only Verlof and Compensatie (Very compact)
                h('div', { class: 'tab-section lopende-section' },
                    h('div', { class: 'section-header' }, 
                        h('i', { class: 'fas fa-clock' }), 
                        'Lopend'
                    ),
                    h('div', { class: 'compact-buttons' },
                        h('button', { 
                            class: `compact-tab ${this.activeTab === 'verlof-lopend' ? 'active' : ''}`,
                            'data-tab': 'verlof-lopend'
                        }, 
                            'Verlof',
                            h('span', { class: 'mini-badge urgent' }, this.verlofLopend.length)
                        ),
                        h('button', { 
                            class: `compact-tab ${this.activeTab === 'compensatie-lopend' ? 'active' : ''}`,
                            'data-tab': 'compensatie-lopend'
                        }, 
                            'Compensatie',
                            h('span', { class: 'mini-badge urgent' }, this.compensatieLopend.length)
                        )
                    )
                ),
                
                // ARCHIEF - All four types (Compact grid)
                h('div', { class: 'tab-section archief-section' },
                    h('div', { class: 'section-header' }, 
                        h('i', { class: 'fas fa-archive' }), 
                        'Archief'
                    ),
                    h('div', { class: 'compact-grid' },
                        h('button', { 
                            class: `compact-tab ${this.activeTab === 'verlof-archief' ? 'active' : ''}`,
                            'data-tab': 'verlof-archief'
                        }, 
                            'Verlof',
                            h('span', { class: 'mini-badge' }, this.verlofArchief.length)
                        ),
                        h('button', { 
                            class: `compact-tab ${this.activeTab === 'compensatie-archief' ? 'active' : ''}`,
                            'data-tab': 'compensatie-archief'
                        }, 
                            'Compensatie',
                            h('span', { class: 'mini-badge' }, this.compensatieArchief.length)
                        ),
                        h('button', { 
                            class: `compact-tab ${this.activeTab === 'ziekte-archief' ? 'active' : ''}`,
                            'data-tab': 'ziekte-archief'
                        }, 
                            'Ziekte',
                            h('span', { class: 'mini-badge' }, this.ziekteArchief.length)
                        ),
                        h('button', { 
                            class: `compact-tab ${this.activeTab === 'zittingsvrij-archief' ? 'active' : ''}`,
                            'data-tab': 'zittingsvrij-archief'
                        }, 
                            'Zittingsvrij',
                            h('span', { class: 'mini-badge' }, this.zittingsvrijArchief.length)
                        )
                    )
                )
            )
        );
    }

    renderTabContent() {
        const getTabData = () => {
            switch (this.activeTab) {
                case 'verlof-lopend': return { data: this.verlofLopend, type: 'verlof', actionable: true };
                case 'compensatie-lopend': return { data: this.compensatieLopend, type: 'compensatie', actionable: true };
                // Ziekte and Zittingsvrij are only in archief now
                case 'verlof-archief': return { data: this.verlofArchief, type: 'verlof', actionable: false };
                case 'compensatie-archief': return { data: this.compensatieArchief, type: 'compensatie', actionable: false };
                case 'ziekte-archief': return { data: this.ziekteArchief, type: 'verlof', actionable: false };
                case 'zittingsvrij-archief': return { data: this.zittingsvrijArchief, type: 'zittingsvrij', actionable: false };
                default: return { data: [], type: 'verlof', actionable: false };
            }
        };

        const { data, type, actionable } = getTabData();
        const isLopend = this.activeTab.includes('-lopend');
        
        return h('div', { class: 'tab-content-container' },
            h('div', { class: 'tab-content active' },
                h('div', { class: 'tab-header-compact' },
                    h('h3', null, 
                        isLopend ? 
                        `🔄 ${this.getTabTitle()} - Lopende Aanvragen (${data.length})` :
                        `📁 ${this.getTabTitle()} - Archief (${data.length})`
                    ),
                    isLopend && data.length > 0 && h('div', { class: 'compact-alert' },
                        h('i', { class: 'fas fa-info-circle' }),
                        'Wacht op behandeling'
                    )
                ),
                actionable ? 
                    this.renderActionableTable(data, this.getColumnsForType(type, true)) :
                    this.renderTable(data, this.getColumnsForType(type, false))
            ),
            this.isReactieModalOpen || this.isApproveModalOpen || this.isRejectModalOpen ? this.renderModal() : null
        );
    }

    getTabTitle() {
        const tabTitles = {
            'verlof-lopend': 'Verlofaanvragen',
            'compensatie-lopend': 'Compensatie-uren',
            'ziekte-lopend': 'Ziektemeldingen',
            'zittingsvrij-lopend': 'Zittingsvrije dagen',
            'verlof-archief': 'Verlofaanvragen',
            'compensatie-archief': 'Compensatie-uren',
            'ziekte-archief': 'Ziektemeldingen',
            'zittingsvrij-archief': 'Zittingsvrije dagen'
        };
        return tabTitles[this.activeTab] || 'Overzicht';
    }

    getColumnsForType(type, includeActions = false) {
        const baseColumns = {
            'verlof': ['Medewerker', 'AanvraagTijdstip', 'StartDatum', 'EindDatum', 'Reden', 'Status'],
            'compensatie': ['Medewerker', 'AanvraagTijdstip', 'StartCompensatieUren', 'EindeCompensatieUren', 'UrenTotaal', 'Omschrijving', 'Status'],
            'zittingsvrij': ['Gebruikersnaam', 'AanvraagTijdstip', 'ZittingsVrijeDagTijdStart', 'ZittingsVrijeDagTijdEind', 'Opmerking', 'Status']
        };

        let columns = [...(baseColumns[type] || baseColumns['verlof'])];
        
        if (includeActions) {
            columns.push('Acties');
        } else {
            // Voor archief items, toon behandelaar reactie als die er is
            columns.push('Behandelaar Reactie');
        }
        
        return columns;
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
        
        // Find the item to show in modal
        const allData = [
            ...this.verlofLopend, ...this.compensatieLopend,
            ...this.verlofArchief, ...this.compensatieArchief,
            ...this.ziekteArchief, ...this.zittingsvrijArchief
        ];
        
        const item = allData.find(i => i.ID.toString() === itemId);
        if (item) {
            this.selectedItem = item;
            this.selectedItem.itemType = itemType;
            this.modalAction = 'approve';
            this.isApproveModalOpen = true;
            this.render();
            this.bindEvents();
        }
    }

    async handleReject(event) {
        const button = event.target;
        const itemId = button.dataset.itemId;
        const itemType = button.dataset.itemType;
        
        // Find the item to show in modal
        const allData = [
            ...this.verlofLopend, ...this.compensatieLopend,
            ...this.verlofArchief, ...this.compensatieArchief,
            ...this.ziekteArchief, ...this.zittingsvrijArchief
        ];
        
        const item = allData.find(i => i.ID.toString() === itemId);
        if (item) {
            this.selectedItem = item;
            this.selectedItem.itemType = itemType;
            this.modalAction = 'reject';
            this.isRejectModalOpen = true;
            this.render();
            this.bindEvents();
        }
    }

    openReactieModal(item) {
        this.selectedItem = item;
        this.modalAction = 'comment';
        this.isReactieModalOpen = true;
        this.render();
        this.bindEvents();
    }

    closeReactieModal() {
        this.selectedItem = null;
        this.isReactieModalOpen = false;
        this.render();
        this.bindEvents();
    }

    closeApproveModal() {
        this.selectedItem = null;
        this.isApproveModalOpen = false;
        this.modalAction = null;
        this.render();
        this.bindEvents();
    }

    closeRejectModal() {
        this.selectedItem = null;
        this.isRejectModalOpen = false;
        this.modalAction = null;
        this.render();
        this.bindEvents();
    }

    renderModal() {
        if (!this.selectedItem) return null;

        const item = this.selectedItem;
        const medewerkerNaam = item.Medewerker || item.Gebruikersnaam || 'Onbekende medewerker';
        
        // Get modal title and action based on modalAction
        let modalTitle, modalSubtitle, actionButtonText, actionButtonClass, actionButtonIcon;
        
        switch (this.modalAction) {
            case 'approve':
                modalTitle = 'Aanvraag Goedkeuren';
                modalSubtitle = `${medewerkerNaam} - ${this.getTabTitle()}`;
                actionButtonText = '✓ Goedkeuren';
                actionButtonClass = 'btn-approve-confirm';
                actionButtonIcon = 'fas fa-check';
                break;
            case 'reject':
                modalTitle = 'Aanvraag Afwijzen';
                modalSubtitle = `${medewerkerNaam} - ${this.getTabTitle()}`;
                actionButtonText = '✗ Afwijzen';
                actionButtonClass = 'btn-reject-confirm';
                actionButtonIcon = 'fas fa-times';
                break;
            case 'comment':
            default:
                modalTitle = 'Reactie Toevoegen';
                modalSubtitle = `${medewerkerNaam} - ${this.getTabTitle()}`;
                actionButtonText = '💬 Reactie Opslaan';
                actionButtonClass = 'btn-comment-save';
                actionButtonIcon = 'fas fa-comment';
                break;
        }
        
        // Get the current handler comment based on the active tab
        let currentReactie = '';
        if (this.activeTab.includes('compensatie')) {
            currentReactie = item.ReactieBehandelaar || '';
        } else if (this.activeTab.includes('verlof') || this.activeTab.includes('ziekte')) {
            currentReactie = item.OpmerkingBehandelaar || '';
        } else if (this.activeTab.includes('zittingsvrij')) {
            currentReactie = item.Opmerking || '';
        }

        const isActionModal = this.modalAction === 'approve' || this.modalAction === 'reject';

        return h('div', { class: 'modal-overlay', onClick: (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        }},
            h('div', { class: `modal-content ${isActionModal ? 'action-modal' : 'reactie-modal'}` },
                h('div', { class: 'modal-header' },
                    h('h3', null, modalTitle),
                    h('div', { class: 'modal-subtitle' }, modalSubtitle),
                    h('button', { 
                        class: 'modal-close',
                        onClick: () => this.closeModal()
                    }, '×')
                ),
                h('div', { class: 'modal-body' },
                    h('div', { class: 'aanvraag-details' },
                        h('h4', null, 'Aanvraag Details:'),
                        this.renderAanvraagDetails(item)
                    ),
                    isActionModal && h('div', { class: 'action-warning' },
                        h('div', { class: 'warning-icon' }, 
                            h('i', { class: this.modalAction === 'approve' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle' })
                        ),
                        h('p', null, 
                            this.modalAction === 'approve' 
                                ? 'U staat op het punt deze aanvraag goed te keuren. Deze actie kan niet ongedaan worden gemaakt.'
                                : 'U staat op het punt deze aanvraag af te wijzen. Deze actie kan niet ongedaan worden gemaakt.'
                        )
                    ),
                    h('div', { class: 'reactie-form' },
                        h('label', { for: 'reactie-text' }, 
                            isActionModal 
                                ? `Optionele ${this.modalAction === 'approve' ? 'goedkeurings' : 'afwijzings'}opmerking:`
                                : 'Uw reactie:'
                        ),
                        h('textarea', {
                            id: 'reactie-text',
                            class: 'reactie-textarea',
                            placeholder: isActionModal 
                                ? `Optionele opmerking bij ${this.modalAction === 'approve' ? 'goedkeuring' : 'afwijzing'}...`
                                : 'Typ hier uw reactie voor de medewerker...',
                            value: currentReactie,
                            rows: isActionModal ? 3 : 4
                        })
                    )
                ),
                h('div', { class: 'modal-footer' },
                    h('button', { 
                        class: 'btn btn-secondary',
                        onClick: () => this.closeModal()
                    }, 'Annuleren'),
                    h('button', { 
                        class: `btn ${actionButtonClass}`,
                        onClick: () => isActionModal ? this.confirmAction() : this.saveReactie()
                    }, 
                        h('i', { class: actionButtonIcon }),
                        ` ${actionButtonText}`
                    )
                )
            )
        );
    }

    closeModal() {
        if (this.isReactieModalOpen) this.closeReactieModal();
        if (this.isApproveModalOpen) this.closeApproveModal();
        if (this.isRejectModalOpen) this.closeRejectModal();
    }

    renderAanvraagDetails(item) {
        const details = [];
        
        if (item.StartDatum) {
            details.push(h('div', { class: 'detail-item' },
                h('strong', null, 'Start: '),
                new Date(item.StartDatum).toLocaleDateString('nl-NL')
            ));
        }
        
        if (item.EindDatum) {
            details.push(h('div', { class: 'detail-item' },
                h('strong', null, 'Eind: '),
                new Date(item.EindDatum).toLocaleDateString('nl-NL')
            ));
        }
        
        if (item.StartCompensatieUren) {
            details.push(h('div', { class: 'detail-item' },
                h('strong', null, 'Start: '),
                new Date(item.StartCompensatieUren).toLocaleDateString('nl-NL')
            ));
        }
        
        if (item.UrenTotaal) {
            details.push(h('div', { class: 'detail-item' },
                h('strong', null, 'Uren: '),
                `${item.UrenTotaal > 0 ? '+' : ''}${item.UrenTotaal} uur`
            ));
        }
        
        if (item.Reden || item.Omschrijving || item.Opmerking) {
            details.push(h('div', { class: 'detail-item' },
                h('strong', null, 'Reden/Omschrijving: '),
                item.Reden || item.Omschrijving || item.Opmerking
            ));
        }

        return h('div', { class: 'details-grid' }, ...details);
    }

    async saveReactie() {
        const textarea = document.getElementById('reactie-text');
        const reactie = textarea.value.trim();
        
        if (!reactie) {
            alert('Voer eerst een reactie in.');
            return;
        }

        try {
            const itemId = this.selectedItem.ID || this.selectedItem.Id;
            const listType = this.getListTypeForActiveTab();
            
            // Determine the correct field name for the handler comment based on configLijst.js
            let reactieField;
            switch (listType) {
                case 'CompensatieUren':
                    reactieField = 'ReactieBehandelaar'; // From configLijst.js
                    break;
                case 'Verlof':
                    reactieField = 'OpmerkingBehandelaar'; // From configLijst.js
                    break;
                case 'IncidenteelZittingVrij':
                    // IncidenteelZittingVrij doesn't have a specific handler comment field in configLijst.js
                    // We'll use Opmerking field for now
                    reactieField = 'Opmerking';
                    break;
                default:
                    reactieField = 'ReactieBehandelaar';
            }
            
            await sharepointService.updateListItem(listType, itemId, {
                [reactieField]: reactie
            });
            
            // Reload data en sluit modal
            await this.loadData();
            this.closeReactieModal();
            
        } catch (error) {
            console.error('Fout bij opslaan reactie:', error);
            alert('Er is een fout opgetreden bij het opslaan van de reactie.');
        }
    }

    getListTypeForActiveTab() {
        if (this.activeTab.includes('verlof') || this.activeTab.includes('ziekte')) {
            return 'Verlof';
        } else if (this.activeTab.includes('compensatie')) {
            return 'CompensatieUren';
        } else if (this.activeTab.includes('zittingsvrij')) {
            return 'IncidenteelZittingVrij';
        }
        return 'Verlof'; // default
    }

    renderActionableTable(data, columns) {
        if (!data || data.length === 0) {
            return h('div', { class: 'empty-state' },
                h('div', { class: 'empty-icon' }, '📋'),
                h('h3', null, 'Geen lopende aanvragen'),
                h('p', null, 'Er zijn momenteel geen aanvragen die wachten op behandeling.')
            );
        }

        return h('div', { class: 'table-container' },
            h('table', { class: 'data-table actionable-table' },
                h('thead', null,
                    h('tr', null,
                        ...columns.map(col => h('th', { 'data-column': col }, this.getColumnDisplayName(col)))
                    )
                ),
                h('tbody', null,
                    ...data.map(item => this.renderActionableRow(item, columns))
                )
            )
        );
    }

    renderTable(data, columns) {
        if (!data || data.length === 0) {
            return h('div', { class: 'empty-state' },
                h('div', { class: 'empty-icon' }, '📁'),
                h('h3', null, 'Geen gegevens'),
                h('p', null, 'Er zijn geen gegevens beschikbaar voor deze categorie.')
            );
        }

        return h('div', { class: 'table-container' },
            h('table', { class: 'data-table archive-table' },
                h('thead', null,
                    h('tr', null,
                        ...columns.map(col => h('th', { 'data-column': col }, this.getColumnDisplayName(col)))
                    )
                ),
                h('tbody', null,
                    ...data.map(item => this.renderArchiveRow(item, columns))
                )
            )
        );
    }

    renderActionableRow(item, columns) {
        return h('tr', { class: 'actionable-row' },
            ...columns.map(col => {
                if (col === 'Acties') {
                    return h('td', { class: 'action-cell', 'data-column': col },
                        h('div', { class: 'action-buttons' },
                            h('button', {
                                class: 'btn btn-sm btn-approve',
                                'data-item-id': item.ID || item.Id,
                                'data-item-type': this.getListTypeForActiveTab(),
                                title: 'Aanvraag goedkeuren'
                            }, '✓ Goedkeuren'),
                            h('button', {
                                class: 'btn btn-sm btn-reject',
                                'data-item-id': item.ID || item.Id,
                                'data-item-type': this.getListTypeForActiveTab(),
                                title: 'Aanvraag afwijzen'
                            }, '✗ Afwijzen'),
                            h('button', {
                                class: 'btn btn-sm btn-comment',
                                onClick: () => this.openReactieModal(item),
                                title: 'Reactie toevoegen'
                            }, '💬 Reactie')
                        )
                    );
                } else {
                    return h('td', { 'data-column': col }, this.formatCellValue(item[col], col));
                }
            })
        );
    }

    renderArchiveRow(item, columns) {
        return h('tr', { class: `archive-row status-${(item.Status || '').toLowerCase()}` },
            ...columns.map(col => {
                if (col === 'Behandelaar Reactie') {
                    // Get the correct handler comment field based on the current tab
                    let reactie = '';
                    if (this.activeTab.includes('compensatie')) {
                        reactie = item.ReactieBehandelaar || ''; // CompensatieUren uses ReactieBehandelaar
                    } else if (this.activeTab.includes('verlof') || this.activeTab.includes('ziekte')) {
                        reactie = item.OpmerkingBehandelaar || ''; // Verlof uses OpmerkingBehandelaar
                    } else if (this.activeTab.includes('zittingsvrij')) {
                        reactie = item.Opmerking || ''; // IncidenteelZittingVrij uses Opmerking
                    }
                    
                    return h('td', { class: 'reactie-cell', 'data-column': col },
                        reactie ? h('div', { class: 'reactie-content', title: reactie }, 
                            reactie.length > 50 ? reactie.substring(0, 50) + '...' : reactie
                        ) : h('span', { class: 'no-reactie' }, '-')
                    );
                } else {
                    return h('td', { 'data-column': col }, this.formatCellValue(item[col], col));
                }
            })
        );
    }

    getColumnDisplayName(column) {
        const displayNames = {
            'Medewerker': 'Medewerker',
            'Gebruikersnaam': 'Medewerker',
            'AanvraagTijdstip': 'Aangemaakt op',
            'StartDatum': 'Startdatum',
            'EindDatum': 'Einddatum',
            'StartCompensatieUren': 'Start',
            'EindeCompensatieUren': 'Einde',
            'ZittingsVrijeDagTijdStart': 'Start',
            'ZittingsVrijeDagTijdEind': 'Einde',
            'UrenTotaal': 'Uren',
            'Reden': 'Reden',
            'Omschrijving': 'Omschrijving',
            'Opmerking': 'Opmerking',
            'Status': 'Status',
            'Acties': 'Acties',
            'Behandelaar Reactie': 'Behandelaar Reactie'
        };
        return displayNames[column] || column;
    }

    formatCellValue(value, column) {
        if (!value) return '-';

        // Format dates
        if (column === 'AanvraagTijdstip') {
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleString('nl-NL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            } catch (e) {
                // If date parsing fails, return original value
            }
        } else if (column.includes('Datum') || column.includes('Tijd') || column.includes('Start') || column.includes('Eind')) {
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    // Check if it includes time
                    if (column.includes('Tijd') || value.includes('T')) {
                        return date.toLocaleString('nl-NL', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } else {
                        return date.toLocaleDateString('nl-NL');
                    }
                }
            } catch (e) {
                // If date parsing fails, return original value
            }
        }

        // Format status with badges
        if (column === 'Status') {
            const statusClass = value.toLowerCase().replace(/\s+/g, '-');
            return h('span', { class: `status-badge status-${statusClass}` }, value);
        }

        // Format hours
        if (column === 'UrenTotaal' && !isNaN(value)) {
            return `${value > 0 ? '+' : ''}${value} uur`;
        }

        // Truncate long text
        if (typeof value === 'string' && value.length > 100) {
            return h('span', { title: value }, value.substring(0, 100) + '...');
        }

        return value;
    }

    async confirmAction() {
        const item = this.selectedItem;
        const itemId = item.ID;
        const itemType = item.itemType;
        const comment = document.getElementById('reactie-text')?.value || '';
        
        const isApprove = this.modalAction === 'approve';
        const newStatus = isApprove ? 'Goedgekeurd' : 'Afgekeurd';
        
        try {
            // Prepare update data
            const updateData = { Status: newStatus };
            
            // Add comment if provided
            if (comment.trim()) {
                if (this.activeTab.includes('compensatie')) {
                    updateData.ReactieBehandelaar = comment;
                } else if (this.activeTab.includes('verlof') || this.activeTab.includes('ziekte')) {
                    updateData.OpmerkingBehandelaar = comment;
                } else if (this.activeTab.includes('zittingsvrij')) {
                    updateData.Opmerking = comment;
                }
            }
            
            // Update the item
            await sharepointService.updateListItem(itemType, itemId, updateData);
            
            // Close modal and refresh data
            this.closeModal();
            await this.loadData();
            this.render();
            this.bindEvents();
            
            // Show success message
            alert(`Aanvraag succesvol ${isApprove ? 'goedgekeurd' : 'afgekeurd'}!`);
            
        } catch (error) {
            console.error(`Fout bij ${isApprove ? 'goedkeuren' : 'afwijzen'}:`, error);
            alert(`Er is een fout opgetreden bij het ${isApprove ? 'goedkeuren' : 'afwijzen'} van de aanvraag. Probeer het opnieuw.`);
        }
    }
}

const app = new BehandelcentrumApp();
app.init();
