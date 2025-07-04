const { createElement: h, useEffect, useRef, useState, useLayoutEffect } = React;

// Import permission service for permission-based menu items
import { isUserInAnyGroup } from '../services/permissionService.js';

/**
 * Utility function to check if user can manage events for others
 * This mirrors the same function from k.aspx
 */
const canManageOthersEvents = async () => {
    const privilegedGroups = [
        "1.1. Sharepoint beheer",
        "1.1. Mulder MT",
        "2.6 Roosteraars",
        "2.3. Senioren beoordelen"
    ];

    try {
        return await isUserInAnyGroup(privilegedGroups);
    } catch (error) {
        console.error('Error checking user permissions for managing others events:', error);
        return false;
    }
};

/**
 * Check if user can edit/delete a specific item
 * @param {object} item - The item to check permissions for
 * @param {string} currentUsername - The current user's username
 * @returns {Promise<boolean>} - True if user can edit/delete the item
 */
const canUserModifyItem = async (item, currentUsername) => {
    if (!item || !currentUsername) return false;
    
    // Check if user has privileged access (can modify any item)
    const hasPrivilegedAccess = await canManageOthersEvents();
    if (hasPrivilegedAccess) return true;
    
    // Check if it's the user's own item
    const itemOwner = item.MedewerkerID || item.Gebruikersnaam;
    return itemOwner === currentUsername;
};

/**
 * Een herbruikbaar Context Menu component.
 * Dit component rendert een contextmenu op de opgegeven coördinaten.
 * Het sluit automatisch wanneer er buiten het menu wordt geklikt.
 * @param {object} props
 * @param {number} props.x - X-coördinaat voor positionering.
 * @param {number} props.y - Y-coördinaat voor positionering.
 * @param {function} props.onClose - Functie om het menu te sluiten.
 * @param {Array<object>} props.items - Array van menu-items. Elk item: { label: string, onClick?: function, subItems?: Array<object>, icon?: string, requiredGroups?: Array<string> }.
 */
