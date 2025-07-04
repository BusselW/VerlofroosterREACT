import { Autocomplete } from '../ui/Autocomplete.js';
import { searchSiteUsers } from '../dataService.js';

const { useState, createElement: h } = React;

/**
 * A form for creating or editing a Medewerker.
 * @param {object} props
 * @param {(formData: object) => void} props.onSave
 * @param {() => void} props.onCancel
 * @param {object} [props.initialData]
 * @param {object[]} props.fields - The fields to display in the form, from dataTabs.js formFields.
 */
export const MedewerkerForm = ({ onSave, onCancel, initialData = {}, fields = [] }) => {
    const [formData, setFormData] = useState(initialData);

    const handleAutocompleteSelect = (user) => {
        // Map SharePoint user data to your form fields
        setFormData(prev => ({
            ...prev,
            Naam: user.Title, // e.g., Bussel, van, W.
            Username: user.LoginName.split('|').pop(), // e.g., org\busselw
            E_x002d_mail: user.Email,
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ensure username is in the correct format before saving
        const dataToSave = {
            ...formData,
            Username: formData.Username ? formData.Username.replace(/\\/g, '\\') : '',
        };
        onSave(dataToSave);
    };

    const renderField = (field, isFullWidth = false) => {
        if (!field) return null;

        const isReadOnly = field.name === 'Username' || (!initialData.Id && ['Naam', 'E_x002d_mail'].includes(field.name));

        const commonProps = {
            id: field.name,
            name: field.name,
            value: formData[field.name] || '',
            onChange: handleChange,
            readOnly: isReadOnly,
        };

        const inputElement = field.type === 'textarea'
            ? h('textarea', { ...commonProps, rows: 3 })
            : h('input', { ...commonProps, type: field.type });

        return h('div', { key: field.name, className: `form-field ${isFullWidth ? 'full-width' : ''}` },
            h('label', { htmlFor: field.name }, field.label),
            inputElement
        );
    };

    const findField = (name) => fields.find(f => f.name === name);

    const booleanFields = fields.filter(f => f.type === 'checkbox');

    return h('form', { className: 'modal-form', onSubmit: handleSubmit },
        h('h2', { className: 'form-title' }, initialData.Id ? 'Medewerker Bewerken' : 'Nieuwe Medewerker'),

        !initialData.Id && h('div', { className: 'form-field full-width' },
            h('label', null, 'Zoek Medewerker'),
            h(Autocomplete, {
                onSelect: handleAutocompleteSelect,
                searchFunction: searchSiteUsers
            })
        ),

        h('div', { className: 'form-grid' },
            renderField(findField('Naam')),
            renderField(findField('Username')),
            renderField(findField('E_x002d_mail')),
            renderField(findField('Functie')),
            renderField(findField('Team')),
            renderField(findField('Werkschema')),
            renderField(findField('UrenPerWeek')),
        ),

        renderField(findField('Opmekring'), true),

        h('div', { className: 'toggle-group' },
            ...booleanFields.map(field => {
                return h('div', { key: field.name, className: 'form-field toggle-switch' },
                    h('span', null, field.label),
                    h('input', {
                        type: 'checkbox',
                        id: field.name,
                        name: field.name,
                        checked: !!formData[field.name],
                        onChange: handleChange,
                    }),
                    h('label', { htmlFor: field.name }, `Toggle ${field.label}`)
                );
            })
        ),

        h('div', { className: 'form-actions' },
            h('button', { type: 'button', className: 'btn-secondary', onClick: onCancel }, 'Annuleren'),
            h('button', { type: 'submit', className: 'btn-primary' }, 'Opslaan')
        )
    );
};
