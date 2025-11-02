// Home Page Search Functionality

// Import games data - same structure as game.js
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

// Games database - same as game.js
const gamesRaw = [
    {
        id: 1,
        name: "Snake Game",
        imageUrl: "https://hubbleedu.github.io/images/Google-Snake.png",
        gameUrl: "https://hubbleedu.github.io/games/snake/"
    },
    {
        id: 2,
        name: "Tetris",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Tetris",
        gameUrl: "https://tetris.com/play-tetris"
    },
    {
        id: 3,
        name: "Pac-Man",
        imageUrl: "https://via.placeholder.com/300x200/CC00FF/FFFFFF?text=Pac-Man",
        gameUrl: "https://www.pacman.com/en/pac-man/"
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

const searchInput = document.getElementById('home-search-input');
const searchResults = document.getElementById('search-results');
const gamesGrid = document.getElementById('home-games-grid');

// Check if elements exist before proceeding
if (!searchInput || !searchResults || !gamesGrid) {
    console.error('Required search elements not found');
}

// Render games in grid
function renderSearchResults(gamesToRender) {
    gamesGrid.innerHTML = '';
    
    if (gamesToRender.length === 0) {
        gamesGrid.innerHTML = '<p class="no-games">No games found matching your search</p>';
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
            img.classList.add('loaded');
            spinner.classList.add('hidden');
        } else {
            img.addEventListener('load', () => {
                if (img.naturalWidth !== 0) {
                    img.classList.add('loaded');
                    spinner.classList.add('hidden');
                }
            });
            
            img.addEventListener('error', () => {
                // Keep spinner spinning if image fails to load
            });
        }
        
        // Add click event to play button - redirect to games page
        const playBtn = gameCard.querySelector('.play-button');
        playBtn.addEventListener('click', () => {
            // Store search term and game info in sessionStorage to open on games page
            sessionStorage.setItem('openGame', JSON.stringify(game));
            window.location.href = 'games.html';
        });
        
        gamesGrid.appendChild(gameCard);
    });
}

// Perform search
function performSearch() {
    if (!searchInput || !searchResults || !gamesGrid) {
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Clear search - hide results
        searchResults.style.display = 'none';
        return;
    }
    
    // Filter games
    const filteredGames = games.filter(game => {
        return game.name.toLowerCase().includes(searchTerm) || 
               game.category.toLowerCase().includes(searchTerm);
    });
    
    // Show results
    searchResults.style.display = 'block';
    
    // Render results
    renderSearchResults(filteredGames);
    
    // Scroll to results
    searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Event listeners - only add if elements exist
if (searchInput) {
    searchInput.addEventListener('input', performSearch);
    
    // Allow Enter key to search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Check if we need to open a specific game (from search results)
if (typeof Storage !== 'undefined') {
    const openGameData = sessionStorage.getItem('openGame');
    if (openGameData) {
        sessionStorage.removeItem('openGame');
        // This will be handled on games.html page
    }
}

