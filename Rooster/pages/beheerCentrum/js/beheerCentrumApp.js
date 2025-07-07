import { beheerTabs } from './dataTabs.js';
import { getListItems, createListItem, updateListItem, deleteListItem } from './dataService.js';
import { initializeSharePointContext } from './sharepointContext.js';
import { Modal } from './ui/Modal.js';
import { GenericForm } from './forms/GenericForm.js';

const { useState, useEffect, createElement: h, useCallback } = React;

// --- Components ---

const PageBanner = () => {
    return h('div', { id: 'page-banner', className: 'page-banner' },
        h('div', { className: 'banner-content' },
            h('div', { className: 'banner-left' },
                h('h1', { className: 'banner-title' }, 'Verlofrooster Beheercentrum'),
                h('p', { className: 'banner-subtitle' }, 'Beheer medewerkers, teams, verlofredenen en andere kerngegevens')
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

// Utility function to format dates
const formatValue = (value, column) => {
    if (!value) return '';
    
    // Handle date formatting
    if (column.type === 'date' || column.accessor.toLowerCase().includes('datum') || column.accessor.toLowerCase().includes('date')) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('nl-NL', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
        }
    }
    
    // Handle datetime formatting
    if (column.type === 'datetime' || column.accessor.toLowerCase().includes('tijdstip')) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('nl-NL', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
        return h('span', { className: `boolean-indicator ${value ? 'true' : 'false'}` }, 
            value ? 'Ja' : 'Nee'
        );
    }
    
    // Handle color values
    if (column.type === 'color' || column.accessor.toLowerCase().includes('kleur')) {
        return h('div', { className: 'color-display' },
            h('span', { className: 'color-swatch', style: { backgroundColor: value } }),
            h('span', { className: 'color-value' }, value)
        );
    }
    
    return value;
};

const DataTable = ({ columns, data, onEdit, onDelete }) => {
    // Filter out any undefined or empty rows
    const filteredData = data.filter(row => row && Object.keys(row).length > 0);
    
    return h('div', { className: 'table-container' },
        h('table', { className: 'data-table' },
            h('thead',
                null,
                h('tr', null, columns.map(col => h('th', { key: col.accessor }, col.Header)))
            ),
            h('tbody',
                null,
                filteredData.length === 0 ? 
                    h('tr', null, h('td', { colSpan: columns.length, style: { textAlign: 'center', padding: '20px' } }, 'Geen data beschikbaar')) :
                    filteredData.map((row, index) => h('tr', { key: row.Id || index },
                        columns.map(col => {
                            if (col.isAction) {
                                // Render action buttons
                                return h('td', { key: col.accessor, className: 'actions-cell' },
                                    h('div', { className: 'action-buttons' },
                                        h('button', { 
                                            className: 'btn-action btn-edit',
                                            onClick: () => onEdit && onEdit(row),
                                            title: 'Bewerken'
                                        }, 
                                            h('svg', { width: '16', height: '16', fill: 'currentColor', viewBox: '0 0 20 20' },
                                                h('path', { d: 'M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' })
                                            )
                                        ),
                                        h('button', { 
                                            className: 'btn-action btn-delete',
                                            onClick: () => onDelete && onDelete(row),
                                            title: 'Verwijderen'
                                        }, 
                                            h('svg', { width: '16', height: '16', fill: 'currentColor', viewBox: '0 0 20 20' },
                                                h('path', { fillRule: 'evenodd', d: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z', clipRule: 'evenodd' })
                                            )
                                        )
                                    )
                                );
                            } else {
                                // Render data cell with proper formatting
                                const value = row[col.accessor];
                                const formattedValue = formatValue(value, col);
                                return h('td', { key: col.accessor }, formattedValue);
                            }
                        })
                    ))
            )
        )
    );
};

const TabContent = ({ tab, data, loading, error, onAddNew, onEdit, onDelete }) => {
    if (loading) {
        return h('div', { className: 'loading-spinner' }, 'Laden...');
    }

    if (error) {
        return h('div', { className: 'error-message' }, `Fout bij laden: ${error.message}`);
    }

    return h('div', { className: 'tab-content active' },
        h('div', { className: 'tab-actions' },
            h('button', { 
                className: 'btn-primary',
                onClick: onAddNew
            }, `Nieuwe ${tab.label} toevoegen`)
        ),
        h(DataTable, { 
            columns: tab.columns, 
            data,
            onEdit,
            onDelete
        })
    );
};

const ContentContainer = () => {
    const [activeTabId, setActiveTabId] = useState(beheerTabs[0].id);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contextInitialized, setContextInitialized] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const activeTab = beheerTabs.find(tab => tab.id === activeTabId);

    useEffect(() => {
        const initContext = async () => {
            try {
                await initializeSharePointContext();
                setContextInitialized(true);
            } catch (err) {
                console.error("Failed to initialize SharePoint context:", err);
                setError(err);
            }
        };
        initContext();
    }, []); // Empty dependency array ensures this runs only once

    const fetchData = useCallback(async () => {
        if (!activeTab || !contextInitialized) return;

        setLoading(true);
        setError(null);
        try {
            const listName = activeTab.listConfig.lijstTitel;
            // Fetch all fields defined in the config
            const selectFields = activeTab.listConfig.velden.map(f => f.interneNaam).join(',');
            const items = await getListItems(listName, selectFields);
            setData(items);
        } catch (err) {
            setError(err);
            console.error(`Fout bij ophalen van data voor ${activeTab.label}:`, err);
        }
        setLoading(false);
    }, [activeTab, contextInitialized]);

    useEffect(() => {
        fetchData();
    }, [activeTabId, contextInitialized, fetchData]);

    const handleAddNew = () => {
        setEditingItem(null); // Clear any previous editing state
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        if (confirm(`Weet je zeker dat je dit item wilt verwijderen?`)) {
            try {
                const listName = activeTab.listConfig.lijstTitel;
                await deleteListItem(listName, item.Id);
                fetchData(); // Refresh data after deletion
            } catch (err) {
                console.error('Fout bij verwijderen van item:', err);
                alert('Er is een fout opgetreden bij het verwijderen van het item.');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = async (formData) => {
        try {
            const listName = activeTab.listConfig.lijstTitel;
            if (editingItem) {
                // Update existing item
                await updateListItem(listName, editingItem.Id, formData);
            } else {
                // Create new item
                await createListItem(listName, formData);
            }
            handleCloseModal();
            fetchData(); // Refresh data after saving
        } catch (err) {
            console.error('Fout bij opslaan van item:', err);
            // Optionally, show an error message to the user in the form
        }
    };

    return h('div', { className: 'content-container' },
        h('nav', { className: 'tab-navigation' },
            beheerTabs.map(tab => h('button', {
                key: tab.id,
                className: `tab-button ${tab.id === activeTabId ? 'active' : ''}`,
                onClick: () => setActiveTabId(tab.id)
            }, tab.label))
        ),
        activeTab && h(TabContent, { 
            tab: activeTab, 
            data, 
            loading, 
            error, 
            onAddNew: handleAddNew,
            onEdit: handleEdit,
            onDelete: handleDelete
        }),
        h(Modal, { isOpen: isModalOpen, onClose: handleCloseModal },
            activeTab && h(GenericForm, {
                onSave: handleSave,
                onCancel: handleCloseModal,
                initialData: editingItem || {},
                formFields: activeTab.formFields || [],
                title: editingItem ? 
                    `${activeTab.label.slice(0, -1)} Bewerken` : 
                    `Nieuwe ${activeTab.label.slice(0, -1)} Toevoegen`,
                tabType: activeTab.id
            })
        )
    );
};

const PageFooter = () => {
    return h('footer', { className: 'page-footer', id: 'pagina-footer' },
        h('p', { className: 'footer-text' }, '© 2025 Verlofrooster Applicatie')
    );
};

// --- Main App Component ---

const BeheercentrumApp = () => {
    return h('div', { id: 'app-container', className: 'app-container' },
        h(PageBanner),
        h(ContentContainer),
        h(PageFooter)
    );
};

// --- Render the App ---

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(BeheercentrumApp));
