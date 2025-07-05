// tutorial.js - Interactieve tour voor het Team Rooster systeem
// Enhanced version focusing on the most important UI elements and user actions
// Provides practical examples and actionable guidance for effective onboarding

export const tutorialSteps = [
    {
        targetId: 'root',
        message: "🎉 Welkom bij het Verlofrooster systeem! Deze interactieve tour toont je in 13 stappen hoe je verlof plant, het rooster navigeert en snel acties uitvoert. Klaar om te beginnen?",
    },
    {
        targetId: 'header',
        message: "📱 Dit is de hoofdheader. Links vind je 'Melding' om problemen te rapporteren, en rechts zie je knoppen voor verschillende beheercentra (admin, beheer, behandelen) - afhankelijk van je toegangsrechten.",
    },
    {
        targetId: 'toolbar',
        message: "🛠️ De toolbar is jouw controlecentrum! Hier vind je periode-navigatie, weergave-opties (week/maand), filters voor medewerkers en teams, plus de legenda met alle verloftypen.",
    },
    {
        targetId: 'periode-navigatie',
        message: "📅 <strong>Tijd reizen door het rooster:</strong><br>• Gebruik ⬅️➡️ pijltjes om tussen periodes te gaan<br>• Schakel tussen 'Week' (7 dagen detail) en 'Maand' (overzicht)<br>• <em>Tip: Weekweergave is handig voor planning, maand voor overzicht!</em>",
    },
    {
        targetId: 'filter-groep',  
        message: "🔍 <strong>Zoeken en filteren:</strong><br>• Zoek specifieke medewerkers: typ bijv. 'Bussel' of 'Jansen'<br>• Filter per team via de dropdown<br>• <em>Voorbeeld: selecteer 'IT-team' om alleen IT-medewerkers te zien</em>",
    },
    {
        targetId: 'legenda-container',
        message: "🎨 <strong>Kleurcode legenda:</strong> Hier zie je wat alle kleuren betekenen:<br>• <span style='color: green'>VER = Verlof</span> (vakantie)<br>• <span style='color: red'>ZK = Ziek</span><br>• <span style='color: blue'>CU = Compensatie-uren</span><br>• <span style='color: orange'>ZV = Zittingsvrij</span><br>Onthoud deze kleuren voor snelle herkenning!",
    },
    {
        targetId: 'rooster-table',
        message: "📊 <strong>Het hoofdrooster - waar alles gebeurt!</strong><br>• Elke rij = een medewerker<br>• Elke kolom = een dag<br>• Kleuren tonen verloftypen<br>• Weekenden en feestdagen hebben andere achtergronden",
    },
    {
        targetId: 'medewerker-kolom',
        message: "👥 <strong>Medewerkerskolom:</strong><br>• Profielfoto's en namen<br>• Gegroepeerd per team (verschillende kleuren)<br>• Teamleiders worden speciaal gemarkeerd<br>• <em>Tip: Teams hebben eigen kleuren voor snelle herkenning</em>",
    },
    {
        targetId: 'dag-cel',
        message: "✨ <strong>Dagcellen - hier gebeurt de magie!</strong><br><strong>Praktische voorbeelden:</strong><br>• <strong>Eén klik:</strong> Selecteer deze dag voor org\\busselw<br>• <strong>Tweekliks:</strong> Klik hier, dan op een andere dag = periode selecteren<br>• <strong>Rechtsklik:</strong> Open actiemenu (verlof, ziek melden, etc.)<br>• <strong>Shift+klik:</strong> Selecteer bereik van dagen",
        demoActions: [
            {
                type: 'highlight',
                description: 'We markeren een voorbeeldcel voor org\\busselw'
            }
        ]
    },
    {
        targetId: 'fab-container',
        message: "🚀 <strong>Floating Action Button (FAB) - snelle acties:</strong><br>• 📝 <strong>Verlof aanvragen:</strong> Plan je vakantie<br>• 🤒 <strong>Ziek melden:</strong> Voor vandaag of een periode<br>• ⏰ <strong>Compensatie-uren:</strong> Overwerk doorgeven<br>• 🏛️ <strong>Zittingsvrij:</strong> Rechterlijke dagen<br><em>Probeer: klik op de FAB om alle opties te zien!</em>",
    },
    {
        targetId: 'dag-cel',
        message: "🖱️ <strong>Context Menu - Rechtsklik Acties:</strong><br><strong>Pro tip:</strong> Rechtsklik op een dagcel voor hetzelfde menu als de FAB!<br>• <strong>Voordeel:</strong> Direct gekoppeld aan de geselecteerde dag(en)<br>• <strong>Sneller:</strong> Geen extra navigatie nodig<br>• <strong>Context-bewust:</strong> Toont relevante opties voor die specifieke dag<br><em>Probeer: rechtsklik op een dagcel om het contextmenu te zien</em>",
        demoActions: [
            {
                type: 'highlight',
                description: 'We markeren een dagcel waar je kunt rechtsklikken'
            }
        ]
    },
    {
        targetId: 'user-dropdown',
        message: "⚙️ <strong>Je persoonlijke menu:</strong><br>• Zie je naam en profielfoto<br>• Teamleider info (indien van toepassing)<br>• <strong>Klik erop</strong> voor toegang tot persoonlijke instellingen<br>• Beheer werktijden, voorkeuren en profiel",
    },
    {
        targetId: 'nav-buttons-right',
        message: "🔧 <strong>Laatste stap - Beheercentra:</strong><br>Afhankelijk van je rechten zie je hier:<br>• <strong>Admin:</strong> Systeem beheer (voor beheerders)<br>• <strong>Beheer:</strong> Functioneel beheer<br>• <strong>Behandelen:</strong> Verzoeken afhandelen (voor leidinggevenden)<br>• <strong>Help:</strong> Deze tour herhalen, handleiding en FAQ<br><br>🎉 <strong>Je bent klaar!</strong> Begin met plannen!",
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

// Extra uitleg per onderwerp met praktische voorbeelden
export const tutorialTopics = {
    verlofAanvragen: {
        title: "Verlof Aanvragen - Stap voor Stap",
        steps: [
            "🎯 <strong>Stap 1:</strong> Selecteer je gewenste periode:",
            "   • <em>Enkele dag:</em> Klik op bijv. maandag 15 juli",
            "   • <em>Periode:</em> Klik op startdag → klik op einddag", 
            "   • <em>Tip:</em> Shift+klik selecteert automatisch alles ertussen",
            "🖱️ <strong>Stap 2:</strong> Open het verlofformulier:",
            "   • <strong>Methode 1:</strong> Rechtsklik op geselecteerde dag(en) → 'Verlof aanvragen'",
            "   • <strong>Methode 2:</strong> Gebruik de blauwe FAB knop (➕) rechtsonder",
            "   • <em>Tip:</em> Rechtsklik is sneller, FAB is handig als je geen selectie hebt",
            "📝 <strong>Stap 3:</strong> Vul het formulier in voor org\\busselw:",
            "   • <em>Verloftype:</em> Vakantie, Kort verzuim, Verlof zonder behoud van salaris",
            "   • <em>Periode controle:</em> Check of data kloppen (bijv. 15-19 juli)",
            "   • <em>Opmerking:</em> 'Familievakantie naar Frankrijk' of 'Doktersafspraak'",
            "   • <em>Halve dagen:</em> Vink aan voor ochtend/middag vrij",
            "✅ <strong>Stap 4:</strong> Verstuur je verzoek:",
            "   • Klik 'Opslaan' - je verzoek wordt ter goedkeuring ingediend",
            "   • Je ziet direct een preview in het rooster (meestal geel = 'in afwachting')",
            "   • Je manager krijgt automatisch een notificatie"
        ]
    },
    ziekMelden: {
        title: "Ziek Melden - Snel en Eenvoudig", 
        steps: [
            "🚨 <strong>Voor vandaag (meest gebruikt):</strong>",
            "   • Zoek je eigen rij in het rooster",
            "   • Klik op vandaag's datum in je rij",
            "   • Rechtsklik → 'Ziek melden'",
            "� <strong>Voor meerdere dagen:</strong>",
            "   • Selecteer startdag (bijv. maandag) → einddag (bijv. woensdag)",
            "   • Rechtsklik → 'Ziek melden'",
            "📝 <strong>Formulier invullen:</strong>",
            "   • <em>Type:</em> Ziek, Doktersbezoek, Ziekte kind",
            "   • <em>Opmerking:</em> 'Griep' of 'Tandarts afspraak' (optioneel)",
            "   • <em>Halve dag:</em> Vink aan als je maar ochtend/middag ziek bent",
            "⚡ <strong>Direct zichtbaar:</strong>",
            "   • Ziekmeldingen zijn meteen zichtbaar (meestal rood)",
            "   • Geen goedkeuring nodig - direct actief",
            "   • Leidinggevende krijgt automatisch bericht"
        ]
    },
    compensatieUren: {
        title: "Compensatie-uren Beheren",
        steps: [
            "⏰ <strong>Overuren registreren:</strong>",
            "   • Selecteer de werkdag(en) waar je extra uren maakte",
            "   • Bijvoorbeeld: klik op afgelopen vrijdag in je rij",
            "📋 <strong>Formulier openen:</strong>",
            "   • <strong>Methode 1:</strong> Rechtsklik → 'Compensatieuren doorgeven'",
            "   • <strong>Methode 2:</strong> Gebruik FAB knop → 'Compensatieuren'",
            "   • <em>Voorkeur:</em> Rechtsklik is directer en contextbewuster",
            "🔢 <strong>Details invullen voor org\\busselw:</strong>",
            "   • <em>Type:</em> Overuren, Ruildag, Extra dienst, Reistijd",
            "   • <em>Aantal uren:</em> bijv. 2,5 uur (gebruik komma, niet punt)",
            "   • <em>Beschrijving:</em> 'Avonddienst vanwege spoedklus X123'",
            "   • <em>Datum/tijd:</em> Wanneer de extra uren zijn gemaakt",
            "💾 <strong>Opslaan en zien:</strong>",
            "   • Compensatie-uren verschijnen als blauwe blokjes in het rooster",
            "   • Plus/min uren worden bijgehouden in je saldo",
            "   • Leidinggevende kan deze goedkeuren of aanpassen"
        ]
    },
    navigatie: {
        title: "Slim Navigeren door het Rooster",
        steps: [
            "📅 <strong>Tussen periodes bewegen:</strong>",
            "   • ⬅️➡️ Pijltjes: ga naar vorige/volgende week of maand",
            "   • <em>Sneltoets:</em> Gebruik pijltjestoetsen op je keyboard",
            " <strong>Weergave optimaliseren:</strong>",
            "   • <em>'Week' weergave:</em> Perfect voor gedetailleerde planning (7 dagen)",
            "   • <em>'Maand' weergave:</em> Overzicht van 30+ dagen tegelijk",
            "   • <em>Tip:</em> Wissel vaak tussen beide voor beste resultaat",
            "🔍 <strong>Zoeken en filteren:</strong>",
            "   • <em>Zoeken:</em> Typ 'Jansen' om alle Jansens te vinden",
            "   • <em>Team filter:</em> Selecteer 'IT-team' → zie alleen IT-medewerkers",
            "   • <em>Combinatie:</em> Filter op team + zoek op naam voor precisie",
            "🎨 <strong>Kleuren herkennen:</strong>",
            "   • Gebruik de legenda om snel verloftypen te herkennen",
            "   • <em>Groen:</em> Goedgekeurd verlof",
            "   • <em>Geel:</em> In afwachting van goedkeuring",
            "   • <em>Rood:</em> Ziek of afgewezen",
            "💡 <strong>Pro tips:</strong>",
            "   • <em>Ctrl+klik:</em> Selecteer meerdere losse dagen",
            "   • <em>Shift+klik:</em> Selecteer een heel bereik",
            "   • <em>Dubbelklik:</em> Zoom in op specifieke dag"
        ]
    },
    shortcutKeys: {
        title: "Handige Sneltoetsen & Trucs",
        steps: [
            "⌨️ <strong>Navigatie sneltoetsen:</strong>",
            "   • <em>Pijltjes (← →):</em> Vorige/volgende periode",
            "   • <em>Pijltjes (↑ ↓):</em> Scroll door medewerkerslijst",
            "   • <em>Home/End:</em> Ga naar begin/eind van jaar",
            "🖱️ <strong>Muis combinaties:</strong>",
            "   • <em>Ctrl+klik:</em> Selecteer meerdere losse dagen",
            "   • <em>Shift+klik:</em> Selecteer bereik (van → naar)",
            "   • <em>Dubbelklik:</em> Open snelle actie voor die dag",
            "🔍 <strong>Zoek & filter shortcuts:</strong>",
            "   • <em>Ctrl+F:</em> Browserpagina doorzoeken",
            "   • <em>Tab:</em> Spring naar volgende invoerveld",
            "   • <em>Escape:</em> Sluit open modals/dropdowns",
            "⚡ <strong>Snelle acties:</strong>",
            "   • <em>Rechtsklik:</em> Contextmenu op geselecteerde dag(en) - snelste methode",
            "   • <em>FAB:</em> Floating Action Button voor globale acties",
            "   • <em>Spatie:</em> Open FAB menu (als niks geselecteerd)",
            "   • <em>Enter:</em> Bevestig actie in open formulier",
            "   • <em>Escape:</em> Annuleer huidige actie",
            "🔄 <strong>Systeem shortcuts:</strong>",
            "   • <em>F5 of Ctrl+R:</em> Ververs pagina voor laatste data",
            "   • <em>Ctrl+Shift+R:</em> Hard refresh (cache wissen)",
            "   • <em>Ctrl + (plus):</em> Zoom in op pagina",
            "   • <em>Ctrl - (min):</em> Zoom uit op pagina"
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
        
        // Create or update tooltip
        this.createTooltip(step, targetElement);
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
            "🎯 Welkom bij het Verlofrooster!",
            "📱 Header & Hoofdnavigatie",
            "🛠️ Jouw Controlecentrum",
            "📅 Tijd Navigeren",
            "🔍 Zoeken & Filteren",
            "🎨 Kleurcode Legenda",
            "📊 Het Hoofdrooster",
            "👥 Medewerkers & Teams",
            "✨ Dagcellen - De Kern van het Systeem",
            "🚀 Snelle Acties (FAB)",
            "🖱️ Context Menu - Rechtsklik Magie",
            "⚙️ Persoonlijk Menu",
            "🔧 Beheer & Voltooiing"
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