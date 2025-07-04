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
        email: user?.Email || '',
        geboortedatum: '',
        telefoon: '',
        functie: '',
        afdeling: '',
        manager: '',
        startdatum: ''
    });

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
                        d: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z', 
                        clipRule: 'evenodd' 
                    })
                ),
                'Mijn Profiel'
            ),
            h('p', { className: 'text-muted mb-4' }, 'Bekijk en beheer uw persoonlijke informatie.')
        ),

        // Combined Profile and Data Card
        h('div', { className: 'card' },
            h('div', { className: 'card-header-with-actions' },
                h('h3', { className: 'card-title' }, 'Jouw gegevens'),
                h('button', { 
                    className: 'btn btn-primary',
                    onClick: handleSave
                }, 'Opslaan')
            ),
            
            // Profile section with avatar
            h('div', { className: 'profile-avatar-section' },
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
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Volledige naam'),
                    h('input', {
                        type: 'text',
                        className: 'form-input',
                        value: formData.naam,
                        onChange: (e) => handleInputChange('naam', e.target.value)
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
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Geboortedatum'),
                    h('input', {
                        type: 'date',
                        className: 'form-input',
                        value: formData.geboortedatum,
                        onChange: (e) => handleInputChange('geboortedatum', e.target.value)
                    })
                ),
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Telefoonnummer'),
                    h('input', {
                        type: 'tel',
                        className: 'form-input',
                        value: formData.telefoon,
                        placeholder: '+31 6 12345678',
                        onChange: (e) => handleInputChange('telefoon', e.target.value)
                    })
                )
            ),
            h('div', { className: 'form-row' },
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Functie'),
                    h('input', {
                        type: 'text',
                        className: 'form-input',
                        value: formData.functie,
                        placeholder: 'Uw functietitel...',
                        onChange: (e) => handleInputChange('functie', e.target.value)
                    })
                ),
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Afdeling'),
                    h('select', {
                        className: 'form-input',
                        value: formData.afdeling,
                        onChange: (e) => handleInputChange('afdeling', e.target.value)
                    },
                        h('option', { value: '' }, 'Selecteer afdeling...'),
                        h('option', { value: 'ICT' }, 'ICT'),
                        h('option', { value: 'HR' }, 'Human Resources'),
                        h('option', { value: 'Finance' }, 'Finance'),
                        h('option', { value: 'Operations' }, 'Operations'),
                        h('option', { value: 'Marketing' }, 'Marketing')
                    )
                )
            ),
            h('div', { className: 'form-row' },
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Manager'),
                    h('input', {
                        type: 'text',
                        className: 'form-input',
                        value: formData.manager,
                        placeholder: 'Naam van uw manager...',
                        onChange: (e) => handleInputChange('manager', e.target.value)
                    })
                ),
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Startdatum'),
                    h('input', {
                        type: 'date',
                        className: 'form-input',
                        value: formData.startdatum,
                        onChange: (e) => handleInputChange('startdatum', e.target.value)
                    })
                )
            )
        )
    );
};
