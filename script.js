// script.js

// Global variable to hold the processed, sorted level data
let processedLevels = [];

/**
 * Processes the raw LEVEL_DATA, calculates rank, and merges victors.
 * NOTE: The 'fhllPoints' field is assumed to be calculated dynamically 
 * or added by a separate function not defined here.
 */
function processLevelData() {
    if (typeof LEVEL_DATA !== 'undefined' && Array.isArray(LEVEL_DATA)) {
        processedLevels = LEVEL_DATA.map((level, index) => {
            const rank = index + 1;

            // 1. Assign Rank.
            // 2. Assign a default fhllPoints field if it doesn't exist. This is the field 
            //    used everywhere else for consistency, assuming your external calculation will populate it.
            const fhllPoints = level.fhllPoints || 0; 
            
            // 3. Merge Victors from VICTOR_COMPLETIONS (assumes VICTOR_COMPLETIONS is defined in data.js)
            const victors = (typeof VICTOR_COMPLETIONS !== 'undefined' && Array.isArray(VICTOR_COMPLETIONS))
                ? VICTOR_COMPLETIONS.filter(victor => victor.levelName === level.name)
                : [];
            
            return {
                ...level,
                rank: rank,
                fhllPoints: fhllPoints,
                victors: victors
            };
        });
    } else {
        console.error("LEVEL_DATA is undefined or not an array. Please check data.js.");
    }
}

/**
 * Sets up the submission page: populates the level dropdown and adds event listeners.
 */
function setupSubmitPage() {
    const levelSelect = document.getElementById('submit-level-select');
    const rawFootageInput = document.getElementById('raw-footage-input'); 
    
    if (!levelSelect || !rawFootageInput) return;

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
    handleLevelChange(); 
}

// Handler function for level select change
function handleLevelChange() {
    const levelSelect = document.getElementById('submit-level-select');
    const rawFootageInput = document.getElementById('raw-footage-input');
    const rawFootageLabel = document.querySelector('label[for="raw-footage-input"]');
    
    if (!levelSelect || !rawFootageInput || !rawFootageLabel) return;
    
    const selectedOption = levelSelect.options[levelSelect.selectedIndex];
    const rank = parseInt(selectedOption.dataset.rank, 10) || 0;
    
    // Logic: Raw footage is mandatory for Top 15 (rank 1 to 15)
    if (rank > 0 && rank <= 15) {
        rawFootageInput.setAttribute('required', 'true');
        rawFootageLabel.innerHTML = 'Raw Footage <span style="color:red;">(Required for Top 15):</span>';
    } else {
        rawFootageInput.removeAttribute('required');
        rawFootageLabel.innerHTML = 'Raw Footage (Optional):';
    }
}

// ----------------------------------------------------------------------
// --- LIST PAGE LOGIC (FIXED) ---
// ----------------------------------------------------------------------

function renderLevelList() {
    const sidebar = document.getElementById('level-list-sidebar');
    const detailsContainer = document.getElementById('level-details-container');
    const victorsSidebar = document.getElementById('level-victors-list');

    if (!sidebar) return;

    // Clear and reset all containers
    sidebar.innerHTML = '<h3>FHLL Levels</h3>';
    detailsContainer.innerHTML = '';
    victorsSidebar.innerHTML = '';
    
    if (processedLevels.length === 0) {
        sidebar.innerHTML += '<p>No levels loaded from data.js.</p>';
        return;
    }

    // Populate the sidebar
    processedLevels.forEach(level => {
        const levelItem = document.createElement('div');
        levelItem.classList.add('level-list-item');
        // Structure the list item to match the visual in image_6acc0b.png
        levelItem.innerHTML = `<span class="level-rank">#${level.rank} - </span><span class="level-name">${level.name}</span><span class="level-creator">by ${level.creator}</span>`;
        
        levelItem.addEventListener('click', () => {
            document.querySelectorAll('.level-list-item').forEach(item => item.classList.remove('active'));
            levelItem.classList.add('active');
            renderLevelDetails(level);
        });
        sidebar.appendChild(levelItem);
    });

    // Automatically click the first level to show its details on initial load
    if (processedLevels.length > 0) {
        const firstItem = document.querySelector('.level-list-item');
        if(firstItem) firstItem.click();
    }
}

