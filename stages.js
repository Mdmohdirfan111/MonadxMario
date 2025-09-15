// ===================================================================================
// STAGES.JS - Game ke saare levels ka data
//
// Changes:
// 1. Har level mein coins add kar diye gaye hain.
// 2. "Screen jump" bug ko theek karne ke liye sabhi levels ki height badha di gayi hai.
// 3. Total 6 levels hain.
// ===================================================================================

export const stageData = [
    // === LEVEL 1: THE BEGINNING ===
    {
        level: 1, width: 5000, height: 1500,
        playerStart: { x: 150, y: 1300 }, 
        goal: { x: 4850, y: 1300 },
        platforms: [
            {x:0, y:1450, w:800}, {x:950, y:1400, w:200}, {x:1300, y:1350, w:200}, 
            {x:1650, y:1400, w:150}, {x:2000, y:1450, w:1000}, {x:2300, y:1300, w:100},
            {x:2500, y:1200, w:100}, {x:2300, y:1100, w:100}, {x:3200, y:1450, w:1700}
        ],
        enemies: [
            {x: 1000, y: 1350, type: 'patrol', dist: 100, s: 2},
            {x: 2400, y: 1400, type: 'patrol', dist: 400, s: 3},
            {x: 3800, y: 1400, type: 'shooter'}
        ],
        coins: [
            {x: 1000, y: 1300}, {x: 1350, y: 1250}, {x: 2350, y: 1000},
            {x: 2550, y: 1100}, {x: 3500, y: 1350}, {x: 3600, y: 1350}, {x: 3700, y: 1350}
        ]
    },

    // === LEVEL 2: MOVING FORWARD ===
    {
        level: 2, width: 8000, height: 1800,
        playerStart: { x: 150, y: 1600 }, 
        goal: { x: 7850, y: 1050 },
        platforms: [
            {x:0, y:1750, w:600}, {x:750, y:1700, w:100}, {x:1050, y:1650, w:400},
            {x:1600, y:1750, w:800}, {x:2500, y:1650, w:150}, {x:2800, y:1550, w:150},
            {x:3100, y:1450, w:150}, {x:3500, y:1400, w:400, type:'moving', dist:300, s:2},
            {x:4200, y:1750, w:1500}, {x:5800, y:1650, w:150}, {x:6100, y:1550, w:150},
            {x:6400, y:1450, w:150}, {x:6700, y:1350, w:150}, {x:7000, y:1250, w:150},
            {x:7400, y:1150, w:500}
        ],
        enemies: [
            {x:1100, y:1600, type:'patrol', dist:200, s:2}, 
            {x:1800, y:1700, type:'patrol', dist:400, s:3},
            {x:4800, y:1700, type:'patrol', dist:250, s:4},
            {x:7500, y:1100, type: 'shooter'}
        ],
        coins: [
            {x: 775, y: 1600}, {x: 1150, y: 1550}, {x: 1700, y: 1650}, {x: 1800, y: 1650},
            {x: 1900, y: 1650}, {x: 3700, y: 1300}, {x: 4900, y: 1650}, {x: 6200, y: 1450},
            {x: 6800, y: 1250}, {x: 7600, y: 1050}
        ]
    },

    // === LEVEL 3: THE DROP ===
    {
        level: 3, width: 7000, height: 2000, 
        playerStart: { x: 100, y: 1800 }, 
        goal: { x: 6800, y: 1150 },
        platforms: [
            {x:0, y:1950, w:500}, {x:600, y:1900, w:150, type:'falling'}, 
            {x:850, y:1850, w:150, type:'falling'}, {x:1100, y:1900, w:150, type:'falling'},
            {x:1400, y:1950, w:800}, {x:2500, y:1800, w:100}, {x:2300, y:1950, w:400},
            {x:3000, y:1950, w:1500}, {x:4800, y:1900, w:100, type:'moving', dir:'vertical', dist:300, s:3},
            {x:5200, y:1600, w:400}, {x:5800, y:1500, w:100, type:'falling'},
            {x:6100, y:1400, w:100, type:'falling'}, {x:6400, y:1300, w:100, type:'falling'},
            {x:6700, y:1250, w:200}
        ],
        enemies: [
            {x:1800, y:1900, type:'patrol', dist:200, s:2},
            {x:2500, y:1750, type:'shooter'},
            {x:3500, y:1900, type:'patrol', dist:400, s:4},
            {x:5400, y:1550, type:'shooter'}
        ],
        coins: [
            {x: 650, y: 1800}, {x: 900, y: 1750}, {x: 1150, y: 1800}, {x: 1500, y: 1850},
            {x: 1600, y: 1850}, {x: 1700, y: 1850}, {x: 3800, y: 1850}, {x: 4825, y: 1600},
            {x: 5300, y: 1500}, {x: 6800, y: 1050}
        ]
    },

    // === LEVEL 4: MECHANICAL MAZE ===
    {
        level: 4, width: 9000, height: 2000,
        playerStart: { x: 200, y: 1800 },
        goal: { x: 8800, y: 1800 },
        platforms: [
            { x: 0, y: 1950, w: 500 },
            { x: 600, y: 1850, w: 200, type: 'moving', dist: 200, s: 2 },
            { x: 1200, y: 1950, w: 400 },
            { x: 1700, y: 1800, w: 100, type: 'moving', dir: 'vertical', dist: 200, s: 2.5 },
            { x: 2000, y: 1600, w: 300 },
            { x: 2500, y: 1950, w: 1000 },
            { x: 2800, y: 1800, w: 150, type: 'falling' },
            { x: 3100, y: 1750, w: 150, type: 'falling' },
            { x: 4000, y: 1850, w: 500 },
            { x: 4800, y: 1700, w: 100 },
            { x: 5200, y: 1600, w: 100 },
            { x: 5600, y: 1500, w: 100 },
            { x: 6000, y: 1700, w: 400, type: 'moving', dist: 300, s: 4 },
            { x: 7000, y: 1950, w: 2000 }
        ],
        enemies: [
            { x: 1300, y: 1900, type: 'patrol', dist: 200, s: 2 },
            { x: 2100, y: 1550, type: 'shooter' },
            { x: 3000, y: 1900, type: 'patrol', dist: 300, s: 3 },
            { x: 4200, y: 1800, type: 'shooter' },
            { x: 7500, y: 1900, type: 'patrol', dist: 500, s: 5 },
            { x: 8200, y: 1900, type: 'shooter' }
        ],
        coins: [
            { x: 700, y: 1750 }, { x: 1725, y: 1500 }, { x: 2150, y: 1500 },
            { x: 2950, y: 1700 }, { x: 3250, y: 1650 }, { x: 4900, y: 1600 },
            { x: 5300, y: 1500 }, { x: 5700, y: 1400 }, { x: 7800, y: 1850 }
        ]
    },

    // === LEVEL 5: THE CRUMBLING TOWER ===
    {
        level: 5, width: 6000, height: 2500,
        playerStart: { x: 100, y: 2300 },
        goal: { x: 5800, y: 500 },
        platforms: [
            { x: 0, y: 2450, w: 400 },
            { x: 600, y: 2300, w: 150 },
            { x: 900, y: 2150, w: 150 },
            { x: 600, y: 2000, w: 150, type: 'falling' },
            { x: 1200, y: 1900, w: 300 },
            { x: 1800, y: 1800, w: 100, type: 'moving', dir: 'vertical', dist: 400, s: 4 },
            { x: 2200, y: 1600, w: 100, type: 'falling' },
            { x: 2500, y: 1500, w: 100, type: 'falling' },
            { x: 2800, y: 1400, w: 100, type: 'falling' },
            { x: 3200, y: 1300, w: 500 },
            { x: 4000, y: 1100, w: 100 },
            { x: 4300, y: 950, w: 100 },
            { x: 4600, y: 800, w: 100 },
            { x: 5000, y: 650, w: 100, type: 'moving', dist: 200, s: 3 },
            { x: 5600, y: 600, w: 400 }
        ],
        enemies: [
            { x: 1300, y: 1850, type: 'shooter' },
            { x: 3400, y: 1250, type: 'patrol', dist: 200, s: 3 },
            { x: 4625, y: 750, type: 'shooter' }
        ],
        coins: [
            { x: 650, y: 2200 }, { x: 950, y: 2050 }, { x: 650, y: 1900 },
            { x: 1825, y: 1400 }, { x: 2350, y: 1500 }, { x: 2650, y: 1400 },
            { x: 2950, y: 1300 }, { x: 4100, y: 1000 }, { x: 4400, y: 850 },
            { x: 4700, y: 700 }
        ]
    },

    // === LEVEL 6: FINAL RUN ===
    {
        level: 6, width: 10000, height: 2000,
        playerStart: { x: 100, y: 1800 },
        goal: { x: 9800, y: 1800 },
        platforms: [
            { x: 0, y: 1950, w: 1000 },
            { x: 1200, y: 1850, w: 200, type: 'moving', dist: 250, s: 3 },
            { x: 1800, y: 1750, w: 150, type: 'falling' },
            { x: 2100, y: 1850, w: 150, type: 'falling' },
            { x: 2400, y: 1950, w: 150, type: 'falling' },
            { x: 3000, y: 1950, w: 2000 },
            { x: 5200, y: 1800, w: 100, type: 'moving', dir: 'vertical', dist: 300, s: 5 },
            { x: 5600, y: 1600, w: 400 },
            { x: 6200, y: 1950, w: 800, type: 'moving', dist: 400, s: 6 },
            { x: 7500, y: 1800, w: 100, type: 'falling' },
            { x: 7800, y: 1700, w: 100, type: 'falling' },
            { x: 8100, y: 1600, w: 100, type: 'falling' },
            { x: 8600, y: 1950, w: 2000 }
        ],
        enemies: [
            { x: 600, y: 1900, type: 'patrol', dist: 300, s: 3 },
            { x: 3500, y: 1900, type: 'patrol', dist: 500, s: 5 },
            { x: 4500, y: 1900, type: 'shooter' },
            { x: 5800, y: 1550, type: 'shooter' },
            { x: 6500, y: 1900, type: 'patrol', dist: 200, s: 8 },
            { x: 9000, y: 1900, type: 'shooter' },
            { x: 9500, y: 1900, type: 'patrol', dist: 200, s: 4 }
        ],
        coins: [
            { x: 1300, y: 1750 }, { x: 1850, y: 1650 }, { x: 2150, y: 1750 },
            { x: 2450, y: 1850 }, { x: 3800, y: 1850 }, { x: 4200, y: 1850 },
            { x: 5225, y: 1500 }, { x: 5700, y: 1500 }, { x: 6600, y: 1850 },
            { x: 7650, y: 1700 }, { x: 7950, y: 1600 }, { x: 8250, y: 1500 }
        ]
    }
];

