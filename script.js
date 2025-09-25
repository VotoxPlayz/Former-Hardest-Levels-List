// script.js

// --- 1. CONFIGURATION ---
const PLAYERS_PER_PAGE = 50;

// --- 2. CORE UTILITY FUNCTIONS ---

// Function to calculate the exponential points
function calculatePoints(rank, totalLevels) {
    const maxPoints = 500;
    const minPoints = 1;
    const normalizedRank = totalLevels - rank + 1;
    const exponent = 2.5;
    const scaledPoints = (maxPoints - minPoints) * Math.pow(((totalLevels - rank) / (totalLevels - 1)), exponent) + minPoints;
    return Math.round(scaledPoints);
}

// Function to calculate the mean EDEL enjoyment from victors (ignoring N/A)
function calculateMeanEnjoyment(levelName) {
    const validEnjoyments = VICTOR_COMPLETIONS
        .filter(v => v.level === levelName && v.enjoyment !== null && v.enjoyment !== undefined && !isNaN(parseFloat(v.enjoyment)))
        .map(v => parseFloat(v.enjoyment));

    if (validEnjoyments.length === 0) {
        return "N/A";
    }

    const sum = validEnjoyments.reduce((acc, val) => acc + val, 0);
    return (sum / validEnjoyments.length).toFixed(2);
}

// --- 3. DATA PROCESSING AND RENDERING ---

let processedLevels = [];
let currentPage = 1;

function initializeList() {
    const totalLevels = LEVEL_DATA.length;

    // 1. Calculate points for each level and store them, including mean enjoyment
    processedLevels = LEVEL_DATA.map((level, index) => {
        const rank = index + 1;
        const points = calculatePoints(rank, totalLevels);
        const meanEnjoyment = calculateMeanEnjoyment(level.name);
        return { ...level, rank, points, enjoyment: meanEnjoyment };
    });

    // 2. Build the main level list sidebar
    renderLevelList();

    // 3. Initial content setup for the Submit Page
    setupSubmitPage();
}

function renderLevelList() {
    const listContainer = document.getElementById('level-list-sidebar');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    processedLevels.forEach((level) => {
        const listItem = document.createElement('div');
        listItem.className = 'level-list-item';
        listItem.dataset.levelName = level.name;
        // The structure for buttons is in HTML/CSS, this just populates the content
        listItem.innerHTML = `
            <span class="level-rank">#${level.rank}</span>
            <span class="level-name">${level.name}</span>
            <span class="level-creator">by ${level.creator}</span>
        `;
        listItem.addEventListener('click', () => displayLevelDetails(level));
        listContainer.appendChild(listItem);
    });

    // Display details for the current #1 level on load
    if (processedLevels.length > 0) {
        displayLevelDetails(processedLevels[0]);
    }
}

