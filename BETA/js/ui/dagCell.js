const { createElement: h, Fragment } = React;

/**
 * Utility function to render compensatie moments that can be shared
 * between DagCell component and inline table logic
 */
const renderCompensatieMomenten = (compensatieMomenten) => {
    return compensatieMomenten.map((moment) => {
        let iconSrc = '';
        let title = moment.item.Omschrijving || '';
        let className = 'compensatie-uur-blok';
        let linkId = `comp-${moment.item.ID}`;

        switch (moment.type) {
            case 'compensatie':
                iconSrc = './icons/compensatieuren/neutraleuren.svg';
                title = `Compensatie: ${title}`;
                className += ' compensatie-neutraal';
                break;
            case 'ruildag-gewerkt':
                iconSrc = './icons/compensatieuren/Plusuren.svg';
                const ruildagDatum = moment.item.ruildagStart ? moment.item.ruildagStart.toLocaleDateString('nl-NL') : 'onbekend';
                title = `Gewerkte dag (geruild met ${ruildagDatum}). ${title}`;
                className += ' ruildag-plus';
                linkId = `ruildag-${moment.item.ID}`;
                break;
            case 'ruildag-vrij':
                iconSrc = './icons/compensatieuren/Minuren.svg';
                const gewerkteDatum = moment.item.StartCompensatieUren.toLocaleDateString('nl-NL');
                title = `Vrije dag (gewerkt op ${gewerkteDatum}). ${title}`;
                className += ' ruildag-min';
                linkId = `ruildag-${moment.item.ID}`;
                break;
        }

        return h('div', {
            key: `${moment.item.ID}-${moment.type}`,
            className: 'compensatie-uur-container',
        }, h('div', {
            className: className,
            title: title.trim(),
            'data-link-id': linkId
        }, h('img', { src: iconSrc, className: 'compensatie-icon-svg', alt: moment.type })));
    });
};

/**
 * Component voor een enkele dag-cel in het rooster.
 * @param {object} props
 * @param {Date} props.dag - De datum van de cel.
 * @param {object} props.medewerker - De medewerker voor deze rij.
 * @param {function} props.onContextMenu - Functie die wordt aangeroepen bij een rechtermuisklik.
 * @param {function} props.getVerlofVoorDag - Functie om verlof op te halen.
 * @param {function} props.getZittingsvrijVoorDag - Functie om zittingsvrij op te halen.
 * @param {function} props.getCompensatieUrenVoorDag - Functie om compensatie-uren op te halen.
 * @param {object} props.shiftTypes - Beschikbare shift types.
 * @param {function} props.onCellClick - Functie voor cel klik.
 */
const DagCell = ({ dag, medewerker, onContextMenu, getVerlofVoorDag, getZittingsvrijVoorDag, getCompensatieUrenVoorDag, shiftTypes, onCellClick }) => {
    const verlofItem = getVerlofVoorDag(medewerker.Username, dag);
    const zittingsvrijItem = getZittingsvrijVoorDag(medewerker.Username, dag);
    const compensatieUrenVoorDag = getCompensatieUrenVoorDag(medewerker.Username, dag);

    // Check if the day is a weekend or holiday
    const isWeekend = dag.isWeekend || dag.getDay() === 0 || dag.getDay() === 6;
    const isFeestdag = dag.isFeestdag || false;

    // Handle click for opening the appropriate modal
    const handleClick = () => {
        if (onCellClick) {
            // Determine which item to edit (prioritize verlof > zittingsvrij > compensatie)
            const itemToEdit = verlofItem || zittingsvrijItem || 
                (compensatieUrenVoorDag.length > 0 ? compensatieUrenVoorDag[0] : null);
            onCellClick(medewerker, dag, itemToEdit);
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        onContextMenu(e, {
            medewerker,
            dag,
            datum: dag, // Include datum for consistency
            verlofItem,
            zittingsvrijItem,
            compensatieUren: compensatieUrenVoorDag // Use same property name as MedewerkerRow
        });
    };

    const renderVerlofBlok = (verlof) => {
        const verlofReden = shiftTypes[verlof.VerlofRedenId];
        const backgroundColor = verlofReden?.kleur || verlof.shiftType?.Kleur || '#4a90e2';
        const label = verlofReden?.label || verlof.shiftType?.Titel || 'Verlof';
        const afkorting = verlofReden?.afkorting || verlof.shiftType?.AfkortingTitel || 'V';
        const startDatum = new Date(verlof.StartDatum).toLocaleDateString();
        const eindDatum = new Date(verlof.EindDatum).toLocaleDateString();
        const status = verlof.Status?.toLowerCase() || 'nieuw';
        
        // CSS classes for proper styling
        const className = [
            'verlof-blok',
            `status-${status}`,
            verlof.isStartBlok ? 'start-blok' : '',
            verlof.isEindBlok ? 'eind-blok' : ''
        ].filter(Boolean).join(' ');
        
        return h('div', {
            className,
            style: { backgroundColor },
            title: `${label}: ${startDatum} t/m ${eindDatum} (${verlof.Status})`
        }, verlof.isStartBlok ? afkorting : '');
    };

    const renderZittingsvrijBlok = (zittingsvrij) => {
        // Use a standard color for zittingsvrij indicators with proper styling
        return h('div', {
            className: 'dag-indicator-blok zittingsvrij',
            style: { backgroundColor: '#8e44ad' }, // Consistent purple color for zittingsvrij
            title: `Zittingsvrij: ${zittingsvrij.Opmerking || ''}${zittingsvrij.Datum ? ` (${zittingsvrij.Datum})` : ''}`
        }, 'ZV');
    };

    return h('td', {
        className: `dag-cel ${isWeekend ? 'weekend' : ''} ${isFeestdag ? 'feestdag' : ''}`,
        onContextMenu: handleContextMenu,
        onClick: onCellClick && (() => {
            const itemToEdit = verlofItem || zittingsvrijItem || 
                (compensatieUrenVoorDag.length > 0 ? compensatieUrenVoorDag[0] : null);
            onCellClick(medewerker, dag, itemToEdit);
        })
    },
        verlofItem && renderVerlofBlok(verlofItem),
        zittingsvrijItem && renderZittingsvrijBlok(zittingsvrijItem),
        // Convert compensatieUrenVoorDag to the format expected by renderCompensatieMomenten
        compensatieUrenVoorDag.length > 0 && (() => {
            const compensatieMomenten = compensatieUrenVoorDag.map(comp => {
                const isRuildag = comp.Ruildag || comp.IsRuildag || false;
                const uren = parseFloat(comp.Uren || comp.AantalUren || comp.UrenTotaal || 0);
                
                let type = 'compensatie';
                if (isRuildag) {
                    type = uren > 0 ? 'ruildag-gewerkt' : 'ruildag-vrij';
                }
                
                return { type, item: comp };
            });
            
            return renderCompensatieMomenten(compensatieMomenten);
        })()
    );
};

export default DagCell;
export { renderCompensatieMomenten };
