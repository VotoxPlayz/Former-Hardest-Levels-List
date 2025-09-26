// Global variable to hold the processed, sorted level data
let processedLevels = [];

/**
 * Processes the raw LEVEL_DATA, calculates rank, and prepares the data.
 * Assumes LEVEL_DATA is available globally from data.js.
 */
function processLevelData() {
    // Check if LEVEL_DATA exists and is an array
    if (typeof LEVEL_DATA !== 'undefined' && Array.isArray(LEVEL_DATA)) {
        
        // 1. Sort the levels by a numerical property (e.g., illRank) if needed.
        // Since you just want them "automatically shown based on the levels in the list," 
        // we'll assume the list is already in the desired order (highest rank first).
        
        // 2. Assign the rank (index + 1) and store in the global array
        processedLevels = LEVEL_DATA.map((level, index) => ({
            ...level,
            rank: index + 1 // Assign 1-based rank based on array position
        }));
        
    } else {
        console.error("LEVEL_DATA is undefined or not an array. Check data.js for errors.");
    }
}

/**
 * Sets up the submission page: populates the level dropdown and adds event listeners.
 */
function setupSubmitPage() {
    const levelSelect = document.getElementById('submit-level-select');
    const rawFootageRow = document.getElementById('raw-footage-row');

    if (!levelSelect || !rawFootageRow) return;

    // 1. Populate the dropdown with levels from the processed list
    levelSelect.length = 0; // Clear all existing options efficiently

    // Add the default "Select a Level" option
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Select a Level";
    levelSelect.appendChild(defaultOption);

    // Add all processed levels
    processedLevels.forEach(level => {
        const option = document.createElement('option');
        // CRUCIAL: The value sent to Google Forms is the exact level name
        option.value = level.name;
        option.textContent = `#${level.rank} - ${level.name}`;
        option.dataset.rank = level.rank;
        levelSelect.appendChild(option);
    });
    
    // 2. Add event listener for the Raw Footage field logic
    levelSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        // Parse the rank from the custom data attribute
        const rank = parseInt(selectedOption.dataset.rank, 10);
        
        // Requirement: Raw footage is mandatory for Top 15 (rank 1 to 15)
        if (rank > 0 && rank <= 15) {
            rawFootageRow.style.display = 'flex'; // Use flex to match form layout
            document.getElementById('raw-footage').setAttribute('required', 'true');
        } else {
            rawFootageRow.style.display = 'none';
            document.getElementById('raw-footage').removeAttribute('required');
        }
    });

    // Initialize state: Hide Raw Footage row by default
    rawFootageRow.style.display = 'none';
    document.getElementById('raw-footage').removeAttribute('required');
}

/**
 * Initializes the entire application after the DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Process the data first
    processLevelData();

    // 2. Setup all page-specific elements
    setupSubmitPage();
    // You'd also call other setup functions here, e.g., setupListPage();

    // 3. (Placeholder) Initialize Leaderboard function
    if (typeof renderLeaderboard === 'function') {
        renderLeaderboard(1);
    }
    
    // 4. Handle initial page load based on URL hash
    const hash = window.location.hash.substring(1) || 'home';
    changePage(hash);
});


// ----------------------------------------------------------------------
// Placeholder functions (ensure these are present or defined in index.html)
// ----------------------------------------------------------------------

function changePage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId + '-page');
    if(targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
    }
    
    // Rerun specific setup on page change for the submission page
    if (pageId === 'submit') {
        setupSubmitPage();
    }
    // Rerun specific setup on page change for the list page
    if (pageId === 'list') {
        // You would call your list rendering function here, e.g., renderLevelList();
    }
}

function renderLeaderboard(page) {
    // Your leaderboard rendering logic goes here
}
