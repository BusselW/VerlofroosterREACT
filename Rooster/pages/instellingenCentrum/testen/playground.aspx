<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A/B Week Rooster Tester</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" href="data:," />

    <!-- React Libraries -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <!-- Configuration -->
    <script src="../../../js/config/configLijst.js"></script>

    <!-- Use the same styles as the settings page -->
    <link href="../css/instellingencentrum_s.css" rel="stylesheet">
    
    <!-- Additional playground styles -->
    <style>
        .playground-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
            margin-bottom: 2rem;
        }

        .playground-header h1 {
            font-size: 2.2rem;
            margin-bottom: 0.5rem;
            font-weight: 300;
        }

        .playground-header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .help-section {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }

        .help-section h2 {
            color: #0c5460;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .help-section ul {
            color: #495057;
            padding-left: 20px;
            line-height: 1.6;
        }

        .week-config-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }

        .week-block {
            background: white;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            padding: 20px;
        }

        .week-block h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            text-align: center;
            padding: 10px;
            border-radius: 6px;
        }

        .week-a h3 {
            background: #e8f5e8;
            color: #27ae60;
        }

        .week-b h3 {
            background: #fff3cd;
            color: #f39c12;
        }

        .day-row {
            display: grid;
            grid-template-columns: 80px 1fr;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
        }

        .day-label {
            font-weight: 600;
            color: #2c3e50;
            font-size: 13px;
        }

        .day-select {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
        }

        .preview-section {
            margin-top: 30px;
        }

        .week-display {
            background: white;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .week-header {
            padding: 15px 20px;
            font-weight: 600;
            text-align: center;
            color: white;
        }

        .week-type-a .week-header {
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        }

        .week-type-b .week-header {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
        }

        .days-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }

        .day-cell {
            padding: 15px 10px;
            text-align: center;
            border-right: 1px solid #e1e5e9;
            border-bottom: 1px solid #e1e5e9;
        }

        .day-cell:last-child {
            border-right: none;
        }

        .day-header {
            font-weight: 600;
            color: #2c3e50;
            background: #f8f9fa;
            padding: 10px;
            font-size: 12px;
        }

        .day-content {
            min-height: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 5px;
        }

        .day-date {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 5px;
        }

        .day-type {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .day-type.vvm {
            background: #e8f5e8;
            color: #27ae60;
        }

        .day-type.vvd {
            background: #fff3cd;
            color: #f39c12;
        }

        .day-type.normaal {
            background: #e3f2fd;
            color: #2196f3;
        }

        .day-type.flexibel {
            background: #f3e5f5;
            color: #9c27b0;
        }

        .weekend {
            background: #f8f9fa;
            color: #95a5a6;
        }

        .back-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background: #6c757d;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
        }

        .back-link:hover {
            background: #5a6268;
            color: white;
            text-decoration: none;
        }

        @media (max-width: 768px) {
            .week-config-container {
                grid-template-columns: 1fr;
            }
            
            .days-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
    </style>
</head>

<body>
    <div class="playground-header">
        <h1>A/B Week Rooster Tester</h1>
        <p>Test hoe uw roulerende werkschema eruit ziet voordat u het instelt</p>
    </div>

    <div id="root"></div>

    <script type="module">
        const { useState, useEffect, createElement: h, Fragment } = React;

        // Nederlandse maanden en dagen
        const dutchMonths = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 
                           'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
        const dutchDays = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
        const dutchDaysShort = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

        // Week calculation function (same as main calendar)
        function calculateWeekType(targetDate, cycleStartDate) {
            if (!cycleStartDate || !(cycleStartDate instanceof Date)) {
                return { weekType: 'A', error: 'Geen geldige startdatum cyclus' };
            }
           
            const getWeekStartDate = (date) => {
                const d = new Date(date);
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1);
                d.setDate(diff);
                d.setHours(0, 0, 0, 0);
                return d;
            };
           
            const cycleWeekStart = getWeekStartDate(cycleStartDate);
            const targetWeekStart = getWeekStartDate(targetDate);
           
            const timeDiff = targetWeekStart.getTime() - cycleWeekStart.getTime();
            const weeksSinceCycleStart = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
           
            const weekType = ((weeksSinceCycleStart % 2) + 2) % 2 === 0 ? 'A' : 'B';
            
            return {
                weekType,
                cycleWeekStart: cycleWeekStart,
                targetWeekStart: targetWeekStart,
                weeksSinceCycleStart
            };
        }

        function formatDutchDate(date) {
            const day = date.getDate();
            const month = dutchMonths[date.getMonth()];
            const year = date.getFullYear();
            const weekday = dutchDays[date.getDay()];
            return `${weekday} ${day} ${month} ${year}`;
        }

        // =====================
        // Main Playground Component
        // =====================
        const PlaygroundApp = () => {
            const [cycleStartDate, setCycleStartDate] = useState('2025-07-07');
            const [weekAConfig, setWeekAConfig] = useState({
                monday: 'Normaal',
                tuesday: 'Normaal',
                wednesday: 'Normaal',
                thursday: 'Normaal',
                friday: 'VVD'
            });
            const [weekBConfig, setWeekBConfig] = useState({
                monday: 'VVD',
                tuesday: 'Normaal',
                wednesday: 'Normaal',
                thursday: 'Normaal',
                friday: 'Normaal'
            });

            const updateWeekConfig = (week, day, value) => {
                if (week === 'A') {
                    setWeekAConfig(prev => ({ ...prev, [day]: value }));
                } else {
                    setWeekBConfig(prev => ({ ...prev, [day]: value }));
                }
            };

            const generatePreview = () => {
                if (!cycleStartDate) return [];

                const cycleStart = new Date(cycleStartDate);
                const today = new Date();
                const dayOfWeek = today.getDay();
                const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
                const startDate = new Date(today);
                startDate.setDate(today.getDate() + daysUntilMonday);

                const weeks = [];
                for (let week = 0; week < 4; week++) {
                    const weekStartDate = new Date(startDate);
                    weekStartDate.setDate(startDate.getDate() + (week * 7));
                    
                    const calculation = calculateWeekType(weekStartDate, cycleStart);
                    const weekType = calculation.weekType;
                    const config = weekType === 'A' ? weekAConfig : weekBConfig;

                    const days = [];
                    for (let day = 0; day < 7; day++) {
                        const currentDate = new Date(weekStartDate);
                        currentDate.setDate(weekStartDate.getDate() + day);
                        
                        const isWeekend = day === 0 || day === 6;
                        let dayType = '';
                        
                        if (!isWeekend) {
                            const workdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                            const workday = workdays[day - 1];
                            dayType = config[workday];
                        } else {
                            dayType = 'Weekend';
                        }

                        days.push({
                            date: currentDate,
                            dayType,
                            isWeekend
                        });
                    }

                    weeks.push({
                        weekNumber: week + 1,
                        weekType,
                        startDate: weekStartDate,
                        days
                    });
                }

                return weeks;
            };

            const weeks = generatePreview();

            return h('div', { className: 'container' },
                h('div', { className: 'help-section' },
                    h('h2', null, 'Hoe gebruik je deze tester?'),
                    h('ul', null,
                        h('li', null, h('strong', null, 'Week A startdatum:'), ' Kies een maandag waarop Week A begint'),
                        h('li', null, h('strong', null, 'Week schema\'s:'), ' Stel in welke dagen u in Week A en Week B werkt'),
                        h('li', null, h('strong', null, 'Bekijk resultaat:'), ' Zie hieronder hoe de komende 4 weken eruit zien'),
                        h('li', null, h('strong', null, 'Tevreden?'), ' Ga terug naar ', 
                            h('a', { 
                                href: '../instellingenCentrumN.aspx',
                                style: { color: '#3498db', textDecoration: 'none', fontWeight: '600' }
                            }, 'Persoonlijke Instellingen'), ' en vul dezelfde gegevens in')
                    )
                ),

                h('div', { className: 'card' },
                    h('h3', { className: 'card-title' }, 'Uw roulerende schema instellen'),
                    
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Op welke maandag begint Week A?'),
                        h('input', {
                            type: 'date',
                            className: 'form-input',
                            value: cycleStartDate,
                            onChange: (e) => setCycleStartDate(e.target.value)
                        }),
                        h('small', { className: 'text-muted' }, 
                            'Kies bij voorkeur een maandag in de nabije toekomst'
                        )
                    ),

                    h('div', { className: 'week-config-container' },
                        h('div', { className: 'week-block week-a' },
                            h('h3', null, 'Week A - Wat werk je deze week?'),
                            h('div', { className: 'day-config' },
                                ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => {
                                    const dayNames = {
                                        monday: 'Maandag',
                                        tuesday: 'Dinsdag', 
                                        wednesday: 'Woensdag',
                                        thursday: 'Donderdag',
                                        friday: 'Vrijdag'
                                    };
                                    
                                    return h('div', { key: day, className: 'day-row' },
                                        h('span', { className: 'day-label' }, dayNames[day] + ':'),
                                        h('select', {
                                            className: 'day-select',
                                            value: weekAConfig[day],
                                            onChange: (e) => updateWeekConfig('A', day, e.target.value)
                                        },
                                            h('option', { value: 'Normaal' }, 'Gewoon werken'),
                                            h('option', { value: 'VVM' }, 'Vrije voormiddag'),
                                            h('option', { value: 'VVD' }, 'Niet werken'),
                                            h('option', { value: 'Flexibel' }, 'Flexibele tijd')
                                        )
                                    );
                                })
                            )
                        ),

                        h('div', { className: 'week-block week-b' },
                            h('h3', null, 'Week B - Wat werk je deze week?'),
                            h('div', { className: 'day-config' },
                                ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => {
                                    const dayNames = {
                                        monday: 'Maandag',
                                        tuesday: 'Dinsdag',
                                        wednesday: 'Woensdag', 
                                        thursday: 'Donderdag',
                                        friday: 'Vrijdag'
                                    };
                                    
                                    return h('div', { key: day, className: 'day-row' },
                                        h('span', { className: 'day-label' }, dayNames[day] + ':'),
                                        h('select', {
                                            className: 'day-select',
                                            value: weekBConfig[day],
                                            onChange: (e) => updateWeekConfig('B', day, e.target.value)
                                        },
                                            h('option', { value: 'Normaal' }, 'Gewoon werken'),
                                            h('option', { value: 'VVM' }, 'Vrije voormiddag'),
                                            h('option', { value: 'VVD' }, 'Niet werken'),
                                            h('option', { value: 'Flexibel' }, 'Flexibele tijd')
                                        )
                                    );
                                })
                            )
                        )
                    )
                ),

                h('div', { className: 'card preview-section' },
                    h('h3', { className: 'card-title' }, 'Zo ziet uw rooster eruit (komende 4 weken)'),
                    
                    ...weeks.map((week, index) =>
                        h('div', { 
                            key: index, 
                            className: `week-display week-type-${week.weekType.toLowerCase()}` 
                        },
                            h('div', { className: 'week-header' },
                                `Week ${week.weekNumber}: Week ${week.weekType} - ${formatDutchDate(week.startDate)}`
                            ),
                            h('div', { className: 'days-grid' },
                                // Headers
                                ...dutchDaysShort.map(dayName =>
                                    h('div', { 
                                        key: dayName,
                                        className: `day-cell day-header ${dayName === 'Zo' || dayName === 'Za' ? 'weekend' : ''}` 
                                    }, dayName)
                                ),
                                // Days
                                ...week.days.map((day, dayIndex) =>
                                    h('div', { 
                                        key: dayIndex,
                                        className: `day-cell ${day.isWeekend ? 'weekend' : ''}` 
                                    },
                                        h('div', { className: 'day-content' },
                                            h('div', { className: 'day-date' }, 
                                                `${day.date.getDate()}/${day.date.getMonth() + 1}`
                                            ),
                                            h('div', { 
                                                className: `day-type ${day.dayType.toLowerCase()}` 
                                            }, day.dayType)
                                        )
                                    )
                                )
                            )
                        )
                    )
                ),

                h('div', { style: { textAlign: 'center', marginTop: '30px' } },
                    h('a', { 
                        href: '../instellingenCentrumN.aspx',
                        className: 'back-link'
                    }, 'Terug naar Persoonlijke Instellingen')
                )
            );
        };

        // Initialize the application
        const initializePlayground = () => {
            const container = document.getElementById('root');
            if (container) {
                const root = ReactDOM.createRoot(container);
                root.render(h(PlaygroundApp));
                console.log('Playground initialized successfully');
            } else {
                console.error('Root container not found');
            }
        };

        // Start the application
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializePlayground);
        } else {
            initializePlayground();
        }
