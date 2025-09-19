// data.js

// --- 1. LEVELS DATA ---
// NOTE: Levels must be listed in order of difficulty (Current #1 down to #55).
// The POINTS will be calculated automatically based on this order.
// enjoyment: The value here is a placeholder and will be overwritten by the mean calculation.

const LEVEL_DATA = [
    {
        name: "Thinking Space II",
        creator: "CairoX",
        verifier: "Zoink",
        id: "119544028",
        video: "https://www.youtube.com/watch?v=CELNmHwln_c",
        description: "A mindscape of pure insanity, most fall to its brutal nature. Gameplay by CoCy team, deco hosted by DrCuber, Verified by Zoink. Dedicated to Hideki <3",
        dateAsTop1: "N/A", // Example date
        endscreenDeath: "Yes", // New field
        publisher: "CairoX" // Using 'creator' for design, 'publisher' for list data
    },
    {
        name: "Tidal Wave buffed",
        creator: "OniLinkGD",
        verifier: "wPopoff",
        id: "116732736",
        video: "https://m.youtube.com/watch?v=1-ihSeRCpds",
        description: "April fools but real!",
        dateAsTop1: "N/A",
        endscreenDeath: "Yes",
        publisher: "wPopoff"
    },
    {
        name: "Tidal Wave",
        creator: "OniLinkGD",
        verifier: "Zoink",
        id: "86407629",
        video: "https://youtu.be/9fsZ014qB3s?si=PrZssw-Ly_4KvLZ0&t=2",
        description: "Drown them",
        dateAsTop1: "2024-02-18",
        endscreenDeath: "Yes",
        publisher: "OniLinkGD"
    },
    {
        name: "Silent clubstep",
        creator: "TheRealSailent",
        verifier: "Paqoe",
        id: "4125776",
        video: "https://youtu.be/GR4OMkS3SN8?si=-4h_hz6ZhiLdISka&t=4",
        description: "7 years and you still play me?!",
        dateAsTop1: "N/A",
        endscreenDeath: "No",
        publisher: "TheRealSailent"
    },
    {
        name: "Avernus",
        creator: "PockeWindfish",
        verifier: "Zoink",
        id: "89496627",
        video: "https://youtu.be/16Zh8jssanc",
        description: "By Bo & Kyhros - https://discord.gg/YcNkfHMJGv",
        dateAsTop1: "2023-10-16",
        endscreenDeath: "Yes",
        publisher: "OniLinkGD"
    },
    // ... You will add the other 51 former hardest levels here ...
];

// --- 2. VICTOR COMPLETIONS DATA ---
// Each entry is a successful completion of a level on the list.
// NOTE: 'enjoyment' is now crucial here (0.0 to 10.0 or null/undefined for N/A)

const VICTOR_COMPLETIONS = [
    // Format: { player: "USERNAME", level: "LEVEL NAME", date: "YYYY-MM-DD", video: "YOUTUBE_LINK", enjoyment: "X.X" }
    { player: "NO", level: "no", date: "2023-01-20", video: "https://www.youtube.com/watch?v=ZOINK_ACHERON", enjoyment: "9.5" },
    // N/A enjoyment
    // ... Add all other victor completions here ...
];
