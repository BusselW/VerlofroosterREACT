<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Melding Maken - Verlofrooster</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="../css/verlofrooster_stijl.css" rel="stylesheet">
    <link rel="icon" href="../icons/favicon/favicon.svg" />

    <!-- React en configuratie bestanden -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="../js/config/configLijst.js"></script>

    <style>
        :root {
            --primary-color: #4a90e2;
            --primary-light: #e3f2fd;
            --primary-dark: #357abd;
            --secondary-color: #6c757d;
            --secondary-light: #f8fafc;
            --secondary-dark: #5a6268;
            --success-color: #388e3c;
            --success-light: #e8f5e8;
            --warning-color: #f57c00;
            --warning-light: #fff3e0;
            --danger-color: #c62828;
            --danger-light: #ffebee;
            --admin-color: #e74c3c;
            --admin-light: #fef7f7;
            --text-primary: #333;
            --text-secondary: #666;
            --border-color: #e0e6ed;
            --white: #fff;
            --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            --transition: all 0.2s ease;
            --border-radius-sm: 6px;
            --border-radius-md: 8px;
            --border-radius-lg: 12px;
        }
        
        body {
            background-color: #f4f7fa;
            font-family: 'Inter', sans-serif;
            color: var(--text-primary);
            margin: 0;
            padding: 0;
        }

        .melding-container {
            width: 100%;
            margin: 0 auto;
            padding: 0;
            box-sizing: border-box;
        }

        .page-layout {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            max-width: 1800px;
            margin: 0 auto;
            padding: 0 1.5rem 1.5rem;
        }

        .melding-header {
            text-align: center;
            margin-bottom: 2.5rem;
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            padding: 2.5rem 1.5rem;
            color: white;
            border-radius: 0;
            box-shadow: 0 4px 20px rgba(53, 122, 189, 0.25);
            width: 100%;
            margin-left: 0;
            margin-right: 0;
        }
        
        .melding-header h1 {
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: white;
            letter-spacing: -0.5px;
            font-size: 2.2rem;
        }

        .melding-header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
            font-weight: 400;
        }

        .card {
            background: var(--white);
            border-radius: var(--border-radius-lg);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .card:hover {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .card-header {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            background: linear-gradient(to right, #f8fafc, #ffffff);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .card-header h2 {
            margin: 0;
            font-size: 1.4rem;
            font-weight: 600;
            color: var(--text-primary);
            position: relative;
            padding-left: 0.75rem;
        }
        
        .card-header h2:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background: var(--primary-color);
            border-radius: 4px;
        }

        .card-body {
            padding: 1.75rem;
        }

        .compact-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .melding-item {
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-md);
            overflow: hidden;
            transition: all 0.3s ease;
            background: var(--white);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        }

        .melding-item:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
        }

        .melding-header-item {
            background: linear-gradient(to right, var(--secondary-light), white);
            padding: 1rem 1.5rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.2s ease;
        }
        
        .melding-header-item:hover {
            background: linear-gradient(to right, #e8f1fd, white);
        }
        
        .melding-header-item-content {
            flex: 1;
        }

        .melding-header-item h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .melding-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-bottom: 0.25rem;
            color: var(--text-secondary);
            font-size: 0.85rem;
        }

        .melding-content {
            padding: 1.5rem;
            background: var(--white);
            animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .melding-description {
            margin-bottom: 1.5rem;
        }
        
        .melding-description-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        
        .melding-description-content {
            background: var(--secondary-light);
            padding: 1.25rem;
            border-radius: var(--border-radius-sm);
            margin-bottom: 1.5rem;
            white-space: pre-line;
            border-left: 4px solid var(--primary-color);
        }

        .melding-thread {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-sm);
            padding: 1rem;
            margin-bottom: 1rem;
            background: var(--secondary-light);
            scrollbar-width: thin;
            scrollbar-color: var(--primary-color) var(--secondary-light);
        }
        
        .melding-thread::-webkit-scrollbar {
            width: 6px;
        }
        
        .melding-thread::-webkit-scrollbar-track {
            background: var(--secondary-light);
        }
        
        .melding-thread::-webkit-scrollbar-thumb {
            background-color: var(--primary-color);
            border-radius: 20px;
        }

        .thread-message {
            margin-bottom: 1rem;
            padding: 0.9rem;
            border-radius: var(--border-radius-sm);
            background: var(--white);
            border-left: 3px solid var(--primary-color);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .thread-message.admin {
            border-left-color: var(--admin-color);
            background: var(--admin-light);
        }

        .thread-message:last-child {
            margin-bottom: 0;
        }

        .message-meta {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-bottom: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
            padding-bottom: 0.5rem;
        }
        
        .message-meta-author {
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .thread-message.admin .message-meta-author {
            color: var(--admin-color);
        }

        .latest-response {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
            animation: fadeIn 0.4s ease;
        }
        
        .latest-response-title {
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.05rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-primary);
        }

        .form-control {
            width: 100%;
            padding: 0.9rem;
            border: 1px solid #ddd;
            border-radius: var(--border-radius-sm);
            font-size: 0.95rem;
            transition: all 0.25s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset;
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
        }

        .textarea {
            min-height: 120px;
            resize: vertical;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.7rem 1.4rem;
            border-radius: var(--border-radius-sm);
            border: 1px solid transparent;
            font-weight: 500;
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.25s ease;
            text-decoration: none;
            white-space: nowrap;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .btn:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .btn-icon {
            background: none;
            border: none;
            color: var(--primary-color);
            cursor: pointer;
            padding: 0.35rem;
            border-radius: 50%;
            transition: var(--transition);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
        }
        
        .btn-icon:hover {
            background-color: rgba(74, 144, 226, 0.1);
            transform: scale(1.1);
        }
        
        .btn-icon i {
            transition: transform 0.3s ease;
        }
        
        .btn-icon i.fa-chevron-up {
            transform: rotate(0deg);
        }
        
        .btn-icon i.fa-chevron-down {
            transform: rotate(0deg);
        }
        
        .btn-icon:hover i.fa-chevron-up {
            transform: rotate(180deg);
        }
        
        .btn-icon:hover i.fa-chevron-down {
            transform: rotate(-180deg);
        }

        .btn-primary {
            background: linear-gradient(to bottom right, var(--primary-color), var(--primary-dark));
            color: var(--white);
            border-color: var(--primary-dark);
        }

        .btn-primary:hover:not(:disabled) {
            background: linear-gradient(to bottom right, var(--primary-dark), #2c6aa8);
            border-color: #2c6aa8;
        }

        .btn-terug {
            background-color: var(--secondary-color);
            color: var(--white);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.2rem;
            border-radius: var(--border-radius-sm);
            text-decoration: none;
            margin-bottom: 1.5rem;
            transition: all 0.25s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 10;
            font-weight: 500;
        }

        .btn-terug:hover {
            background-color: var(--secondary-dark);
            color: var(--white);
            text-decoration: none;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .btn-expand {
            background: none;
            border: none;
            color: var(--primary-color);
            cursor: pointer;
            padding: 0.35rem 0.7rem;
            border-radius: var(--border-radius-sm);
            transition: var(--transition);
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            font-size: 0.9rem;
            border: 1px solid transparent;
        }

        .btn-expand:hover {
            background-color: rgba(74, 144, 226, 0.1);
            border-color: rgba(74, 144, 226, 0.3);
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.85rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            line-height: 1;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .status-nieuw {
            background-color: var(--primary-light);
            color: var(--primary-color);
        }

        .status-behandeling {
            background-color: var(--warning-light);
            color: var(--warning-color);
        }

        .status-opgelost {
            background-color: var(--success-light);
            color: var(--success-color);
        }
        
        .pagination {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1.5rem;
        }
        
        .pagination-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            border: 1px solid var(--border-color);
            background: var(--white);
            color: var(--text-primary);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.25s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .pagination-btn:hover {
            background-color: var(--secondary-light);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .pagination-btn.active {
            background-color: var(--primary-color);
            color: var(--white);
            border-color: var(--primary-color);
            box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
        }
        
        .pagination-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .loading {
            text-align: center;
            padding: 3rem 2rem;
            color: var(--text-secondary);
        }
        
        .loading i {
            animation: spin 1.5s linear infinite;
            font-size: 1.5rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
            display: block;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .error {
            background-color: var(--danger-light);
            color: var(--danger-color);
            padding: 1rem;
            border-radius: var(--border-radius-sm);
            margin-bottom: 1.5rem;
            border-left: 4px solid var(--danger-color);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .success {
            background-color: var(--success-light);
            color: var(--success-color);
            padding: 1rem;
            border-radius: var(--border-radius-sm);
            margin-bottom: 1.5rem;
            border-left: 4px solid var(--success-color);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            animation: fadeIn 0.3s ease;
        }

        .reply-form {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }
        
        @media (max-width: 768px) {
            .melding-container {
                padding: 0;
            }
            
            .page-layout {
                padding: 0 1rem 1rem;
            }
            
            .melding-header {
                padding: 1.5rem 1rem;
                margin-bottom: 1.5rem;
            }
            
            .melding-header h1 {
                font-size: 1.75rem;
            }
            
            .card-header, .card-body {
                padding: 1.25rem;
            }
            
            .melding-header-item {
                padding: 0.85rem 1rem;
            }
            
            .melding-content {
                padding: 1.25rem;
            }
            
            .btn-terug {
                margin-left: 1rem;
            }
        }
        
        @media (min-width: 1800px) {
            .page-layout {
                max-width: 1800px;
            }
        }
    </style>
</head>

<body>
    <div id="root"></div>

    <script type="module">
        import { fetchSharePointList, createSharePointListItem, updateSharePointListItem, getCurrentUser } from '../js/services/sharepointService.js';
        import { getCurrentUserGroups, isUserInAnyGroup } from '../js/services/permissionService.js';

        const { useState, useEffect, createElement: h, Fragment } = React;

        // Hulpfuncties
        const formatDatetime = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString('nl-NL', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const parseReacties = (reactieString) => {
            if (!reactieString) return [];
            
            try {
                // Probeer JSON parsing eerst
                return JSON.parse(reactieString);
            } catch {
                // Als het geen JSON is, behandel als legacy formaat
                const messages = reactieString.split('\n---\n').filter(msg => msg.trim());
                return messages.map((msg, index) => {
                    const lines = msg.trim().split('\n');
                    const metaLine = lines[0];
                    const content = lines.slice(1).join('\n');
                    
                    // Probeer metadata te parsen
                    const match = metaLine.match(/\[(.*?)\] \((.*?)\):/);
                    if (match) {
                        return {
                            author: match[1],
                            timestamp: match[2],
                            content: content.trim(),
                            isAdmin: match[1].includes('Beheer')
                        };
                    }
                    
                    return {
                        author: 'Onbekend',
                        timestamp: new Date().toISOString(),
                        content: msg.trim(),
                        isAdmin: false
                    };
                });
            }
        };

        const serializeReacties = (reacties) => {
            return JSON.stringify(reacties);
        };

        // Hoofdcomponent
        function MeldingMakenApp() {
            const [meldingen, setMeldingen] = useState([]);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState('');
            const [success, setSuccess] = useState('');
            const [currentUser, setCurrentUser] = useState(null);
            const [isAdmin, setIsAdmin] = useState(false);
            const [expandedMelding, setExpandedMelding] = useState(null);
            
            // Pagination state
            const itemsPerPage = 5;
            const [currentPage, setCurrentPage] = useState(1);
            
            // Form state
            const [nieuweMelding, setNieuweMelding] = useState({
                titel: '',
                beschrijving: '',
                waarFout: 'Algemeen'
            });

            // Reply states
            const [replyTexts, setReplyTexts] = useState({});

            useEffect(() => {
                initializeApp();
            }, []);

            const initializeApp = async () => {
                try {
                    setLoading(true);
                    
                    // Haal huidige gebruiker op
                    const user = await getCurrentUser();
                    setCurrentUser(user);

                    // Controleer admin rechten
                    const userGroups = await getCurrentUserGroups();
                    const adminStatus = await isUserInAnyGroup(['1. Sharepoint beheer'], userGroups);
                    setIsAdmin(adminStatus);

                    // Laad meldingen
                    await loadMeldingen();
                } catch (err) {
                    console.error('Initialisatie fout:', err);
                    setError('Fout bij het laden van de pagina: ' + err.message);
                } finally {
                    setLoading(false);
                }
            };

            const loadMeldingen = async () => {
                try {
                    const config = window.appConfiguratie.MeldFouten;
                    const data = await fetchSharePointList(config.lijstTitel);
                    
                    // Sorteer op nieuwste eerst
                    const sortedData = data.sort((a, b) => new Date(b.Created) - new Date(a.Created));
                    setMeldingen(sortedData);
                } catch (err) {
                    console.error('Fout bij laden meldingen:', err);
                    setError('Fout bij het laden van meldingen: ' + err.message);
                }
            };

            const handleSubmitMelding = async (e) => {
                e.preventDefault();
                
                if (!nieuweMelding.titel.trim() || !nieuweMelding.beschrijving.trim()) {
                    setError('Titel en beschrijving zijn verplicht');
                    return;
                }

                try {
                    setLoading(true);
                    setError('');

                    const config = window.appConfiguratie.MeldFouten;
                    const newItem = {
                        Title: nieuweMelding.titel,
                        Beschrijving_x0020_fout: nieuweMelding.beschrijving,
                        WaarFout: nieuweMelding.waarFout,
                        Status: 'Nieuw',
                        Reactie: JSON.stringify([])
                    };

                    await createSharePointListItem(config.lijstTitel, newItem);
                    
                    setSuccess('Melding succesvol ingediend!');
                    setNieuweMelding({ titel: '', beschrijving: '', waarFout: 'Algemeen' });
                    
                    // Herlaad meldingen
                    await loadMeldingen();
                    
                    // Clear success message na 3 seconden
                    setTimeout(() => setSuccess(''), 3000);
                } catch (err) {
                    console.error('Fout bij indienen melding:', err);
                    setError('Fout bij het indienen van de melding: ' + err.message);
                } finally {
                    setLoading(false);
                }
            };

            const handleReply = async (meldingId, replyText) => {
                if (!replyText.trim()) return;

                try {
                    const melding = meldingen.find(m => m.ID === meldingId);
                    if (!melding) return;

                    const bestaandeReacties = parseReacties(melding.Reactie);
                    const nieuweReactie = {
                        author: currentUser?.Title || 'Onbekend',
                        timestamp: new Date().toISOString(),
                        content: replyText.trim(),
                        isAdmin: isAdmin
                    };

                    const updatedReacties = [...bestaandeReacties, nieuweReactie];
                    
                    const config = window.appConfiguratie.MeldFouten;
                    await updateSharePointListItem(config.lijstTitel, meldingId, {
                        Reactie: serializeReacties(updatedReacties),
                        Status: isAdmin ? 'In behandeling' : melding.Status
                    });

                    // Update local state
                    setMeldingen(prev => prev.map(m => 
                        m.ID === meldingId 
                            ? { ...m, Reactie: serializeReacties(updatedReacties), Status: isAdmin ? 'In behandeling' : m.Status }
                            : m
                    ));

                    // Clear reply text
                    setReplyTexts(prev => ({ ...prev, [meldingId]: '' }));
                    setSuccess('Reactie toegevoegd!');
                    setTimeout(() => setSuccess(''), 3000);
                } catch (err) {
                    console.error('Fout bij toevoegen reactie:', err);
                    setError('Fout bij het toevoegen van reactie: ' + err.message);
                }
            };

            // Calculate pagination
            const totalPages = Math.ceil(meldingen.length / itemsPerPage);
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentItems = meldingen.slice(indexOfFirstItem, indexOfLastItem);
            
            const paginate = (pageNumber) => {
                setCurrentPage(pageNumber);
                // Close any expanded items when changing pages
                setExpandedMelding(null);
            };
            
            const goToPreviousPage = () => {
                if (currentPage > 1) {
                    paginate(currentPage - 1);
                }
            };
            
            const goToNextPage = () => {
                if (currentPage < totalPages) {
                    paginate(currentPage + 1);
                }
            };

            const toggleExpanded = (meldingId) => {
                setExpandedMelding(expandedMelding === meldingId ? null : meldingId);
            };

            const getStatusBadge = (status) => {
                const statusClass = status === 'Nieuw' ? 'status-nieuw' : 
                                 status === 'In behandeling' ? 'status-behandeling' : 
                                 'status-opgelost';
                const icon = status === 'Nieuw' ? 'fa-circle-info' :
                           status === 'In behandeling' ? 'fa-tools' :
                           'fa-check-circle';
                           
                return h('span', { className: `status-badge ${statusClass}` }, 
                    h('i', { className: `fas ${icon}`, style: { marginRight: '5px' } }),
                    status
                );
            };

            const canReply = (melding) => {
                return isAdmin || (currentUser && melding.Author && melding.Author.Title === currentUser.Title);
            };

            if (loading && meldingen.length === 0) {
                return h('div', { className: 'melding-container' },
                    h('a', { 
                        href: '../verlofrooster.aspx', 
                        className: 'btn-terug',
                        style: { marginTop: '15px', marginLeft: '1.5rem' }
                    },
                        h('i', { className: 'fas fa-arrow-left' }),
                        ' Terug naar Rooster'
                    ),
                    h('div', { className: 'loading', style: { marginTop: '100px' } },
                        h('div', { style: { 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            gap: '15px'
                        } },
                            h('div', { style: {
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                border: '3px solid #f3f3f3',
                                borderTop: '3px solid var(--primary-color)',
                                animation: 'spin 1s linear infinite'
                            } }),
                            h('p', { style: { 
                                fontSize: '1.1rem', 
                                fontWeight: '500',
                                color: 'var(--text-secondary)' 
                            } }, 'Meldingen worden geladen...')
                        )
                    )
                );
            }

            return h('div', { className: 'melding-container' },
                // Terug knop
                h('a', { 
                    href: '../verlofrooster.aspx', 
                    className: 'btn-terug',
                    style: {
                        marginTop: '15px',
                        marginLeft: '1.5rem'
                    }
                },
                    h('i', { className: 'fas fa-arrow-left' }),
                    ' Terug naar Rooster'
                ),

                // Header
                h('div', { className: 'melding-header' },
                    h('h1', null, 'Feedback & Meldingen'),
                    h('p', null, 'Deel uw feedback, rapporteer problemen of stel vragen over de Verlofrooster applicatie. Wij staan voor u klaar!')
                ),

                // Error/Success berichten
                error && h('div', { className: 'error' }, error),
                success && h('div', { className: 'success' }, success),
                
                h('div', { className: 'page-layout' },
                    // Lijst met bestaande meldingen
                    h('div', { className: 'card' },
                        h('div', { className: 'card-header' },
                            h('h2', null, h(Fragment, null, h('i', { className: 'fas fa-comments', style: { marginRight: '10px' } }), 'Bestaande Meldingen')),
                            totalPages > 1 && h('div', { className: 'pagination' },
                                h('button', {
                                    className: 'pagination-btn',
                                    onClick: goToPreviousPage,
                                    disabled: currentPage === 1,
                                    title: 'Vorige pagina'
                                }, h('i', { className: 'fas fa-chevron-left' })),
                                
                                Array.from({ length: totalPages }, (_, i) => i + 1).map(number => 
                                    h('button', {
                                        key: number,
                                        className: `pagination-btn ${currentPage === number ? 'active' : ''}`,
                                        onClick: () => paginate(number)
                                    }, number)
                                ),
                                
                                h('button', {
                                    className: 'pagination-btn',
                                    onClick: goToNextPage,
                                    disabled: currentPage === totalPages,
                                    title: 'Volgende pagina'
                                }, h('i', { className: 'fas fa-chevron-right' }))
                            )
                        ),
                        h('div', { className: 'card-body' },
                            currentItems.length === 0 
                                ? h('div', { style: { 
                                    textAlign: 'center', 
                                    color: 'var(--text-secondary)',
                                    padding: '30px 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '15px'
                                } }, 
                                    h('i', { className: 'fas fa-inbox', style: { 
                                        fontSize: '3rem', 
                                        color: 'var(--primary-light)',
                                        opacity: 0.7
                                    } }),
                                    h('p', { style: { fontSize: '1.1rem' } }, 'Nog geen meldingen ingediend.')
                                )
                                : h('div', { className: 'compact-list' },
                                    currentItems.map(melding => {
                                        const reacties = parseReacties(melding.Reactie);
                                        const laatsteReactie = reacties.length > 0 ? reacties[reacties.length - 1] : null;
                                        const isExpanded = expandedMelding === melding.ID;

                                        return h('div', { 
                                            key: melding.ID, 
                                            className: 'melding-item' 
                                        },
                                            // Header
                                            h('div', { 
                                                className: 'melding-header-item',
                                                onClick: () => toggleExpanded(melding.ID)
                                            },
                                                h('div', { className: 'melding-header-item-content' },
                                                    h('h3', null, melding.Title),
                                                    h('div', { className: 'melding-meta' },
                                                        h('span', null, h(Fragment, null, h('i', { className: 'fas fa-tag', style: { marginRight: '5px' } }), `${melding.WaarFout || 'Algemeen'}`)),
                                                        h('span', null, '•'),
                                                        h('span', null, h(Fragment, null, h('i', { className: 'fas fa-calendar', style: { marginRight: '5px' } }), formatDatetime(melding.Created))),
                                                        h('span', null, '•'),
                                                        h('span', null, h(Fragment, null, h('i', { className: 'fas fa-comments', style: { marginRight: '5px' } }), `${reacties.length} reactie(s)`))
                                                    ),
                                                    getStatusBadge(melding.Status)
                                                ),
                                                h('button', { 
                                                    className: 'btn-icon',
                                                    type: 'button'
                                                },
                                                    h('i', { 
                                                        className: `fas fa-chevron-${isExpanded ? 'up' : 'down'}` 
                                                    })
                                                )
                                            ),

                                            // Content (alleen zichtbaar als uitgevouwen)
                                            isExpanded && h('div', { className: 'melding-content' },
                                                h('div', { className: 'melding-description' },
                                                    h('div', { className: 'melding-description-title' }, 'Beschrijving:'),
                                                    h('div', { className: 'melding-description-content' }, melding.Beschrijving_x0020_fout)
                                                ),

                                                // Laatste reactie (als er reacties zijn)
                                                laatsteReactie && h('div', { className: 'latest-response' },
                                                    h('div', { className: 'latest-response-title' }, 
                                                        h('i', { className: 'fas fa-reply' }),
                                                        'Laatste reactie:'
                                                    ),
                                                    h('div', { 
                                                        className: `thread-message ${laatsteReactie.isAdmin ? 'admin' : ''}`
                                                    },
                                                        h('div', { className: 'message-meta' },
                                                            h('span', { className: 'message-meta-author' }, laatsteReactie.author),
                                                            h('span', null, formatDatetime(laatsteReactie.timestamp))
                                                        ),
                                                        laatsteReactie.content
                                                    )
                                                ),

                                                // Volledige thread (als er meer dan 1 reactie is)
                                                reacties.length > 1 && h('div', { style: { marginTop: '1rem' } },
                                                    h('button', {
                                                        className: 'btn-expand',
                                                        onClick: (e) => {
                                                            e.stopPropagation();
                                                            const threadId = `thread-${melding.ID}`;
                                                            const thread = document.getElementById(threadId);
                                                            if (thread) {
                                                                const isHidden = thread.style.display === 'none';
                                                                thread.style.display = isHidden ? 'block' : 'none';
                                                                e.target.querySelector('i').className = `fas fa-chevron-${isHidden ? 'up' : 'down'}`;
                                                            }
                                                        }
                                                    },
                                                        h('i', { className: 'fas fa-chevron-down' }),
                                                        ` Toon alle ${reacties.length} reacties`
                                                    ),
                                                    h('div', { 
                                                        id: `thread-${melding.ID}`,
                                                        className: 'melding-thread',
                                                        style: { display: 'none' }
                                                    },
                                                        reacties.map((reactie, index) => 
                                                            h('div', { 
                                                                key: index,
                                                                className: `thread-message ${reactie.isAdmin ? 'admin' : ''}`
                                                            },
                                                                h('div', { className: 'message-meta' },
                                                                    h('span', { className: 'message-meta-author' }, reactie.author),
                                                                    h('span', null, formatDatetime(reactie.timestamp))
                                                                ),
                                                                reactie.content
                                                            )
                                                        )
                                                    )
                                                ),

                                                // Reply formulier (alleen voor beheerders en auteur van de melding)
                                                canReply(melding) && h('div', { className: 'reply-form' },
                                                    h('strong', null, 'Reageer:'),
                                                    h('textarea', {
                                                        className: 'form-control',
                                                        style: { marginTop: '0.5rem', minHeight: '80px' },
                                                        value: replyTexts[melding.ID] || '',
                                                        onChange: (e) => setReplyTexts(prev => ({ 
                                                            ...prev, 
                                                            [melding.ID]: e.target.value 
                                                        })),
                                                        placeholder: 'Typ je reactie hier...'
                                                    }),
                                                    h('button', {
                                                        className: 'btn btn-primary',
                                                        style: { marginTop: '0.5rem' },
                                                        onClick: () => handleReply(melding.ID, replyTexts[melding.ID]),
                                                        disabled: !replyTexts[melding.ID]?.trim()
                                                    },
                                                        h('i', { className: 'fas fa-reply' }),
                                                        ' Reageer'
                                                    )
                                                )
                                            )
                                        );
                                    })
                                )
                        )
                    ),
                    
                    // Formulier voor nieuwe melding
                    h('div', { className: 'card' },
                        h('div', { className: 'card-header' },
                            h('h2', null, h(Fragment, null, h('i', { className: 'fas fa-plus-circle', style: { marginRight: '10px' } }), 'Nieuwe Melding Indienen'))
                        ),
                        h('div', { className: 'card-body' },
                            h('form', { onSubmit: handleSubmitMelding },
                                h('div', { className: 'form-group' },
                                    h('label', { className: 'form-label' }, h(Fragment, null, h('i', { className: 'fas fa-heading', style: { marginRight: '8px' } }), 'Titel *')),
                                    h('input', {
                                        type: 'text',
                                        className: 'form-control',
                                        value: nieuweMelding.titel,
                                        onChange: (e) => setNieuweMelding(prev => ({ ...prev, titel: e.target.value })),
                                        placeholder: 'Korte omschrijving van het probleem',
                                        required: true
                                    })
                                ),
                                h('div', { className: 'form-group' },
                                    h('label', { className: 'form-label' }, h(Fragment, null, h('i', { className: 'fas fa-map-marker-alt', style: { marginRight: '8px' } }), 'Waar treedt de fout op?')),
                                    h('select', {
                                        className: 'form-control',
                                        value: nieuweMelding.waarFout,
                                        onChange: (e) => setNieuweMelding(prev => ({ ...prev, waarFout: e.target.value }))
                                    },
                                        h('option', { value: 'Algemeen' }, 'Algemeen'),
                                        h('option', { value: 'Rooster' }, 'Rooster'),
                                        h('option', { value: 'Verlofaanvraag' }, 'Verlofaanvraag'),
                                        h('option', { value: 'Compensatie-uren' }, 'Compensatie-uren'),
                                        h('option', { value: 'Ziekmelding' }, 'Ziekmelding'),
                                        h('option', { value: 'Beheer' }, 'Beheer'),
                                        h('option', { value: 'Overig' }, 'Overig')
                                    )
                                ),
                                h('div', { className: 'form-group' },
                                    h('label', { className: 'form-label' }, h(Fragment, null, h('i', { className: 'fas fa-align-left', style: { marginRight: '8px' } }), 'Beschrijving *')),
                                    h('textarea', {
                                        className: 'form-control textarea',
                                        value: nieuweMelding.beschrijving,
                                        onChange: (e) => setNieuweMelding(prev => ({ ...prev, beschrijving: e.target.value })),
                                        placeholder: 'Geef een gedetailleerde beschrijving van het probleem...',
                                        required: true
                                    })
                                ),
                                h('button', {
                                    type: 'submit',
                                    className: 'btn btn-primary',
                                    disabled: loading
                                },
                                    loading ? [
                                        h('i', { className: 'fas fa-spinner fa-spin' }),
                                        ' Bezig...'
                                    ] : [
                                        h('i', { className: 'fas fa-paper-plane' }),
                                        ' Melding Indienen'
                                    ]
                                )
                            )
                        )
                    )
                )
            );
        }

        // Render de app
        const container = document.getElementById('root');
        const root = ReactDOM.createRoot(container);
        root.render(h(MeldingMakenApp));
    </script>
</body>

</html>
