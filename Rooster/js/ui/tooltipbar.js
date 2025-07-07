/**
 * @file tooltipbar.js
 * @description Beheert het maken en weergeven van aangepaste tooltips.
 */

// Maak een singleton object om alle tooltip-logica te beheren.
const TooltipManager = {
    tooltipElement: null,
    currentUserGroups: null,
    showTimeout: null,
    hideTimeout: null,

    /**
     * Check if current user belongs to privileged groups that can see comments
     * @returns {Promise<boolean>} - True if user can see comments
     */
    canSeeComments: async function() {
        if (this.currentUserGroups === null) {
            try {
                // Import permission service and get user groups
                if (typeof getCurrentUserGroups === 'function') {
                    this.currentUserGroups = await getCurrentUserGroups();
                } else {
                    console.warn('getCurrentUserGroups not available, assuming no privileged access');
                    this.currentUserGroups = [];
                }
            } catch (error) {
                console.error('Error getting user groups:', error);
                this.currentUserGroups = [];
            }
        }
        
        const privilegedGroups = [
            '1. Sharepoint beheer',
            '1.1. Mulder MT', 
            '2.6 Roosteraars',
            '2.3. Senioren beoordelen'
        ];
        
        return this.currentUserGroups.some(group => 
            privilegedGroups.some(privileged => 
                group.Title && group.Title.includes(privileged)
            )
        );
    },

    /**
     * Initialiseert de tooltip-manager. Creëert het tooltip-element en voegt het toe aan de body.
     * Deze functie moet één keer worden aangeroepen wanneer de applicatie laadt.
     */
    init: function() {
        if (this.tooltipElement) {
            console.log('TooltipManager already initialized');
            return; // Al geïnitialiseerd
        }
        
        console.log('Initializing TooltipManager');
        const tooltip = document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.className = 'custom-tooltip';
        document.body.appendChild(tooltip);
        this.tooltipElement = tooltip;
        console.log('TooltipManager initialized successfully');
    },

    /**
     * Koppelt tooltip-events aan een specifiek DOM-element.
     * @param {HTMLElement} element - Het element waarop de mouseover de tooltip moet tonen.
     * @param {string|function} content - De HTML-content voor de tooltip of een functie die de content retourneert.
     */
    attach: function(element, content) {
        if (!this.tooltipElement) {
            this.init();
        }

        // Skip if we've already attached to this element
        if (element.dataset.tooltipAttached === 'true') {
            return;
        }

        const showTooltip = (event) => {
            // Clear any existing timeouts
            clearTimeout(this.showTimeout);
            clearTimeout(this.hideTimeout);
            
            // Add delay to prevent flicker
            this.showTimeout = setTimeout(() => {
                const tooltipContent = typeof content === 'function' ? content() : content;
                if (tooltipContent && tooltipContent.trim()) {
                    this.show(tooltipContent);
                    this.updatePosition(event);
                }
            }, 300); // 300ms delay for better UX
        };

        const hideTooltip = () => {
            clearTimeout(this.showTimeout);
            clearTimeout(this.hideTimeout);
            
            // Add small delay before hiding
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, 100);
        };

        const updateTooltipPosition = (event) => {
            // Throttle position updates for better performance
            if (!this.updatePositionThrottle) {
                this.updatePositionThrottle = setTimeout(() => {
                    this.updatePosition(event);
                    this.updatePositionThrottle = null;
                }, 16); // ~60fps
            }
        };

        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('mousemove', updateTooltipPosition);
        
        // Mark element as having a tooltip attached
        element.dataset.tooltipAttached = 'true';
        
        // Remove native title attribute to prevent browser's default tooltip
        if (element.hasAttribute('title')) {
            element.dataset.originalTitle = element.getAttribute('title');
            element.removeAttribute('title');
        }
    },

    /**
     * Toont de tooltip met de opgegeven content.
     * @param {string} htmlContent - De HTML-string om in de tooltip weer te geven.
     */
    show: function(htmlContent) {
        if (!this.tooltipElement) {
            this.init();
        }
        this.tooltipElement.innerHTML = htmlContent;
        this.tooltipElement.style.display = 'block';
        this.tooltipElement.style.opacity = '1';
    },

    /**
     * Verbergt de tooltip.
     */
    hide: function() {
        if (!this.tooltipElement) return;
        this.tooltipElement.style.opacity = '0';
        setTimeout(() => {
            if (this.tooltipElement) {
                this.tooltipElement.style.display = 'none';
                this.tooltipElement.innerHTML = ''; // Maak leeg om memory leaks te voorkomen
            }
        }, 200);
    },

    /**
     * Werkt de positie van de tooltip bij op basis van de muispositie.
     * @param {MouseEvent} event - Het mouse event.
     */
    updatePosition: function(event) {
        if (!this.tooltipElement || this.tooltipElement.style.display === 'none') return;
        
        let x = event.clientX + 15;
        let y = event.clientY + 15;

        // Zorg ervoor dat de tooltip niet buiten het scherm valt
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (x + tooltipRect.width > viewportWidth) {
            x = event.clientX - tooltipRect.width - 15;
        }
        if (y + tooltipRect.height > viewportHeight) {
            y = event.clientY - tooltipRect.height - 15;
        }

        this.tooltipElement.style.left = `${x}px`;
        this.tooltipElement.style.top = `${y}px`;
    },
    
    /**
     * Maakt een tooltip voor een verlofitem
     * @param {Object} verlofItem - Het verlof item object
     * @returns {string} HTML voor de tooltip
     */
    createVerlofTooltip: async function(verlofItem) {
        if (!verlofItem) return '';
        
        try {
            // Bepaal de status CSS klasse
            let statusClass = '';
            let statusText = '';
            
            switch(verlofItem.Status) {
                case 'Nieuw':
                    statusClass = 'tooltip-status-new';
                    statusText = 'Nieuw';
                    break;
                case 'Goedgekeurd':
                    statusClass = 'tooltip-status-approved';
                    statusText = 'Goedgekeurd';
                    break;
                case 'Afgekeurd':
                    statusClass = 'tooltip-status-rejected';
                    statusText = 'Afgekeurd';
                    break;
                case 'Ziek':
                    statusClass = 'tooltip-status-sick';
                    statusText = 'Ziek';
                    break;
                default:
                    statusClass = '';
                    statusText = verlofItem.Status || 'Onbekend';
            }
            
            let startDatum = new Date(verlofItem.StartDatum);
            let eindDatum = new Date(verlofItem.EindDatum || verlofItem.StartDatum);
            
            // Check if user can see comments
            const canSeeComments = await this.canSeeComments();
            
            return `
                <div class="custom-tooltip-title">🌴 ${verlofItem.Titel || 'Verlof'}</div>
                <div class="custom-tooltip-content">
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">👤 Medewerker:</span>
                        <span class="custom-tooltip-value">${verlofItem.MedewerkerNaam || 'Onbekend'}</span>
                    </div>
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">📅 Van:</span>
                        <span class="custom-tooltip-value">${startDatum.toLocaleDateString('nl-NL')}</span>
                    </div>
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">📅 Tot:</span>
                        <span class="custom-tooltip-value">${eindDatum.toLocaleDateString('nl-NL')}</span>
                    </div>
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">� Status:</span>
                        <span class="tooltip-status ${statusClass}">${statusText}</span>
                    </div>
                    ${(verlofItem.Toelichting && canSeeComments) ? `
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">💬 Toelichting:</span>
                        <span class="custom-tooltip-value">${verlofItem.Toelichting}</span>
                    </div>
                    ` : ''}
                </div>
            `;
        } catch (error) {
            console.error('Error creating verlof tooltip:', error, verlofItem);
            return '<div class="custom-tooltip-title">Verlof</div><div class="custom-tooltip-content">Fout bij laden van gegevens</div>';
        }
    },
    
    /**
     * Maakt een tooltip voor een feestdag
     * @param {string} feestdagNaam - De naam van de feestdag
     * @param {Date} datum - De datum van de feestdag
     * @returns {string} HTML voor de tooltip
     */
    createFeestdagTooltip: function(feestdagNaam, datum) {
        if (!feestdagNaam) return '';
        
        const datumFormatted = datum instanceof Date 
            ? datum.toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : '';
            
        return `
            <div class="custom-tooltip tooltip-holiday">
                <div class="custom-tooltip-title">${feestdagNaam}</div>
                <div class="custom-tooltip-content">
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-value">${datumFormatted}</span>
                    </div>
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-value">Officiële feestdag</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Maakt een tooltip voor compensatie-uren
     * @param {Object} compensatieItem - Het compensatie item object
     * @returns {string} HTML voor de tooltip
     */
    createCompensatieTooltip: async function(compensatieItem) {
        if (!compensatieItem) return '';
        
        let urenTekst = '';
        let urenIcon = '';
        if (compensatieItem.AantalUren > 0) {
            urenTekst = `+${compensatieItem.AantalUren} uur`;
            urenIcon = '⬆️'; // Plus icon
        } else if (compensatieItem.AantalUren < 0) {
            urenTekst = `${compensatieItem.AantalUren} uur`;
            urenIcon = '⬇️'; // Minus icon
        } else {
            urenTekst = 'Neutraal';
            urenIcon = '⚖️'; // Balance icon
        }
        
        const startDatum = new Date(compensatieItem.StartDatum || compensatieItem.Datum);
        const eindDatum = new Date(compensatieItem.EindDatum || compensatieItem.Datum);
        const status = compensatieItem.Status || 'Actief';
        
        // Check if user can see comments
        const canSeeComments = await this.canSeeComments();
        
        return `
            <div class="custom-tooltip-title">⏰ Compensatie Uren</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">👤 Medewerker:</span>
                    <span class="custom-tooltip-value">${compensatieItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📅 Van:</span>
                    <span class="custom-tooltip-value">${startDatum.toLocaleDateString('nl-NL')}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📅 Tot:</span>
                    <span class="custom-tooltip-value">${eindDatum.toLocaleDateString('nl-NL')}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📊 Status:</span>
                    <span class="custom-tooltip-value">${status}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">${urenIcon} Uren:</span>
                    <span class="custom-tooltip-value">${urenTekst}</span>
                </div>
                ${(compensatieItem.Toelichting && canSeeComments) ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">💬 Toelichting:</span>
                    <span class="custom-tooltip-value">${compensatieItem.Toelichting}</span>
                </div>
                ` : ''}
            </div>
        `;
    },
    
    /**
     * Maakt een tooltip voor zittingsvrij
     * @param {Object} zittingsvrijItem - Het zittingsvrij item object
     * @returns {string} HTML voor de tooltip
     */
    createZittingsvrijTooltip: async function(zittingsvrijItem) {
        if (!zittingsvrijItem) return '';
        
        let startDatum = new Date(zittingsvrijItem.StartDatum);
        let eindDatum = new Date(zittingsvrijItem.EindDatum || zittingsvrijItem.StartDatum);
        const status = zittingsvrijItem.Status || 'Actief';
        
        // Check if user can see comments
        const canSeeComments = await this.canSeeComments();
        
        return `
            <div class="custom-tooltip-title">🏛️ Zittingsvrij</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">👤 Medewerker:</span>
                    <span class="custom-tooltip-value">${zittingsvrijItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📅 Van:</span>
                    <span class="custom-tooltip-value">${startDatum.toLocaleDateString('nl-NL')}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📅 Tot:</span>
                    <span class="custom-tooltip-value">${eindDatum.toLocaleDateString('nl-NL')}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📊 Status:</span>
                    <span class="custom-tooltip-value">${status}</span>
                </div>
                ${(zittingsvrijItem.Toelichting && canSeeComments) ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">💬 Toelichting:</span>
                    <span class="custom-tooltip-value">${zittingsvrijItem.Toelichting}</span>
                </div>
                ` : ''}
            </div>
        `;
    },
    
    /**
     * Maakt een tooltip voor ziekmelding
     * @param {Object} ziekteMeldingItem - Het ziekte melding item object
     * @returns {string} HTML voor de tooltip
     */
    createZiekteTooltip: async function(ziekteMeldingItem) {
        if (!ziekteMeldingItem) return '';
        
        let startDatum = new Date(ziekteMeldingItem.StartDatum);
        let eindDatum = ziekteMeldingItem.EindDatum ? new Date(ziekteMeldingItem.EindDatum) : null;
        const status = ziekteMeldingItem.Status || 'Actief';
        
        // Check if user can see comments
        const canSeeComments = await this.canSeeComments();
        
        return `
            <div class="custom-tooltip-title">🤒 Ziekmelding</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">👤 Medewerker:</span>
                    <span class="custom-tooltip-value">${ziekteMeldingItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📅 Van:</span>
                    <span class="custom-tooltip-value">${startDatum.toLocaleDateString('nl-NL')}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📅 Tot:</span>
                    <span class="custom-tooltip-value">${eindDatum ? eindDatum.toLocaleDateString('nl-NL') : 'Tot nader order'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📊 Status:</span>
                    <span class="custom-tooltip-value">${status}</span>
                </div>
                ${(ziekteMeldingItem.Toelichting && canSeeComments) ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">💬 Toelichting:</span>
                    <span class="custom-tooltip-value">${ziekteMeldingItem.Toelichting}</span>
                </div>
                ` : ''}
            </div>
        `;
    },
    
    /**
     * Automatisch tooltips toewijzen aan elementen in de DOM
     */
    autoAttachTooltips: function() {
        console.log('🔍 Auto-attaching tooltips to DOM elements...');
        let attachedCount = 0;
        
        // Attach tooltips to verlof blocks
        const verlofBloks = document.querySelectorAll('.verlof-blok');
        console.log(`Found ${verlofBloks.length} verlof blocks`);
        verlofBloks.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, async () => {
                const verlofData = this.extractVerlofData(element);
                return await this.createVerlofTooltip(verlofData);
            });
            attachedCount++;
        });
        
        // Attach tooltips to compensatie-uren blocks
        const compensatieBloks = document.querySelectorAll('.compensatie-uur-blok, .compensatie-uur-container, [data-afkorting="CU"]');
        console.log(`Found ${compensatieBloks.length} compensatie blocks`);
        compensatieBloks.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, async () => {
                const compensatieData = this.extractCompensatieData(element);
                return await this.createCompensatieTooltip(compensatieData);
            });
            attachedCount++;
        });
        
        // Attach tooltips to zittingsvrij blocks
        const zittingsvrijBloks = document.querySelectorAll('.zittingsvrij-blok, [data-afkorting="ZV"]');
        console.log(`Found ${zittingsvrijBloks.length} zittingsvrij blocks`);
        zittingsvrijBloks.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, async () => {
                const zittingsvrijData = this.extractZittingsvrijData(element);
                return await this.createZittingsvrijTooltip(zittingsvrijData);
            });
            attachedCount++;
        });
        
        // Attach tooltips to ziekte blocks
        const ziekteBloks = document.querySelectorAll('.ziekte-blok, [data-afkorting="ZK"]');
        console.log(`Found ${ziekteBloks.length} ziekte blocks`);
        ziekteBloks.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, async () => {
                const ziekteData = this.extractZiekteData(element);
                return await this.createZiekteTooltip(ziekteData);
            });
            attachedCount++;
        });
        
        // Attach tooltips to holiday elements (improved selectors)
        const feestdagElements = document.querySelectorAll('.feestdag, [data-feestdag], .dag-cel.feestdag, .feestdag-cel');
        console.log(`Found ${feestdagElements.length} feestdag elements`);
        feestdagElements.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, () => {
                const feestdagNaam = element.dataset.feestdag || 
                                    element.getAttribute('title') || 
                                    element.getAttribute('data-original-title') ||
                                    element.textContent?.trim() ||
                                    'Feestdag';
                const datum = element.dataset.datum ? new Date(element.dataset.datum) : new Date();
                return this.createFeestdagTooltip(feestdagNaam, datum);
            });
            attachedCount++;
        });
        
        // Attach tooltips to buttons with improved descriptions
        const buttonElements = document.querySelectorAll('button[title], button[data-tooltip], .btn[title], .btn[data-tooltip], [role="button"][title]');
        console.log(`Found ${buttonElements.length} button elements`);
        buttonElements.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            let tooltipText = element.dataset.tooltip || element.getAttribute('title') || '';
            
            // Enhance button descriptions based on class or content
            if (element.classList.contains('verlof-btn') || element.textContent?.includes('Verlof')) {
                tooltipText = tooltipText || 'Verlof aanvragen voor geselecteerde periode';
            } else if (element.classList.contains('compensatie-btn') || element.textContent?.includes('Compensatie')) {
                tooltipText = tooltipText || 'Compensatie-uren registreren voor geselecteerde periode';
            } else if (element.classList.contains('ziek-btn') || element.textContent?.includes('Ziek')) {
                tooltipText = tooltipText || 'Ziekmelding doen voor geselecteerde periode';
            } else if (element.classList.contains('zittingsvrij-btn') || element.textContent?.includes('Zittingsvrij')) {
                tooltipText = tooltipText || 'Zittingsvrije dag aanvragen voor geselecteerde periode';
            } else if (element.classList.contains('save-btn') || element.textContent?.includes('Opslaan')) {
                tooltipText = tooltipText || 'Wijzigingen opslaan';
            } else if (element.classList.contains('cancel-btn') || element.textContent?.includes('Annuleren')) {
                tooltipText = tooltipText || 'Wijzigingen annuleren';
            } else if (element.classList.contains('delete-btn') || element.textContent?.includes('Verwijder')) {
                tooltipText = tooltipText || 'Item verwijderen';
            } else if (element.classList.contains('edit-btn') || element.textContent?.includes('Bewerk')) {
                tooltipText = tooltipText || 'Item bewerken';
            }
            
            if (tooltipText) {
                this.attach(element, `<div class="custom-tooltip-title">${tooltipText}</div>`);
                attachedCount++;
            }
        });
        
        // Attach tooltips to other icons and elements with titles
        const iconElements = document.querySelectorAll('i[title]:not([data-tooltip-attached]), .icon[title]:not([data-tooltip-attached]), img[title]:not([data-tooltip-attached]), [data-tooltip]:not([data-tooltip-attached])');
        console.log(`Found ${iconElements.length} icon/title elements`);
        iconElements.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            const tooltipText = element.dataset.tooltip || element.getAttribute('title') || '';
            if (tooltipText) {
                this.attach(element, `<div class="custom-tooltip-title">${tooltipText}</div>`);
                attachedCount++;
            }
        });
        
        console.log(`✅ Auto-attach tooltips completed: ${attachedCount} tooltips attached`);
    },
    
    /**
     * Extraheert verlof data uit een DOM element
     * @param {HTMLElement} element - Het verlof element
     * @returns {Object} Verlof data object
     */
    extractVerlofData: function(element) {
        const data = {
            Titel: element.dataset.titel || element.textContent?.trim() || 'Verlof',
            MedewerkerNaam: element.dataset.medewerker || 'Onbekend',
            StartDatum: element.dataset.startdatum || new Date().toISOString(),
            EindDatum: element.dataset.einddatum || null,
            Status: element.dataset.status || 'Onbekend',
            Toelichting: element.dataset.toelichting || ''
        };
        
        // Try to extract from CSS classes
        if (element.classList.contains('status-nieuw')) data.Status = 'Nieuw';
        else if (element.classList.contains('status-goedgekeurd')) data.Status = 'Goedgekeurd';
        else if (element.classList.contains('status-afgekeurd')) data.Status = 'Afgekeurd';
        
        return data;
    },
    
    /**
     * Extraheert compensatie data uit een DOM element
     * @param {HTMLElement} element - Het compensatie element
     * @returns {Object} Compensatie data object
     */
    extractCompensatieData: function(element) {
        return {
            MedewerkerNaam: element.dataset.medewerker || 'Onbekend',
            Datum: element.dataset.datum || new Date().toISOString(),
            AantalUren: parseFloat(element.dataset.uren) || 0,
            Toelichting: element.dataset.toelichting || element.getAttribute('title') || ''
        };
    },
    
    /**
     * Extraheert zittingsvrij data uit een DOM element
     * @param {HTMLElement} element - Het zittingsvrij element
     * @returns {Object} Zittingsvrij data object
     */
    extractZittingsvrijData: function(element) {
        return {
            MedewerkerNaam: element.dataset.medewerker || 'Onbekend',
            StartDatum: element.dataset.startdatum || new Date().toISOString(),
            EindDatum: element.dataset.einddatum || null,
            Toelichting: element.dataset.toelichting || ''
        };
    },
    
    /**
     * Extraheert ziekte data uit een DOM element
     * @param {HTMLElement} element - Het ziekte element
     * @returns {Object} Ziekte data object
     */
    extractZiekteData: function(element) {
        return {
            MedewerkerNaam: element.dataset.medewerker || 'Onbekend',
            StartDatum: element.dataset.startdatum || new Date().toISOString(),
            EindDatum: element.dataset.einddatum || null,
            Toelichting: element.dataset.toelichting || ''
        };
    },
    
    /**
     * Observeer DOM veranderingen en pas tooltips toe op nieuwe elementen
     */
    observeDOM: function() {
        if (this.observer) return; // Al actief
        
        // Debounce function for better performance
        let debounceTimer = null;
        
        this.observer = new MutationObserver((mutations) => {
            let shouldReattach = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check of er nieuwe elementen zijn toegevoegd die tooltips nodig hebben
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const hasTooltipElements = node.querySelectorAll ? 
                                node.querySelectorAll('.verlof-blok, .compensatie-uur-blok, .compensatie-uur-container, .ziekte-blok, .zittingsvrij-blok, [data-tooltip], [title], [data-feestdag], [data-afkorting], button').length > 0 ||
                                node.matches('.verlof-blok, .compensatie-uur-blok, .compensatie-uur-container, .ziekte-blok, .zittingsvrij-blok, [data-tooltip], [title], [data-feestdag], [data-afkorting], button') : false;
                                
                            if (hasTooltipElements) {
                                shouldReattach = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldReattach) {
                // Debounce de reattach functie voor betere performance
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    console.log('🔄 DOM changed, reattaching tooltips...');
                    this.autoAttachTooltips();
                }, 500); // 500ms debounce
            }
        });
        
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            // Don't observe attributes for better performance
            attributes: false,
            attributeOldValue: false,
            characterData: false,
            characterDataOldValue: false
        });
        
        console.log('👁️ DOM observer started for tooltips');
    },
    
    /**
     * Stop DOM observatie
     */
    stopObserving: function() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
            console.log('👁️ DOM observer stopped');
        }
    },
    
    /**
     * Test functie om tooltip systeem te verifiëren
     */
    testTooltipSystem: function() {
        console.log('🧪 Testing tooltip system...');
        
        const testResults = {
            initialized: !!this.tooltipElement,
            elementCount: {
                verlof: document.querySelectorAll('.verlof-blok').length,
                compensatie: document.querySelectorAll('.compensatie-uur-blok, .compensatie-uur-container, [data-afkorting="CU"]').length,
                zittingsvrij: document.querySelectorAll('.zittingsvrij-blok, [data-afkorting="ZV"]').length,
                ziekte: document.querySelectorAll('.ziekte-blok, [data-afkorting="ZK"]').length,
                feestdagen: document.querySelectorAll('.feestdag, [data-feestdag], .dag-cel.feestdag, .feestdag-cel').length,
                buttons: document.querySelectorAll('button[title], button[data-tooltip], .btn[title], .btn[data-tooltip], [role="button"][title]').length,
                icons: document.querySelectorAll('i[title], .icon[title], [data-tooltip], img[title]').length
            },
            attachedCount: document.querySelectorAll('[data-tooltip-attached="true"]').length,
            userPermissions: this.currentUserGroups
        };
        
        console.log('📊 Tooltip test results:', testResults);
        
        if (testResults.initialized) {
            console.log('✅ TooltipManager is initialized');
        } else {
            console.log('❌ TooltipManager is NOT initialized');
        }
        
        console.log(`📋 Found ${Object.values(testResults.elementCount).reduce((a, b) => a + b, 0)} total elements that should have tooltips`);
        console.log(`🔗 Currently ${testResults.attachedCount} elements have tooltips attached`);
        
        // Test permission system
        this.canSeeComments().then(canSee => {
            console.log(`🔐 User can see comments: ${canSee}`);
        }).catch(err => {
            console.log(`🔐 Error checking comment permissions: ${err.message}`);
        });
        
        return testResults;
    },
};

// Exporteer de manager voor gebruik in andere modules
export default TooltipManager;

// Initialize when the document is loaded
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Initializing TooltipManager on DOMContentLoaded');
        TooltipManager.init();
        // Auto-attach tooltips to existing elements
        setTimeout(() => {
            TooltipManager.autoAttachTooltips();
            TooltipManager.observeDOM();
        }, 500);
    });
    
    // Also initialize immediately in case the DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('🚀 Initializing TooltipManager immediately');
        TooltipManager.init();
        setTimeout(() => {
            TooltipManager.autoAttachTooltips();
            TooltipManager.observeDOM();
        }, 100);
    }
    
    // React integration - listen for React updates
    window.addEventListener('react-update', function() {
        console.log('⚛️ React update detected, re-attaching tooltips');
        setTimeout(() => {
            TooltipManager.autoAttachTooltips();
        }, 50);
    });
}
