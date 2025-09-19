// data.js

// --- 1. LEVELS DATA ---
// NOTE: Levels must be listed in order of difficulty (Current #1 down to #55).
// The POINTS will be calculated automatically based on this order.
// enjoyment: The value here is a placeholder and will be overwritten by the mean calculation.

const LEVEL_DATA = [
    {
        name: "Acheron",
        creator: "Renn241",
        verifier: "Zoink",
        id: "87346124",
        video: "https://www.youtube.com/watch?v=ACHERON_VIDEO_ID",
        description: "The current hardest extreme demon.",
        dateAsTop1: "2023-01-20", // Example date
        endscreenDeath: "Possible (0-100% Death)", // New field
        publisher: "Renn241" // Using 'creator' for design, 'publisher' for list data
    },
    {
        name: "Slaughterhouse",
        creator: "RazorBlade",
        verifier: "Greg",
        id: "77777777",
        video: "https://www.youtube.com/watch?v=SLAUGHTERHOUSE_VIDEO_ID",
        description: "A very long and intense silent-style extreme demon.",
        dateAsTop1: "2021-08-15",
        endscreenDeath: "Not Possible (Safe)",
        publisher: "RazorBlade"
    },
    {
        name: "Tartarus",
        creator: "Dolphy",
        verifier: "EOL",
        id: "60000000",
        video: "https://www.youtube.com/watch?v=TARTARUS_VIDEO_ID",
        description: "The former hardest that defined a generation.",
        dateAsTop1: "2019-12-11",
        endscreenDeath: "Not Possible (Safe)",
        publisher: "Dolphy"
    },
    {
        name: "Bloodbath",
        creator: "Asonicmen",
        verifier: "Riot",
        id: "10565866",
        video: "https://www.youtube.com/watch?v=BLOODBATH_VIDEO_ID",
        description: "The legendary former hardest.",
        dateAsTop1: "2015-05-18",
        endscreenDeath: "Not Possible (Safe)",
        publisher: "Asonicmen"
    }
    // ... You will add the other 51 former hardest levels here ...
];

// --- 2. VICTOR COMPLETIONS DATA ---
// Each entry is a successful completion of a level on the list.
// NOTE: 'enjoyment' is now crucial here (0.0 to 10.0 or null/undefined for N/A)

const VICTOR_COMPLETIONS = [
    // Format: { player: "USERNAME", level: "LEVEL NAME", date: "YYYY-MM-DD", video: "YOUTUBE_LINK", enjoyment: "X.X" }
    { player: "Zoink", level: "Acheron", date: "2023-01-20", video: "https://www.youtube.com/watch?v=ZOINK_ACHERON", enjoyment: "9.5" },
    { player: "PlayerA", level: "Acheron", date: "2023-05-10", video: "https://www.youtube.com/watch?v=A_ACHERON", enjoyment: "8.8" },
    { player: "PlayerB", level: "Slaughterhouse", date: "2021-12-01", video: "https://www.youtube.com/watch?v=B_SH", enjoyment: "7.9" },
    { player: "Zoink", level: "Slaughterhouse", date: "2021-09-01", video: "https://www.youtube.com/watch?v=ZOINK_SH", enjoyment: "9.1" },
    { player: "PlayerC", level: "Tartarus", date: "2020-03-20", video: "https://www.youtube.com/watch?v=C_TARTARUS", enjoyment: "6.0" },
    { player: "PlayerB", level: "Tartarus", date: "2020-05-25", video: "https://www.youtube.com/watch?v=B_TARTARUS", enjoyment: "7.5" },
    { player: "Riot", level: "Bloodbath", date: "2015-05-18", video: "https://www.youtube.com/watch?v=RIOT_BB", enjoyment: "9.8" },
    { player: "Rando", level: "Bloodbath", date: "2015-05-18", video: "https://www.youtube.com/watch?v=Rando_BB", enjoyment: null }, // N/A enjoyment
    // ... Add all other victor completions here ...
];
