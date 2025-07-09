<!DOCTYPE html>
<!-- Reference: .github/copilot-instructions.md -->
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verlofrooster</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- CSS bestanden -->
    <link href="css/verlofrooster_stijl.css" rel="stylesheet">
    <link href="css/verlofrooster_styling.css" rel="stylesheet">
    <link rel="icon" href="data:," />

    <!-- React en configuratie bestanden -->
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="js/config/configLijst.js"></script>

</head>

<body>
    <div id="root"></div>

    <!-- Hoofd script van de applicatie, nu als module om 'import' te gebruiken -->
    <script type="module">
        // Import the refactored RoosterApp component
        import RoosterApp, { ErrorBoundary } from './js/roosterApp.js';
        import { fetchSharePointList, getProfilePhotoUrl } from './js/services/sharepointService.js';
        import { canManageOthersEvents } from './js/ui/ContextMenu.js';
        import TooltipManager from './js/ui/tooltipbar.js';
        import LoadingLogic, { clearAllCache, logLoadingStatus } from './js/services/loadingLogic.js';

        const { createElement: h } = React;

        // Initialize tooltip manager as soon as the script runs
        TooltipManager.init();

        // Initialize the React app
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(h(ErrorBoundary, null, h(RoosterApp)));

        // Make functions globally available for use in other components
        window.canManageOthersEvents = canManageOthersEvents;
        window.getProfilePhotoUrl = getProfilePhotoUrl;
        window.fetchSharePointList = fetchSharePointList;
        window.TooltipManager = TooltipManager; // Expose TooltipManager for debugging
        
        // Expose loading logic functions for debugging and manual control
        window.LoadingLogic = LoadingLogic;
        window.clearLoadingCache = clearAllCache;
        window.getLoadingStats = LoadingLogic.getCacheStats;
        window.logLoadingStatus = logLoadingStatus;
        
        console.log('🔧 LoadingLogic utilities added to window:');
        console.log('   - window.LoadingLogic - Full LoadingLogic object');
        console.log('   - window.clearLoadingCache() - Clear all cached data');
        console.log('   - window.getLoadingStats() - Get cache statistics');
        console.log('   - window.logLoadingStatus() - Log current loading status');
    </script>
</body>

</html>