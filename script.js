// Global variable to hold the processed, sorted level data
let processedLevels = [];

/**
 * Processes the raw LEVEL_DATA, calculates rank, and prepares the data.
 * NOTE: Assumes LEVEL_DATA is defined in data.js and is already sorted by rank.
 */
function processLevelData() {
    if (typeof LEVEL_DATA !== 'undefined' && Array.isArray(LEVEL_DATA)) {
        processedLevels = LEVEL_DATA.map((level, index) => ({
            ...level,
            rank: index + 1 // Assign 1-based rank based on array position
        }));
    } else {
        console.error("LEVEL_DATA is undefined or not an array. Please check data.js.");
    }
}

/**
 * Sets up the submission page: populates the level dropdown and adds event listeners.
 */
function setupSubmitPage() {
    const levelSelect = document.getElementById('submit-level-select');
    const rawFootageRow = document.getElementById('raw-footage-row');

    if (!levelSelect || !rawFootageRow) return;

    // Clear existing options, keeping only the first (Select a Level)
    while (levelSelect.options.length > 1) {
        levelSelect.remove(1); 
    }

    // Populate the dropdown
    processedLevels.forEach(level => {
        const option = document.createElement('option');
        option.value = level.name;
        option.textContent = `#${level.rank} - ${level.name}`;
        option.dataset.rank = level.rank;
        levelSelect.appendChild(option);
    });
    
    // Add event listener for the Raw Footage field logic (Top 15 required)
    levelSelect.removeEventListener('change', handleLevelChange);
    levelSelect.addEventListener('change', handleLevelChange);

    // Initialize state
    handleLevelChange(); // Call once to set initial required state based on default value
}

// Handler function for level select change
function handleLevelChange() {
    const levelSelect = document.getElementById('submit-level-select');
    const rawFootageRow = document.getElementById('raw-footage-row');
    const selectedOption = levelSelect.options[levelSelect.selectedIndex];
    const rank = parseInt(selectedOption.dataset.rank, 10) || 0;
    
    // Logic: Raw footage is mandatory for Top 15 (rank 1 to 15)
    if (rank > 0 && rank <= 15) {
        rawFootageRow.style.display = 'flex';
        document.getElementById('raw-footage').setAttribute('required', 'true');
        // Update label to reflect mandatory status
        document.querySelector('#raw-footage-row label').innerHTML = 'Raw Footage <span style="color:red;">(Required for Top 15):</span>';
    } else {
        rawFootageRow.style.display = 'none';
        document.getElementById('raw-footage').removeAttribute('required');
        // Update label to reflect optional status
        document.querySelector('#raw-footage-row label').innerHTML = 'Raw Footage (Optional):';
    }
}

// ----------------------------------------------------------------------
// --- LIST PAGE LOGIC (FIXED) ---
// ----------------------------------------------------------------------

function renderLevelList() {
    const sidebar = document.getElementById('level-list-sidebar');
    const detailsContainer = document.getElementById('level-details-container');
    
    if (!sidebar || !detailsContainer) return;

    sidebar.innerHTML = '<h3>FHLL Levels</h3>';

    if (processedLevels.length === 0) {
        sidebar.innerHTML += '<p>No levels loaded from data.js.</p>';
        detailsContainer.innerHTML = '<h3>Level Details</h3><p>Select a level from the left.</p>';
        return;
    }

    // Populate the sidebar
    processedLevels.forEach(level => {
        const levelItem = document.createElement('div');
        levelItem.classList.add('level-list-item');
        levelItem.innerHTML = `<span class="level-rank">#${level.rank}</span><span class="level-name">${level.name}</span><span class="level-creator">by ${level.creator}</span>`;
        
        levelItem.addEventListener('click', () => {
            // Logic to handle selection and display
            document.querySelectorAll('.level-list-item').forEach(item => item.classList.remove('active'));
            levelItem.classList.add('active');
            renderLevelDetails(level);
        });
        sidebar.appendChild(levelItem);
    });

    // Automatically click the first level to show its details on initial load
    if (processedLevels.length > 0 && !detailsContainer.innerHTML.trim()) {
        document.querySelector('.level-list-item').click();
    }
}

