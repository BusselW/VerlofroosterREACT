/**
 * @file DagIndicators.js
 * @description Day Type Calculation Logic for Work Hours
 * This module handles the determination of day types (VVO, VVM, VVD, Normaal, Flexibele start tijd)
 * based on start/end times and free day status.
 */

// Day type constants
export const DAY_TYPES = {
    VVD: 'VVD',                    // Vaste Vrije Dag (Full Free Day)
    VVO: 'VVO',                    // Vrije Voormiddag (Free Morning)
    VVM: 'VVM',                    // Vrije Namiddag (Free Afternoon)  
    NORMAAL: 'Normaal',            // Normal working day
    FLEXIBEL: 'Flexibele start tijd' // Flexible start time
};

// Day type display labels
export const DAY_TYPE_LABELS = {
    [DAY_TYPES.VVD]: 'Vaste vrije dag',
    [DAY_TYPES.VVO]: 'Vrije ochtend', 
    [DAY_TYPES.VVM]: 'Vrije middag',
    [DAY_TYPES.FLEXIBEL]: 'Flexibele start tijd',
    [DAY_TYPES.NORMAAL]: 'Normale werkdag'
};

// Default day type colors (can be overridden by SharePoint DagenIndicators)
export const DEFAULT_DAY_TYPE_COLORS = {
    [DAY_TYPES.VVD]: '#e74c3c',      // Red
    [DAY_TYPES.VVO]: '#f39c12',      // Orange  
    [DAY_TYPES.VVM]: '#f39c12',      // Orange
    [DAY_TYPES.FLEXIBEL]: '#9b59b6', // Purple
    [DAY_TYPES.NORMAAL]: '#27ae60'   // Green
};

/**
 * Determines the work day type based on start time, end time, and free day status
 * This follows the same logic as implemented in gInstellingen.aspx
 * 
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format  
 * @param {boolean} isVrijeDag - Whether the day is explicitly marked as free
 * @returns {string} Day type (VVD, VVO, VVM, Normaal, or Flexibele start tijd)
 */
export function determineWorkDayType(startTime, endTime, isVrijeDag = false) {
    console.log(`Determining work day type for: ${startTime} - ${endTime}, isVrijeDag: ${isVrijeDag}`);
    
    // Step 1: Check for explicitly marked free day
    if (isVrijeDag) {
        console.log('Explicitly marked as free day, returning VVD');
        return DAY_TYPES.VVD;
    }
    
    // Step 2: Check for flexible working hours (--:-- format or empty)
    if (!startTime || !endTime || startTime === '--:--' || endTime === '--:--') {
        console.log('Flexible hours detected (--:-- format or empty), returning Flexibele start tijd');
        return DAY_TYPES.FLEXIBEL;
    }
    
    // Step 3: Parse and validate time inputs
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.log('Invalid time format, returning Flexibele start tijd');
        return DAY_TYPES.FLEXIBEL;
    }
    
    console.log(`Parsed times: start=${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')}, end=${end.getHours()}:${String(end.getMinutes()).padStart(2, '0')}`);
    
    // Step 4: Check for no work (VVD) - start and end times are the same
    if (startTime === endTime) {
        console.log('Start and end times are the same, returning VVD');
        return DAY_TYPES.VVD;
    }
    
    // Convert to minutes for easier comparison
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    
    // Step 5: Define time periods
    const morningStart = 6 * 60;   // 06:00 - Morning period start
    const morningEnd = 13 * 60;    // 13:00 - Morning period end
    const afternoonStart = 12 * 60; // 12:00 - Afternoon period start
    
    // Step 6: Check if working during morning period (06:00-13:00)
    // Work overlaps with morning if it starts before 13:00 AND ends after 06:00
    const worksInMorning = startMinutes < morningEnd && endMinutes > morningStart;
    
    // Step 7: Check if working during afternoon period (12:00+)
    // Work extends into afternoon if it ends after 12:00
    const worksInAfternoon = endMinutes > afternoonStart;
    
    console.log(`Works in morning (06:00-13:00): ${worksInMorning}`);
    console.log(`Works in afternoon (12:00+): ${worksInAfternoon}`);
    
    // Step 8: Apply the logic
    if (!worksInMorning && !worksInAfternoon) {
        // This case should be rare since step 4 catches same start/end times
        console.log('Not working in either period, returning VVD');
        return DAY_TYPES.VVD;
    } else if (!worksInMorning && worksInAfternoon) {
        // Special edge case: if start time is exactly 12:00, it's borderline
        if (startMinutes === afternoonStart) {
            console.log('Start time is exactly 12:00 (edge case), returning VVO');
            return DAY_TYPES.VVO;
        }
        console.log('Not working morning period but working afternoon, returning VVO');
        return DAY_TYPES.VVO;
    } else if (worksInMorning && !worksInAfternoon) {
        console.log('Working morning period but not afternoon, returning VVM');
        return DAY_TYPES.VVM;
    } else {
        console.log('Working both morning and afternoon periods, returning Normaal');
        return DAY_TYPES.NORMAAL;
    }
}

