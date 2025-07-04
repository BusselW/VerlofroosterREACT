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
import {
    DAY_TYPES,
    DAY_TYPE_LABELS,
    DEFAULT_DAY_TYPE_COLORS,
    determineWorkDayType,
    getWorkDayTypeDisplay,
    calculateHoursWorked,
    getDayTypeStyle,
    validateTimeRange,
    generateWorkScheduleData,
    DEFAULT_WORK_HOURS,
    WORK_DAYS
} from './DagIndicators.js';

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
    const [workHours, setWorkHours] = useState(DEFAULT_WORK_HOURS);
    const [workHoursB, setWorkHoursB] = useState({
        monday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
        tuesday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
        wednesday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
        thursday: { start: '10:00', end: '18:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
        friday: { start: '--:--', end: '--:--', hours: 0, type: DAY_TYPES.VVD, isFreeDag: true }
    });
    const [bulkTimes, setBulkTimes] = useState({ start: '09:00', end: '17:00' });
    const [ingangsdatum, setIngangsdatum] = useState(new Date().toISOString().split('T')[0]);
    const [cycleStartDate, setCycleStartDate] = useState(new Date().toISOString().split('T')[0]);

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
            if (scheduleType === 'rotating') {
                // ROTATING SCHEDULE: Save 2 records (Week A and Week B)
                console.log('Saving rotating schedule - creating 2 records');
                
                // Prepare Week A data
                const weekAData = generateWorkScheduleData(workHours, {
                    weekType: 'A',
                    isRotating: true,
                    userId: userInfo?.LoginName,
                    ingangsdatum,
                    cycleStartDate
                });
                
                // Prepare Week B data  
                const weekBData = generateWorkScheduleData(workHoursB, {
                    weekType: 'B',
                    isRotating: true,
                    userId: userInfo?.LoginName,
                    ingangsdatum,
                    cycleStartDate
                });
                
                console.log('Week A data:', weekAData);
                console.log('Week B data:', weekBData);
                
                // Save both weeks simultaneously
                const [weekAResult, weekBResult] = await Promise.all([
                    createSharePointListItem('UrenPerWeek', weekAData),
                    createSharePointListItem('UrenPerWeek', weekBData)
                ]);
                
                console.log('Week A saved with ID:', weekAResult?.ID || weekAResult?.Id);
                console.log('Week B saved with ID:', weekBResult?.ID || weekBResult?.Id);
                
                setFeedback({ type: 'success', message: 'Roterend werkrooster (Week A & B) succesvol opgeslagen!' });
            } else {
                // FIXED SCHEDULE: Save 1 record with WeekType=null and CycleStartDate=null
                console.log('Saving fixed schedule - creating 1 record');
                
                const scheduleData = generateWorkScheduleData(workHours, {
                    weekType: null,           // WeekType = null for fixed schedules
                    isRotating: false,        // IsRotatingSchedule = false
                    userId: userInfo?.LoginName,
                    ingangsdatum,
                    cycleStartDate: null      // CycleStartDate = null for fixed schedules
                });
                
                console.log('Fixed schedule data:', scheduleData);
                
                const result = await createSharePointListItem('UrenPerWeek', scheduleData);
                
                console.log('Fixed schedule saved with ID:', result?.ID || result?.Id);
                
                setFeedback({ type: 'success', message: 'Werkrooster succesvol opgeslagen!' });
            }
        } catch (error) {
            console.error('Error saving work hours:', error);
            setFeedback({ type: 'error', message: `Fout bij opslaan van werktijden: ${error.message}` });
        } finally {
            setIsLoading(false);
            // Clear feedback after 5 seconds
            setTimeout(() => setFeedback(null), 5000);
        }
    };

    const days = WORK_DAYS;

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
            
            // Recalculate hours and type if start or end time changed
            if (field === 'start' || field === 'end') {
                const newStart = field === 'start' ? value : updated[day].start;
                const newEnd = field === 'end' ? value : updated[day].end;
                
                // Calculate hours
                updated[day].hours = calculateHoursWorked(newStart, newEnd);
                
                // Determine day type using the new logic
                updated[day].type = determineWorkDayType(newStart, newEnd, updated[day].isFreeDag);
            } else if (field === 'isFreeDag') {
                // Update day type when free day status changes
                updated[day].type = determineWorkDayType(
                    updated[day].start, 
                    updated[day].end, 
                    value
                );
                
                // If marking as free day, clear the times and set hours to 0
                if (value) {
                    updated[day].start = '--:--';
                    updated[day].end = '--:--';
                    updated[day].hours = 0;
                } else if (updated[day].start === '--:--' || updated[day].end === '--:--') {
                    // If unmarking free day but times are still --:--, set default times
                    updated[day].start = '09:00';
                    updated[day].end = '17:00';
                    updated[day].hours = calculateHoursWorked('09:00', '17:00');
                    updated[day].type = determineWorkDayType('09:00', '17:00', false);
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
                    updated[day.key].hours = calculateHoursWorked(bulkTimes.start, bulkTimes.end);
                    updated[day.key].type = determineWorkDayType(bulkTimes.start, bulkTimes.end, false);
                }
            });
            return updated;
        });
    };

    return h('div', null,
        // Schedule Type Selection Card (now includes the main header)
        h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 
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
            h('p', { className: 'text-muted mb-3' }, 'Beheer uw standaard werktijden en werkschema.'),
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
            ),
            
            // Date inputs
            h('div', { className: 'form-row', style: { marginTop: '1.5rem' } },
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Ingangsdatum'),
                    h('input', {
                        type: 'date',
                        className: 'form-input',
                        value: ingangsdatum,
                        onChange: (e) => setIngangsdatum(e.target.value)
                    })
                ),
                scheduleType === 'rotating' && h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Cyclus startdatum'),
                    h('input', {
                        type: 'date',
                        className: 'form-input',
                        value: cycleStartDate,
                        onChange: (e) => setCycleStartDate(e.target.value)
                    }),
                    h('small', { className: 'text-muted' }, 'Wanneer Week A begint in de 2-weken cyclus')
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

        // Detailed Schedule Card (now includes bulk operations)
        h('div', { className: 'card' },
            h('div', { className: 'card-header-with-actions' },
                h('h3', { className: 'card-title' }, 
                    scheduleType === 'rotating' ? `Werkschema - Week ${activeWeek}` : 'Werkschema'
                ),
                // Integrated bulk time setter
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
                                        style: getDayTypeStyle(dayData.type),
                                        title: getWorkDayTypeDisplay(dayData.type)
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
                disabled: isLoading || !userInfo
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
                ),
                
                scheduleType === 'rotating' && h('div', { className: 'info-grid', style: { marginTop: '1rem' } },
                    h('div', { className: 'info-item' },
                        h('span', { className: 'info-label' }, 'Cyclus start:'),
                        h('span', { className: 'info-value' }, new Date(cycleStartDate).toLocaleDateString('nl-NL'))
                    ),
                    h('div', { className: 'info-item' },
                        h('span', { className: 'info-label' }, 'Ingangsdatum:'),
                        h('span', { className: 'info-value' }, new Date(ingangsdatum).toLocaleDateString('nl-NL'))
                    )
                )
            )
        )
    );
};
