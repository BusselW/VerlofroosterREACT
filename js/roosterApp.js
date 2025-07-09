/**
 * roosterApp.js - Main roster application component
 * Reference: .github/copilot-instructions.md
 * 
 * This module contains the main RoosterApp component and its supporting functions.
 * Extracted from verlofRooster.aspx for better code organization.
 */

// Import React hooks
const { useState, useEffect, useMemo, useCallback, createElement: h, Fragment } = React;

// Import required components and services
import MedewerkerRow from './ui/userinfo.js';
import { fetchSharePointList, getUserInfo, getCurrentUser, createSharePointListItem, updateSharePointListItem, deleteSharePointListItem, trimLoginNaamPrefix } from './services/sharepointService.js';
import { getCurrentUserGroups, isUserInAnyGroup } from './services/permissionService.js';
import * as linkInfo from './services/linkInfo.js';
import LoadingLogic, { loadFilteredData, shouldReloadData, updateCacheKey, clearAllCache, logLoadingStatus } from './services/loadingLogic.js';
import ContextMenu, { canManageOthersEvents, canUserModifyItem } from './ui/ContextMenu.js';
import FAB from './ui/FloatingActionButton.js';
import Modal from './ui/Modal.js';
import DagCell, { renderCompensatieMomenten } from './ui/dagCell.js';
import VerlofAanvraagForm from './ui/forms/VerlofAanvraagForm.js';
import CompensatieUrenForm from './ui/forms/CompensatieUrenForm.js';
import ZiekteMeldingForm from './ui/forms/ZiekteMeldingForm.js';
import ZittingsvrijForm from './ui/forms/ZittingsvrijForm.js';
import { roosterTutorial } from './tutorial/roosterTutorial.js';
import { roosterHandleiding, openHandleiding } from './tutorial/roosterHandleiding.js';
import { renderHorenStatus, getHorenStatus, filterMedewerkersByHorenStatus } from './ui/horen.js';
import TooltipManager from './ui/tooltipbar.js';
import ProfielKaarten from './ui/profielkaarten.js';

// Helper constants and functions
const maandNamenVolledig = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

const getPasen = (jaar) => {
    const a = jaar % 19; const b = Math.floor(jaar / 100); const c = jaar % 100; const d = Math.floor(b / 4); const e = b % 4; const f = Math.floor((b + 8) / 25); const g = Math.floor((b - f + 1) / 3); const h = (19 * a + b - d - g + 15) % 30; const i = Math.floor(c / 4); const k = c % 4; const l = (32 + 2 * e + 2 * i - h - k) % 7; const m = Math.floor((a + 11 * h + 22 * l) / 451); const maand = Math.floor((h + l - 7 * m + 114) / 31); const dag = ((h + l - 7 * m + 114) % 31) + 1; return new Date(jaar, maand - 1, dag);
};

const getFeestdagen = (jaar) => {
    const pasen = getPasen(jaar); const feestdagenMap = {}; const voegFeestdagToe = (datum, naam) => { const key = datum.toISOString().split('T')[0]; feestdagenMap[key] = naam; }; voegFeestdagToe(new Date(jaar, 0, 1), 'Nieuwjaarsdag'); voegFeestdagToe(new Date(pasen.getTime() - 2 * 24 * 3600 * 1000), 'Goede Vrijdag'); voegFeestdagToe(pasen, 'Eerste Paasdag'); voegFeestdagToe(new Date(pasen.getTime() + 1 * 24 * 3600 * 1000), 'Tweede Paasdag'); voegFeestdagToe(new Date(jaar, 3, 27), 'Koningsdag'); voegFeestdagToe(new Date(jaar, 4, 5), 'Bevrijdingsdag'); voegFeestdagToe(new Date(pasen.getTime() + 39 * 24 * 3600 * 1000), 'Hemelvaartsdag'); voegFeestdagToe(new Date(pasen.getTime() + 49 * 24 * 3600 * 1000), 'Eerste Pinksterdag'); voegFeestdagToe(new Date(pasen.getTime() + 50 * 24 * 3600 * 1000), 'Tweede Pinksterdag'); voegFeestdagToe(new Date(jaar, 11, 25), 'Eerste Kerstdag'); voegFeestdagToe(new Date(jaar, 11, 26), 'Tweede Kerstdag'); return feestdagenMap;
};

const getWeekNummer = (datum) => {
    const doelDatum = new Date(datum.getTime()); const dagVanWeek = (doelDatum.getDay() + 6) % 7; doelDatum.setDate(doelDatum.getDate() - dagVanWeek + 3); const eersteJanuari = new Date(doelDatum.getFullYear(), 0, 1); return Math.ceil(((doelDatum.getTime() - eersteJanuari.getTime()) / 604800000) + 1);
};

const getWekenInJaar = (jaar) => {
    const laatste31Dec = new Date(jaar, 11, 31); const weekNummer = getWeekNummer(laatste31Dec); return weekNummer === 1 ? 52 : weekNummer;
};

const getDagenInMaand = (maand, jaar) => {
    const dagen = [];
    const laatstedag = new Date(jaar, maand + 1, 0);
    for (let dag = 1; dag <= laatstedag.getDate(); dag++) {
        dagen.push(new Date(jaar, maand, dag));
    }
    return dagen;
};