const ContextMenu = ({ x, y, onClose, items = [] }) => {
    const menuRef = useRef(null);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);
    const [adjustedPosition, setAdjustedPosition] = useState({ x, y });

    // Filter items based on permissions
    useEffect(() => {
        const filterItems = async (itemsToFilter) => {
            console.log('ContextMenu filtering items:', itemsToFilter);
            const filtered = [];
            
            for (const item of itemsToFilter) {
                let shouldInclude = true;
                
                // Check permissions for this item
                if (item.requiredGroups && item.requiredGroups.length > 0) {
                    try {
                        shouldInclude = await isUserInAnyGroup(item.requiredGroups);
                        console.log(`Permission check for "${item.label}":`, shouldInclude, 'groups:', item.requiredGroups);
                    } catch (error) {
                        console.warn(`Could not check permissions for menu item ${item.label}:`, error);
                        // For now, show the item if permission check fails, except for sensitive operations
                        shouldInclude = true; // Always show Zittingsvrij for everyone
                    }
                } else {
                    // Only log for items that might need permission checks but don't have requiredGroups set
                    if (['Bewerken', 'Verwijderen', 'Commentaar aanpassen'].includes(item.label)) {
                        console.log(`"${item.label}" - permissions already checked in parent component`);
                    } else {
                        console.log(`No permission check needed for "${item.label}"`);
                    }
                }
                
                if (shouldInclude) {
                    const filteredItem = { ...item };
                    
                    // Recursively filter sub-items if they exist
                    if (item.subItems && item.subItems.length > 0) {
                        filteredItem.subItems = await filterItems(item.subItems);
                        // Only include parent if it has visible sub-items or its own action
                        if (filteredItem.subItems.length > 0 || item.onClick) {
                            filtered.push(filteredItem);
                        }
                    } else {
                        filtered.push(filteredItem);
                    }
                }
            }
            
            console.log('ContextMenu filtered result:', filtered);
            return filtered;
        };

        if (items.length > 0) {
            filterItems(items).then(filtered => {
                setFilteredItems(filtered);
                setPermissionsLoaded(true);
            });
        } else {
            setFilteredItems([]);
            setPermissionsLoaded(true);
        }
    }, [items]);

    // Handle clicks outside the menu to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
    
    // Handle submenu position adjustments when they open
    useEffect(() => {
        if (activeSubMenu) {
            // Give a moment for the submenu to render
            setTimeout(() => {
                const submenuItems = document.querySelectorAll('.submenu');
                
                submenuItems.forEach(submenu => {
                    const rect = submenu.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    
                    // Check if submenu goes off right edge
                    if (rect.right > viewportWidth) {
                        submenu.classList.add('submenu-rtl');
                    }
                    
                    // Check if submenu goes off bottom edge
                    if (rect.bottom > viewportHeight) {
                        const adjustedTop = Math.max(-4, viewportHeight - rect.height - submenu.parentElement.getBoundingClientRect().top);
                        submenu.style.top = `${adjustedTop}px`;
                    }
                });
            }, 10);
        }
    }, [activeSubMenu]);
    
    // Adjust position when menu renders or changes size
    useLayoutEffect(() => {
        if (menuRef.current && permissionsLoaded && filteredItems.length > 0) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let adjustedX = x;
            let adjustedY = y;
            
            // Get whether the menu is flipped vertically (opening upward)
            const isFlippedVertical = menuRef.current.classList.contains('context-menu-flip-vertical');
            
            // Check if menu extends beyond right edge
            if (x + menuRect.width > viewportWidth) {
                adjustedX = Math.max(10, viewportWidth - menuRect.width - 10); // 10px padding
            }
            
            // Check if menu extends beyond bottom edge
            if (y + menuRect.height > viewportHeight && !isFlippedVertical) {
                // If there's not enough space to flip upward, adjust the Y position
                adjustedY = Math.max(10, viewportHeight - menuRect.height - 10); // 10px padding
            }
            
            // Ensure menu doesn't go off the left or top edge
            adjustedX = Math.max(10, adjustedX);
            adjustedY = Math.max(10, adjustedY);
            
            if (adjustedX !== adjustedPosition.x || adjustedY !== adjustedPosition.y) {
                setAdjustedPosition({ x: adjustedX, y: adjustedY });
            }
        }
    }, [x, y, permissionsLoaded, filteredItems, adjustedPosition.x, adjustedPosition.y]);

    // Add class to the context menu container if it should open upwards
    useLayoutEffect(() => {
        if (menuRef.current && permissionsLoaded && filteredItems.length > 0) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // If the menu would extend beyond the bottom edge, add a class to flip it
            // This makes the menu open upward when it would otherwise go off the bottom of the screen
            // Only flip if there's enough space above (menu height < current Y position)
            if (y + menuRect.height > viewportHeight && y > menuRect.height) {
                menuRef.current.classList.add('context-menu-flip-vertical');
                // Adjust the transform origin for smooth animation
                menuRef.current.style.transformOrigin = 'bottom center';
            } else {
                menuRef.current.classList.remove('context-menu-flip-vertical');
                menuRef.current.style.transformOrigin = 'top center';
            }
        }
    }, [y, permissionsLoaded, filteredItems]);
    
    const handleItemClick = (e, item) => {
        e.stopPropagation();
        console.log('Context menu item clicked:', item.label, item);
        
        if (item.subItems && item.subItems.length > 0) {
            setActiveSubMenu(activeSubMenu === item.label ? null : item.label);
        } else {
            if (item.onClick) {
                try {
                    item.onClick();
                } catch (error) {
                    console.error('Error executing menu item onClick:', error);
                }
            }
            onClose(); // Close menu on final selection
        }
    };

    const renderMenuItems = (menuItems, isSubMenu = false) => {
        return h('ul', { className: isSubMenu ? 'submenu-list' : 'context-menu-list' },
            menuItems.map((item, index) => {
                const isSubMenuOpen = activeSubMenu === item.label;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                
                // Function to check submenu position
                const checkSubmenuPosition = (e) => {
                    if (hasSubItems) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;
                        
                        // Check if submenu would go off right edge
                        const shouldOpenLeft = rect.right + 200 > viewportWidth; // 200px is min-width of submenu
                        
                        const submenu = e.currentTarget.querySelector('.submenu');
                        if (submenu) {
                            // Apply horizontal positioning
                            if (shouldOpenLeft) {
                                submenu.classList.add('submenu-rtl');
                            } else {
                                submenu.classList.remove('submenu-rtl');
                            }
                            
                            // Get submenu dimensions
                            const submenuRect = submenu.getBoundingClientRect();
                            
                            // Check if submenu would go off bottom edge
                            if (rect.top + submenuRect.height > viewportHeight) {
                                // Position from bottom instead of top
                                const bottomOffset = Math.max(0, viewportHeight - rect.bottom);
                                submenu.style.top = 'auto';
                                submenu.style.bottom = `${bottomOffset}px`;
                            } else {
                                // Reset to default top positioning
                                submenu.style.top = '-4px';
                                submenu.style.bottom = 'auto';
                            }
                        }
                    }
                };

                return h('li', {
                    key: index,
                    className: `context-menu-item ${hasSubItems ? 'has-submenu' : ''} ${isSubMenuOpen ? 'submenu-open' : ''}`,
                    onClick: (e) => handleItemClick(e, item),
                    onMouseEnter: checkSubmenuPosition
                },
                    // Icon if provided
                    item.icon && (
                        item.iconType === 'svg' 
                            ? h('img', { 
                                src: item.icon, 
                                className: 'menu-icon menu-icon-svg',
                                alt: item.label,
                                style: { width: '16px', height: '16px' }
                              })
                            : h('i', { className: `fas ${item.icon} menu-icon` })
                    ),
                    // Label
                    h('span', { className: 'menu-label' }, item.label),
                    // Submenu arrow if has subitems
                    hasSubItems && h('i', { className: 'fas fa-chevron-right submenu-arrow' }),
                    // Submenu items
                    hasSubItems && isSubMenuOpen && h('div', { className: 'submenu' }, renderMenuItems(item.subItems, true))
                );
            })
        );
    };

    // Don't render if permissions are still loading or no items available
    if (!permissionsLoaded || filteredItems.length === 0) {
        return null;
    }

    return h('div', {
        ref: menuRef,
        className: 'context-menu-container',
        style: { top: adjustedPosition.y, left: adjustedPosition.x },
        onMouseLeave: () => setActiveSubMenu(null) // Close submenus when leaving the whole menu
    },
        renderMenuItems(filteredItems)
    );
};

export default ContextMenu;

// Export the permission utility functions for use in other components
export { canManageOthersEvents, canUserModifyItem };