// No imports needed - using global objects from included scripts
// window.SharePointService (from sharepointService-global.js)
// window.LinkInfo (from linkInfo-global.js)
// window.appConfiguratie (from configLijst.js)
// window.ConfigHelper (from configHelper.js)
// h = React.createElement (from React CDN, declared in HTML)

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

        // Data voor team grouping
        this.allTeams = [];
        this.allMedewerkers = [];
        this.teamMappings = new Map(); // MedewerkerID -> Team info
        this.teamleiderMappings = new Map(); // TeamID -> Teamleider info

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

        // Special handling for org\busselw
        this.isSuperUser = false; // org\busselw can see all data and emulate other team leaders
        this.emulatingTeamLeader = null; // When emulating, this holds the teamleader info
        this.allTeamLeaders = []; // All available team leaders for emulation
    }

    async init() {
        console.log('BehandelcentrumApp initializing...');
        
        // Initialize with global services
        // Check if SharePointService is available
        if (!window.SharePointService) {
            console.error('SharePointService is not available');
            return;
        }
        console.log('SharePointService is available');

        // Get current user information
        try {
            console.log('Getting current user...');
            this.currentUser = await window.SharePointService.getCurrentUser();
            console.log('Current user:', this.currentUser);
            
            await this.loadUserTeamInfo();
            await this.loadUserSettings();
            
            if (this.isSuperUser) {
                await this.loadAllTeamLeaders();
            }
        } catch (error) {
            console.error('Error getting current user:', error);
        }

        // Set current year in footer
        const yearElement = document.getElementById('huidig-jaar');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
        
        // Update user display in header
        const userElement = document.getElementById('huidige-gebruiker');
        if (userElement && this.currentUser) {
            userElement.textContent = this.currentUser.Title || this.currentUser.LoginName || 'Onbekende gebruiker';
        }

        // Load data and render
        console.log('Loading data and rendering...');
        await this.loadData();
        this.render();
        console.log('BehandelcentrumApp initialization complete');
    }

    async loadData() {
        try {
            console.log('Starting data load...');
            
            // Load teams and medewerkers data first for mapping
            console.log('Loading teams and medewerkers for mapping...');
            this.allTeams = await window.SharePointService.fetchSharePointList('Teams');
            this.allMedewerkers = await window.SharePointService.fetchSharePointList('Medewerkers');
            console.log('Teams loaded:', this.allTeams.length, 'items');
            console.log('Medewerkers loaded:', this.allMedewerkers.length, 'items');
            
            // Build mappings
            this.buildTeamMappings();
            
            // Load all data from SharePoint lists
            const verlofData = await window.SharePointService.fetchSharePointList('Verlof');
            console.log('Verlof data loaded:', verlofData.length, 'items');
            
            const compensatieData = await window.SharePointService.fetchSharePointList('CompensatieUren');
            console.log('Compensatie data loaded:', compensatieData.length, 'items');
            
            const ziekteData = await window.SharePointService.fetchSharePointList('Verlof');
            const zittingsvrijData = await window.SharePointService.fetchSharePointList('IncidenteelZittingVrij');
            console.log('Zittingsvrij data loaded:', zittingsvrijData.length, 'items');

            // Separate data into lopend vs archief based on status
            this.verlofLopend = verlofData.filter(item => this.isInBehandeling(item.Status));
            this.verlofArchief = verlofData.filter(item => !this.isInBehandeling(item.Status));
            
            this.compensatieLopend = compensatieData.filter(item => this.isInBehandeling(item.Status));
            this.compensatieArchief = compensatieData.filter(item => !this.isInBehandeling(item.Status));
            
            this.ziekteLopend = ziekteData.filter(item => this.isInBehandeling(item.Status) && item.Reden && item.Reden.toLowerCase().includes('ziek'));
            this.ziekteArchief = ziekteData.filter(item => !this.isInBehandeling(item.Status) && item.Reden && item.Reden.toLowerCase().includes('ziek'));
            
            this.zittingsvrijLopend = zittingsvrijData.filter(item => this.isInBehandeling(item.Status));
            this.zittingsvrijArchief = zittingsvrijData.filter(item => !this.isInBehandeling(item.Status));

            console.log('Data separated:', {
                verlofLopend: this.verlofLopend.length,
                verlofArchief: this.verlofArchief.length,
                compensatieLopend: this.compensatieLopend.length,
                compensatieArchief: this.compensatieArchief.length
            });
            
            // Debug: log sample data to see structure
            if (this.verlofLopend.length > 0) {
                console.log('Sample verlof lopend item:', this.verlofLopend[0]);
            }
            if (this.compensatieLopend.length > 0) {
                console.log('Sample compensatie lopend item:', this.compensatieLopend[0]);
            }
            
            console.log('Data loaded successfully');
        } catch (error) {
            console.error('Error loading data:', error);
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
        console.log('Rendering BehandelcentrumApp...');
        console.log('Current state:', {
            viewMode: this.viewMode,
            selectedType: this.selectedType,
            verlofLopend: this.verlofLopend.length,
            compensatieLopend: this.compensatieLopend.length
        });
        
        const app = h('div', { className: 'behandelcentrum-app' },
            this.renderTabs(),
            this.renderTabContent(),
            (this.isApproveModalOpen || this.isRejectModalOpen || this.isReactieModalOpen)
                ? this.renderModal()
                : null
        );

        console.log('Rendering to DOM...');
        ReactDOM.render(app, this.root);

        // Load teamleider data after React has rendered
        setTimeout(() => this.loadTeamleiderData(), 0);
        
        // Setup header emulation dropdown for super user
        if (this.isSuperUser) {
            this.setupHeaderEmulationDropdown();
        }
        console.log('Render complete');
    }

    renderTabs() {
        return h('div', { className: 'navigation-container' },
            this.isTeamLeader && h('div', { className: 'team-filter-container' },
                h('div', { className: 'filter-toggle' },
                    h('label', { className: 'toggle-label' },
                        h('span', { className: 'toggle-text' }, 'Alleen eigen team:'),
                        h('div', { className: 'toggle-switch' },
                            h('input', {
                                type: 'checkbox',
                                id: 'team-filter-toggle',
                                checked: this.showOnlyOwnTeam,
                                onChange: (e) => this.handleTeamFilterToggle(e)
                            }),
                            h('span', { className: 'toggle-slider' })
                        )
                    )
                )
            ),
            h('div', { className: 'main-toggle' },
                h('button', {
                    className: `toggle-btn ${this.viewMode === 'lopend' ? 'active' : ''}`,
                    onClick: () => this.handleModeToggle({ target: { dataset: { mode: 'lopend' } } })
                },
                    h('i', { className: 'fas fa-clock' }),
                    'Lopende aanvragen'
                ),
                h('button', {
                    className: `toggle-btn ${this.viewMode === 'historisch' ? 'active' : ''}`,
                    onClick: () => this.handleModeToggle({ target: { dataset: { mode: 'historisch' } } })
                },
                    h('i', { className: 'fas fa-archive' }),
                    'Historische aanvragen'
                )
            ),
            h('div', { className: 'type-selection' },
                h('div', { className: 'type-buttons' },
                    h('button', {
                        className: `type-btn ${this.selectedType === 'verlof' ? 'active' : ''}`,
                        onClick: () => this.handleTypeSelection({ target: { dataset: { type: 'verlof' } } })
                    },
                        'Verlof',
                        h('span', { className: 'count-badge' },
                            this.viewMode === 'lopend' ? this.verlofLopend.length : this.verlofArchief.length
                        )
                    ),
                    h('button', {
                        className: `type-btn ${this.selectedType === 'compensatie' ? 'active' : ''}`,
                        onClick: () => this.handleTypeSelection({ target: { dataset: { type: 'compensatie' } } })
                    },
                        'Compensatie',
                        h('span', { className: 'count-badge' },
                            this.viewMode === 'lopend' ? this.compensatieLopend.length : this.compensatieArchief.length
                        )
                    ),
                    this.viewMode === 'historisch' && h('button', {
                        className: `type-btn ${this.selectedType === 'ziekte' ? 'active' : ''}`,
                        onClick: () => this.handleTypeSelection({ target: { dataset: { type: 'ziekte' } } })
                    },
                        'Ziekte',
                        h('span', { className: 'count-badge' }, this.ziekteArchief.length)
                    ),
                    this.viewMode === 'historisch' && h('button', {
                        className: `type-btn ${this.selectedType === 'zittingsvrij' ? 'active' : ''}`,
                        onClick: () => this.handleTypeSelection({ target: { dataset: { type: 'zittingsvrij' } } })
                    },
                        'Zittingsvrij',
                        h('span', { className: 'count-badge' }, this.zittingsvrijArchief.length)
                    )
                )
            )
        );
    }

    renderTabContent() {
        console.log('=== renderTabContent called ===');
        console.log('Current state:', {
            viewMode: this.viewMode,
            selectedType: this.selectedType,
            verlofLopend: this.verlofLopend.length,
            compensatieLopend: this.compensatieLopend.length
        });
        
        const getTabData = () => {
            if (this.viewMode === 'lopend') {
                switch (this.selectedType) {
                    case 'verlof': 
                        console.log('Returning verlof lopend data:', this.verlofLopend.length, 'items');
                        return { data: this.verlofLopend, type: 'verlof', actionable: true };
                    case 'compensatie': 
                        console.log('Returning compensatie lopend data:', this.compensatieLopend.length, 'items');
                        return { data: this.compensatieLopend, type: 'compensatie', actionable: true };
                    default: 
                        console.log('Default case - returning empty data');
                        return { data: [], type: this.selectedType, actionable: true };
                }
            } else {
                switch (this.selectedType) {
                    case 'verlof': return { data: this.verlofArchief, type: 'verlof', actionable: false };
                    case 'compensatie': return { data: this.compensatieArchief, type: 'compensatie', actionable: false };
                    case 'ziekte': return { data: this.ziekteArchief, type: 'ziekte', actionable: false };
                    case 'zittingsvrij': return { data: this.zittingsvrijArchief, type: 'zittingsvrij', actionable: false };
                    default: return { data: [], type: this.selectedType, actionable: false };
                }
            }
        };

        const { data, type, actionable } = getTabData();
        console.log('Tab data:', { dataLength: data.length, type, actionable });

        // Check if we should show grouped tables or simple table
        const shouldShowGrouped = this.shouldShowGroupedView() && data.length > 0;
        console.log('Should show grouped:', shouldShowGrouped, 'showOnlyOwnTeam:', this.showOnlyOwnTeam);

        if (shouldShowGrouped) {
            console.log('Rendering grouped tables with', data.length, 'items');
            return this.renderGroupedTables(data, type, actionable);
        } else {
            console.log('Rendering simple table with', data.length, 'items');
            return this.renderSimpleTable(data, type, actionable);
        }
    }

    renderSimpleTable(data, type, actionable) {
        console.log('=== renderSimpleTable called ===');
        console.log('Data:', data?.length || 0, 'items, type:', type, 'actionable:', actionable);
        
        // Apply filtering when in simple table mode
        const filteredData = this.filterDataForCurrentUser(data);
        console.log('Filtered data for simple table:', { originalLength: data?.length || 0, filteredLength: filteredData.length });
        
        if (!filteredData || filteredData.length === 0) {
            console.log('Rendering empty state');
            return h('div', { className: 'empty-state' },
                h('div', { className: 'empty-icon' }, actionable ? '📋' : '📁'),
                h('h3', null, actionable ? 'Geen lopende aanvragen' : 'Geen gegevens'),
                h('p', null, actionable ?
                    'Er zijn momenteel geen aanvragen die wachten op behandeling.' :
                    'Er zijn geen gegevens beschikbaar voor deze categorie.'
                )
            );
        }

        const columns = this.getColumnsForType(type, actionable);
        console.log('Table columns:', columns);
        console.log('First data item:', filteredData[0]);

        return h('div', { className: 'table-container' },
            h('table', { className: 'data-table' },
                h('thead', null,
                    h('tr', null,
                        ...columns.map(col =>
                            h('th', { 'data-column': col }, this.getColumnDisplayName(col))
                        )
                    )
                ),
                h('tbody', null,
                    ...filteredData.map(item =>
                        this.renderTableRow(item, columns, actionable)
                    )
                )
            )
        );
    }

    renderGroupedTables(data, type, actionable) {
        // Filter data based on current user permissions
        const filteredData = this.filterDataForCurrentUser(data);
        
        // Group the filtered data by team
        const groupedData = this.groupDataByTeam(filteredData);

        if (groupedData.length === 0) {
            return h('div', { className: 'no-data' },
                h('p', null, `Geen ${type}aanvragen gevonden.`)
            );
        }

        return h('div', { className: 'grouped-tables' },
            ...groupedData.map(teamGroup => 
                this.renderTeamGroup(teamGroup, type, actionable)
            )
        );
    }

    renderTeamGroup(teamGroup, type, actionable) {
        const { teamName, teamInfo, requests } = teamGroup;
        const columns = this.getColumnsForType(type, actionable);

        return h('div', { 
            className: 'team-group',
            style: { borderLeft: `4px solid ${teamInfo.teamKleur}` }
        },
            h('div', { className: 'team-header' },
                h('h3', { className: 'team-name' },
                    h('span', { className: 'team-indicator' }, '👥'),
                    teamName,
                    h('span', { className: 'request-count' }, `(${requests.length})`)
                ),
                h('div', { className: 'team-leader' },
                    h('span', { className: 'leader-label' }, 'Teamleider:'),
                    h('span', { className: 'leader-name' }, teamInfo.teamleider || 'Onbekend')
                )
            ),
            h('div', { className: 'team-table-container' },
                h('table', { className: 'data-table team-table' },
                    h('thead', null,
                        h('tr', null,
                            ...columns.map(col =>
                                h('th', { 'data-column': col }, this.getColumnDisplayName(col))
                            )
                        )
                    ),
                    h('tbody', null,
                        ...requests.map(item =>
                            this.renderTableRow(item, columns, actionable)
                        )
                    )
                )
            )
        );
    }

    getColumnsForType(type, includeActions = false) {
        const baseColumns = {
            'verlof': ['Medewerker', 'Omschrijving', 'StartDatum', 'EindDatum', 'AanvraagTijdstip'],
            'compensatie': ['Medewerker', 'Omschrijving', 'StartCompensatieUren', 'EindeCompensatieUren', 'UrenTotaal', 'AanvraagTijdstip'],
            'zittingsvrij': ['Gebruikersnaam', 'Opmerking', 'ZittingsVrijeDagTijdStart', 'ZittingsVrijeDagTijdEind', 'AanvraagTijdstip']
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
            'AanvraagTijdstip': 'Aangemaakt op',
            'StartDatum': 'Vanaf',
            'EindDatum': 'Tot',
            'StartCompensatieUren': 'Vanaf',
            'EindeCompensatieUren': 'Tot',
            'ZittingsVrijeDagTijdStart': 'Vanaf',
            'ZittingsVrijeDagTijdEind': 'Tot',
            'UrenTotaal': 'Uren',
            'Omschrijving': 'Omschrijving',
            'Opmerking': 'Opmerking',
            'Acties': 'Acties',
            'Behandelaar Reactie': 'Behandelaar Reactie'
        };
        return displayNames[column] || column;
    }

    renderTableRow(item, columns, actionable) {
        return h('tr', { className: actionable ? 'actionable-row' : 'archive-row' },
            ...columns.map(col => {
                if (col === 'Acties' && actionable) {
                    return h('td', { className: 'action-cell', 'data-column': col },
                        h('div', { className: 'action-buttons' },
                            h('button', {
                                className: 'btn btn-sm btn-approve',
                                onClick: () => this.handleApprove({
                                    target: {
                                        dataset: {
                                            itemId: item.ID || item.Id,
                                            itemType: this.getListTypeForActiveTab()
                                        }
                                    }
                                }),
                                title: 'Aanvraag goedkeuren'
                            }, '✓ Goedkeuren'),
                            h('button', {
                                className: 'btn btn-sm btn-reject',
                                onClick: () => this.handleReject({
                                    target: {
                                        dataset: {
                                            itemId: item.ID || item.Id,
                                            itemType: this.getListTypeForActiveTab()
                                        }
                                    }
                                }),
                                title: 'Aanvraag afwijzen'
                            }, '✗ Afwijzen')
                        )
                    );
                } else if (col === 'Behandelaar Reactie') {
                    return h('td', { className: 'reactie-cell', 'data-column': col },
                        h('button', {
                            className: 'btn btn-sm btn-comment',
                            onClick: () => {
                                this.selectedItem = item;
                                this.modalAction = 'comment';
                                this.isReactieModalOpen = true;
                                this.render();
                            },
                            title: 'Reactie toevoegen/bewerken'
                        }, '💬 Reactie')
                    );
                } else {
                    return h('td', { 'data-column': col }, this.formatCellValue(item[col], col, item));
                }
            })
        );
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
                modalSubtitle = `${medewerkerNaam} - ${this.getActiveTypeTitle()}`;
                actionButtonText = '✓ Goedkeuren';
                actionButtonClass = 'btn-approve-confirm';
                actionButtonIcon = 'fas fa-check';
                break;
            case 'reject':
                modalTitle = 'Aanvraag Afwijzen';
                modalSubtitle = `${medewerkerNaam} - ${this.getActiveTypeTitle()}`;
                actionButtonText = '✗ Afwijzen';
                actionButtonClass = 'btn-reject-confirm';
                actionButtonIcon = 'fas fa-times';
                break;
            case 'comment':
            default:
                modalTitle = 'Reactie Toevoegen';
                modalSubtitle = `${medewerkerNaam} - ${this.getActiveTypeTitle()}`;
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

        return h('div', {
            className: 'modal-overlay', onClick: (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.closeModal();
                }
            }
        },
            h('div', { className: `modal-content ${isActionModal ? 'action-modal' : 'reactie-modal'}` },
                h('div', { className: 'modal-header' },
                    h('h3', null, modalTitle),
                    h('div', { className: 'modal-subtitle' }, modalSubtitle),
                    h('button', {
                        className: 'modal-close',
                        onClick: () => this.closeModal()
                    }, '×')
                ),
                h('div', { className: 'modal-body' },
                    h('div', { className: 'aanvraag-details' },
                        h('h4', null, 'Aanvraag Details:'),
                        this.renderAanvraagDetails(item)
                    ),
                    // Show employee comment prominently for action modals
                    isActionModal && this.renderEmployeeComment(item),
                    isActionModal && h('div', { className: 'action-warning' },
                        h('div', { className: 'warning-icon' },
                            h('i', { className: this.modalAction === 'approve' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle' })
                        ),
                        h('p', null,
                            this.modalAction === 'approve'
                                ? 'U staat op het punt deze aanvraag goed te keuren. Deze actie kan niet ongedaan worden gemaakt.'
                                : 'U staat op het punt deze aanvraag af te wijzen. Deze actie kan niet ongedaan worden gemaakt.'
                        )
                    ),
                    h('div', { className: 'reactie-form' },
                        h('label', { htmlFor: 'reactie-text' },
                            isActionModal
                                ? `Optionele ${this.modalAction === 'approve' ? 'goedkeurings' : 'afwijzings'}opmerking:`
                                : 'Uw reactie:'
                        ),
                        h('textarea', {
                            id: 'reactie-text',
                            className: 'reactie-textarea',
                            placeholder: isActionModal
                                ? `Optionele opmerking bij ${this.modalAction === 'approve' ? 'goedkeuring' : 'afwijzing'}...`
                                : 'Typ hier uw reactie voor de medewerker...',
                            defaultValue: currentReactie,
                            rows: isActionModal ? 3 : 4
                        })
                    )
                ),
                h('div', { className: 'modal-footer' },
                    h('button', {
                        className: 'btn btn-secondary',
                        onClick: () => this.closeModal()
                    }, 'Annuleren'),
                    h('button', {
                        className: `btn ${actionButtonClass}`,
                        onClick: () => isActionModal ? this.confirmAction() : this.saveReactie()
                    },
                        h('i', { className: actionButtonIcon }),
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
    }

    renderAanvraagDetails(item) {
        const details = [];

        if (item.StartDatum) {
            details.push(h('div', { className: 'detail-item' },
                h('strong', null, 'Start: '),
                new Date(item.StartDatum).toLocaleDateString('nl-NL')
            ));
        }

        if (item.EindDatum) {
            details.push(h('div', { className: 'detail-item' },
                h('strong', null, 'Eind: '),
                new Date(item.EindDatum).toLocaleDateString('nl-NL')
            ));
        }

        if (item.StartCompensatieUren) {
            details.push(h('div', { className: 'detail-item' },
                h('strong', null, 'Start: '),
                new Date(item.StartCompensatieUren).toLocaleDateString('nl-NL')
            ));
        }

        if (item.UrenTotaal) {
            details.push(h('div', { className: 'detail-item' },
                h('strong', null, 'Uren: '),
                `${item.UrenTotaal > 0 ? '+' : ''}${item.UrenTotaal} uur`
            ));
        }

        if (item.Reden) {
            details.push(h('div', { className: 'detail-item' },
                h('strong', null, 'Reden: '),
                item.Reden
            ));
        }

        if (item.Omschrijving) {
            details.push(h('div', { className: 'detail-item detail-item-employee-comment' },
                h('strong', null, 'Medewerker opmerking: '),
                h('div', { className: 'employee-comment' }, item.Omschrijving)
            ));
        }

        if (item.Opmerking && !item.Omschrijving) {
            details.push(h('div', { className: 'detail-item detail-item-employee-comment' },
                h('strong', null, 'Opmerking: '),
                h('div', { className: 'employee-comment' }, item.Opmerking)
            ));
        }

        return h('div', { className: 'details-grid' }, ...details);
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
                    reactieField = 'ReactieBehandelaar';
                    break;
                case 'Verlof':
                    reactieField = 'OpmerkingBehandelaar';
                    break;
                case 'IncidenteelZittingVrij':
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
            this.closeModal();

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
        if (!value) return '-';
        
        // Format dates
        if (column === 'AanvraagTijdstip') {
            try {
                return new Date(value).toLocaleString('nl-NL');
            } catch (e) {
                return value;
            }
        } else if (column === 'StartDatum' || column === 'EindDatum' || column === 'StartCompensatieUren' || column === 'EindeCompensatieUren' || column === 'ZittingsVrijeDagTijdStart' || column === 'ZittingsVrijeDagTijdEind') {
            try {
                return new Date(value).toLocaleDateString('nl-NL');
            } catch (e) {
                return value;
            }
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

    async loadTeamleiderData() {
        // This method is called after render to load any additional team leader data
        // Main team/teamleider loading is now done in buildTeamMappings() during loadData()
        console.log('Team leader data loading (post-render)...');
        
        if (this.allTeams.length > 0 && this.allMedewerkers.length > 0) {
            console.log('Team mappings already built:', {
                teamMappings: this.teamMappings.size,
                teamleiderMappings: this.teamleiderMappings.size
            });
        } else {
            console.log('Team data not yet loaded, will be available after data refresh');
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
            // Check if this is the super user - check LoginName for org\busselw
            this.isSuperUser = this.currentUser.LoginName && 
                (this.currentUser.LoginName.toLowerCase().includes('org\\busselw') || 
                 this.currentUser.LoginName.toLowerCase().includes('busselw'));

            // Load user settings from gebruikersInstellingen list
            const userSettings = await window.SharePointService.fetchSharePointList('gebruikersInstellingen');

            // Find settings for current user (match by Title/Name)
            this.userSettings = userSettings.find(setting =>
                setting.Title && setting.Title.toLowerCase() === this.currentUser.Title.toLowerCase()
            );

            if (this.userSettings) {
                this.showOnlyOwnTeam = this.userSettings.BHCAlleenEigen || false;
            } else {
                this.showOnlyOwnTeam = false;
            }

            // If super user, always start with all data visible (but can emulate)
            if (this.isSuperUser) {
                this.showOnlyOwnTeam = false;
            }

            console.log('User settings loaded:', {
                showOnlyOwnTeam: this.showOnlyOwnTeam,
                userSettings: this.userSettings,
                isSuperUser: this.isSuperUser
            });

        } catch (error) {
            console.warn('Could not load user settings:', error);
            this.showOnlyOwnTeam = false;
        }
    }

    async loadAllTeamLeaders() {
        try {
            // Load all teams to get team leaders
            const teams = await window.SharePointService.fetchSharePointList('Teams');
            const medewerkers = await window.SharePointService.fetchSharePointList('Medewerkers');

            this.allTeamLeaders = [];

            for (const team of teams) {
                if (team.TeamleiderId) {
                    const medewerker = medewerkers.find(m => 
                        m.MedewerkerID && m.MedewerkerID.toLowerCase() === team.TeamleiderId.toLowerCase()
                    );
                    
                    if (medewerker) {
                        this.allTeamLeaders.push({
                            username: team.TeamleiderId,
                            name: medewerker.Naam || team.TeamleiderId,
                            teams: [team.Naam]
                        });
                    }
                }
            }

            // Remove duplicates (same person leading multiple teams)
            this.allTeamLeaders = this.allTeamLeaders.filter((leader, index, self) =>
                index === self.findIndex(l => l.username === leader.username)
            );

            console.log('All team leaders loaded:', this.allTeamLeaders);

        } catch (error) {
            console.error('Error loading team leaders for emulation:', error);
        }
    }

    buildTeamMappings() {
        console.log('Building team mappings...');
        
        // Clear existing mappings
        this.teamMappings.clear();
        this.teamleiderMappings.clear();

        // Build team mappings: MedewerkerID -> Team info
        this.allMedewerkers.forEach(medewerker => {
            if (medewerker.Username && medewerker.Team) {
                // Find the team details
                const teamDetails = this.allTeams.find(team => 
                    team.Naam && team.Naam.toLowerCase() === medewerker.Team.toLowerCase()
                );
                
                if (teamDetails) {
                    this.teamMappings.set(medewerker.Username, {
                        medewerker: medewerker,
                        team: teamDetails,
                        teamNaam: teamDetails.Naam,
                        teamleider: teamDetails.Teamleider,
                        teamleiderId: teamDetails.TeamleiderId
                    });
                }
            }
        });

        // Build teamleider mappings: TeamID -> Teamleider info
        this.allTeams.forEach(team => {
            if (team.ID && team.Teamleider) {
                this.teamleiderMappings.set(team.ID, {
                    teamId: team.ID,
                    teamNaam: team.Naam,
                    teamleider: team.Teamleider,
                    teamleiderId: team.TeamleiderId,
                    teamKleur: team.Kleur
                });
            }
        });

        console.log(`Team mappings built: ${this.teamMappings.size} employee mappings, ${this.teamleiderMappings.size} team mappings`);
        
        // Run validation in debug mode
        this.validateTeamMappings();
    }

    getTeamInfoForRequest(request) {
        // Try different fields that might contain the employee identifier
        const employeeId = request.MedewerkerID || request.Medewerker || request.Gebruikersnaam;
        
        if (!employeeId) {
            return {
                teamNaam: 'Onbekend team',
                teamleider: 'Onbekende teamleider',
                teamleiderId: null,
                teamKleur: '#cccccc'
            };
        }

        // Look up in team mappings
        const mapping = this.teamMappings.get(employeeId);
        if (mapping) {
            return {
                teamNaam: mapping.teamNaam,
                teamleider: mapping.teamleider,
                teamleiderId: mapping.teamleiderId,
                teamKleur: mapping.team.Kleur || '#cccccc'
            };
        }

        // Fallback: try to find by partial match
        for (const [key, mapping] of this.teamMappings.entries()) {
            if (key.toLowerCase().includes(employeeId.toLowerCase()) || 
                employeeId.toLowerCase().includes(key.toLowerCase())) {
                return {
                    teamNaam: mapping.teamNaam,
                    teamleider: mapping.teamleider,
                    teamleiderId: mapping.teamleiderId,
                    teamKleur: mapping.team.Kleur || '#cccccc'
                };
            }
        }

        return {
            teamNaam: 'Onbekend team',
            teamleider: 'Onbekende teamleider',
            teamleiderId: null,
            teamKleur: '#cccccc'
        };
    }

    groupDataByTeam(data) {
        const grouped = new Map();

        data.forEach(item => {
            const teamInfo = this.getTeamInfoForRequest(item);
            const teamKey = teamInfo.teamNaam;

            if (!grouped.has(teamKey)) {
                grouped.set(teamKey, {
                    teamInfo: teamInfo,
                    requests: []
                });
            }

            grouped.get(teamKey).requests.push({
                ...item,
                _teamInfo: teamInfo
            });
        });

        // Convert to array and sort by team name
        return Array.from(grouped.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([teamName, teamData]) => ({
                teamName,
                ...teamData
            }));
    }

    shouldShowGroupedView() {
        // Show grouped view when not filtering by own team, or when super user is not emulating
        return !this.showOnlyOwnTeam && (!this.isSuperUser || !this.emulatingTeamLeader);
    }

    filterDataForCurrentUser(data) {
        if (this.isSuperUser && this.emulatingTeamLeader) {
            // Filter by emulated team leader's teams
            return data.filter(item => {
                const teamInfo = this.getTeamInfoForRequest(item);
                return teamInfo.teamleiderId === this.emulatingTeamLeader.teamleiderId;
            });
        } else if (this.showOnlyOwnTeam && this.isTeamLeader) {
            // Filter by current user's teams
            const userTeamNames = this.currentUserTeams.map(t => t.Naam.toLowerCase());
            return data.filter(item => {
                const teamInfo = this.getTeamInfoForRequest(item);
                return userTeamNames.includes(teamInfo.teamNaam.toLowerCase());
            });
        }
        
        return data; // Show all data
    }

    async confirmAction() {
        if (!this.selectedItem || !this.modalAction) return;

        try {
            const itemId = this.selectedItem.ID || this.selectedItem.Id;
            const listType = this.getListTypeForActiveTab();
            const textarea = document.getElementById('reactie-text');
            const reactie = textarea ? textarea.value.trim() : '';

            // Determine the correct fields based on the action and list type
            const updateData = {};

            if (this.modalAction === 'approve') {
                updateData.Status = 'Goedgekeurd';
            } else if (this.modalAction === 'reject') {
                updateData.Status = 'Afgekeurd';
            }

            // Add handler comment if provided
            if (reactie) {
                let reactieField;
                switch (listType) {
                    case 'CompensatieUren':
                        reactieField = 'ReactieBehandelaar';
                        break;
                    case 'Verlof':
                        reactieField = 'OpmerkingBehandelaar';
                        break;
                    case 'IncidenteelZittingVrij':
                        reactieField = 'Opmerking';
                        break;
                    default:
                        reactieField = 'ReactieBehandelaar';
                }
                updateData[reactieField] = reactie;
            }

            await window.SharePointService.updateListItem(listType, itemId, updateData);

            // Show success notification
            this.showNotification(
                `Aanvraag ${this.modalAction === 'approve' ? 'goedgekeurd' : 'afgekeurd'}.`,
                'success'
            );

            // Reload data and close modal
            await this.loadData();
            this.closeModal();

        } catch (error) {
            console.error('Error confirming action:', error);
            this.showNotification('Er is een fout opgetreden.', 'error');
        }
    }

    findItemById(itemId) {
        // Search in all current data arrays
        const allItems = [
            ...this.verlofLopend,
            ...this.verlofArchief,
            ...this.compensatieLopend,
            ...this.compensatieArchief,
            ...this.ziekteLopend,
            ...this.ziekteArchief,
            ...this.zittingsvrijLopend,
            ...this.zittingsvrijArchief
        ];

        return allItems.find(item => (item.ID || item.Id) == itemId);
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notificationContainer = document.createElement('div');
        notificationContainer.className = `notification notification-${type}`;
        notificationContainer.textContent = message;
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        if (type === 'success') {
            notificationContainer.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notificationContainer.style.backgroundColor = '#ef4444';
        } else {
            notificationContainer.style.backgroundColor = '#3b82f6';
        }

        document.body.appendChild(notificationContainer);

        // Animate in
        setTimeout(() => {
            notificationContainer.style.opacity = '1';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notificationContainer.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notificationContainer);
            }, 300);
        }, 3000);
    }

    setupHeaderEmulationDropdown() {
        // Implementation for header emulation dropdown for super users
        // This would be called if needed
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

    debugTeamMapping(request) {
        const employeeId = request.MedewerkerID || request.Medewerker || request.Gebruikersnaam;
        console.log('Debug team mapping for request:', {
            requestId: request.ID || request.Id,
            requestType: this.selectedType,
            employeeId: employeeId,
            availableFields: Object.keys(request),
            teamMapping: this.teamMappings.get(employeeId),
            teamMappingsSize: this.teamMappings.size
        });
        
        // Also log first few team mappings for debugging
        if (this.teamMappings.size > 0) {
            const sampleMappings = Array.from(this.teamMappings.entries()).slice(0, 3);
            console.log('Sample team mappings:', sampleMappings);
        }
        
        return this.getTeamInfoForRequest(request);
    }

    validateTeamMappings() {
        console.log('=== Team Mapping Validation ===');
        console.log('Total teams loaded:', this.allTeams.length);
        console.log('Total employees loaded:', this.allMedewerkers.length);
        console.log('Team mappings created:', this.teamMappings.size);
        console.log('Teamleider mappings created:', this.teamleiderMappings.size);

        // Log some sample data for debugging
        if (this.allTeams.length > 0) {
            console.log('Sample team:', this.allTeams[0]);
        }
        
        if (this.allMedewerkers.length > 0) {
            console.log('Sample employee:', this.allMedewerkers[0]);
        }

        // Check for employees without teams
        const employeesWithoutTeams = this.allMedewerkers.filter(emp => 
            emp.Username && (!emp.Team || emp.Team === '')
        );
        
        if (employeesWithoutTeams.length > 0) {
            console.warn(`${employeesWithoutTeams.length} employees found without team assignment:`, 
                employeesWithoutTeams.map(emp => ({ Username: emp.Username, Naam: emp.Naam }))
            );
        }

        // Check for teams without leaders
        const teamsWithoutLeaders = this.allTeams.filter(team => 
            team.Naam && (!team.TeamleiderId || team.TeamleiderId === '')
        );
        
        if (teamsWithoutLeaders.length > 0) {
            console.warn(`${teamsWithoutLeaders.length} teams found without teamleader:`, 
                teamsWithoutLeaders.map(team => ({ Naam: team.Naam, Teamleider: team.Teamleider }))
            );
        }

        console.log('=== End Team Mapping Validation ===');
    }

    renderEmployeeComment(item) {
        // Get the employee's comment from the appropriate field
        let employeeComment = '';
        let commentLabel = 'Medewerker opmerking:';

        if (this.selectedType === 'compensatie') {
            employeeComment = item.Omschrijving || '';
        } else if (this.selectedType === 'verlof' || this.selectedType === 'ziekte') {
            employeeComment = item.Omschrijving || '';
        } else if (this.selectedType === 'zittingsvrij') {
            employeeComment = item.Opmerking || '';
        }

        // Only render if there's an employee comment
        if (!employeeComment || employeeComment.trim() === '') {
            return null;
        }

        return h('div', { className: 'employee-comment-section' },
            h('h4', { className: 'employee-comment-title' },
                h('i', { className: 'fas fa-user-comment' }),
                ' ' + commentLabel
            ),
            h('div', { className: 'employee-comment-content' },
                h('blockquote', { className: 'employee-comment-text' },
                    employeeComment
                )
            )
        );
    }
}

// Create a fallback appConfiguratie if it doesn't exist
    if (typeof window.appConfiguratie === "undefined") {
        console.warn("Creating fallback appConfiguratie object in app.js because it was not found");
        window.appConfiguratie = {
            instellingen: {
                debounceTimer: 300,
                siteUrl: ""
            }
        };
    }

    const app = new BehandelcentrumApp();
    app.init();
