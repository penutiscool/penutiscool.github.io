// Game Browser Logic

// Category mapping based on ID
// ID % 6 determines category: 0=puzzle, 1=arcade, 2=strategy, 3=action, 4=adventure, 5=arcade (cycles)
const categoryMap = {
    0: "puzzle",
    1: "arcade", 
    2: "strategy",
    3: "action",
    4: "adventure",
    5: "arcade"
};

function getCategoryById(id) {
    return categoryMap[id % 6];
}

// Sample games database - provide id, name, imageUrl, and gameUrl
// Category will be auto-set based on ID
const gamesRaw = [
    {
        id: 1,
        name: "Snake Game",
        imageUrl: "https://hubbleedu.github.io/images/Google-Snake.png",
        gameUrl: "https://hubbleedu.github.io/games/google-snake/"
    },
    {
        id: 2,
        name: "Tetris",
        imageUrl: "https:/hubbleedu.github.io/images/Tetris.png",
        gameUrl: "https:/hubbleedu.github.io/games/Tetris.html"
    },
    {
        id: 3,
        name: "Szvy",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=      -Man",
        gameUrl: "https://zearn.global.ssl.fastly.net"
    },
    {
        id: 4,
        name: "Chess",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Chess",
        gameUrl: "https://www.chess.com/play/online"
    },
    {
        id: 5,
        name: "2048",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=2048",
        gameUrl: "https://play2048.co/"
    },
    {
        id: 6,
        name: "Asteroids",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Asteroids",
        gameUrl: "https://www.google.com/logos/2019/asteroids/"
    },
    {
        id: 7,
        name: "Minecraft Classic",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Minecraft",
        gameUrl: "https://classic.minecraft.net/"
    },
    {
        id: 8,
        name: "Solitaire",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Solitaire",
        gameUrl: "https://www.solitaire.com/"
    },
    {
        id: 9,
        name: "Crossy Road",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Crossy+Road",
        gameUrl: "https://www.crossyroad.com/"
    },
    {
        id: 10,
        name: "Tic Tac Toe",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Tic+Tac+Toe",
        gameUrl: "https://www.playtictactoe.org/"
    },
    {
        id: 11,
        name: "Wordle",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Wordle",
        gameUrl: "https://www.nytimes.com/games/wordle/index.html"
    },
    {
        id: 12,
        name: "Checkers",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Checkers",
        gameUrl: "https://www.mathsisfun.com/games/checkers-chess.html"
    }
];

// Auto-set category based on ID
const games = gamesRaw.map((game) => ({
    ...game,
    category: getCategoryById(game.id)
}));

let currentCategory = 'all';
let filteredGames = [...games];

const gamesGrid = document.getElementById('games-grid');
const searchInput = document.getElementById('search-input');
const menuBtns = document.querySelectorAll('.menu-btn');
const gameViewer = document.getElementById('game-viewer');
const gameIframe = document.getElementById('game-iframe');
const viewerTitle = document.getElementById('viewer-title');
const closeViewer = document.getElementById('close-viewer');

