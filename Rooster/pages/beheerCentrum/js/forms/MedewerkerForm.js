/**
 * MedewerkerForm.js - Employee-specific form component
 */

import { BaseForm } from './BaseForm.js';
import { Autocomplete } from '../ui/Autocomplete.js';
import { searchSiteUsers, getListItems } from '../dataService.js';

const { useState, useEffect, createElement: h } = React;

const medewerkerConfig = {
    width: 'large',
    sections: [
        {
            title: 'Persoonlijke Gegevens',
            fields: [
                { name: 'Naam', label: 'Volledige Naam', type: 'text', required: true, colSpan: 2, placeholder: 'Bijv. Jan de Vries' },
                { name: 'Username', label: 'Gebruikersnaam', type: 'text', required: true, readOnly: true, placeholder: 'Bijv. org\\jdevries' },
                { name: 'E_x002d_mail', label: 'E-mailadres', type: 'email', required: true, readOnly: true, placeholder: 'Bijv. jan.devries@organisatie.nl' },
                { name: 'Geboortedatum', label: 'Geboortedatum', type: 'date', placeholder: 'DD-MM-JJJJ' },
                { name: 'Functie', label: 'Functie', type: 'select', required: true, placeholder: 'Selecteer een functie...' },
                { name: 'Team', label: 'Team', type: 'select', required: true, placeholder: 'Selecteer een team...' },
            ]
        },
        {
            title: 'Opmerkingen & Status',
            fields: [
                { name: 'Opmekring', label: 'Opmerking', type: 'textarea', colSpan: 2, placeholder: 'Voeg eventuele opmerkingen toe...' },
                { name: 'OpmerkingGeldigTot', label: 'Opmerking Geldig Tot', type: 'date', placeholder: 'DD-MM-JJJJ' },
                { name: 'Actief', label: 'Actief', type: 'checkbox' },
                { name: 'Verbergen', label: 'Verborgen in rooster', type: 'checkbox' },
                { name: 'Horen', label: 'Horen', type: 'checkbox' },
            ]
        }
    ]
};

export const MedewerkerForm = ({ onSave, onCancel, initialData = {}, title }) => {
    const [formData, setFormData] = useState(initialData);
    const [teams, setTeams] = useState([]);
    const [functies, setFuncties] = useState([]);

    // Load teams and functions on mount
    useEffect(() => {
        const loadOptions = async () => {
            try {
                // Load teams
                if (window.appConfiguratie && window.appConfiguratie.Teams) {
                    const teamsData = await getListItems('Teams');
                    setTeams(teamsData.filter(team => team.Actief !== false).map(team => ({
                        value: team.Naam,
                        label: team.Naam
                    })));
                }

                // Load functions from keuzelijstFuncties
                if (window.appConfiguratie && window.appConfiguratie.keuzelijstFuncties) {
                    const functiesData = await getListItems('keuzelijstFuncties');
                    setFuncties(functiesData.map(functie => ({
                        value: functie.Title,
                        label: functie.Title
                    })));
                }
            } catch (error) {
                console.error('Error loading dropdown options:', error);
            }
        };

        loadOptions();
    }, []);

    const handleAutocompleteSelect = (user) => {
        setFormData(prev => ({
            ...prev,
            Username: user.LoginName.split('|').pop(),
            E_x002d_mail: user.Email,
            // Don't prefill Naam - let user see placeholder instead
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

    const renderField = (field) => {
        const value = formData[field.name] || '';
        const isReadOnly = field.readOnly || (!initialData.Id && ['Username', 'E_x002d_mail'].includes(field.name));

        if (field.type === 'select') {
            const options = field.name === 'Team' ? teams : field.name === 'Functie' ? functies : [];
            
            return h('select', {
                id: field.name,
                name: field.name,
                value,
                required: field.required,
                className: 'form-select',
                onChange: (e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: e.target.value
                }))
            },
                h('option', { value: '', disabled: true }, field.placeholder || 'Selecteer...'),
                options.map(option => 
                    h('option', { key: option.value, value: option.value }, option.label)
                )
            );
        }

        if (field.type === 'textarea') {
            return h('textarea', {
                id: field.name,
                name: field.name,
                value,
                readOnly: isReadOnly,
                rows: 3,
                placeholder: field.placeholder,
                className: isReadOnly ? 'form-input readonly' : 'form-input',
                onChange: (e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: e.target.value
                }))
            });
        }

        if (field.type === 'checkbox') {
            return h('input', {
                id: field.name,
                name: field.name,
                type: 'checkbox',
                checked: !!value,
                className: 'form-checkbox',
                onChange: (e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: e.target.checked
                }))
            });
        }

        return h('input', {
            id: field.name,
            name: field.name,
            type: field.type || 'text',
            value,
            readOnly: isReadOnly,
            required: field.required,
            placeholder: field.placeholder,
            className: isReadOnly ? 'form-input readonly' : 'form-input',
            onChange: (e) => setFormData(prev => ({
                ...prev,
                [field.name]: e.target.value
            }))
        });
    };

    const customContent = h('div', { className: 'medewerker-form-content' },
        // Autocomplete for new employees
        !initialData.Id && h('div', { className: 'form-section autocomplete-section' },
            h('h3', { className: 'form-section-title' }, 'Zoek Medewerker'),
            h('div', { className: 'form-field' },
                h('label', { className: 'form-label' }, 'Zoek bestaande medewerker'),
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
                        return h('div', { 
                            className: `form-field ${field.colSpan ? `col-span-${field.colSpan}` : ''}`,
                            key: field.name 
                        },
                            h('label', { 
                                htmlFor: field.name,
                                className: 'form-label'
                            }, 
                                field.label,
                                field.required && h('span', { className: 'required' }, ' *')
                            ),
                            renderField(field),
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
