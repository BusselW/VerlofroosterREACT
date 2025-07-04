// tutorial.js - Interactieve tour voor het Team Rooster systeem

export const tutorialSteps = [
    {
        targetId: 'root',
        message: "Welkom bij de Team Rooster Manager! Deze tour laat je zien hoe je het rooster systeem gebruikt. Druk op 'Volgende' om te beginnen.",
    },
    {
        targetId: 'header',
        message: "Dit is de hoofdheader. Hier vind je navigatie naar andere delen van het systeem en je persoonlijke instellingen.",
    },
    {
        targetId: 'toolbar',
        message: "De toolbar bevat alle belangrijke bedieningselementen: periode navigatie, weergave-opties en filters voor medewerkers en teams.",
    },
    {
        targetId: 'periode-navigatie',
        message: "Gebruik deze knoppen om tussen weken en maanden te navigeren. Je kunt ook schakelen tussen week- en maandweergave.",
    },
    {
        targetId: 'filter-groep',  
        message: "Met deze filters kun je specifieke medewerkers zoeken of alleen bepaalde teams weergeven.",
    },
    {
        targetId: 'legenda-container',
        message: "De legenda toont alle verloftypen en hun kleuren. Hiermee kun je snel zien wat elk symbool betekent.",
    },
    {
        targetId: 'rooster-table',
        message: "Dit is het hoofdrooster. Elke rij toont een medewerker, elke kolom een dag. Verlof en afwezigheid worden hier kleurgecodeerd weergegeven.",
    },
    {
        targetId: 'medewerker-kolom',
        message: "In deze kolom zie je de medewerkernamen en hun profielfoto's. De medewerkers zijn gegroepeerd per team.",
    },
    {
        targetId: 'dag-cel',
        message: "Dit zijn de dagcellen. Klik op een cel om verlof aan te vragen. Rechtsklik voor meer opties zoals ziek melden of compensatieuren. Je kunt ook meerdere dagen selecteren door op de eerste dag te klikken en dan op de laatste dag.",
    },
    {
        targetId: 'fab-container',
        message: "De Floating Action Button (FAB) geeft je snelle toegang tot de meest gebruikte acties: verlof aanvragen, ziek melden, en compensatieuren.",
    },
    {
        targetId: 'user-dropdown',
        message: "Via je profielmenu kun je je persoonlijke gegevens en roosterinstellingen beheren.",
    },
    {
        targetId: 'nav-buttons-right',
        message: "Deze knoppen geven toegang tot verschillende beheercentra, afhankelijk van je rechten in het systeem.",
    }
];

// Helper functie om een element te highlighten tijdens de tutorial
export const highlightElement = (elementId) => {
    // Verwijder eventuele bestaande highlights
    document.querySelectorAll('.tutorial-highlight-active').forEach(el => {
        el.classList.remove('tutorial-highlight-active');
    });
    
    // Zoek het element
    let element = document.getElementById(elementId);
    
    // Als het element niet gevonden wordt via ID, probeer via className
    if (!element) {
        element = document.querySelector(`.${elementId}`);
    }
    
    // Als nog steeds niet gevonden, zoek naar data-tutorial-id
    if (!element) {
        element = document.querySelector(`[data-tutorial-id="${elementId}"]`);
    }
    
    // Special cases for elements that might not have exact IDs
    if (!element) {
        switch(elementId) {
            case 'dag-cel':
                // Find the first visible day cell
                element = document.querySelector('.dag-cel:not(.weekend)');
                break;
            case 'fab-container':
                // Find FAB by class if ID doesn't work
                element = document.querySelector('.fab-container');
                break;
            case 'medewerker-kolom':
                // Find first employee column
                element = document.querySelector('.medewerker-kolom');
                break;
        }
    }
    
    if (element) {
        element.classList.add('tutorial-highlight-active');
        
        // Scroll naar het element zodat het zichtbaar is
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
        });
        
        return element;
    } else {
        console.warn(`Tutorial element niet gevonden: ${elementId}`);
        return null;
    }
};

