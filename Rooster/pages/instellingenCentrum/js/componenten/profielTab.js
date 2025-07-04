/**
 * @file profielTab.js
 * @description Profile Tab Component for Settings Page
 */

import { getUserInfo } from '../../../js/services/sharepointService.js';

const { useState, useEffect, createElement: h } = React;

// =====================
// Profile Tab Component
// =====================
export const ProfileTab = ({ user, data }) => {
    const [sharePointUser, setSharePointUser] = useState({ PictureURL: null, IsLoading: true });
    const [formData, setFormData] = useState({
        naam: user?.Title || '',
        username: '',
        email: user?.Email || '',
        geboortedatum: '',
        team: '',
        functie: ''
    });

    // Helper function to clean up LoginName (similar to registratie.aspx)
    const getCleanLoginName = (loginName) => {
        if (!loginName) return '';
        // Remove SharePoint claim prefix if present (i:0#.w|)
        if (loginName.startsWith('i:0#.w|')) {
            return loginName.replace('i:0#.w|', '');
        }
        return loginName;
    };

    // Initialize username from user data
    useEffect(() => {
        if (user && user.LoginName && !formData.username) {
            const cleanUsername = getCleanLoginName(user.LoginName);
            setFormData(prev => ({
                ...prev,
                username: cleanUsername
            }));
        }
    }, [user, formData.username]);

    const fallbackAvatar = 'https://placehold.co/96x96/4a90e2/ffffff?text=';

    // Fetch user avatar info
    useEffect(() => {
        let isMounted = true;
        const fetchUserData = async () => {
            if (user && user.Username) {
                if (isMounted) setSharePointUser({ PictureURL: null, IsLoading: true });
                const userData = await getUserInfo(user.Username);
                if (isMounted) {
                    setSharePointUser({ ...(userData || {}), IsLoading: false });
                }
            } else if (isMounted) {
                setSharePointUser({ PictureURL: null, IsLoading: false });
            }
        };
        fetchUserData();
        return () => { isMounted = false; };
    }, [user?.Username]);

    const getAvatarUrl = () => {
        if (sharePointUser.IsLoading) return '';
        if (sharePointUser.PictureURL) return sharePointUser.PictureURL;
        // Robuuste initialen extractie
        const match = user?.Title ? String(user.Title).match(/\b\w/g) : null;
        const initials = match ? match.join('') : '?';
        return `${fallbackAvatar}${initials}`;
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        // Robuuste initialen extractie
        const match = user?.Title ? String(user.Title).match(/\b\w/g) : null;
        const initials = match ? match.join('') : '?';
        e.target.src = `${fallbackAvatar}${initials}`;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // Save logic here
        console.log('Profiel opgeslagen:', formData);
        // Here you could show a success message or handle the save response
    };

    return h('div', null,
        // Combined Profile and Data Card
        h('div', { className: 'card' },
            h('div', { className: 'card-header-with-actions' },
                h('button', { 
                    className: 'btn btn-primary',
                    onClick: handleSave
                }, 'Opslaan')
            ),
            
            // Profile section with avatar
            h('div', { className: 'profile-avatar-section' },
                h('h3', { className: 'card-title', style: { marginBottom: '16px' } }, 'Jouw gegevens'),
                h('div', { className: 'profile-avatar' },
                    sharePointUser.IsLoading ? 
                        h('div', { className: 'avatar-placeholder' }, '...') :
                        h('img', {
                            src: getAvatarUrl(),
                            className: 'avatar-image',
                            alt: `Profielfoto van ${user?.Title || 'gebruiker'}`,
                            onError: handleImageError,
                            style: {
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid #1e3a8a',
                                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
                            }
                        })
                ),
                h('div', { className: 'profile-info' },
                    h('h3', null, user?.Title || 'Gebruiker'),
                    h('p', { className: 'text-muted' }, user?.Email || 'Geen e-mail beschikbaar'),
                    h('div', { className: 'profile-badges' },
                        h('span', { className: 'badge badge-primary' }, 'Actief'),
                        h('span', { className: 'badge badge-secondary' }, 'Medewerker')
                    )
                )
            ),
            
            // Form fields
            h('div', { className: 'form-row' },
                h('div', { className: 'form-group', style: { gridColumn: '1 / -1' } },
                    h('label', { className: 'form-label' }, 'Volledige naam'),
                    h('input', {
                        type: 'text',
                        className: 'form-input',
                        value: formData.naam,
                        onChange: (e) => handleInputChange('naam', e.target.value)
                    })
                )
            ),
            h('div', { className: 'form-row' },
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Gebruikersnaam'),
                    h('input', {
                        type: 'text',
                        className: 'form-input',
                        value: formData.username,
                        readOnly: true,
                        style: { backgroundColor: '#f8fafc', color: '#64748b' },
                        title: 'Automatisch ingevuld vanuit SharePoint'
                    })
                ),
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'E-mailadres'),
                    h('input', {
                        type: 'email',
                        className: 'form-input',
                        value: formData.email,
                        readOnly: true,
                        style: { backgroundColor: '#f8fafc', color: '#64748b' }
                    })
                )
            ),
            h('div', { className: 'form-row' },
                h('div', { className: 'form-group', style: { gridColumn: '1 / -1' } },
                    h('label', { className: 'form-label' }, 'Geboortedatum'),
                    h('input', {
                        type: 'date',
                        className: 'form-input',
                        value: formData.geboortedatum,
                        onChange: (e) => handleInputChange('geboortedatum', e.target.value)
                    })
                )
            ),
            h('div', { className: 'form-row' },
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Team'),
                    h('select', {
                        className: 'form-input',
                        value: formData.team,
                        onChange: (e) => handleInputChange('team', e.target.value)
                    },
                        h('option', { value: '' }, 'Selecteer team...'),
                        h('option', { value: 'ICT' }, 'ICT'),
                        h('option', { value: 'HR' }, 'Human Resources'),
                        h('option', { value: 'Finance' }, 'Finance'),
                        h('option', { value: 'Operations' }, 'Operations'),
                        h('option', { value: 'Marketing' }, 'Marketing')
                    )
                ),
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Functie'),
                    h('select', {
                        className: 'form-input',
                        value: formData.functie,
                        onChange: (e) => handleInputChange('functie', e.target.value)
                    },
                        h('option', { value: '' }, 'Selecteer functie...'),
                        h('option', { value: 'Developer' }, 'Developer'),
                        h('option', { value: 'Manager' }, 'Manager'),
                        h('option', { value: 'Analyst' }, 'Analyst'),
                        h('option', { value: 'Coordinator' }, 'Coordinator'),
                        h('option', { value: 'Specialist' }, 'Specialist')
                    )
                )
            )
        )
    );
};
