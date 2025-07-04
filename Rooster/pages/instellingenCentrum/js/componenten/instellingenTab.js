/**
 * Settings Tab Component
 * 
 * Provides configuration options for notifications, display preferences,
 * regional settings, and system information.
 */

const { useState, createElement: h } = React;

export const SettingsTab = ({ user, data }) => {
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(false);
    const [weekendDisplay, setWeekendDisplay] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('nl');
    const [dateFormat, setDateFormat] = useState('dd-mm-yyyy');
    const [timeFormat, setTimeFormat] = useState('24h');
    const [defaultView, setDefaultView] = useState('week');

    const handleSaveSettings = () => {
        const settings = {
            notifications,
            emailUpdates,
            weekendDisplay,
            autoRefresh,
            theme,
            language,
            dateFormat,
            timeFormat,
            defaultView
        };
        console.log('Instellingen opgeslagen:', settings);
    };

    const handleResetSettings = () => {
        setNotifications(true);
        setEmailUpdates(false);
        setWeekendDisplay(true);
        setAutoRefresh(true);
        setTheme('light');
        setLanguage('nl');
        setDateFormat('dd-mm-yyyy');
        setTimeFormat('24h');
        setDefaultView('week');
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
                        d: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z', 
                        clipRule: 'evenodd' 
                    })
                ),
                'Instellingen'
            ),
            h('p', { className: 'text-muted mb-4' }, 'Configureer uw persoonlijke voorkeuren en applicatie-instellingen.')
        ),

        // Notification Settings Card
        h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 
                h('svg', { 
                    width: '20', 
                    height: '20', 
                    fill: 'currentColor', 
                    viewBox: '0 0 20 20',
                    style: { marginRight: '0.5rem' }
                }, 
                    h('path', { 
                        d: 'M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' 
                    })
                ),
                'Meldingen'
            ),
            h('div', { className: 'settings-section' },
                h('div', { className: 'setting-item' },
                    h('label', { className: 'setting-label' },
                        h('input', {
                            type: 'checkbox',
                            checked: notifications,
                            onChange: (e) => setNotifications(e.target.checked),
                            className: 'setting-checkbox'
                        }),
                        h('div', { className: 'setting-content' },
                            h('span', { className: 'setting-text' }, 'Push meldingen'),
                            h('span', { className: 'setting-description' }, 'Ontvang direct meldingen voor belangrijke updates')
                        )
                    )
                ),
                h('div', { className: 'setting-item' },
                    h('label', { className: 'setting-label' },
                        h('input', {
                            type: 'checkbox',
                            checked: emailUpdates,
                            onChange: (e) => setEmailUpdates(e.target.checked),
                            className: 'setting-checkbox'
                        }),
                        h('div', { className: 'setting-content' },
                            h('span', { className: 'setting-text' }, 'E-mail samenvattingen'),
                            h('span', { className: 'setting-description' }, 'Ontvang dagelijkse/wekelijkse samenvattingen per e-mail')
                        )
                    )
                ),
                h('div', { className: 'setting-item' },
                    h('label', { className: 'setting-label' },
                        h('input', {
                            type: 'checkbox',
                            checked: autoRefresh,
                            onChange: (e) => setAutoRefresh(e.target.checked),
                            className: 'setting-checkbox'
                        }),
                        h('div', { className: 'setting-content' },
                            h('span', { className: 'setting-text' }, 'Automatisch vernieuwen'),
                            h('span', { className: 'setting-description' }, 'Vernieuw gegevens automatisch elke 5 minuten')
                        )
                    )
                )
            )
        ),

        // Display Settings Card
        h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 
                h('svg', { 
                    width: '20', 
                    height: '20', 
                    fill: 'currentColor', 
                    viewBox: '0 0 20 20',
                    style: { marginRight: '0.5rem' }
                }, 
                    h('path', { 
                        fillRule: 'evenodd', 
                        d: 'M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z', 
                        clipRule: 'evenodd' 
                    })
                ),
                'Weergave'
            ),
            h('div', { className: 'settings-section' },
                h('div', { className: 'form-row' },
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Thema'),
                        h('select', {
                            value: theme,
                            onChange: (e) => setTheme(e.target.value),
                            className: 'form-input'
                        },
                            h('option', { value: 'light' }, 'Licht thema'),
                            h('option', { value: 'dark' }, 'Donker thema'),
                            h('option', { value: 'auto' }, 'Automatisch (systeem)')
                        )
                    ),
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Standaard weergave'),
                        h('select', {
                            value: defaultView,
                            onChange: (e) => setDefaultView(e.target.value),
                            className: 'form-input'
                        },
                            h('option', { value: 'week' }, 'Weekweergave'),
                            h('option', { value: 'month' }, 'Maandweergave'),
                            h('option', { value: 'list' }, 'Lijstweergave')
                        )
                    )
                ),
                
                h('div', { className: 'setting-item' },
                    h('label', { className: 'setting-label' },
                        h('input', {
                            type: 'checkbox',
                            checked: weekendDisplay,
                            onChange: (e) => setWeekendDisplay(e.target.checked),
                            className: 'setting-checkbox'
                        }),
                        h('div', { className: 'setting-content' },
                            h('span', { className: 'setting-text' }, 'Weekenden tonen'),
                            h('span', { className: 'setting-description' }, 'Toon zaterdag en zondag in de kalenderweergave')
                        )
                    )
                )
            )
        ),

        // Regional Settings Card
        h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 
                h('svg', { 
                    width: '20', 
                    height: '20', 
                    fill: 'currentColor', 
                    viewBox: '0 0 20 20',
                    style: { marginRight: '0.5rem' }
                }, 
                    h('path', { 
                        fillRule: 'evenodd', 
                        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z', 
                        clipRule: 'evenodd' 
                    })
                ),
                'Regionale instellingen'
            ),
            h('div', { className: 'settings-section' },
                h('div', { className: 'form-row' },
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Taal'),
                        h('select', {
                            value: language,
                            onChange: (e) => setLanguage(e.target.value),
                            className: 'form-input'
                        },
                            h('option', { value: 'nl' }, 'Nederlands'),
                            h('option', { value: 'en' }, 'English'),
                            h('option', { value: 'de' }, 'Deutsch'),
                            h('option', { value: 'fr' }, 'Français')
                        )
                    ),
                    h('div', { className: 'form-group' },
                        h('label', { className: 'form-label' }, 'Datumformaat'),
                        h('select', {
                            value: dateFormat,
                            onChange: (e) => setDateFormat(e.target.value),
                            className: 'form-input'
                        },
                            h('option', { value: 'dd-mm-yyyy' }, 'DD-MM-YYYY (31-12-2024)'),
                            h('option', { value: 'mm-dd-yyyy' }, 'MM-DD-YYYY (12-31-2024)'),
                            h('option', { value: 'yyyy-mm-dd' }, 'YYYY-MM-DD (2024-12-31)'),
                            h('option', { value: 'dd/mm/yyyy' }, 'DD/MM/YYYY (31/12/2024)')
                        )
                    )
                ),
                
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Tijdformaat'),
                    h('select', {
                        value: timeFormat,
                        onChange: (e) => setTimeFormat(e.target.value),
                        className: 'form-input'
                    },
                        h('option', { value: '24h' }, '24-uurs (14:30)'),
                        h('option', { value: '12h' }, '12-uurs (2:30 PM)')
                    )
                )
            )
        ),

        // System Information Card
        h('div', { className: 'card' },
            h('h3', { className: 'card-title' }, 
                h('svg', { 
                    width: '20', 
                    height: '20', 
                    fill: 'currentColor', 
                    viewBox: '0 0 20 20',
                    style: { marginRight: '0.5rem' }
                }, 
                    h('path', { 
                        fillRule: 'evenodd', 
                        d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z', 
                        clipRule: 'evenodd' 
                    })
                ),
                'Systeem informatie'
            ),
            h('div', { className: 'info-grid' },
                h('div', { className: 'info-item' },
                    h('span', { className: 'info-label' }, 'Versie:'),
                    h('span', { className: 'info-value' }, 'v2.1.0')
                ),
                h('div', { className: 'info-item' },
                    h('span', { className: 'info-label' }, 'Laatst bijgewerkt:'),
                    h('span', { className: 'info-value' }, 'Vandaag, 14:30')
                ),
                h('div', { className: 'info-item' },
                    h('span', { className: 'info-label' }, 'Browser:'),
                    h('span', { className: 'info-value' }, navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                        navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                        navigator.userAgent.includes('Safari') ? 'Safari' : 'Onbekend')
                ),
                h('div', { className: 'info-item' },
                    h('span', { className: 'info-label' }, 'Gebruiker ID:'),
                    h('span', { className: 'info-value' }, user?.Id || 'N/A')
                )
            )
        ),

        // Action Buttons Card
        h('div', { className: 'card' },
            h('div', { className: 'settings-actions' },
                h('button', { 
                    className: 'btn btn-primary',
                    onClick: handleSaveSettings
                }, 
                    h('svg', { 
                        width: '16', 
                        height: '16', 
                        fill: 'currentColor', 
                        viewBox: '0 0 20 20',
                        style: { marginRight: '0.5rem' }
                    }, 
                        h('path', { 
                            d: 'M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z' 
                        })
                    ),
                    'Alle Instellingen Opslaan'
                ),
                h('button', { 
                    className: 'btn btn-secondary',
                    onClick: handleResetSettings
                }, 
                    h('svg', { 
                        width: '16', 
                        height: '16', 
                        fill: 'currentColor', 
                        viewBox: '0 0 20 20',
                        style: { marginRight: '0.5rem' }
                    }, 
                        h('path', { 
                            fillRule: 'evenodd', 
                            d: 'M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z', 
                            clipRule: 'evenodd' 
                        })
                    ),
                    'Standaardwaarden'
                ),
                h('button', { 
                    className: 'btn btn-secondary',
                    onClick: () => window.location.reload()
                }, 
                    h('svg', { 
                        width: '16', 
                        height: '16', 
                        fill: 'currentColor', 
                        viewBox: '0 0 20 20',
                        style: { marginRight: '0.5rem' }
                    }, 
                        h('path', { 
                            fillRule: 'evenodd', 
                            d: 'M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z', 
                            clipRule: 'evenodd' 
                        })
                    ),
                    'Pagina Vernieuwen'
                )
            )
        )
    );
};
