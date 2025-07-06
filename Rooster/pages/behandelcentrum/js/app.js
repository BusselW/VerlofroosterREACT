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
        const app = h('div', { className: 'behandelcentrum-app' },
            this.renderTabs(),
            this.renderTabContent(),

            // Add modal if one should be shown
            (this.isApproveModalOpen || this.isRejectModalOpen || this.isReactieModalOpen)
                ? this.renderModal()
                : null
        );

        ReactDOM.render(app, this.root);

        // Load teamleider data after React has rendered
        setTimeout(() => this.loadTeamleiderData(), 0);
    }
    renderTabs() {
        return h('div', { className: 'navigation-container' },
            // Team filter toggle (only show for team leaders)
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

            // Super user emulation controls
            this.isSuperUser && h('div', { className: 'emulation-container' },
                h('div', { className: 'emulation-controls' },
                    h('label', { className: 'emulation-label' },
                        h('span', { className: 'emulation-text' }, 'Bekijk als teamleider:'),
                        h('select', {
                            className: 'emulation-select',
                            value: this.emulatingTeamLeader ? this.emulatingTeamLeader.username : '',
                            onChange: (e) => this.handleEmulationChange(e)
                        },
                            h('option', { value: '' }, 'Alle teams (standaard)'),
                            this.allTeamLeaders.map(leader =>
                                h('option', {
                                    key: leader.username,
                                    value: leader.username
                                }, `${leader.naam} (${leader.teamNaam})`)
                            )
                        )
                    )
                )
            ),

            // Main toggle between Lopende and Historische aanvragen
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

            // Type selection buttons
            h('div', { className: 'type-selection' },
                h('div', { className: 'type-buttons' },
                    // Verlof button
                    h('button', {
                        className: `type-btn ${this.selectedType === 'verlof' ? 'active' : ''}`,
                        onClick: () => this.handleTypeSelection({ target: { dataset: { type: 'verlof' } } })
                    },
                        'Verlof',
                        h('span', { className: 'count-badge' },
                            this.viewMode === 'lopend' ? this.verlofLopend.length : this.verlofArchief.length
                        )
                    ),

                    // Compensatie button
                    h('button', {
                        className: `type-btn ${this.selectedType === 'compensatie' ? 'active' : ''}`,
                        onClick: () => this.handleTypeSelection({ target: { dataset: { type: 'compensatie' } } })
                    },
                        'Compensatie',
                        h('span', { className: 'count-badge' },
                            this.viewMode === 'lopend' ? this.compensatieLopend.length : this.compensatieArchief.length
                        )
                    ),

                    // Show Ziekte and Zittingsvrij only in historical mode
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



    async groupDataByTeam(data) {
        if (!data || data.length === 0) return {};

        try {
            // Load necessary data for grouping
            const [employees, teams] = await Promise.all([
                window.SharePointService.fetchSharePointList('Medewerkers'),
                window.SharePointService.fetchSharePointList('Teams')
            ]);

            // Create maps for quick lookup and store for filtering
            this.employeeMap = {};
            employees.forEach(emp => {
                if (emp.Username) {
                    this.employeeMap[emp.Username.toLowerCase()] = {
                        team: emp.Team,
                        name: emp.Naam || emp.Title
                    };
                }
            });

            const teamMap = {};
            teams.forEach(team => {
                if (team.Naam) {
                    teamMap[team.Naam] = {
                        teamleider: team.Teamleider,
                        teamleiderId: team.TeamleiderId
                    };
                }
            });

            // Apply team filtering
            const filteredData = this.filterDataByTeam(data);

            // Group filtered data by team
            const grouped = {};

            filteredData.forEach(item => {
                const username = (item.MedewerkerID || item.Medewerker || item.Gebruikersnaam || '').toLowerCase();
                const employeeInfo = this.employeeMap[username];

                if (employeeInfo && employeeInfo.team) {
                    const teamName = employeeInfo.team;
                    const teamInfo = teamMap[teamName];

                    if (!grouped[teamName]) {
                        grouped[teamName] = {
                            teamName: teamName,
                            teamleider: teamInfo ? teamInfo.teamleider : 'Onbekend',
                            items: []
                        };
                    }

                    grouped[teamName].items.push(item);
                } else {
                    // Items without team info
                    if (!grouped['Onbekend Team']) {
                        grouped['Onbekend Team'] = {
                            teamName: 'Onbekend Team',
                            teamleider: 'Onbekend',
                            items: []
                        };
                    }
                    grouped['Onbekend Team'].items.push(item);
                }
            });

            return grouped;

        } catch (error) {
            console.warn('Error grouping data by team:', error);
            // Fallback: return all data as one group
            return {
                'Alle Teams': {
                    teamName: 'Alle Teams',
                    teamleider: 'Verschillende',
                    items: data
                }
            };
        }
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

        // Apply team filtering if needed
        const filteredData = this.showOnlyOwnTeam ? this.filterDataByTeam(data) : data;

        // If showing only own team or no data, use single table
        if (this.showOnlyOwnTeam || !filteredData || filteredData.length === 0) {
            return h('div', { className: 'tab-content-container' },
                h('div', { className: 'tab-content active' },
                    h('div', { className: 'content-header' },
                        h('h3', null,
                            isLopend ?
                                `🔄 ${this.getActiveTypeTitle()} - Lopende Aanvragen (${filteredData.length})` :
                                `📁 ${this.getActiveTypeTitle()} - Historisch (${filteredData.length})`
                        )
                    ),
                    this.renderSimpleTable(filteredData, type, actionable)
                )
            );
        } else {
            // Group by team and show multiple tables
            return h('div', { className: 'tab-content-container' },
                h('div', { className: 'tab-content active' },
                    h('div', { className: 'content-header' },
                        h('h3', null,
                            isLopend ?
                                `🔄 ${this.getActiveTypeTitle()} - Lopende Aanvragen` :
                                `📁 ${this.getActiveTypeTitle()} - Historisch`
                        )
                    ),
                    this.renderGroupedTables(filteredData, type, actionable)
                )
            );
        }
    }

    renderGroupedTables(data, type, actionable) {
        // Create a unique ID for this render
        const containerId = `grouped-tables-${Date.now()}`;

        // Schedule async loading after render
        setTimeout(() => {
            const container = document.getElementById(containerId);
            if (container && !container._groupedDataLoaded) {
                container._groupedDataLoaded = true;
                this.loadGroupedTables(container, data, type, actionable);
            }
        }, 0);

        return h('div', {
            className: 'grouped-tables',
            id: containerId
        },
            h('div', { className: 'loading-groups' }, 'Groeperen op teams...')
        );
    }

    async loadGroupedTables(container, data, type, actionable) {
        try {
            const groupedData = await this.groupDataByTeam(data);
            const groupKeys = Object.keys(groupedData);

            if (groupKeys.length === 0) {
                const emptyState = h('div', { className: 'empty-state' },
                    h('div', { className: 'empty-icon' }, '📋'),
                    h('h3', null, 'Geen gegevens'),
                    h('p', null, 'Er zijn geen gegevens beschikbaar voor deze categorie.')
                );
                ReactDOM.render(emptyState, container);
                return;
            }

            // Render all team sections in a single React component
            const allTeamSections = h('div', { className: 'team-sections-container' },
                groupKeys.map((teamKey, index) => {
                    const group = groupedData[teamKey];
                    return h('div', { key: `team-${index}-${teamKey}` }, 
                        this.renderTeamSection(group, type, actionable)
                    );
                })
            );

            ReactDOM.render(allTeamSections, container);

        } catch (error) {
            console.error('Error loading grouped tables:', error);
            const errorState = h('div', { className: 'error-state' },
                h('h3', null, 'Fout bij laden'),
                h('p', null, 'Er is een fout opgetreden bij het groeperen van gegevens.')
            );
            ReactDOM.render(errorState, container);
        }
    }

    renderTeamSection(group, type, actionable) {
        const { teamName, teamleider, items } = group;

        // Analyze reasons and statuses for dynamic header
        const reasons = new Set();
        const statuses = new Set();

        items.forEach(item => {
            if (item.Reden) reasons.add(item.Reden);
            if (item.Status) statuses.add(item.Status);
        });

        // Determine reason text
        let reasonText = '';
        if (this.selectedType === 'verlof' || this.selectedType === 'ziekte') {
            if (reasons.size === 1) {
                reasonText = Array.from(reasons)[0];
            } else if (reasons.size > 1) {
                reasonText = 'Diverse verlof';
            } else {
                reasonText = this.getActiveTypeTitle();
            }
        } else if (this.selectedType === 'compensatie') {
            reasonText = 'Compensatie-uren';
        } else if (this.selectedType === 'zittingsvrij') {
            reasonText = 'Zittingsvrije dagen';
        } else {
            reasonText = this.getActiveTypeTitle();
        }

        // Determine status text
        let statusText = '';
        if (statuses.size === 1) {
            statusText = Array.from(statuses)[0];
        } else if (statuses.size > 1) {
            statusText = 'Diverse statussen';
        } else {
            statusText = this.viewMode === 'lopend' ? 'Nieuw' : 'Verschillende';
        }

        // Create dynamic header: "{Reason} aanvragen met status {Status} van {Teamleider} - {Teamname}"
        const dynamicHeader = `${reasonText} aanvragen met status ${statusText} van ${teamleider} - ${teamName}`;

        return h('div', { className: 'team-section' },
            h('div', { className: 'team-header' },
                h('h4', { className: 'team-title' }, dynamicHeader),
                h('span', { className: 'team-count' }, `${items.length} ${items.length === 1 ? 'aanvraag' : 'aanvragen'}`)
            ),
            this.renderSimpleTable(items, type, actionable)
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

        return h('div', { className: 'table-container' },
            h('table', { className: 'data-table' },
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
            // Removed: Teamleider, Reden, Status (hidden but data still loaded)
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
                    let reactie = '';
                    if (this.selectedType === 'compensatie') {
                        reactie = item.ReactieBehandelaar || '';
                    } else if (this.selectedType === 'verlof' || this.selectedType === 'ziekte') {
                        reactie = item.OpmerkingBehandelaar || '';
                    } else if (this.selectedType === 'zittingsvrij') {
                        reactie = item.Opmerking || '';
                    }

                    return h('td', { className: 'reactie-cell', 'data-column': col },
                        reactie ? h('div', { className: 'reactie-content', title: reactie },
                            reactie.length > 50 ? reactie.substring(0, 50) + '...' : reactie
                        ) : h('span', { className: 'no-reactie' }, '-')
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

    }



    closeApproveModal() {

        this.selectedItem = null;

        this.isApproveModalOpen = false;

        this.modalAction = null;

        this.render();

    }



    closeRejectModal() {

        this.selectedItem = null;

        this.isRejectModalOpen = false;

        this.modalAction = null;

        this.render();

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
                className: 'teamleider-placeholder',
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
            return h('div', { className: 'employee-comment-cell' },
                h('span', { className: 'employee-comment-preview', title: value },
                    value.length > 30 ? value.substring(0, 30) + '...' : value
                ),
                h('div', { className: 'employee-comment-full' }, value)
            );
        }

        // Format status with badges
        if (column === 'Status') {
            const statusClass = value.toLowerCase().replace(/\s+/g, '-');
            return h('span', { className: `status-badge status-${statusClass}` }, value);
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
                this.showOnlyOwnTeam = this.userSettings.BHCAlleenEigen === true;
            } else {
                // Create default user settings if none exist
                this.userSettings = {
                    Title: this.currentUser.Title,
                    BHCAlleenEigen: false
                };
                this.showOnlyOwnTeam = false;
            }

            // If super user, always start with all data visible (but can emulate)
            if (this.isSuperUser) {
                this.showOnlyOwnTeam = false;
                await this.loadAllTeamLeaders();
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
            }

        } catch (error) {
            console.error('Could not update user setting:', error);
            this.showNotification('Fout bij opslaan instelling.', 'error');
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
                    const teamLeader = medewerkers.find(m => m.ID === team.TeamleiderId);
                    if (teamLeader) {
                        this.allTeamLeaders.push({
                            id: teamLeader.ID,
                            username: teamLeader.Username,
                            naam: teamLeader.Naam || teamLeader.Title,
                            teamNaam: team.Naam,
                            teamId: team.ID
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

    filterDataByTeam(data) {
        // If super user not emulating, or not team leader, or not filtering by team
        if (this.isSuperUser && !this.emulatingTeamLeader) {
            return data; // Super user sees all data by default
        }

        if (!this.isTeamLeader || !this.showOnlyOwnTeam) {
            return data; // Show all data if not filtering
        }

        try {
            // Determine which teams to show
            let teamsToShow = [];

            if (this.emulatingTeamLeader) {
                // When emulating, show only that team leader's teams
                teamsToShow = this.emulatingTeamLeader.teamNaam ? [this.emulatingTeamLeader.teamNaam] : [];
            } else {
                // Show current user's teams
                teamsToShow = this.currentUserTeams.map(team => team.Naam);
            }

            if (teamsToShow.length === 0) {
                return data; // Fallback: show all if no teams found
            }

            // Filter data to only include requests from team members
            return data.filter(item => {
                const username = (item.MedewerkerID || item.Medewerker || item.Gebruikersnaam || '').toLowerCase();

                // Find employee's team
                const employeeInfo = this.employeeMap ? this.employeeMap[username] : null;
                if (!employeeInfo || !employeeInfo.team) {
                    return false; // Exclude if no team info
                }

                return teamsToShow.includes(employeeInfo.team);
            });

        } catch (error) {
            console.warn('Error filtering data by team:', error);
            return data; // Fallback: return all data
        }
    }

    handleTeamFilterToggle(e) {
        const newValue = e.target.checked;
        this.updateUserSetting('BHCAlleenEigen', newValue);
    }

    handleModeToggle(e) {
        const mode = e.target.dataset.mode;
        if (mode && mode !== this.viewMode) {
            this.viewMode = mode;

            // Reset type selection if switching to lopende and current type is not available
            if (mode === 'lopend' && (this.selectedType === 'ziekte' || this.selectedType === 'zittingsvrij')) {
                this.selectedType = 'verlof';
            }

            this.render();
        }
    }

    handleTypeSelection(e) {
        const type = e.target.dataset.type;
        if (type && type !== this.selectedType) {
            this.selectedType = type;
            this.render();
        }
    }

    handleApprove(e) {
        const itemId = e.target.dataset.itemId;
        const itemType = e.target.dataset.itemType;

        if (!itemId || !itemType) return;

        // Find the item in our data
        const item = this.findItemById(itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }

        this.selectedItem = item;
        this.modalAction = 'approve';
        this.isApproveModalOpen = true;
        this.render();
    }

    handleReject(e) {
        const itemId = e.target.dataset.itemId;
        const itemType = e.target.dataset.itemType;

        if (!itemId || !itemType) return;

        // Find the item in our data
        const item = this.findItemById(itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }

        this.selectedItem = item;
        this.modalAction = 'reject';
        this.isRejectModalOpen = true;
        this.render();
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
                if (listType === 'CompensatieUren') {
                    updateData.ReactieBehandelaar = reactie;
                } else if (listType === 'Verlof') {
                    updateData.OpmerkingBehandelaar = reactie;
                } else if (listType === 'IncidenteelZittingVrij') {
                    updateData.Opmerking = reactie;
                }
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
        // Simple notification system - you can enhance this
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
                if (notificationContainer.parentNode) {
                    notificationContainer.parentNode.removeChild(notificationContainer);
                }
            }, 300);
        }, 3000);
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