<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UrenPerWeek Debug Viewer</title>
    <!-- Load configuration script -->
    <script src="https://som.org.om.local/sites/MulderT/customPW/Verlof/cpw/Rooster/js/config/configLijst.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
        }
        input, select, button {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        button {
            background-color: #0078d4;
            color: white;
            border: none;
            cursor: pointer;
            font-weight: 600;
        }
        button:hover {
            background-color: #106ebe;
        }
        .results {
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 4px;
            min-height: 100px;
        }
        .error {
            color: #d83b01;
            background-color: #f8d7da;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100px;
            font-style: italic;
            color: #666;
        }
        .back-link {
            margin-top: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>UrenPerWeek Debug Viewer</h1>
        <p>Dit hulpmiddel toont alle UrenPerWeek-records en laat zien hoe ze worden gesorteerd in het systeem.</p>
        
        <div id="statusMessage" class="loading">Gegevens worden geladen...</div>
        
        <div id="errorContainer" class="error" style="display: none;"></div>
        
        <div style="margin-bottom: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="testPreVVDButton" style="background-color: #0078d4; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">
                Test Rauf1 vóór VVD wijziging (3 juli 2025)
            </button>
            <button id="testAfterVVDButton" style="background-color: #0078d4; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">
                Test Rauf1 ná VVD wijziging (15 juli 2025)
            </button>
            <button id="testExactVVDButton" style="background-color: #0078d4; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">
                Test Rauf1 op ingangsdatum (14 juli 2025)
            </button>
            <button id="showAllRecordsButton" style="background-color: #107c10; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">
                Toon ALLE records (inclusief historische records)
            </button>
        </div>
        
        <!-- New Date Range Test Controls -->
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f0f7ff; border-radius: 6px; border: 1px solid #cce5ff;">
            <h3 style="margin-top: 0;">Test Blokken over een Datumbereik</h3>
            <p>Bekijk hoe VVO/VVM/VVD blokken veranderen over tijd voor een gebruiker.</p>
            
            <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; align-items: flex-end;">
                <div>
                    <label for="usernameSelect" style="display: block; margin-bottom: 5px; font-weight: 600;">Gebruiker:</label>
                    <select id="usernameSelect" style="padding: 8px; border-radius: 4px; border: 1px solid #ddd; min-width: 200px;">
                        <option value="">-- Selecteer gebruiker --</option>
                        <!-- Options will be filled dynamically -->
                    </select>
                </div>
                
                <div>
                    <label for="startDateInput" style="display: block; margin-bottom: 5px; font-weight: 600;">Start Datum:</label>
                    <input type="date" id="startDateInput" style="padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                </div>
                
                <div>
                    <label for="endDateInput" style="display: block; margin-bottom: 5px; font-weight: 600;">Eind Datum:</label>
                    <input type="date" id="endDateInput" style="padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                </div>
                
                <div>
                    <button id="testDateRangeButton" style="background-color: #0078d4; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                        Toon Blokken over Datumbereik
                    </button>
                </div>
            </div>
        </div>
        
        <div id="dateRangeResultsContainer" style="margin-bottom: 20px; display: none;">
            <!-- Date range test results will appear here -->
        </div>
        
        <div id="resultsContainer" class="results">
            <!-- Data will be loaded automatisch -->
        </div>
        
        <a href="https://som.org.om.local/sites/MulderT/customPW/Verlof/cpw/Rooster/verlofRooster.aspx" class="back-link">Terug naar Verlofrooster</a>
    </div>

    <script>
        // Initialize the application
        async function init() {
            try {
                // Load data automatically
                await loadAllUrenPerWeekData();
            } catch (error) {
                showError(`Fout bij initialisatie: ${error.message}`);
                console.error('Initialization error:', error);
            }
        }

        // Load all UrenPerWeek data
        async function testRauf1(testDate) {
            const statusMessage = document.getElementById('statusMessage');
            const resultsContainer = document.getElementById('resultsContainer');
            
            try {
                statusMessage.style.display = 'block';
                statusMessage.textContent = `Testen Rauf1 records voor ${testDate.toLocaleDateString()}...`;
                
                // Normalize the target date
                const targetDate = normalizeDate(testDate);
                
                // Fetch all data using the global fetchSharePointList function
                const fetchSharePointList = window.fetchSharePointList || fetchSharePointListFallback;
                
                const [urenPerWeekItems, medewerkerItems] = await Promise.all([
                    fetchSharePointList('UrenPerWeek'),
                    fetchSharePointList('Medewerkers')
                ]);
                
                // Create a map of medewerker IDs to names
                const medewerkerMap = {};
                medewerkerItems.forEach(item => {
                    if (item.Username) {
                        medewerkerMap[item.Username] = item.Title || item.Username;
                    }
                });
                
                // Filter to only show Rauf1's records
                const rauf1Items = urenPerWeekItems.filter(item => 
                    item.MedewerkerID && 
                    (item.MedewerkerID.toLowerCase().includes('rauf') || 
                     item.MedewerkerID.toLowerCase().includes('raufz1'))
                );
                
                if (rauf1Items.length === 0) {
                    resultsContainer.innerHTML = '<p>Geen records gevonden voor Rauf1.</p>';
                    statusMessage.style.display = 'none';
                    return;
                }
                
                // Generate and display debug output for Rauf1 only
                const rauf1Map = {};
                if (rauf1Items.length > 0) {
                    const medewerkerId = rauf1Items[0].MedewerkerID;
                    rauf1Map[medewerkerId] = rauf1Items;
                }
                
                const debugOutput = generateDebugOutput(rauf1Items, medewerkerMap, targetDate, rauf1Map);
                resultsContainer.innerHTML = debugOutput;
                statusMessage.style.display = 'none';
            } catch (error) {
                showError(`Fout bij testen Rauf1: ${error.message}`);
                statusMessage.textContent = 'Fout bij testen Rauf1';
            }
        }
        
        async function loadAllUrenPerWeekData() {
            const statusMessage = document.getElementById('statusMessage');
            const resultsContainer = document.getElementById('resultsContainer');
            
            try {
                statusMessage.textContent = 'Gegevens worden geladen...';
                
                // Use today's date for reference
                const targetDate = new Date();
                // Normalize the target date by resetting time components (important for correct comparison)
                targetDate.setHours(0, 0, 0, 0);
                
                // Fetch all data using the global fetchSharePointList function
                const fetchSharePointList = window.fetchSharePointList || fetchSharePointListFallback;
                
                const [urenPerWeekItems, medewerkerItems] = await Promise.all([
                    fetchSharePointList('UrenPerWeek'),
                    fetchSharePointList('Medewerkers')
                ]);
                
                statusMessage.textContent = `Verwerken van ${urenPerWeekItems.length} records...`;
                
                // Create a map of employee IDs to names
                const medewerkerMap = {};
                medewerkerItems.forEach(m => {
                    if (m.Username) {
                        medewerkerMap[m.Username] = m.Title || m.Username;
                    }
                });
                
                // Generate debug output
                const debugOutput = generateDebugOutput(urenPerWeekItems, medewerkerMap, targetDate);
                
                // Display results
                resultsContainer.innerHTML = debugOutput;
                
                // Hide status message
                statusMessage.style.display = 'none';
                
                // Hide any previous errors
                document.getElementById('errorContainer').style.display = 'none';
            } catch (error) {
                showError(`Fout bij ophalen van gegevens: ${error.message}`);
                console.error('Error fetching data:', error);
                statusMessage.textContent = 'Fout bij laden van gegevens';
            }
        }
        
        // Fallback implementation of fetchSharePointList if the global one is not available
        async function fetchSharePointListFallback(lijstNaam) {
            try {
                if (!window.appConfiguratie || !window.appConfiguratie.instellingen) {
                    throw new Error('App configuratie niet gevonden.');
                }
                const siteUrl = window.appConfiguratie.instellingen.siteUrl;
                const lijstConfig = window.appConfiguratie[lijstNaam];
                if (!lijstConfig) throw new Error(`Configuratie voor lijst '${lijstNaam}' niet gevonden.`);

                const lijstTitel = lijstConfig.lijstTitel;
                const apiUrl = `${siteUrl.replace(/\/$/, "")}/_api/web/lists/getbytitle('${lijstTitel}')/items?$top=5000`;
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json;odata=nometadata' },
                    credentials: 'same-origin'
                });
                if (!response.ok) throw new Error(`Fout bij ophalen van ${lijstNaam}: ${response.statusText}`);
                const data = await response.json();
                return data.value || [];
            } catch (error) {
                console.error(`Fout bij ophalen van lijst ${lijstNaam}:`, error);
                throw error;
            }
        }
        
        // Generate debug output for all records
        function generateDebugOutput(urenPerWeekItems, medewerkerMap, targetDate, preFilteredMap = null) {
            if (!urenPerWeekItems || !Array.isArray(urenPerWeekItems) || urenPerWeekItems.length === 0) {
                return '<p>Geen UrenPerWeek records gevonden.</p>';
            }
            
            // Convert dates and sort by Ingangsdatum (newest first)
            const processedItems = urenPerWeekItems.map(item => {
                try {
                    // Preserve original date strings for debugging
                    const ingangsdatum_original = item.Ingangsdatum;
                    const veranderingsdatum_original = item.Veranderingsdatum;
                    
                    // Process the dates
                    return {
                        ...item,
                        Ingangsdatum_original: ingangsdatum_original,
                        Veranderingsdatum_original: veranderingsdatum_original,
                        Ingangsdatum: parsedIngangsdatum,
                        Veranderingsdatum: parsedVeranderingsdatum
                    };
                } catch (error) {
                    console.error('Error processing item:', error, item);
                    // Return item with original data and null dates on error
                    return {
                        ...item,
                        Ingangsdatum_original: item.Ingangsdatum,
                        Veranderingsdatum_original: item.Veranderingsdatum,
                        Ingangsdatum: null,
                        Veranderingsdatum: null
                    };
                }
            });
            
            processedItems.sort((a, b) => {
                if (!a.Ingangsdatum) return 1;
                if (!b.Ingangsdatum) return -1;
                return b.Ingangsdatum - a.Ingangsdatum;
            });
            
            // Group by MedewerkerID
            const groupedByMedewerker = preFilteredMap || {};
            
            if (!preFilteredMap) {
                processedItems.forEach(item => {
                    const medewerkerId = item.MedewerkerID || 'Onbekend';
                    if (!groupedByMedewerker[medewerkerId]) {
                        groupedByMedewerker[medewerkerId] = [];
                    }
                    groupedByMedewerker[medewerkerId].push(item);
                });
            }
            
            // Generate HTML
            let html = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>UrenPerWeek Records (Gesorteerd op Ingangsdatum, nieuwste eerst)</h2>
                    <p><strong>Geselecteerde datum:</strong> ${targetDate.toLocaleDateString()}</p>
                    <p><strong>Totaal aantal records:</strong> ${processedItems.length}</p>
                    <p><strong>Aantal medewerkers met records:</strong> ${Object.keys(groupedByMedewerker).length}</p>
                    
                    <div style="margin-bottom: 20px;">
                        <h3>Hoe het werkt</h3>
                        <p>Voor elke medewerker worden de UrenPerWeek records gesorteerd op Ingangsdatum (nieuwste eerst). 
                           Voor een bepaalde datum wordt het eerste record gebruikt waarvan de Ingangsdatum kleiner of gelijk is aan die datum.</p>
                    </div>
            `;                // Add debugging information about target date
                html += `
                    <div style="background-color: #ffe6e6; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <h3>Debug Informatie - Target Date</h3>
                        <p><strong>Target Date:</strong> ${targetDate.toLocaleDateString()} ${targetDate.toLocaleTimeString()}</p>
                        <p><strong>Target Date Timestamp:</strong> ${targetDate.getTime()}</p>
                        <p><strong>Weekdag:</strong> ${['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'][targetDate.getDay()]}</p>
                        
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ccc;">
                            <h4>Uitleg VVD Logica</h4>
                            <p>Het systeem werkt als volgt:</p>
                            <ol>
                                <li>Records worden gesorteerd op ingangsdatum (nieuwste eerst)</li>
                                <li>Voor een gegeven datum wordt het eerste record gebruikt waarvan de ingangsdatum <= de gegeven datum</li>
                                <li>Voor Rauf1 geldt dus:
                                    <ul>
                                        <li>Voor data vóór 14-7-2025: Het record met ingangsdatum 3-5-2025 is van toepassing (VVD op dinsdag)</li>
                                        <li>Voor data vanaf 14-7-2025: Het record met ingangsdatum 14-7-2025 is van toepassing (VVD op vrijdag)</li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </div>
                `;
                
                // Add each employee's records
            Object.keys(groupedByMedewerker).sort().forEach(medewerkerId => {
                const items = groupedByMedewerker[medewerkerId];
                const medewerkerNaam = medewerkerMap[medewerkerId] || medewerkerId;
                
                // Find the applicable record for this date
                let applicableRecord = null;
                let debugComparisons = '<div style="background-color: #f8f8f8; padding: 10px; margin-top: 10px; border-radius: 4px;"><h4>Debug Date Comparisons:</h4><ul>';
                
                for (const item of items) {
                    // Ensure proper date conversion
                    if (!item.Ingangsdatum && item.Ingangsdatum_original) {
                        // Try again with direct parsing
                        item.Ingangsdatum = normalizeDate(item.Ingangsdatum_original);
                    }
                    
                    // Ensure we have a valid date object before comparing
                    const validDate = item.Ingangsdatum instanceof Date && !isNaN(item.Ingangsdatum);
                    const comparisonResult = validDate && item.Ingangsdatum <= targetDate;
                    
                    // Safely get timestamp or show an error
                    const dateTimestamp = validDate ? item.Ingangsdatum.getTime() : 'Ongeldige datum';
                    
                    // Get day info
                    const dagInfo = item.VrijdagSoort ? `Vrijdag: ${item.VrijdagSoort}` : 
                                   (item.DinsdagSoort ? `Dinsdag: ${item.DinsdagSoort}` : 'Geen VVD informatie');
                    
                    // Get raw date info for debugging
                    const rawDateInfo = item.Ingangsdatum_original || item.Ingangsdatum_raw || 'Geen ruwe datum beschikbaar';
                    
                    debugComparisons += `
                        <li style="margin-bottom: 12px; ${comparisonResult ? 'font-weight: bold; background-color: #e6ffe6; padding: 8px; border-left: 3px solid green;' : ''}">
                            <div>Record ID: ${item.Id} - ${dagInfo}</div>
                            <div>Ruwe datum: ${rawDateInfo}</div>
                            <div>Ingangsdatum: ${formatDate(item.Ingangsdatum)}</div>
                            <div>Timestamp: ${dateTimestamp}</div>
                            <div>Vergelijking: ${formatDate(item.Ingangsdatum)} <= ${formatDate(targetDate)} = ${comparisonResult ? '<span style="color: green; font-weight: bold;">TRUE</span>' : '<span style="color: red;">FALSE</span>'}</div>
                        </li>
                    `;
                    
                    if (item.Ingangsdatum instanceof Date && !isNaN(item.Ingangsdatum) && item.Ingangsdatum <= targetDate) {
                        applicableRecord = item;
                        break;
                    }
                }
                
                debugComparisons += '</ul></div>';
                
                html += `
                    <div style="border: 1px solid #ddd; border-radius: 6px; margin-bottom: 30px; overflow: hidden;">
                        <div style="background-color: #f0f0f0; padding: 10px; border-bottom: 1px solid #ddd;">
                            <h3 style="margin: 0;">Medewerker: ${medewerkerNaam} (${medewerkerId})</h3>
                            <p style="margin: 5px 0 0 0;">Aantal records: ${items.length}</p>
                        </div>
                        
                        ${debugComparisons}
                        
                        <div style="padding: 15px;">
                            ${applicableRecord ? `
                                <div style="background-color: #e6f7ff; padding: 15px; border-left: 4px solid #1890ff; margin-bottom: 20px;">
                                    <h4 style="margin-top: 0;">Record dat gebruikt wordt voor ${targetDate.toLocaleDateString()}</h4>
                                    <p><strong>ID:</strong> ${applicableRecord.Id}</p>
                                    <p><strong>Ingangsdatum:</strong> ${formatDate(applicableRecord.Ingangsdatum)}</p>
                                    <p><strong>Veranderingsdatum:</strong> ${applicableRecord.Veranderingsdatum ? formatDate(applicableRecord.Veranderingsdatum) : 'Niet ingesteld'}</p>
                                    
                                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                        <tr style="background-color: #f0f0f0;">
                                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Dag</th>
                                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Uren</th>
                                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Tijden</th>
                                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Type</th>
                                        </tr>
                                        ${formatDayRow('Maandag', applicableRecord)}
                                        ${formatDayRow('Dinsdag', applicableRecord)}
                                        ${formatDayRow('Woensdag', applicableRecord)}
                                        ${formatDayRow('Donderdag', applicableRecord)}
                                        ${formatDayRow('Vrijdag', applicableRecord)}
                                    </table>
                                </div>
                            ` : '<p>Geen toepasselijk record gevonden voor de geselecteerde datum</p>'}
                            
                            <h4>Alle records (gesorteerd op Ingangsdatum, nieuwste eerst)</h4>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr style="background-color: #f0f0f0;">
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">ID</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Ingangsdatum</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Veranderingsdatum</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">TotaalUren</th>
                                </tr>
                                ${items.map((item, index) => `
                                    <tr style="${applicableRecord && applicableRecord.Id === item.Id ? 'background-color: #e6f7ff;' : ''}">
                                        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.Id}</td>
                                        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${formatDate(item.Ingangsdatum)}</td>
                                        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.Veranderingsdatum ? formatDate(item.Veranderingsdatum) : 'Niet ingesteld'}</td>
                                        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.TotaalUren || 'Niet ingesteld'}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            return html;
        }
        
        // Format a date for display
        // Helper function to normalize dates by removing time components
        function normalizeDate(date) {
            if (!date) return null;
            
            try {
                let normalized;
                
                // If already a Date object
                if (date instanceof Date) {
                    normalized = new Date(date);
                } else if (typeof date === 'string') {
                    // Try to parse Dutch date format (DD-MM-YYYY HH:MM:SS)
                    if (date.match(/^\d{1,2}-\d{1,2}-\d{4}/)) {
                        const parts = date.split(' ')[0].split('-');
                        const day = parseInt(parts[0], 10);
                        const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JS
                        const year = parseInt(parts[2], 10);
                        
                        normalized = new Date(year, month, day);
                        
                        // If there's a time component
                        if (date.includes(' ') && date.split(' ')[1]) {
                            const timeParts = date.split(' ')[1].split(':');
                            if (timeParts.length >= 2) {
                                normalized.setHours(
                                    parseInt(timeParts[0], 10),
                                    parseInt(timeParts[1], 10),
                                    timeParts[2] ? parseInt(timeParts[2], 10) : 0
                                );
                            }
                        }
                    } else {
                        // Try standard JS date parsing
                        normalized = new Date(date);
                    }
                } else {
                    // Try with whatever we got
                    normalized = new Date(date);
                }
                
                // Check if it's a valid date
                if (isNaN(normalized.getTime())) {
                    console.warn('Invalid date found:', date);
                    return null;
                }
                
                // Reset time components
                normalized.setHours(0, 0, 0, 0);
                return normalized;
            } catch (error) {
                console.error('Error normalizing date:', error, date);
                return null;
            }
        }
        
        function formatDate(date) {
            if (!date) return 'Niet ingesteld';
            
            try {
                // First try to normalize the date if it's a string
                if (typeof date === 'string') {
                    date = normalizeDate(date);
                }
                
                // Check if it's a Date object
                if (!(date instanceof Date)) {
                    console.warn('Not a Date object after conversion:', date);
                    return `Ongeldige datum: ${String(date)}`;
                }
                
                // Check if it's a valid date
                if (isNaN(date.getTime())) {
                    return 'Ongeldige datum';
                }
                
                // Format as DD-MM-YYYY HH:MM:SS for consistency
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                
                return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
            } catch (error) {
                console.error('Error formatting date:', error, date);
                return `Fout bij formatteren datum: ${String(date)}`;
            }
        }
        
        // Format time
        function formatTime(timeValue) {
            if (!timeValue) return '-';
            
            // Handle different time formats
            if (typeof timeValue === 'string') {
                // If already in HH:MM format
                if (/^\d{1,2}:\d{2}$/.test(timeValue)) {
                    return timeValue;
                }
                
                // If in ISO date format
                if (timeValue.includes('T')) {
                    const date = new Date(timeValue);
                    if (!isNaN(date.getTime())) {
                        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                }
            }
            
            return timeValue;
        }
        
        // Format a day row for the detailed view
        function formatDayRow(day, record) {
            const startField = `${day}Start`;
            const eindField = `${day}Eind`;
            const totaalField = `${day}Totaal`;
            const soortField = `${day}Soort`;
            
            const startTime = record[startField] ? formatTime(record[startField]) : '-';
            const eindTime = record[eindField] ? formatTime(record[eindField]) : '-';
            const timeDisplay = (startTime !== '-' && eindTime !== '-') ? `${startTime} - ${eindTime}` : '-';
            
            return `
                <tr>
                    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${day}</td>
                    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${record[totaalField] || '-'}</td>
                    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${timeDisplay}</td>
                    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${record[soortField] || '-'}</td>
                </tr>
            `;
        }
        
        // Show error message
        function showError(message) {
            const errorContainer = document.getElementById('errorContainer');
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            init();
            
            // Add event listeners for the test buttons
            document.getElementById('testPreVVDButton').addEventListener('click', () => {
                testRauf1(new Date(2025, 6, 3)); // July 3, 2025 (before VVD change)
            });
            
            document.getElementById('testAfterVVDButton').addEventListener('click', () => {
                testRauf1(new Date(2025, 6, 15)); // July 15, 2025 (after VVD change)
            });
            
            document.getElementById('testExactVVDButton').addEventListener('click', () => {
                testRauf1(new Date(2025, 6, 14)); // July 14, 2025 (exactly on the ingangsdatum)
            });
            
            // Initialize the username dropdown
            initUsernameSelect();
            
            // Add event listener for the date range test button
            document.getElementById('testDateRangeButton').addEventListener('click', () => {
                testDateRange();
            });
        });
        
        // Initialize the username dropdown
        async function initUsernameSelect() {
            try {
                const fetchSharePointList = window.fetchSharePointList || fetchSharePointListFallback;
                const [urenPerWeekItems, medewerkerItems] = await Promise.all([
                    fetchSharePointList('UrenPerWeek'),
                    fetchSharePointList('Medewerkers')
                ]);
                
                // Get unique medewerker IDs from UrenPerWeek
                const uniqueMedewerkerIds = [...new Set(
                    urenPerWeekItems
                        .filter(item => item.MedewerkerID)
                        .map(item => item.MedewerkerID)
                )];
                
                // Create a map of medewerker IDs to names
                const medewerkerMap = {};
                medewerkerItems.forEach(item => {
                    if (item.Username) {
                        medewerkerMap[item.Username] = item.Title || item.Username;
                    }
                });
                
                // Populate the dropdown
                const usernameSelect = document.getElementById('usernameSelect');
                
                // Sort by display name
                uniqueMedewerkerIds.sort((a, b) => {
                    const nameA = medewerkerMap[a] || a;
                    const nameB = medewerkerMap[b] || b;
                    return nameA.localeCompare(nameB);
                });
                
                // Add options to the dropdown
                uniqueMedewerkerIds.forEach(medewerkerId => {
                    const displayName = medewerkerMap[medewerkerId] || medewerkerId;
                    const option = document.createElement('option');
                    option.value = medewerkerId;
                    option.textContent = `${displayName} (${medewerkerId})`;
                    usernameSelect.appendChild(option);
                });
                
                // Set default dates (current month)
                const today = new Date();
                const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                
                document.getElementById('startDateInput').valueAsDate = startDate;
                document.getElementById('endDateInput').valueAsDate = endDate;
                
                // Pre-select Rauf1 if available
                const raufOption = Array.from(usernameSelect.options).find(option => 
                    option.value.toLowerCase().includes('rauf') || 
                    option.value.toLowerCase().includes('raufz1')
                );
                
                if (raufOption) {
                    raufOption.selected = true;
                }
            } catch (error) {
                showError(`Fout bij initialiseren gebruikerslijst: ${error.message}`);
                console.error('Error initializing username select:', error);
            }
        }
        
        // Test blocks over a date range
        async function testDateRange() {
            const usernameSelect = document.getElementById('usernameSelect');
            const startDateInput = document.getElementById('startDateInput');
            const endDateInput = document.getElementById('endDateInput');
            const dateRangeResultsContainer = document.getElementById('dateRangeResultsContainer');
            const statusMessage = document.getElementById('statusMessage');
            
            try {
                // Validate inputs
                if (!usernameSelect.value) {
                    throw new Error('Selecteer een gebruiker');
                }
                
                if (!startDateInput.value || !endDateInput.value) {
                    throw new Error('Vul zowel start- als einddatum in');
                }
                
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                
                if (endDate < startDate) {
                    throw new Error('Einddatum moet na startdatum liggen');
                }
                
                // Show loading status
                statusMessage.style.display = 'block';
                statusMessage.textContent = 'Blokken worden berekend...';
                
                // Get the selected user
                const selectedUserId = usernameSelect.value;
                const selectedUserName = usernameSelect.options[usernameSelect.selectedIndex].text;
                
                // Fetch all data
                const fetchSharePointList = window.fetchSharePointList || fetchSharePointListFallback;
                const urenPerWeekItems = await fetchSharePointList('UrenPerWeek');
                
                // Filter for the selected user
                const userItems = urenPerWeekItems.filter(item => 
                    item.MedewerkerID && item.MedewerkerID === selectedUserId
                );
                
                if (userItems.length === 0) {
                    dateRangeResultsContainer.innerHTML = `<p>Geen UrenPerWeek records gevonden voor ${selectedUserName}.</p>`;
                    dateRangeResultsContainer.style.display = 'block';
                    statusMessage.style.display = 'none';
                    return;
                }
                
                // Process and normalize dates
                const processedItems = userItems.map(item => {
                    try {
                        // Preserve original date strings for debugging
                        const ingangsdatum_original = item.Ingangsdatum;
                        const veranderingsdatum_original = item.Veranderingsdatum;
                        
                        // Process the dates
                        const parsedIngangsdatum = normalizeDate(item.Ingangsdatum);
                        const parsedVeranderingsdatum = normalizeDate(item.Veranderingsdatum);
                        
                        return {
                            ...item,
                            Ingangsdatum_original: ingangsdatum_original,
                            Veranderingsdatum_original: veranderingsdatum_original,
                            Ingangsdatum: parsedIngangsdatum,
                            Veranderingsdatum: parsedVeranderingsdatum
                        };
                    } catch (error) {
                        console.error('Error processing item:', error, item);
                        // Return item with original data and null dates on error
                        return {
                            ...item,
                            Ingangsdatum_original: item.Ingangsdatum,
                            Veranderingsdatum_original: item.Veranderingsdatum,
                            Ingangsdatum: null,
                            Veranderingsdatum: null
                        };
                    }
                });
                
                // Sort by Ingangsdatum (newest first) for proper selection logic
                processedItems.sort((a, b) => {
                    if (!a.Ingangsdatum) return 1;
                    if (!b.Ingangsdatum) return -1;
                    return b.Ingangsdatum - a.Ingangsdatum;
                });
                
                // Generate all dates in the range
                const dates = [];
                let currentDate = new Date(startDate);
                
                while (currentDate <= endDate) {
                    dates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                
                // Generate results
                let html = `
                    <div style="background-color: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h3>Blokken voor ${selectedUserName} van ${startDate.toLocaleDateString()} tot ${endDate.toLocaleDateString()}</h3>
                        <p>Totaal aantal datums: ${dates.length}</p>
                        <p>Totaal aantal UrenPerWeek records: ${processedItems.length}</p>
                        
                        <div style="margin-top: 20px; overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; min-width: 800px;">
                                <thead>
                                    <tr style="background-color: #f0f0f0;">
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Datum</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Weekdag</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Record ID</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Ingangsdatum</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">VVO/VVM/VVD</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                `;
                
                // Check each date
                const weekdayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
                
                // Track record changes for visualization
                let lastRecordId = null;
                
                dates.forEach((date, index) => {
                    // Find applicable record for this date
                    let applicableRecord = null;
                    
                    for (const item of processedItems) {
                        if (item.Ingangsdatum instanceof Date && !isNaN(item.Ingangsdatum) && item.Ingangsdatum <= date) {
                            applicableRecord = item;
                            break;
                        }
                    }
                    
                    const weekdayName = weekdayNames[date.getDay()];
                    const weekdayField = weekdayName === 'Zondag' || weekdayName === 'Zaterdag' ? null : weekdayName;
                    
                    // Check if this day has a VVD/VVM/VVO block
                    let blockType = '';
                    let blockDetails = '';
                    
                    if (applicableRecord && weekdayField) {
                        const soortField = `${weekdayField}Soort`;
                        blockType = applicableRecord[soortField] || '';
                        
                        if (blockType) {
                            const startField = `${weekdayField}Start`;
                            const eindField = `${weekdayField}Eind`;
                            const totaalField = `${weekdayField}Totaal`;
                            
                            const startTime = applicableRecord[startField] ? formatTime(applicableRecord[startField]) : '-';
                            const eindTime = applicableRecord[eindField] ? formatTime(applicableRecord[eindField]) : '-';
                            const timeDisplay = (startTime !== '-' && eindTime !== '-') ? `${startTime} - ${eindTime}` : '-';
                            
                            blockDetails = `${timeDisplay} (${applicableRecord[totaalField] || '-'} uur)`;
                        }
                    }
                    
                    // Check if record changed from previous date
                    const recordChanged = applicableRecord && lastRecordId !== applicableRecord.Id;
                    lastRecordId = applicableRecord ? applicableRecord.Id : null;
                    
                    // Add row with conditional formatting
                    html += `
                        <tr style="${recordChanged ? 'background-color: #e6f7ff; font-weight: bold;' : index % 2 === 0 ? 'background-color: #f9f9f9;' : ''}">
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${formatDate(date).split(' ')[0]}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${weekdayName}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${applicableRecord ? applicableRecord.Id : 'Geen record'}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${applicableRecord ? formatDate(applicableRecord.Ingangsdatum).split(' ')[0] : '-'}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd; ${blockType ? 'font-weight: bold;' : ''}">${blockType || '-'}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${blockDetails || '-'}</td>
                        </tr>
                    `;
                });
                
                html += `
                                </tbody>
                            </table>
                        </div>
                        
                        <div style="margin-top: 20px;">
                            <h4>Beschikbare Records (gesorteerd op Ingangsdatum)</h4>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr style="background-color: #f0f0f0;">
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">ID</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Ingangsdatum</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Ma</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Di</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Wo</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Do</th>
                                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Vr</th>
                                </tr>
                `;
                
                // Sort by Ingangsdatum (oldest first) for record display
                const sortedRecords = [...processedItems].sort((a, b) => {
                    if (!a.Ingangsdatum) return 1;
                    if (!b.Ingangsdatum) return -1;
                    return a.Ingangsdatum - b.Ingangsdatum;
                });
                
                sortedRecords.forEach(item => {
                    html += `
                        <tr>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.Id}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${formatDate(item.Ingangsdatum).split(' ')[0]}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.MaandagSoort || '-'}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.DinsdagSoort || '-'}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.WoensdagSoort || '-'}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.DonderdagSoort || '-'}</td>
                            <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${item.VrijdagSoort || '-'}</td>
                        </tr>
                    `;
                });
                
                html += `
                            </table>
                        </div>
                    </div>
                `;
                
                // Display the results
                dateRangeResultsContainer.innerHTML = html;
                dateRangeResultsContainer.style.display = 'block';
                
                // Hide status message
                statusMessage.style.display = 'none';
                
                // Scroll to results
                dateRangeResultsContainer.scrollIntoView({ behavior: 'smooth' });
                
            } catch (error) {
                showError(`Fout bij testen datumbereik: ${error.message}`);
                statusMessage.textContent = 'Fout bij testen datumbereik';
            }
        }
    </script>
</body>
</html>
