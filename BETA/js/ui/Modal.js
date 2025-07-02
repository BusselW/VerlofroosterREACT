const { createElement: h } = React;

/**
 * Een generieke, herbruikbare Modal component.
 * @param {object} props
 * @param {boolean} props.isOpen - Bepaalt of de modal zichtbaar is.
 * @param {function} props.onClose - Functie die wordt aangeroepen als de modal gesloten moet worden.
 * @param {string} props.title - De titel die in de header van de modal wordt getoond.
 * @param {React.ReactNode} props.children - De content die in de body van de modal wordt getoond (meestal een formulier).
 * @param {React.ReactNode} [props.footer] - Optionele content voor de footer (meestal knoppen).
 */
const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) {
        return null;
    }

    // Stop propagatie om te voorkomen dat een klik in de modal de overlay-klik activeert.
    const handleModalClick = (e) => e.stopPropagation();

    return h('div', { className: 'modal-overlay', onClick: onClose },
        h('div', { className: 'modal', onClick: handleModalClick },
            h('div', { className: 'modal-header' },
                h('h2', null, title),
                h('button', { className: 'modal-close', onClick: onClose, 'aria-label': 'Sluiten' }, '×')
            ),
            h('div', { className: 'modal-body' }, children),
            footer && h('div', { className: 'modal-footer' }, footer)
        )
    );
};

export default Modal;
