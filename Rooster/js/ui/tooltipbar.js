/**
 * @file tooltipbar.js
 * @description Beheert het maken en weergeven van aangepaste tooltips.
 * 
 * Features:
 * - Responsive tooltips voor VER/ZV/Compensatie/Ziekte/Feestdagen/Buttons
 * - Permission-aware comment visibility
 * - Feestdag inspection capabilities
 * 
 * Developer utilities:
 * - window.inspectFeestdag(date|element) - Inspect feestdag by date or element
 * - window.feestdagVandaag() - Check if today is a feestdag
 * - window.feestdagenDezeMaand() - Get all feestdagen this month
 * - window.TooltipManager.testTooltipSystem() - Test all tooltip functionality
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
            this.showTimeout = setTimeout(async () => {
                try {
                    const tooltipContent = typeof content === 'function' ? await content() : content;
                    if (tooltipContent && typeof tooltipContent === 'string' && tooltipContent.trim()) {
                        this.show(tooltipContent);
                        this.updatePosition(event);
                    }
                } catch (error) {
                    console.error('Error generating tooltip content:', error);
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
                <div class="custom-tooltip-title">
                    <svg class="tooltip-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    Verlof
                </div>
                <div class="custom-tooltip-content">
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">Start datum:</span>
                        <span class="custom-tooltip-value">${startDatum.toLocaleDateString('nl-NL')}</span>
                    </div>
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">Eind datum:</span>
                        <span class="custom-tooltip-value">${eindDatum.toLocaleDateString('nl-NL')}</span>
                    </div>
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">Status:</span>
                        <span class="tooltip-status ${statusClass}">${statusText}</span>
                    </div>
                    ${verlofItem.Teamleider ? `
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">Teamleider:</span>
                        <span class="custom-tooltip-value">${verlofItem.Teamleider}</span>
                    </div>
                    ` : ''}
                    ${verlofItem.Creator ? `
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">Aangemaakt door:</span>
                        <span class="custom-tooltip-value">${verlofItem.Creator}</span>
                    </div>
                    ` : ''}
                    ${(verlofItem.Toelichting && canSeeComments) ? `
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">Toelichting:</span>
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
            
        // Select appropriate SVG icon based on feestdag type
        let iconPath = 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15,17H9V15H15V17M13,13H11V7H13V13Z'; // Default celebration icon
        const naam = feestdagNaam.toLowerCase();
        
        if (naam.includes('kerst')) {
            iconPath = 'M10,21V18H3L8,13H5L10,8H7L12,3L17,8H14L19,13H16L21,18H14V21H10Z'; // Christmas tree
        } else if (naam.includes('nieuwjaar')) {
            iconPath = 'M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H18V16H15V18H20Z'; // Calendar
        } else if (naam.includes('paas')) {
            iconPath = 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17C9.24,17 7,14.76 7,12S9.24,7 12,7 17,9.24 17,12 14.76,17 12,17Z'; // Easter egg
        } else if (naam.includes('konings')) {
            iconPath = 'M5,16L3,5H5.5L6.5,10.5L9,5H15L17.5,10.5L18.5,5H21L19,16H5M12,7L11.25,9H12.75L12,7Z'; // Crown
        }
            
        return `
            <div class="custom-tooltip tooltip-holiday">
                <div class="custom-tooltip-title">
                    <svg class="tooltip-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="${iconPath}"/>
                    </svg>
                    ${feestdagNaam}
                </div>
                <div class="custom-tooltip-content">
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">Datum:</span>
                        <span class="custom-tooltip-value">${datumFormatted}</span>
                    </div>
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">Type:</span>
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
        
        const startDatum = new Date(compensatieItem.StartCompensatieUren || compensatieItem.StartDatum || compensatieItem.Datum);
        const eindDatum = new Date(compensatieItem.EindeCompensatieUren || compensatieItem.EindDatum || compensatieItem.Datum);
        
        // Check if user can see comments
        const canSeeComments = await this.canSeeComments();
        
        // Check if it's a ruildag (swap day)
        const isRuildag = compensatieItem.Ruildag === true || compensatieItem.Ruildag === 'true';
        let ruildagInfo = '';
        if (isRuildag && compensatieItem.ruildagStart && compensatieItem.ruildagEinde) {
            const ruildagStart = new Date(compensatieItem.ruildagStart);
            const ruildagEinde = new Date(compensatieItem.ruildagEinde);
            ruildagInfo = `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Geruild met:</span>
                    <span class="custom-tooltip-value">${ruildagStart.toLocaleDateString('nl-NL')} - ${ruildagEinde.toLocaleDateString('nl-NL')}</span>
                </div>
            `;
        }
        
        return `
            <div class="custom-tooltip-title">
                <svg class="tooltip-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                </svg>
                Compensatie Uren
            </div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Start:</span>
                    <span class="custom-tooltip-value">${startDatum.toLocaleDateString('nl-NL')} ${startDatum.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Einde:</span>
                    <span class="custom-tooltip-value">${eindDatum.toLocaleDateString('nl-NL')} ${eindDatum.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                ${compensatieItem.Teamleider ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Teamleider:</span>
                    <span class="custom-tooltip-value">${compensatieItem.Teamleider}</span>
                </div>
                ` : ''}
                ${compensatieItem.Creator ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Aangemaakt door:</span>
                    <span class="custom-tooltip-value">${compensatieItem.Creator}</span>
                </div>
                ` : ''}
                ${ruildagInfo}
                ${(compensatieItem.Toelichting && canSeeComments) ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Opmerking:</span>
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
            <div class="custom-tooltip-title">
                <svg class="tooltip-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,13H16V18H13V13H11L15,9L19,13H17Z"/>
                </svg>
                Zittingsvrij
            </div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Start:</span>
                    <span class="custom-tooltip-value">${startDatum.toLocaleDateString('nl-NL')} ${startDatum.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Einde:</span>
                    <span class="custom-tooltip-value">${eindDatum.toLocaleDateString('nl-NL')} ${eindDatum.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                ${zittingsvrijItem.Teamleider ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Teamleider:</span>
                    <span class="custom-tooltip-value">${zittingsvrijItem.Teamleider}</span>
                </div>
                ` : ''}
                ${zittingsvrijItem.Creator ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Aangemaakt door:</span>
                    <span class="custom-tooltip-value">${zittingsvrijItem.Creator}</span>
                </div>
                ` : ''}
                ${(zittingsvrijItem.Toelichting && canSeeComments) ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Opmerking:</span>
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
            <div class="custom-tooltip-title">
                <svg class="tooltip-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H5V19H19V9Z"/>
                </svg>
                Ziekmelding
            </div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Start datum:</span>
                    <span class="custom-tooltip-value">${startDatum.toLocaleDateString('nl-NL')}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Eind datum:</span>
                    <span class="custom-tooltip-value">${eindDatum ? eindDatum.toLocaleDateString('nl-NL') : 'Tot nader order'}</span>
                </div>
                ${ziekteMeldingItem.Teamleider ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Teamleider:</span>
                    <span class="custom-tooltip-value">${ziekteMeldingItem.Teamleider}</span>
                </div>
                ` : ''}
                ${ziekteMeldingItem.Creator ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Aangemaakt door:</span>
                    <span class="custom-tooltip-value">${ziekteMeldingItem.Creator}</span>
                </div>
                ` : ''}
                ${(ziekteMeldingItem.Toelichting && canSeeComments) ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Opmerking:</span>
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
        
        // Attach tooltips to holiday elements (enhanced detection)
        const feestdagElements = document.querySelectorAll('.feestdag, [data-feestdag], .dag-cel.feestdag, .feestdag-cel, .holiday, [title*="feestdag"], [title*="Feestdag"], [title*="kerst"], [title*="nieuwjaar"], [title*="paas"], [title*="konings"], [class*="holiday"], [class*="feest"]');
        console.log(`Found ${feestdagElements.length} feestdag elements`);
        feestdagElements.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, () => {
                // Try multiple methods to extract feestdag information
                let feestdagNaam = null;
                let datum = null;
                
                // Method 1: Use improved inspection method
                const feestdagInfo = this.inspectFeestdagByElement(element);
                if (feestdagInfo && feestdagInfo.naam) {
                    feestdagNaam = feestdagInfo.naam;
                    datum = feestdagInfo.datum ? new Date(feestdagInfo.datum) : new Date();
                }
                
                // Method 2: Extract from data attributes
                if (!feestdagNaam) {
                    feestdagNaam = element.dataset.feestdag || 
                                  element.dataset.holiday ||
                                  element.getAttribute('data-feestdag') ||
                                  element.getAttribute('data-holiday');
                }
                
                // Method 3: Extract from title attribute
                if (!feestdagNaam) {
                    const title = element.getAttribute('title') || element.getAttribute('data-original-title');
                    if (title && (title.toLowerCase().includes('feestdag') || 
                                 title.toLowerCase().includes('kerst') ||
                                 title.toLowerCase().includes('nieuwjaar') ||
                                 title.toLowerCase().includes('paas') ||
                                 title.toLowerCase().includes('konings'))) {
                        feestdagNaam = title;
                    }
                }
                
                // Method 4: Extract from element content
                if (!feestdagNaam) {
                    const content = element.textContent?.trim();
                    if (content && content.length > 0 && content.length < 50) {
                        feestdagNaam = content;
                    }
                }
                
                // Method 5: Extract from parent elements
                if (!feestdagNaam) {
                    const parent = element.closest('[data-feestdag], [title*="feestdag"], [title*="kerst"], [title*="nieuwjaar"]');
                    if (parent) {
                        feestdagNaam = parent.dataset.feestdag || parent.getAttribute('title');
                    }
                }
                
                // Method 6: Check for common holiday patterns in classes
                if (!feestdagNaam) {
                    const classList = element.className.toLowerCase();
                    if (classList.includes('kerst')) feestdagNaam = 'Kerstdag';
                    else if (classList.includes('nieuwjaar')) feestdagNaam = 'Nieuwjaarsdag';
                    else if (classList.includes('paas')) feestdagNaam = 'Paasdag';
                    else if (classList.includes('konings')) feestdagNaam = 'Koningsdag';
                    else if (classList.includes('bevrijding')) feestdagNaam = 'Bevrijdingsdag';
                    else if (classList.includes('hemelvaart')) feestdagNaam = 'Hemelvaart';
                    else if (classList.includes('pinster')) feestdagNaam = 'Pinksterdag';
                }
                
                // Final fallback
                if (!feestdagNaam) {
                    feestdagNaam = 'Feestdag';
                }
                
                // Extract datum if not found
                if (!datum) {
                    datum = element.dataset.datum ? new Date(element.dataset.datum) : new Date();
                }
                
                return this.createFeestdagTooltip(feestdagNaam, datum);
            });
            attachedCount++;
        });
        
        // Attach tooltips to buttons with enhanced descriptions (including all verlofrooster buttons)
        const buttonElements = document.querySelectorAll(`
            button, .btn, [role="button"],
            .floating-action-button, .fab-button,
            .tooltip-trigger, .action-button,
            .nav-button, .control-button,
            [title]:not([data-tooltip-attached]),
            [data-tooltip]:not([data-tooltip-attached])
        `.replace(/\s+/g, ' ').trim());
        console.log(`Found ${buttonElements.length} button elements`);
        buttonElements.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            let tooltipText = element.dataset.tooltip || element.getAttribute('title') || '';
            
            // Enhanced button descriptions based on class, content, and context
            const classList = element.className.toLowerCase();
            const textContent = element.textContent?.toLowerCase()?.trim() || '';
            const id = element.id?.toLowerCase() || '';
            
            // Verlofrooster specific buttons
            if (classList.includes('verlof') || textContent.includes('verlof') || id.includes('verlof')) {
                tooltipText = tooltipText || 'Verlof aanvragen voor geselecteerde periode';
            } else if (classList.includes('compensatie') || textContent.includes('compensatie') || id.includes('compensatie')) {
                tooltipText = tooltipText || 'Compensatie-uren registreren voor geselecteerde periode';
            } else if (classList.includes('ziek') || textContent.includes('ziek') || id.includes('ziek')) {
                tooltipText = tooltipText || 'Ziekmelding doen voor geselecteerde periode';
            } else if (classList.includes('zittingsvrij') || textContent.includes('zittingsvrij') || id.includes('zittingsvrij')) {
                tooltipText = tooltipText || 'Zittingsvrije dag aanvragen voor geselecteerde periode';
            } 
            
            // Navigation and control buttons
            else if (classList.includes('prev') || textContent.includes('vorig') || textContent.includes('←')) {
                tooltipText = tooltipText || 'Ga naar vorige periode';
            } else if (classList.includes('next') || textContent.includes('volg') || textContent.includes('→')) {
                tooltipText = tooltipText || 'Ga naar volgende periode';
            } else if (classList.includes('today') || textContent.includes('vandaag') || textContent.includes('heden')) {
                tooltipText = tooltipText || 'Ga naar vandaag';
            } else if (classList.includes('refresh') || textContent.includes('ververs') || textContent.includes('herladen')) {
                tooltipText = tooltipText || 'Gegevens opnieuw laden';
            }
            
            // Action buttons
            else if (classList.includes('save') || textContent.includes('opslaan') || textContent.includes('bewaren')) {
                tooltipText = tooltipText || 'Wijzigingen opslaan';
            } else if (classList.includes('cancel') || textContent.includes('annuleren') || textContent.includes('afbreken')) {
                tooltipText = tooltipText || 'Actie annuleren';
            } else if (classList.includes('delete') || classList.includes('remove') || textContent.includes('verwijder') || textContent.includes('wissen')) {
                tooltipText = tooltipText || 'Item verwijderen';
            } else if (classList.includes('edit') || textContent.includes('bewerk') || textContent.includes('wijzig')) {
                tooltipText = tooltipText || 'Item bewerken';
            } else if (classList.includes('add') || classList.includes('create') || textContent.includes('toevoegen') || textContent.includes('nieuw')) {
                tooltipText = tooltipText || 'Nieuw item toevoegen';
            } 
            
            // View and filter buttons
            else if (classList.includes('filter') || textContent.includes('filter')) {
                tooltipText = tooltipText || 'Gegevens filteren';
            } else if (classList.includes('search') || textContent.includes('zoek')) {
                tooltipText = tooltipText || 'Zoeken in gegevens';
            } else if (classList.includes('export') || textContent.includes('export')) {
                tooltipText = tooltipText || 'Gegevens exporteren';
            } else if (classList.includes('print') || textContent.includes('print')) {
                tooltipText = tooltipText || 'Pagina afdrukken';
            } else if (classList.includes('settings') || classList.includes('config') || textContent.includes('instellingen')) {
                tooltipText = tooltipText || 'Instellingen openen';
            }
            
            // FAB and floating buttons
            else if (classList.includes('fab') || classList.includes('floating')) {
                if (classList.includes('menu')) {
                    tooltipText = tooltipText || 'Actiemenu openen';
                } else {
                    tooltipText = tooltipText || 'Snelle actie uitvoeren';
                }
            }
            
            // Close buttons
            else if (classList.includes('close') || textContent.includes('sluiten') || textContent.includes('×')) {
                tooltipText = tooltipText || 'Venster sluiten';
            }
            
            // Help buttons
            else if (classList.includes('help') || classList.includes('info') || textContent.includes('help') || textContent.includes('info')) {
                tooltipText = tooltipText || 'Help en informatie';
            }
            
            // Generic fallbacks based on common patterns
            else if (element.type === 'submit') {
                tooltipText = tooltipText || 'Formulier verzenden';
            } else if (element.type === 'reset') {
                tooltipText = tooltipText || 'Formulier resetten';
            }
            
            if (tooltipText) {
                this.attach(element, `
                    <div class="custom-tooltip-title">
                        <svg class="tooltip-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H5V19H19V9Z"/>
                        </svg>
                        ${tooltipText}
                    </div>
                `);
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
            Teamleider: element.dataset.teamleider || element.dataset.teamlead || element.dataset.manager || '',
            Creator: element.dataset.creator || element.dataset.aangemaakt || element.dataset.createdby || '',
            Toelichting: element.dataset.toelichting || element.dataset.comment || element.dataset.opmerking || ''
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
            StartDatum: element.dataset.startdatum || element.dataset.datum || new Date().toISOString(),
            EindDatum: element.dataset.einddatum || element.dataset.datum || null,
            StartCompensatieUren: element.dataset.startcompensatieuren || element.dataset.startdatum || element.dataset.datum || new Date().toISOString(),
            EindeCompensatieUren: element.dataset.eindecompensatieuren || element.dataset.einddatum || element.dataset.datum || null,
            AantalUren: parseFloat(element.dataset.uren) || 0,
            Status: element.dataset.status || 'Actief',
            Teamleider: element.dataset.teamleider || element.dataset.teamlead || element.dataset.manager || '',
            Creator: element.dataset.creator || element.dataset.aangemaakt || element.dataset.createdby || '',
            Ruildag: element.dataset.ruildag || element.dataset.swap || false,
            ruildagStart: element.dataset.ruildagstart || element.dataset.swapstart || null,
            ruildagEinde: element.dataset.ruildageinde || element.dataset.swapend || null,
            Toelichting: element.dataset.toelichting || element.dataset.comment || element.dataset.opmerking || element.getAttribute('title') || ''
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
            Status: element.dataset.status || 'Actief',
            Teamleider: element.dataset.teamleider || element.dataset.teamlead || element.dataset.manager || '',
            Creator: element.dataset.creator || element.dataset.aangemaakt || element.dataset.createdby || '',
            Toelichting: element.dataset.toelichting || element.dataset.comment || element.dataset.opmerking || ''
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
            Status: element.dataset.status || 'Actief',
            Teamleider: element.dataset.teamleider || element.dataset.teamlead || element.dataset.manager || '',
            Creator: element.dataset.creator || element.dataset.aangemaakt || element.dataset.createdby || '',
            Toelichting: element.dataset.toelichting || element.dataset.comment || element.dataset.opmerking || ''
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
     * Inspecteer welke feestdag actief is op een gegeven datum
     * @param {Date|string} datum - De datum om te inspecteren (Date object of YYYY-MM-DD string)
     * @returns {Object|null} Feestdag informatie of null als geen feestdag gevonden
     */
    inspectFeestdagByDate: function(datum) {
        if (!datum) datum = new Date();
        
        // Converteer naar Date object indien nodig
        let targetDate;
        if (typeof datum === 'string') {
            targetDate = new Date(datum);
        } else if (datum instanceof Date) {
            targetDate = datum;
        } else {
            console.warn('Invalid date format provided to inspectFeestdagByDate');
            return null;
        }
        
        // Maak datum string in YYYY-MM-DD formaat voor vergelijking
        const dateString = targetDate.toISOString().split('T')[0];
        
        // Zoek naar feestdag elementen die overeenkomen met deze datum
        const feestdagElements = document.querySelectorAll('.feestdag, [data-feestdag], .dag-cel.feestdag, .feestdag-cel');
        
        for (const element of feestdagElements) {
            const elementDate = this.extractDateFromElement(element);
            if (elementDate && elementDate === dateString) {
                return this.extractFeestdagInfo(element);
            }
        }
        
        console.log(`No feestdag found for date: ${dateString}`);
        return null;
    },
    
    /**
     * Inspecteer feestdag informatie van een DOM element
     * @param {HTMLElement} element - Het element om te inspecteren
     * @returns {Object|null} Feestdag informatie of null als geen feestdag
     */
    inspectFeestdagByElement: function(element) {
        if (!element) {
            console.warn('No element provided to inspectFeestdagByElement');
            return null;
        }
        
        // Check of het element een feestdag element is
        const isFeestdag = element.classList.contains('feestdag') || 
                          element.hasAttribute('data-feestdag') ||
                          element.classList.contains('feestdag-cel') ||
                          (element.classList.contains('dag-cel') && element.classList.contains('feestdag'));
        
        if (!isFeestdag) {
            console.log('Element is not a feestdag element');
            return null;
        }
        
        return this.extractFeestdagInfo(element);
    },
    
    /**
     * Haal datum uit een DOM element
     * @param {HTMLElement} element - Het element
     * @returns {string|null} Datum in YYYY-MM-DD formaat of null
     */
    extractDateFromElement: function(element) {
        // Probeer verschillende manieren om de datum te extraheren
        let dateStr = element.dataset.datum || 
                     element.dataset.date ||
                     element.getAttribute('data-datum') ||
                     element.getAttribute('data-date');
        
        if (dateStr) {
            // Normaliseer datum naar YYYY-MM-DD formaat
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
        
        // Probeer datum te extraheren uit parent element of grid structuur
        const parent = element.closest('[data-datum], [data-date], .dag-cel, .calendar-day');
        if (parent) {
            dateStr = parent.dataset.datum || 
                     parent.dataset.date ||
                     parent.getAttribute('data-datum') ||
                     parent.getAttribute('data-date');
            
            if (dateStr) {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return date.toISOString().split('T')[0];
                }
            }
        }
        
        // Als laatste poging, probeer datum te extraheren uit ID of class namen
        const idMatch = element.id.match(/(\d{4}-\d{2}-\d{2})/);
        if (idMatch) {
            return idMatch[1];
        }
        
        return null;
    },
    
    /**
     * Extraheer feestdag informatie uit een element
     * @param {HTMLElement} element - Het feestdag element
     * @returns {Object} Feestdag informatie
     */
    extractFeestdagInfo: function(element) {
        const naam = element.dataset.feestdag || 
                    element.getAttribute('title') || 
                    element.getAttribute('data-original-title') ||
                    element.textContent?.trim() ||
                    'Onbekende feestdag';
        
        const datum = this.extractDateFromElement(element);
        let formattedDate = null;
        
        if (datum) {
            const dateObj = new Date(datum);
            if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleDateString('nl-NL', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            }
        }
        
        return {
            naam: naam,
            datum: datum,
            datumFormatted: formattedDate,
            element: element,
            type: 'feestdag',
            isOfficialHoliday: true
        };
    },
    
    /**
     * Krijg alle actieve feestdagen in een bepaalde periode
     * @param {Date} startDate - Startdatum (optioneel, default: vandaag)
     * @param {Date} endDate - Einddatum (optioneel, default: einde van het jaar)
     * @returns {Array} Array van feestdag objecten
     */
    getAllFeestdagenInPeriod: function(startDate = null, endDate = null) {
        if (!startDate) startDate = new Date();
        if (!endDate) {
            endDate = new Date(startDate.getFullYear(), 11, 31); // Einde van het jaar
        }
        
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        const feestdagElements = document.querySelectorAll('.feestdag, [data-feestdag], .dag-cel.feestdag, .feestdag-cel');
        const feestdagen = [];
        
        feestdagElements.forEach(element => {
            const elementDate = this.extractDateFromElement(element);
            if (elementDate && elementDate >= startDateStr && elementDate <= endDateStr) {
                const feestdagInfo = this.extractFeestdagInfo(element);
                if (feestdagInfo) {
                    feestdagen.push(feestdagInfo);
                }
            }
        });
        
        // Sorteer op datum
        feestdagen.sort((a, b) => a.datum.localeCompare(b.datum));
        
        return feestdagen;
    },
    
    /**
     * Developer utility: Log alle feestdagen in console
     */
    logAllFeestdagen: function() {
        const feestdagen = this.getAllFeestdagenInPeriod();
        console.log('🎉 Alle feestdagen gevonden:', feestdagen);
        
        feestdagen.forEach(feestdag => {
            console.log(`📅 ${feestdag.datum} (${feestdag.datumFormatted}): ${feestdag.naam}`);
        });
        
        return feestdagen;
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
            userPermissions: this.currentUserGroups,
            feestdagenDetails: this.getAllFeestdagenInPeriod()
        };
        
        console.log('📊 Tooltip test results:', testResults);
        
        if (testResults.initialized) {
            console.log('✅ TooltipManager is initialized');
        } else {
            console.log('❌ TooltipManager is NOT initialized');
        }
        
        console.log(`📋 Found ${Object.values(testResults.elementCount).reduce((a, b) => a + b, 0)} total elements that should have tooltips`);
        console.log(`🔗 Currently ${testResults.attachedCount} elements have tooltips attached`);
        
        // Show feestdagen details
        if (testResults.feestdagenDetails.length > 0) {
            console.log(`🎉 Found ${testResults.feestdagenDetails.length} feestdagen:`);
            testResults.feestdagenDetails.forEach(feestdag => {
                console.log(`   📅 ${feestdag.datum}: ${feestdag.naam}`);
            });
        } else {
            console.log('🎉 No feestdagen found in current view');
        }
        
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
    
    // Add developer utilities to window object for easy debugging
    window.TooltipManager = TooltipManager;
    
    // Global helper functions for feestdag inspection
    window.inspectFeestdag = function(dateOrElement) {
        if (!dateOrElement) {
            // Show all feestdagen for current period
            return TooltipManager.logAllFeestdagen();
        } else if (typeof dateOrElement === 'string' || dateOrElement instanceof Date) {
            // Inspect by date
            return TooltipManager.inspectFeestdagByDate(dateOrElement);
        } else if (dateOrElement instanceof HTMLElement) {
            // Inspect by element
            return TooltipManager.inspectFeestdagByElement(dateOrElement);
        } else {
            console.warn('Invalid parameter for inspectFeestdag. Use a date string, Date object, or HTMLElement.');
            return null;
        }
    };
    
    // Quick function to check feestdag for today
    window.feestdagVandaag = function() {
        const today = new Date();
        const feestdag = TooltipManager.inspectFeestdagByDate(today);
        if (feestdag) {
            console.log(`🎉 Vandaag is ${feestdag.naam} (${feestdag.datumFormatted})`);
            return feestdag;
        } else {
            console.log('📅 Vandaag is geen feestdag');
            return null;
        }
    };
    
    // Function to get all feestdagen this month
    window.feestdagenDezeMaand = function() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const feestdagen = TooltipManager.getAllFeestdagenInPeriod(startOfMonth, endOfMonth);
        console.log(`🎉 Feestdagen deze maand (${startOfMonth.toLocaleDateString('nl-NL', {month: 'long', year: 'numeric'})}):`, feestdagen);
        return feestdagen;
    };
    
    console.log('🔧 Developer utilities added to window:');
    console.log('   - window.inspectFeestdag(date|element) - Inspect feestdag by date or element');
    console.log('   - window.feestdagVandaag() - Check if today is a feestdag');
    console.log('   - window.feestdagenDezeMaand() - Get all feestdagen this month');
    console.log('   - window.TooltipManager - Access full TooltipManager object');
}
