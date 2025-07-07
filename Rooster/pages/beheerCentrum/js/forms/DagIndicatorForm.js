/**
 * DagIndicatorForm.js - Day indicator form component
 */

import { BaseForm } from './BaseForm.js';

const { createElement: h } = React;

const dagIndicatorConfig = {
    width: 'medium',
    sections: [
        {
            title: 'Indicator Details',
            fields: [
                { 
                    name: 'Title', 
                    label: 'Titel', 
                    type: 'text', 
                    required: true, 
                    colSpan: 2,
                    help: 'De naam van deze dag indicator'
                },
                { 
                    name: 'Beschrijving', 
                    label: 'Beschrijving', 
                    type: 'text', 
                    required: true, 
                    colSpan: 2,
                    help: 'Beschrijving van wat deze indicator betekent'
                },
                { 
                    name: 'Kleur', 
                    label: 'Kleur', 
                    type: 'color', 
                    required: true, 
                    help: 'Kleur voor deze indicator in het rooster'
                },
                { 
                    name: 'Patroon', 
                    label: 'Patroon', 
                    type: 'text',
                    help: 'Patroon of regel voor deze indicator (optioneel)'
                },
                { 
                    name: 'Validatie', 
                    label: 'Validatie', 
                    type: 'text',
                    help: 'Validatie regels voor deze indicator (optioneel)'
                },
            ]
        }
    ]
};

export const DagIndicatorForm = ({ onSave, onCancel, initialData = {}, title }) => {
    return h(BaseForm, {
        onSave,
        onCancel,
        initialData,
        config: dagIndicatorConfig,
        title: title || `${initialData.Id ? 'Bewerk' : 'Nieuwe'} Dag Indicator`
    });
};
