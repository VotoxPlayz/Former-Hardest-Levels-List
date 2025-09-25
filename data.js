// data.js

/**
 * FHLL Levels Data
 * NOTE: The script calculates FHLL Points and EDEL Enjoyment (mean) dynamically.
 * The 'edelEnjoyment' value in this object represents the single official
 * EDEL enjoyment score if one exists, otherwise null/N/A.
 */
const LEVEL_DATA = [
    {
        name: "Flamewall",
        creator: "Narwall",
        verifier: "Cuatrocientos",
        id: "126242564",
        video: "https://www.youtube.com/watch?v=x4Io4zkWVRw",
        description: "The ultimate endurance test, in the works since 2022. | Verified by Cuatrocientos in 221.703 attempts.",
        dateAsTop1: "N/A", 
        endscreenDeath: "Impossible", // Use "Impossible" for Safe, "Possible" for Not Safe
        publisher: "UNarwall",
        edelEnjoyment: null // The official EDEL rating for the level
    },
    {
        name: "Thinking Space II",
        creator: "CairoX",
        verifier: "Zoink",
        id: "119544028",
        video: "https://www.youtube.com/watch?v=CELNmHwln_c", 
        description: "A mindscape of pure insanity, most fall to its brutal nature. Gameplay by CoCy team, deco hosted by DrCuber, Verified by Zoink. Dedicated to Hideki <3",
        dateAsTop1: "2025-09-19",
        endscreenDeath: "Impossible",
        publisher: "CairoX",
        edelEnjoyment: 0.05
    },
    {
        name: "Tidal Wave buffed",
        creator: "OniLinkGD",
        verifier: "wPopoff",
        id: "116732736",
        video: "https://www.youtube.com/watch?v=1-ihSeRCpds", 
        description: "April fools but real!",
        dateAsTop1: "N/A",
        endscreenDeath: "Impossible",
        publisher: "wPopoff",
        edelEnjoyment: null
    },
    {
        name: "Tidal Wave",
        creator: "OniLinkGD",
        verifier: "Riot",
        id: "86407629",
        video: "https://www.youtube.com/watch?v=9fsZ014qB3s", 
        dateAsTop1: "2024-02-18",
        endscreenDeath: "Impossible",
        publisher: "OniLinkGD",
        edelEnjoyment: 7.5
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
];
