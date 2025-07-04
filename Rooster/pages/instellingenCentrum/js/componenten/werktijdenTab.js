/**
 * @file werktijdenTab.js
 * @description Work Hours Tab Component for Settings Page
 */

import { 
    fetchSharePointList, 
    createSharePointListItem, 
    updateSharePointListItem,
    getCurrentUserInfo 
} from '../../../../js/services/sharepointService.js';
import { 
    maakItem, 
    leesItems, 
    bewerkItem 
} from '../../../../js/services/sharepointCRUD.js';

const { useState, createElement: h } = React;

// =====================
// Work Hours Tab Component
// =====================
export const WorkHoursTab = ({ user, data }) => {
    // State management
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [scheduleType, setScheduleType] = useState('fixed'); // 'fixed' or 'rotating'
    const [activeWeek, setActiveWeek] = useState('A');
    const [workHours, setWorkHours] = useState({
        monday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false },
        tuesday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false },
        wednesday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false },
        thursday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false },
        friday: { start: '09:00', end: '17:00', hours: 8, type: 'Normaal', isFreeDag: false }
    });
    const [workHoursB, setWorkHoursB] = useState({
        monday: { start: '10:00', end: '18:00', hours: 8, type: 'Normaal', isFreeDag: false },
        tuesday: { start: '10:00', end: '18:00', hours: 8, type: 'Normaal', isFreeDag: false },
        wednesday: { start: '10:00', end: '18:00', hours: 8, type: 'Normaal', isFreeDag: false },
        thursday: { start: '10:00', end: '18:00', hours: 8, type: 'Normaal', isFreeDag: false },
        friday: { start: '--:--', end: '--:--', hours: 0, type: 'VVD', isFreeDag: true }
    });
    const [bulkTimes, setBulkTimes] = useState({ start: '09:00', end: '17:00' });

    // Load user data
    React.useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        try {
            const user = await getCurrentUserInfo();
            setUserInfo(user);
            // TODO: Load existing work hours from SharePoint when available
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setFeedback(null);
        
        try {
            // TODO: Implement save logic to SharePoint
            // This will involve creating/updating records in the work hours list
            // Example structure for the save data:
            const saveData = {
                scheduleType,
                workHours,
                workHoursB: scheduleType === 'rotating' ? workHoursB : null,
                userId: userInfo?.LoginName
            };
            
            // Simulate save for now
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setFeedback({ type: 'success', message: 'Werktijden succesvol opgeslagen!' });
        } catch (error) {
            console.error('Error saving work hours:', error);
            setFeedback({ type: 'error', message: 'Fout bij opslaan van werktijden. Probeer opnieuw.' });
        } finally {
            setIsLoading(false);
            // Clear feedback after 3 seconds
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    const days = [
        { key: 'monday', label: 'Maandag', short: 'Ma' },
        { key: 'tuesday', label: 'Dinsdag', short: 'Di' },
        { key: 'wednesday', label: 'Woensdag', short: 'Wo' },
        { key: 'thursday', label: 'Donderdag', short: 'Do' },
        { key: 'friday', label: 'Vrijdag', short: 'Vr' }
    ];

    const dayTypes = [
        { value: 'Normaal', label: 'Normaal', color: '#27ae60' },
        { value: 'VVD', label: 'Volledige Vrije Dag', color: '#e74c3c' },
        { value: 'VVO', label: 'Vrije Voormiddag', color: '#f39c12' },
        { value: 'VVM', label: 'Vrije Namiddag', color: '#f39c12' }
    ];

    const calculateHours = (start, end) => {
        if (!start || !end || start === '--:--' || end === '--:--') return 0;
        const startTime = new Date(`2000-01-01T${start}:00`);
        const endTime = new Date(`2000-01-01T${end}:00`);
        if (endTime <= startTime) return 0;
        return Math.round(((endTime - startTime) / (1000 * 60 * 60)) * 10) / 10;
    };

    const getCurrentWeekHours = () => {
        const currentHours = scheduleType === 'rotating' && activeWeek === 'B' ? workHoursB : workHours;
        return days.reduce((total, day) => total + currentHours[day.key].hours, 0);
    };

    const handleTimeChange = (day, field, value) => {
        const currentWeekData = scheduleType === 'rotating' && activeWeek === 'B' ? workHoursB : workHours;
        const setCurrentWeekData = scheduleType === 'rotating' && activeWeek === 'B' ? setWorkHoursB : setWorkHours;
        
        setCurrentWeekData(prev => {
            const updated = { ...prev };
            updated[day] = { ...updated[day], [field]: value };
            
            // Recalculate hours if start or end time changed
            if (field === 'start' || field === 'end') {
                const hours = calculateHours(
                    field === 'start' ? value : updated[day].start,
                    field === 'end' ? value : updated[day].end
                );
                updated[day].hours = hours;
                
                // Auto-determine day type based on times
                if (updated[day].isFreeDag) {
                    updated[day].type = 'VVD';
                } else if (!value || value === '--:--') {
                    updated[day].type = 'VVD';
                } else {
                    updated[day].type = 'Normaal';
                }
            }
            
            return updated;
        });
    };

    const handleBulkTimeSet = () => {
        const currentWeekData = scheduleType === 'rotating' && activeWeek === 'B' ? workHoursB : workHours;
        const setCurrentWeekData = scheduleType === 'rotating' && activeWeek === 'B' ? setWorkHoursB : setWorkHours;
        
        setCurrentWeekData(prev => {
            const updated = { ...prev };
            days.forEach(day => {
                if (!updated[day.key].isFreeDag) {
                    updated[day.key].start = bulkTimes.start;
                    updated[day.key].end = bulkTimes.end;
                    updated[day.key].hours = calculateHours(bulkTimes.start, bulkTimes.end);
                    updated[day.key].type = 'Normaal';
                }
            });
            return updated;
        });
    };

    const getDayTypeStyle = (type) => {
        const dayType = dayTypes.find(dt => dt.value === type);
        return {
            backgroundColor: dayType?.color || '#e0e0e0',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500'
        };
    };

    return h('div', null,
        h('div', { className: 'tab-header' },
            h('h2', null, 
                h('svg', { 
                    width: '24', 
                    height: '24', 
                    fill: 'currentColor', 
                    viewBox: '0 0 20 20',
                    style: { marginRight: '0.5rem' }
                }, 
                    h('path', { 
                        fillRule: 'evenodd', 
                        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z', 
                        clipRule: 'evenodd' 
                    })
                ),
                'Mijn Werktijden'
            ),
            h('p', { className: 'text-muted mb-4' }, 'Beheer uw standaard werktijden en werkschema.')
        ),

        // Schedule Type Selection Card
        h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 'Werkschema Type'),
            h('div', { className: 'schedule-type-selector' },
                h('label', { className: 'radio-option' },
                    h('input', {
                        type: 'radio',
                        name: 'scheduleType',
                        value: 'fixed',
                        checked: scheduleType === 'fixed',
                        onChange: (e) => setScheduleType(e.target.value)
                    }),
                    h('span', null, 'Vast schema'),
                    h('small', { className: 'text-muted' }, 'Elke week dezelfde tijden')
                ),
                h('label', { className: 'radio-option' },
                    h('input', {
                        type: 'radio',
                        name: 'scheduleType',
                        value: 'rotating',
                        checked: scheduleType === 'rotating',
                        onChange: (e) => setScheduleType(e.target.value)
                    }),
                    h('span', null, 'Roulerend schema'),
                    h('small', { className: 'text-muted' }, 'Afwisselend Week A en Week B')
                )
            )
        ),

        // Week selector for rotating schedules
        scheduleType === 'rotating' && h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 'Week Selectie'),
            h('div', { className: 'week-selector' },
                h('button', {
                    className: `btn ${activeWeek === 'A' ? 'btn-primary' : 'btn-secondary'}`,
                    onClick: () => setActiveWeek('A')
                }, 'Week A'),
                h('button', {
                    className: `btn ${activeWeek === 'B' ? 'btn-primary' : 'btn-secondary'}`,
                    onClick: () => setActiveWeek('B')
                }, 'Week B')
            )
        ),

        // Bulk Operations Card
        h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 'Snelle Acties'),
            h('div', { className: 'bulk-operations' },
                h('div', { className: 'bulk-time-setter' },
                    h('label', { className: 'form-label' }, 'Alle dagen instellen:'),
                    h('div', { className: 'bulk-time-inputs' },
                        h('input', {
                            type: 'time',
                            className: 'form-input',
                            value: bulkTimes.start,
                            onChange: (e) => setBulkTimes(prev => ({ ...prev, start: e.target.value }))
                        }),
                        h('span', { className: 'time-separator' }, 'tot'),
                        h('input', {
                            type: 'time',
                            className: 'form-input',
                            value: bulkTimes.end,
                            onChange: (e) => setBulkTimes(prev => ({ ...prev, end: e.target.value }))
                        }),
                        h('button', {
                            className: 'btn btn-secondary',
                            onClick: handleBulkTimeSet
                        }, 'Toepassen')
                    )
                )
            )
        ),

        // Detailed Schedule Card
        h('div', { className: 'card' },
            h('div', { className: 'card-header-with-actions' },
                h('h3', { className: 'card-title' }, 
                    scheduleType === 'rotating' ? `Werkschema - Week ${activeWeek}` : 'Werkschema'
                )
            ),
            
            h('div', { className: 'schedule-table-container' },
                h('table', { className: 'schedule-table' },
                    h('thead', null,
                        h('tr', null,
                            h('th', null, 'Dag'),
                            h('th', null, 'Starttijd'),
                            h('th', null, 'Eindtijd'),
                            h('th', null, 'Uren'),
                            h('th', null, 'Type'),
                            h('th', null, 'Vrije dag')
                        )
                    ),
                    h('tbody', null,
                        ...days.map(day => {
                            const currentHours = scheduleType === 'rotating' && activeWeek === 'B' ? workHoursB : workHours;
                            const dayData = currentHours[day.key];
                            
                            return h('tr', { key: day.key, className: dayData.isFreeDag ? 'free-day-row' : '' },
                                h('td', { className: 'day-cell' },
                                    h('strong', null, day.label)
                                ),
                                h('td', null,
                                    h('input', {
                                        type: 'time',
                                        className: 'form-input time-input',
                                        value: dayData.start,
                                        onChange: (e) => handleTimeChange(day.key, 'start', e.target.value),
                                        disabled: dayData.isFreeDag
                                    })
                                ),
                                h('td', null,
                                    h('input', {
                                        type: 'time',
                                        className: 'form-input time-input',
                                        value: dayData.end,
                                        onChange: (e) => handleTimeChange(day.key, 'end', e.target.value),
                                        disabled: dayData.isFreeDag
                                    })
                                ),
                                h('td', { className: 'hours-cell' },
                                    h('span', { className: 'hours-badge' }, `${dayData.hours}h`)
                                ),
                                h('td', null,
                                    h('span', { 
                                        className: 'day-type-badge',
                                        style: getDayTypeStyle(dayData.type)
                                    }, dayData.type)
                                ),
                                h('td', null,
                                    h('input', {
                                        type: 'checkbox',
                                        checked: dayData.isFreeDag,
                                        onChange: (e) => handleTimeChange(day.key, 'isFreeDag', e.target.checked),
                                        className: 'setting-checkbox'
                                    })
                                )
                            );
                        })
                    )
                )
            )
        ),

        // Save Button
        h('div', { className: 'save-section' },
            feedback && h('div', { 
                className: `feedback-message ${feedback.type}` 
            }, feedback.message),
            h('button', {
                className: 'btn btn-primary save-btn',
                onClick: handleSave,
                disabled: isLoading
            }, 
                isLoading ? 'Opslaan...' : 'Werktijden Opslaan'
            )
        ),

        // Weekly Summary Card (moved to bottom)
        h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 'Weekoverzicht'),
            h('div', { className: 'work-hours-overview' },
                h('div', { className: 'hours-summary' },
                    h('div', { className: 'summary-item' },
                        h('span', { className: 'summary-label' }, 
                            scheduleType === 'rotating' ? `Week ${activeWeek} totaal:` : 'Totaal per week:'
                        ),
                        h('span', { className: 'summary-value' }, `${getCurrentWeekHours()} uur`)
                    ),
                    h('div', { className: 'summary-item' },
                        h('span', { className: 'summary-label' }, 'Gemiddeld per dag:'),
                        h('span', { className: 'summary-value' }, `${(getCurrentWeekHours() / 5).toFixed(1)} uur`)
                    )
                )
            )
        )
    );
};
