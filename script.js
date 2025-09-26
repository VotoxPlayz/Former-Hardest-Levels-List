// Global variable to hold the processed, sorted level data
let processedLevels = [];

/**
 * Processes the raw LEVEL_DATA, calculates rank, and prepares the data.
 */
function processLevelData() {
    // Check if LEVEL_DATA exists and is an array (assumed to be loaded from data.js)
    if (typeof LEVEL_DATA !== 'undefined' && Array.isArray(LEVEL_DATA)) {
        
        // Assume LEVEL_DATA is already in the desired rank order and assign rank based on position
        processedLevels = LEVEL_DATA.map((level, index) => ({
            ...level,
            rank: index + 1 // Assign 1-based rank
        }));
        
    } else {
        console.error("LEVEL_DATA is undefined or not an array. Check data.js for syntax errors.");
    }
}

/**
 * Sets up the submission page: populates the level dropdown and adds event listeners.
 */
function setupSubmitPage() {
    const levelSelect = document.getElementById('submit-level-select');
    const rawFootageInput = document.getElementById('raw-footage'); 

    // Stop if critical elements aren't found
    if (!levelSelect || !rawFootageInput) return;

    // 1. Populate the dropdown with levels
    levelSelect.length = 0; // Clear all existing options

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
    
    // 2. Initialize Raw Footage: Always visible, but NOT required initially
    // We assume the containing element is visible in the HTML/CSS now.
    rawFootageInput.removeAttribute('required'); 
    
    // 3. Add event listener to dynamically set the Raw Footage requirement
    levelSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        // Parse the rank from the custom data attribute. Use 0 if no level selected.
        const rank = parseInt(selectedOption.dataset.rank || '0', 10);
        
        // Requirement: Raw footage is mandatory for Top 15 (rank 1 to 15)
        if (rank > 0 && rank <= 15) {
            rawFootageInput.setAttribute('required', 'true');
        } else {
            rawFootageInput.removeAttribute('required');
        }
    });
}

/**
 * Initializes the entire application after the DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Process the data first
    processLevelData();

    // 2. Setup all page-specific elements
    setupSubmitPage();

    // 3. (Placeholder) Initialize Leaderboard function
    if (typeof renderLeaderboard === 'function') {
        renderLeaderboard(1);
    }
    
    // 4. Handle initial page load based on URL hash
    const hash = window.location.hash.substring(1) || 'home';
    changePage(hash);
});


// ----------------------------------------------------------------------
// Placeholder functions (Ensure these are defined if you use them elsewhere)
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
    
    // Rerun specific setup on page change
    if (pageId === 'submit') {
        setupSubmitPage();
    }
}

function renderLeaderboard(page) {
    // Your leaderboard rendering logic goes here
}
