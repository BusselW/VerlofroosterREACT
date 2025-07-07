/**
 * TeamForm.js - Team-specific form component
 */

import { BaseForm } from './BaseForm.js';

const { createElement: h } = React;

const teamConfig = {
    width: 'medium',
    sections: [
        {
            title: 'Team Informatie',
            fields: [
                { 
                    name: 'Naam', 
                    label: 'Team Naam', 
                    type: 'text', 
                    required: true, 
                    colSpan: 2,
                    help: 'De naam van het team zoals deze wordt weergegeven in het rooster'
                },
                { 
                    name: 'Teamleider', 
                    label: 'Teamleider', 
                    type: 'text', 
                    required: true,
                    help: 'Naam van de teamleider'
                },
                { 
                    name: 'TeamleiderId', 
                    label: 'Teamleider ID', 
                    type: 'text',
                    help: 'Interne ID van de teamleider (optioneel)'
                },
                { 
                    name: 'Kleur', 
                    label: 'Team Kleur', 
                    type: 'color', 
                    required: true, 
                    help: 'Kies een unieke kleur voor dit team in het rooster'
                },
                { 
                    name: 'Actief', 
                    label: 'Actief', 
                    type: 'checkbox',
                    help: 'Vink aan als dit team actief is en zichtbaar moet zijn'
                },
            ]
        }
    ]
};

export const TeamForm = ({ onSave, onCancel, initialData = {}, title }) => {
    return h(BaseForm, {
        onSave,
        onCancel,
        initialData,
        config: teamConfig,
        title: title || `${initialData.Id ? 'Bewerk' : 'Nieuw'} Team`
    });
};
