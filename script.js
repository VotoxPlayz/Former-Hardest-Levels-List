// script.js

// --- 1. CONFIGURATION ---
const PLAYERS_PER_PAGE = 50;

// --- 2. POINT CALCULATION LOGIC ---

// Function to calculate the exponential points
function calculatePoints(rank, totalLevels) {
    // Rank 1 gets 500 points, Rank 55 gets 1 point.
    const maxPoints = 500;
    const minPoints = 1;

    // Normalize rank (1 is highest, totalLevels is lowest)
    const normalizedRank = totalLevels - rank + 1;

    // Exponential scaling (exponent 2.5 for a steeper curve)
    const exponent = 2.5;
    const scaledPoints = (maxPoints - minPoints) * Math.pow(((totalLevels - rank) / (totalLevels - 1)), exponent) + minPoints;
    
    // Round to the nearest integer
    return Math.round(scaledPoints);
}

// --- 3. DATA PROCESSING AND RENDERING ---

let processedLevels = [];
let currentPage = 1; // For leaderboard pagination

function initializeList() {
    const totalLevels = LEVEL_DATA.length;

    // 1. Calculate points for each level and store them
    processedLevels = LEVEL_DATA.map((level, index) => {
        const rank = index + 1;
        const points = calculatePoints(rank, totalLevels);
        return { ...level, rank, points };
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

    // A. Update Level Details (Center Column) - NEW LAYOUT
    detailsContainer.innerHTML = `
        <h2 class="level-title">${level.name} // <span class="level-verifier">Verified by ${level.verifier}</span></h2>
        
        <p class="level-description">${level.description}</p>

        <div class="video-placeholder">
            <iframe src="${level.video.replace('watch?v=', 'embed/').split('&')[0]}" frameborder="0" allowfullscreen></iframe>
        </div>
        
        <div class="level-info-row top-row">
            <p><strong>Level ID:</strong> ${level.id}</p>
            <p><strong>FHLL Points:</strong> ${level.points}</p>
            <p><strong>Average Enjoyment:</strong> ${level.enjoyment}</p>
        </div>
        <div class="level-info-row bottom-row">
            <p><strong>Publisher:</strong> ${level.creator}</p>
            <p><strong>Top 1 Date:</strong> ${level.dateAsTop1}</p>
        </div>
    `;

    // B. Update Victors List (Right Column)
    const levelVictors = VICTOR_COMPLETIONS.filter(v => v.level === level.name)
                                           .sort((a, b) => {
                                                // Sort by date if available, or just enjoyment if needed
                                                if (a.date && b.date) {
                                                    return new Date(a.date) - new Date(b.date);
                                                }
                                                return 0;
                                           });

    victorsContainer.innerHTML = `
        <h3>Victors (${levelVictors.length})</h3>
        <div class="victor-header">
            <span>Name:</span>
            <span class="center-text">Enjoyment:</span>
            <span class="right-text">Video:</span>
        </div>
    `;

    levelVictors.forEach(victor => {
        const victorItem = document.createElement('div');
        victorItem.className = 'victor-item';
        // Note: enjoyment is validated in the submit form, but here we expect a string like "7.5"
        victorItem.innerHTML = `
            <span class="victor-name">${victor.player}</span>
            <span class="victor-enjoyment center-text">${victor.enjoyment || '?'}</span>
            <a href="${victor.video}" target="_blank" class="victor-video-link right-text">▶️</a>
        `;
        victorsContainer.appendChild(victorItem);
    });
}

// --- 4. LEADERBOARD CALCULATION AND RENDERING ---

let calculatedLeaderboard = [];

function calculateLeaderboard() {
    const playerScores = {}; 

    VICTOR_COMPLETIONS.forEach(completion => {
        const level = processedLevels.find(l => l.name === completion.level);
        if (!level) return;

        const player = completion.player;

        if (!playerScores[player]) {
            playerScores[player] = { 
                points: 0, 
                levelsBeaten: new Set(), 
                hardestLevel: { name: "", points: 0 } 
            };
        }

        playerScores[player].points += level.points;
        playerScores[player].levelsBeaten.add(level.name);

        if (level.points > playerScores[player].hardestLevel.points) {
            playerScores[player].hardestLevel = { name: level.name, points: level.points };
        }
    });

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


// --- 5. SUBMIT PAGE SETUP ---
function setupSubmitPage() {
    const levelSelect = document.getElementById('submit-level-select');
    if (!levelSelect) return;

    // Populate the dropdown with levels from the list
    processedLevels.forEach(level => {
        const option = document.createElement('option');
        option.value = level.name;
        option.textContent = `#${level.rank} - ${level.name}`;
        levelSelect.appendChild(option);
    });

    // Setup enjoyment input change listener for decimal enforcement
    const enjoymentInput = document.getElementById('enjoyment');
    enjoymentInput.addEventListener('change', (e) => {
        const value = e.target.value;
        if (value && value.indexOf('.') === -1) {
            e.target.value = parseFloat(value).toFixed(1);
        } else if (value && (value.split('.')[1] || '').length > 1) {
             e.target.value = parseFloat(value).toFixed(1);
        }
    });

    // Setup submission form handler (currently just an alert)
    const submitForm = document.querySelector('.submission-form');
    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Submission captured! In a live site, this data would be sent to a backend/spreadsheet for review.");
        // You would typically collect form data here and send it off.
    });
}


// Ensure the initialize function runs once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeList);
