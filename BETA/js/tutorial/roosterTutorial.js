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