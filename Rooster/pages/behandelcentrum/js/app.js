// No imports needed - using global objects from included scripts
// window.SharePointService (from sharepointService-global.js)
// window.LinkInfo (from linkInfo-global.js)
// window.appConfiguratie (from configLijst.js)
// window.ConfigHelper (from configHelper.js)

 

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

        if (typeof child === 'string' ) {

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
        
        // New navigation state
        this.viewMode = 'lopend'; // 'lopend' or 'historisch'
        this.selectedType = 'verlof'; // 'verlof', 'compensatie', 'ziekte', 'zittingsvrij'

       

        // Voor approve/reject modals

        this.selectedItem = null;

        this.isReactieModalOpen = false;

        this.isApproveModalOpen = false;

        this.isRejectModalOpen = false;

        this.modalAction = null; // 'approve', 'reject', or 'comment'

       

        // Feature flags

        this.showTeamleider = true; // Default to true, will be checked during init
        
        // Notification system
        this.notifications = [];
        this.notificationId = 0;
        
        // Team filtering
        this.currentUser = null;
        this.currentUserTeams = [];
        this.isTeamLeader = false;
        this.showOnlyOwnTeam = false; // Personal setting from gebruikersInstellingen
        this.userSettings = null;
    }

 

    async init() {
        // Initialize with global services
        
        // Check if SharePointService is available
        if (!window.SharePointService) {
            console.error('SharePointService not available. Please check that sharepointService-global.js is loaded.');
            return;
        }

        // Get current user information
        try {
            this.currentUser = await window.SharePointService.getCurrentUser();
            if (this.currentUser && this.currentUser.Title) {
                const userElement = document.getElementById('huidige-gebruiker');
                if (userElement) {
                    userElement.textContent = this.currentUser.Title;
                }
                
                // Load user settings and team information
                await this.loadUserTeamInfo();
                await this.loadUserSettings();
            }
        } catch (error) {
            console.warn('Could not get current user info:', error);
        }

        // Set current year in footer
        const yearElement = document.getElementById('huidig-jaar');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        // Load data and render
        await this.loadData();
        this.render();
        this.bindEvents();
    }

 

    async loadData() {
        try {
            // Load Verlofredenen first to properly categorize leave requests
            let verlofredenen = [];
            try {
                verlofredenen = await window.SharePointService.fetchSharePointList('Verlofredenen');
            } catch (error) {
                console.warn('Could not load Verlofredenen:', error);
            }
            
            // Identify sick leave reasons (ziekte keywords)
            const ziekteRedenen = verlofredenen.filter(reden => 
                reden.Title && reden.Title.toLowerCase().includes('ziek')
            ).map(reden => reden.Title);
            
            // Load all leave requests from Verlof list
            const allVerlofItems = await window.SharePointService.fetchSharePointList('Verlof');
            
            // Split into regular leave and sick leave based on reasons
            const verlofItems = allVerlofItems.filter(item => {
                if (!item.Reden) return true; // Default to regular leave if no reason
                return !ziekteRedenen.some(ziekteReden => 
                    item.Reden.toLowerCase().includes(ziekteReden.toLowerCase())
                );
            });
            
            const ziekteItems = allVerlofItems.filter(item => {
                if (!item.Reden) return false;
                return ziekteRedenen.some(ziekteReden => 
                    item.Reden.toLowerCase().includes(ziekteReden.toLowerCase())
                );
            });
            
            // Load compensation hours from CompensatieUren list
            const allCompensatieItems = await window.SharePointService.fetchSharePointList('CompensatieUren');
            
            // Load incident-free court days from IncidenteelZittingVrij list
            let zittingsvrijItems = [];
            try {
                zittingsvrijItems = await window.SharePointService.fetchSharePointList('IncidenteelZittingVrij');
            } catch (error) {
                console.warn('Could not load IncidenteelZittingVrij:', error);
            }
            
            // Sort and filter all data collections
            const sortByDate = (a, b) => {
                const dateA = new Date(a.AanvraagTijdstip || a.Created || a.Modified || 0);
                const dateB = new Date(b.AanvraagTijdstip || b.Created || b.Modified || 0);
                return dateB - dateA;
            };
            
            // Apply team filtering if needed
            const filteredVerlofItems = await this.filterByTeams(verlofItems);
            const filteredCompensatieItems = await this.filterByTeams(allCompensatieItems);
            const filteredZiekteItems = await this.filterByTeams(ziekteItems);
            const filteredZittingsvrijItems = await this.filterByTeams(zittingsvrijItems);
            
            this.verlofLopend = filteredVerlofItems.filter(item => this.isInBehandeling(item.Status)).sort(sortByDate);
            this.verlofArchief = filteredVerlofItems.filter(item => !this.isInBehandeling(item.Status)).sort(sortByDate);
            this.alleVerlofAanvragen = filteredVerlofItems.sort(sortByDate);
            
            this.compensatieLopend = filteredCompensatieItems.filter(item => this.isInBehandeling(item.Status)).sort(sortByDate);
            this.compensatieArchief = filteredCompensatieItems.filter(item => !this.isInBehandeling(item.Status)).sort(sortByDate);
            this.alleCompensatieAanvragen = filteredCompensatieItems.sort(sortByDate);
            
            this.ziekteLopend = filteredZiekteItems.filter(item => this.isInBehandeling(item.Status)).sort(sortByDate);
            this.ziekteArchief = filteredZiekteItems.filter(item => !this.isInBehandeling(item.Status)).sort(sortByDate);
            this.alleZiekteAanvragen = filteredZiekteItems.sort(sortByDate);
            
            this.zittingsvrijLopend = filteredZittingsvrijItems.filter(item => this.isInBehandeling(item.Status)).sort(sortByDate);
            this.zittingsvrijArchief = filteredZittingsvrijItems.filter(item => !this.isInBehandeling(item.Status)).sort(sortByDate);
            this.alleZittingsvrijAanvragen = filteredZittingsvrijItems.sort(sortByDate);
            
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
        
        // Add modal if one should be shown
        if (this.isApproveModalOpen || this.isRejectModalOpen || this.isReactieModalOpen) {
            app.appendChild(this.renderModal());
        }
        
        this.root.appendChild(app);
        
        // Load teamleider data after DOM is updated
        setTimeout(() => this.loadTeamleiderData(), 0);
    }
    renderTabs() {
        return h('div', { class: 'navigation-container' },
            // Team filter toggle (only show for team leaders)
            this.isTeamLeader && h('div', { class: 'team-filter-container' },
                h('div', { class: 'filter-toggle' },
                    h('label', { class: 'toggle-label' },
                        h('span', { class: 'toggle-text' }, 'Alleen eigen team:'),
                        h('div', { class: 'toggle-switch' },
                            h('input', {
                                type: 'checkbox',
                                id: 'team-filter-toggle',
                                checked: this.showOnlyOwnTeam,
                                onChange: (e) => this.handleTeamFilterToggle(e)
                            }),
                            h('span', { class: 'toggle-slider' })
                        )
                    )
                )
            ),
            
            // Main toggle between Lopende and Historische aanvragen
            h('div', { class: 'main-toggle' },
                h('button', {
                    class: `toggle-btn ${this.viewMode === 'lopend' ? 'active' : ''}`,
                    'data-mode': 'lopend'
                },
                    h('i', { class: 'fas fa-clock' }),
                    'Lopende aanvragen'
                ),
                h('button', {
                    class: `toggle-btn ${this.viewMode === 'historisch' ? 'active' : ''}`,
                    'data-mode': 'historisch'
                },
                    h('i', { class: 'fas fa-archive' }),
                    'Historische aanvragen'
                )
            ),
            
            // Type selection buttons
            h('div', { class: 'type-selection' },
                h('div', { class: 'type-buttons' },
                    // Verlof button
                    h('button', {
                        class: `type-btn ${this.selectedType === 'verlof' ? 'active' : ''}`,
                        'data-type': 'verlof'
                    },
                        'Verlof',
                        h('span', { class: 'count-badge' }, 
                            this.viewMode === 'lopend' ? this.verlofLopend.length : this.verlofArchief.length
                        )
                    ),
                    
                    // Compensatie button
                    h('button', {
                        class: `type-btn ${this.selectedType === 'compensatie' ? 'active' : ''}`,
                        'data-type': 'compensatie'
                    },
                        'Compensatie',
                        h('span', { class: 'count-badge' }, 
                            this.viewMode === 'lopend' ? this.compensatieLopend.length : this.compensatieArchief.length
                        )
                    ),
                    
                    // Show Ziekte and Zittingsvrij only in historical mode
                    this.viewMode === 'historisch' && h('button', {
                        class: `type-btn ${this.selectedType === 'ziekte' ? 'active' : ''}`,
                        'data-type': 'ziekte'
                    },
                        'Ziekte',
                        h('span', { class: 'count-badge' }, this.ziekteArchief.length)
                    ),
                    
                    this.viewMode === 'historisch' && h('button', {
                        class: `type-btn ${this.selectedType === 'zittingsvrij' ? 'active' : ''}`,
                        'data-type': 'zittingsvrij'
                    },
                        'Zittingsvrij',
                        h('span', { class: 'count-badge' }, this.zittingsvrijArchief.length)
                    )
                )
            )
        );
    }

 

    renderTabContent() {
        const getTabData = () => {
            // Determine the data based on viewMode and selectedType
            if (this.viewMode === 'lopend') {
                switch (this.selectedType) {
                    case 'verlof':
                        return { data: this.verlofLopend, type: 'verlof', actionable: true };
                    case 'compensatie':
                        return { data: this.compensatieLopend, type: 'compensatie', actionable: true };
                    default:
                        return { data: this.verlofLopend, type: 'verlof', actionable: true };
                }
            } else { // historisch
                switch (this.selectedType) {
                    case 'verlof':
                        return { data: this.verlofArchief, type: 'verlof', actionable: false };
                    case 'compensatie':
                        return { data: this.compensatieArchief, type: 'compensatie', actionable: false };
                    case 'ziekte':
                        return { data: this.ziekteArchief, type: 'verlof', actionable: false };
                    case 'zittingsvrij':
                        return { data: this.zittingsvrijArchief, type: 'zittingsvrij', actionable: false };
                    default:
                        return { data: this.verlofArchief, type: 'verlof', actionable: false };
                }
            }
        };

        const { data, type, actionable } = getTabData();
        const isLopend = this.viewMode === 'lopend';
        
        return h('div', { class: 'tab-content-container' },
            h('div', { class: 'tab-content active' },
                h('div', { class: 'content-header' },
                    h('h3', null,
                        isLopend ?
                        `🔄 ${this.getActiveTypeTitle()} - Lopende Aanvragen (${data.length})` :
                        `📁 ${this.getActiveTypeTitle()} - Historisch (${data.length})`
                    )
                ),
                this.renderSimpleTable(data, type, actionable)
            )
        );
    }

 

    getActiveTypeTitle() {
        const typeTitles = {
            'verlof': 'Verlofaanvragen',
            'compensatie': 'Compensatie-uren',
            'ziekte': 'Ziektemeldingen',
            'zittingsvrij': 'Zittingsvrije dagen'
        };
        return typeTitles[this.selectedType] || 'Overzicht';
    }

    getTabTitle() {
        // Legacy method for backward compatibility
        return this.getActiveTypeTitle();
    }

    renderSimpleTable(data, type, actionable) {
        if (!data || data.length === 0) {
            return h('div', { class: 'empty-state' },
                h('div', { class: 'empty-icon' }, actionable ? '📋' : '📁'),
                h('h3', null, actionable ? 'Geen lopende aanvragen' : 'Geen gegevens'),
                h('p', null, actionable ? 
                    'Er zijn momenteel geen aanvragen die wachten op behandeling.' :
                    'Er zijn geen gegevens beschikbaar voor deze categorie.'
                )
            );
        }

        const columns = this.getColumnsForType(type, actionable);
        
        return h('div', { class: 'table-container' },
            h('table', { class: 'data-table' },
                h('thead', null,
                    h('tr', null,
                        ...columns.map(col => h('th', { 'data-column': col }, this.getColumnDisplayName(col)))
                    )
                ),
                h('tbody', null,
                    ...data.map(item => this.renderTableRow(item, columns, actionable))
                )
            )
        );
    }

    getColumnsForType(type, includeActions = false) {
        const baseColumns = {
            'verlof': ['Medewerker', 'Teamleider', 'Reden', 'Omschrijving', 'StartDatum', 'EindDatum', 'AanvraagTijdstip', 'Status'],
            'compensatie': ['Medewerker', 'Teamleider', 'Omschrijving', 'StartCompensatieUren', 'EindeCompensatieUren', 'UrenTotaal', 'AanvraagTijdstip', 'Status'],
            'zittingsvrij': ['Gebruikersnaam', 'Teamleider', 'Opmerking', 'ZittingsVrijeDagTijdStart', 'ZittingsVrijeDagTijdEind', 'AanvraagTijdstip', 'Status']
        };

        let columns = [...(baseColumns[type] || baseColumns['verlof'])];
        
        if (includeActions) {
            columns.push('Acties');
        } else {
            columns.push('Behandelaar Reactie');
        }
        
        return columns;
    }

    getColumnDisplayName(column) {
        const displayNames = {
            'Medewerker': 'Medewerker',
            'Gebruikersnaam': 'Medewerker',
            'Teamleider': 'Teamleider',
            'AanvraagTijdstip': 'Aangemaakt op',
            'StartDatum': 'Vanaf',
            'EindDatum': 'Tot',
            'StartCompensatieUren': 'Vanaf',
            'EindeCompensatieUren': 'Tot',
            'ZittingsVrijeDagTijdStart': 'Vanaf',
            'ZittingsVrijeDagTijdEind': 'Tot',
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

    renderTableRow(item, columns, actionable) {
        return h('tr', { class: actionable ? 'actionable-row' : 'archive-row' },
            ...columns.map(col => {
                if (col === 'Acties' && actionable) {
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
                            }, '✗ Afwijzen')
                        )
                    );
                } else if (col === 'Behandelaar Reactie') {
                    let reactie = '';
                    if (this.selectedType === 'compensatie') {
                        reactie = item.ReactieBehandelaar || '';
                    } else if (this.selectedType === 'verlof' || this.selectedType === 'ziekte') {
                        reactie = item.OpmerkingBehandelaar || '';
                    } else if (this.selectedType === 'zittingsvrij') {
                        reactie = item.Opmerking || '';
                    }
                    
                    return h('td', { class: 'reactie-cell', 'data-column': col },
                        reactie ? h('div', { class: 'reactie-content', title: reactie },
                            reactie.length > 50 ? reactie.substring(0, 50) + '...' : reactie
                        ) : h('span', { class: 'no-reactie' }, '-')
                    );
                } else {
                    return h('td', { 'data-column': col }, this.formatCellValue(item[col], col, item));
                }
            })
        );
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

         // Get the current handler comment based on the selected type
        let currentReactie = '';
        if (this.selectedType === 'compensatie') {
            currentReactie = item.ReactieBehandelaar || '';
        } else if (this.selectedType === 'verlof' || this.selectedType === 'ziekte') {
            currentReactie = item.OpmerkingBehandelaar || '';
        } else if (this.selectedType === 'zittingsvrij') {
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
        this.selectedItem = null;
        this.modalAction = null;
        this.isReactieModalOpen = false;
        this.isApproveModalOpen = false;
        this.isRejectModalOpen = false;
        this.render();
        this.bindEvents();
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

       

        if (item.Reden) {
            details.push(h('div', { class: 'detail-item' },
                h('strong', null, 'Reden: '),
                item.Reden
            ));
        }
        
        if (item.Omschrijving) {
            details.push(h('div', { class: 'detail-item detail-item-employee-comment' },
                h('strong', null, 'Medewerker opmerking: '),
                h('div', { class: 'employee-comment' }, item.Omschrijving)
            ));
        }
        
        if (item.Opmerking && !item.Omschrijving) {
            details.push(h('div', { class: 'detail-item detail-item-employee-comment' },
                h('strong', null, 'Opmerking: '),
                h('div', { class: 'employee-comment' }, item.Opmerking)
            ));
        }

 

        return h('div', { class: 'details-grid' }, ...details);

    }

 

    async saveReactie() {

        const textarea = document.getElementById('reactie-text');

        const reactie = textarea.value.trim();

         if (!reactie) {
            this.showNotification('Voer eerst een reactie in.', 'error');
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

             await window.SharePointService.updateListItem(listType, itemId, {
                [reactieField]: reactie
            });

           

            // Reload data en sluit modal

            await this.loadData();

            this.closeReactieModal();

             } catch (error) {
            console.error('Fout bij opslaan reactie:', error);
            this.showNotification('Er is een fout opgetreden bij het opslaan van de reactie.', 'error');
        }

    }
    getListTypeForActiveTab() {
        if (this.selectedType === 'verlof' || this.selectedType === 'ziekte') {
            return 'Verlof';
        } else if (this.selectedType === 'compensatie') {
            return 'CompensatieUren';
        } else if (this.selectedType === 'zittingsvrij') {
            return 'IncidenteelZittingVrij';
        }
        return 'Verlof'; // default
    }

 

    formatCellValue(value, column, item) {

        if (!value && column !== 'Teamleider') return '-';        // For Teamleider column
        if (column === 'Teamleider') {
            // Create a placeholder with data attributes for async loading
            // Use MedewerkerID for Verlof items, Medewerker for CompensatieUren, Gebruikersnaam for Zittingsvrij
            const username = item.MedewerkerID || item.Medewerker || item.Gebruikersnaam || '';
            
            return h('span', {
                class: 'teamleider-placeholder',
                'data-username': username,
                title: 'Teamleider van ' + username
            }, 'Laden...');
        }        // Format dates
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
        } else if (column === 'StartDatum' || column === 'EindDatum' || column === 'StartCompensatieUren' || column === 'EindeCompensatieUren' || column === 'ZittingsVrijeDagTijdStart' || column === 'ZittingsVrijeDagTijdEind') {
            // Format start/end dates as dd-mm-yyyy (no time)
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    });
                }
            } catch (e) {
                // If date parsing fails, return original value
            }
        } else if (column.includes('Datum') || column.includes('Tijd')) {
            // Other date fields - show with time if available
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
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

 

        // Format employee comments with special styling
        if (column === 'Omschrijving' && value) {
            return h('div', { class: 'employee-comment-cell' },
                h('span', { class: 'employee-comment-preview', title: value },
                    value.length > 30 ? value.substring(0, 30) + '...' : value
                ),
                h('div', { class: 'employee-comment-full' }, value)
            );
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

    bindEvents() {
        // Main toggle buttons (Lopende vs Historische)
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.removeEventListener('click', this.handleModeToggle);
            button.addEventListener('click', this.handleModeToggle.bind(this));
        });

        // Type selection buttons (Verlof, Compensatie, etc.)
        document.querySelectorAll('.type-btn').forEach(button => {
            button.removeEventListener('click', this.handleTypeSelection);
            button.addEventListener('click', this.handleTypeSelection.bind(this));
        });

        // Action button events
        document.querySelectorAll('.btn-approve').forEach(button => {
            button.removeEventListener('click', this.handleApprove);
            button.addEventListener('click', this.handleApprove.bind(this));
        });

        document.querySelectorAll('.btn-reject').forEach(button => {
            button.removeEventListener('click', this.handleReject);
            button.addEventListener('click', this.handleReject.bind(this));
        });

        // Modal button events
        document.querySelectorAll('.btn-approve-confirm').forEach(button => {
            button.removeEventListener('click', this.confirmAction);
            button.addEventListener('click', this.confirmAction.bind(this));
        });

        document.querySelectorAll('.btn-reject-confirm').forEach(button => {
            button.removeEventListener('click', this.confirmAction);
            button.addEventListener('click', this.confirmAction.bind(this));
        });

        document.querySelectorAll('.btn-comment-save').forEach(button => {
            button.removeEventListener('click', this.saveReactie);
            button.addEventListener('click', this.saveReactie.bind(this));
        });
    }

    async loadTeamleiderData() {
        // Only load if showTeamleider is enabled and LinkInfo is available
        if (!this.showTeamleider || !window.LinkInfo) {
            return;
        }

        const placeholders = document.querySelectorAll('.teamleider-placeholder');
        
        for (const placeholder of placeholders) {
            const username = placeholder.getAttribute('data-username');
            if (!username) continue;

            try {
                const teamleider = await window.LinkInfo.getTeamLeaderForEmployee(username);
                
                if (teamleider && teamleider !== username) {
                    placeholder.textContent = teamleider;
                    placeholder.className = 'teamleider-loaded';
                    placeholder.title = `Teamleider van ${username}: ${teamleider}`;
                } else {
                    placeholder.textContent = 'Niet beschikbaar';
                    placeholder.className = 'teamleider-unavailable';
                    placeholder.title = `Geen teamleider gevonden voor ${username}`;
                }
            } catch (error) {
                console.warn(`Fout bij ophalen teamleider voor ${username}:`, error);
                placeholder.textContent = 'Niet beschikbaar';
                placeholder.className = 'teamleider-unavailable';
                placeholder.title = `Kon teamleider niet ophalen voor ${username}`;
            }
        }
    }

    async loadUserTeamInfo() {
        if (!this.currentUser || !this.currentUser.LoginName) return;
        
        try {
            // Get current user's username in the format stored in MedewerkerID
            const username = this.currentUser.LoginName.includes('\\') 
                ? this.currentUser.LoginName 
                : `som\\${this.currentUser.LoginName}`;
            
            // Load all teams to check if current user is the team leader
            const allTeams = await window.SharePointService.fetchSharePointList('Teams');
            
            // Find teams where current user is the team leader
            this.currentUserTeams = allTeams.filter(team => 
                team.TeamleiderId && team.TeamleiderId.toLowerCase().includes(username.toLowerCase())
            );
            
            this.isTeamLeader = this.currentUserTeams.length > 0;
            
            console.log('User team info loaded:', {
                username,
                isTeamLeader: this.isTeamLeader,
                teams: this.currentUserTeams.map(t => t.Naam)
            });
            
        } catch (error) {
            console.warn('Could not load user team info:', error);
        }
    }
    
    async loadUserSettings() {
        if (!this.currentUser || !this.currentUser.Title) return;
        
        try {
            // Load user settings from gebruikersInstellingen list
            const userSettings = await window.SharePointService.fetchSharePointList('gebruikersInstellingen');
            
            // Find settings for current user (match by Title/Name)
            this.userSettings = userSettings.find(setting => 
                setting.Title && setting.Title.toLowerCase() === this.currentUser.Title.toLowerCase()
            );
            
            if (this.userSettings) {
                this.showOnlyOwnTeam = this.userSettings.BHCAlleenEigen === true;
            } else {
                // Create default user settings if none exist
                this.userSettings = {
                    Title: this.currentUser.Title,
                    BHCAlleenEigen: false
                };
                this.showOnlyOwnTeam = false;
            }
            
            console.log('User settings loaded:', {
                showOnlyOwnTeam: this.showOnlyOwnTeam,
                userSettings: this.userSettings
            });
            
        } catch (error) {
            console.warn('Could not load user settings:', error);
            this.showOnlyOwnTeam = false;
        }
    }
    
    async updateUserSetting(field, value) {
        try {
            if (!this.userSettings) return;
            
            const updateData = { [field]: value };
            
            if (this.userSettings.ID || this.userSettings.Id) {
                // Update existing setting
                await window.SharePointService.updateListItem(
                    'gebruikersInstellingen', 
                    this.userSettings.ID || this.userSettings.Id, 
                    updateData
                );
            } else {
                // Create new setting
                const newSetting = {
                    Title: this.currentUser.Title,
                    ...updateData
                };
                const created = await window.SharePointService.createListItem('gebruikersInstellingen', newSetting);
                this.userSettings = { ...this.userSettings, ...created };
            }
            
            // Update local state
            this.userSettings[field] = value;
            if (field === 'BHCAlleenEigen') {
                this.showOnlyOwnTeam = value;
                // Reload data with new filter
                await this.loadData();
                this.render();
                this.bindEvents();
            }
            
        } catch (error) {
            console.error('Could not update user setting:', error);
            this.showNotification('Fout bij opslaan instelling.', 'error');
        }
    }
    
    async filterByTeams(items) {
        // If not a team leader or showing all teams, return all items
        if (!this.isTeamLeader || !this.showOnlyOwnTeam) {
            return items;
        }
        
        if (!this.currentUserTeams || this.currentUserTeams.length === 0) {
            return items;
        }
        
        try {
            // Get all employees to map usernames to teams
            const employees = await window.SharePointService.fetchSharePointList('Medewerkers');
            
            // Create a map of username to team
            const userTeamMap = {};
            employees.forEach(emp => {
                if (emp.Username && emp.Team) {
                    userTeamMap[emp.Username.toLowerCase()] = emp.Team;
                }
            });
            
            // Get the team names that current user leads
            const ownTeamNames = this.currentUserTeams.map(team => team.Naam);
            
            // Filter items to only show those from own teams
            return items.filter(item => {
                const username = (item.MedewerkerID || item.Medewerker || item.Gebruikersnaam || '').toLowerCase();
                const userTeam = userTeamMap[username];
                
                return userTeam && ownTeamNames.includes(userTeam);
            });
            
        } catch (error) {
            console.warn('Error filtering by teams:', error);
            return items; // Return all items if filtering fails
        }
    }

    handleTeamFilterToggle(e) {
        const newValue = e.target.checked;
        this.updateUserSetting('BHCAlleenEigen', newValue);
    }
}
 

// Create a fallback appConfiguratie if it doesn't exist

if (typeof window.appConfiguratie === "undefined") {

    console.warn("Creating fallback appConfiguratie object in app.js because it was not found");

    window.appConfiguratie = {

        instellingen: {

            debounceTimer: 300,

            siteUrl: ""  // Empty site URL will cause graceful fallbacks

        }

    };

}

 

const app = new BehandelcentrumApp();

app.init();