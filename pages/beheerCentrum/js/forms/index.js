/**
 * index.js - Forms module exports
 * Central place to import all form components
 */

import { BaseForm } from './BaseForm.js';
import { MedewerkerForm } from './MedewerkerForm.js';
import { TeamForm } from './TeamForm.js';
import { VerlofredenenForm } from './VerlofredenenForm.js';
import { DagIndicatorForm } from './DagIndicatorForm.js';
import { GenericForm } from './GenericForm.js';

// Re-export all forms
export { BaseForm, MedewerkerForm, TeamForm, VerlofredenenForm, DagIndicatorForm, GenericForm };

// Form factory function to get the right form component
export const getFormComponent = (tabType) => {
    const formMap = {
        'medewerkers': MedewerkerForm,
        'teams': TeamForm,
        'verlofredenen': VerlofredenenForm,
        'dagenindicators': DagIndicatorForm,
        // Add more specific forms as needed
        // 'verlof': VerlofForm,
        // 'compensatieuren': CompensatieUrenForm,
    };

    return formMap[tabType] || GenericForm; // Fallback to GenericForm
};