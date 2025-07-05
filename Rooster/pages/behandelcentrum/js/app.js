import { sharepointService } from './sharepoint-service.js';

const h = (tag, props, ...children) => {
    const el = document.createElement(tag);
    if (props) {
        for (const key in props) {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                el.addEventListener(key.substring(2).toLowerCase(), props[key]);
            } else {
                el.setAttribute(key, props[key]);
            }
        }
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
            el.appendChild(child);
        }
    });
    return el;
};

class BehandelcentrumApp {
    constructor() {
        this.root = document.getElementById('behandelcentrum-root');
        this.verlofAanvragen = [];
        this.compensatieAanvragen = [];
    }

    async init() {
        await sharepointService.initialize();
        const currentUser = await sharepointService.getCurrentUser();
        if (currentUser) {
            document.getElementById('huidige-gebruiker').textContent = currentUser.Title;
        }
        document.getElementById('verbinding-status').textContent = 'Verbonden';
        document.getElementById('huidig-jaar').textContent = new Date().getFullYear();

        await this.loadData();
        this.render();
    }

    async loadData() {
        this.verlofAanvragen = await sharepointService.getListItems('Verlof');
        this.compensatieAanvragen = await sharepointService.getListItems('CompensatieUren');
    }

    render() {
        this.root.innerHTML = '';
        const app = h('div', { class: 'behandelcentrum-app' },
            h('h2', null, 'Verlof Aanvragen'),
            this.renderTable(this.verlofAanvragen, ['Medewerker', 'StartDatum', 'EindDatum', 'Status']),
            h('h2', null, 'Compensatie Uren Aanvragen'),
            this.renderTable(this.compensatieAanvragen, ['Medewerker', 'StartCompensatieUren', 'EindeCompensatieUren', 'Status'])
        );
        this.root.appendChild(app);
    }

    renderTable(items, columns) {
        return h('table', { class: 'data-tabel' },
            h('thead', null,
                h('tr', null, ...columns.map(col => h('th', null, col)))
            ),
            h('tbody', null,
                ...items.map(item =>
                    h('tr', null,
                        ...columns.map(col => h('td', null, item[col] ? item[col].toString() : '-'))
                    )
                )
            )
        );
    }
}

const app = new BehandelcentrumApp();
app.init();
