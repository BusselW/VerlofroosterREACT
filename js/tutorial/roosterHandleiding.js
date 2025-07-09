// roosterHandleiding.js - Uitgebreide handleiding voor het Verlofrooster systeem
// Modal-style manual with detailed function descriptions and usage instructions

export const handleidingContent = {
    algemeen: {
        title: "📋 Algemene Informatie",
        icon: "📋",
        sections: [
            {
                title: "Wat is het Verlofrooster?",
                content: `
                    <p>Het Verlofrooster is een webgebaseerd systeem waarmee je gemakkelijk verlof kunt aanvragen, 
                    ziekmeldingen kunt doen en compensatie-uren kunt bijhouden. Het systeem biedt een duidelijk 
                    overzicht van alle medewerkers en hun planning.</p>
                    
                    <h4>🎯 Hoofdfuncties:</h4>
                    <ul>
                        <li><strong>Verlof aanvragen:</strong> Plan je vakantiedagen en vrije tijd</li>
                        <li><strong>Ziek melden:</strong> Snel en eenvoudig ziekmeldingen doen</li>
                        <li><strong>Compensatie-uren:</strong> Overuren en extra diensten registreren</li>
                        <li><strong>Zittingsvrije dagen:</strong> Speciale vrije dagen voor juridische functies</li>
                        <li><strong>Overzicht behouden:</strong> Zie in één oogopslag wie wanneer weg is</li>
                    </ul>
                `
            },
            {
                title: "Toegangsrechten en Rollen",
                content: `
                    <p>Het systeem werkt met verschillende toegangsniveaus:</p>
                    
                    <h4>👤 Medewerker (Basis)</h4>
                    <ul>
                        <li>Eigen verlof aanvragen en beheren</li>
                        <li>Ziekmeldingen doen</li>
                        <li>Compensatie-uren registreren</li>
                        <li>Rooster bekijken van eigen team</li>
                    </ul>
                    
                    <h4>👥 Teamleider/Leidinggevende</h4>
                    <ul>
                        <li>Alle rechten van medewerker</li>
                        <li>Verlofaanvragen goedkeuren/afwijzen</li>
                        <li>Verlof aanvragen voor teamleden</li>
                        <li>Compensatie-uren van team beheren</li>
                        <li>Uitgebreid overzicht van teamplanning</li>
                    </ul>
                    
                    <h4>⚙️ Functioneel Beheerder</h4>
                    <ul>
                        <li>Alle rechten van teamleider</li>
                        <li>Systeeminstellingen aanpassen</li>
                        <li>Teams en medewerkers beheren</li>
                        <li>Verloftypen en regels configureren</li>
                    </ul>
                    
                    <h4>🛠️ Technisch Beheerder</h4>
                    <ul>
                        <li>Volledige systeemtoegang</li>
                        <li>Technische configuratie</li>
                        <li>Gebruikersbeheer en rechten</li>
                        <li>Systeem monitoring en onderhoud</li>
                    </ul>
                `
            }
        ]
    },
    
    navigatie: {
        title: "🧭 Navigatie en Interface",
        icon: "🧭",
        sections: [
            {
                title: "Hoofdnavigatie",
                content: `
                    <h4>📱 Header (Bovenbalk)</h4>
                    <p>De hoofdnavigatie bevat de belangrijkste knoppen en informatie:</p>
                    <ul>
                        <li><strong>Links:</strong> Melding knop voor problemen rapporteren</li>
                        <li><strong>Midden:</strong> Logo en titel van het systeem</li>
                        <li><strong>Rechts:</strong> Beheercentra (afhankelijk van je rechten)</li>
                    </ul>
                    
                    <h4>🛠️ Werkbalk (Toolbar)</h4>
                    <p>Je controlecentrum voor het rooster:</p>
                    <ul>
                        <li><strong>Periode navigatie:</strong> Pijltjes om door tijd te navigeren</li>
                        <li><strong>Weergave switch:</strong> Schakel tussen Week en Maand weergave</li>
                        <li><strong>Zoekfunctie:</strong> Zoek specifieke medewerkers</li>
                        <li><strong>Team filter:</strong> Filter op specifieke teams</li>
                        <li><strong>Legenda:</strong> Kleuruitleg voor verschillende verloftypen</li>
                    </ul>
                `
            },
            {
                title: "Rooster Weergaves",
                content: `
                    <h4>📅 Week Weergave</h4>
                    <p><strong>Wanneer gebruiken:</strong> Voor gedetailleerde planning en dagelijkse overzichten</p>
                    <ul>
                        <li>Toont 7 dagen (maandag t/m zondag)</li>
                        <li>Gedetailleerde informatie per dag</li>
                        <li>Ideaal voor korte termijn planning</li>
                        <li>Toont exacte tijden en details</li>
                    </ul>
                    
                    <h4>📊 Maand Weergave</h4>
                    <p><strong>Wanneer gebruiken:</strong> Voor lange termijn overzicht en planning</p>
                    <ul>
                        <li>Toont volledige maand (28-31 dagen)</li>
                        <li>Compact overzicht van alle verlof</li>
                        <li>Ideaal voor maandelijkse planning</li>
                        <li>Snelle identificatie van drukke periodes</li>
                    </ul>
                    
                    <h4>🎨 Kleurcodering</h4>
                    <p>Elk verloftype heeft zijn eigen kleur voor snelle herkenning:</p>
                    <ul>
                        <li><span style="color: green; font-weight: bold;">🟢 VER (Groen):</span> Goedgekeurd verlof</li>
                        <li><span style="color: orange; font-weight: bold;">🟠 VER (Oranje):</span> Verlof in afwachting</li>
                        <li><span style="color: red; font-weight: bold;">🔴 ZK (Rood):</span> Ziekmeldingen</li>
                        <li><span style="color: blue; font-weight: bold;">🔵 CU (Blauw):</span> Compensatie-uren</li>
                        <li><span style="color: purple; font-weight: bold;">🟣 ZV (Paars):</span> Zittingsvrije dagen</li>
                    </ul>
                `
            }
        ]
    },
    
    verlofAanvragen: {
        title: "📝 Verlof Aanvragen",
        icon: "📝",
        sections: [
            {
                title: "Stap-voor-stap Verlof Aanvragen",
                content: `
                    <h4>🎯 Voorbereiding</h4>
                    <ol>
                        <li>Check beschikbare verlofdagen in je profiel</li>
                        <li>Overleg met je team over drukke periodes</li>
                        <li>Plan verlof minimaal 2 weken van tevoren (behalve bij spoed)</li>
                    </ol>
                    
                    <h4>📅 Periode Selecteren</h4>
                    <p><strong>Enkele dag:</strong></p>
                    <ul>
                        <li>Klik op de gewenste dag in je rij</li>
                        <li>Dag wordt blauw gemarkeerd</li>
                    </ul>
                    
                    <p><strong>Meerdere dagen:</strong></p>
                    <ul>
                        <li><strong>Methode 1:</strong> Klik startdag → klik einddag</li>
                        <li><strong>Methode 2:</strong> Klik startdag → Shift+klik einddag</li>
                        <li><strong>Methode 3:</strong> Ctrl+klik voor losse dagen</li>
                    </ul>
                    
                    <h4>🖱️ Formulier Openen</h4>
                    <p><strong>Snelste methode:</strong> Rechtsklik op geselecteerde dag(en) → 'Verlof aanvragen'</p>
                    <p><strong>Alternatief:</strong> Gebruik de ronde knop (FAB) rechtsonder → 'Verlof aanvragen'</p>
                `
            },
            {
                title: "Verlofformulier Invullen",
                content: `
                    <h4>📋 Verplichte Velden</h4>
                    <p><strong>Verloftype:</strong> Kies het juiste type verlof</p>
                    <ul>
                        <li><strong>Vakantie:</strong> Reguliere vakantiedagen</li>
                        <li><strong>Kort verzuim:</strong> Bijzonder verlof (dokter, uitvaart, etc.)</li>
                        <li><strong>Verlof zonder behoud van salaris:</strong> Onbetaald verlof</li>
                        <li><strong>Studieverlof:</strong> Voor opleidingen en cursussen</li>
                        <li><strong>Zwangerschaps-/bevallingsverlof:</strong> Voor aanstaande moeders</li>
                    </ul>
                    
                    <p><strong>Periode:</strong> Controleer de geselecteerde data</p>
                    <ul>
                        <li>Startdatum en einddatum worden automatisch ingevuld</li>
                        <li>Pas aan indien nodig</li>
                        <li>Let op weekenden en feestdagen</li>
                    </ul>
                    
                    <h4>📝 Optionele Velden</h4>
                    <p><strong>Opmerking:</strong> Geef extra informatie over je verlof</p>
                    <ul>
                        <li><em>Voorbeelden:</em> "Familievakantie naar Frankrijk", "Doktersafspraak specialist"</li>
                        <li>Helpt je manager bij het beoordelen van de aanvraag</li>
                        <li>Verplicht bij kort verzuim</li>
                    </ul>
                    
                    <p><strong>Halve dagen:</strong> Voor gedeeltelijk verlof</p>
                    <ul>
                        <li><strong>Ochtend vrij:</strong> Vrij tot 12:00</li>
                        <li><strong>Middag vrij:</strong> Vrij vanaf 12:00</li>
                        <li>Handig voor doktersafspraken of persoonlijke zaken</li>
                    </ul>
                `
            },
            {
                title: "Goedkeuringsproces",
                content: `
                    <h4>✅ Na het Indienen</h4>
                    <ol>
                        <li><strong>Bevestiging:</strong> Je krijgt direct een bevestiging op scherm</li>
                        <li><strong>Zichtbaarheid:</strong> Aanvraag verschijnt in oranje in het rooster</li>
                        <li><strong>Notificatie:</strong> Je manager krijgt automatisch een melding</li>
                        <li><strong>E-mail:</strong> Je ontvangt een bevestigings-e-mail</li>
                    </ol>
                    
                    <h4>⏳ Behandeling door Leidinggevende</h4>
                    <ul>
                        <li><strong>Goedkeuring:</strong> Verlof wordt groen in het rooster</li>
                        <li><strong>Afwijzing:</strong> Je krijgt bericht met reden</li>
                        <li><strong>Termijn:</strong> Behandeling binnen 5 werkdagen</li>
                        <li><strong>Spoed:</strong> Bij urgentie direct contact opnemen</li>
                    </ul>
                    
                    <h4>📧 Notificaties</h4>
                    <p>Je wordt op de hoogte gehouden via:</p>
                    <ul>
                        <li>E-mail notificaties</li>
                        <li>Kleurveranderingen in het rooster</li>
                        <li>Systeem meldingen bij inloggen</li>
                    </ul>
                `
            }
        ]
    },
    
    ziekMelden: {
        title: "🤒 Ziek Melden",
        icon: "🤒",
        sections: [
            {
                title: "Wanneer en Hoe Ziek Melden",
                content: `
                    <h4>🚨 Wanneer Ziek Melden?</h4>
                    <ul>
                        <li><strong>Bij ziekte:</strong> Wanneer je door ziekte niet kunt werken</li>
                        <li><strong>Doktersbezoek:</strong> Voor medische afspraken tijdens werktijd</li>
                        <li><strong>Ziekte kind:</strong> Wanneer je thuis moet blijven voor ziek kind</li>
                        <li><strong>Medische behandeling:</strong> Voor geplande medische ingrepen</li>
                    </ul>
                    
                    <h4>⏰ Timing</h4>
                    <ul>
                        <li><strong>Zo snel mogelijk:</strong> Liefst voor 09:00 op de dag zelf</li>
                        <li><strong>Telefonisch:</strong> Bel eerst je leidinggevende bij acute ziekte</li>
                        <li><strong>Systeem:</strong> Registreer vervolgens in het rooster</li>
                        <li><strong>Vooraf:</strong> Doktersafspraken kun je van tevoren inplannen</li>
                    </ul>
                `
            },
            {
                title: "Ziekmelding Proces",
                content: `
                    <h4>📅 Voor Vandaag (Meest Voorkomend)</h4>
                    <ol>
                        <li>Zoek je eigen rij in het rooster</li>
                        <li>Klik op vandaag's datum</li>
                        <li>Rechtsklik → 'Ziek melden'</li>
                        <li>Formulier invullen</li>
                        <li>Versturen</li>
                    </ol>
                    
                    <h4>📆 Voor Meerdere Dagen</h4>
                    <ol>
                        <li>Selecteer startdag (bijv. maandag)</li>
                        <li>Selecteer einddag (bijv. woensdag)</li>
                        <li>Rechtsklik → 'Ziek melden'</li>
                        <li>Formulier invullen voor hele periode</li>
                    </ol>
                    
                    <h4>📝 Formulier Invullen</h4>
                    <p><strong>Type ziekte/afwezigheid:</strong></p>
                    <ul>
                        <li><strong>Ziek:</strong> Algemene ziekte</li>
                        <li><strong>Doktersbezoek:</strong> Medische afspraak</li>
                        <li><strong>Ziekte kind:</strong> Zorg voor ziek kind</li>
                        <li><strong>Medische behandeling:</strong> Operatie, therapie, etc.</li>
                    </ul>
                    
                    <p><strong>Opmerking (optioneel):</strong></p>
                    <ul>
                        <li>"Griep", "Tandarts", "Kind heeft koorts"</li>
                        <li>Kort en zakelijk houden</li>
                        <li>Geen medische details verplicht</li>
                    </ul>
                    
                    <p><strong>Halve dag:</strong></p>
                    <ul>
                        <li>Vink aan als je maar gedeeltelijk ziek bent</li>
                        <li>Bijv. voor doktersafspraak van 2 uur</li>
                    </ul>
                `
            },
            {
                title: "Na de Ziekmelding",
                content: `
                    <h4>⚡ Direct Actief</h4>
                    <ul>
                        <li><strong>Geen goedkeuring nodig:</strong> Ziekmeldingen zijn direct actief</li>
                        <li><strong>Zichtbaar:</strong> Verschijnt rood in het rooster</li>
                        <li><strong>Notificatie:</strong> Leidinggevende krijgt automatisch bericht</li>
                        <li><strong>Registratie:</strong> Wordt automatisch geregistreerd in je dossier</li>
                    </ul>
                    
                    <h4>🔄 Wijzigingen</h4>
                    <ul>
                        <li><strong>Verlengen:</strong> Nieuwe ziekmelding maken voor extra dagen</li>
                        <li><strong>Verkorten:</strong> Contact opnemen met leidinggevende</li>
                        <li><strong>Annuleren:</strong> Rechtsklik op ziekmelding → 'Verwijderen'</li>
                    </ul>
                    
                    <h4>📋 Beter Melden</h4>
                    <ul>
                        <li><strong>Herstel:</strong> Meld je beter zodra je weer kunt werken</li>
                        <li><strong>Gradueel:</strong> Overweeg eerst halve dagen bij gedeeltelijk herstel</li>
                        <li><strong>Communicatie:</strong> Houd contact met je leidinggevende</li>
                        <li><strong>Werkhervatting:</strong> Plan eventuele inwerktijd in</li>
                    </ul>
                `
            }
        ]
    },
    
    compensatieUren: {
        title: "⏰ Compensatie-uren",
        icon: "⏰",
        sections: [
            {
                title: "Wat zijn Compensatie-uren?",
                content: `
                    <h4>💡 Definitie</h4>
                    <p>Compensatie-uren zijn extra gewerkte uren bovenop je normale werktijd die je later kunt opnemen als vrije tijd.</p>
                    
                    <h4>📋 Soorten Compensatie-uren</h4>
                    <ul>
                        <li><strong>Overuren:</strong> Langer doorwerken dan je normale werktijden</li>
                        <li><strong>Ruildag:</strong> Werken op je vrije dag</li>
                        <li><strong>Extra dienst:</strong> Extra taken buiten normale werkzaamheden</li>
                        <li><strong>Reistijd:</strong> Reizen voor werk buiten kantooruren</li>
                        <li><strong>Weekend werk:</strong> Werken in het weekend</li>
                        <li><strong>Avond/nacht dienst:</strong> Werken buiten normale kantooruren</li>
                    </ul>
                    
                    <h4>⚖️ Compensatie Regels</h4>
                    <ul>
                        <li><strong>1:1 compensatie:</strong> 1 gewerkt uur = 1 compensatie uur</li>
                        <li><strong>Weekend toeslag:</strong> Mogelijk 1,5x compensatie voor weekendwerk</li>
                        <li><strong>Avond toeslag:</strong> Extra compensatie voor avondwerk</li>
                        <li><strong>Maximaal saldo:</strong> Meestal max 40-80 uur opsparen</li>
                    </ul>
                `
            },
            {
                title: "Compensatie-uren Registreren",
                content: `
                    <h4>📅 Wanneer Registreren?</h4>
                    <ul>
                        <li><strong>Direct na het werk:</strong> Zo snel mogelijk na de extra uren</li>
                        <li><strong>Uiterlijk binnen 1 week:</strong> Voor administratieve verwerking</li>
                        <li><strong>Voor maandsluiting:</strong> Alle uren van de maand registreren</li>
                    </ul>
                    
                    <h4>🖱️ Registratie Proces</h4>
                    <ol>
                        <li><strong>Dag selecteren:</strong> Klik op de dag waarop je extra uren hebt gemaakt</li>
                        <li><strong>Menu openen:</strong> Rechtsklik → 'Compensatieuren doorgeven'</li>
                        <li><strong>Formulier invullen:</strong> Vul alle gegevens in</li>
                        <li><strong>Versturen:</strong> Klik 'Opslaan'</li>
                    </ol>
                    
                    <h4>📝 Formulier Velden</h4>
                    <p><strong>Type compensatie:</strong> Selecteer het juiste type</p>
                    <p><strong>Aantal uren:</strong> Gebruik komma voor decimalen (bijv. 2,5)</p>
                    <p><strong>Beschrijving:</strong> Korte uitleg van de werkzaamheden</p>
                    <ul>
                        <li><em>Voorbeelden:</em> "Avonddienst spoedklus X123", "Weekend onderhoud server"</li>
                        <li>Voldoende detail voor controle</li>
                        <li>Verwijs naar projectnummer indien van toepassing</li>
                    </ul>
                    <p><strong>Tijd periode:</strong> Begin- en eindtijd van de extra uren</p>
                `
            },
            {
                title: "Compensatie-uren Opnemen",
                content: `
                    <h4>💰 Saldo Beheer</h4>
                    <ul>
                        <li><strong>Saldo check:</strong> Bekijk je huidige saldo in je profiel</li>
                        <li><strong>Plus uren:</strong> Gespaarde compensatie-uren</li>
                        <li><strong>Min uren:</strong> Opgenomen compensatie-uren</li>
                        <li><strong>Balans:</strong> Positief saldo = tijd tegoed, negatief = tijd schuld</li>
                    </ul>
                    
                    <h4>📅 Opnemen van Uren</h4>
                    <ol>
                        <li><strong>Planning:</strong> Plan compensatie-uren in overleg met je team</li>
                        <li><strong>Aanvragen:</strong> Via verlofaanvraag met type 'Compensatie-uren'</li>
                        <li><strong>Goedkeuring:</strong> Normale goedkeuringsprocedure</li>
                        <li><strong>Automatische verrekening:</strong> Uren worden automatisch afgetrokken</li>
                    </ol>
                    
                    <h4>⚠️ Belangrijk om te Weten</h4>
                    <ul>
                        <li><strong>Vervaltermijn:</strong> Uren vervallen vaak na 6-12 maanden</li>
                        <li><strong>Uitbetaling:</strong> Meestal geen uitbetaling, alleen tijdcompensatie</li>
                        <li><strong>Goedkeuring:</strong> Leidinggevende moet compensatie-uren goedkeuren</li>
                        <li><strong>Administratie:</strong> Houd je eigen registratie bij ter controle</li>
                    </ul>
                `
            }
        ]
    },
    
    tips: {
        title: "💡 Tips & Trucs",
        icon: "💡",
        sections: [
            {
                title: "Efficiënt Werken met het Rooster",
                content: `
                    <h4>⌨️ Sneltoetsen</h4>
                    <ul>
                        <li><strong>Ctrl + Klik:</strong> Selecteer meerdere losse dagen</li>
                        <li><strong>Shift + Klik:</strong> Selecteer een bereik van dagen</li>
                        <li><strong>Pijltjestoetsen:</strong> Navigeer door periodes</li>
                        <li><strong>F5:</strong> Ververs de pagina voor nieuwe gegevens</li>
                        <li><strong>Escape:</strong> Sluit open vensters en menu's</li>
                    </ul>
                    
                    <h4>🖱️ Rechtsklik Menu</h4>
                    <ul>
                        <li><strong>Snelste methode:</strong> Rechtsklik op dagcellen voor directe acties</li>
                        <li><strong>Context-bewust:</strong> Menu toont alleen relevante opties</li>
                        <li><strong>Tijd besparend:</strong> Geen extra navigatie nodig</li>
                    </ul>
                    
                    <h4>📱 Mobile Tips</h4>
                    <ul>
                        <li><strong>Tablet modus:</strong> Gebruik tablet in landscape voor beste ervaring</li>
                        <li><strong>Touch gestures:</strong> Lange tik = rechtsklik</li>
                        <li><strong>Zoom:</strong> Pinch-to-zoom voor betere leesbaarheid</li>
                    </ul>
                `
            },
            {
                title: "Beste Praktijken",
                content: `
                    <h4>📅 Planning Tips</h4>
                    <ul>
                        <li><strong>Vroeg plannen:</strong> Plan verlof minimaal 2 weken vooruit</li>
                        <li><strong>Team overleg:</strong> Check met collega's voor drukke periodes</li>
                        <li><strong>Schoolvakanties:</strong> Houd rekening met populaire verlofperiodes</li>
                        <li><strong>Backup planning:</strong> Zorg voor vervanging bij belangrijke taken</li>
                    </ul>
                    
                    <h4>💼 Administratie Tips</h4>
                    <ul>
                        <li><strong>Screenshot maken:</strong> Bewaar bevestigingen van aanvragen</li>
                        <li><strong>E-mails bewaren:</strong> Houd goedkeuringse-mails bij</li>
                        <li><strong>Saldo monitoring:</strong> Check regelmatig je verlof- en compensatiesaldo</li>
                        <li><strong>Deadlines:</strong> Let op vervaldatums van uren en dagen</li>
                    </ul>
                    
                    <h4>🤝 Communicatie Tips</h4>
                    <ul>
                        <li><strong>Transparant zijn:</strong> Geef duidelijke redenen bij bijzonder verlof</li>
                        <li><strong>Vroeg communiceren:</strong> Bespreek lange afwezigheid vooraf</li>
                        <li><strong>Contact houden:</strong> Bij langdurige ziekte regelmatig contact</li>
                        <li><strong>Terug komen:</strong> Plan inwerktijd na lange afwezigheid</li>
                    </ul>
                `
            },
            {
                title: "Problemen Oplossen",
                content: `
                    <h4>🔧 Veelvoorkomende Problemen</h4>
                    
                    <p><strong>❌ Kan geen verlof aanvragen</strong></p>
                    <ul>
                        <li>Check of je voldoende verlofdagen hebt</li>
                        <li>Controleer of de periode niet al bezet is</li>
                        <li>Verifieer dat je de juiste rechten hebt</li>
                        <li>Probeer een andere browser</li>
                    </ul>
                    
                    <p><strong>🎨 Kleuren kloppen niet</strong></p>
                    <ul>
                        <li>F5 drukken om pagina te vernieuwen</li>
                        <li>Check of de aanvraag is goedgekeurd</li>
                        <li>Wacht een paar minuten voor systeem update</li>
                        <li>Controleer in je e-mail voor statusupdates</li>
                    </ul>
                    
                    <p><strong>📱 Mobiele problemen</strong></p>
                    <ul>
                        <li>Gebruik WiFi in plaats van mobiele data</li>
                        <li>Update je browser naar de nieuwste versie</li>
                        <li>Clear browser cache en cookies</li>
                        <li>Probeer desktop versie op laptop/PC</li>
                    </ul>
                    
                    <h4>🆘 Hulp Krijgen</h4>
                    <ul>
                        <li><strong>Leidinggevende:</strong> Voor goedkeuringsproblemen</li>
                        <li><strong>HR afdeling:</strong> Voor beleidsvragen</li>
                        <li><strong>IT helpdesk:</strong> Voor technische problemen</li>
                        <li><strong>Functioneel beheer:</strong> Voor systeeminstellingen</li>
                    </ul>
                `
            }
        ]
    }
};