function renderLevelDetails(level) {
    const container = document.getElementById('level-details-container');
    const victorsSidebar = document.getElementById('level-victors-list');

    if (!container || !victorsSidebar) return;
    
    // --- MAPPING AND CLEANING DATA ---
    // 1. YouTube Link: Convert 'watch' URL to 'embed' URL for the iframe
    const embedUrl = level.video.includes('watch?v=') 
        ? level.video.replace("watch?v=", "embed/") 
        : (level.video.includes("youtu.be/") ? level.video.replace("youtu.be/", "youtube.com/embed/") : level.video);
    
    // 2. Safe Endscreen: Map "Impossible" to "Yes" and "Possible" to "No"
    const safeEndscreen = level.endscreenDeath === "Impossible" ? "Yes" : "No";

    // 3. EDEL Enjoyment: Display "N/A" if null or 0, otherwise format to two decimal places
    const edelDisplay = level.edelEnjoyment === null || level.edelEnjoyment === 0 ? "N/A" : level.edelEnjoyment.toFixed(2);
    
    // --- 1. RENDER LEVEL DETAILS (CENTER PANEL) ---
    container.innerHTML = `
        <h3 class="level-title">${level.name} <span class="level-verifier">// Verified by ${level.verifier}</span></h3>
        <p class="level-description">${level.description}</p>
        
        <div class="video-placeholder">
            <iframe 
                width="100%" 
                height="315" 
                src="${embedUrl}" 
                title="YouTube video player for ${level.name}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
        
        <div class="level-info-row">
            <p><strong>Level ID:</strong> ${level.id}</p>
            <p><strong>Publisher:</strong> ${level.publisher}</p>
            <p><strong>FHLL Points:</strong> ${level.fhllPoints || 'N/A'}</p>
            <p><strong>Top 1 Date:</strong> ${level.dateAsTop1}</p>
            <p><strong>Safe Endscreen:</strong> ${safeEndscreen}</p>
            <p><strong>EDEL Enjoyment:</strong> ${edelDisplay}</p>
        </div>
    `;

    // --- 2. RENDER VICTOR LIST (RIGHT SIDEBAR) ---
    victorsSidebar.innerHTML = `<h3>Victors (${level.victors.length})</h3>`;
    if (level.victors && level.victors.length > 0) {
        victorsSidebar.innerHTML += `
            <div class="victor-header">
                <span>Name</span>
                <span class="right-text">Video</span>
            </div>
        `;
        // Sort victors chronologically by date
        level.victors.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        level.victors.forEach(victor => {
            victorsSidebar.innerHTML += `
                <div class="victor-item">
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
// --- LEADERBOARD LOGIC (AUTOMATIC CALCULATION RETAINED) ---
// ----------------------------------------------------------------------

function calculateLeaderboardData() {
    const playerStats = {};

    processedLevels.forEach(level => {
        // Use the points provided on the level object (which will be 0 if not calculated/set yet)
        const points = level.fhllPoints || 0; 
        
        // 1. Add points to victors
        level.victors.forEach(victor => {
            const username = victor.name;
            if (!playerStats[username]) {
                playerStats[username] = { points: 0, levelsBeaten: 0, hardestLevel: 'N/A', hardestRank: Infinity };
            }
            playerStats[username].points += points;
            playerStats[username].levelsBeaten += 1;
            
            // Track Hardest Level (lower rank is harder)
            if (level.rank < playerStats[username].hardestRank) {
                playerStats[username].hardestLevel = level.name;
                playerStats[username].hardestRank = level.rank;
            }
        });

        // 2. Add points to the verifier (50% of level points for verification)
        const verifierUsername = level.verifier;
        const verifierPoints = Math.round(points * 0.5); 
        
        if (!playerStats[verifierUsername]) {
            playerStats[verifierUsername] = { points: 0, levelsBeaten: 0, hardestLevel: 'N/A', hardestRank: Infinity };
        }
        playerStats[verifierUsername].points += verifierPoints;
    });

    // Convert object to array and sort
    let leaderboard = Object.keys(playerStats).map(username => ({
        username: username,
        ...playerStats[username]
    }));

    // Sort: 1. By total points (desc) 2. By levels beaten (desc) 3. By hardest level rank (asc)
    leaderboard.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points; // Higher points first
        }
        if (b.levelsBeaten !== a.levelsBeaten) {
            return b.levelsBeaten - a.levelsBeaten; // More levels beaten first
        }
        return a.hardestRank - b.hardestRank; // Lower rank number is harder
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
        leaderboardBody.innerHTML = '<tr><td colspan="5">Leaderboard is currently empty.</td></tr>';
        return;
    }

    // Insert data into table rows
    paginatedData.forEach(player => {
        const row = leaderboardBody.insertRow();
        row.insertCell().textContent = player.rank;
        row.insertCell().textContent = player.username;
        row.insertCell().textContent = player.points;
        row.insertCell().textContent = player.levelsBeaten === 0 ? 'N/A' : player.hardestLevel;
        row.insertCell().textContent = player.levelsBeaten;
    });
}


// --- Initialization and Page Routing ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Process the data first
    processLevelData();

    // 2. Handle initial page load based on URL hash
    const hash = window.location.hash.substring(1) || 'home';
    
    changePage(hash); 
});

// A simple page routing function
function changePage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    
    // Show the target page
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
