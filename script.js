// script.js

// --- 1. POINT CALCULATION LOGIC ---

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

// --- 2. DATA PROCESSING AND RENDERING ---

let processedLevels = [];

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

    // 3. Calculate and display the leaderboard (called when leaderboard page is active)
    // 4. Initial content setup for the Submit Page
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

    // A. Update Level Details (Center Column) - Matching the new sketch
    detailsContainer.innerHTML = `
        <h2 class="level-title">${level.name} // <span class="level-verifier">Verified by ${level.verifier}</span></h2>
        
        <p class="level-description">${level.description}</p>

        <div class="video-placeholder">
            <iframe src="${level.video.replace('watch?v=', 'embed/').split('&')[0]}" frameborder="0" allowfullscreen></iframe>
        </div>
        
        <div class="level-info-row">
            <p><strong>Level ID:</strong> ${level.id}</p>
            <p><strong>FHLL Points:</strong> ${level.points}</p>
            <p><strong>Average Enjoyment:</strong> ${level.enjoyment}</p>
        </div>
        <div class="level-info-row">
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
            <span>Enjoyment:</span>
            <span>Video:</span>
        </div>
    `;

    levelVictors.forEach(victor => {
        const victorItem = document.createElement('div');
        victorItem.className = 'victor-item';
        victorItem.innerHTML = `
            <span class="victor-name">${victor.player}</span>
            <span class="victor-enjoyment">${victor.enjoyment || '?'}</span>
            <a href="${victor.video}" target="_blank" class="victor-video-link">▶️</a>
        `;
        victorsContainer.appendChild(victorItem);
    });
}

// --- 3. LEADERBOARD CALCULATION AND RENDERING ---

function renderLeaderboard() {
    // 1. Calculate total points, wins, and hardest level for each player
    const playerScores = {}; // { "PlayerName": { points: N, levelsBeaten: Set<LevelName>, hardestLevel: { name: "", points: 0 } } }

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

        // Add points
        playerScores[player].points += level.points;

        // Track level beaten (using Set prevents double counting if we allowed multiple entries for one player on one level)
        playerScores[player].levelsBeaten.add(level.name);

        // Determine hardest level (based on highest point value)
        if (level.points > playerScores[player].hardestLevel.points) {
            playerScores[player].hardestLevel = { name: level.name, points: level.points };
        }
    });

    // 2. Convert object to array and sort
    let leaderboard = Object.keys(playerScores).map(player => ({
        username: player,
        points: playerScores[player].points,
        levelsBeaten: playerScores[player].levelsBeaten.size,
        hardestLevel: playerScores[player].hardestLevel,
    }));

    // Sort by: 1. Points (descending), 2. Hardest Level Points (descending)
    leaderboard.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points; // Primary sort: Total Points
        }
        return b.hardestLevel.points - a.hardestLevel.points; // Secondary sort: Hardest Level Points
    });

    // 3. Render the leaderboard table
    const leaderboardBody = document.getElementById('leaderboard-body');
    if (!leaderboardBody) return;

    leaderboardBody.innerHTML = '';
    leaderboard.forEach((player, index) => {
        const row = leaderboardBody.insertRow();
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td>${player.username}</td>
            <td>${player.points}</td>
            <td>${player.hardestLevel.name}</td>
            <td>${player.levelsBeaten}</td>
        `;
    });
}

// --- 4. SUBMIT PAGE SETUP ---
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
}

// Ensure the initialize function runs once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeList);