function formatteerDatum(datum) {
    return `${datum.getDate().toString().padStart(2, '0')}-${(datum.getMonth() + 1).toString().padStart(2, '0')}-${datum.getFullYear()}`;
}

const getInitialen = (naam) => {
    if (!naam) return '';
    return naam.split(' ').map(woord => woord.charAt(0).toUpperCase()).join('');
};

const getProfilePhotoUrl = (gebruiker, grootte = 'M') => {
    const loginName = gebruiker?.Username || gebruiker?.LoginName;
    if (!loginName) return '';
    
    const usernameOnly = loginName.includes('\\') ? loginName.split('\\')[1] : loginName;
    
    const siteUrl = appConfiguratie?.instellingen?.siteUrl || '';
    return `${siteUrl}/_layouts/15/userphoto.aspx?size=${grootte}&username=${usernameOnly}`;
};

const getDagenInWeek = (weekNummer, jaar) => {
    const dagen = [];
    const eersteJanuari = new Date(jaar, 0, 1);
    const eersteWeekDag = eersteJanuari.getDay();
    const eersteWeekOffset = eersteWeekDag === 0 ? 6 : eersteWeekDag - 1;
    
    const startDatum = new Date(jaar, 0, 1 - eersteWeekOffset + (weekNummer - 1) * 7);
    
    for (let i = 0; i < 7; i++) {
        const datum = new Date(startDatum);
        datum.setDate(startDatum.getDate() + i);
        dagen.push(datum);
    }
    
    return dagen;
};

/**
 * ErrorBoundary component - catches and displays React errors
 */
class ErrorBoundary extends React.Component {
    constructor(props) { 
        super(props); 
        this.state = { hasError: false, error: null }; 
    }
    
    static getDerivedStateFromError(error) { 
        return { hasError: true, error }; 
    }
    
    componentDidCatch(error, errorInfo) { 
        console.error('Error Boundary gevangen fout:', error, errorInfo); 
    }
    
    render() { 
        if (this.state.hasError) { 
            return h('div', { className: 'error-message' }, 
                h('h2', null, 'Er is een onverwachte fout opgetreden'), 
                h('p', null, 'Probeer de pagina te vernieuwen.'), 
                h('details', null, 
                    h('summary', null, 'Technische details'), 
                    h('pre', null, this.state.error?.message || 'Onbekende fout')
                )
            ); 
        } 
        return this.props.children; 
    }
}

/**
 * UserRegistrationCheck component - checks if user is registered in the system
 * @param {Function} onUserValidated - Callback when user validation is complete
 * @param {React.ReactNode} children - Child components to render
 * @returns {React.Element} User registration check component
 */