</body>

</html>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }

        .content {
            padding: 30px;
        }

        .help-section {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }

        .help-section h2 {
            color: #0c5460;
            margin-bottom: 15px;
            font-size: 1.3em;
        }

        .help-section p {
            color: #495057;
            line-height: 1.6;
            margin-bottom: 10px;
        }

        .controls-section {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 30px;
        }

        .controls-section h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.2em;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-weight: 600;
            margin-bottom: 8px;
            color: #2c3e50;
            font-size: 14px;
        }

        .form-group input, .form-group select {
            padding: 10px;
            border: 2px solid #e1e5e9;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #3498db;
        }

        .week-config {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }

        .week-block {
            background: white;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            padding: 20px;
        }

        .week-block h4 {
            color: #2c3e50;
            margin-bottom: 15px;
            text-align: center;
            padding: 8px;
            border-radius: 6px;
            font-size: 1.1em;
        }

        .week-a h4 {
            background: #e8f5e8;
            color: #27ae60;
        }

        .week-b h4 {
            background: #fff3cd;
            color: #f39c12;
        }

        .day-config {
            display: grid;
            gap: 8px;
        }

        .day-row {
            display: grid;
            grid-template-columns: 70px 1fr;
            gap: 10px;
            align-items: center;
        }

        .day-label {
            font-weight: 600;
            color: #2c3e50;
            font-size: 12px;
        }

        .btn {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
        }

        .roster-view {
            margin-top: 30px;
        }

        .week-display {
            background: white;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .week-header {
            padding: 15px 20px;
            font-weight: 600;
            text-align: center;
            color: white;
        }

        .week-type-a .week-header {
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        }

        .week-type-b .week-header {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
        }

        .days-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
        }

        .day-cell {
            padding: 15px 10px;
            text-align: center;
            border-right: 1px solid #e1e5e9;
        }

        .day-cell:last-child {
            border-right: none;
        }

        .day-header {
            font-weight: 600;
            color: #2c3e50;
            background: #f8f9fa;
            padding: 10px;
            font-size: 12px;
        }

        .day-content {
            min-height: 60px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 5px;
        }

        .day-type {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .day-type.vvm {
            background: #fff3cd;
            color: #f39c12;
        }

        .day-type.vvd {
            background: #f8d7da;
            color: #721c24;
        }

        .day-type.normaal {
            background: #d1ecf1;
            color: #0c5460;
        }

        .day-type.flexibel {
            background: #e2e3f3;
            color: #383d41;
        }

        .back-button {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s;
        }

        .back-button:hover {
            background: rgba(255, 255, 255, 0.3);
            text-decoration: none;
            color: white;
        }

        .example-section {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .example-section h4 {
            color: #856404;
            margin-bottom: 10px;
        }

        .example-section p {
            color: #533f03;
            font-size: 13px;
            margin-bottom: 5px;
        }

        @media (max-width: 768px) {
            .form-grid {
                grid-template-columns: 1fr;
            }
            
            .week-config {
                grid-template-columns: 1fr;
            }
            
            .days-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header" style="position: relative;">
            <a href="../instellingenCentrumN.aspx" class="back-button">← Terug naar instellingen</a>
            <h1>🧪 Roulerende Schema Tester</h1>
            <p>Test hoe uw A/B week rooster eruit ziet voordat u het opslaat</p>
        </div>

        <div class="content">
            <div class="help-section">
                <h2>💡 Wat doet deze tool?</h2>
                <p><strong>Probleem:</strong> U wilt een roulerend schema instellen maar weet niet zeker of u het goed doet?</p>
                <p><strong>Oplossing:</strong> Test hier eerst hoe uw schema eruitziet! Stel hieronder uw Week A en Week B in en zie direct hoe het rooster eruitziet over meerdere weken.</p>
                <p><strong>Tip:</strong> Als het er goed uitziet, gaat u terug naar de instellingen en voert u dezelfde gegevens daar in.</p>
            </div>

            <div class="example-section">
                <h4>📋 Voorbeeld scenario (al ingevuld):</h4>
                <p>• <strong>Week A:</strong> Maandag VVM (vrije voormiddag), rest van de week normaal werken</p>
                <p>• <strong>Week B:</strong> Maandag t/m donderdag normaal werken, vrijdag VVD (vrije dag)</p>
                <p>• <strong>Cyclus start:</strong> 7 juli 2025 (wanneer Week A begint)</p>
            </div>

            <div class="controls-section">
                <h3>⚙️ Stel uw schema in</h3>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="cycleStartDate">📅 Wanneer begint Week A?</label>
                        <input type="date" id="cycleStartDate" value="2025-07-07">
                        <small style="color: #6c757d; font-size: 11px; margin-top: 4px;">Kies een maandag</small>
                    </div>
                </div>

                <div class="week-config">
                    <div class="week-block week-a">
                        <h4>Week A - Eerste week van de cyclus</h4>
                        <div class="day-config">
                            <div class="day-row">
                                <span class="day-label">Ma:</span>
                                <select id="weekA-monday">
                                    <option value="VVM" selected>VVM - Vrije voormiddag</option>
                                    <option value="VVD">VVD - Vrije dag</option>
                                    <option value="Normaal">Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                            <div class="day-row">
                                <span class="day-label">Di:</span>
                                <select id="weekA-tuesday">
                                    <option value="VVM">VVM - Vrije voormiddag</option>
                                    <option value="VVD">VVD - Vrije dag</option>
                                    <option value="Normaal" selected>Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                            <div class="day-row">
                                <span class="day-label">Wo:</span>
                                <select id="weekA-wednesday">
                                    <option value="VVM">VVM - Vrije voormiddag</option>
                                    <option value="VVD">VVD - Vrije dag</option>
                                    <option value="Normaal" selected>Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                            <div class="day-row">
                                <span class="day-label">Do:</span>
                                <select id="weekA-thursday">
                                    <option value="VVM">VVM - Vrije voormiddag</option>
                                    <option value="VVD">VVD - Vrije dag</option>
                                    <option value="Normaal" selected>Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                            <div class="day-row">
                                <span class="day-label">Vr:</span>
                                <select id="weekA-friday">
                                    <option value="VVM">VVM - Vrije voormiddag</option>
                                    <option value="VVD">VVD - Vrije dag</option>
                                    <option value="Normaal" selected>Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="week-block week-b">
                        <h4>Week B - Tweede week van de cyclus</h4>
                        <div class="day-config">
                            <div class="day-row">
                                <span class="day-label">Ma:</span>
                                <select id="weekB-monday">
                                    <option value="VVM">VVM - Vrije voormiddag</option>
                                    <option value="VVD">VVD - Vrije dag</option>
                                    <option value="Normaal" selected>Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                            <div class="day-row">
                                <span class="day-label">Di:</span>
                                <select id="weekB-tuesday">
                                    <option value="VVM">VVM - Vrije voormiddag</option>
                                    <option value="VVD">VVD - Vrije dag</option>
                                    <option value="Normaal" selected>Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                            <div class="day-row">
                                <span class="day-label">Wo:</span>
                                <select id="weekB-wednesday">
                                    <option value="VVM">VVM - Vrije voormiddag</option>
                                    <option value="VVD">VVD - Vrije dag</option>
                                    <option value="Normaal" selected>Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                            <div class="day-row">
                                <span class="day-label">Do:</span>
                                <select id="weekB-thursday">
                                    <option value="VVM">VVM - Vrije voormiddag</option>
                                    <option value="VVD">VVD - Vrije dag</option>
                                    <option value="Normaal" selected>Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                            <div class="day-row">
                                <span class="day-label">Vr:</span>
                                <select id="weekB-friday">
                                    <option value="VVM">VVM - Vrije voormiddag</option>
                                    <option value="VVD" selected>VVD - Vrije dag</option>
                                    <option value="Normaal">Normaal - Hele dag werken</option>
                                    <option value="Flexibel">Flexibel - Thuiswerken</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn" onclick="updateRoster()">🔄 Bekijk resultaat</button>
                </div>
            </div>

            <div class="roster-view">
                <h3>📅 Zo ziet uw rooster eruit:</h3>
                <div id="rosterDisplay"></div>
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #6c757d; font-size: 13px;">
                        Ziet het er goed uit? Ga terug naar de instellingen en voer dezelfde gegevens in!
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Nederlandse maanden en dagen
        const dutchMonths = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 
                           'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
        const dutchDays = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

        // Verbeterde week berekening functie
        function calculateWeekType(targetDate, cycleStartDate) {
            if (!cycleStartDate || !(cycleStartDate instanceof Date)) {
                return { weekType: 'A', error: 'Geen geldige startdatum cyclus' };
            }
           
            // Bereken welke kalenderweek elke datum valt
            const getWeekStartDate = (date) => {
                const d = new Date(date);
                const day = d.getDay(); // 0 = zondag, 1 = maandag, etc.
                const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pas aan naar maandag
                d.setDate(diff);
                d.setHours(0, 0, 0, 0);
                return d;
            };
           
            // Krijg de maandag van de week die de cyclus startdatum bevat
            const cycleWeekStart = getWeekStartDate(cycleStartDate);
            
            // Krijg de maandag van de week die de doeldatum bevat
            const targetWeekStart = getWeekStartDate(targetDate);
           
            // Bereken het aantal weken tussen deze maandagen
            const timeDiff = targetWeekStart.getTime() - cycleWeekStart.getTime();
            const weeksSinceCycleStart = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
           
            // Even weken = A, Oneven weken = B
            const weekType = ((weeksSinceCycleStart % 2) + 2) % 2 === 0 ? 'A' : 'B';
            
            return {
                weekType,
                weeksSinceCycleStart
            };
        }

        function formatDutchDate(date) {
            const day = date.getDate();
            const month = dutchMonths[date.getMonth()];
            const weekday = dutchDays[date.getDay()];
            return `${weekday} ${day} ${month}`;
        }

        function getWeekConfig(weekType) {
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
            const config = {};
            
            days.forEach(day => {
                const elementId = `week${weekType}-${day}`;
                const element = document.getElementById(elementId);
                config[day] = element ? element.value : 'Normaal';
            });
            
            return config;
        }

        function updateRoster() {
            const cycleStartInput = document.getElementById('cycleStartDate').value;

            if (!cycleStartInput) {
                alert('Vul de startdatum in!');
                return;
            }

            const cycleStartDate = new Date(cycleStartInput);
            
            // Zorg dat cycleStartDate een maandag is
            const cycleStartDay = cycleStartDate.getDay();
            if (cycleStartDay !== 1) { // Als het geen maandag is
                const diff = cycleStartDay === 0 ? -6 : 1 - cycleStartDay;
                cycleStartDate.setDate(cycleStartDate.getDate() + diff);
                // Update het input veld
                document.getElementById('cycleStartDate').value = cycleStartDate.toISOString().split('T')[0];
            }

            const weekAConfig = getWeekConfig('A');
            const weekBConfig = getWeekConfig('B');

            let rosterHTML = '';

            // Toon 4 weken startend vanaf de cyclus startdatum
            for (let week = 0; week < 4; week++) {
                const weekStartDate = new Date(cycleStartDate);
                weekStartDate.setDate(cycleStartDate.getDate() + (week * 7));
                
                const calculation = calculateWeekType(weekStartDate, cycleStartDate);
                const weekType = calculation.weekType;
                const config = weekType === 'A' ? weekAConfig : weekBConfig;

                rosterHTML += `
                    <div class="week-display week-type-${weekType.toLowerCase()}">
                        <div class="week-header">
                            Week ${weekType} - ${formatDutchDate(weekStartDate)} t/m ${formatDutchDate(new Date(weekStartDate.getTime() + 4 * 24 * 60 * 60 * 1000))}
                        </div>
                        <div class="days-grid">
                            <div class="day-cell day-header">Ma</div>
                            <div class="day-cell day-header">Di</div>
                            <div class="day-cell day-header">Wo</div>
                            <div class="day-cell day-header">Do</div>
                            <div class="day-cell day-header">Vr</div>
                `;

                const workdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
                
                workdays.forEach(workday => {
                    const dayType = config[workday];
                    const dayTypeClass = dayType.toLowerCase();

                    rosterHTML += `
                        <div class="day-cell">
                            <div class="day-content">
                                <div class="day-type ${dayTypeClass}">${dayType}</div>
                            </div>
                        </div>
                    `;
                });

                rosterHTML += '</div></div>';
            }

            document.getElementById('rosterDisplay').innerHTML = rosterHTML;
        }

        // Initiële weergave bij laden van pagina
        document.addEventListener('DOMContentLoaded', function() {
            updateRoster();
        });

        // Update automatisch bij wijzigingen
        document.getElementById('cycleStartDate').addEventListener('change', updateRoster);
        
        // Update bij wijzigingen in week configuraties
        ['weekA-monday', 'weekA-tuesday', 'weekA-wednesday', 'weekA-thursday', 'weekA-friday',
         'weekB-monday', 'weekB-tuesday', 'weekB-wednesday', 'weekB-thursday', 'weekB-friday'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', updateRoster);
            }
        });
    </script>
</body>
</html>
