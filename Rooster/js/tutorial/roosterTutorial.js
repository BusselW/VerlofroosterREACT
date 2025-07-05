// tutorial.js - Interactieve tour voor het Team Rooster systeem
// Enhanced version focusing on the most important UI elements and user actions
// Provides practical examples and actionable guidance for effective onboarding

export const tutorialSteps = [
    {
        targetId: 'root',
        message: "👋 Hallo! Welkom bij het Verlofrooster! Ik ga je even laten zien hoe alles werkt. In een paar minuten kun je zelf aan de slag. Klaar?",
    },
    {
        targetId: 'header',
        message: "📱 Dit is de hoofdnavigatie. Links kun je meldingen doen, rechts vind je de beheertools (als je daar toegang toe hebt).",
    },
    {
        targetId: 'toolbar',
        message: "🛠️ Dit is je werkbalk! Hier navigeer je door de tijd, schakel je tussen week- en maandweergave, en zoek je mensen en teams.",
    },
    {
        targetId: 'periode-navigatie',
        message: "📅 <strong>Door de tijd navigeren:</strong><br>• Gebruik de pijltjes ⬅️➡️ om door weken/maanden te gaan<br>• Kies 'Week' voor details of 'Maand' voor een overzicht<br>• <em>Tip: weekweergave is perfect voor planning!</em>",
    },
    {
        targetId: 'filter-groep',  
        message: "🔍 <strong>Zoeken en filteren:</strong><br>• Typ een naam in het zoekveld (probeer bijvoorbeeld 'Bussel')<br>• Kies een team uit de dropdown<br>• <em>Super handig in grote organisaties!</em>",
    },
    {
        targetId: 'legenda-container',
        message: "🎨 <strong>Kleuren uitgelegd:</strong> Zo zie je in één oogopslag wat er aan de hand is<br>• <span style='color: green'><strong>VER</strong></span> = Verlof (groen)<br>• <span style='color: red'><strong>ZK</strong></span> = Ziek (rood)<br>• <span style='color: blue'><strong>CU</strong></span> = Compensatie-uren (blauw)<br>• <span style='color: orange'><strong>ZV</strong></span> = Zittingsvrij (oranje)",
    },
    {
        targetId: 'rooster-table',
        message: "📊 <strong>En dit is het rooster zelf!</strong><br>Elke rij is een persoon, elke kolom een dag. De kleuren laten direct zien wie wanneer weg is.",
    },
    {
        targetId: 'medewerker-kolom',
        message: "👥 <strong>Al je collega's op een rij:</strong><br>Hier zie je iedereen met hun foto, netjes gegroepeerd per team. Teamleiders hebben een speciale markering.",
    },
    {
        targetId: 'dag-cel',
        message: "✨ <strong>Hier gebeurt het!</strong> Deze cellen zijn interactief:<br>• <strong>Klik:</strong> selecteer een dag<br>• <strong>Nog een keer klikken:</strong> selecteer meer dagen<br>• <strong>Rechtsklik:</strong> open het snelmenu<br>• <strong>Shift+klik:</strong> selecteer een heel bereik",
        demoActions: [
            {
                type: 'highlight',
                description: 'Voorbeeld cel gemarkeerd'
            }
        ]
    },
    {
        targetId: 'fab-container',
        message: "🚀 <strong>Je snelkoppeling:</strong> Deze knop geeft je direct toegang tot alles wat je nodig hebt:<br>• 📝 Verlof aanvragen<br>• 🤒 Ziek melden<br>• ⏰ Compensatie-uren registreren<br>• 🏛️ Zittingsvrije dagen aanvragen<br><em>Klik er gerust op om te oefenen!</em>",
    },
    {
        targetId: 'dag-cel',
        message: "🖱️ <strong>Nog handiger:</strong> rechtsklik gewoon op een dagcel!<br>Dan krijg je hetzelfde menu, maar al gekoppeld aan die dag. Scheelt tijd!",
        demoActions: [
            {
                type: 'highlight',
                description: 'Rechtsklik hier voor het snelmenu'
            }
        ]
    },
    {
        targetId: 'user-dropdown',
        message: "⚙️ <strong>Je eigen profiel:</strong><br>Klik op je naam of foto voor persoonlijke instellingen, werktijden aanpassen en je profielinfo.",
    },
    {
        targetId: 'nav-buttons-right',
        message: "🎉 <strong>Klaar!</strong><br>Hier zie je nog wat beheertools (als je die rechten hebt) en de Help-knop om deze tour later nog eens te doen.<br><br><strong>Je weet nu hoe het werkt - veel plezier met plannen!</strong>",
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
                element = document.querySelector('.dag-cel:not(.weekend)') || 
                         document.querySelector('td.dag-kolom:not(.weekend)') ||
                         document.querySelector('td[class*="dag"]');
                break;
            case 'fab-container':
                // Find FAB by class if ID doesn't work
                element = document.querySelector('.fab-container') ||
                         document.querySelector('#fab-container') ||
                         document.querySelector('[class*="fab"]');
                break;
            case 'medewerker-kolom':
                // Find first employee column - try multiple selectors
                element = document.querySelector('.medewerker-kolom') ||
                         document.querySelector('#medewerker-kolom') ||
                         document.querySelector('th[class*="medewerker"]') ||
                         document.querySelector('td[class*="medewerker"]') ||
                         document.querySelector('.employee-column') ||
                         document.querySelector('[class*="employee"]');
                // If still not found, try finding the first column header
                if (!element) {
                    const table = document.querySelector('table') || document.querySelector('.rooster-table');
                    if (table) {
                        element = table.querySelector('th:first-child') || 
                                 table.querySelector('td:first-child');
                    }
                }
                break;
            case 'legenda-container':
                element = document.querySelector('.legenda-container') ||
                         document.querySelector('#legenda-container') ||
                         document.querySelector('[class*="legenda"]') ||
                         document.querySelector('[class*="legend"]');
                break;
        }
    }
    
    if (element) {
        element.classList.add('tutorial-highlight-active');
        
        // Scroll naar het element met extra ruimte voor tooltip
        // Use a slight delay to ensure the element is properly highlighted first
        setTimeout(() => {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        }, 100);
        
        return element;
    } else {
        console.warn(`Tutorial element niet gevonden: ${elementId}`);
        console.log('Available elements:', {
            byId: document.getElementById(elementId),
            byClass: document.querySelector(`.${elementId}`),
            allTables: document.querySelectorAll('table').length,
            allThs: document.querySelectorAll('th').length,
            allTds: document.querySelectorAll('td').length
        });
        return null;
    }
};

