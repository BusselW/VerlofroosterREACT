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
    return { date: dateTimeString, time: defaultTime };
};

/**
 * Formulier voor het aanvragen van verlof.
 * @param {object} props
 * @param {function} props.onSubmit - Functie die wordt aangeroepen bij het submitten.
 * @param {function} props.onClose - Functie die wordt aangeroepen bij annuleren.
 * @param {object} [props.initialData={}] - Optionele initiële data voor het formulier.
 * @param {Array<object>} [props.medewerkers=[]] - Lijst van medewerkers.
 * @param {object} [props.selection=null] - Geselecteerde datum/tijd uit de kalender.
 */
const VerlofAanvraagForm = ({ onSubmit, onClose, initialData = {}, medewerkers = [], selection = null }) => {
    const [medewerkerId, setMedewerkerId] = useState('');
    const [medewerkerUsername, setMedewerkerUsername] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [redenId, setRedenId] = useState(2); // Fixed RedenID for Verlof/vakantie
    const [omschrijving, setOmschrijving] = useState('');
    const [status, setStatus] = useState('Nieuw');

    useEffect(() => {
        const initializeForm = async () => {
            if (Object.keys(initialData).length === 0) {
                // --- Nieuwe aanvraag: Huidige gebruiker en defaults instellen ---
                const currentUser = await getCurrentUserInfo();
                if (currentUser && medewerkers.length > 0) {
                    const loginName = currentUser.LoginName.split('|')[1];
                    const medewerker = medewerkers.find(m => m.Username === loginName);
                    if (medewerker) {
                        setMedewerkerId(medewerker.Id);
                        setMedewerkerUsername(medewerker.Username);
                    }
                }
                const today = toInputDateString(new Date());
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
            } else {
                // --- Bestaande aanvraag: Data uit initialData laden ---
                setMedewerkerId(initialData.MedewerkerID || '');
                if (initialData.MedewerkerID) {
                    const medewerker = medewerkers.find(m => m.Id === initialData.MedewerkerID);
                    if (medewerker) setMedewerkerUsername(medewerker.Username);
                }

                const { date: initialStartDate, time: initialStartTime } = splitDateTime(initialData.StartDatum, '09:00');
                setStartDate(initialStartDate);
                setStartTime(initialStartTime);

                const { date: initialEndDate, time: initialEndTime } = splitDateTime(initialData.EindDatum, '17:00');
                setEndDate(initialEndDate);
                setEndTime(initialEndTime);

                setOmschrijving(initialData.Omschrijving || '');
                setStatus(initialData.Status || 'Nieuw');
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
            Title: `Verlofaanvraag - ${fullName} - ${currentDate}`,
            Medewerker: selectedMedewerker ? selectedMedewerker.Title : null,
            MedewerkerID: medewerkerUsername,
            StartDatum: `${startDate}T${startTime}:00`,
            EindDatum: `${endDate}T${endTime}:00`,
            RedenId: redenId,
            Omschrijving: omschrijving,
            Status: status,
        };
        onSubmit(formData);
    };

    return h('form', { onSubmit: handleSubmit, className: 'modal-form' },
        h('h2', { className: 'form-title' }, 'Verlof Aanvragen'),
        h('input', { type: 'hidden', name: 'Status', value: status }),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'verlof-medewerker' }, 'Medewerker'),
                h('select', { className: 'form-select', id: 'verlof-medewerker', value: medewerkerId, onChange: handleMedewerkerChange, required: true },
                    h('option', { value: '', disabled: true }, 'Selecteer medewerker'),
                    medewerkers.map(m => h('option', { key: m.Id, value: m.Id }, m.Title))
                )
            ),
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'verlof-medewerker-id' }, 'Medewerker ID'),
                h('input', { className: 'form-input', type: 'text', id: 'verlof-medewerker-id', value: medewerkerUsername, readOnly: true, disabled: true })
            )
        ),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'verlof-start-datum' }, 'Startdatum *'),
                h('input', { className: 'form-input', type: 'date', id: 'verlof-start-datum', value: startDate, onChange: (e) => setStartDate(e.target.value), required: true })
            ),
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'verlof-start-tijd' }, 'Starttijd *'),
                h('input', { className: 'form-input', type: 'time', id: 'verlof-start-tijd', value: startTime, onChange: (e) => setStartTime(e.target.value), required: true })
            )
        ),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'verlof-eind-datum' }, 'Einddatum *'),
                h('input', { className: 'form-input', type: 'date', id: 'verlof-eind-datum', value: endDate, onChange: (e) => setEndDate(e.target.value), required: true, min: startDate })
            ),
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'verlof-eind-tijd' }, 'Eindtijd *'),
                h('input', { className: 'form-input', type: 'time', id: 'verlof-eind-tijd', value: endTime, onChange: (e) => setEndTime(e.target.value), required: true })
            )
        ),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'verlof-reden' }, 'Reden'),
                h('input', { className: 'form-input', id: 'verlof-reden', type: 'text', value: 'Verlof/vakantie', disabled: true })
            ),
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'verlof-reden-id' }, 'Reden ID'),
                h('input', { className: 'form-input', id: 'verlof-reden-id', type: 'text', value: redenId, disabled: true })
            )
        ),

        h('div', { className: 'form-row' },
            h('div', { className: 'form-groep' },
                h('label', { htmlFor: 'verlof-omschrijving' }, 'Omschrijving (optioneel)'),
                h('textarea', { className: 'form-textarea', id: 'verlof-omschrijving', rows: 4, value: omschrijving, onChange: (e) => setOmschrijving(e.target.value), placeholder: 'Eventuele toelichting bij je verlofaanvraag.' })
            )
        ),

        h('div', { className: 'form-acties' },
            h('button', { type: 'button', className: 'btn btn-secondary', onClick: onClose }, 'Sluiten'),
            h('button', { type: 'submit', className: 'btn btn-primary' }, 'Verlofaanvraag Indienen')
        )
    );
};

export default VerlofAanvraagForm;