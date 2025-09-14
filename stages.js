// ===================================================================================
// STAGES.JS - Saare game levels ka data yahan hai (Total 6 Levels)
//
// Changes:
// 1. Game ko 6 levels tak expand kar diya hai.
// 2. Naye levels mein new challenges jaise vertical climbing aur complex platforming hai.
// 3. Saare levels ki height theek kar di hai taaki camera jump na kare.
// ===================================================================================

export const stageData = [
    // === LEVEL 1: THE BEGINNING ===
    {
        level: 1,
        width: 5000,
        height: 1200,
        playerStart: { x: 150, y: 600 },
        goal: { x: 4850, y: 650 },
        platforms: [
            {x: 0, y: 750, w: 800}, {x: 950, y: 700, w: 200}, {x: 1300, y: 650, w: 200},
            {x: 1650, y: 700, w: 150}, {x: 2000, y: 750, w: 1000}, {x: 2300, y: 600, w: 100},
            {x: 2500, y: 500, w: 100}, {x: 2300, y: 400, w: 100}, {x: 3200, y: 750, w: 1700},
        ],
        enemies: [
            {x: 2200, y: 700, type: 'patrol', dist: 300, s: 2},
            {x: 3500, y: 700, type: 'patrol', dist: 400, s: 3},
        ],
    },
    // === LEVEL 2: MOVING FORWARD ===
    {
        level: 2,
        width: 8000,
        height: 1500,
        playerStart: { x: 150, y: 800 },
        goal: { x: 7850, y: 250 },
        platforms: [
            {x: 0, y: 950, w: 600}, {x: 750, y: 900, w: 100}, {x: 1050, y: 850, w: 400},
            {x: 1600, y: 950, w: 800}, {x: 2500, y: 850, w: 150}, {x: 2800, y: 750, w: 150},
            {x: 3100, y: 650, w: 150}, {x: 3500, y: 600, w: 400, type: 'moving', dist: 300, s: 2},
            {x: 4200, y: 950, w: 1500}, {x: 5800, y: 850, w: 150}, {x: 6100, y: 750, w: 150},
            {x: 6400, y: 650, w: 150}, {x: 6700, y: 550, w: 150}, {x: 7000, y: 450, w: 150},
            {x: 7400, y: 350, w: 500},
        ],
        enemies: [
            {x: 1100, y: 800, type: 'patrol', dist: 200, s: 2},
            {x: 1800, y: 900, type: 'patrol', dist: 400, s: 3},
            {x: 4800, y: 900, type: 'patrol', dist: 250, s: 4},
        ],
    },
    // === LEVEL 3: THE FACTORY ===
    {
        level: 3,
        width: 7000,
        height: 1800,
        playerStart: { x: 100, y: 1000 },
        goal: { x: 6800, y: 350 },
        platforms: [
            {x: 0, y: 1150, w: 500}, {x: 600, y: 1100, w: 150, type: 'falling'},
            {x: 850, y: 1050, w: 150, type: 'falling'}, {x: 1100, y: 1100, w: 150, type: 'falling'},
            {x: 1400, y: 1150, w: 800}, {x: 2500, y: 1000, w: 100}, {x: 2300, y: 1150, w: 400},
            {x: 3000, y: 1150, w: 1500}, {x: 4800, y: 1100, w: 100, type: 'moving', dir: 'vertical', dist: 300, s: 3},
            {x: 5200, y: 800, w: 400}, {x: 5800, y: 700, w: 100, type: 'falling'},
            {x: 6100, y: 600, w: 100, type: 'falling'}, {x: 6400, y: 500, w: 100, type: 'falling'},
            {x: 6700, y: 450, w: 200},
        ],
        enemies: [
            {x: 1800, y: 1100, type: 'patrol', dist: 200, s: 2}, {x: 2500, y: 950, type: 'shooter'},
            {x: 3500, y: 1100, type: 'patrol', dist: 400, s: 4}, {x: 5400, y: 750, type: 'shooter'},
        ],
    },
    // === LEVEL 4: THE ASCENT ===
    {
        level: 4,
        width: 4000,
        height: 2500, // Kafi uncha level hai
        playerStart: { x: 200, y: 2300 },
        goal: { x: 3800, y: 150 },
        platforms: [
            {x: 0, y: 2450, w: 500}, {x: 600, y: 2300, w: 150, type: 'moving', dir: 'vertical', dist: 200, s: 2},
            {x: 900, y: 2100, w: 200}, {x: 1200, y: 1950, w: 100, type: 'falling'},
            {x: 1000, y: 1800, w: 100, type: 'falling'}, {x: 1200, y: 1650, w: 100, type: 'falling'},
            {x: 1500, y: 1500, w: 400}, {x: 2200, y: 1450, w: 150, type: 'moving', dist: 400, s: 4},
            {x: 3000, y: 1300, w: 100}, {x: 3200, y: 1150, w: 100}, {x: 3000, y: 1000, w: 100},
            {x: 2500, y: 900, w: 300}, {x: 2200, y: 750, w: 100, type: 'moving', dir: 'vertical', dist: 250, s: 3},
            {x: 2600, y: 500, w: 150}, {x: 3000, y: 400, w: 150, type: 'falling'},
            {x: 3300, y: 300, w: 150}, {x: 3700, y: 250, w: 200},
        ],
        enemies: [
            {x: 1600, y: 1450, type: 'shooter'}, {x: 2600, y: 850, type: 'patrol', dist: 150, s: 3},
            {x: 3400, y: 250, type: 'shooter'},
        ],
    },
    // === LEVEL 5: DANGER ZONE ===
    {
        level: 5,
        width: 9000,
        height: 2000,
        playerStart: { x: 150, y: 1800 },
        goal: { x: 8800, y: 300 },
        platforms: [
            {x: 0, y: 1950, w: 1000}, {x: 1200, y: 1800, w: 200, type: 'falling'},
            {x: 1600, y: 1700, w: 200, type: 'falling'}, {x: 2000, y: 1600, w: 200, type: 'falling'},
            {x: 2500, y: 1950, w: 1500}, {x: 3000, y: 1800, w: 100, type: 'moving', dir: 'vertical', dist: 300, s: 4},
            {x: 4200, y: 1950, w: 800}, {x: 5200, y: 1900, w: 200, type: 'moving', dist: 600, s: 6},
            {x: 6200, y: 1950, w: 100}, {x: 6400, y: 1800, w: 100}, {x: 6600, y: 1650, w: 100},
            {x: 7000, y: 1500, w: 1000}, {x: 7200, y: 1200, w: 150, type: 'falling'},
            {x: 7600, y: 1000, w: 150, type: 'falling'}, {x: 8000, y: 800, w: 400},
            {x: 8600, y: 600, w: 100, type: 'moving', dir: 'vertical', dist: 200, s: 5},
            {x: 8500, y: 400, w: 400},
        ],
        enemies: [
            {x: 500, y: 1900, type: 'patrol', dist: 300, s: 3}, {x: 2800, y: 1900, type: 'patrol', dist: 500, s: 5},
            {x: 3500, y: 1900, type: 'shooter'}, {x: 4500, y: 1900, type: 'shooter'},
            {x: 7400, y: 1450, type: 'patrol', dist: 400, s: 4}, {x: 8100, y: 750, type: 'shooter'},
        ],
    },
    // === LEVEL 6: THE FINAL RUN ===
    {
        level: 6,
        width: 12000,
        height: 2500,
        playerStart: { x: 100, y: 2300 },
        goal: { x: 11800, y: 200 },
        platforms: [
            {x: 0, y: 2450, w: 1500}, {x: 1600, y: 2300, w: 100, type: 'falling'},
            {x: 1800, y: 2150, w: 100, type: 'falling'}, {x: 2000, y: 2000, w: 100, type: 'falling'},
            {x: 2200, y: 1850, w: 100, type: 'falling'}, {x: 2500, y: 2450, w: 2000},
            {x: 3000, y: 2300, w: 200, type: 'moving', dist: 500, s: 5},
            {x: 4800, y: 2450, w: 1000}, {x: 5000, y: 2200, w: 150, type: 'moving', dir: 'vertical', dist: 400, s: 4},
            {x: 6000, y: 2450, w: 1500}, {x: 7800, y: 2300, w: 100, type: 'falling'},
            {x: 8000, y: 2150, w: 100, type: 'falling'}, {x: 8400, y: 2000, w: 400},
            {x: 9000, y: 1800, w: 200, type: 'moving', dist: 800, s: 8},
            {x: 10000, y: 1600, w: 100}, {x: 10300, y: 1400, w: 100},
            {x: 10600, y: 1200, w: 100}, {x: 10900, y: 1000, w: 100},
            {x: 11200, y: 800, w: 100}, {x: 11500, y: 600, w: 100},
            {x: 11000, y: 400, w: 1000},
        ],
        enemies: [
            {x: 1000, y: 2400, type: 'patrol', dist: 400, s: 3}, {x: 2800, y: 2400, type: 'shooter'},
            {x: 4000, y: 2400, type: 'patrol', dist: 600, s: 6}, {x: 5500, y: 2400, type: 'shooter'},
            {x: 6500, y: 2400, type: 'patrol', dist: 800, s: 4}, {x: 8600, y: 1950, type: 'shooter'},
            {x: 11400, y: 350, type: 'patrol', dist: 400, s: 5}, {x: 11800, y: 350, type: 'shooter'},
        ],
    },
];


