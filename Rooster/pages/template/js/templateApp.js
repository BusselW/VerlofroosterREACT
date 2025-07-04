const { useState, useEffect, createElement: h } = React;

// --- Components ---

const PageBanner = () => {
    return h('div', { id: 'page-banner', className: 'page-banner' },
        h('div', { className: 'banner-content' },
            h('div', { className: 'banner-left' },
                h('h1', { className: 'banner-title' }, 'Pagina Titel'),
                h('p', { className: 'banner-subtitle' }, 'Plaats hier een subtitel of beschrijving.')
            ),
            h('div', { className: 'banner-right' },
                h('a', { href: '../../verlofRooster.aspx', className: 'btn-back' },
                    h('svg', { className: 'icon-small', fill: 'currentColor', viewBox: '0 0 20 20', width: '16', height: '16' },
                        h('path', { 'fillRule': 'evenodd', d: 'M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z', 'clipRule': 'evenodd' })
                    ),
                    h('span', null, 'Terug naar rooster')
                ),
                h('div', { className: 'user-details' },
                    h('div', { className: 'user-info' }, 'Bussel, W. van'), // Hardcoded for now
                    h('div', { className: 'connection-status' }, 'Verbonden met: https://som.org.om')
                )
            )
        )
    );
};

const ContentContainer = () => {
    return h('div', { className: 'content-container' },
        h('div', { className: 'section-placeholder' },
            h('h2', null, 'Content Module'),
            h('p', null, 'Module content komt hier.')
        )
    );
};

const PageFooter = () => {
    return h('footer', { className: 'page-footer', id: 'pagina-footer' },
        h('p', { className: 'footer-text' }, '© 2025 Verlofrooster Applicatie')
    );
};

// --- Main App Component ---

const TemplateApp = () => {
    return h('div', { id: 'app-container', className: 'app-container' },
        h(PageBanner),
        h(ContentContainer),
        h(PageFooter)
    );
};

// --- Render the App ---

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(TemplateApp));