const UserRegistrationCheck = ({ onUserValidated, children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        checkUserRegistration();
    }, []);

    const checkUserRegistration = async () => {
        try {
            setIsChecking(true);

            // Get current user from SharePoint
            const user = await getCurrentUser();
            console.log('Current user from SharePoint:', user);

            if (!user) {
                throw new Error('Kan huidige gebruiker niet ophalen');
            }

            setCurrentUser(user);

            // Format the username for comparison (domain\username format)
            let userLoginName = user.LoginName;

            // Remove claim prefix if present (i:0#.w|domain\username -> domain\username)
            if (userLoginName.startsWith('i:0#.w|')) {
                userLoginName = userLoginName.substring(7);
            }

            console.log('Formatted login name for comparison:', userLoginName);

            // Fetch Medewerkers list to check if user exists
            const medewerkers = await fetchSharePointList('Medewerkers');
            console.log('Total medewerkers found:', medewerkers.length);
            console.log('Sample medewerkers data:', medewerkers.slice(0, 3).map(m => ({
                ID: m.ID,
                Username: m.Username,
                Naam: m.Naam,
                Actief: m.Actief
            })));

            // Check if user exists in Medewerkers list
            const userExists = medewerkers.some(medewerker => {
                const medewerkersUsername = medewerker.Username;

                // Skip inactive users
                if (medewerker.Actief === false) {
                    return false;
                }

                console.log(`Comparing: "${userLoginName}" with "${medewerkersUsername}"`);

                // Direct comparison
                if (medewerkersUsername === userLoginName) {
                    console.log('✓ Direct match found!');
                    return true;
                }

                // Try with just the username part (after domain\)
                const trimmedLoginName = trimLoginNaamPrefix(userLoginName);
                const trimmedMedewerkersName = trimLoginNaamPrefix(medewerkersUsername);

                if (trimmedMedewerkersName === trimmedLoginName) {
                    console.log('✓ Trimmed username match found!');
                    return true;
                }

                // Try case insensitive comparison
                if (medewerkersUsername && medewerkersUsername.toLowerCase() === userLoginName.toLowerCase()) {
                    console.log('✓ Case insensitive match found!');
                    return true;
                }

                return false;
            });

            console.log('User exists in Medewerkers list:', userExists);

            setIsRegistered(userExists);

            // Always call onUserValidated to allow the app to load
            // The overlay will handle the user not being registered
            onUserValidated(true);

        } catch (error) {
            console.error('Error checking user registration:', error);
            setIsRegistered(false);
        } finally {
            setIsChecking(false);
        }
    };

    const redirectToRegistration = () => {
        window.location.href = 'pages/instellingenCentrum/registratieCentrumN.aspx';
    };

    // Show registration overlay if user is not registered
    if (!isRegistered && !isChecking) {
        return h('div', null,
            // Show dimmed app content in background
            children,
            // Registration overlay
            h('div', {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    fontFamily: 'Inter, sans-serif'
                }
            },
                h('div', {
                    style: {
                        maxWidth: '480px',
                        width: '90%',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '32px',
                        textAlign: 'center'
                    }
                },
                    // Icon
                    h('div', {
                        style: {
                            margin: '0 auto 24px',
                            width: '64px',
                            height: '64px',
                            backgroundColor: '#fef3c7',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    },
                        h('i', {
                            className: 'fas fa-user-plus',
                            style: {
                                fontSize: '24px',
                                color: '#d97706'
                            }
                        })
                    ),
                    // Title
                    h('h2', {
                        style: {
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '12px'
                        }
                    }, 'Account Registratie Vereist'),
                    // Description
                    h('p', {
                        style: {
                            fontSize: '16px',
                            color: '#6b7280',
                            marginBottom: '24px',
                            lineHeight: '1.5'
                        }
                    }, `Hallo ${currentUser?.Title || 'gebruiker'}! Om het verlofrooster te kunnen gebruiken, moet je eerst je account registreren en instellen.`),
                    // Call to action
                    h('button', {
                        onClick: redirectToRegistration,
                        style: {
                            width: '100%',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontWeight: '500',
                            fontSize: '16px',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            marginBottom: '16px',
                            transition: 'background-color 0.2s'
                        },
                        onMouseEnter: (e) => e.target.style.backgroundColor = '#2563eb',
                        onMouseLeave: (e) => e.target.style.backgroundColor = '#3b82f6'
                    },
                        h('i', { className: 'fas fa-arrow-right', style: { marginRight: '8px' } }),
                        'Ga naar Registratie'
                    ),
                    // Secondary action
                    h('button', {
                        onClick: checkUserRegistration,
                        style: {
                            width: '100%',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            fontWeight: '500',
                            fontSize: '14px',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        },
                        onMouseEnter: (e) => e.target.style.backgroundColor = '#e5e7eb',
                        onMouseLeave: (e) => e.target.style.backgroundColor = '#f3f4f6'
                    },
                        h('i', { className: 'fas fa-sync-alt', style: { marginRight: '8px' } }),
                        'Opnieuw Controleren'
                    ),
                    // User info
                    currentUser && h('div', {
                        style: {
                            marginTop: '24px',
                            paddingTop: '16px',
                            borderTop: '1px solid #e5e7eb'
                        }
                    },
                        h('p', {
                            style: {
                                fontSize: '12px',
                                color: '#9ca3af'
                            }
                        }, `Ingelogd als: ${currentUser.LoginName}`)
                    )
                )
            )
        );
    }

    // Show loading overlay while checking
    if (isChecking) {
        return h('div', null,
            // Show dimmed app content in background
            children,
            // Loading overlay
            h('div', {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    fontFamily: 'Inter, sans-serif'
                }
            },
                h('div', {
                    style: {
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '32px',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }
                },
                    h('div', { 
                        className: 'loading-spinner', 
                        style: { margin: '0 auto 16px' } 
                    }),
                    h('h2', {
                        style: {
                            fontSize: '18px',
                            fontWeight: '500',
                            color: '#111827',
                            marginBottom: '8px'
                        }
                    }, 'Gebruiker valideren...'),
                    h('p', {
                        style: {
                            fontSize: '14px',
                            color: '#6b7280'
                        }
                    }, 'Even geduld, we controleren je toegangsrechten.')
                )
            )
        );
    }

    // User is registered, show normal app
    return children;
};

/**
 * Main RoosterApp component
 * @returns {React.Element} The main roster application
 */
