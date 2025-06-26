const { createElement: h, useState, useEffect, useRef } = React;

/**
 * Een Floating Action Button (FAB) met uitklapbare opties.
 * @param {object} props
 * @param {Array<object>} props.actions - Een array van actie-objecten. Elke object moet { label: string, icon: string, onClick: function } bevatten.
 */
const FloatingActionButton = ({ actions = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const fabRef = useRef(null);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    // Sluit de FAB als er buiten geklikt wordt
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fabRef.current && !fabRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleActionClick = (action) => {
        action();
        setIsOpen(false);
    };

    return h('div', { className: 'fab-container', ref: fabRef },
        h('div', { className: `fab-actions ${isOpen ? 'visible' : ''}` },
            actions.map((action, index) =>
                h('div', {
                    key: index,
                    className: `fab-action ${isOpen ? 'visible' : ''}`,
                    onClick: () => handleActionClick(action.onClick)
                },
                    h('span', { className: 'fab-action-label' }, action.label),
                    h('button', { className: 'fab-action-button' }, h('i', { className: `fas ${action.icon}` }))
                )
            )
        ),
        h('button', {
            className: `fab-main-button ${isOpen ? 'open' : ''}`,
            onClick: toggleMenu,
            'aria-label': 'Acties openen'
        },
            h('i', { className: `fas ${isOpen ? 'fa-times' : 'fa-plus'}` })
        )
    );
};

export default FloatingActionButton;
