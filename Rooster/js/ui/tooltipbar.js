/**
 * @file tooltipbar.js
 * @description Beheert het maken en weergeven van aangepaste tooltips.
 */

// Maak een singleton object om alle tooltip-logica te beheren.
const TooltipManager = {
    tooltipElement: null,

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
            const tooltipContent = typeof content === 'function' ? content() : content;
            this.show(tooltipContent);
            this.updatePosition(event);
        };

        const hideTooltip = () => {
            this.hide();
        };

        const updateTooltipPosition = (event) => {
            this.updatePosition(event);
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
    createVerlofTooltip: function(verlofItem) {
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
            
            return `
                <div class="custom-tooltip-title">🌴 ${verlofItem.Titel || 'Verlof'}</div>
                <div class="custom-tooltip-content">
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">👤 Medewerker:</span>
                        <span class="custom-tooltip-value">${verlofItem.MedewerkerNaam || 'Onbekend'}</span>
                    </div>
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">📅 Periode:</span>
                        <span class="custom-tooltip-value">
                            ${startDatum.toLocaleDateString('nl-NL')} 
                            ${startDatum.getTime() !== eindDatum.getTime() ? ' t/m ' + eindDatum.toLocaleDateString('nl-NL') : ''}
                        </span>
                    </div>
                    ${verlofItem.Toelichting ? `
                    <div class="custom-tooltip-info">
                        <span class="custom-tooltip-label">💬 Toelichting:</span>
                        <span class="custom-tooltip-value">${verlofItem.Toelichting}</span>
                    </div>
                    ` : ''}
                    <div class="custom-tooltip-info">
                        <span class="tooltip-status ${statusClass}">📊 ${statusText}</span>
                    </div>
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
    createCompensatieTooltip: function(compensatieItem) {
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
        
        const datum = new Date(compensatieItem.Datum);
        
        return `
            <div class="custom-tooltip-title">⏰ Compensatie Uren</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">👤 Medewerker:</span>
                    <span class="custom-tooltip-value">${compensatieItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📅 Datum:</span>
                    <span class="custom-tooltip-value">${datum.toLocaleDateString('nl-NL')}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">${urenIcon} Uren:</span>
                    <span class="custom-tooltip-value">${urenTekst}</span>
                </div>
                ${compensatieItem.Toelichting ? `
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
    createZittingsvrijTooltip: function(zittingsvrijItem) {
        if (!zittingsvrijItem) return '';
        
        let startDatum = new Date(zittingsvrijItem.StartDatum);
        let eindDatum = new Date(zittingsvrijItem.EindDatum || zittingsvrijItem.StartDatum);
        
        return `
            <div class="custom-tooltip-title">🏛️ Zittingsvrij</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">👤 Medewerker:</span>
                    <span class="custom-tooltip-value">${zittingsvrijItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📅 Periode:</span>
                    <span class="custom-tooltip-value">
                        ${startDatum.toLocaleDateString('nl-NL')} 
                        ${startDatum.getTime() !== eindDatum.getTime() ? ' t/m ' + eindDatum.toLocaleDateString('nl-NL') : ''}
                    </span>
                </div>
                ${zittingsvrijItem.Toelichting ? `
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
    createZiekteTooltip: function(ziekteMeldingItem) {
        if (!ziekteMeldingItem) return '';
        
        let startDatum = new Date(ziekteMeldingItem.StartDatum);
        let eindDatum = ziekteMeldingItem.EindDatum ? new Date(ziekteMeldingItem.EindDatum) : null;
        
        return `
            <div class="custom-tooltip-title">🤒 Ziekmelding</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">👤 Medewerker:</span>
                    <span class="custom-tooltip-value">${ziekteMeldingItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">📅 Periode:</span>
                    <span class="custom-tooltip-value">
                        ${startDatum.toLocaleDateString('nl-NL')} 
                        ${eindDatum ? ' t/m ' + eindDatum.toLocaleDateString('nl-NL') : ' tot nader order'}
                    </span>
                </div>
                ${ziekteMeldingItem.Toelichting ? `
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
            
            this.attach(element, () => {
                const verlofData = this.extractVerlofData(element);
                return this.createVerlofTooltip(verlofData);
            });
            attachedCount++;
        });
        
        // Attach tooltips to compensatie-uren blocks
        const compensatieBloks = document.querySelectorAll('.compensatie-uur-blok, .compensatie-uur-container');
        console.log(`Found ${compensatieBloks.length} compensatie blocks`);
        compensatieBloks.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, () => {
                const compensatieData = this.extractCompensatieData(element);
                return this.createCompensatieTooltip(compensatieData);
            });
            attachedCount++;
        });
        
        // Attach tooltips to zittingsvrij blocks
        const zittingsvrijBloks = document.querySelectorAll('.zittingsvrij-blok, [data-afkorting="ZV"]');
        console.log(`Found ${zittingsvrijBloks.length} zittingsvrij blocks`);
        zittingsvrijBloks.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, () => {
                const zittingsvrijData = this.extractZittingsvrijData(element);
                return this.createZittingsvrijTooltip(zittingsvrijData);
            });
            attachedCount++;
        });
        
        // Attach tooltips to ziekte blocks
        const ziekteBloks = document.querySelectorAll('.ziekte-blok, [data-afkorting="ZK"]');
        console.log(`Found ${ziekteBloks.length} ziekte blocks`);
        ziekteBloks.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, () => {
                const ziekteData = this.extractZiekteData(element);
                return this.createZiekteTooltip(ziekteData);
            });
            attachedCount++;
        });
        
        // Attach tooltips to holiday elements
        const feestdagElements = document.querySelectorAll('.feestdag, [data-feestdag]');
        console.log(`Found ${feestdagElements.length} feestdag elements`);
        feestdagElements.forEach(element => {
            if (element.dataset.tooltipAttached === 'true') return;
            
            this.attach(element, () => {
                const feestdagNaam = element.dataset.feestdag || element.getAttribute('title') || 'Feestdag';
                const datum = element.dataset.datum ? new Date(element.dataset.datum) : new Date();
                return this.createFeestdagTooltip(feestdagNaam, datum);
            });
            attachedCount++;
        });
        
        // Attach tooltips to icons with titles
        const iconElements = document.querySelectorAll('i[title], .icon[title], [data-tooltip], img[title], button[title]');
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
        
        this.observer = new MutationObserver((mutations) => {
            let shouldReattach = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check of er nieuwe elementen zijn toegevoegd die tooltips nodig hebben
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const hasTooltipElements = node.querySelectorAll ? 
                                node.querySelectorAll('.verlof-blok, .compensatie-uur-blok, .ziekte-blok, .zittingsvrij-blok, [data-tooltip], [title], [data-feestdag]').length > 0 ||
                                node.matches('.verlof-blok, .compensatie-uur-blok, .ziekte-blok, .zittingsvrij-blok, [data-tooltip], [title], [data-feestdag]') : false;
                                
                            if (hasTooltipElements) {
                                shouldReattach = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldReattach) {
                // Debounce de reattach functie
                clearTimeout(this.reattachTimeout);
                this.reattachTimeout = setTimeout(() => {
                    this.autoAttachTooltips();
                }, 100);
            }
        });
        
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
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
                compensatie: document.querySelectorAll('.compensatie-uur-blok, .compensatie-uur-container').length,
                zittingsvrij: document.querySelectorAll('.zittingsvrij-blok, [data-afkorting="ZV"]').length,
                ziekte: document.querySelectorAll('.ziekte-blok, [data-afkorting="ZK"]').length,
                feestdagen: document.querySelectorAll('.feestdag, [data-feestdag]').length,
                icons: document.querySelectorAll('i[title], .icon[title], [data-tooltip], img[title], button[title]').length
            },
            attachedCount: document.querySelectorAll('[data-tooltip-attached="true"]').length
        };
        
        console.log('📊 Tooltip test results:', testResults);
        
        if (testResults.initialized) {
            console.log('✅ TooltipManager is initialized');
        } else {
            console.log('❌ TooltipManager is NOT initialized');
        }
        
        console.log(`📋 Found ${Object.values(testResults.elementCount).reduce((a, b) => a + b, 0)} total elements that should have tooltips`);
        console.log(`🔗 Currently ${testResults.attachedCount} elements have tooltips attached`);
        
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
