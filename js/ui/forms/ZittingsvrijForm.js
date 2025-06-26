import { getCurrentUserInfo } from '../../services/sharepointService.js';

const { createElement: h, useState, useEffect } = React;

const toInputDateString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const splitDateTime = (dateTimeString, defaultTime = '09:00') => {
    if (!dateTimeString) return { date: '', time: '' };
    if (dateTimeString.includes('T')) {
        const [date, timePart] = dateTimeString.split('T');
        return { date, time: timePart.substring(0, 5) };
    }
    // Fallback for date-only strings or other formats
    return { date: dateTimeString, time: defaultTime };
};

/**
 * Formulier voor het registreren van een zittingsvrije dag.
 * @param {object} props
 * @param {function} props.onSubmit - Functie die wordt aangeroepen bij het submitten.
 * @param {function} props.onCancel - Functie die wordt aangeroepen bij annuleren.
 * @param {object} [props.initialData={}] - Optionele initiële data voor het formulier.
 * @param {Array<object>} props.medewerkers - Lijst van medewerkers om uit te kiezen.
 */
const ZittingsvrijForm = ({ onSubmit, onCancel, initialData = {}, medewerkers = [], selection = null }) => {
    const [medewerkerId, setMedewerkerId] = useState('');
    const [medewerkerUsername, setMedewerkerUsername] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [title, setTitle] = useState(initialData.Title || '');
    const [opmerking, setOpmerking] = useState(initialData.Opmerking || null);
    const [terugkerend, setTerugkerend] = useState(initialData.Terugkerend || false);
    const [terugkerendTot, setTerugkerendTot] = useState('');
    const [terugkeerPatroon, setTerugkeerPatroon] = useState('Wekelijks');

    useEffect(() => {
        const initializeForm = async () => {
            const today = toInputDateString(new Date());
            if (Object.keys(initialData).length === 0) { // Nieuw item
                // 1. Datums instellen
                if (selection && selection.start) {
                    setStartDate(toInputDateString(selection.start));
                    const endDateValue = selection.end ? toInputDateString(selection.end) : toInputDateString(selection.start);
                    setEndDate(endDateValue);
                } else {
                    setStartDate(today);
                    setEndDate(today);
                }
                setStartTime('09:00');
                setEndTime('17:00');

                // 2. Medewerker instellen
                let employeeSet = false;
                if (selection && selection.medewerkerId) {
                    const medewerker = medewerkers.find(m => m.Username === selection.medewerkerId);
                    if (medewerker) {
                        setMedewerkerId(medewerker.Id);
                        setMedewerkerUsername(medewerker.Username);
                        employeeSet = true;
                    }
                }
                
                if (!employeeSet) {
                    const currentUser = await getCurrentUserInfo();
                    if (currentUser && medewerkers.length > 0) {
                        const loginName = currentUser.LoginName.split('|')[1];
                        const medewerker = medewerkers.find(m => m.Username === loginName);
                        if (medewerker) {
                            setMedewerkerId(medewerker.Id);
                            setMedewerkerUsername(medewerker.Username);
                        }
                    }
                }

                // 3. Specifieke defaults voor dit formulier instellen
                setTitle('');
                setOpmerking(null);
                setTerugkerend(false);
                setTerugkerendTot(today);
                setTerugkeerPatroon('Wekelijks');

            } else {
                // Bestaande aanvraag
                setMedewerkerId(initialData.MedewerkerID || '');
                if (initialData.MedewerkerID) {
                    const medewerker = medewerkers.find(m => m.Id === initialData.MedewerkerID);
                    if (medewerker) setMedewerkerUsername(medewerker.Username);
                }

                const { date: initialStartDate, time: initialStartTime } = splitDateTime(initialData.ZittingsVrijeDagTijd, '09:00');
                setStartDate(initialStartDate);
                setStartTime(initialStartTime);

                const { date: initialEndDate, time: initialEndTime } = splitDateTime(initialData.ZittingsVrijeDagTijdEind, '17:00');
                setEndDate(initialEndDate);
                setEndTime(initialEndTime);

                setTitle(initialData.Title || '');
                setOpmerking(initialData.Opmerking || null);
                setTerugkerend(initialData.Terugkerend || false);
                setTerugkerendTot(initialData.TerugkerendTot ? toInputDateString(new Date(initialData.TerugkerendTot)) : today);
                setTerugkeerPatroon(initialData.TerugkeerPatroon || 'Wekelijks');
            }
        };

        initializeForm();
    }, [initialData, medewerkers, selection]);

    const handleMedewerkerChange = (e) => {
        const selectedId = e.target.value;
        setMedewerkerId(selectedId);
        const medewerker = medewerkers.find(m => m.Id == selectedId);
        if (medewerker) {
            setMedewerkerUsername(medewerker.Username);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedMedewerker = medewerkers.find(m => m.Id === parseInt(medewerkerId, 10));
        const fullName = selectedMedewerker ? selectedMedewerker.Title : 'Onbekend';
        const currentDate = new Date().toLocaleDateString('nl-NL');

        const formData = {
            Title: title || `Zittingsvrij - ${fullName} - ${currentDate}`,
            Medewerker: selectedMedewerker ? selectedMedewerker.Title : null,
            MedewerkerID: medewerkerUsername,
            StartDatum: `${startDate}T${startTime}:00`,
            EindDatum: `${endDate}T${endTime}:00`,
            Opmerking: opmerking,
            Terugkerend: terugkerend,
            TerugkerendTot: terugkerend ? terugkerendTot : null,
            TerugkeerPatroon: terugkerend ? terugkeerPatroon : null,
        };
        onSubmit(formData);
    };

    return h('form', { onSubmit: handleSubmit, className: 'modal-form' },
        h('h2', { className: 'form-title' }, 'Zittingsvrij Registreren'),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-medewerker' }, 'Medewerker'),
                h('select', {
                    id: 'zv-medewerker',
                    className: 'form-select',
                    value: medewerkerId,
                    onChange: handleMedewerkerChange,
                    required: true
                },
                    h('option', { value: '', disabled: true }, 'Selecteer medewerker'),
                    medewerkers.map(m => h('option', { key: m.Id, value: m.Id }, m.Title))
                )
            ),
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-medewerker-id' }, 'Medewerker ID'),
                h('input', { className: 'form-input', type: 'text', id: 'zv-medewerker-id', value: medewerkerUsername, readOnly: true, disabled: true })
            )
        ),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-start-datum' }, 'Startdatum'),
                h('input', { type: 'date', id: 'zv-start-datum', className: 'form-input', value: startDate, onChange: (e) => setStartDate(e.target.value), required: true })
            ),
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-start-tijd' }, 'Starttijd'),
                h('input', { type: 'time', id: 'zv-start-tijd', className: 'form-input', value: startTime, onChange: (e) => setStartTime(e.target.value), required: true })
            )
        ),
        
        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-eind-datum' }, 'Einddatum'),
                h('input', { type: 'date', id: 'zv-eind-datum', className: 'form-input', value: endDate, onChange: (e) => setEndDate(e.target.value), required: true, min: startDate })
            ),
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-eind-tijd' }, 'Eindtijd'),
                h('input', { type: 'time', id: 'zv-eind-tijd', className: 'form-input', value: endTime, onChange: (e) => setEndTime(e.target.value), required: true })
            )
        ),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-title' }, 'Titel / Reden'),
                h('input', { type: 'text', id: 'zv-title', className: 'form-input', value: title, onChange: (e) => setTitle(e.target.value), required: true, placeholder: 'Korte omschrijving, bijv. Cursus' })
            )
        ),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-opmerking' }, 'Opmerking (optioneel)'),
                h('textarea', { id: 'zv-opmerking', className: 'form-textarea', rows: 3, value: opmerking || '', onChange: (e) => setOpmerking(e.target.value), placeholder: 'Extra details' })
            )
        ),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep form-groep-checkbox' },
                h('input', { 
                    type: 'checkbox', 
                    id: 'zv-terugkerend', 
                    className: 'form-checkbox', 
                    checked: terugkerend, 
                    onChange: (e) => setTerugkerend(e.target.checked) 
                }),
                h('label', { htmlFor: 'zv-terugkerend' }, 'Terugkerende afspraak')
            )
        ),

        terugkerend && h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-terugkerend-tot' }, 'Herhalen tot'),
                h('input', { 
                    type: 'date', 
                    id: 'zv-terugkerend-tot', 
                    className: 'form-input', 
                    value: terugkerendTot, 
                    onChange: (e) => setTerugkerendTot(e.target.value),
                    min: startDate,
                    required: true
                })
            ),
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'zv-terugkeer-patroon' }, 'Herhaalpatroon'),
                h('select', { 
                    id: 'zv-terugkeer-patroon', 
                    className: 'form-select', 
                    value: terugkeerPatroon, 
                    onChange: (e) => setTerugkeerPatroon(e.target.value),
                    required: true
                },
                    h('option', { value: 'Wekelijks' }, 'Wekelijks'),
                    h('option', { value: 'Maandelijks' }, 'Maandelijks')
                )
            )
        ),

        h('div', { className: 'form-acties' },
            h('button', { type: 'submit', className: 'btn btn-primary' }, 'Opslaan'),
            h('button', { type: 'button', className: 'btn btn-secondary', onClick: onCancel }, 'Annuleren')
        )
    );
};

export default ZittingsvrijForm;