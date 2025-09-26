// Function for showing/hiding pages
function changePage(pageId) {
    // 1. Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });

    // 2. Show the target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }
    
    // 3. Update URL hash for clean navigation
    window.location.hash = pageId;

    // 4. Load specific content if needed
    if (pageId === 'leaderboard') {
        loadLeaderboard();
    } else if (pageId === 'list') {
        renderLevelList();
    } else if (pageId === 'submit') {
        populateLevelSelect(); // Ensure dropdown is populated/fixed when viewing the form
    }
}

// Function to populate the level select dropdown (Fixes Duplication)
function populateLevelSelect() {
    const levelSelect = document.getElementById('submit-level-select');
    
    // CRITICAL FIX: Clear existing options (starting after the 'Select a Level' option)
    for (let i = levelSelect.options.length - 1; i > 0; i--) {
        levelSelect.remove(i);
    }
    
    // Use the global LEVEL_DATA array (assumed to be in data.js)
    if (typeof LEVEL_DATA !== 'undefined' && Array.isArray(LEVEL_DATA)) {
        LEVEL_DATA.forEach((level, index) => {
            const option = document.createElement('option');
            // Assuming your LEVEL_DATA is sorted by rank
            const rank = index + 1;
            option.value = `#${rank} - ${level.name}`; 
            option.textContent = `#${rank} - ${level.name}`;
            levelSelect.appendChild(option);
        });
    } else {
        console.error("LEVEL_DATA is not defined or is not an array. Check data.js.");
    }
}


// Function to run when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine which page to show on load (based on URL hash or default to home)
    const initialPage = window.location.hash.substring(1) || 'home';
    changePage(initialPage);
    
    // 2. Pre-populate the level list and leaderboard
    populateLevelSelect();
    loadLeaderboard(); 
    renderLevelList(); 
});


/* --- Placeholder/Dummy Functions for other pages --- */

let currentPage = 1;
const recordsPerPage = 10;

function loadLeaderboard(page = 1) {
    // This function can be filled with your actual data fetching for the leaderboard
    // For now, it uses simple placeholder data.
    currentPage = page;
    const leaderboardBody = document.getElementById('leaderboard-body');
    const paginationContainer = document.getElementById('leaderboard-pagination');
    
    // Simple placeholder data
    const leaderboardData = [
        { rank: 1, username: 'Player1', points: 1500, hardest: 'Flamewall' },
        { rank: 2, username: 'Player2', points: 1200, hardest: 'Thinking Space II' },
        { rank: 3, username: 'Player3', points: 900, hardest: 'Tidal Wave buffed' },
        // Add more dummy data here...
    ];
    
    leaderboardBody.innerHTML = '';
    paginationContainer.innerHTML = '';

    if (leaderboardData.length === 0) {
        leaderboardBody.innerHTML = '<tr><td colspan="4">Leaderboard data is currently unavailable.</td></tr>';
        return;
    }

    // (Pagination and data rendering logic would go here)
    leaderboardData.forEach(player => {
        const row = leaderboardBody.insertRow();
        row.insertCell().textContent = player.rank;
        row.insertCell().textContent = player.username;
        row.insertCell().textContent = player.points;
        row.insertCell().textContent = player.hardest;
    });
}

function renderLevelList() {
    // This function can be filled with your logic to render the three-column list layout
    const sidebar = document.getElementById('level-list-sidebar');
    if (typeof LEVEL_DATA !== 'undefined' && Array.isArray(LEVEL_DATA)) {
        sidebar.innerHTML = '<h3>FHLL Levels</h3>';
        LEVEL_DATA.forEach((level, index) => {
            const levelItem = document.createElement('p');
            levelItem.textContent = `#${index + 1} - ${level.name}`;
            // Add click listener to show details here if needed
            sidebar.appendChild(levelItem);
        });
    }
}
