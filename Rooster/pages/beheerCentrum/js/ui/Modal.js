const { createElement: h } = React;

/**
 * A reusable Modal component.
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   children: React.ReactNode;
 * }} props
 */
export const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    return h('div', { className: 'modal-overlay', onClick: onClose },
        h('div', { className: 'modal-content', onClick: e => e.stopPropagation() },
            children
        )
    );
};
