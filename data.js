// data.js

/**
 * FHLL Levels Data
 * NOTE: The script calculates FHLL Points and EDEL Enjoyment (mean) dynamically.
 * The 'edelEnjoyment' value in this object represents the single official
 * EDEL enjoyment score if one exists, otherwise null/N/A.
 */
const LEVEL_DATA = [
    {
        name: "Acheron",
        creator: "Renn241",
        verifier: "Zoink",
        id: "87000000",
        video: "https://www.youtube.com/watch?v=ACHERON_VIDEO_ID",
        description: "The current hardest level in Geometry Dash.",
        dateAsTop1: "2023-01-20", 
        endscreenDeath: "Impossible", // Use "Impossible" for Safe, "Possible" for Not Safe
        publisher: "Renn241",
        edelEnjoyment: 7.5 // The official EDEL rating for the level
    },
    {
        name: "Slaughterhouse",
        creator: "RazorBlade",
        verifier: "Trueffet",
        id: "75000000",
        video: "https://www.youtube.com/watch?v=SLAUGHTERHOUSE_VIDEO_ID",
        description: "A dark, intense, and heavily decorated extreme demon.",
        dateAsTop1: "2021-08-25",
        endscreenDeath: "Possible",
        publisher: "RazorBlade",
        edelEnjoyment: 6.8
    },
    {
        name: "Tartarus",
        creator: "Dolphyd",
        verifier: "Trusta",
        id: "58000000",
        video: "https://www.youtube.com/watch?v=TARTARUS_VIDEO_ID",
        description: "The epic conclusion to the Challenge list, featuring red and black visuals.",
        dateAsTop1: "2019-12-30",
        endscreenDeath: "Impossible",
        publisher: "Dolphyd",
        edelEnjoyment: 8.0
    },
    {
        name: "Bloodbath",
        creator: "Acropolis",
        verifier: "Riot",
        id: "27000000",
        video: "https://www.youtube.com/watch?v=BLOODBATH_VIDEO_ID",
        description: "The most famous extreme demon, known for its iconic red and black theme.",
        dateAsTop1: "2015-08-11",
        endscreenDeath: "Impossible",
        publisher: "Acropolis",
        edelEnjoyment: 9.5
    },
    // Add more levels here with the new, consistent structure
];

/**
 * Record Submissions (Victors) Data
 * NOTE: 'date' is used for sorting the victor list chronologically.
 * 'enjoyment' is used for the EDEL Enjoyment mean calculation (if a number).
 */
const VICTOR_COMPLETIONS = [
    // Acheron Victors
    { player: "PlayerA", level: "Acheron", video: "https://www.youtube.com/watch?v=PLA_ACH", date: "2024-03-01", enjoyment: 9.2 },
    { player: "PlayerB", level: "Acheron", video: "https://www.youtube.com/watch?v=PLB_ACH", date: "2024-03-05", enjoyment: 8.8 },

    // Slaughterhouse Victors
    { player: "PlayerC", level: "Slaughterhouse", video: "https://www.youtube.com/watch?v=PLC_SLH", date: "2022-01-01", enjoyment: 7.0 },
    
    // Tartarus Victors
    { player: "PlayerD", level: "Tartarus", video: "https://www.youtube.com/watch?v=PLD_TAR", date: "2020-03-01", enjoyment: 8.5 },
    
    // Bloodbath Victors - Riot (Verifier) should not be listed here if he verified it.
    { player: "PlayerE", level: "Bloodbath", video: "https://www.youtube.com/watch?v=PLE_BLB", date: "2015-09-01", enjoyment: 9.0 },
    { player: "PlayerF", level: "Bloodbath", video: "https://www.youtube.com/watch?v=PLF_BLB", date: "2015-09-05", enjoyment: 8.9 },
];
