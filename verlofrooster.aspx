<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Rooster Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-color: #2563eb;
            --secondary-color: #10b981;
            --danger-color: #ef4444;
            --warning-color: #f59e0b;
            --info-color: #3b82f6;
            --dark-bg: #1f2937;
            --light-bg: #f3f4f6;
            --border-color: #e5e7eb;
            --text-primary: #111827;
            --text-secondary: #6b7280;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--light-bg);
            color: var(--text-primary);
            line-height: 1.6;
        }

        .app-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Header styling */
        .header {
            background: white;
            box-shadow: var(--shadow-sm);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .header-acties {
            display: flex;
            gap: 0.75rem;
        }

        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: white;
        }

        .btn-primary:hover {
            background-color: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }

        .btn-secondary {
            background-color: white;
            color: var(--text-primary);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
            background-color: var(--light-bg);
        }

        /* Toolbar styling */
        .toolbar {
            background: white;
            padding: 1rem 2rem;
            border-bottom: 1px solid var(--border-color);
        }

        .toolbar-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .periode-navigatie {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .periode-navigatie button {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 0.375rem;
            padding: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .periode-navigatie button:hover {
            background-color: var(--light-bg);
        }

        .periode-display {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-primary);
            min-width: 200px;
            text-align: center;
        }

        .filter-groep {
            display: flex;
            gap: 0.75rem;
            align-items: center;
        }

        .weergave-toggle {
            display: flex;
            background: var(--light-bg);
            border-radius: 0.5rem;
            padding: 0.25rem;
            gap: 0.25rem;
        }

        .weergave-optie {
            padding: 0.5rem 1rem;
            border: none;
            background: transparent;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .weergave-optie.actief {
            background: white;
            box-shadow: var(--shadow-sm);
        }

        .zoek-input {
            padding: 0.5rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: 0.375rem;
            font-size: 0.875rem;
            width: 250px;
        }

        .filter-select {
            padding: 0.5rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: 0.375rem;
            font-size: 0.875rem;
            background: white;
            cursor: pointer;
        }

        /* Main content */
        .main-content {
            flex: 1;
            padding: 2rem;
        }

        .rooster-container {
            background: white;
            border-radius: 0.75rem;
            box-shadow: var(--shadow-md);
            overflow: hidden;
        }

        /* Table styling */
        .rooster-table {
            width: 100%;
            border-collapse: collapse;
        }

        .rooster-thead {
            background-color: var(--dark-bg);
            color: white;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .rooster-th {
            padding: 1rem;
            text-align: center;
            font-weight: 600;
            font-size: 0.875rem;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .rooster-th.medewerker-col {
            text-align: left;
            min-width: 200px;
            position: sticky;
            left: 0;
            background-color: var(--dark-bg);
            z-index: 11;
        }

        .datum-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;
        }

        .dag-naam {
            font-size: 0.75rem;
            opacity: 0.9;
        }

        .dag-nummer {
            font-size: 1.125rem;
            font-weight: 700;
        }

        /* Team sections */
        .team-rij {
            background-color: var(--light-bg);
        }

        .team-cel {
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--border-color);
        }

        /* Employee rows */
        .medewerker-rij {
            border-bottom: 1px solid var(--border-color);
            transition: background-color 0.2s;
        }

        .medewerker-rij:hover {
            background-color: #fafafa;
        }

        .medewerker-cel {
            padding: 0.75rem 1rem;
            border-right: 1px solid var(--border-color);
            background: white;
            position: sticky;
            left: 0;
            z-index: 1;
        }

        .medewerker-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .medewerker-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.875rem;
        }

        .medewerker-naam {
            font-weight: 500;
            color: var(--text-primary);
        }

        /* Shift cells */
        .shift-cel {
            padding: 0.5rem;
            border-right: 1px solid var(--border-color);
            text-align: center;
            min-height: 60px;
            position: relative;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .shift-cel:hover {
            background-color: var(--light-bg);
        }

        .shift-blok {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 600;
            text-align: center;
            transition: transform 0.2s;
            cursor: pointer;
            color: white;
        }

        .shift-blok:hover {
            transform: scale(1.05);
        }

        /* Shift types */
        .shift-werk {
            background-color: #3b82f6;
        }

        .shift-verlof {
            background-color: #10b981;
        }

        .shift-ziek {
            background-color: #ef4444;
        }

        .shift-training {
            background-color: #f59e0b;
        }

        .shift-vrij {
            background-color: #6b7280;
        }

        /* Modal styling */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .modal {
            background: white;
            border-radius: 0.75rem;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: var(--shadow-lg);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .modal-header h2 {
            font-size: 1.25rem;
            font-weight: 600;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
        }

        .form-groep {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        .form-input, .form-select {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 0.375rem;
            font-size: 0.875rem;
        }

        .form-acties {
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
            margin-top: 2rem;
        }

        /* Maand weergave aanpassingen */
        .maand-weergave .rooster-th {
            padding: 0.5rem 0.25rem;
            font-size: 0.7rem;
        }

        .maand-weergave .dag-naam {
            font-size: 0.65rem;
        }

        .maand-weergave .dag-nummer {
            font-size: 0.875rem;
        }

        .maand-weergave .shift-cel {
            padding: 0.25rem;
            min-height: 40px;
        }

        .maand-weergave .shift-blok {
            font-size: 0.625rem;
            padding: 0.125rem 0.375rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                gap: 1rem;
            }

            .toolbar-content {
                flex-direction: column;
                align-items: stretch;
            }

            .filter-groep {
                flex-direction: column;
                width: 100%;
            }

            .zoek-input {
                width: 100%;
            }

            .main-content {
                padding: 1rem;
            }
        }
    </style>
</head>

<body>
    <div id="root"></div>

    <script>
        const { useState, useEffect, createElement: h, Fragment } = React;

        // =====================
        // Configuratie en constanten
        // =====================
        const shiftTypes = {
            WERK: { id: 'WERK', label: 'Dienst', kleur: 'shift-werk', afkorting: 'D' },
            VERLOF: { id: 'VERLOF', label: 'Verlof', kleur: 'shift-verlof', afkorting: 'VER' },
            ZIEK: { id: 'ZIEK', label: 'Ziek', kleur: 'shift-ziek', afkorting: 'Z' },
            TRAINING: { id: 'TRAINING', label: 'Training', kleur: 'shift-training', afkorting: 'ZTV' },
            VRIJ: { id: 'VRIJ', label: 'Vrij', kleur: 'shift-vrij', afkorting: 'VVD' }
        };

        const teams = [
            { id: 'FLEX', naam: 'FLEXIBEL TEAM', kleur: '#8b5cf6' },
            { id: 'PARKEREN', naam: 'PARKEREN', kleur: '#3b82f6' },
            { id: 'BIJGEDRAG', naam: 'BIJZONDER GEDRAG', kleur: '#f59e0b' },
            { id: 'FLITS', naam: 'SNELHEIDSCONTROLE', kleur: '#10b981' },
            { id: 'VERKEER', naam: 'VERKEERSHANDHAVING', kleur: '#ef4444' }
        ];

        const maandNamenVolledig = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

        // =====================
        // Hulpfuncties
        // =====================
        const getDagenInWeek = (weekNummer, jaar) => {
            const eersteJanuari = new Date(jaar, 0, 1);
            const dagenTotWeek = (weekNummer - 1) * 7;
            const eersteWeekdag = eersteJanuari.getDay() || 7;
            const maandag = new Date(jaar, 0, eersteJanuari.getDate() + dagenTotWeek - eersteWeekdag + 1);
            
            const dagen = [];
            for (let i = 0; i < 7; i++) {
                const dag = new Date(maandag);
                dag.setDate(maandag.getDate() + i);
                dagen.push(dag);
            }
            return dagen;
        };

        const getDagenInMaand = (maand, jaar) => {
            const dagen = [];
            const eerstedag = new Date(jaar, maand, 1);
            const laatstedag = new Date(jaar, maand + 1, 0);
            
            for (let i = 1; i <= laatstedag.getDate(); i++) {
                dagen.push(new Date(jaar, maand, i));
            }
            return dagen;
        };

        const formatteerDatum = (datum) => {
            const dagNamen = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
            return {
                dagNaam: dagNamen[datum.getDay()],
                dagNummer: datum.getDate()
            };
        };

        const getInitialen = (naam) => {
            return naam.split(' ')
                .map(deel => deel[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        };

        const getWeekNummer = (datum) => {
            const d = new Date(Date.UTC(datum.getFullYear(), datum.getMonth(), datum.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
            return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
        };

        // =====================
        // Componenten
        // =====================
        const ShiftModal = ({ isOpen, sluit, opslaan, medewerker, datum, bestaandeShift }) => {
            const [shiftType, setShiftType] = useState(bestaandeShift?.type || 'WERK');
            const [notities, setNotities] = useState(bestaandeShift?.notities || '');

            if (!isOpen) return null;

            const handleOpslaan = () => {
                opslaan({
                    type: shiftType,
                    notities: notities
                });
                sluit();
            };

            return h('div', { className: 'modal-overlay', onClick: sluit },
                h('div', { className: 'modal', onClick: (e) => e.stopPropagation() },
                    h('div', { className: 'modal-header' },
                        h('h2', null, bestaandeShift ? 'Shift Bewerken' : 'Nieuwe Shift'),
                        h('button', { className: 'modal-close', onClick: sluit }, '×')
                    ),
                    h('div', { className: 'form-groep' },
                        h('label', { className: 'form-label' }, 'Medewerker'),
                        h('input', {
                            type: 'text',
                            className: 'form-input',
                            value: medewerker,
                            disabled: true
                        })
                    ),
                    h('div', { className: 'form-groep' },
                        h('label', { className: 'form-label' }, 'Datum'),
                        h('input', {
                            type: 'text',
                            className: 'form-input',
                            value: datum.toLocaleDateString('nl-NL'),
                            disabled: true
                        })
                    ),
                    h('div', { className: 'form-groep' },
                        h('label', { className: 'form-label' }, 'Type Shift'),
                        h('select', {
                            className: 'form-select',
                            value: shiftType,
                            onChange: (e) => setShiftType(e.target.value)
                        },
                            Object.entries(shiftTypes).map(([key, type]) =>
                                h('option', { key: key, value: key }, type.label)
                            )
                        )
                    ),
                    h('div', { className: 'form-groep' },
                        h('label', { className: 'form-label' }, 'Notities'),
                        h('textarea', {
                            className: 'form-input',
                            rows: 3,
                            value: notities,
                            onChange: (e) => setNotities(e.target.value),
                            placeholder: 'Voeg optionele notities toe...'
                        })
                    ),
                    h('div', { className: 'form-acties' },
                        h('button', {
                            className: 'btn btn-secondary',
                            onClick: sluit
                        }, 'Annuleren'),
                        h('button', {
                            className: 'btn btn-primary',
                            onClick: handleOpslaan
                        }, bestaandeShift ? 'Opslaan' : 'Toevoegen')
                    )
                )
            );
        };

        const RoosterApp = () => {
            const huidigeDatum = new Date();
            const [weergaveType, setWeergaveType] = useState('maand');
            const [huidigWeek, setHuidigWeek] = useState(getWeekNummer(huidigeDatum));
            const [huidigJaar, setHuidigJaar] = useState(huidigeDatum.getFullYear());
            const [huidigMaand, setHuidigMaand] = useState(huidigeDatum.getMonth());
            const [medewerkers, setMedewerkers] = useState([
                { id: 1, naam: 'Mels Visser', team: 'FLEX' },
                { id: 2, naam: 'Corne Nijburg', team: 'PARKEREN' },
                { id: 3, naam: 'Mirthe van den Brink', team: 'PARKEREN' },
                { id: 4, naam: 'Elsie Fessehazion', team: 'BIJGEDRAG' },
                { id: 5, naam: 'Aisa Sanches', team: 'FLITS' },
                { id: 6, naam: 'Sam Wissink', team: 'FLITS' },
                { id: 7, naam: 'Sarah Salma', team: 'VERKEER' },
                { id: 8, naam: 'Axel de Wit', team: 'VERKEER' },
                { id: 9, naam: 'Bianca Jacobs', team: 'VERKEER' },
                { id: 10, naam: 'Björn van der Krabben', team: 'VERKEER' },
                { id: 11, naam: 'Bo van Wijnen', team: 'VERKEER' },
                { id: 12, naam: 'Brian Oelen', team: 'VERKEER' },
                { id: 13, naam: 'Demi Schieven', team: 'VERKEER' },
                { id: 14, naam: 'Elise Bijlsma', team: 'VERKEER' },
                { id: 15, naam: 'Hein van Helden', team: 'VERKEER' }
            ]);
            const [shifts, setShifts] = useState({});
            const [zoekTerm, setZoekTerm] = useState('');
            const [geselecteerdTeam, setGeselecteerdTeam] = useState('');
            const [modalOpen, setModalOpen] = useState(false);
            const [geselecteerdeMedewerker, setGeselecteerdeMedewerker] = useState(null);
            const [geselecteerdeDatum, setGeselecteerdeDatum] = useState(null);
            const [bewerkenShift, setBewerkenShift] = useState(null);

            const periodeData = weergaveType === 'week' 
                ? getDagenInWeek(huidigWeek, huidigJaar)
                : getDagenInMaand(huidigMaand, huidigJaar);

            const volgende = () => {
                if (weergaveType === 'week') {
                    if (huidigWeek === 52) {
                        setHuidigWeek(1);
                        setHuidigJaar(huidigJaar + 1);
                    } else {
                        setHuidigWeek(huidigWeek + 1);
                    }
                } else {
                    if (huidigMaand === 11) {
                        setHuidigMaand(0);
                        setHuidigJaar(huidigJaar + 1);
                    } else {
                        setHuidigMaand(huidigMaand + 1);
                    }
                }
            };

            const vorige = () => {
                if (weergaveType === 'week') {
                    if (huidigWeek === 1) {
                        setHuidigWeek(52);
                        setHuidigJaar(huidigJaar - 1);
                    } else {
                        setHuidigWeek(huidigWeek - 1);
                    }
                } else {
                    if (huidigMaand === 0) {
                        setHuidigMaand(11);
                        setHuidigJaar(huidigJaar - 1);
                    } else {
                        setHuidigMaand(huidigMaand - 1);
                    }
                }
            };

            const openShiftModal = (medewerker, datum, shift = null) => {
                setGeselecteerdeMedewerker(medewerker);
                setGeselecteerdeDatum(datum);
                setBewerkenShift(shift);
                setModalOpen(true);
            };

            const sluitModal = () => {
                setModalOpen(false);
                setGeselecteerdeMedewerker(null);
                setGeselecteerdeDatum(null);
                setBewerkenShift(null);
            };

            const opslaanShift = (shiftData) => {
                const key = `${geselecteerdeMedewerker.id}-${geselecteerdeDatum.toISOString().split('T')[0]}`;
                setShifts(prev => ({
                    ...prev,
                    [key]: shiftData
                }));
            };

            const getShiftVoorDag = (medewerkerId, datum) => {
                const key = `${medewerkerId}-${datum.toISOString().split('T')[0]}`;
                return shifts[key];
            };

            const gefilterdeMedewerkers = medewerkers.filter(m => {
                const zoekMatch = m.naam.toLowerCase().includes(zoekTerm.toLowerCase());
                const teamMatch = !geselecteerdTeam || m.team === geselecteerdTeam;
                return zoekMatch && teamMatch;
            });

            const gegroepeerdeData = teams.reduce((acc, team) => {
                acc[team.id] = gefilterdeMedewerkers.filter(m => m.team === team.id);
                return acc;
            }, {});

            return h('div', { className: 'app-container' },
                // Header
                h('header', { className: 'header' },
                    h('div', { className: 'header-content' },
                        h('h1', null, 'Team Rooster Manager'),
                        h('div', { className: 'header-acties' },
                            h('button', { className: 'btn btn-secondary' },
                                h('i', { className: 'fas fa-download' }),
                                'Exporteren'
                            ),
                            h('button', { className: 'btn btn-primary' },
                                h('i', { className: 'fas fa-plus' }),
                                'Medewerker Toevoegen'
                            )
                        )
                    )
                ),

                // Toolbar
                h('div', { className: 'toolbar' },
                    h('div', { className: 'toolbar-content' },
                        h('div', { className: 'periode-navigatie' },
                            h('button', { onClick: vorige },
                                h('i', { className: 'fas fa-chevron-left' })
                            ),
                            h('div', { className: 'periode-display' },
                                weergaveType === 'week' 
                                    ? `Week ${huidigWeek} - ${huidigJaar}`
                                    : `${maandNamenVolledig[huidigMaand]} ${huidigJaar}`
                            ),
                            h('button', { onClick: volgende },
                                h('i', { className: 'fas fa-chevron-right' })
                            ),
                            h('div', { className: 'weergave-toggle', style: { marginLeft: '2rem' } },
                                h('button', {
                                    className: `weergave-optie ${weergaveType === 'week' ? 'actief' : ''}`,
                                    onClick: () => setWeergaveType('week')
                                }, 'Week'),
                                h('button', {
                                    className: `weergave-optie ${weergaveType === 'maand' ? 'actief' : ''}`,
                                    onClick: () => setWeergaveType('maand')
                                }, 'Maand')
                            )
                        ),
                        h('div', { className: 'filter-groep' },
                            h('input', {
                                type: 'text',
                                className: 'zoek-input',
                                placeholder: 'Zoek medewerker...',
                                value: zoekTerm,
                                onChange: (e) => setZoekTerm(e.target.value)
                            }),
                            h('select', {
                                className: 'filter-select',
                                value: geselecteerdTeam,
                                onChange: (e) => setGeselecteerdTeam(e.target.value)
                            },
                                h('option', { value: '' }, 'Alle teams'),
                                teams.map(team =>
                                    h('option', { key: team.id, value: team.id }, team.naam)
                                )
                            )
                        )
                    )
                ),

                // Main content
                h('main', { className: 'main-content' },
                    h('div', { className: `rooster-container ${weergaveType}-weergave` },
                        h('table', { className: 'rooster-table' },
                            h('thead', { className: 'rooster-thead' },
                                h('tr', null,
                                    h('th', { className: 'rooster-th medewerker-col' }, 'Medewerker'),
                                    periodeData.map((dag, index) => {
                                        const { dagNaam, dagNummer } = formatteerDatum(dag);
                                        return h('th', { key: index, className: 'rooster-th' },
                                            h('div', { className: 'datum-header' },
                                                h('span', { className: 'dag-naam' }, dagNaam),
                                                h('span', { className: 'dag-nummer' }, dagNummer)
                                            )
                                        );
                                    })
                                )
                            ),
                            h('tbody', null,
                                teams.map(team => {
                                    const teamMedewerkers = gegroepeerdeData[team.id];
                                    if (teamMedewerkers.length === 0) return null;

                                    return h(Fragment, { key: team.id },
                                        h('tr', { className: 'team-rij' },
                                            h('td', { 
                                                className: 'team-cel',
                                                colSpan: periodeData.length + 1,
                                                style: { color: team.kleur }
                                            }, team.naam)
                                        ),
                                        teamMedewerkers.map(medewerker =>
                                            h('tr', { key: medewerker.id, className: 'medewerker-rij' },
                                                h('td', { className: 'medewerker-cel' },
                                                    h('div', { className: 'medewerker-info' },
                                                        h('div', { 
                                                            className: 'medewerker-avatar',
                                                            style: { backgroundColor: team.kleur }
                                                        }, getInitialen(medewerker.naam)),
                                                        h('span', { className: 'medewerker-naam' }, medewerker.naam)
                                                    )
                                                ),
                                                periodeData.map((dag, dagIndex) => {
                                                    const shift = getShiftVoorDag(medewerker.id, dag);
                                                    return h('td', {
                                                        key: dagIndex,
                                                        className: 'shift-cel',
                                                        onClick: () => openShiftModal(medewerker, dag, shift)
                                                    },
                                                        shift && h('span', {
                                                            className: `shift-blok ${shiftTypes[shift.type].kleur}`,
                                                            title: shiftTypes[shift.type].label
                                                        }, weergaveType === 'maand' ? shiftTypes[shift.type].afkorting : shiftTypes[shift.type].label)
                                                    );
                                                })
                                            )
                                        )
                                    );
                                })
                            )
                        )
                    )
                ),

                // Modal
                h(ShiftModal, {
                    isOpen: modalOpen,
                    sluit: sluitModal,
                    opslaan: opslaanShift,
                    medewerker: geselecteerdeMedewerker?.naam,
                    datum: geselecteerdeDatum,
                    bestaandeShift: bewerkenShift
                })
            );
        };

        // Mount de applicatie
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(h(RoosterApp));
    </script>
</body>

</html>
