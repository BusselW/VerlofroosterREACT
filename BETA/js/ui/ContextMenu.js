const { createElement: h, useEffect, useRef, useState } = React;

// Import permission service for permission-based menu items
import { isUserInAnyGroup } from '../services/permissionService.js';

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

    // Filter items based on permissions
    useEffect(() => {
        const filterItems = async (itemsToFilter) => {
            console.log('ContextMenu filtering items:', itemsToFilter);
            const filtered = [];
            
            for (const item of itemsToFilter) {
                let  shouldInclude = true;
                
                // Check permissions for this item
                if (item.requiredGroups && item.requiredGroups.length > 0) {
                    try {
                        shouldInclude = await isUserInAnyGroup(item.requiredGroups);
                        console.log(`Permission check for "${item.label}":`, shouldInclude, 'groups:', item.requiredGroups);
                    } catch (error) {
                        console.warn(`Could not check permissions for menu item ${item.label}:`, error);
                        // For now, show the item if permission check fails, except for sensitive operations
                        shouldInclude = !item.label.includes('Zittingsvrij');
                    }
                } else {
                    console.log(`No permission check needed for "${item.label}"`);
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

                return h('li', {
                    key: index,
                    className: `context-menu-item ${hasSubItems ? 'has-submenu' : ''} ${isSubMenuOpen ? 'submenu-open' : ''}`,
                    onClick: (e) => handleItemClick(e, item),
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

    // Don't render if permissions are still loading
    if (!permissionsLoaded) {
        return null;
    }

    // Don't render if no items are available after filtering
    if (filteredItems.length === 0) {
        return null;
    }

    return h('div', {
        ref: menuRef,
        className: 'context-menu-container',
        style: { top: y, left: x },
        onMouseLeave: () => setActiveSubMenu(null) // Close submenus when leaving the whole menu
    },
        renderMenuItems(filteredItems)
    );
};

export default ContextMenu;