const RoosterApp = () => {
    const [isUserValidated, setIsUserValidated] = useState(false);
    const [weergaveType, setWeergaveType] = useState('maand');
    const [huidigJaar, setHuidigJaar] = useState(new Date().getFullYear());
    const [huidigMaand, setHuidigMaand] = useState(new Date().getMonth());
    const [medewerkers, setMedewerkers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [shiftTypes, setShiftTypes] = useState({});
    const [verlofItems, setVerlofItems] = useState([]);
    const [feestdagen, setFeestdagen] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [huidigWeek, setHuidigWeek] = useState(getWeekNummer(new Date()));
    const [zoekTerm, setZoekTerm] = useState('');
    const [geselecteerdTeam, setGeselecteerdTeam] = useState('');
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' for A-Z, 'desc' for Z-A
    const [zittingsvrijItems, setZittingsvrijItems] = useState([]);
    const [compensatieUrenItems, setCompensatieUrenItems] = useState([]);
    const [urenPerWeekItems, setUrenPerWeekItems] = useState([]);
    const [dagenIndicators, setDagenIndicators] = useState({});
    const [contextMenu, setContextMenu] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isVerlofModalOpen, setIsVerlofModalOpen] = useState(false);
    const [isCompensatieModalOpen, setIsCompensatieModalOpen] = useState(false);
    const [isZiekModalOpen, setIsZiekModalOpen] = useState(false);
    const [isZittingsvrijModalOpen, setIsZittingsvrijModalOpen] = useState(false);

    // Debug modal state changes
    useEffect(() => {
        console.log('🏠 Modal state changed:', {
            compensatie: isCompensatieModalOpen,
            zittingsvrij: isZittingsvrijModalOpen,
            verlof: isVerlofModalOpen,
            ziek: isZiekModalOpen
        });
    }, [isCompensatieModalOpen, isZittingsvrijModalOpen, isVerlofModalOpen, isZiekModalOpen]);
    
    const [selection, setSelection] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTimeout, setTooltipTimeout] = useState(null);
    const [firstClickData, setFirstClickData] = useState(null);
   
    // Initialize the tooltip manager when the component mounts
    useEffect(() => {
        // Make sure TooltipManager is initialized
        console.log('🔍 Initializing TooltipManager from RoosterApp');
        TooltipManager.init();
    }, []);
   
    // Initialize profile cards after data is loaded
    useEffect(() => {
        if (!loading && medewerkers.length > 0) {
            setTimeout(() => {
                if (typeof ProfielKaarten !== 'undefined' && ProfielKaarten.init) {
                    ProfielKaarten.init();
                }
            }, 500);
        }
    }, [loading, medewerkers]);

    // Trigger tooltip re-attachment after data loads and DOM updates
    useEffect(() => {
        if (!loading && medewerkers.length > 0) {
            // Allow React to finish rendering before attaching tooltips
            setTimeout(() => {
                console.log('🔄 Triggering tooltip re-attachment after data load');
                TooltipManager.autoAttachTooltips();
                
                // Dispatch custom event for any components listening
                const event = new CustomEvent('react-update', {
                    detail: { 
                        verlofItems: verlofItems.length, 
                        compensatieItems: compensatieUrenItems.length,
                        zittingsvrijItems: zittingsvrijItems.length 
                    }
                });
                window.dispatchEvent(event);
            }, 200);
        }
    }, [loading, verlofItems, compensatieUrenItems, zittingsvrijItems, medewerkers, huidigMaand, huidigJaar, weergaveType]);

    // Check if required services are available
    useEffect(() => {
        if (typeof fetchSharePointList !== 'function' || typeof getCurrentUser !== 'function') {
            setError('Required services not available. Please refresh the page.');
            setLoading(false);
        }
    }, []);

    // Expose tutorial functions globally
    useEffect(() => {
        if (isUserValidated) {
            window.startTutorial = () => {
                roosterTutorial.start();
            };

            window.openHandleiding = (section = 'algemeen') => {
                openHandleiding(section);
            };

            document.addEventListener('tutorial-completed', () => {
                console.log('Tutorial completed');
            }, { once: true });

            document.addEventListener('handleiding-closed', () => {
                console.log('Handleiding closed');
            }, { once: true });

            return () => {
                delete window.startTutorial;
                delete window.openHandleiding;
            };
        }
    }, [isUserValidated]);

    // Functies voor het openen van de modals
    const handleVrijvragen = useCallback((start, end, medewerkerId) => {
        console.log('handleVrijvragen called:', { start, end, medewerkerId });
        setSelection({ start, end, medewerkerId });
        setIsVerlofModalOpen(true);
    }, []);

    const handleZiekMelden = useCallback((start, end, medewerkerId) => {
        console.log('handleZiekMelden called:', { start, end, medewerkerId });
        setSelection({ start, end, medewerkerId });
        setIsZiekModalOpen(true);
    }, []);

    const handleCompensatie = useCallback((start, end, medewerkerId) => {
        console.log('handleCompensatie called:', { start, end, medewerkerId });
        setSelection({ start, end, medewerkerId });
        setIsCompensatieModalOpen(true);
    }, []);

    const handleZittingsvrij = useCallback((start, end, medewerkerId) => {
        console.log('handleZittingsvrij called:', { start, end, medewerkerId });
        setSelection({ start, end, medewerkerId });
        setIsZittingsvrijModalOpen(true);
    }, []);

    // Calendar cell click handler with two-click selection support
    function handleCellClick(medewerker, dag, specificItem = null) {
        // If a specific item is provided (e.g., compensatie item), open the appropriate modal directly
        if (specificItem) {
            console.log('Opening modal for specific item:', specificItem);
            const { type } = (() => {
                if ('RedenId' in specificItem) return { type: 'verlof' };
                if ('ZittingsVrijeDagTijd' in specificItem) return { type: 'zittingsvrij' };
                if ('StartCompensatieUren' in specificItem) return { type: 'compensatie' };
                if ('Status' in specificItem && specificItem.Status === 'Ziek') return { type: 'ziekte' };
                return { type: null };
            })();

            const targetMedewerker = medewerkers.find(m => m.Username === medewerker.Username);

            if (type === 'compensatie') {
                setSelection({
                    start: new Date(specificItem.StartCompensatieUren),
                    end: new Date(specificItem.EindeCompensatieUren),
                    medewerkerId: specificItem.MedewerkerID,
                    itemData: specificItem,
                    medewerkerData: targetMedewerker
                });
                setIsCompensatieModalOpen(true);
                return;
            } else if (type === 'verlof') {
                setSelection({
                    start: new Date(specificItem.StartDatum),
                    end: new Date(specificItem.EindDatum),
                    medewerkerId: specificItem.MedewerkerID,
                    itemData: specificItem,
                    medewerkerData: targetMedewerker
                });
                setIsVerlofModalOpen(true);
                return;
            } else if (type === 'zittingsvrij') {
                setSelection({
                    start: new Date(specificItem.StartDatum),
                    end: new Date(specificItem.EindDatum),
                    medewerkerId: specificItem.Gebruikersnaam,
                    itemData: specificItem,
                    medewerkerData: targetMedewerker
                });
                setIsZittingsvrijModalOpen(true);
                return;
            } else if (type === 'ziekte') {
                setSelection({
                    start: new Date(specificItem.StartDatum),
                    end: new Date(specificItem.EindDatum),
                    medewerkerId: specificItem.MedewerkerID,
                    itemData: specificItem,
                    medewerkerData: targetMedewerker
                });
                setIsZiekModalOpen(true);
                return;
            }
        }

        // Normal cell click handling for date selection
        const dagKey = `${medewerker.Username}-${formatteerDatum(dag)}`;
        const huidigeTijd = Date.now();
        
        // Check if this is a double-click (within 500ms)
        if (firstClickData && 
            firstClickData.key === dagKey && 
            huidigeTijd - firstClickData.timestamp < 500) {
            
            // Double-click detected - open context menu
            console.log('Double-click detected for:', dagKey);
            setContextMenu({
                visible: true,
                x: firstClickData.x,
                y: firstClickData.y,
                targetUser: medewerker,
                targetDate: dag,
                canManage: canManageOthersEvents(currentUser, medewerker)
            });
            setFirstClickData(null);
            return;
        }

        // Single click - store click data for potential double-click
        setFirstClickData({
            key: dagKey,
            timestamp: huidigeTijd,
            x: window.event ? window.event.clientX : 0,
            y: window.event ? window.event.clientY : 0
        });

        // Clear the first click data after 500ms if no second click
        setTimeout(() => {
            setFirstClickData(prevData => {
                if (prevData && prevData.key === dagKey) {
                    return null;
                }
                return prevData;
            });
        }, 500);
    }

    // Context menu handler
    const handleContextMenu = useCallback((event, medewerker, dag) => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            targetUser: medewerker,
            targetDate: dag,
            canManage: canManageOthersEvents(currentUser, medewerker)
        });
    }, [currentUser]);

    // Close context menu
    const closeContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    // Handle context menu selections
    const handleContextMenuSelect = useCallback((action, targetUser, targetDate) => {
        const startDate = new Date(targetDate);
        const endDate = new Date(targetDate);
        
        switch (action) {
            case 'verlof':
                handleVrijvragen(startDate, endDate, targetUser.Username);
                break;
            case 'ziek':
                handleZiekMelden(startDate, endDate, targetUser.Username);
                break;
            case 'compensatie':
                handleCompensatie(startDate, endDate, targetUser.Username);
                break;
            case 'zittingsvrij':
                handleZittingsvrij(startDate, endDate, targetUser.Username);
                break;
        }
        closeContextMenu();
    }, [handleVrijvragen, handleZiekMelden, handleCompensatie, handleZittingsvrij, closeContextMenu]);

    // Load data function
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🔄 Starting data loading process...');
            
            // Get current user first
            const user = await getCurrentUser();
            setCurrentUser(user);
            console.log('👤 Current user loaded:', user?.DisplayName);
            
            // Load filtered data using LoadingLogic
            const data = await loadFilteredData();
            console.log('📊 Filtered data loaded:', {
                medewerkers: data.medewerkers?.length || 0,
                verlofItems: data.verlofItems?.length || 0,
                compensatieUrenItems: data.compensatieUrenItems?.length || 0,
                zittingsvrijItems: data.zittingsvrijItems?.length || 0
            });
            
            // Update state with loaded data
            setMedewerkers(data.medewerkers || []);
            setVerlofItems(data.verlofItems || []);
            setCompensatieUrenItems(data.compensatieUrenItems || []);
            setZittingsvrijItems(data.zittingsvrijItems || []);
            setUrenPerWeekItems(data.urenPerWeekItems || []);
            setTeams(data.teams || []);
            setShiftTypes(data.shiftTypes || {});
            
            // Load feestdagen
            const feestdagenData = getFeestdagen(huidigJaar);
            setFeestdagen(feestdagenData);
            
            console.log('✅ Data loading completed successfully');
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            setError('Er is een fout opgetreden bij het laden van de data. Probeer de pagina te verversen.');
        } finally {
            setLoading(false);
        }
    }, [huidigJaar]);

    // Load data on component mount and when dependencies change
    useEffect(() => {
        if (isUserValidated) {
            loadData();
        }
    }, [isUserValidated, loadData]);

    // Reload data when date changes
    useEffect(() => {
        if (isUserValidated && shouldReloadData(huidigJaar, huidigMaand, weergaveType)) {
            console.log('📅 Date changed, reloading data...');
            loadData();
        }
    }, [huidigJaar, huidigMaand, weergaveType, isUserValidated, loadData]);

    // Form submission handlers
    const handleVerlofSubmit = useCallback(async (formData) => {
        try {
            console.log('Submitting verlof form:', formData);
            
            const user = await getCurrentUser();
            const listItem = {
                Title: `Verlof ${formData.medewerker?.DisplayName || formData.medewerkerId}`,
                MedewerkerID: formData.medewerkerId,
                StartDatum: formData.startDate,
                EindDatum: formData.endDate,
                RedenId: formData.reason,
                Status: 'Goedgekeurd',
                AanmaakDatum: new Date().toISOString(),
                Aanmaker: user.LoginName,
                Opmerkingen: formData.notes || ''
            };

            if (formData.isEdit && selection?.itemData?.ID) {
                await updateSharePointListItem('verlofLijst', selection.itemData.ID, listItem);
                console.log('✅ Verlof item updated successfully');
            } else {
                await createSharePointListItem('verlofLijst', listItem);
                console.log('✅ Verlof item created successfully');
            }

            setIsVerlofModalOpen(false);
            setSelection(null);
            loadData(); // Reload data to show changes
        } catch (error) {
            console.error('❌ Error submitting verlof:', error);
            alert('Er is een fout opgetreden bij het opslaan van het verlof.');
        }
    }, [selection, loadData]);

    const handleCompensatieSubmit = useCallback(async (formData) => {
        try {
            console.log('Submitting compensatie form:', formData);
            
            const user = await getCurrentUser();
            const listItem = {
                Title: `Compensatie ${formData.medewerker?.DisplayName || formData.medewerkerId}`,
                MedewerkerID: formData.medewerkerId,
                StartCompensatieUren: formData.startDate,
                EindeCompensatieUren: formData.endDate,
                AantalUren: formData.hours,
                Reden: formData.reason,
                Status: 'Goedgekeurd',
                AanmaakDatum: new Date().toISOString(),
                Aanmaker: user.LoginName,
                Opmerkingen: formData.notes || ''
            };

            if (formData.isEdit && selection?.itemData?.ID) {
                await updateSharePointListItem('compensatieUren', selection.itemData.ID, listItem);
                console.log('✅ Compensatie item updated successfully');
            } else {
                await createSharePointListItem('compensatieUren', listItem);
                console.log('✅ Compensatie item created successfully');
            }

            setIsCompensatieModalOpen(false);
            setSelection(null);
            loadData(); // Reload data to show changes
        } catch (error) {
            console.error('❌ Error submitting compensatie:', error);
            alert('Er is een fout opgetreden bij het opslaan van de compensatie.');
        }
    }, [selection, loadData]);

    const handleZiekteSubmit = useCallback(async (formData) => {
        try {
            console.log('Submitting ziekte form:', formData);
            
            const user = await getCurrentUser();
            const listItem = {
                Title: `Ziekte ${formData.medewerker?.DisplayName || formData.medewerkerId}`,
                MedewerkerID: formData.medewerkerId,
                StartDatum: formData.startDate,
                EindDatum: formData.endDate,
                Status: 'Ziek',
                AanmaakDatum: new Date().toISOString(),
                Aanmaker: user.LoginName,
                Opmerkingen: formData.notes || ''
            };

            if (formData.isEdit && selection?.itemData?.ID) {
                await updateSharePointListItem('verlofLijst', selection.itemData.ID, listItem);
                console.log('✅ Ziekte item updated successfully');
            } else {
                await createSharePointListItem('verlofLijst', listItem);
                console.log('✅ Ziekte item created successfully');
            }

            setIsZiekModalOpen(false);
            setSelection(null);
            loadData(); // Reload data to show changes
        } catch (error) {
            console.error('❌ Error submitting ziekte:', error);
            alert('Er is een fout opgetreden bij het opslaan van de ziekmelding.');
        }
    }, [selection, loadData]);

    const handleZittingsvrijSubmit = useCallback(async (formData) => {
        try {
            console.log('Submitting zittingsvrij form:', formData);
            
            const user = await getCurrentUser();
            const listItem = {
                Title: `Zittingsvrij ${formData.medewerker?.DisplayName || formData.medewerkerId}`,
                Gebruikersnaam: formData.medewerkerId,
                StartDatum: formData.startDate,
                EindDatum: formData.endDate,
                ZittingsVrijeDagTijd: formData.timeSlot || 'Hele dag',
                Status: 'Goedgekeurd',
                AanmaakDatum: new Date().toISOString(),
                Aanmaker: user.LoginName,
                Opmerkingen: formData.notes || ''
            };

            if (formData.isEdit && selection?.itemData?.ID) {
                await updateSharePointListItem('zittingsvrijLijst', selection.itemData.ID, listItem);
                console.log('✅ Zittingsvrij item updated successfully');
            } else {
                await createSharePointListItem('zittingsvrijLijst', listItem);
                console.log('✅ Zittingsvrij item created successfully');
            }

            setIsZittingsvrijModalOpen(false);
            setSelection(null);
            loadData(); // Reload data to show changes
        } catch (error) {
            console.error('❌ Error submitting zittingsvrij:', error);
            alert('Er is een fout opgetreden bij het opslaan van zittingsvrij.');
        }
    }, [selection, loadData]);

    // Filter and sort functions
    const filteredMedewerkers = useMemo(() => {
        let filtered = [...medewerkers];

        // Apply search filter
        if (zoekTerm) {
            filtered = filtered.filter(medewerker =>
                medewerker.DisplayName?.toLowerCase().includes(zoekTerm.toLowerCase()) ||
                medewerker.Username?.toLowerCase().includes(zoekTerm.toLowerCase())
            );
        }

        // Apply team filter
        if (geselecteerdTeam) {
            filtered = filtered.filter(medewerker =>
                medewerker.Team === geselecteerdTeam
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const nameA = a.DisplayName?.toLowerCase() || '';
            const nameB = b.DisplayName?.toLowerCase() || '';
            
            if (sortDirection === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });

        return filtered;
    }, [medewerkers, zoekTerm, geselecteerdTeam, sortDirection]);

    // Get days for current display type
    const getCurrentDays = useMemo(() => {
        if (weergaveType === 'week') {
            return getDagenInWeek(huidigWeek, huidigJaar);
        } else {
            return getDagenInMaand(huidigMaand, huidigJaar);
        }
    }, [weergaveType, huidigWeek, huidigJaar, huidigMaand]);

    // Navigation functions
    const navigateNext = useCallback(() => {
        if (weergaveType === 'week') {
            const maxWeek = getWekenInJaar(huidigJaar);
            if (huidigWeek < maxWeek) {
                setHuidigWeek(huidigWeek + 1);
            } else {
                setHuidigJaar(huidigJaar + 1);
                setHuidigWeek(1);
            }
        } else {
            if (huidigMaand < 11) {
                setHuidigMaand(huidigMaand + 1);
            } else {
                setHuidigJaar(huidigJaar + 1);
                setHuidigMaand(0);
            }
        }
    }, [weergaveType, huidigWeek, huidigJaar, huidigMaand]);

    const navigatePrevious = useCallback(() => {
        if (weergaveType === 'week') {
            if (huidigWeek > 1) {
                setHuidigWeek(huidigWeek - 1);
            } else {
                setHuidigJaar(huidigJaar - 1);
                setHuidigWeek(getWekenInJaar(huidigJaar - 1));
            }
        } else {
            if (huidigMaand > 0) {
                setHuidigMaand(huidigMaand - 1);
            } else {
                setHuidigJaar(huidigJaar - 1);
                setHuidigMaand(11);
            }
        }
    }, [weergaveType, huidigWeek, huidigJaar, huidigMaand]);

    // Get title for current period
    const getCurrentPeriodTitle = useMemo(() => {
        if (weergaveType === 'week') {
            return `Week ${huidigWeek} - ${huidigJaar}`;
        } else {
            return `${maandNamenVolledig[huidigMaand]} ${huidigJaar}`;
        }
    }, [weergaveType, huidigWeek, huidigJaar, huidigMaand]);

    // Render table header
    const renderTableHeader = () => {
        return h('thead', null,
            h('tr', null,
                h('th', { className: 'medewerker-header' }, 'Medewerker'),
                ...getCurrentDays.map(dag => {
                    const isToday = dag.toDateString() === new Date().toDateString();
                    const isFeestdag = feestdagen[dag.toISOString().split('T')[0]];
                    const isWeekend = dag.getDay() === 0 || dag.getDay() === 6;
                    
                    return h('th', {
                        key: dag.toISOString(),
                        className: `dag-header ${isToday ? 'vandaag' : ''} ${isFeestdag ? 'feestdag' : ''} ${isWeekend ? 'weekend' : ''}`,
                        title: isFeestdag ? `Feestdag: ${isFeestdag}` : ''
                    }, 
                        h('div', { className: 'dag-header-content' },
                            h('div', { className: 'dag-naam' }, 
                                dag.toLocaleDateString('nl-NL', { weekday: 'short' })
                            ),
                            h('div', { className: 'dag-nummer' }, dag.getDate())
                        )
                    );
                })
            )
        );
    };

    // Render table body
    const renderTableBody = () => {
        return h('tbody', null,
            filteredMedewerkers.map(medewerker => {
                return h('tr', {
                    key: medewerker.Username,
                    className: 'medewerker-row'
                },
                    h('td', { className: 'medewerker-cell' },
                        h(MedewerkerRow, {
                            medewerker: medewerker,
                            photoUrl: getProfilePhotoUrl(medewerker),
                            initialen: getInitialen(medewerker.DisplayName),
                            horenStatus: getHorenStatus(medewerker.Username)
                        })
                    ),
                    ...getCurrentDays.map(dag => {
                        return h('td', {
                            key: `${medewerker.Username}-${dag.toISOString()}`,
                            className: 'dag-cell',
                            onClick: () => handleCellClick(medewerker, dag),
                            onContextMenu: (e) => handleContextMenu(e, medewerker, dag)
                        },
                            h(DagCell, {
                                medewerker: medewerker,
                                dag: dag,
                                verlofItems: verlofItems,
                                compensatieUrenItems: compensatieUrenItems,
                                zittingsvrijItems: zittingsvrijItems,
                                feestdagen: feestdagen,
                                onItemClick: (item) => handleCellClick(medewerker, dag, item)
                            })
                        );
                    })
                );
            })
        );
    };

    // Render control bar
    const renderControlBar = () => {
        return h('div', { className: 'control-bar' },
            h('div', { className: 'control-left' },
                h('button', {
                    className: 'nav-button',
                    onClick: navigatePrevious
                }, '‹'),
                h('h2', { className: 'period-title' }, getCurrentPeriodTitle),
                h('button', {
                    className: 'nav-button',
                    onClick: navigateNext
                }, '›')
            ),
            h('div', { className: 'control-center' },
                h('div', { className: 'view-toggle' },
                    h('button', {
                        className: `toggle-button ${weergaveType === 'maand' ? 'active' : ''}`,
                        onClick: () => setWeergaveType('maand')
                    }, 'Maand'),
                    h('button', {
                        className: `toggle-button ${weergaveType === 'week' ? 'active' : ''}`,
                        onClick: () => setWeergaveType('week')
                    }, 'Week')
                )
            ),
            h('div', { className: 'control-right' },
                h('input', {
                    type: 'text',
                    placeholder: 'Zoek medewerker...',
                    value: zoekTerm,
                    onChange: (e) => setZoekTerm(e.target.value),
                    className: 'search-input'
                }),
                h('select', {
                    value: geselecteerdTeam,
                    onChange: (e) => setGeselecteerdTeam(e.target.value),
                    className: 'team-select'
                },
                    h('option', { value: '' }, 'Alle teams'),
                    ...teams.map(team => 
                        h('option', { key: team, value: team }, team)
                    )
                ),
                h('button', {
                    className: 'sort-button',
                    onClick: () => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'),
                    title: sortDirection === 'asc' ? 'Sorteer Z-A' : 'Sorteer A-Z'
                }, sortDirection === 'asc' ? '↓' : '↑')
            )
        );
    };

    // Main render
    const fragmentContent = h(Fragment, null,
        // Control bar
        renderControlBar(),
        
        // Main table
        h('div', { className: 'table-container' },
            h('table', { className: 'roster-table' },
                renderTableHeader(),
                renderTableBody()
            )
        ),
        
        // Context menu
        contextMenu && h(ContextMenu, {
            visible: contextMenu.visible,
            x: contextMenu.x,
            y: contextMenu.y,
            targetUser: contextMenu.targetUser,
            targetDate: contextMenu.targetDate,
            canManage: contextMenu.canManage,
            onClose: closeContextMenu,
            onSelect: handleContextMenuSelect
        }),
        
        // Floating Action Button
        h(FAB, {
            onVerlofClick: () => setIsVerlofModalOpen(true),
            onCompensatieClick: () => setIsCompensatieModalOpen(true),
            onZiekClick: () => setIsZiekModalOpen(true),
            onZittingsvrijClick: () => setIsZittingsvrijModalOpen(true)
        }),
        
        // Modals
        isVerlofModalOpen && h(Modal, {
            isOpen: isVerlofModalOpen,
            onClose: () => setIsVerlofModalOpen(false),
            title: selection?.itemData ? 'Verlof bewerken' : 'Verlof aanvragen'
        }, h(VerlofAanvraagForm, {
            onClose: () => setIsVerlofModalOpen(false),
            onSubmit: handleVerlofSubmit,
            medewerkers: medewerkers,
            selection: selection,
            initialData: selection && selection.itemData ? selection.itemData : {}
        })),
        
        isCompensatieModalOpen && h(Modal, {
            isOpen: isCompensatieModalOpen,
            onClose: () => setIsCompensatieModalOpen(false),
            title: selection?.itemData ? 'Compensatie bewerken' : 'Compensatie aanvragen'
        }, h(CompensatieUrenForm, {
            onClose: () => setIsCompensatieModalOpen(false),
            onSubmit: handleCompensatieSubmit,
            medewerkers: medewerkers,
            selection: selection,
            initialData: selection && selection.itemData ? selection.itemData : {}
        })),
        
        isZiekModalOpen && h(Modal, {
            isOpen: isZiekModalOpen,
            onClose: () => setIsZiekModalOpen(false),
            title: selection?.itemData ? 'Ziekmelding bewerken' : 'Ziekmelding'
        }, h(ZiekteMeldingForm, {
            onClose: () => setIsZiekModalOpen(false),
            onSubmit: handleZiekteSubmit,
            medewerkers: medewerkers,
            selection: selection,
            initialData: selection && selection.itemData ? selection.itemData : {}
        })),
        
        isZittingsvrijModalOpen && h(Modal, {
            isOpen: isZittingsvrijModalOpen,
            onClose: () => setIsZittingsvrijModalOpen(false),
            title: selection?.itemData ? 'Zittingsvrij bewerken' : 'Zittingsvrij aanvragen'
        }, h(ZittingsvrijForm, {
            onClose: () => setIsZittingsvrijModalOpen(false),
            onSubmit: handleZittingsvrijSubmit,
            medewerkers: medewerkers,
            selection: selection,
            initialData: selection && selection.itemData ? selection.itemData : {}
        }))
    );

    // Wrap the entire app content with UserRegistrationCheck
    return h(UserRegistrationCheck, { 
        onUserValidated: setIsUserValidated 
    }, fragmentContent);
};

// Export the component
export default RoosterApp;
export { ErrorBoundary, UserRegistrationCheck };