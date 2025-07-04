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

// Helper function to trim SharePoint login name prefix (i:0;w:org\busselw -> org\busselw)
const trimLoginNaamPrefix = (loginNaam) => {
    if (!loginNaam || typeof loginNaam !== 'string') return loginNaam;
    
    // Handle SharePoint format: i:0#.w|domain\username or i:0;w:domain\username
    if (loginNaam.includes('|')) {
        const parts = loginNaam.split('|');
        return parts.length > 1 ? parts[parts.length - 1] : loginNaam;
    }
    
    // Handle colon format: i:0;w:domain\username
    if (loginNaam.includes(':')) {
        const colonParts = loginNaam.split(':');
        const lastPart = colonParts[colonParts.length - 1];
        return lastPart;
    }
    
    // Fallback: just return as-is if no special format detected
    return loginNaam;
};

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
            // Trim the login name prefix to get just "org\busselw" instead of "i:0;w:org\busselw"
            if (user && user.LoginName) {
                user.LoginName = trimLoginNaamPrefix(user.LoginName);
            }
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
                console.log('Saving rotating schedule - creating 2 records with proper WeekType');
                
                // Week A data
                const weekAData = generateWorkScheduleData(workHours, {
                    weekType: 'A',
                    isRotating: true,
                    userId: userInfo?.LoginName,
                    ingangsdatum,
                    cycleStartDate
                });
                
                // Week B data  
                const weekBData = generateWorkScheduleData(workHoursB, {
                    weekType: 'B',
                    isRotating: true,
                    userId: userInfo?.LoginName,
                    ingangsdatum,
                    cycleStartDate
                });
                
                // Add descriptive titles to distinguish between weeks
                weekAData.Title = `${userInfo?.Title || userInfo?.LoginName} - Week A (${new Date(ingangsdatum).toLocaleDateString('nl-NL')})`;
                weekBData.Title = `${userInfo?.Title || userInfo?.LoginName} - Week B (${new Date(ingangsdatum).toLocaleDateString('nl-NL')})`;
                
                console.log('Week A data:', weekAData);
                console.log('Week B data:', weekBData);
                
                // Save both weeks
                const [weekAResult, weekBResult] = await Promise.all([
                    createSharePointListItem('UrenPerWeek', weekAData),
                    createSharePointListItem('UrenPerWeek', weekBData)
                ]);
                
                console.log('Week A saved with ID:', weekAResult?.ID || weekAResult?.Id);
                console.log('Week B saved with ID:', weekBResult?.ID || weekBResult?.Id);
                
                setFeedback({ type: 'success', message: 'Roterend werkrooster (Week A & B) succesvol opgeslagen!' });
            } else {
                // FIXED SCHEDULE: Save 1 record
                console.log('Saving fixed schedule - creating 1 record');
                
                const scheduleData = generateWorkScheduleData(workHours, {
                    weekType: null,           // WeekType = null for fixed schedules
                    isRotating: false,        // IsRotatingSchedule = false
                    userId: userInfo?.LoginName,
                    ingangsdatum,
                    cycleStartDate: null      // CycleStartDate = null for fixed schedules
                });
                
                // Add a descriptive title
                scheduleData.Title = `${userInfo?.Title || userInfo?.LoginName} - Vast Schema (${new Date(ingangsdatum).toLocaleDateString('nl-NL')})`;
                
                console.log('Fixed schedule data:', scheduleData);
                
                const result = await createSharePointListItem('UrenPerWeek', scheduleData);
                
                console.log('Fixed schedule saved with ID:', result?.ID || result?.Id);
                
                setFeedback({ type: 'success', message: 'Werkrooster succesvol opgeslagen!' });
            }
        } catch (error) {
            console.error('Error saving work hours:', error);
            setFeedback({ 
                type: 'error', 
                message: `Fout bij opslaan van werktijden: ${error.message || 'Onbekende fout'}` 
            });
        } finally {
            setIsLoading(false);
            // Clear feedback after 8 seconds (longer for rotation message)
            setTimeout(() => setFeedback(null), 8000);
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
                'Mijn Werkroosters'
            ),
            h('p', { className: 'text-muted mb-3' }, 
                'Stel hier uw standaard werktijden in. Dit bepaalt hoe uw werkdagen in het rooster worden weergegeven.'
            ),
            h('div', { className: 'info-box', style: { 
                background: '#f8f9fa', 
                border: '1px solid #e9ecef', 
                borderRadius: '6px', 
                padding: '15px', 
                marginBottom: '20px' 
            } },
                h('h4', { style: { margin: '0 0 10px 0', color: '#495057', fontSize: '14px' } }, 
                    '💡 Hoe werkt dit?'
                ),
                h('ul', { style: { margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#6c757d' } },
                    h('li', null, 'Kies tussen een vast werkschema (elke week hetzelfde) of een roulerend schema (Week A en Week B wisselen af)'),
                    h('li', null, 'Stel voor elke werkdag uw begin- en eindtijden in'),
                    h('li', null, 'Markeer vrije dagen of dagen met speciale werktijden (zoals thuiswerken)'),
                    h('li', null, 'Het systeem berekent automatisch uw totaal aantal uren per week')
                )
            ),
            h('div', { className: 'day-types-info', style: { 
                background: '#e8f4fd', 
                border: '1px solid #bee5eb', 
                borderRadius: '6px', 
                padding: '15px', 
                marginBottom: '20px' 
            } },
                h('h4', { style: { margin: '0 0 10px 0', color: '#0c5460', fontSize: '14px' } }, 
                    '🏷️ Werkdag types die automatisch worden bepaald:'
                ),
                h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px', fontSize: '12px' } },
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        h('span', { 
                            style: { 
                                background: '#27ae60', 
                                color: 'white', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '10px',
                                fontWeight: 'bold'
                            } 
                        }, 'Normaal'),
                        h('span', { style: { color: '#495057' } }, 'Volledige werkdag op kantoor')
                    ),
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        h('span', { 
                            style: { 
                                background: '#f39c12', 
                                color: 'white', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '10px',
                                fontWeight: 'bold'
                            } 
                        }, 'VVM'),
                        h('span', { style: { color: '#495057' } }, 'Vrije voormiddag (werk \'s middags)')
                    ),
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        h('span', { 
                            style: { 
                                background: '#e74c3c', 
                                color: 'white', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '10px',
                                fontWeight: 'bold'
                            } 
                        }, 'VVD'),
                        h('span', { style: { color: '#495057' } }, 'Vrije volledige dag (niet werken)')
                    ),
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        h('span', { 
                            style: { 
                                background: '#9b59b6', 
                                color: 'white', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '10px',
                                fontWeight: 'bold'
                            } 
                        }, 'Flexibel'),
                        h('span', { style: { color: '#495057' } }, 'Flexibele start tijd (bijv. thuiswerken)')
                    )
                ),
                h('p', { style: { margin: '10px 0 0 0', fontSize: '11px', color: '#6c757d', fontStyle: 'italic' } },
                    'Het type wordt automatisch bepaald op basis van uw tijden en of u de dag als vrij markeert.'
                )
            ),
            h('div', { className: 'schedule-type-selector' },
                h('label', { className: 'radio-option' },
                    h('input', {
                        type: 'radio',
                        name: 'scheduleType',
                        value: 'fixed',
                        checked: scheduleType === 'fixed',
                        onChange: (e) => setScheduleType(e.target.value)
                    }),
                    h('span', null, 'Vast werkschema'),
                    h('small', { className: 'text-muted' }, 'Dit gebruik je als iedere werkweek dezelfde uren zijn')
                ),
                h('label', { className: 'radio-option' },
                    h('input', {
                        type: 'radio',
                        name: 'scheduleType',
                        value: 'rotating',
                        checked: scheduleType === 'rotating',
                        onChange: (e) => setScheduleType(e.target.value)
                    }),
                    h('span', null, 'Roulerend werkschema'),
                    h('small', { className: 'text-muted' }, 'Voor mensen die Week A en Week B afwisselen')
                )
            ),

            // Additional explanation for rotating schedule
            scheduleType === 'rotating' && h('div', { 
                className: 'rotating-explanation',
                style: { 
                    background: '#fff3cd', 
                    border: '1px solid #ffeaa7', 
                    borderRadius: '8px', 
                    padding: '20px', 
                    margin: '15px 0'
                } 
            },
                h('h4', { 
                    style: { 
                        margin: '0 0 15px 0', 
                        color: '#856404', 
                        fontSize: '16px',
                        fontWeight: '600'
                    } 
                }, 'Hoe werkt een roulerend werkschema?'),
                h('div', { 
                    style: { 
                        color: '#856404', 
                        fontSize: '14px',
                        lineHeight: '1.5'
                    } 
                },
                    h('p', { style: { margin: '0 0 10px 0' } }, 
                        'Bij een roulerend schema werk je niet elke week hetzelfde. In plaats daarvan wissel je tussen twee verschillende schema\'s:'
                    ),
                    h('ul', { style: { margin: '0 0 15px 0', paddingLeft: '20px' } },
                        h('li', { style: { marginBottom: '5px' } }, 'Week A: bijvoorbeeld maandag t/m donderdag werken, vrijdag vrij'),
                        h('li', { style: { marginBottom: '5px' } }, 'Week B: bijvoorbeeld maandag vrij, dinsdag t/m vrijdag werken'),
                        h('li', { style: { marginBottom: '5px' } }, 'Deze weken wisselen elkaar af: A-B-A-B-A-B...')
                    ),
                    h('p', { style: { margin: '0', fontWeight: '500' } }, 
                        'Het systeem berekent automatisch welke week van toepassing is op basis van de startdatum die u instelt.'
                    )
                )
            ),

            // Playground button for testing A/B week schedules
            scheduleType === 'rotating' && h('div', { 
                className: 'playground-button-container',
                style: { 
                    background: '#fff3cd', 
                    border: '1px solid #ffeaa7', 
                    borderRadius: '8px', 
                    padding: '15px', 
                    margin: '15px 0',
                    textAlign: 'center'
                } 
            },
                h('h4', { 
                    style: { 
                        margin: '0 0 10px 0', 
                        color: '#856404', 
                        fontSize: '16px',
                        fontWeight: '600'
                    } 
                }, 'Niet zeker welke cyclus u moet invullen?'),
                h('p', { 
                    style: { 
                        margin: '0 0 15px 0', 
                        color: '#856404', 
                        fontSize: '14px',
                        lineHeight: '1.4'
                    } 
                }, 'Test eerst uw A/B week rooster in onze handige tester voordat u het hier instelt. Zo ziet u precies hoe uw cyclus er uit komt te zien!'),
                h('button', {
                    type: 'button',
                    className: 'btn btn-warning',
                    style: {
                        background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                    },
                    onClick: () => {
                        // Open playground in new tab
                        const baseUrl = window.location.origin;
                        const currentPath = window.location.pathname;
                        // Navigate to the playground in the same directory structure
                        const playgroundUrl = baseUrl + '/Rooster/pages/instellingenCentrum/testen/playground.aspx';
                        window.open(playgroundUrl, '_blank');
                    },
                    onMouseOver: (e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    },
                    onMouseOut: (e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }
                }, 'Test mijn A/B week rooster eerst')
            ),
            
            // Date inputs
            h('div', { className: 'form-row', style: { marginTop: '1.5rem' } },
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 
                        'Vanaf welke datum gelden deze werktijden?'
                    ),
                    h('input', {
                        type: 'date',
                        className: 'form-input',
                        value: ingangsdatum,
                        onChange: (e) => setIngangsdatum(e.target.value)
                    }),
                    h('small', { className: 'text-muted' }, 
                        'Selecteer de datum vanaf wanneer dit werkschema van kracht wordt. Meestal is dit vandaag of de eerstvolgende maandag.'
                    )
                ),
                scheduleType === 'rotating' && h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 
                        'Op welke datum begint Week A van uw cyclus?'
                    ),
                    h('input', {
                        type: 'date',
                        className: 'form-input',
                        value: cycleStartDate,
                        onChange: (e) => setCycleStartDate(e.target.value)
                    }),
                    h('small', { className: 'text-muted' }, 
                        'Dit bepaalt welke week "Week A" is en welke "Week B". Kies bijvoorbeeld de maandag van een week die Week A moet worden. Het systeem wisselt daarna automatisch elke week tussen A en B.'
                    )
                )
            )
        ),

        // Week selector for rotating schedules
        scheduleType === 'rotating' && h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 
                'Welke week wilt u instellen?'
            ),
            h('p', { className: 'text-muted mb-3' }, 
                'U kunt verschillende werktijden instellen voor Week A en Week B. Klik hieronder op de week die u wilt bewerken.'
            ),
            h('div', { className: 'week-selector' },
                h('button', {
                    className: `btn ${activeWeek === 'A' ? 'btn-primary' : 'btn-secondary'}`,
                    onClick: () => setActiveWeek('A')
                }, 
                    h('span', null, '📋 Week A'),
                    activeWeek === 'A' && h('small', { style: { display: 'block', fontSize: '11px' } }, '(nu aan het bewerken)')
                ),
                h('button', {
                    className: `btn ${activeWeek === 'B' ? 'btn-primary' : 'btn-secondary'}`,
                    onClick: () => setActiveWeek('B')
                }, 
                    h('span', null, '📋 Week B'),
                    activeWeek === 'B' && h('small', { style: { display: 'block', fontSize: '11px' } }, '(nu aan het bewerken)')
                )
            )
        ),

        // Detailed Schedule Card (now includes bulk operations)
        h('div', { className: 'card' },
            h('div', { className: 'card-header-with-actions' },
                h('h3', { className: 'card-title' }, 
                    scheduleType === 'rotating' ? 
                        `⏰ Werktijden voor Week ${activeWeek}` : 
                        '⏰ Mijn Werktijden'
                ),
                // Integrated bulk time setter
                h('div', { className: 'bulk-time-setter' },
                    h('label', { className: 'form-label' }, 
                        '⚡ Snelle instelling voor alle werkdagen:'
                    ),
                    h('div', { className: 'bulk-time-inputs' },
                        h('input', {
                            type: 'time',
                            className: 'form-input',
                            value: bulkTimes.start,
                            onChange: (e) => setBulkTimes(prev => ({ ...prev, start: e.target.value })),
                            title: 'Starttijd voor alle dagen'
                        }),
                        h('span', { className: 'time-separator' }, 'tot'),
                        h('input', {
                            type: 'time',
                            className: 'form-input',
                            value: bulkTimes.end,
                            onChange: (e) => setBulkTimes(prev => ({ ...prev, end: e.target.value })),
                            title: 'Eindtijd voor alle dagen'
                        }),
                        h('button', {
                            className: 'btn btn-secondary',
                            onClick: handleBulkTimeSet,
                            title: 'Pas deze tijden toe op alle werkdagen (vrije dagen blijven ongewijzigd)'
                        }, '✓ Toepassen op alle dagen')
                    ),
                    h('small', { className: 'text-muted' }, 
                        'Handig als u meestal dezelfde tijden werkt. Vrije dagen worden niet overschreven.'
                    )
                )
            ),
            
            h('div', { className: 'schedule-table-container' },
                h('table', { className: 'schedule-table' },
                    h('thead', null,
                        h('tr', null,
                            h('th', null, 'Weekdag'),
                            h('th', null, '🕘 Begin'),
                            h('th', null, '🕕 Einde'),
                            h('th', null, '⏱️ Totaal'),
                            h('th', null, '🏷️ Werkdag type'),
                            h('th', null, '🏠 Vrij/Thuis')
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
        h('div', { 
            className: 'save-section', 
            style: { 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                marginTop: '20px'
            } 
        },
            feedback && h('div', { 
                className: `feedback-message ${feedback.type}`,
                style: { 
                    alignSelf: 'flex-start',
                    marginBottom: '10px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: feedback.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: feedback.type === 'success' ? '#155724' : '#721c24',
                    border: feedback.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                }
            }, feedback.message),
            h('button', {
                className: 'btn btn-primary save-btn',
                onClick: handleSave,
                disabled: isLoading || !userInfo,
                style: { fontSize: '16px', padding: '12px 24px' }
            }, 
                isLoading ? 'Bezig met opslaan...' : 'Mijn werktijden opslaan'
            ),
            h('p', { 
                className: 'text-muted', 
                style: { 
                    marginTop: '10px', 
                    fontSize: '13px', 
                    alignSelf: 'flex-start',
                    maxWidth: '500px'
                } 
            },
                'Na het opslaan worden uw nieuwe werktijden gebruikt in het rooster. Dit kan even duren voordat het overal zichtbaar is.'
            )
        ),

        // Weekly Summary Card (moved to bottom)
        h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 
                scheduleType === 'rotating' ? 
                    `📊 Overzicht Week ${activeWeek}` : 
                    '📊 Overzicht van uw werkweek'
            ),
            h('div', { className: 'work-hours-overview' },
                h('div', { className: 'hours-summary' },
                    h('div', { className: 'summary-item' },
                        h('span', { className: 'summary-label' }, 
                            scheduleType === 'rotating' ? 
                                `⏱️ Totaal uren Week ${activeWeek}:` : 
                                '⏱️ Totaal uren per week:'
                        ),
                        h('span', { className: 'summary-value' }, `${getCurrentWeekHours()} uur`)
                    ),
                    h('div', { className: 'summary-item' },
                        h('span', { className: 'summary-label' }, '📊 Gemiddeld per werkdag:'),
                        h('span', { className: 'summary-value' }, `${(getCurrentWeekHours() / 5).toFixed(1)} uur`)
                    )
                ),
                
                scheduleType === 'rotating' && h('div', { className: 'info-grid', style: { marginTop: '1rem' } },
                    h('div', { className: 'info-item' },
                        h('span', { className: 'info-label' }, 'Week A start datum:'),
                        h('span', { className: 'info-value' }, new Date(cycleStartDate).toLocaleDateString('nl-NL'))
                    ),
                    h('div', { className: 'info-item' },
                        h('span', { className: 'info-label' }, 'Schema geldig vanaf:'),
                        h('span', { className: 'info-value' }, new Date(ingangsdatum).toLocaleDateString('nl-NL'))
                    )
                ),
                
                scheduleType === 'rotating' && h('div', { 
                    className: 'rotating-info', 
                    style: { 
                        marginTop: '15px', 
                        padding: '12px', 
                        background: '#f8f9fa', 
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#6c757d'
                    } 
                },
                    h('strong', { style: { color: '#495057' } }, '💡 Hoe werkt uw roulerende schema:'),
                    h('ul', { style: { margin: '5px 0 0 0', paddingLeft: '20px' } },
                        h('li', null, 'Week A en Week B wisselen elke week af'),
                        h('li', null, `Week A begint op ${new Date(cycleStartDate).toLocaleDateString('nl-NL')}`),
                        h('li', null, 'Het systeem berekent automatisch welke week van toepassing is'),
                        h('li', null, 'U kunt beide weken hier apart instellen')
                    )
                )
            )
        )
    );
};
