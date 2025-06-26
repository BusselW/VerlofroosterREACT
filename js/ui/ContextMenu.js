const { createElement: h, useEffect, useRef, useState } = React;

/**
 * Een herbruikbaar Context Menu component.
 * Dit component rendert een contextmenu op de opgegeven coördinaten.
 * Het sluit automatisch wanneer er buiten het menu wordt geklikt.
 * @param {object} props
 * @param {number} props.x - X-coördinaat voor positionering.
 * @param {number} props.y - Y-coördinaat voor positionering.
 * @param {function} props.onClose - Functie om het menu te sluiten.
 * @param {Array<object>} props.items - Array van menu-items. Elk item: { label: string, onClick?: function, subItems?: Array<object> }.
 */
const ContextMenu = ({ x, y, onClose, items = [] }) => {
    const menuRef = useRef(null);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

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
        if (item.subItems) {
            setActiveSubMenu(activeSubMenu === item.label ? null : item.label);
        } else {
            if (item.onClick) {
                item.onClick();
            }
            onClose(); // Close menu on final selection
        }
    };

    const renderMenuItems = (menuItems, isSubMenu = false) => {
        return h('ul', { className: isSubMenu ? 'submenu-list' : 'context-menu-list' },
            menuItems.map((item, index) => {
                const isSubMenuOpen = activeSubMenu === item.label;

                return h('li', {
                    key: index,
                    className: `context-menu-item ${item.subItems ? 'has-submenu' : ''} ${isSubMenuOpen ? 'submenu-open' : ''}`,
                    onClick: (e) => handleItemClick(e, item),
                },
                    item.label,
                    item.subItems && h('span', { className: 'submenu-arrow' }, '►'),
                    item.subItems && isSubMenuOpen && h('div', { className: 'submenu' }, renderMenuItems(item.subItems, true))
                );
            })
        );
    };

    return h('div', {
        ref: menuRef,
        className: 'context-menu-container',
        style: { top: y, left: x },
        onMouseLeave: () => setActiveSubMenu(null) // Close submenus when leaving the whole menu
    },
        renderMenuItems(items)
    );
};

export default ContextMenu;