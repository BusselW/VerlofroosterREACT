/**
 * @file profielTab.js
 * @description Profile Tab Component for Settings Page
 */

import { getUserInfo, fetchSharePointList, updateSharePointListItem, createSharePointListItem } from '../../../js/services/sharepointService.js';

const { useState, useEffect, createElement: h, useRef, useImperativeHandle, forwardRef } = React;

// =====================
// Profile Tab Component
// =====================
export const ProfileTab = ({ user, data, isRegistration = false, onDataUpdate, onSave, stepSaveTrigger, onSaveComplete }) => {
    const [sharePointUser, setSharePointUser] = useState({ PictureURL: null, IsLoading: true });
    const [teams, setTeams] = useState([]);
    const [functies, setFuncties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentUserRecord, setCurrentUserRecord] = useState(null);
    const [saveMessage, setSaveMessage] = useState(null);
    const [formData, setFormData] = useState({
        naam: user?.Title || '',
        username: '',
        email: user?.Email || '',
        geboortedatum: '',
        team: '',
        functie: ''
    });

    // Helper function to get full domain\username format
    const getFullLoginName = (loginName) => {
        if (!loginName) return '';
        
        // Remove claim prefix if present (i:0#.w|domain\username -> domain\username)
        let processed = loginName;
        if (processed.startsWith('i:0#.w|')) {
            processed = processed.substring(7);
        }
        
        // Return the full domain\username format
        return processed;
    };

    // Initialize username from user data
    useEffect(() => {
        if (user && user.LoginName && !formData.username) {
            const fullUsername = getFullLoginName(user.LoginName);
            setFormData(prev => ({
                ...prev,
                username: fullUsername
            }));
        }
    }, [user, formData.username]);

    // Load Teams and Functies from SharePoint, and current user data from Medewerkers
    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                setLoading(true);
                
                // Load Teams (using Naam column)
                const teamsData = await fetchSharePointList('Teams');
                if (teamsData && Array.isArray(teamsData)) {
                    setTeams(teamsData.filter(team => team.Actief === true || team.Actief === undefined));
                }

                // Load Functions (using Title column)
                const functiesData = await fetchSharePointList('keuzelijstFuncties');
                if (functiesData && Array.isArray(functiesData)) {
                    setFuncties(functiesData);
                }

                // Load current user data from Medewerkers list
                if (user && formData.username) {
                    const medewerkersData = await fetchSharePointList('Medewerkers');
                    if (medewerkersData && Array.isArray(medewerkersData)) {
                        // Find the current user in the Medewerkers list by matching Username
                        const currentMedewerker = medewerkersData.find(medewerker => 
                            medewerker.Username === formData.username
                        );
                        
                        if (currentMedewerker) {
                            console.log('Found current user in Medewerkers:', currentMedewerker);
                            // Store the current user record for updates
                            setCurrentUserRecord(currentMedewerker);
                            
                            if (isRegistration) {
                                // In registration mode, don't pre-fill - use placeholders only
                                setFormData(prev => ({
                                    ...prev,
                                    naam: '', // Keep empty so placeholder shows
                                    geboortedatum: '',
                                    team: '',
                                    functie: ''
                                }));
                            } else {
                                // In settings mode, pre-fill form data with existing employee data
                                setFormData(prev => ({
                                    ...prev,
                                    naam: currentMedewerker.Naam || prev.naam,
                                    geboortedatum: currentMedewerker.Geboortedatum ? 
                                        new Date(currentMedewerker.Geboortedatum).toISOString().split('T')[0] : '',
                                    team: currentMedewerker.Team || '',
                                    functie: currentMedewerker.Functie || ''
                                }));
                            }
                        } else {
                            // If user not found in Medewerkers, use placeholder
                            console.log('User not found in Medewerkers list, using placeholder');
                            setCurrentUserRecord(null);
                            setFormData(prev => ({
                                ...prev,
                                naam: isRegistration ? '' : (prev.naam || '') // Empty in registration mode
                            }));
                        }
                    }
                }

                console.log('Dropdown data loaded:', { teams: teamsData?.length, functies: functiesData?.length });
            } catch (error) {
                console.error('Error loading dropdown data:', error);
                // Set placeholder on error
                setFormData(prev => ({
                    ...prev,
                    naam: isRegistration ? '' : (prev.naam || '') // Empty in registration mode
                }));
            } finally {
                setLoading(false);
            }
        };

        loadDropdownData();
    }, [formData.username]);

    const fallbackAvatar = 'https://placehold.co/96x96/4a90e2/ffffff?text=';

    // Fetch user avatar info
    useEffect(() => {
        let isMounted = true;
        const fetchUserData = async () => {
            // Use LoginName instead of Username, and also try with the cleaned username
            const loginName = user?.LoginName || formData.username;
            if (loginName) {
                if (isMounted) setSharePointUser({ PictureURL: null, IsLoading: true });
                const userData = await getUserInfo(loginName);
                if (isMounted) {
                    setSharePointUser({ ...(userData || {}), IsLoading: false });
                }
            } else if (isMounted) {
                setSharePointUser({ PictureURL: null, IsLoading: false });
            }
        };
        fetchUserData();
        return () => { isMounted = false; };
    }, [user?.LoginName, formData.username]);

    // Handle save trigger from parent (registration wizard)
    useEffect(() => {
        if (isRegistration && stepSaveTrigger > 0) {
            console.log('Save triggered from registration wizard');
            handleSave();
        }
    }, [stepSaveTrigger]);

    const getAvatarUrl = () => {
        if (sharePointUser.IsLoading) return '';
        
        // Try SharePoint profile photo first (from getUserInfo)
        if (sharePointUser.PictureURL) return sharePointUser.PictureURL;
        
        // Use the exact same logic as verlofRooster.aspx getProfilePhotoUrl function
        const loginName = user?.LoginName || formData.username;
        if (loginName) {
            // Extract username from domain\username format or claim format
            let usernameOnly = loginName;
            if (loginName.includes('\\')) {
                usernameOnly = loginName.split('\\')[1];
            } else if (loginName.includes('|')) {
                usernameOnly = loginName.split('|')[1];
                // Handle case where it's still domain\username after claim processing
                if (usernameOnly.includes('\\')) {
                    usernameOnly = usernameOnly.split('\\')[1];
                }
            }
            
            // Construct URL to SharePoint profile photo - same as verlofRooster.aspx
            const siteUrl = window.appConfiguratie?.instellingen?.siteUrl || '';
            const profileUrl = `${siteUrl}/_layouts/15/userphoto.aspx?size=L&accountname=${usernameOnly}@org.om.local`;
            return profileUrl;
        }
        
        // Fallback to initials - same logic as MedewerkerRow
        const match = user?.Title ? String(user.Title).match(/\b\w/g) : null;
        const initials = match ? match.join('') : '?';
        return `${fallbackAvatar}${initials}`;
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        // Try smaller size first, then fallback to initials - same logic as MedewerkerRow
        const loginName = user?.LoginName || formData.username;
        if (loginName && !e.target.src.includes('size=S')) {
            let usernameOnly = loginName;
            if (loginName.includes('\\')) {
                usernameOnly = loginName.split('\\')[1];
            } else if (loginName.includes('|')) {
                usernameOnly = loginName.split('|')[1];
                // Handle case where it's still domain\username after claim processing
                if (usernameOnly.includes('\\')) {
                    usernameOnly = usernameOnly.split('\\')[1];
                }
            }
            
            const siteUrl = window.appConfiguratie?.instellingen?.siteUrl || '';
            const fallbackUrl = `${siteUrl}/_layouts/15/userphoto.aspx?size=S&accountname=${usernameOnly}@org.om.local`;
            e.target.src = fallbackUrl;
        } else {
            // Final fallback to initials - same logic as MedewerkerRow
            const match = user?.Title ? String(user.Title).match(/\b\w/g) : null;
            const initials = match ? match.join('') : '?';
            e.target.src = `${fallbackAvatar}${initials}`;
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        // Validation
        if (!formData.naam || formData.naam.trim() === '' || formData.naam === 'Bijv. Jan de Vries') {
            setSaveMessage({ type: 'error', text: 'Naam is verplicht.' });
            return;
        }

        if (!formData.username || formData.username.trim() === '') {
            setSaveMessage({ type: 'error', text: 'Gebruikersnaam is verplicht.' });
            return;
        }

        setSaving(true);
        setSaveMessage(null);

        try {
            // Map form data to SharePoint column names based on configLijst.js
            const updateData = {
                Title: formData.naam, // Title is required for SharePoint
                Naam: formData.naam,
                Geboortedatum: formData.geboortedatum ? new Date(formData.geboortedatum).toISOString() : null,
                E_x002d_mail: formData.email, // SharePoint encodes hyphens as _x002d_
                Functie: formData.functie,
                Team: formData.team,
                Username: formData.username,
                Actief: true // Set as active user
            };

            console.log('Saving user data:', updateData);

            let result;
            if (isRegistration || !currentUserRecord) {
                // Registration mode or no existing record - create new user
                console.log('Creating new user record in Medewerkers list');
                result = await createSharePointListItem('Medewerkers', updateData);
                console.log('User created successfully with ID:', result.ID);
                setSaveMessage({ type: 'success', text: 'Profiel succesvol aangemaakt!' });
                
                // Store the new record for future updates
                setCurrentUserRecord({ ...updateData, ID: result.ID });
                
                // Notify parent component if in registration mode
                if (isRegistration && onDataUpdate) {
                    onDataUpdate({ 
                        profileCreated: true, 
                        userId: result.ID,
                        userData: updateData 
                    });
                }
                
                // Call onSaveComplete callback if provided (for registration wizard)
                if (onSaveComplete) {
                    onSaveComplete(true);
                }
            } else {
                // Settings mode - update existing user
                console.log('Updating existing user record with ID:', currentUserRecord.ID || currentUserRecord.Id);
                await updateSharePointListItem(
                    'Medewerkers', 
                    currentUserRecord.ID || currentUserRecord.Id, 
                    updateData
                );
                console.log('Profile updated successfully');
                setSaveMessage({ type: 'success', text: 'Profiel succesvol opgeslagen!' });
            }

            // Clear the success message after 3 seconds
            setTimeout(() => {
                setSaveMessage(null);
            }, 3000);

        } catch (error) {
            console.error('Error saving profile:', error);
            const action = isRegistration || !currentUserRecord ? 'aanmaken' : 'opslaan';
            setSaveMessage({ 
                type: 'error', 
                text: `Fout bij ${action} van profiel. Probeer het opnieuw.` 
            });
            
            // Call onSaveComplete with error if provided (for registration wizard)
            if (onSaveComplete) {
                onSaveComplete(false);
            }
        } finally {
            setSaving(false);
        }
    };

    return h('div', null,
        // Combined Profile and Data Card
        h('div', { className: 'card' },
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
                        h('span', { className: 'badge badge-secondary' }, 
                            formData.functie || currentUserRecord?.Functie || 'Medewerker'
                        )
                    )
                )
            ),
            
            // Form fields - Updated layout: Volledige naam | Gebruikersnaam
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
                    h('label', { className: 'form-label' }, 'Gebruikersnaam'),
                    h('input', {
                        type: 'text',
                        className: 'form-input',
                        value: formData.username,
                        readOnly: true,
                        style: { backgroundColor: '#f8fafc', color: '#64748b' },
                        title: 'Automatisch ingevuld vanuit SharePoint'
                    })
                )
            ),
            // E-mailadres - full width
            h('div', { className: 'form-row' },
                h('div', { className: 'form-group', style: { gridColumn: '1 / -1' } },
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
            // Geboortedatum - full width
            h('div', { className: 'form-row' },
                h('div', { className: 'form-group', style: { gridColumn: '1 / -1' } },
                    h('label', { 
                        className: 'form-label',
                        style: { 
                            fontFamily: 'inherit',
                            fontWeight: '500',
                            fontSize: 'inherit'
                        }
                    }, 'Geboortedatum'),
                    h('input', {
                        type: 'date',
                        className: 'form-input',
                        value: formData.geboortedatum,
                        onChange: (e) => handleInputChange('geboortedatum', e.target.value)
                    })
                )
            ),
            // Team | Functie
            h('div', { className: 'form-row' },
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Team'),
                    h('select', {
                        className: 'form-input',
                        value: formData.team,
                        onChange: (e) => handleInputChange('team', e.target.value),
                        style: { 
                            backgroundColor: '#ffffff', 
                            color: '#1f2937',
                            opacity: 1 
                        }
                    },
                        h('option', { value: '' }, loading ? 'Laden...' : 'Selecteer team...'),
                        teams.map(team =>
                            h('option', { 
                                key: team.ID || team.Id, 
                                value: team.Naam 
                            }, team.Naam)
                        )
                    )
                ),
                h('div', { className: 'form-group' },
                    h('label', { className: 'form-label' }, 'Functie'),
                    h('select', {
                        className: 'form-input',
                        value: formData.functie,
                        onChange: (e) => handleInputChange('functie', e.target.value),
                        style: { 
                            backgroundColor: '#ffffff', 
                            color: '#1f2937',
                            opacity: 1 
                        }
                    },
                        h('option', { value: '' }, loading ? 'Laden...' : 'Selecteer functie...'),
                        functies.map(functie =>
                            h('option', { 
                                key: functie.ID || functie.Id, 
                                value: functie.Title 
                            }, functie.Title)
                        )
                    )
                )
            ),
            
            // Save button at the bottom (only show in settings mode, not registration)
            !isRegistration && h('div', { 
                className: 'form-row', 
                style: { 
                    marginTop: '24px', 
                    display: 'flex',
                    justifyContent: 'flex-end', 
                    alignItems: 'center', 
                    gap: '12px' 
                } 
            },
                // Success/Error message
                saveMessage && h('div', { 
                    className: `status-message status-${saveMessage.type}`,
                    style: { 
                        marginRight: 'auto',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: saveMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: saveMessage.type === 'success' ? '#155724' : '#721c24',
                        border: saveMessage.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                    }
                }, saveMessage.text),
                // Save button - right-aligned
                h('button', { 
                    className: 'btn btn-primary',
                    onClick: handleSave,
                    disabled: saving
                }, saving ? 'Opslaan...' : 'Opslaan')
            ),

            // Show messages in registration mode (without button)
            isRegistration && saveMessage && h('div', { 
                className: `status-message status-${saveMessage.type}`,
                style: { 
                    marginTop: '16px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: saveMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: saveMessage.type === 'success' ? '#155724' : '#721c24',
                    border: saveMessage.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                }
            }, saveMessage.text)
        )
    );
};
