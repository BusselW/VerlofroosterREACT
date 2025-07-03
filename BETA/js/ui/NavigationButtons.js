import { useState, useEffect, createElement as h } from 'react';
import { fetchSharePointList, getCurrentUser } from '../services/sharepointService.js';
import { isUserInAnyGroup } from '../services/permissionService.js';

const NavigationButtons = () => {
    const [userPermissions, setUserPermissions] = useState({
        isAdmin: false,
        isFunctional: false,
        isTaakbeheer: false,
        loading: true
    });

    const [userInfo, setUserInfo] = useState({
        naam: '',
        pictureUrl: '',
        loading: true
    });

    const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Load permissions
                const adminGroups = ["1. Sharepoint beheer", "1.1. Mulder MT"];
                const functionalGroups = ["1. Sharepoint beheer", "1.1. Mulder MT", "2.6 Roosteraars"];
                const taakbeheerGroups = ["1. Sharepoint beheer", "1.1. Mulder MT", "2.6 Roosteraars", "2.3. Senioren beoordelen", "2.4. Senioren administratie"];

                const [isAdmin, isFunctional, isTaakbeheer] = await Promise.all([
                    isUserInAnyGroup(adminGroups),
                    isUserInAnyGroup(functionalGroups),
                    isUserInAnyGroup(taakbeheerGroups)
                ]);

                setUserPermissions({
                    isAdmin,
                    isFunctional,
                    isTaakbeheer,
                    loading: false
                });

                // Load user info
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    // Get medewerker naam from Medewerkers list
                    const medewerkers = await fetchSharePointList('Medewerkers');
                    const medewerker = medewerkers.find(m =>
                        m.MedewerkerID && currentUser.LoginName &&
                        m.MedewerkerID.toLowerCase().includes(currentUser.LoginName.split('|')[1]?.toLowerCase())
                    );

                    setUserInfo({
                        naam: medewerker?.Naam || currentUser.Title || 'Gebruiker',
                        pictureUrl: currentUser.PictureURL || 'https://via.placeholder.com/32x32/6c757d/ffffff?text=U',
                        loading: false
                    });
                } else {
                    setUserInfo({
                        naam: 'Gebruiker',
                        pictureUrl: 'https://via.placeholder.com/32x32/6c757d/ffffff?text=U',
                        loading: false
                    });
                }

                console.log('User data loaded:', { permissions: { isAdmin, isFunctional, isTaakbeheer }, userInfo });

                // Debug: Log current user and medewerkers for troubleshooting
                console.log('DEBUG - Current user details:', {
                    LoginName: currentUser?.LoginName,
                    Title: currentUser?.Title,
                    Email: currentUser?.Email
                });

            } catch (error) {
                console.error('Error loading user data:', error);
                setUserPermissions(prev => ({ ...prev, loading: false }));
                setUserInfo({
                    naam: 'Gebruiker',
                    pictureUrl: 'https://via.placeholder.com/32x32/6c757d/ffffff?text=U',
                    loading: false
                });
            }
        };

        loadUserData();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsDropdownOpen && !event.target.closest('.user-dropdown')) {
                setSettingsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [settingsDropdownOpen]);

    const navigateTo = (page) => {
        window.location.href = `pages/${page}`;
    };

    if (userPermissions.loading || userInfo.loading) {
        return null; // Don't show buttons while loading
    }

    return h('div', { className: 'navigation-buttons' },
        // Right side navigation buttons
        h('div', { id: 'nav-buttons-right', className: 'nav-buttons-right' },
            // Admin button - Visible to FullAccess (Admin)
            userPermissions.isAdmin && h('button', {
                className: 'btn btn-admin',
                onClick: () => navigateTo('adminCentrum.aspx'),
                title: 'Administratie Centrum'
            },
                h('i', { className: 'fas fa-cog' }),
                'Admin'
            ),

            // Beheer button - Visible to Functional (beheer)
            userPermissions.isFunctional && h('button', {
                className: 'btn btn-functional',
                onClick: () => navigateTo('beheerCentrum.aspx'),
                title: 'Beheer Centrum'
            },
                h('i', { className: 'fas fa-tools' }),
                'Beheer'
            ),

            // Behandelen button - Visible to Taakbeheer
            userPermissions.isTaakbeheer && h('button', {
                className: 'btn btn-taakbeheer',
                onClick: () => navigateTo('behandelCentrum.aspx'),
                title: 'Behandel Centrum'
            },
                h('i', { className: 'fas fa-tasks' }),
                'Behandelen'
            ),

            // Tour button - Start interactive tutorial
            h('button', {
                className: 'btn btn-tour',
                onClick: () => window.startTutorial && window.startTutorial(),
                title: 'Start interactieve tour'
            },
                h('i', { className: 'fas fa-question-circle' }),
                'Tour'
            ),

            // User Settings Dropdown - Visible to everyone
            h('div', { id: 'user-dropdown', className: 'user-dropdown' },
                h('button', {
                    className: 'btn btn-settings user-settings-btn',
                    onClick: () => setSettingsDropdownOpen(!settingsDropdownOpen),
                    title: 'Gebruikersinstellingen'
                },
                    h('img', {
                        className: 'user-avatar-small',
                        src: userInfo.pictureUrl,
                        alt: userInfo.naam,
                        onError: (e) => {
                            e.target.src = 'https://via.placeholder.com/32x32/6c757d/ffffff?text=U';
                        }
                    }),
                    h('span', { className: 'user-name' }, userInfo.naam),
                    h('i', {
                        className: `fas fa-chevron-${settingsDropdownOpen ? 'up' : 'down'}`,
                        style: { fontSize: '0.8rem', marginLeft: '0.5rem' }
                    })
                ),

                // Dropdown menu
                settingsDropdownOpen && h('div', { className: 'user-dropdown-menu' },
                    h('div', { className: 'dropdown-item-group' },
                        h('button', {
                            className: 'dropdown-item',
                            onClick: () => {
                                navigateTo('gInstellingen.aspx');
                                setSettingsDropdownOpen(false);
                            }
                        },
                            h('i', { className: 'fas fa-user-edit' }),
                            h('div', { className: 'dropdown-item-content' },
                                h('span', { className: 'dropdown-item-title' }, 'Persoonlijke gegevens & Werkdagen'),
                                h('span', { className: 'dropdown-item-description' }, 'Beheer uw profiel en werkrooster')
                            )
                        ),
                        h('button', {
                            className: 'dropdown-item',
                            onClick: () => {
                                navigateTo('gInstellingen.aspx#instellingen');
                                setSettingsDropdownOpen(false);
                            }
                        },
                            h('i', { className: 'fas fa-cog' }),
                            h('div', { className: 'dropdown-item-content' },
                                h('span', { className: 'dropdown-item-title' }, 'Rooster instellingen'),
                                h('span', { className: 'dropdown-item-description' }, 'Configureer weergave voorkeuren')
                            )
                        )
                    )
                )
            )
        )
    );
};

export default NavigationButtons;