// Helper functie om highlight te verwijderen
export const removeHighlight = () => {
    document.querySelectorAll('.tutorial-highlight-active').forEach(el => {
        el.classList.remove('tutorial-highlight-active');
    });
};

// Extra uitleg per onderwerp
export const tutorialTopics = {
    verlofAanvragen: {
        title: "Verlof Aanvragen",
        steps: [
            "Klik op een dagcel of selecteer meerdere dagen door te slepen",
            "Rechtsklik en kies 'Verlof aanvragen' of gebruik de FAB knop", 
            "Vul het formulier in met het type verlof en eventuele opmerkingen",
            "Klik op 'Opslaan' om je aanvraag in te dienen"
        ]
    },
    ziekMelden: {
        title: "Ziek Melden", 
        steps: [
            "Selecteer de dag(en) waarop je ziek bent",
            "Rechtsklik en kies 'Ziek melden'",
            "Voeg eventueel een opmerking toe",
            "Bevestig je ziekmelding"
        ]
    },
    compensatieUren: {
        title: "Compensatieuren",
        steps: [
            "Selecteer de relevante periode",
            "Kies 'Compensatieuren doorgeven' uit het menu",
            "Specificeer of het gaat om overuren, ruildagen, of andere compensatie",
            "Voeg een beschrijving toe en sla op"
        ]
    },
    navigatie: {
        title: "Navigatie Tips",
        steps: [
            "Gebruik de pijltjes om tussen periodes te navigeren",
            "Schakel tussen week- en maandweergave voor betere overzicht",
            "Filter op team of zoek specifieke medewerkers",
            "Gebruik de legenda om verloftypen te herkennen"
        ]
    }
};

