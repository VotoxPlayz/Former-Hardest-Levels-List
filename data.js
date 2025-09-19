// data.js

// --- 1. LEVELS DATA ---
// NOTE: Levels must be listed in order of difficulty (Current #1 down to #55).
// The POINTS will be calculated automatically based on this order.

const LEVEL_DATA = [
    {
        name: "Acheron",
        creator: "Renn241",
        verifier: "Zoink",
        id: "87346124",
        video: "https://www.youtube.com/watch?v=ACHERON_VIDEO_ID",
        description: "The current hardest extreme demon.",
        dateAsTop1: "2023-01-20", // Example date
        enjoyment: 9.5
    },
    {
        name: "Slaughterhouse",
        creator: "RazorBlade",
        verifier: "Greg",
        id: "77777777",
        video: "https://www.youtube.com/watch?v=SLAUGHTERHOUSE_VIDEO_ID",
        description: "A very long and intense silent-style extreme demon.",
        dateAsTop1: "2021-08-15",
        enjoyment: 8.8
    },
    {
        name: "Tartarus",
        creator: "Dolphy",
        verifier: "EOL",
        id: "60000000",
        video: "https://www.youtube.com/watch?v=TARTARUS_VIDEO_ID",
        description: "The former hardest that defined a generation.",
        dateAsTop1: "2019-12-11",
        enjoyment: 7.9
    },
    // ... You will add the other 52 former hardest levels here ...
    {
        name: "Bloodbath",
        creator: "Asonicmen",
        verifier: "Riot",
        id: "10565866",
        video: "https://www.youtube.com/watch?v=BLOODBATH_VIDEO_ID",
        description: "The legendary former hardest.",
        dateAsTop1: "2015-05-18",
        enjoyment: 9.8
    }
];

// --- 2. VICTOR COMPLETIONS DATA ---
// Each entry is a successful completion of a level on the list.

const VICTOR_COMPLETIONS = [
    // Format: { player: "USERNAME", level: "LEVEL NAME (must match name in LEVEL_DATA)", date: "YYYY-MM-DD", video: "YOUTUBE_LINK" }
    { player: "Zoink", level: "Acheron", date: "2023-01-20", video: "https://www.youtube.com/watch?v=ZOINK_ACHERON" },
    { player: "PlayerA", level: "Acheron", date: "2023-05-10", video: "https://www.youtube.com/watch?v=A_ACHERON" },
    { player: "PlayerB", level: "Slaughterhouse", date: "2021-12-01", video: "https://www.youtube.com/watch?v=B_SH" },
    { player: "Zoink", level: "Slaughterhouse", date: "2021-09-01", video: "https://www.youtube.com/watch?v=ZOINK_SH" },
    { player: "PlayerC", level: "Tartarus", date: "2020-03-20", video: "https://www.youtube.com/watch?v=C_TARTARUS" },
    { player: "PlayerB", level: "Tartarus", date: "2020-05-25", video: "https://www.youtube.com/watch?v=B_TARTARUS" },
    { player: "Riot", level: "Bloodbath", date: "2015-05-18", video: "https://www.youtube.com/watch?v=RIOT_BB" },
    // ... Add all other victor completions here ...
];
