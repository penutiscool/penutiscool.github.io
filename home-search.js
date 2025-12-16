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
    { name: "Forms", image: "https://www.uottawa.ca/about-us/sites/g/files/bhrskd336/files/styles/max_width_l_1470px/public/2022-08/ms_365_icons_4_auto_x2_auto_x2.jpg?itok=q6-8QPVx.png", url: "https://forms.office.com/r/GQRCFVA5YQ?origin=lprLink" },
    {  id: 0, name: "Snake Game", image: "https://hubbleplay.github.io/images/Google-Snake.png", url: "https://hubbleplay.github.io/games/snake/" },
    {  id: 1, name: "Doodle Jump", image: "https://hubbleplay.github.io/images/Doodle-Jump.png", url: "https://hubbleplay.github.io/games/Doodle_jump.html" },
    {  id: 2, name: "Getting Over It", image: "https://hubbleplay.github.io/images/Getting-Over-It.png", url: "https://hubbleplay.github.io/games/gettingoverit.html", },
    {  id: 3, name: "Retro Bowl", image: "https://hubbleplay.github.io/images/Retro-Bowl.png", url: "https://hubbleplay.github.io/games/retro-bowl/" },
    {  id: 4, name: "Snow Rider 3D", image: "https://hubbleplay.github.io/images/Snow-Rider-3d.png", url: "https://hubbleplay.github.io/games/Snow Rider 3D.html",  },
    {  id: 5, name: "Tetris", image: "https://hubbleplay.github.io/images/Tetris.png", url: "https://hubbleplay.github.io/games/Tetris.html" },
    {  id: 2, name: "Space Huggers", image: "https://hubbleplay.github.io/images/Space-Huggers.png", url: "https://hubbleplay.github.io/games/spacehuggers.html" },
    {  id: 7, name: "Basket Random", image: "https://hubbleplay.github.io/images/Basket-Random.png", url: "https://hubbleplay.github.io/games/basket-random/" },
    {  id: 8, name: "Burrito Bison", image: "https://hubbleplay.github.io/images/burrito-Bison.png", url: "https://hubbleplay.github.io/games/burrito-bison/",  },
    {  id: 9, name: "PolyTrack", image: "https://hubbleplay.github.io/images/Polytrack.png", url: "https://hubbleplay.github.io/games/polytrack/" },
    {  id: 10, name: "Slope", image: "https://hubbleplay.github.io/images/Slope.png", url: "https://hubbleplay.github.io/games/slope.html",  },
    {  id: 11, name: "Cookie Clicker", image: "https://hubbleplay.github.io/images/Cookie-Clicker.png", url: "https://hubbleplay.github.io/games/cookieclicker/" },
    {  id: 3, name: "Bitlife", image: "https://hubbleplay.github.io/images/Bitlife.png", url: "https://hubbleplay.github.io/games/bitlife/",  },
    {  id: 13, name: "Geometry Dash", image: "https://hubbleplay.github.io/images/Geometry-Dash.png", url: "https://hubbleplay.github.io/games/geometrydash/" },
    {  id: 14, name: "Stickman Hook", image: "https://hubbleplay.github.io/images/Stickman-Hook.png", url: "https://hubbleplay.github.io/games/stickman-hook/" },
    {  id: 15, name: "Idle Breakout", image: "https://hubbleplay.github.io/images/Idle-Breakout.png", url: "https://hubbleplay.github.io/games/idle-breakout/" },
    {  id: 15, name: "EaglerCraft", image: "https://thumbs.dreamstime.com/b/minecraft-logo-online-game-dirt-block-illustrations-concept-design-isolated-186775550.jpg", url: "eaglercraft1_8_8.html" },
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
                <img src="${game.image}" alt="${game.name}" class="game-image">
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

