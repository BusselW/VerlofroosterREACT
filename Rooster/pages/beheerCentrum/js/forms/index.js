/**
 * index.js - Forms module exports
 * Central place to import all form components
 */

export { BaseForm } from './BaseForm.js';
export { MedewerkerForm } from './MedewerkerForm.js';
export { TeamForm } from './TeamForm.js';
export { VerlofredenenForm } from './VerlofredenenForm.js';
export { DagIndicatorForm } from './DagIndicatorForm.js';
export { GenericForm } from './GenericForm.js'; // Keep the existing generic form as fallback

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
