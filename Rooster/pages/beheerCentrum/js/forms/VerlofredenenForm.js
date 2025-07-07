/**
 * VerlofredenenForm.js - Leave reasons form component
 */

import { BaseForm } from './BaseForm.js';

const { createElement: h } = React;

const verlofredenenConfig = {
    width: 'medium',
    sections: [
        {
            title: 'Verlof Reden Details',
            fields: [
                { 
                    name: 'Naam', 
                    label: 'Verlof Naam', 
                    type: 'text', 
                    required: true, 
                    colSpan: 2,
                    help: 'De volledige naam van de verloftype'
                },
                { 
                    name: 'Afkorting', 
                    label: 'Afkorting', 
                    type: 'text', 
                    required: true, 
                    maxLength: 5,
                    help: 'Korte afkorting (max 5 karakters) voor in het rooster'
                },
                { 
                    name: 'Kleur', 
                    label: 'Kleur', 
                    type: 'color', 
                    required: true, 
                    help: 'Kleur voor deze verloftype in het rooster'
                },
                { 
                    name: 'VerlofDag', 
                    label: 'Is Verlofdag', 
                    type: 'checkbox', 
                    help: 'Vink aan als dit een officiële verlofdag is die wordt afgetrokken van verloftegoed'
                },
            ]
        }
    ]
};

export const VerlofredenenForm = ({ onSave, onCancel, initialData = {}, title }) => {
    return h(BaseForm, {
        onSave,
        onCancel,
        initialData,
        config: verlofredenenConfig,
        title: title || `${initialData.Id ? 'Bewerk' : 'Nieuwe'} Verlof Reden`
    });
};
