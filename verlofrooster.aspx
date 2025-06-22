<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Rooster Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="verlofrooster.css">
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
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
