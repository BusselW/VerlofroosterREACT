const { useState, useEffect, useCallback, createElement: h } = React;

/**
 * A reusable Autocomplete component for searching SharePoint users.
 * @param {{
 *   onSelect: (user: object) => void;
 *   searchFunction: (query: string) => Promise<object[]>;
 *   placeholder?: string;
 * }} props
 */
export const Autocomplete = ({ onSelect, searchFunction, placeholder = 'Type om te zoeken...' }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [focused, setFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleSearch = useCallback(async (searchQuery) => {
        if (searchQuery.length < 3) {
            setResults([]);
            setSelectedIndex(-1);
            return;
        }
        setLoading(true);
        try {
            const users = await searchFunction(searchQuery);
            setResults(users);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Autocomplete search failed:', error);
            setResults([]);
        }
        setLoading(false);
    }, [searchFunction]);

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            handleSearch(query);
        }, 300); // Debounce requests

        return () => clearTimeout(debounceTimeout);
    }, [query, handleSearch]);

    const handleSelect = (user) => {
        setQuery(user.Title); // Display user's name in input
        setShowResults(false);
        setSelectedIndex(-1);
        onSelect(user);
    };

    const handleKeyDown = (e) => {
        if (!showResults || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < results.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : results.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelect(results[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowResults(false);
                setSelectedIndex(-1);
                break;
        }
    };

    return h('div', { 
        className: `autocomplete-container ${focused ? 'focused' : ''} ${showResults && results.length > 0 ? 'has-results' : ''}` 
    },
        h('div', { className: 'autocomplete-input-wrapper' },
            h('input', {
                type: 'text',
                className: 'autocomplete-input',
                value: query,
                onChange: (e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                },
                onFocus: () => {
                    setFocused(true);
                    if (query.length >= 3) setShowResults(true);
                },
                onBlur: () => {
                    setFocused(false);
                    setTimeout(() => setShowResults(false), 200); // Delay to allow click
                },
                onKeyDown: handleKeyDown,
                placeholder,
                autoComplete: 'off',
                'aria-expanded': showResults,
                'aria-haspopup': 'listbox',
                'aria-activedescendant': selectedIndex >= 0 ? `autocomplete-option-${selectedIndex}` : undefined
            }),
            h('div', { className: 'autocomplete-icon' },
                loading ? 
                    h('div', { className: 'loading-spinner' }) :
                    h('svg', { 
                        width: '16', 
                        height: '16', 
                        viewBox: '0 0 16 16',
                        fill: 'currentColor'
                    },
                        h('path', { 
                            d: 'M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'
                        })
                    )
            )
        ),
        showResults && h('div', { 
            className: 'autocomplete-dropdown',
            role: 'listbox'
        },
            loading && h('div', { className: 'autocomplete-loading' }, 
                h('div', { className: 'loading-spinner' }),
                h('span', null, 'Zoeken...')
            ),
            !loading && results.length === 0 && query.length >= 3 && 
                h('div', { className: 'autocomplete-no-results' }, 
                    h('svg', { width: '16', height: '16', viewBox: '0 0 16 16', fill: 'currentColor' },
                        h('path', { d: 'M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' }),
                        h('path', { d: 'M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z' })
                    ),
                    'Geen medewerkers gevonden'
                ),
            !loading && results.map((user, index) => 
                h('div', {
                    key: user.Id,
                    id: `autocomplete-option-${index}`,
                    className: `autocomplete-option ${index === selectedIndex ? 'selected' : ''}`,
                    onClick: () => handleSelect(user),
                    onMouseEnter: () => setSelectedIndex(index),
                    role: 'option',
                    'aria-selected': index === selectedIndex
                }, 
                    h('div', { className: 'autocomplete-option-content' },
                        h('div', { className: 'user-avatar' }, 
                            h('svg', { width: '20', height: '20', viewBox: '0 0 16 16', fill: 'currentColor' },
                                h('path', { d: 'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z' })
                            )
                        ),
                        h('div', { className: 'user-info' },
                            h('div', { className: 'user-title' }, user.Title),
                            h('div', { className: 'user-details' }, 
                                h('span', { className: 'user-email' }, user.Email),
                                h('span', { className: 'user-separator' }, ' • '),
                                h('span', { className: 'user-login' }, user.LoginName.split('|').pop())
                            )
                        ),
                        h('div', { className: 'autocomplete-select-hint' },
                            h('svg', { width: '12', height: '12', viewBox: '0 0 16 16', fill: 'currentColor' },
                                h('path', { d: 'M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z' })
                            )
                        )
                    )
                )
            )
        )
    );
};