// Modal class for displaying the manual
export class RoosterHandleiding {
    constructor() {
        this.currentSection = null;
        this.modalElement = null;
        this.isOpen = false;
    }
    
    // Open the manual modal
    open(sectionKey = 'algemeen') {
        if (this.isOpen) {
            this.switchSection(sectionKey);
            return;
        }
        
        this.isOpen = true;
        this.currentSection = sectionKey;
        this.createModal();
        this.showSection(sectionKey);
        
        // Add escape key listener
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    
    // Close the manual modal
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        if (this.modalElement) {
            // Add fade out animation
            this.modalElement.style.opacity = '0';
            this.modalElement.style.animation = 'backdropFadeOut 0.3s ease forwards';
            
            setTimeout(() => {
                if (this.modalElement && this.modalElement.parentNode) {
                    document.body.removeChild(this.modalElement);
                }
                this.modalElement = null;
            }, 300);
        }
        
        // Remove escape key listener
        document.removeEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Fire custom event
        document.dispatchEvent(new CustomEvent('handleiding-closed'));
        
        console.log('Handleiding modal closed');
    }
    
    // Handle keyboard events
    handleKeyPress(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }
    
    // Create the modal structure with tabs
    createModal() {
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'handleiding-modal-backdrop';
        
        this.modalElement.innerHTML = `
            <div class="handleiding-modal">
                <div class="handleiding-modal-header">
                    <h2 class="handleiding-modal-title">
                        📚 Verlofrooster Handleiding
                    </h2>
                    <button class="handleiding-close-btn" id="handleiding-close" type="button">
                        ✕
                    </button>
                </div>
                <div class="handleiding-modal-body">
                    <div class="handleiding-tabs">
                        ${this.createTabs()}
                    </div>
                    <div class="handleiding-content" id="handleiding-content">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modalElement);
        
        // Force reflow to ensure styles are applied
        this.modalElement.offsetHeight;
        
        // Add event listeners
        this.addEventListeners();
    }
    
    // Create tab navigation
    createTabs() {
        const sections = Object.keys(handleidingContent);
        
        return sections.map(key => {
            const section = handleidingContent[key];
            return `
                <button class="handleiding-tab ${key === this.currentSection ? 'active' : ''}" 
                        data-section="${key}" type="button">
                    <span class="handleiding-tab-icon">${section.icon}</span>
                    <span class="handleiding-tab-title">${section.title}</span>
                </button>
            `;
        }).join('');
    }
    
    // Show specific section content
    showSection(sectionKey) {
        const section = handleidingContent[sectionKey];
        if (!section) return;
        
        this.currentSection = sectionKey;
        
        // Update tab active state
        const tabs = this.modalElement.querySelectorAll('.handleiding-tab');
        tabs.forEach(tab => {
            if (tab.dataset.section === sectionKey) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update main content
        const contentArea = this.modalElement.querySelector('#handleiding-content');
        
        let html = `
            <div class="handleiding-section">
                <div class="handleiding-section-header">
                    <h1>${section.icon} ${section.title}</h1>
                </div>
        `;
        
        section.sections.forEach(subsection => {
            html += `
                <div class="handleiding-subsection">
                    <h3>${subsection.title}</h3>
                    <div class="handleiding-subsection-content">
                        ${subsection.content}
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        contentArea.innerHTML = html;
        
        // Scroll to top of content
        contentArea.scrollTop = 0;
    }
    
    // Switch to different section
    switchSection(sectionKey) {
        this.showSection(sectionKey);
    }
    
    // Add event listeners
    addEventListeners() {
        // Close button
        const closeBtn = this.modalElement.querySelector('#handleiding-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            });
        }
        
        // Tab navigation
        const tabs = this.modalElement.querySelectorAll('.handleiding-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const sectionKey = tab.dataset.section;
                this.switchSection(sectionKey);
            });
        });
        
        // Close when clicking backdrop (outside modal)
        this.modalElement.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
                this.close();
            }
        });
        
        // Prevent modal clicks from closing
        const modal = this.modalElement.querySelector('.handleiding-modal');
        if (modal) {
            modal.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }
    }
}

// Create and export instance
export const roosterHandleiding = new RoosterHandleiding();

// Export utility function to open specific sections
export const openHandleiding = (section = 'algemeen') => {
    roosterHandleiding.open(section);
};