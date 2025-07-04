<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verlofrooster - Beheercentrum</title>
    <link rel="icon" type="image/svg+xml" href="../Icons/favicon/favicon.svg">
    
    <!-- Fonts and Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <!-- CSS files -->
    <link rel="stylesheet" href="css/beheercentrum_s.css">
    
    <!-- No additional custom styles needed as they're all in beheercentrum_s.css -->
</head>
<body class="light-theme">
    <!-- Hoofd Banner -->
    <div id="page-banner" class="page-banner">
        <div class="banner-content">
            <div class="banner-left">
                <h1 class="banner-title">
                    Verlofrooster Beheercentrum
                </h1>
                <p class="banner-subtitle">
                    Beheer medewerkers, teams, verlofredenen en andere kerngegevens
                </p>
            </div>
            <div class="banner-right">
                <a href="../../verlofRooster.aspx" class="btn-back">
                    <svg class="icon-small" fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
                        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Terug naar rooster</span>
                </a>
                <div class="user-details">
                    <div class="user-info">
                        <span id="huidige-gebruiker">Gebruiker wordt geladen...</span>
                    </div>
                    <div class="connection-status">
                        <span id="verbinding-status">Verbonden met: https://som.org.om</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Hoofd Container -->
    <div id="app-container" class="app-container">
        <!-- Main Content Area -->
        <div class="content-container">
            <div class="section-placeholder">
                <h2>Beheercentrum Module</h2>
                <p>Deze module is momenteel in ontwikkeling.</p>
            </div>
        </div>
        
        <!-- Footer -->
        <footer class="page-footer" id="pagina-footer">
            <p class="footer-text">
                &copy; 2025 Verlofrooster Applicatie
            </p>
        </footer>
    </div>
    
    <!-- Simple script just for the UI demo -->
    <script>
        // Set user name in header
        document.getElementById('huidige-gebruiker').textContent = 'Bussel, W. van';
    </script>
</body>
</html>