function displayLevelDetails(level) {
    const detailsContainer = document.getElementById('level-details-container');
    const victorsContainer = document.getElementById('level-victors-list');

    if (!detailsContainer || !victorsContainer) return;

    // Determine simplified endscreen death status:
    const endscreenStatusValue = level.endscreenDeath === 'Possible' ? 'No' : 'Yes';
     
    // A. Update Level Details (Center Column)
    detailsContainer.innerHTML = `
        <h2 class="level-title">${level.name} // <span class="level-verifier">Verified by ${level.verifier}</span></h2>
         
        <p class="level-description"><strong>${level.description}</strong></p>

        <div class="video-placeholder">
            <iframe src="${level.video.replace('watch?v=', 'embed/').split('&')[0]}" frameborder="0" allowfullscreen></iframe>
        </div>
         
        <div class="level-info-row top-row">
            <p><strong>Level ID:</strong> ${level.id}</p>
            <p><strong>Publisher:</strong> ${level.publisher}</p>
            <p><strong>FHLL Points:</strong> ${level.points}</p>
        </div>
        <div class="level-info-row bottom-row">
            <p><strong>EDEL Enjoyment:</strong> ${level.enjoyment}</p>
            <p><strong>Top 1 Date:</strong> ${level.dateAsTop1}</p>
            <p>
                <strong>Safe Endscreen:</strong> 
                ${endscreenStatusValue}
            </p>
        </div>
    `;

    // B. Update Victors List (Right Column) - Filter out the verifier from the victor list
    const verifierName = level.verifier;

    const levelVictors = VICTOR_COMPLETIONS.filter(v => v.level === level.name && v.player !== verifierName)
                                           .sort((a, b) => {
                                               // Sort by date chronologically
                                               if (a.date && b.date) {
                                                   return new Date(a.date) - new Date(b.date);
                                               }
                                               return 0;
                                           });

    victorsContainer.innerHTML = `
        <h3>Victors (${levelVictors.length})</h3>
        <div class="victor-header-no-enjoyment">
            <span>Name:</span>
            <span class="right-text">Video:</span>
        </div>
    `;

    levelVictors.forEach(victor => {
        const victorItem = document.createElement('div');
        victorItem.className = 'victor-item-no-enjoyment'; 
        victorItem.innerHTML = `
            <span class="victor-name">${victor.player}</span>
            <a href="${victor.video}" target="_blank" class="victor-video-link right-text">▶️</a>
        `;
        victorsContainer.appendChild(victorItem);
    });
}

// --- 4. LEADERBOARD CALCULATION AND RENDERING ---

let calculatedLeaderboard = [];

function calculateLeaderboard() {
    const playerScores = {}; 

    // Helper function to initialize player data structure
    const initPlayer = (player) => {
        if (!playerScores[player]) {
            playerScores[player] = { 
                points: 0, 
                levelsBeaten: new Set(), 
                hardestLevel: { name: "", points: 0 } 
            };
        }
    };

    // 1. Process Verifier Points (The primary source of points)
    processedLevels.forEach(level => {
        const verifier = level.verifier;
        initPlayer(verifier);

        // Add points for verifying the level
        playerScores[verifier].points += level.points;
        playerScores[verifier].levelsBeaten.add(level.name);

        // Update hardest level if applicable
        if (level.points > playerScores[verifier].hardestLevel.points) {
            playerScores[verifier].hardestLevel = { name: level.name, points: level.points };
        }
    });

    // 2. Process Victor Points (Only for non-verifier completions)
    VICTOR_COMPLETIONS.forEach(completion => {
        const level = processedLevels.find(l => l.name === completion.level);
        if (!level) return;

        const player = completion.player;
        const verifier = level.verifier;

        // SKIP if the player is the verifier for this specific level (avoid double counting/override)
        if (player === verifier) {
            return;
        }

        initPlayer(player);
         
        // Add points for beating the level (as a victor)
        playerScores[player].points += level.points;
        playerScores[player].levelsBeaten.add(level.name);

        if (level.points > playerScores[player].hardestLevel.points) {
            playerScores[player].hardestLevel = { name: level.name, points: level.points };
        }
    });

    // 3. Finalize and Sort Leaderboard
    let leaderboard = Object.keys(playerScores).map(player => ({
        username: player,
        points: playerScores[player].points,
        levelsBeaten: playerScores[player].levelsBeaten.size,
        hardestLevel: playerScores[player].hardestLevel,
    }));

    // Sort by: 1. Points (descending), 2. Hardest Level Points (descending)
    leaderboard.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points; 
        }
        return b.hardestLevel.points - a.hardestLevel.points; 
    });

    calculatedLeaderboard = leaderboard;
}

