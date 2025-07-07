/**
 * MedewerkerForm.js - Employee-specific form component
 */

import { BaseForm } from './BaseForm.js';
import { Autocomplete } from '../ui/Autocomplete.js';
import { searchSiteUsers } from '../dataService.js';

const { useState, createElement: h } = React;

const medewerkerConfig = {
    width: 'large',
    sections: [
        {
            title: 'Persoonlijke Gegevens',
            fields: [
                { name: 'Naam', label: 'Volledige Naam', type: 'text', required: true, colSpan: 2 },
                { name: 'Username', label: 'Gebruikersnaam', type: 'text', required: true },
                { name: 'E_x002d_mail', label: 'E-mailadres', type: 'email', required: true },
                { name: 'Geboortedatum', label: 'Geboortedatum', type: 'date' },
                { name: 'Functie', label: 'Functie', type: 'text', required: true },
            ]
        },
        {
            title: 'Werk Details',
            fields: [
                { name: 'Team', label: 'Team', type: 'text', required: true },
                { name: 'Werkschema', label: 'Werkschema', type: 'text' },
                { name: 'UrenPerWeek', label: 'Uren per week', type: 'number', required: true },
                { name: 'Werkdagen', label: 'Werkdagen', type: 'textarea' },
            ]
        },
        {
            title: 'Halve Dag Instellingen',
            fields: [
                { name: 'HalveDagType', label: 'Halve Dag Type', type: 'text' },
                { name: 'HalveDagWeekdag', label: 'Halve Dag Weekdag', type: 'text' },
            ]
        },
        {
            title: 'Opmerkingen & Status',
            fields: [
                { name: 'Opmekring', label: 'Opmerking', type: 'textarea', colSpan: 2 },
                { name: 'OpmerkingGeldigTot', label: 'Opmerking Geldig Tot', type: 'date' },
                { name: 'Actief', label: 'Actief', type: 'checkbox' },
                { name: 'Verbergen', label: 'Verborgen in rooster', type: 'checkbox' },
                { name: 'Horen', label: 'Horen', type: 'checkbox' },
            ]
        }
    ]
};

export const MedewerkerForm = ({ onSave, onCancel, initialData = {}, title }) => {
    const [formData, setFormData] = useState(initialData);

    const handleAutocompleteSelect = (user) => {
        setFormData(prev => ({
            ...prev,
            Naam: user.Title,
            Username: user.LoginName.split('|').pop(),
            E_x002d_mail: user.Email,
        }));
    };

    const handleSaveWithProcessing = async (data) => {
        // Process username format for SharePoint
        let processedData = { ...data };
        if (processedData.Username) {
            processedData.Username = processedData.Username.replace(/\\/g, '\\');
        }
        await onSave(processedData);
    };

    const customContent = h('div', null,
        // Autocomplete for new employees
        !initialData.Id && h('div', { className: 'form-section' },
            h('h3', { className: 'form-section-title' }, 'Zoek Medewerker'),
            h('div', { className: 'form-field' },
                h('label', null, 'Zoek bestaande medewerker'),
                h(Autocomplete, {
                    onSelect: handleAutocompleteSelect,
                    searchFunction: searchSiteUsers,
                    placeholder: 'Type om te zoeken...'
                }),
                h('div', { className: 'form-help' }, 
                    'Zoek een bestaande medewerker om gegevens automatisch in te vullen'
                )
            )
        ),
        
        // Regular form sections
        ...medewerkerConfig.sections.map((section, index) => 
            h('div', { className: 'form-section', key: index },
                h('h3', { className: 'form-section-title' }, section.title),
                h('div', { className: 'form-section-fields' },
                    section.fields.map(field => {
                        const value = formData[field.name] || '';
                        const isReadOnly = field.name === 'Username' || 
                                         (!initialData.Id && ['Naam', 'E_x002d_mail'].includes(field.name));

                        return h('div', { 
                            className: `form-field ${field.colSpan ? `col-span-${field.colSpan}` : ''}`,
                            key: field.name 
                        },
                            h('label', { htmlFor: field.name }, 
                                field.label,
                                field.required && h('span', { className: 'required' }, ' *')
                            ),
                            field.type === 'textarea' ? 
                                h('textarea', {
                                    id: field.name,
                                    name: field.name,
                                    value,
                                    readOnly: isReadOnly,
                                    rows: 4,
                                    onChange: (e) => setFormData(prev => ({
                                        ...prev,
                                        [field.name]: e.target.value
                                    }))
                                }) :
                                field.type === 'checkbox' ?
                                h('input', {
                                    id: field.name,
                                    name: field.name,
                                    type: 'checkbox',
                                    checked: !!value,
                                    onChange: (e) => setFormData(prev => ({
                                        ...prev,
                                        [field.name]: e.target.checked
                                    }))
                                }) :
                                h('input', {
                                    id: field.name,
                                    name: field.name,
                                    type: field.type || 'text',
                                    value,
                                    readOnly: isReadOnly,
                                    onChange: (e) => setFormData(prev => ({
                                        ...prev,
                                        [field.name]: e.target.value
                                    }))
                                }),
                            field.help && h('div', { className: 'form-help' }, field.help)
                        );
                    })
                )
            )
        )
    );

    return h(BaseForm, {
        onSave: handleSaveWithProcessing,
        onCancel,
        initialData: formData,
        config: medewerkerConfig,
        title,
        children: customContent
    });
};