// Render games in grid
function renderGames(gamesToRender) {
    gamesGrid.innerHTML = '';
    
    if (gamesToRender.length === 0) {
        gamesGrid.innerHTML = '<p class="no-games">No games found</p>';
        return;
    }
    
    gamesToRender.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-image-container">
                <div class="image-loading-spinner">
                    <div class="loading-spinner" style="width: 40px; height: 40px; border-width: 3px;"></div>
                </div>
                <img src="${game.imageUrl}" alt="${game.name}" class="game-image">
                <div class="game-overlay">
                    <button class="play-button" data-game-id="${game.id}">Play</button>
                </div>
            </div>
            <div class="game-info">
                <h3 class="game-name">${game.name}</h3>
                <span class="game-category">${game.category}</span>
            </div>
        `;
        
        // Handle image loading
        const img = gameCard.querySelector('.game-image');
        const spinner = gameCard.querySelector('.image-loading-spinner');
        
        if (img.complete && img.naturalWidth !== 0) {
            // Image already loaded successfully
            img.classList.add('loaded');
            spinner.classList.add('hidden');
        } else {
            img.addEventListener('load', () => {
                // Only hide spinner if image loads successfully
                if (img.naturalWidth !== 0) {
                    img.classList.add('loaded');
                    spinner.classList.add('hidden');
                }
            });
            
            // Keep spinner spinning if image fails to load - don't hide it
            img.addEventListener('error', () => {
                // Keep spinner visible if URL is incorrect
                // Don't hide it, just keep it spinning
            });
        }
        
        // Add click event to play button
        const playBtn = gameCard.querySelector('.play-button');
        playBtn.addEventListener('click', () => openGame(game));
        
        gamesGrid.appendChild(gameCard);
    });
}

// Open game in iframe
function openGame(game) {
    viewerTitle.textContent = game.name;
    gameViewer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Show loading overlay
    const loadingOverlay = document.getElementById('iframe-loading');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
    
    // Make viewer cover entire page - iframe will fill remaining space after header
    gameViewer.style.top = '0';
    gameViewer.style.height = '100vh';
    
    // Calculate header height dynamically and set CSS variable for iframe
    const viewerHeader = document.querySelector('.game-viewer-header');
    const headerHeight = viewerHeader ? viewerHeader.offsetHeight : 73;
    document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
    gameIframe.style.height = `calc(100vh - ${headerHeight}px)`;
    
    // Load game in iframe
    gameIframe.src = game.gameUrl;
    
    // Hide loading only when iframe loads successfully
    // If URL is incorrect and causes an error, spinner will keep spinning
    gameIframe.addEventListener('load', () => {
        // Try to verify content loaded successfully
        try {
            const iframeDoc = gameIframe.contentDocument || gameIframe.contentWindow.document;
            if (iframeDoc && iframeDoc.body && iframeDoc.body.innerHTML.trim() !== '') {
                // Valid content loaded - hide spinner
                if (loadingOverlay) {
                    loadingOverlay.classList.add('hidden');
                }
            }
            // If empty content or can't verify, keep spinner spinning
        } catch (e) {
            // Cross-origin - can't verify content due to CORS
            // For cross-origin, hide spinner on load (load event means something loaded)
            // Note: Some incorrect URLs may still trigger load event, but error events will keep spinner
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }
    }, { once: true });
    
    // Keep spinner spinning if game URL is incorrect
    // Error event will fire for some failures (network errors, etc.)
    gameIframe.addEventListener('error', () => {
        // Keep loading spinner visible - don't hide it
        // This ensures the spinner keeps spinning if URL is incorrect
    }, { once: true });
}

// Close game viewer
function closeGameViewer() {
    gameViewer.style.display = 'none';
    gameIframe.src = '';
    document.body.style.overflow = 'auto';
    
    // Reset loading overlay
    const loadingOverlay = document.getElementById('iframe-loading');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="iframe-loading-text">Loading game...</div>
        `;
    }
}

// Filter games by category
function filterByCategory(category) {
    currentCategory = category;
    
    menuBtns.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    applyFilters();
}

// Apply search and category filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredGames = games.filter(game => {
        const matchesCategory = currentCategory === 'all' || game.category === currentCategory;
        const matchesSearch = game.name.toLowerCase().includes(searchTerm) || 
                             game.category.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
    
    renderGames(filteredGames);
}

// Event listeners
menuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterByCategory(btn.dataset.category);
    });
});

searchInput.addEventListener('input', applyFilters);

// Allow Enter key to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        applyFilters();
    }
});

closeViewer.addEventListener('click', closeGameViewer);

// Close viewer when clicking outside iframe
gameViewer.addEventListener('click', (e) => {
    if (e.target === gameViewer) {
        closeGameViewer();
    }
});

// Close viewer with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gameViewer.style.display === 'block') {
        closeGameViewer();
    }
});

// Initial render
renderGames(games);

// Check if we need to open a specific game (from home search)
if (typeof Storage !== 'undefined') {
    const openGameData = sessionStorage.getItem('openGame');
    if (openGameData) {
        try {
            const game = JSON.parse(openGameData);
            sessionStorage.removeItem('openGame');
            // Open the game automatically
            openGame(game);
        } catch (e) {
            // Invalid data, ignore
        }
    }
}