const { createElement: h } = React;

/**
 * A reusable Modal component.
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   title?: string;
 *   children: React.ReactNode;
 *   footer?: React.ReactNode;
 * }} props
 */
export const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) {
        return null;
    }

    // Stop propagation to prevent closing when clicking inside modal
    const handleModalClick = (e) => e.stopPropagation();

    return h('div', { className: 'modal-overlay', onClick: onClose },
        h('div', { className: 'modal', onClick: handleModalClick },
            title && h('div', { className: 'modal-header' },
                h('h2', null, title),
                h('button', { 
                    className: 'modal-close', 
                    onClick: onClose, 
                    'aria-label': 'Sluiten' 
                }, '×')
            ),
            h('div', { className: 'modal-body' }, children),
            footer && h('div', { className: 'modal-footer' }, footer)
        )
    );
};