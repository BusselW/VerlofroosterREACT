const UI = {
    toonLoading: (toon, bericht = "Laden...") => {
        const loadingElement = document.getElementById('globale-loading');
        const berichtElement = document.getElementById('loading-bericht');
        if (toon) {
            berichtElement.textContent = bericht;
            loadingElement.classList.remove('hidden');
        } else {
            loadingElement.classList.add('hidden');
        }
    },

    toonNotificatie: (bericht, type = "info") => {
        const notificatieElement = document.getElementById('globale-notificatie');
        const berichtElement = document.getElementById('notificatie-bericht');
        berichtElement.textContent = bericht;

        notificatieElement.className = 'fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white z-50';

        switch (type) {
            case 'success':
                notificatieElement.classList.add('bg-green-600');
                break;
            case 'error':
                notificatieElement.classList.add('bg-red-600');
                break;
            case 'warning':
                notificatieElement.classList.add('bg-yellow-600');
                break;
            default:
                notificatieElement.classList.add('bg-blue-600');
        }

        notificatieElement.classList.remove('hidden');
        setTimeout(() => notificatieElement.classList.add('hidden'), 5000);
    },

    formateerDatum: (datumString) => {
        if (!datumString) return '-';
        try {
            const datum = new Date(datumString);
            return datum.toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch {
            return '-';
        }
    },

    formateerDatumTijd: (datumString) => {
        if (!datumString) return '-';
        try {
            const datum = new Date(datumString);
            return datum.toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '-';
        }
    },

    formateerStatus: (status) => {
        if (!status) return '<span class="status-badge status-nieuw">Onbekend</span>';
        const statusLower = status.toLowerCase();
        const statusClass = `status-${statusLower}`;
        return `<span class="status-badge ${statusClass}">${status}</span>`;
    },

    krijgTypeBadge: (type) => {
        const typeClasses = {
            'Verlof': 'type-verlof',
            'CompensatieUren': 'type-compensatie'
        };
        const typeLabels = {
            'Verlof': 'Verlof',
            'CompensatieUren': 'Compensatie'
        };

        const className = typeClasses[type] || 'type-verlof';
        const label = typeLabels[type] || type;

        return `<span class="type-badge ${className}">${label}</span>`;
    }
};