// Helper functie om highlight te verwijderen
export const removeHighlight = () => {
    document.querySelectorAll('.tutorial-highlight-active').forEach(el => {
        el.classList.remove('tutorial-highlight-active');
    });
};

// Extra uitleg per onderwerp met praktische voorbeelden
export const tutorialTopics = {
    verlofAanvragen: {
        title: "Verlof Aanvragen - Makkelijk Gedaan",
        steps: [
            "🎯 <strong>Periode kiezen:</strong>",
            "   • <em>Enkele dag:</em> Klik op bijvoorbeeld maandag 15 juli",
            "   • <em>Meerdere dagen:</em> Klik op startdag → klik op einddag", 
            "   • <em>Handig:</em> Shift+klik selecteert automatisch alles ertussen",
            "🖱️ <strong>Formulier openen:</strong>",
            "   • <strong>Snelste:</strong> Rechtsklik op geselecteerde dag(en) → 'Verlof aanvragen'",
            "   • <strong>Of:</strong> Gebruik de ronde knop (➕) rechtsonder",
            "   • <em>Tip:</em> Rechtsklik is sneller als je al dagen hebt geselecteerd",
            "📝 <strong>Formulier invullen (voorbeeld voor org\\busselw):</strong>",
            "   • <em>Verloftype:</em> Vakantie, Kort verzuim, Verlof zonder behoud van salaris",
            "   • <em>Datum check:</em> Controleer of de data kloppen (bijvoorbeeld 15-19 juli)",
            "   • <em>Opmerking:</em> 'Familievakantie naar Frankrijk' of 'Doktersafspraak'",
            "   • <em>Halve dagen:</em> Vink aan als je alleen ochtend of middag vrij bent",
            "✅ <strong>Klaar:</strong> Verstuur je verzoek:",
            "   • Klik 'Opslaan' - je aanvraag gaat naar je manager",
            "   • Je ziet het direct in het rooster (meestal geel = 'wacht op goedkeuring')",
            "   • Je manager krijgt automatisch een melding"
        ]
    },
    ziekMelden: {
        title: "Ziek Melden - Snel en Makkelijk", 
        steps: [
            "🚨 <strong>Voor vandaag (meeste gevallen):</strong>",
            "   • Zoek je eigen rij in het rooster",
            "   • Klik op vandaag in je rij",
            "   • Rechtsklik → 'Ziek melden'",
            "📅 <strong>Voor meerdere dagen:</strong>",
            "   • Selecteer startdag (bijvoorbeeld maandag) tot einddag (bijvoorbeeld woensdag)",
            "   • Rechtsklik → 'Ziek melden'",
            "📝 <strong>Formulier invullen:</strong>",
            "   • <em>Type:</em> Ziek, Doktersbezoek, Ziekte kind",
            "   • <em>Opmerking:</em> 'Griep' of 'Tandarts' (niet verplicht)",
            "   • <em>Halve dag:</em> Vink aan als je maar een deel van de dag ziek bent",
            "⚡ <strong>Direct actief:</strong>",
            "   • Ziekmeldingen zijn meteen zichtbaar (rood in het rooster)",
            "   • Geen goedkeuring nodig - gewoon direct actief",
            "   • Je leidinggevende krijgt automatisch bericht"
        ]
    },
    compensatieUren: {
        title: "Compensatie-uren Makkelijk Bijhouden",
        steps: [
            "⏰ <strong>Overuren registreren:</strong>",
            "   • Selecteer de dag(en) waar je extra hebt gewerkt",
            "   • Bijvoorbeeld: klik op afgelopen vrijdag in je rij",
            "📋 <strong>Formulier openen:</strong>",
            "   • <strong>Snelste:</strong> Rechtsklik → 'Compensatieuren doorgeven'",
            "   • <strong>Of:</strong> Gebruik de ronde knop → 'Compensatieuren'",
            "   • <em>Tip:</em> Rechtsklik is handiger omdat je dan al de juiste dag hebt",
            "🔢 <strong>Gegevens invullen (voorbeeld voor org\\busselw):</strong>",
            "   • <em>Type:</em> Overuren, Ruildag, Extra dienst, Reistijd",
            "   • <em>Aantal uren:</em> bijvoorbeeld 2,5 uur (gebruik een komma)",
            "   • <em>Beschrijving:</em> 'Avonddienst voor spoedklus X123'",
            "   • <em>Datum/tijd:</em> Wanneer je die extra uren hebt gemaakt",
            "💾 <strong>Opslaan en checken:</strong>",
            "   • Compensatie-uren zie je als blauwe blokjes in het rooster",
            "   • Je plus/min uren worden automatisch bijgehouden",
            "   • Je leidinggevende kan ze nog goedkeuren of aanpassen"
        ]
    },
    navigatie: {
        title: "Slim Navigeren door het Rooster",
        steps: [
            "📅 <strong>Tussen periodes bewegen:</strong>",
            "   • ⬅️➡️ Pijltjes: ga naar vorige/volgende week of maand",
            "   • <em>Sneltoets:</em> Gebruik de pijltjestoetsen op je toetsenbord",
            "📊 <strong>Weergave kiezen:</strong>",
            "   • <em>'Week' weergave:</em> Perfect voor gedetailleerde planning (7 dagen)",
            "   • <em>'Maand' weergave:</em> Overzicht van een hele maand tegelijk",
            "   • <em>Tip:</em> Wissel vaak tussen beide voor het beste resultaat",
            "🔍 <strong>Zoeken en filteren:</strong>",
            "   • <em>Zoeken:</em> Typ 'Jansen' om alle Jansens te vinden",
            "   • <em>Team filter:</em> Selecteer 'IT-team' → zie alleen IT-medewerkers",
            "   • <em>Combineren:</em> Filter op team + zoek op naam voor precisie",
            "🎨 <strong>Kleuren herkennen:</strong>",
            "   • Gebruik de legenda om snel verloftypen te herkennen",
            "   • <em>Groen:</em> Goedgekeurd verlof",
            "   • <em>Geel:</em> Wacht nog op goedkeuring",
            "   • <em>Rood:</em> Ziek of afgewezen",
            "💡 <strong>Handige trucs:</strong>",
            "   • <em>Ctrl+klik:</em> Selecteer meerdere losse dagen",
            "   • <em>Shift+klik:</em> Selecteer een heel bereik",
            "   • <em>Dubbelklik:</em> Zoom in op specifieke dag"
        ]
    },
    shortcutKeys: {
        title: "Handige Sneltoetsen & Trucs",
        steps: [
            "⌨️ <strong>Navigatie met je toetsenbord:</strong>",
            "   • <em>Pijltjes (← →):</em> Vorige/volgende periode",
            "   • <em>Pijltjes (↑ ↓):</em> Scroll door de medewerkerslijst",
            "   • <em>Home/End:</em> Spring naar begin/eind van het jaar",
            "🖱️ <strong>Slimme muisacties:</strong>",
            "   • <em>Ctrl+klik:</em> Selecteer meerdere losse dagen",
            "   • <em>Shift+klik:</em> Selecteer een heel bereik (van → naar)",
            "   • <em>Dubbelklik:</em> Open direct een actie voor die dag",
            "🔍 <strong>Zoek & filter sneltoetsen:</strong>",
            "   • <em>Ctrl+F:</em> Zoek op de pagina",
            "   • <em>Tab:</em> Spring naar het volgende invoerveld",
            "   • <em>Escape:</em> Sluit open menus/formulieren",
            "⚡ <strong>Snelle acties:</strong>",
            "   • <em>Rechtsklik:</em> Snelmenu op geselecteerde dag(en) - snelste manier!",
            "   • <em>FAB:</em> De ronde knop voor algemene acties",
            "   • <em>Spatie:</em> Open FAB menu (als er niks geselecteerd is)",
            "   • <em>Enter:</em> Bevestig actie in een formulier",
            "   • <em>Escape:</em> Annuleer wat je aan het doen bent",
            "🔄 <strong>Systeem sneltoetsen:</strong>",
            "   • <em>F5 of Ctrl+R:</em> Ververs de pagina voor nieuwe gegevens",
            "   • <em>Ctrl+Shift+R:</em> Hard refresh (cache wissen)",
            "   • <em>Ctrl + (plus):</em> Zoom in op de pagina",
            "   • <em>Ctrl - (min):</em> Zoom uit op de pagina"
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
        
        // Remove demo highlights
        this.cleanupDemoElements();
        
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

    // Clean up demo elements
    cleanupDemoElements() {
        document.querySelectorAll('.tutorial-demo-highlight, .tutorial-demo-click').forEach(el => {
            el.classList.remove('tutorial-demo-highlight', 'tutorial-demo-click');
        });
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
        
        // Clean up previous demo elements
        this.cleanupDemoElements();
        
        this.currentStep = stepIndex;
        const step = tutorialSteps[stepIndex];
        
        // Highlight target element
        const targetElement = highlightElement(step.targetId);
        
        // Execute demo actions if specified
        if (step.demoActions) {
            this.executeDemoActions(step.demoActions, targetElement);
        }
        
        // Create or update tooltip with a slight delay to ensure smooth positioning
        setTimeout(() => {
            this.createTooltip(step, targetElement);
        }, 200);
    }

    // Execute demo actions for interactive examples
    executeDemoActions(actions, targetElement) {
        actions.forEach((action, index) => {
            setTimeout(() => {
                switch (action.type) {
                    case 'highlight':
                        // Find a specific cell for org\busselw if available
                        const targetCell = this.findDemonstrationCell();
                        if (targetCell) {
                            targetCell.classList.add('tutorial-demo-highlight');
                            console.log('🎯 Demo:', action.description);
                        }
                        break;
                    case 'click':
                        if (targetElement) {
                            // Simulate a visual click effect
                            targetElement.classList.add('tutorial-demo-click');
                            setTimeout(() => {
                                targetElement.classList.remove('tutorial-demo-click');
                            }, 300);
                        }
                        break;
                    case 'openModal':
                        // This would be called when showing form examples
                        console.log('🎯 Demo: Opening example modal for', action.description);
                        break;
                }
            }, index * 1000); // Stagger actions by 1 second
        });
    }

    // Find a suitable cell for demonstration
    findDemonstrationCell() {
        // Look for a cell in the first few rows that's not a weekend
        const cells = document.querySelectorAll('.dag-cel:not(.weekend)');
        if (cells.length > 0) {
            return cells[0]; // Return first suitable cell
        }
        
        // Fallback to any cell
        const anyCells = document.querySelectorAll('td.dag-kolom:not(.weekend)');
        return anyCells.length > 0 ? anyCells[0] : null;
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
                    '<button class="tutorial-btn tutorial-btn-secondary" id="tutorial-prev">⬅️ Vorige</button>' : 
                    '<button class="tutorial-btn-skip" id="tutorial-skip">⏭️ Overslaan</button>'}
                <button class="tutorial-btn tutorial-btn-primary" id="tutorial-next">
                    ${this.currentStep < this.totalSteps - 1 ? 'Volgende ➡️' : '🎉 Klaar!'}
                </button>
            </div>
            <div class="tutorial-progress">
                <span class="tutorial-progress-text">Stap ${this.currentStep + 1} van ${this.totalSteps}</span>
                ${this.createProgressDots()}
            </div>
            <button class="tutorial-btn-close" id="tutorial-close" title="Tour sluiten">✕</button>
        `;
        
        // Add to DOM temporarily positioned off-screen to measure dimensions
        this.tooltipElement.style.visibility = 'hidden';
        this.tooltipElement.style.position = 'absolute';
        this.tooltipElement.style.left = '-9999px';
        this.tooltipElement.style.top = '-9999px';
        document.body.appendChild(this.tooltipElement);
        
        // Position tooltip relative to target after measuring
        setTimeout(() => {
            this.positionTooltip(targetElement);
            this.tooltipElement.style.visibility = 'visible';
        }, 50);
        
        // Add event listeners
        this.addTooltipEventListeners();
    }

    // Get appropriate title for step
    getStepTitle(step) {
        // Default titles based on step index
        const defaultTitles = [
            "🎯 Welkom bij het Verlofrooster!",
            "📱 Hoofdnavigatie",
            "🛠️ Je Werkbalk",
            "📅 Door de Tijd Navigeren",
            "🔍 Zoeken & Filteren",
            "🎨 Kleuren Uitgelegd",
            "📊 Het Rooster Zelf",
            "👥 Al Je Collega's",
            "✨ Dagcellen - Hier Gebeurt Het!",
            "🚀 Snelle Acties",
            "🖱️ Rechtsklik Menu",
            "⚙️ Je Profiel",
            "🎉 Klaar!"
        ];
        
        return step.title || defaultTitles[this.currentStep] || `📋 Stap ${this.currentStep + 1}`;
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
        
        // Ensure tooltip is visible by scrolling viewport if needed
        this.ensureTooltipVisible(left, top, tooltipRect.width, tooltipRect.height);
    }

    // Ensure tooltip is visible in viewport by scrolling if necessary
    ensureTooltipVisible(tooltipLeft, tooltipTop, tooltipWidth, tooltipHeight) {
        const scrollPadding = 20; // Extra padding for better UX
        
        // Calculate tooltip bounds
        const tooltipRight = tooltipLeft + tooltipWidth;
        const tooltipBottom = tooltipTop + tooltipHeight;
        
        // Calculate current viewport
        const viewportLeft = window.pageXOffset;
        const viewportTop = window.pageYOffset;
        const viewportRight = viewportLeft + window.innerWidth;
        const viewportBottom = viewportTop + window.innerHeight;
        
        // Calculate needed scroll adjustments
        let scrollX = 0;
        let scrollY = 0;
        
        // Horizontal scrolling
        if (tooltipLeft < viewportLeft + scrollPadding) {
            scrollX = tooltipLeft - scrollPadding - viewportLeft;
        } else if (tooltipRight > viewportRight - scrollPadding) {
            scrollX = tooltipRight + scrollPadding - viewportRight;
        }
        
        // Vertical scrolling
        if (tooltipTop < viewportTop + scrollPadding) {
            scrollY = tooltipTop - scrollPadding - viewportTop;
        } else if (tooltipBottom > viewportBottom - scrollPadding) {
            scrollY = tooltipBottom + scrollPadding - viewportBottom;
        }
        
        // Smooth scroll to keep tooltip visible
        if (scrollX !== 0 || scrollY !== 0) {
            window.scrollBy({
                left: scrollX,
                top: scrollY,
                behavior: 'smooth'
            });
        }
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
        
        // Reposition tooltip with smooth scrolling adjustment
        if (this.isActive && this.tooltipElement) {
            const targetElement = document.querySelector('.tutorial-highlight-active');
            if (targetElement) {
                // Add a small delay to allow the resize to complete
                setTimeout(() => {
                    this.positionTooltip(targetElement);
                }, 100);
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