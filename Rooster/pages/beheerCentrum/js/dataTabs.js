/**
 * dataTabs.js - Defines the tab structure for the Beheercentrum page.
 * This configuration is used by the React components to render the tabs and their corresponding content.
 */

// We use the globally available appConfiguratie from configLijst.js
const { 
    Medewerkers, 
    Teams, 
    Verlofredenen, 
    Verlof, 
    CompensatieUren, 
    UrenPerWeek, 
    DagenIndicators, 
    gebruikersInstellingen, 
    keuzelijstFuncties, 
    IncidenteelZittingVrij, 
    Seniors, 
    statuslijstOpties 
} = window.appConfiguratie;

export const beheerTabs = [
    // Medewerkers - Employee management
    {
        id: 'medewerkers',
        label: 'Medewerkers',
        listConfig: Medewerkers,
        columns: [
            { Header: 'Naam', accessor: 'Naam', type: 'text' },
            { Header: 'Functie', accessor: 'Functie', type: 'text' },
            { Header: 'Team', accessor: 'Team', type: 'text' },
            { Header: 'E-mail', accessor: 'E_x002d_mail', type: 'email' },
            { Header: 'Uren p/w', accessor: 'UrenPerWeek', type: 'number' },
            { Header: 'Actief', accessor: 'Actief', type: 'boolean' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Naam', label: 'Naam', type: 'text' },
            { name: 'Username', label: 'Username', type: 'text' },
            { name: 'E_x002d_mail', label: 'E-mail', type: 'email' },
            { name: 'Functie', label: 'Functie', type: 'text' },
            { name: 'Team', label: 'Team', type: 'text' },
            { name: 'Werkschema', label: 'Werkschema', type: 'text' },
            { name: 'UrenPerWeek', label: 'Uren per week', type: 'number' },
            { name: 'Geboortedatum', label: 'Geboortedatum', type: 'date' },
            { name: 'Opmekring', label: 'Opmerking', type: 'textarea' },
            { name: 'OpmerkingGeldigTot', label: 'Opmerking Geldig Tot', type: 'date' },
            { name: 'HalveDagType', label: 'Halve Dag Type', type: 'text' },
            { name: 'HalveDagWeekdag', label: 'Halve Dag Weekdag', type: 'text' },
            { name: 'Werkdagen', label: 'Werkdagen', type: 'textarea' },
            { name: 'Actief', label: 'Actief', type: 'checkbox' },
            { name: 'Verbergen', label: 'Verborgen in rooster', type: 'checkbox' },
            { name: 'Horen', label: 'Horen', type: 'checkbox' },
        ]
    },

    // Teams - Team management
    {
        id: 'teams',
        label: 'Teams',
        listConfig: Teams,
        columns: [
            { Header: 'Naam', accessor: 'Naam', type: 'text' },
            { Header: 'Teamleider', accessor: 'Teamleider', type: 'text' },
            { Header: 'Kleur', accessor: 'Kleur', type: 'color' },
            { Header: 'Actief', accessor: 'Actief', type: 'boolean' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Naam', label: 'Team Naam', type: 'text' },
            { name: 'Teamleider', label: 'Teamleider', type: 'text' },
            { name: 'TeamleiderId', label: 'Teamleider ID', type: 'text' },
            { name: 'Kleur', label: 'Team Kleur', type: 'color' },
            { name: 'Actief', label: 'Actief', type: 'checkbox' },
        ]
    },

    // Verlofredenen - Leave reasons
    {
        id: 'verlofredenen',
        label: 'Verlofredenen',
        listConfig: Verlofredenen,
        columns: [
            { Header: 'Naam', accessor: 'Naam', type: 'text' },
            { Header: 'Afkorting', accessor: 'Afkorting', type: 'text' },
            { Header: 'Kleur', accessor: 'Kleur', type: 'color' },
            { Header: 'Verlofdag', accessor: 'VerlofDag', type: 'boolean' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Naam', label: 'Verlof Naam', type: 'text' },
            { name: 'Afkorting', label: 'Afkorting', type: 'text' },
            { name: 'Kleur', label: 'Kleur', type: 'color' },
            { name: 'VerlofDag', label: 'Is Verlofdag', type: 'checkbox' },
        ]
    },

    // Verlof - Leave requests
    {
        id: 'verlof',
        label: 'Verlof',
        listConfig: Verlof,
        columns: [
            { Header: 'Medewerker', accessor: 'Medewerker', type: 'text' },
            { Header: 'Start Datum', accessor: 'StartDatum', type: 'date' },
            { Header: 'Eind Datum', accessor: 'EindDatum', type: 'date' },
            { Header: 'Reden', accessor: 'Reden', type: 'text' },
            { Header: 'Status', accessor: 'Status', type: 'text' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Title', label: 'Titel', type: 'text' },
            { name: 'Medewerker', label: 'Medewerker', type: 'text' },
            { name: 'MedewerkerID', label: 'Medewerker ID', type: 'text' },
            { name: 'AanvraagTijdstip', label: 'Aanvraag Tijdstip', type: 'datetime-local' },
            { name: 'StartDatum', label: 'Start Datum', type: 'datetime-local' },
            { name: 'EindDatum', label: 'Eind Datum', type: 'datetime-local' },
            { name: 'Reden', label: 'Reden', type: 'text' },
            { name: 'RedenId', label: 'Reden ID', type: 'text' },
            { name: 'Omschrijving', label: 'Omschrijving', type: 'textarea' },
            { name: 'Status', label: 'Status', type: 'text' },
            { name: 'HerinneringDatum', label: 'Herinnering Datum', type: 'datetime-local' },
            { name: 'HerinneringStatus', label: 'Herinnering Status', type: 'text' },
            { name: 'OpmerkingBehandelaar', label: 'Opmerking Behandelaar', type: 'textarea' },
        ]
    },

    // CompensatieUren - Compensation hours
    {
        id: 'compensatieuren',
        label: 'Compensatie Uren',
        listConfig: CompensatieUren,
        columns: [
            { Header: 'Medewerker', accessor: 'Medewerker', type: 'text' },
            { Header: 'Start', accessor: 'StartCompensatieUren', type: 'datetime' },
            { Header: 'Einde', accessor: 'EindeCompensatieUren', type: 'datetime' },
            { Header: 'Uren Totaal', accessor: 'UrenTotaal', type: 'number' },
            { Header: 'Status', accessor: 'Status', type: 'text' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Title', label: 'Titel', type: 'text' },
            { name: 'Medewerker', label: 'Medewerker', type: 'text' },
            { name: 'MedewerkerID', label: 'Medewerker ID', type: 'text' },
            { name: 'AanvraagTijdstip', label: 'Aanvraag Tijdstip', type: 'datetime-local' },
            { name: 'StartCompensatieUren', label: 'Start Compensatie', type: 'datetime-local' },
            { name: 'EindeCompensatieUren', label: 'Einde Compensatie', type: 'datetime-local' },
            { name: 'UrenTotaal', label: 'Totaal Uren', type: 'text' },
            { name: 'Omschrijving', label: 'Omschrijving', type: 'textarea' },
            { name: 'Status', label: 'Status', type: 'text' },
            { name: 'Ruildag', label: 'Is Ruildag', type: 'checkbox' },
            { name: 'ruildagStart', label: 'Ruildag Start', type: 'datetime-local' },
            { name: 'ruildagEinde', label: 'Ruildag Einde', type: 'datetime-local' },
            { name: 'ReactieBehandelaar', label: 'Reactie Behandelaar', type: 'textarea' },
        ]
    },

    // UrenPerWeek - Hours per week
    {
        id: 'urenperweek',
        label: 'Uren per Week',
        listConfig: UrenPerWeek,
        columns: [
            { Header: 'Medewerker ID', accessor: 'MedewerkerID', type: 'text' },
            { Header: 'Ingangsdatum', accessor: 'Ingangsdatum', type: 'date' },
            { Header: 'Ma Start', accessor: 'MaandagStart', type: 'time' },
            { Header: 'Di Start', accessor: 'DinsdagStart', type: 'time' },
            { Header: 'Wo Start', accessor: 'WoensdagStart', type: 'time' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'MedewerkerID', label: 'Medewerker ID', type: 'text' },
            { name: 'Ingangsdatum', label: 'Ingangsdatum', type: 'datetime-local' },
            { name: 'VeranderingsDatum', label: 'Veranderingsdatum', type: 'datetime-local' },
            { name: 'MaandagStart', label: 'Maandag Start', type: 'text' },
            { name: 'MaandagEind', label: 'Maandag Eind', type: 'text' },
            { name: 'MaandagTotaal', label: 'Maandag Totaal', type: 'text' },
            { name: 'DinsdagStart', label: 'Dinsdag Start', type: 'text' },
            { name: 'DinsdagEind', label: 'Dinsdag Eind', type: 'text' },
            { name: 'DinsdagTotaal', label: 'Dinsdag Totaal', type: 'text' },
            { name: 'WoensdagStart', label: 'Woensdag Start', type: 'text' },
            { name: 'WoensdagEind', label: 'Woensdag Eind', type: 'text' },
            { name: 'WoensdagTotaal', label: 'Woensdag Totaal', type: 'text' },
            { name: 'DonderdagStart', label: 'Donderdag Start', type: 'text' },
            { name: 'DonderdagEind', label: 'Donderdag Eind', type: 'text' },
            { name: 'DonderdagTotaal', label: 'Donderdag Totaal', type: 'text' },
            { name: 'VrijdagStart', label: 'Vrijdag Start', type: 'text' },
            { name: 'VrijdagEind', label: 'Vrijdag Eind', type: 'text' },
            { name: 'VrijdagTotaal', label: 'Vrijdag Totaal', type: 'text' },
        ]
    },

    // DagenIndicators - Day indicators
    {
        id: 'dagenindicators',
        label: 'Dagen Indicators',
        listConfig: DagenIndicators,
        columns: [
            { Header: 'Titel', accessor: 'Title' },
            { Header: 'Beschrijving', accessor: 'Beschrijving', type: 'text' },
            { Header: 'Kleur', accessor: 'Kleur', type: 'color' },
            { Header: 'Patroon', accessor: 'Patroon', type: 'text' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Title', label: 'Titel', type: 'text' },
            { name: 'Beschrijving', label: 'Beschrijving', type: 'text' },
            { name: 'Kleur', label: 'Kleur', type: 'color' },
            { name: 'Patroon', label: 'Patroon', type: 'text' },
            { name: 'Validatie', label: 'Validatie', type: 'text' },
        ]
    },

    // gebruikersInstellingen - User settings
    {
        id: 'gebruikersinstellingen',
        label: 'Gebruikers Instellingen',
        listConfig: gebruikersInstellingen,
        columns: [
            { Header: 'Titel', accessor: 'Title', type: 'text' },
            { Header: 'Eigen Team', accessor: 'EigenTeamWeergeven', type: 'boolean' },
            { Header: 'Weekenden', accessor: 'WeekendenWeergeven', type: 'boolean' },
            { Header: 'Weergave', accessor: 'soortWeergave', type: 'text' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Title', label: 'Titel', type: 'text' },
            { name: 'EigenTeamWeergeven', label: 'Eigen Team Weergeven', type: 'checkbox' },
            { name: 'WeekendenWeergeven', label: 'Weekenden Weergeven', type: 'checkbox' },
            { name: 'soortWeergave', label: 'Soort Weergave', type: 'text' },
        ]
    },

    // keuzelijstFuncties - Function choices
    {
        id: 'keuzelijstfuncties',
        label: 'Keuzelijst Functies',
        listConfig: keuzelijstFuncties,
        columns: [
            { Header: 'Titel', accessor: 'Title', type: 'text' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Title', label: 'Functie Titel', type: 'text' },
        ]
    },

    // IncidenteelZittingVrij - Incidental session-free
    {
        id: 'incidenteelzittingvrij',
        label: 'Incidenteel Zitting Vrij',
        listConfig: IncidenteelZittingVrij,
        columns: [
            { Header: 'Gebruikersnaam', accessor: 'Gebruikersnaam', type: 'text' },
            { Header: 'Start', accessor: 'ZittingsVrijeDagTijd', type: 'datetime' }, // This maps to the start time field
            { Header: 'Eind', accessor: 'ZittingsVrijeDagTijdEind', type: 'datetime' },
            { Header: 'Terugkerend', accessor: 'Terugkerend', type: 'boolean' },
            { Header: 'Patroon', accessor: 'TerugkeerPatroon', type: 'text' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Title', label: 'Titel', type: 'text' },
            { name: 'Gebruikersnaam', label: 'Gebruikersnaam', type: 'text' },
            { name: 'ZittingsVrijeDagTijd', label: 'Start Tijd', type: 'datetime-local' },
            { name: 'ZittingsVrijeDagTijdEind', label: 'Eind Tijd', type: 'datetime-local' },
            { name: 'Terugkerend', label: 'Terugkerend', type: 'checkbox' },
            { name: 'TerugkeerPatroon', label: 'Terugkeer Patroon', type: 'text' },
            { name: 'TerugkerendTot', label: 'Terugkerend Tot', type: 'datetime-local' },
            { name: 'Afkorting', label: 'Afkorting', type: 'text' },
            { name: 'Opmerking', label: 'Opmerking', type: 'textarea' },
        ]
    },

    // Seniors - Senior employees
    {
        id: 'seniors',
        label: 'Seniors',
        listConfig: Seniors,
        columns: [
            { Header: 'Medewerker', accessor: 'Medewerker', type: 'text' },
            { Header: 'Team', accessor: 'Team', type: 'text' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Medewerker', label: 'Medewerker', type: 'text' },
            { name: 'MedewerkerID', label: 'Medewerker ID', type: 'text' },
            { name: 'Team', label: 'Team', type: 'text' },
            { name: 'TeamID', label: 'Team ID', type: 'text' },
        ]
    },

    // statuslijstOpties - Status options
    {
        id: 'statuslijstopties',
        label: 'Status Opties',
        listConfig: statuslijstOpties,
        columns: [
            { Header: 'Titel', accessor: 'Title', type: 'text' },
            { Header: 'Acties', accessor: 'actions', isAction: true },
        ],
        formFields: [
            { name: 'Title', label: 'Status Titel', type: 'text' },
        ]
    },
];
