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
            default:
                statusClass = '';
                statusText = verlofItem.Status || 'Onbekend';
        }
        
        let startDatum = new Date(verlofItem.StartDatum);
        let eindDatum = new Date(verlofItem.EindDatum || verlofItem.StartDatum);
        
        return `
            <div class="custom-tooltip-title">${verlofItem.Titel || 'Verlof'}</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Medewerker:</span>
                    <span class="custom-tooltip-value">${verlofItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Periode:</span>
                    <span class="custom-tooltip-value">
                        ${startDatum.toLocaleDateString('nl-NL')} 
                        ${startDatum.getTime() !== eindDatum.getTime() ? ' t/m ' + eindDatum.toLocaleDateString('nl-NL') : ''}
                    </span>
                </div>
                ${verlofItem.Toelichting ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Toelichting:</span>
                    <span class="custom-tooltip-value">${verlofItem.Toelichting}</span>
                </div>
                ` : ''}
                <div class="custom-tooltip-info">
                    <span class="tooltip-status ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
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
        if (compensatieItem.AantalUren > 0) {
            urenTekst = `+${compensatieItem.AantalUren} uur`;
        } else if (compensatieItem.AantalUren < 0) {
            urenTekst = `${compensatieItem.AantalUren} uur`;
        } else {
            urenTekst = 'Neutraal';
        }
        
        const datum = new Date(compensatieItem.Datum);
        
        return `
            <div class="custom-tooltip-title">Compensatie Uren</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Medewerker:</span>
                    <span class="custom-tooltip-value">${compensatieItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Datum:</span>
                    <span class="custom-tooltip-value">${datum.toLocaleDateString('nl-NL')}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Uren:</span>
                    <span class="custom-tooltip-value">${urenTekst}</span>
                </div>
                ${compensatieItem.Toelichting ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Toelichting:</span>
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
            <div class="custom-tooltip-title">Zittingsvrij</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Medewerker:</span>
                    <span class="custom-tooltip-value">${zittingsvrijItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Periode:</span>
                    <span class="custom-tooltip-value">
                        ${startDatum.toLocaleDateString('nl-NL')} 
                        ${startDatum.getTime() !== eindDatum.getTime() ? ' t/m ' + eindDatum.toLocaleDateString('nl-NL') : ''}
                    </span>
                </div>
                ${zittingsvrijItem.Toelichting ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Toelichting:</span>
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
            <div class="custom-tooltip-title">Ziekmelding</div>
            <div class="custom-tooltip-content">
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Medewerker:</span>
                    <span class="custom-tooltip-value">${ziekteMeldingItem.MedewerkerNaam || 'Onbekend'}</span>
                </div>
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Periode:</span>
                    <span class="custom-tooltip-value">
                        ${startDatum.toLocaleDateString('nl-NL')} 
                        ${eindDatum ? ' t/m ' + eindDatum.toLocaleDateString('nl-NL') : ' tot nader order'}
                    </span>
                </div>
                ${ziekteMeldingItem.Toelichting ? `
                <div class="custom-tooltip-info">
                    <span class="custom-tooltip-label">Toelichting:</span>
                    <span class="custom-tooltip-value">${ziekteMeldingItem.Toelichting}</span>
                </div>
                ` : ''}
            </div>
        `;
    }
};

// Exporteer de manager voor gebruik in andere modules
export default TooltipManager;

// Initialize when the document is loaded
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Initializing TooltipManager on DOMContentLoaded');
        TooltipManager.init();
    });
    
    // Also initialize immediately in case the DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('🚀 Initializing TooltipManager immediately');
        TooltipManager.init();
    }
}