function renderLeaderboard(page = 1) {
    // Re-run initialization if the list is empty (fixes initial load issue on leaderboard page)
    if (processedLevels.length === 0) {
        initializeList();
    }
     
    // Ensure leaderboard is calculated before rendering
    if (calculatedLeaderboard.length === 0) {
        calculateLeaderboard();
    }
     
    currentPage = page;
    const leaderboardBody = document.getElementById('leaderboard-body');
    const paginationControls = document.getElementById('leaderboard-pagination');
    if (!leaderboardBody || !paginationControls) return;

    leaderboardBody.innerHTML = '';
    paginationControls.innerHTML = '';

    const totalPlayers = calculatedLeaderboard.length;
    const totalPages = Math.ceil(totalPlayers / PLAYERS_PER_PAGE);
    const start = (page - 1) * PLAYERS_PER_PAGE;
    const end = start + PLAYERS_PER_PAGE;

    const playersToShow = calculatedLeaderboard.slice(start, end);

    playersToShow.forEach((player, index) => {
        const globalRank = start + index + 1;
        const row = leaderboardBody.insertRow();
        row.innerHTML = `
            <td>#${globalRank}</td>
            <td>${player.username}</td>
            <td>${player.points}</td>
            <td>${player.hardestLevel.name}</td>
            <td>${player.levelsBeaten}</td>
        `;
    });

    // Render Pagination Controls
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = (i === currentPage ? 'active' : '');
        btn.onclick = () => renderLeaderboard(i);
        paginationControls.appendChild(btn);
    }
}


// --- 5. SUBMIT PAGE SETUP AND LOGIC ---
function setupSubmitPage() {
    const levelSelect = document.getElementById('submit-level-select');
    const rawFootageInput = document.getElementById('raw-footage');
    const rawFootageLabel = document.querySelector('label[for="raw-footage"]');

    if (!levelSelect) return;

    // FIX: Clear the dropdown before populating it again to prevent duplicates
    levelSelect.innerHTML = '<option value="">Select a Level</option>';

    // Populate the dropdown with levels from the list
    processedLevels.forEach(level => {
        const option = document.createElement('option');
        option.value = level.name;
        option.textContent = `#${level.rank} - ${level.name}`;
        option.dataset.rank = level.rank;
        levelSelect.appendChild(option);
    });

    // Event listener for conditional raw footage requirement
    levelSelect.addEventListener('change', () => {
        const selectedOption = levelSelect.options[levelSelect.selectedIndex];
        const rank = parseInt(selectedOption.dataset.rank);
         
        // Raw footage required for Top 15
        const isTop15 = rank > 0 && rank <= 15;

        if (isTop15) {
            rawFootageLabel.innerHTML = 'Raw Footage: <span class="required-asterisk">*</span>';
            rawFootageInput.required = true;
        } else {
            rawFootageLabel.innerHTML = 'Raw Footage (Optional):';
            rawFootageInput.required = false;
        }
    });
     
    // Initial check (in case Acheron is default selected, or no level selected)
    levelSelect.dispatchEvent(new Event('change'));

    // Setup Best Run Percentage input change listener for integer enforcement
    const bestRunInput = document.getElementById('best-run'); // Targeting the new ID
    bestRunInput.addEventListener('change', (e) => {
        const value = e.target.value;
        const intValue = parseInt(value);

        if (value === "") {
            // Allow empty string if not provided
            return; 
        }

        if (isNaN(intValue) || intValue < 0 || intValue > 100) {
             alert("Best Run Percentage must be a whole number between 0 and 100.");
             e.target.value = "";
             return;
        }

        // Ensure it's stored as an integer string (e.g., "98", not "98.0")
        e.target.value = intValue.toString();
    });

    // Setup submission form handler
    const submitForm = document.querySelector('.submission-form');
    submitForm.addEventListener('submit', (e) => {
        // --- KEY CHANGE ---
        // 1. Set the flag to trigger the alert in the iframe's onload
        window.submitted = true;
        
        // 2. We are REMOVING e.preventDefault() to allow the form to submit to Google Forms.
        // e.preventDefault(); 
        
        // In a live site, no other action is needed here besides setting the flag.
        // The form handles the submission, and the iframe handles the feedback.
    });
}


// Ensure the initialize function runs once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeList);
