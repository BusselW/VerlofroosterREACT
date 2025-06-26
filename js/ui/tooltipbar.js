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
            return; // Al geïnitialiseerd
        }

        const tooltip = document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.className = 'custom-tooltip';
        document.body.appendChild(tooltip);
        this.tooltipElement = tooltip;
    },

    /**
     * Koppelt tooltip-events aan een specifiek DOM-element.
     * @param {HTMLElement} element - Het element waarop de mouseover de tooltip moet tonen.
     * @param {string|function} content - De HTML-content voor de tooltip of een functie die de content retourneert.
     */
    attach: function(element, content) {
        if (!this.tooltipElement) {
            console.error("TooltipManager is niet geïnitialiseerd. Roep TooltipManager.init() aan.");
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
        
        // Optionele: bewaar een referentie om eventueel listeners te kunnen verwijderen
        element.dataset.tooltipAttached = 'true';
    },

    /**
     * Toont de tooltip met de opgegeven content.
     * @param {string} htmlContent - De HTML-string om in de tooltip weer te geven.
     */
    show: function(htmlContent) {
        if (!this.tooltipElement) return;
        this.tooltipElement.innerHTML = htmlContent;
        this.tooltipElement.style.display = 'block';
    },

    /**
     * Verbergt de tooltip.
     */
    hide: function() {
        if (!this.tooltipElement) return;
        this.tooltipElement.style.display = 'none';
        this.tooltipElement.innerHTML = ''; // Maak leeg om memory leaks te voorkomen
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
    }
};

// Exporteer de manager voor gebruik in andere modules (indien van toepassing)
export default TooltipManager;