/**
 * Gets display label for a work day type
 * @param {string} type - Day type (VVD, VVO, VVM, etc.)
 * @returns {string} Human-readable label
 */
export function getWorkDayTypeDisplay(type) {
    return DAY_TYPE_LABELS[type] || type || '-';
}

/**
 * Calculates hours worked between start and end time
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {number} Hours worked (rounded to 1 decimal place)
 */
export function calculateHoursWorked(startTime, endTime) {
    if (!startTime || !endTime || startTime === '--:--' || endTime === '--:--') {
        return 0;
    }
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0;
    }
    
    if (end <= start) {
        return 0;
    }
    
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Format to 1 decimal place if needed
    return diffHours % 1 === 0 ? diffHours : Number(diffHours.toFixed(1));
}

/**
 * Gets style object for day type badge
 * @param {string} type - Day type
 * @param {object} customColors - Custom color mapping from SharePoint
 * @returns {object} Style object with backgroundColor, color, etc.
 */
export function getDayTypeStyle(type, customColors = {}) {
    const colors = { ...DEFAULT_DAY_TYPE_COLORS, ...customColors };
    const backgroundColor = colors[type] || '#e0e0e0';
    
    return {
        backgroundColor,
        color: 'white',
        padding: '0.25rem 0.5rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '500',
        textTransform: 'uppercase'
    };
}

/**
 * Validates time format (HH:MM)
 * @param {string} time - Time string to validate
 * @returns {boolean} True if valid format
 */
export function isValidTimeFormat(time) {
    if (!time || time === '--:--') return true; // Allow empty/flexible
    
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
}

/**
 * Validates that end time is after start time
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {boolean} True if end time is after start time
 */
export function validateTimeRange(startTime, endTime) {
    if (!startTime || !endTime || startTime === '--:--' || endTime === '--:--') {
        return true; // Allow flexible times
    }
    
    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
        return false;
    }
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    return end > start;
}

/**
 * Generates work schedule data structure for SharePoint submission
 * This follows the structure expected by the UrenPerWeek list
 * 
 * @param {object} workHours - Work hours data (monday, tuesday, etc.)
 * @param {object} options - Additional options
 * @param {string} options.weekType - 'A' or 'B' for rotating schedules, null for fixed
 * @param {boolean} options.isRotating - Whether this is a rotating schedule
 * @param {string} options.userId - User's LoginName
 * @param {string} options.ingangsdatum - Start date (ISO string)
 * @param {string} options.cycleStartDate - Cycle start date for rotating schedules
 * @returns {object} SharePoint-ready data structure
 */
export function generateWorkScheduleData(workHours, options = {}) {
    const {
        weekType = null,
        isRotating = false,
        userId,
        ingangsdatum,
        cycleStartDate
    } = options;
    
    const dayMap = {
        monday: 'Maandag',
        tuesday: 'Dinsdag', 
        wednesday: 'Woensdag',
        thursday: 'Donderdag',
        friday: 'Vrijdag'
    };
    
    const scheduleData = {
        MedewerkerID: userId,
        WeekType: isRotating ? weekType : null, // Only set WeekType if rotating
        IsRotatingSchedule: isRotating,
        Ingangsdatum: ingangsdatum,
        CycleStartDate: isRotating ? cycleStartDate : null, // Only set CycleStartDate if rotating
        VeranderingsDatum: new Date().toISOString() // Track when this was created/updated
    };
    
    // Add day-specific data
    Object.entries(dayMap).forEach(([englishDay, dutchDay]) => {
        const dayData = workHours[englishDay];
        if (dayData) {
            const dayType = determineWorkDayType(dayData.start, dayData.end, dayData.isFreeDag);
            const hoursWorked = calculateHoursWorked(dayData.start, dayData.end);
            
            scheduleData[`${dutchDay}Start`] = dayData.start || '';
            scheduleData[`${dutchDay}Eind`] = dayData.end || '';
            scheduleData[`${dutchDay}Soort`] = dayType;
            scheduleData[`${dutchDay}Totaal`] = hoursWorked.toString();
            scheduleData[`${dutchDay}VrijeDag`] = dayData.isFreeDag || false;
        }
    });
    
    return scheduleData;
}

/**
 * Default day configuration for new schedules
 */
export const DEFAULT_WORK_HOURS = {
    monday: { start: '09:00', end: '17:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
    tuesday: { start: '09:00', end: '17:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
    wednesday: { start: '09:00', end: '17:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
    thursday: { start: '09:00', end: '17:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false },
    friday: { start: '09:00', end: '17:00', hours: 8, type: DAY_TYPES.NORMAAL, isFreeDag: false }
};

/**
 * Days of the week configuration
 */
export const WORK_DAYS = [
    { key: 'monday', label: 'Maandag', short: 'Ma' },
    { key: 'tuesday', label: 'Dinsdag', short: 'Di' },
    { key: 'wednesday', label: 'Woensdag', short: 'Wo' },
    { key: 'thursday', label: 'Donderdag', short: 'Do' },
    { key: 'friday', label: 'Vrijdag', short: 'Vr' }
];
