// Global variable to hold the processed, sorted level data
let processedLevels = [];

/**
 * Processes the raw LEVEL_DATA, calculates rank, and prepares the data.
 */
function processLevelData() {
    // Check if LEVEL_DATA exists and is an array (from data.js)
    if (typeof LEVEL_DATA !== 'undefined' && Array.isArray(LEVEL_DATA)) {
        
        // Assign the rank (index + 1) and store in the global array
        // We assume LEVEL_DATA in data.js is already sorted by rank (1st position is #1)
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

    // 1. Clear existing options **after** the default one
    // We clear all but the first (index 0) which is the "Select a Level" option
    while (levelSelect.options.length > 1) {
        levelSelect.remove(1); 
    }

    // 2. Populate the dropdown with levels from the processed list
    processedLevels.forEach(level => {
        const option = document.createElement('option');
        // CRUCIAL: The value sent to Google Forms is the exact level name
        option.value = level.name;
        option.textContent = `#${level.rank} - ${level.name}`;
        option.dataset.rank = level.rank;
        levelSelect.appendChild(option);
    });
    
    // 3. Add event listener for the Raw Footage field logic (Top 15 required)
    levelSelect.removeEventListener('change', handleLevelChange); // Remove old listener first
    levelSelect.addEventListener('change', handleLevelChange);

    // Initialize state: Hide Raw Footage row by default
    rawFootageRow.style.display = 'none';
    document.getElementById('raw-footage').removeAttribute('required');
}

// Handler function for level select change
function handleLevelChange() {
    const levelSelect = document.getElementById('submit-level-select');
    const rawFootageRow = document.getElementById('raw-footage-row');
    const selectedOption = levelSelect.options[levelSelect.selectedIndex];
    const rank = parseInt(selectedOption.dataset.rank, 10);
    
    // Requirement: Raw footage is mandatory for Top 15 (rank 1 to 15)
    if (rank > 0 && rank <= 15) {
        rawFootageRow.style.display = 'flex'; // Use flex to match form layout
        document.getElementById('raw-footage').setAttribute('required', 'true');
    } else {
        rawFootageRow.style.display = 'none';
        document.getElementById('raw-footage').removeAttribute('required');
    }
}


// --- Missing Core Functions ---

// 1. Function for handling page switching (defined here for clarity)
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

// 2. Function to render the Level List (Left sidebar and initial details)
function renderLevelList() {
    const sidebar = document.getElementById('level-list-sidebar');
    const detailsContainer = document.getElementById('level-details-container');
    
    if (!sidebar) return;

    sidebar.innerHTML = '<h3>FHLL Levels</h3>'; // Clear and add title

    if (processedLevels.length === 0) {
        sidebar.innerHTML += '<p>No levels loaded from data.js.</p>';
        detailsContainer.innerHTML = '<h3>Level Details</h3><p>Select a level from the left.</p>';
        return;
    }

    // Populate the sidebar
    processedLevels.forEach(level => {
        const levelItem = document.createElement('div');
        levelItem.classList.add('level-list-item');
        levelItem.innerHTML = `<span class="level-name">#${level.rank} - ${level.name}</span><span class="level-creator">by ${level.creator}</span>`;
        
        levelItem.addEventListener('click', () => {
            // Remove 'active' from all, add to this one
            document.querySelectorAll('.level-list-item').forEach(item => item.classList.remove('active'));
            levelItem.classList.add('active');
            
            // Render the full details for the clicked level
            renderLevelDetails(level);
        });
        sidebar.appendChild(levelItem);
    });

    // Automatically select the first level on load
    if (processedLevels.length > 0) {
        document.querySelector('.level-list-item').click();
    }
}

// 3. Function to render the Level Details (Central panel)
function renderLevelDetails(level) {
    const container = document.getElementById('level-details-container');
    const victorsSidebar = document.getElementById('level-victors-list');

    if (!container || !victorsSidebar) return;
    
    // Render the Details Panel
    container.innerHTML = `
        <h3 class="level-title">${level.name} <span class="level-verifier">(Verified by ${level.verifier})</span></h3>
        <div class="video-placeholder">
            <iframe src="${level.ytLink.replace("watch?v=", "embed/")}" allowfullscreen></iframe>
        </div>
        <div class="level-info-row">
            <p><strong>Creator:</strong> ${level.creator}</p>
            <p><strong>FHLL Rank:</strong> #${level.rank}</p>
            <p><strong>ID:</strong> ${level.id}</p>
            <p><strong>Difficulty:</strong> Impossible List Tier (TBD)</p>
            <p><strong>Verifier Points:</strong> (TBD)</p>
        </div>
        <p class="level-description">${level.description}</p>
    `;

    // Render the Victors Sidebar
    victorsSidebar.innerHTML = '<h3>Victors</h3>';
    if (level.victors && level.victors.length > 0) {
        // Add header
        victorsSidebar.innerHTML += `
            <div class="victor-header-no-enjoyment">
                <span>Player</span>
                <span class="right-text">Video</span>
            </div>
        `;
        // Add victors
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

// 4. Placeholder for Leaderboard Rendering (Must be defined)
function renderLeaderboard(page) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    if (!leaderboardBody) return;
    
    // Placeholder data - replace with your actual data fetching logic
    const leaderboardData = [
        { rank: 1, username: 'TopPlayer', points: 1500, hardest: 'Flamewall', beaten: 6 },
        { rank: 2, username: 'MidPlayer', points: 900, hardest: 'Tidal Wave buffed', beaten: 4 },
        { rank: 3, username: 'NewPlayer', points: 300, hardest: 'Avernus', beaten: 2 },
    ];
    
    leaderboardBody.innerHTML = '';
    
    leaderboardData.forEach(player => {
        const row = leaderboardBody.insertRow();
        row.insertCell().textContent = player.rank;
        row.insertCell().textContent = player.username;
        row.insertCell().textContent = player.points;
        row.insertCell().textContent = player.hardest;
        row.insertCell().textContent = player.beaten;
    });
}


// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Process the data first
    processLevelData();

    // 2. Setup all page-specific elements
    setupSubmitPage(); 
    
    // 3. Handle initial page load based on URL hash
    const hash = window.location.hash.substring(1) || 'home';
    changePage(hash);
});
