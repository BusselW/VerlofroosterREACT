<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Rooster Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Enkel het gecombineerde CSS bestand wordt nu geladen -->
    <link href="css/verlofrooster_stijl.css" rel="stylesheet">

    <!-- React en configuratie bestanden -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="js/config/configLijst.js"></script>
</head>

<body>
<div id="root"></div>

<!-- Hoofd script van de applicatie, nu als module om 'import' te gebruiken -->
<script type="module">
    // Importeer de benodigde componenten en functies
    import MedewerkerRow from './js/ui/userinfo.js';
    import { getUserInfo } from './js/services/sharepointService.js';

    const { useState, useEffect, useMemo, useCallback, createElement: h, Fragment } = React;

    // =====================
    // Hulpfuncties (Ongewijzigd)
    // =====================
    const fetchSharePointList = async (lijstNaam) => {
        try {
            if (!window.appConfiguratie || !window.appConfiguratie.instellingen) {
                throw new Error('App configuratie niet gevonden.');
            }
            const siteUrl = window.appConfiguratie.instellingen.siteUrl;
            const lijstConfig = window.appConfiguratie[lijstNaam];
            if (!lijstConfig) throw new Error(`Configuratie voor lijst '${lijstNaam}' niet gevonden.`);
            
            const lijstTitel = lijstConfig.lijstTitel;
            const apiUrl = `${siteUrl.replace(/\/$/, "")}/_api/web/lists/getbytitle('${lijstTitel}')/items?$top=5000`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json;odata=nometadata' },
                credentials: 'same-origin'
            });
            if (!response.ok) throw new Error(`Fout bij ophalen van ${lijstNaam}: ${response.statusText}`);
            const data = await response.json();
            return data.value || [];
        } catch (error) {
            console.error(`Fout bij ophalen van lijst ${lijstNaam}:`, error);
            throw error;
        }
    };
    const maandNamenVolledig = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    const getPasen = (jaar) => {
        const a = jaar % 19; const b = Math.floor(jaar / 100); const c = jaar % 100; const d = Math.floor(b / 4); const e = b % 4; const f = Math.floor((b + 8) / 25); const g = Math.floor((b - f + 1) / 3); const h = (19 * a + b - d - g + 15) % 30; const i = Math.floor(c / 4); const k = c % 4; const l = (32 + 2 * e + 2 * i - h - k) % 7; const m = Math.floor((a + 11 * h + 22 * l) / 451); const maand = Math.floor((h + l - 7 * m + 114) / 31); const dag = ((h + l - 7 * m + 114) % 31) + 1; return new Date(jaar, maand - 1, dag);
    };
    const getFeestdagen = (jaar) => {
        const pasen = getPasen(jaar); const feestdagenMap = {}; const voegFeestdagToe = (datum, naam) => { const key = datum.toISOString().split('T')[0]; feestdagenMap[key] = naam; }; voegFeestdagToe(new Date(jaar, 0, 1), 'Nieuwjaarsdag'); voegFeestdagToe(new Date(pasen.getTime() - 2 * 24 * 3600 * 1000), 'Goede Vrijdag'); voegFeestdagToe(pasen, 'Eerste Paasdag'); voegFeestdagToe(new Date(pasen.getTime() + 1 * 24 * 3600 * 1000), 'Tweede Paasdag'); voegFeestdagToe(new Date(jaar, 3, 27), 'Koningsdag'); voegFeestdagToe(new Date(jaar, 4, 5), 'Bevrijdingsdag'); voegFeestdagToe(new Date(pasen.getTime() + 39 * 24 * 3600 * 1000), 'Hemelvaartsdag'); voegFeestdagToe(new Date(pasen.getTime() + 49 * 24 * 3600 * 1000), 'Eerste Pinksterdag'); voegFeestdagToe(new Date(pasen.getTime() + 50 * 24 * 3600 * 1000), 'Tweede Pinksterdag'); voegFeestdagToe(new Date(jaar, 11, 25), 'Eerste Kerstdag'); voegFeestdagToe(new Date(jaar, 11, 26), 'Tweede Kerstdag'); return feestdagenMap;
    };
    const getWeekNummer = (datum) => {
        const doelDatum = new Date(datum.getTime()); const dagVanWeek = (doelDatum.getDay() + 6) % 7; doelDatum.setDate(doelDatum.getDate() - dagVanWeek + 3); const eersteJanuari = new Date(doelDatum.getFullYear(), 0, 1); return Math.ceil(((doelDatum.getTime() - eersteJanuari.getTime()) / 604800000) + 1);
    };
    const getWekenInJaar = (jaar) => {
        const laatste31Dec = new Date(jaar, 11, 31); const weekNummer = getWeekNummer(laatste31Dec); return weekNummer === 1 ? 52 : weekNummer;
    };
    const getDagenInWeek = (weekNummer, jaar) => {
        const jan4 = new Date(jaar, 0, 4); const jan4WeekDag = (jan4.getDay() + 6) % 7; const maandagWeek1 = new Date(jan4.getTime() - jan4WeekDag * 24 * 60 * 60 * 1000); const maandag = new Date(maandagWeek1.getTime() + (weekNummer - 1) * 7 * 24 * 60 * 60 * 1000); const dagen = []; for (let i = 0; i < 7; i++) { dagen.push(new Date(maandag.getTime() + i * 24 * 60 * 60 * 1000)); } return dagen;
    };
    const getDagenInMaand = (maand, jaar) => {
        const dagen = []; const laatstedag = new Date(jaar, maand + 1, 0); for (let i = 1; i <= laatstedag.getDate(); i++) { dagen.push(new Date(jaar, maand, i)); } return dagen;
    };
    const formatteerDatum = (datum) => {
        const dagNamen = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']; return { dagNaam: dagNamen[datum.getDay()], dagNummer: datum.getDate() };
    };
    const getInitialen = (naam) => {
        if (!naam) return ''; return naam.split(' ').filter(d => d.length > 0).map(d => d[0]).join('').toUpperCase().slice(0, 2);
    };

    // =====================
    // Error Boundary (Ongewijzigd)
    // =====================
    class ErrorBoundary extends React.Component {
        constructor(props) { super(props); this.state = { hasError: false, error: null }; }
        static getDerivedStateFromError(error) { return { hasError: true, error }; }
        componentDidCatch(error, errorInfo) { console.error('Error Boundary gevangen fout:', error, errorInfo); }
        render() { if (this.state.hasError) { return h('div', { className: 'error-message' }, h('h2', null, 'Er is een onverwachte fout opgetreden'), h('p', null, 'Probeer de pagina te vernieuwen.'), h('details', null, h('summary', null, 'Technische details'), h('pre', null, this.state.error?.message || 'Onbekende fout'))); } return this.props.children; }
    }

    // =====================
    // ShiftModal Component (Ongewijzigd)
    // =====================
    const ShiftModal = ({ isOpen, sluit, opslaan, medewerker, datum, bestaandeShift, shiftTypes }) => {
        const beschikbareShiftTypes = Object.keys(shiftTypes || {});
        const initieleShiftType = bestaandeShift?.type || beschikbareShiftTypes[0] || '';
        const [shiftType, setShiftType] = useState(initieleShiftType);
        const [notities, setNotities] = useState(bestaandeShift?.notities || '');
        const [bezig, setBezig] = useState(false);
        useEffect(() => {
            if (isOpen) {
                const nieuweShiftType = bestaandeShift?.type || beschikbareShiftTypes[0] || '';
                setShiftType(nieuweShiftType);
                setNotities(bestaandeShift?.notities || '');
            }
        }, [isOpen, bestaandeShift, beschikbareShiftTypes]);
        if (!isOpen) return null;
        const handleOpslaan = async () => {
            try { setBezig(true); await opslaan({ type: shiftType, notities: notities.trim() }); sluit(); } catch (error) { console.error('Fout bij opslaan shift:', error); } finally { setBezig(false); }
        };
        const handleVerwijderen = async () => {
            if (window.confirm('Weet je zeker dat je deze shift wilt verwijderen?')) {
                try { setBezig(true); await opslaan(null); sluit(); } catch (error) { console.error('Fout bij verwijderen shift:', error); } finally { setBezig(false); }
            }
        };
        const heeftShiftTypes = beschikbareShiftTypes.length > 0;
        return h('div', { className: 'modal-overlay', onClick: sluit }, h('div', { className: 'modal', onClick: (e) => e.stopPropagation() }, h('div', { className: 'modal-header' }, h('h2', null, bestaandeShift ? 'Shift Bewerken' : 'Nieuwe Shift'), h('button', { className: 'modal-close', onClick: sluit, disabled: bezig }, '×')), h('div', { className: 'modal-body' }, h('div', { className: 'form-groep' }, h('label', { htmlFor: 'medewerker-naam' }, 'Medewerker'), h('input', { type: 'text', id: 'medewerker-naam', className: 'form-input', value: medewerker?.naam || '', readOnly: true })), h('div', { className: 'form-groep' }, h('label', { htmlFor: 'shift-datum' }, 'Datum'), h('input', { type: 'text', id: 'shift-datum', className: 'form-input', value: datum ? `${formatteerDatum(datum).dagNaam} ${datum.toLocaleDateString('nl-NL')}` : '', readOnly: true })), h('div', { className: 'form-groep' }, h('label', { htmlFor: 'shift-type' }, 'Type Shift'), heeftShiftTypes ? h('select', { id: 'shift-type', className: 'form-select', value: shiftType, onChange: (e) => setShiftType(e.target.value), disabled: bezig }, Object.values(shiftTypes).map(type => h('option', { key: type.id, value: type.id }, type.label))) : h('p', { className: 'form-info' }, 'Geen shift types beschikbaar')), h('div', { className: 'form-groep' }, h('label', { htmlFor: 'shift-notities' }, 'Notities'), h('textarea', { id: 'shift-notities', className: 'form-textarea', rows: 3, value: notities, onChange: (e) => setNotities(e.target.value), disabled: bezig, placeholder: 'Optionele notities...' }))), h('div', { className: 'form-acties' }, bestaandeShift && h('button', { className: 'btn btn-danger', onClick: handleVerwijderen, disabled: bezig || !heeftShiftTypes }, bezig ? 'Bezig...' : 'Verwijderen'), h('button', { className: 'btn btn-secondary', onClick: sluit, disabled: bezig }, 'Annuleren'), h('button', { className: 'btn btn-primary', onClick: handleOpslaan, disabled: bezig || !heeftShiftTypes || !shiftType }, bezig ? 'Bezig...' : 'Opslaan'))));
    };
    
    // =====================
    // Hoofd RoosterApp Component
    // =====================
    const RoosterApp = () => {
        const [weergaveType, setWeergaveType] = useState('maand');
        const [huidigJaar, setHuidigJaar] = useState(new Date().getFullYear());
        const [huidigMaand, setHuidigMaand] = useState(new Date().getMonth());
        const [medewerkers, setMedewerkers] = useState([]);
        const [teams, setTeams] = useState([]);
        const [shiftTypes, setShiftTypes] = useState({});
        const [verlofItems, setVerlofItems] = useState([]);
        const [feestdagen, setFeestdagen] = useState({});
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [huidigWeek, setHuidigWeek] = useState(getWeekNummer(new Date()));
        const [zoekTerm, setZoekTerm] = useState('');
        const [geselecteerdTeam, setGeselecteerdTeam] = useState('');
        const [modalOpen, setModalOpen] = useState(false);
        const [geselecteerdeMedewerker, setGeselecteerdeMedewerker] = useState(null);
        const [geselecteerdeDatum, setGeselecteerdeDatum] = useState(null);
        const [bewerkenShift, setBewerkenShift] = useState(null);
        const [zittingsvrijItems, setZittingsvrijItems] = useState([]);

        useEffect(() => {
            const loadData = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    if (!window.appConfiguratie) await new Promise(r => setTimeout(r, 100));
                    const [medewerkersData, teamsData, verlofredenenData, verlofData, zittingsvrijData] = await Promise.all([
                        fetchSharePointList('Medewerkers'),
                        fetchSharePointList('Teams'),
                        fetchSharePointList('Verlofredenen'),
                        fetchSharePointList('Verlof'),
                        fetchSharePointList('IncidenteelZittingVrij')
                    ]);
                    const teamsMapped = teamsData.map(item => ({ id: item.Title || item.ID?.toString(), naam: item.Naam || item.Title, kleur: item.Kleur || '#cccccc' }));
                    setTeams(teamsMapped);
                    const teamNameToIdMap = teamsMapped.reduce((acc, t) => { acc[t.naam] = t.id; return acc; }, {});
                    const transformedShiftTypes = verlofredenenData.reduce((acc, item) => {
                        if(item.Title) { acc[item.ID] = { id: item.ID, label: item.Title, kleur: item.Kleur || '#999999', afkorting: item.Afkorting || '??' }; }
                        return acc;
                    }, {});
                    setShiftTypes(transformedShiftTypes);
                    const medewerkersProcessed = medewerkersData
                        .filter(item => item.Naam && item.Actief !== false)
                        .map(item => ({ ...item, id: item.ID, naam: item.Naam, team: teamNameToIdMap[item.Team] || '', Username: item.Username || null }));
                    setMedewerkers(medewerkersProcessed);
                    setVerlofItems(verlofData.map(v => ({...v, StartDatum: new Date(v.StartDatum), EindDatum: new Date(v.EindDatum) })));
                    setZittingsvrijItems(zittingsvrijData.map(z => ({ ...z, StartDatum: new Date(z.ZittingsVrijeDagTijd), EindDatum: new Date(z.ZittingsVrijeDagTijdEind) })));
                } catch (err) {
                    setError(`Fout bij laden: ${err.message}`);
                } finally {
                    setLoading(false);
                }
            };
            loadData();
        }, []);
        
        useEffect(() => {
            const jaren = [huidigJaar - 1, huidigJaar, huidigJaar + 1];
            const alleFeestdagen = jaren.reduce((acc, jaar) => ({ ...acc, ...getFeestdagen(jaar) }), {});
            setFeestdagen(alleFeestdagen);
        }, [huidigJaar]);

        const checkIsFeestdag = useCallback((datum) => feestdagen[datum.toISOString().split('T')[0]], [feestdagen]);
        const getVerlofVoorDag = useCallback((medewerkerUsername, datum) => {
            if (!medewerkerUsername) return null;
            const datumCheck = new Date(datum).setHours(12, 0, 0, 0);
            return verlofItems.find(v => v.MedewerkerID === medewerkerUsername && v.Status !== 'Afgewezen' && datumCheck >= new Date(v.StartDatum).setHours(12,0,0,0) && datumCheck <= new Date(v.EindDatum).setHours(12,0,0,0));
        }, [verlofItems]);
        const getZittingsvrijVoorDag = useCallback((medewerkerUsername, datum) => {
            if (!medewerkerUsername) return null;
            const datumCheck = new Date(datum).setHours(12, 0, 0, 0);
            return zittingsvrijItems.find(z => z.Gebruikersnaam === medewerkerUsername && datumCheck >= new Date(z.StartDatum).setHours(12, 0, 0, 0) && datumCheck <= new Date(z.EindDatum).setHours(12, 0, 0, 0));
        }, [zittingsvrijItems]);

        const periodeData = useMemo(() => {
            return weergaveType === 'week' ? getDagenInWeek(huidigWeek, huidigJaar) : getDagenInMaand(huidigMaand, huidigJaar);
        }, [weergaveType, huidigWeek, huidigMaand, huidigJaar]);

        const volgende = () => { if (weergaveType === 'week') { const maxWeken = getWekenInJaar(huidigJaar); if (huidigWeek >= maxWeken) { setHuidigWeek(1); setHuidigJaar(huidigJaar + 1); } else { setHuidigWeek(huidigWeek + 1); } } else { if (huidigMaand === 11) { setHuidigMaand(0); setHuidigJaar(huidigJaar + 1); } else { setHuidigMaand(huidigMaand + 1); } } };
        const vorige = () => { if (weergaveType === 'week') { if (huidigWeek === 1) { const vorigJaar = huidigJaar - 1; setHuidigWeek(getWekenInJaar(vorigJaar)); setHuidigJaar(vorigJaar); } else { setHuidigWeek(huidigWeek - 1); } } else { if (huidigMaand === 0) { setHuidigMaand(11); setHuidigJaar(huidigJaar - 1); } else { setHuidigMaand(huidigMaand - 1); } } };
        const openShiftModal = (medewerker, datum, shift = null) => { setGeselecteerdeMedewerker(medewerker); setGeselecteerdeDatum(datum); setBewerkenShift(shift); setModalOpen(true); };
        const sluitModal = () => { setModalOpen(false); setGeselecteerdeMedewerker(null); setGeselecteerdeDatum(null); setBewerkenShift(null); };
        const opslaanShift = async (shiftData) => { console.log("Shift opslaan/aanpassen is nog niet geïmplementeerd.", shiftData); };

        const gegroepeerdeData = useMemo(() => {
            const gefilterdeMedewerkers = medewerkers.filter(m => (!zoekTerm || m.naam.toLowerCase().includes(zoekTerm.toLowerCase())) && (!geselecteerdTeam || m.team === geselecteerdTeam));
            const data = teams.reduce((acc, team) => { if (team && team.id) { acc[team.id] = gefilterdeMedewerkers.filter(m => m.team === team.id); } return acc; }, {});
            const medewerkersZonderTeam = gefilterdeMedewerkers.filter(m => !m.team);
            if (medewerkersZonderTeam.length > 0) { data['geen_team'] = medewerkersZonderTeam; }
            return data;
        }, [medewerkers, teams, zoekTerm, geselecteerdTeam]);

        if (loading) return h('div', { className: 'loading-indicator' }, 'Rooster wordt geladen...');
        if (error) return h('div', { className: 'error-message' }, h('h3', null, 'Fout'), h('p', null, error));

        return h('div', { className: 'app-container' },
            h('header', { className: 'header' }, h('div', { className: 'header-content' }, h('h1', null, 'Team Rooster Manager'), h('div', { className: 'header-acties' }, h('button', { className: 'btn btn-secondary', onClick: () => alert('Nog niet geïmplementeerd') }, h('i', { className: 'fas fa-download' }), 'Exporteren'), h('button', { className: 'btn btn-primary', onClick: () => alert('Nog niet geïmplementeerd') }, h('i', { className: 'fas fa-plus' }), 'Verlof Aanvragen')))),
            h('div', { className: 'toolbar' }, h('div', { className: 'toolbar-content' }, h('div', { className: 'periode-navigatie' }, h('button', { onClick: vorige }, h('i', { className: 'fas fa-chevron-left' })), h('div', { className: 'periode-display' }, weergaveType === 'week' ? `Week ${huidigWeek}, ${huidigJaar}` : `${maandNamenVolledig[huidigMaand]} ${huidigJaar}`), h('button', { onClick: volgende }, h('i', { className: 'fas fa-chevron-right' })), h('div', { 'data-weergave': weergaveType, className: 'weergave-toggle', style: { marginLeft: '2rem' } }, h('span', { className: 'glider' }), h('button', { className: 'weergave-optie', onClick: () => setWeergaveType('week') }, 'Week'), h('button', { className: 'weergave-optie', onClick: () => setWeergaveType('maand') }, 'Maand'))), h('div', { className: 'filter-groep' }, h('input', { type: 'text', className: 'zoek-input', placeholder: 'Zoek medewerker...', value: zoekTerm, onChange: (e) => setZoekTerm(e.target.value) }), h('select', { className: 'filter-select', value: geselecteerdTeam, onChange: (e) => setGeselecteerdTeam(e.target.value) }, h('option', { value: '' }, 'Alle teams'), teams.map(team => h('option', { key: team.id, value: team.id }, team.naam))))), Object.keys(shiftTypes).length > 0 && h('div', { className: 'legenda-container' }, h('span', { className: 'legenda-titel' }, 'Legenda: '), Object.values(shiftTypes).map(type => h('div', { key: type.id, className: 'legenda-item' }, h('div', { className: 'legenda-kleur', style: { backgroundColor: type.kleur } }), h('span', null, `${type.afkorting} = ${type.label}`))))),
            h('main', { className: 'main-content' },
                h('table', { className: 'rooster-table' },
                    h('thead', { className: 'rooster-thead' }, h('tr', null, h('th', { className: 'medewerker-kolom' }, 'Medewerker'), periodeData.map(dag => { const isWeekend = dag.getDay() === 0 || dag.getDay() === 6; const feestdagNaam = checkIsFeestdag(dag); const classes = `dag-kolom ${isWeekend ? 'weekend' : ''} ${feestdagNaam ? 'feestdag' : ''}`; return h('th', { key: dag.toISOString(), className: classes, title: feestdagNaam || '' }, h('div', { className: 'dag-header' }, h('span', { className: 'dag-naam' }, formatteerDatum(dag).dagNaam), h('span', { className: 'dag-nummer' }, formatteerDatum(dag).dagNummer))); }))),
                    h('tbody', null,
                        Object.keys(gegroepeerdeData).map(teamId => {
                            const team = teams.find(t => t.id === teamId) || { id: 'geen_team', naam: 'Geen Team', kleur: '#ccc' };
                            const teamMedewerkers = gegroepeerdeData[teamId];
                            if (!teamMedewerkers || teamMedewerkers.length === 0) return null;

                            return h(Fragment, { key: teamId },
                                h('tr', { className: 'team-rij' }, h('td', { colSpan: periodeData.length + 1 }, h('div', { className: 'team-header', style: { '--team-kleur': team.kleur } }, team.naam))),
                                teamMedewerkers.map(medewerker =>
                                    h('tr', { key: medewerker.id, className: 'medewerker-rij' },
                                        h('td', { className: 'medewerker-kolom' }, h(MedewerkerRow, { medewerker })),
                                        
                                        // ===============================================
                                        // RENDER LOGICA VOOR EEN ENKEL DOORLOPEND BLOK
                                        // ===============================================
                                        (() => {
                                            const cellen = [];
                                            for (let i = 0; i < periodeData.length; i++) {
                                                const dag = periodeData[i];
                                                const huidigItem = getVerlofVoorDag(medewerker.Username, dag) || getZittingsvrijVoorDag(medewerker.Username, dag);

                                                const isBezet = !!huidigItem;
                                                const wasBezet = i > 0 && !!(getVerlofVoorDag(medewerker.Username, periodeData[i-1]) || getZittingsvrijVoorDag(medewerker.Username, periodeData[i-1]));

                                                // Render alleen een cel als deze het begin van een nieuw blok is (of leeg)
                                                if (!isBezet || !wasBezet || huidigItem !== (getVerlofVoorDag(medewerker.Username, periodeData[i-1]) || getZittingsvrijVoorDag(medewerker.Username, periodeData[i-1]))) {
                                                    let colSpan = 1;
                                                    if (isBezet) {
                                                        for (let j = i + 1; j < periodeData.length; j++) {
                                                            const volgendItem = getVerlofVoorDag(medewerker.Username, periodeData[j]) || getZittingsvrijVoorDag(medewerker.Username, periodeData[j]);
                                                            if (huidigItem === volgendItem) {
                                                                colSpan++;
                                                            } else {
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    const isWeekend = dag.getDay() === 0 || dag.getDay() === 6;
                                                    const feestdagNaam = checkIsFeestdag(dag);
                                                    const classes = `dag-cel ${isWeekend ? 'weekend' : ''} ${feestdagNaam ? 'feestdag' : ''}`;
                                                    
                                                    let teRenderenBlok = null;
                                                    if (huidigItem) {
                                                        const isVerlof = 'RedenId' in huidigItem;
                                                        if (isVerlof) {
                                                            const verlofReden = shiftTypes[huidigItem.RedenId];
                                                            teRenderenBlok = h('div', {
                                                                className: `verlof-blok status-${(huidigItem.Status || 'Goedgekeurd').toLowerCase()}`,
                                                                style: { backgroundColor: verlofReden.kleur },
                                                                title: huidigItem.Omschrijving || verlofReden.label
                                                            }, verlofReden.afkorting);
                                                        } else { // Is Zittingsvrij
                                                            teRenderenBlok = h('div', {
                                                                className: `verlof-blok status-goedgekeurd`,
                                                                style: { backgroundColor: huidigItem.Kleur || '#8e44ad' },
                                                                title: huidigItem.Opmerking || huidigItem.Title
                                                            }, huidigItem.Afkorting || 'ZV');
                                                        }
                                                    }

                                                    cellen.push(h('td', { key: dag.toISOString(), className: classes, colSpan: colSpan, onClick: () => openShiftModal(medewerker, dag, huidigItem) }, teRenderenBlok));
                                                    
                                                    i += colSpan - 1;
                                                }
                                            }
                                            return cellen;
                                        })()
                                    )
                                )
                            );
                        })
                    )
                )
            ),
            h(ShiftModal, { isOpen: modalOpen, sluit: sluitModal, opslaan: opslaanShift, medewerker: geselecteerdeMedewerker, datum: geselecteerdeDatum, bestaandeShift: bewerkenShift, shiftTypes: shiftTypes })
        );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(h(ErrorBoundary, null, h(RoosterApp)));
</script>


</body>
</html>
