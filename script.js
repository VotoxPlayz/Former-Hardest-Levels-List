// script.js

// --- 1. POINT CALCULATION LOGIC ---

// Function to calculate the exponential points
function calculatePoints(rank, totalLevels) {
    // Rank 1 gets 500 points, Rank 55 gets 1 point.
    // The formula is a scaled exponential decay.
    const maxPoints = 500;
    const minPoints = 1;

    // Normalize rank (1 is highest, totalLevels is lowest)
    const normalizedRank = totalLevels - rank + 1; // e.g., if total=55, rank 1 becomes 55, rank 55 becomes 1

    // A simple exponential scaling from 1 to 55 (or whatever totalLevels is)
    // Formula: points = (maxPoints - minPoints) * ( (normalizedRank - 1) / (totalLevels - 1) )^2 + minPoints
    // Using a simpler, more direct exponential mapping:
    const exponent = 2.5; // Controls the steepness of the curve (higher = steeper drop-off)
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

    // 3. Calculate and display the leaderboard
    renderLeaderboard();
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

    // A. Update Level Details (Center Column)
    detailsContainer.innerHTML = `
        <h2 class="level-title">${level.name} // <span class="level-verifier">Verified by ${level.verifier}</span></h2>
        <p class="level-creator-info">by ${level.creator}</p>
        <div class="video-placeholder">
            <iframe src="${level.video.replace('watch?v=', 'embed/').split('&')[0]}" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="level-info-row">
            <p><strong>Level ID:</strong> ${level.id}</p>
            <p><strong>FHLL Points:</strong> ${level.points}</p>
            <p><strong>Average Enjoyment:</strong> ${level.enjoyment}</p>
        </div>
        <p class="level-description">${level.description}</p>
        <p class="level-context"><strong>Context:</strong> Held the #1 spot since ${level.dateAsTop1}.</p>
    `;

    // B. Update Victors List (Right Column)
    const levelVictors = VICTOR_COMPLETIONS.filter(v => v.level === level.name)
                                           .sort((a, b) => new Date(a.date) - new Date(b.date));

    victorsContainer.innerHTML = `<h3>Victors (${levelVictors.length})</h3>`;
    levelVictors.forEach(victor => {
        const victorItem = document.createElement('div');
        victorItem.className = 'victor-item';
        victorItem.innerHTML = `
            <span class="victor-name">${victor.player}</span>
            <span class="victor-date">${victor.date}</span>
            <a href="${victor.video}" target="_blank" class="victor-video-link">▶️</a>
        `;
        victorsContainer.appendChild(victorItem);
    });
}

// --- 3. LEADERBOARD CALCULATION AND RENDERING ---

function renderLeaderboard() {
    // 1. Calculate total points and wins for each player
    const playerScores = {}; // { "PlayerName": { points: N, wins: N, hardestLevel: "LevelName" } }

    VICTOR_COMPLETIONS.forEach(completion => {
        const level = processedLevels.find(l => l.name === completion.level);
        if (!level) return;

        const player = completion.player;

        if (!playerScores[player]) {
            playerScores[player] = { points: 0, wins: 0, hardestLevel: { name: "", points: 0 } };
        }

        // Add points
        playerScores[player].points += level.points;

        // Count win
        playerScores[player].wins += 1;

        // Determine hardest level (based on highest point value)
        if (level.points > playerScores[player].hardestLevel.points) {
            playerScores[player].hardestLevel = { name: level.name, points: level.points };
        }
    });

    // 2. Convert object to array and sort
    let leaderboard = Object.keys(playerScores).map(player => ({
        username: player,
        ...playerScores[player]
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
            <td>${player.wins}</td>
        `;
    });
}

// Ensure the initialize function runs once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeList);