// Main class for handling the tutorial functionality
export class RoosterTutorial {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = tutorialSteps.length;
        this.tooltipElement = null;
        this.overlayElement = null;
        this.isActive = false;
        this.isMobile = window.innerWidth < 768;
    }

    // Start the tutorial
    start() {
        if (this.isActive) return;
        
        console.log("Starting tutorial...");
        this.isActive = true;
        this.currentStep = 0;
        
        // Create overlay
        this.createOverlay();
        
        // Show first step
        this.showStep(0);
        
        // Add window resize listener
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    // End the tutorial
    end() {
        console.log("Ending tutorial...");
        this.isActive = false;
        
        // Remove highlight
        removeHighlight();
        
        // Remove tooltip
        if (this.tooltipElement) {
            document.body.removeChild(this.tooltipElement);
            this.tooltipElement = null;
        }
        
        // Remove overlay
        if (this.overlayElement) {
            document.body.removeChild(this.overlayElement);
            this.overlayElement = null;
        }
        
        // Remove resize listener
        window.removeEventListener('resize', this.handleResize.bind(this));
        
        // Fire custom event for tutorial completion
        document.dispatchEvent(new CustomEvent('tutorial-completed'));
    }

    // Create overlay
    createOverlay() {
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'tutorial-overlay';
        document.body.appendChild(this.overlayElement);
    }

    // Show a specific step
    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.totalSteps) {
            this.end();
            return;
        }
        
        this.currentStep = stepIndex;
        const step = tutorialSteps[stepIndex];
        
        // Highlight target element
        const targetElement = highlightElement(step.targetId);
        
        // Create or update tooltip
        this.createTooltip(step, targetElement);
    }

    // Create tooltip for current step
    createTooltip(step, targetElement) {
        // Remove existing tooltip if any
        if (this.tooltipElement) {
            document.body.removeChild(this.tooltipElement);
        }
        
        // Create new tooltip
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'tutorial-tooltip';
        
        // Add content
        this.tooltipElement.innerHTML = `
            <div class="tutorial-tooltip-header">${this.getStepTitle(step)}</div>
            <div class="tutorial-tooltip-content">${step.message}</div>
            <div class="tutorial-navigation">
                ${this.currentStep > 0 ? 
                    '<button class="tutorial-btn tutorial-btn-secondary" id="tutorial-prev">Vorige</button>' : 
                    '<button class="tutorial-btn-skip" id="tutorial-skip">Overslaan</button>'}
                <button class="tutorial-btn tutorial-btn-primary" id="tutorial-next">
                    ${this.currentStep < this.totalSteps - 1 ? 'Volgende' : 'Afronden'}
                </button>
            </div>
            <div class="tutorial-progress">
                ${this.createProgressDots()}
            </div>
            <button class="tutorial-btn-close" id="tutorial-close">✕</button>
        `;
        
        // Add to DOM
        document.body.appendChild(this.tooltipElement);
        
        // Position tooltip relative to target
        this.positionTooltip(targetElement);
        
        // Add event listeners
        this.addTooltipEventListeners();
    }

    // Get appropriate title for step
    getStepTitle(step) {
        // Default titles based on step index
        const defaultTitles = [
            "Welkom bij de Tour!",
            "Header & Navigatie",
            "Toolbar",
            "Periode Navigatie",
            "Filters",
            "Legenda",
            "Rooster Overzicht",
            "Medewerkers",
            "Dagcellen",
            "Snelle Acties",
            "Gebruikersmenu",
            "Beheercentra"
        ];
        
        return step.title || defaultTitles[this.currentStep] || `Stap ${this.currentStep + 1}`;
    }

    // Create progress dots
    createProgressDots() {
        let dots = '';
        for (let i = 0; i < this.totalSteps; i++) {
            dots += `<div class="tutorial-progress-dot ${i === this.currentStep ? 'active' : ''}"></div>`;
        }
        return dots;
    }

    // Position tooltip relative to target element
    positionTooltip(targetElement) {
        if (!targetElement || !this.tooltipElement) return;
        
        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        
        // Default position (bottom)
        let position = 'bottom';
        let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        let top = targetRect.bottom + 15;
        
        // Check if tooltip would go off-screen and adjust
        if (top + tooltipRect.height > window.innerHeight) {
            // Try top position
            top = targetRect.top - tooltipRect.height - 15;
            position = 'top';
            
            // If still off-screen, try right position
            if (top < 0) {
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                left = targetRect.right + 15;
                position = 'right';
                
                // If still off-screen, try left position
                if (left + tooltipRect.width > window.innerWidth) {
                    left = targetRect.left - tooltipRect.width - 15;
                    position = 'left';
                }
            }
        }
        
        // Ensure tooltip stays within viewport
        left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
        top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));
        
        // Apply position
        this.tooltipElement.style.left = `${left}px`;
        this.tooltipElement.style.top = `${top}px`;
        
        // Add position class for arrow
        this.tooltipElement.className = `tutorial-tooltip position-${position}`;
    }

    // Add event listeners to tooltip buttons
    addTooltipEventListeners() {
        const nextBtn = this.tooltipElement.querySelector('#tutorial-next');
        const prevBtn = this.tooltipElement.querySelector('#tutorial-prev');
        const skipBtn = this.tooltipElement.querySelector('#tutorial-skip');
        const closeBtn = this.tooltipElement.querySelector('#tutorial-close');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.showStep(this.currentStep + 1);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.showStep(this.currentStep - 1);
            });
        }
        
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.end();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.end();
            });
        }
    }

    // Handle window resize
    handleResize() {
        this.isMobile = window.innerWidth < 768;
        
        // Reposition tooltip
        if (this.isActive && this.tooltipElement) {
            const targetElement = document.querySelector('.tutorial-highlight-active');
            if (targetElement) {
                this.positionTooltip(targetElement);
            }
        }
    }

    // Go to next step
    next() {
        if (this.currentStep < this.totalSteps - 1) {
            this.showStep(this.currentStep + 1);
        } else {
            this.end();
        }
    }

    // Go to previous step
    previous() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }
}

// Create and export tutorial instance
export const roosterTutorial = new RoosterTutorial();