function renderLevelDetails(level) {
    const container = document.getElementById('level-details-container');
    const victorsSidebar = document.getElementById('level-victors-list');

    if (!container || !victorsSidebar) return;
    
    // --- 1. RENDER LEVEL DETAILS (CENTER PANEL) ---
    // Note: The video link needs to be converted from a standard watch URL to an embed URL
    const embedUrl = level.ytLink.includes('watch?v=') ? level.ytLink.replace("watch?v=", "embed/") : level.ytLink;

    container.innerHTML = `
        <h3 class="level-title">${level.name} <span class="level-verifier">// Verified by ${level.verifier}</span></h3>
        <p class="level-description">${level.description}</p>
        
        <div class="video-placeholder">
            <iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        
        <div class="level-info-row">
            <p><strong>Level ID:</strong> ${level.id}</p>
            <p><strong>Publisher:</strong> ${level.publisher}</p>
            <p><strong>FHLL Points:</strong> ${level.fhllPoints}</p>
            <p><strong>Top 1 Date:</strong> ${level.top1Date}</p>
            <p><strong>Safe Endscreen:</strong> ${level.safeEndscreen}</p>
            <p><strong>EDEL Enjoyment:</strong> ${level.edelEnjoyment}</p>
        </div>
    `;

    // --- 2. RENDER VICTOR LIST (RIGHT SIDEBAR) ---
    victorsSidebar.innerHTML = `<h3>Victors (${level.victors.length})</h3>`;
    if (level.victors && level.victors.length > 0) {
        victorsSidebar.innerHTML += `
            <div class="victor-header-no-enjoyment">
                <span>Player</span>
                <span class="right-text">Video</span>
            </div>
        `;
        level.victors.forEach(victor => {
            victorsSidebar.innerHTML += `
                <div class="victor-item-no-enjoyment">
                    <span class="victor-name">${victor.name}</span>
                    <span class="right-text"><a href="${victor.video}" target="_blank" class="victor-video-link">🔗</a></span>
                </div>
            `;
        });
    } else {
        victorsSidebar.innerHTML += '<p style="margin-top: 10px;">No records submitted yet.</p>';
    }
}

// ----------------------------------------------------------------------
// --- LEADERBOARD LOGIC (AUTOMATIC CALCULATION FIXED) ---
// ----------------------------------------------------------------------

function calculateLeaderboardData() {
    const playerStats = {};

    processedLevels.forEach(level => {
        const points = level.fhllPoints || 0;
        
        // 1. Add points to victors
        level.victors.forEach(victor => {
            const username = victor.name;
            if (!playerStats[username]) {
                playerStats[username] = { points: 0, levelsBeaten: 0, hardestLevel: null, hardestRank: Infinity };
            }
            playerStats[username].points += points;
            playerStats[username].levelsBeaten += 1;
            
            // Track Hardest Level
            if (level.rank < playerStats[username].hardestRank) {
                playerStats[username].hardestLevel = level.name;
                playerStats[username].hardestRank = level.rank;
            }
        });

        // 2. Add points to the verifier (assuming 50% of level points for verification)
        const verifierUsername = level.verifier;
        const verifierPoints = Math.round(points * 0.5); 
        
        if (!playerStats[verifierUsername]) {
            playerStats[verifierUsername] = { points: 0, levelsBeaten: 0, hardestLevel: 'N/A', hardestRank: Infinity };
        }
        playerStats[verifierUsername].points += verifierPoints;
        // Optionally track verification count here if needed
    });

    // Convert object to array and sort
    let leaderboard = Object.keys(playerStats).map(username => ({
        username: username,
        ...playerStats[username]
    }));

    // Sort: 1. By total points (desc) 2. By hardest level rank (asc, lower number is harder)
    leaderboard.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        // Fallback: Hardest level rank (lower is better)
        return a.hardestRank - b.hardestRank; 
    });

    // Assign final rank
    leaderboard = leaderboard.map((player, index) => ({
        ...player,
        rank: index + 1
    }));
    
    return leaderboard;
}

function renderLeaderboard(page = 1) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    const leaderboardData = calculateLeaderboardData();
    
    if (!leaderboardBody) return;
    
    // Pagination logic (simplified for now)
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedData = leaderboardData.slice(startIndex, endIndex);

    leaderboardBody.innerHTML = '';
    
    if (paginatedData.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="5">Leaderboard is empty. Submit a record!</td></tr>';
        return;
    }

    paginatedData.forEach(player => {
        const row = leaderboardBody.insertRow();
        row.insertCell().textContent = player.rank;
        row.insertCell().textContent = player.username;
        row.insertCell().textContent = player.points;
        row.insertCell().textContent = player.hardestLevel || 'N/A';
        row.insertCell().textContent = player.levelsBeaten;
    });
}


// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Process the data first
    processLevelData();

    // 2. Setup all page-specific elements (Form dropdown)
    setupSubmitPage(); 
    
    // 3. Handle initial page load based on URL hash
    const hash = window.location.hash.substring(1) || 'home';
    
    // The changePage function handles calling the correct render functions
    changePage(hash); 
});

function changePage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }
    
    // Call page-specific setup functions when needed
    if (pageId === 'submit') {
        setupSubmitPage();
    } else if (pageId === 'list') {
        renderLevelList();
    } else if (pageId === 'leaderboard') {
        renderLeaderboard(1);
    }
}
