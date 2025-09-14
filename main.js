// ===================================================================================
// MAIN.JS - Sirf Game ka Logic
// ===================================================================================
import { connectWallet, disconnectWallet, mintNFTReward, walletState } from './wallet.js';

// Page load hote hi yeh function chalega
window.onload = () => {
    // PART 1: SETUP (Saare HTML elements aur variables)
    const landingPage = document.getElementById('landing-page');
    const gameContainer = document.getElementById('game-container');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const playGameBtn = document.getElementById('playGameBtn');
    const getGmonadBtn = document.getElementById('getGmonadBtn');
    const messageBox = document.getElementById('message-box');
    const messageTitle = document.getElementById('message-title');
    const nextActionBtn = document.getElementById('next-action-btn');

    landingPage.style.display = 'block';
    gameContainer.style.display = 'none';

    let gameRunning = false, currentStage = 0;
    let player, camera, particles = [], projectiles = [];
    let currentStageData = { platforms: [], enemies: [], goal: {} };
    const gravity = 0.6;
    const keys = { right: false, left: false, up: false };

    // PART 2: UI aur EVENT LISTENERS

    function showMessage(title, buttonText, onButtonClick) {
        messageTitle.innerText = title;
        nextActionBtn.innerText = buttonText;
        messageBox.style.display = 'block';
        nextActionBtn.onclick = onButtonClick;
    }
    
    // --- Naye UI update functions ---
    function updateUIForConnection() {
        if (walletState.userAddress) {
            connectWalletBtn.textContent = `Disconnect (${walletState.userAddress.substring(0, 4)}...${walletState.userAddress.substring(walletState.userAddress.length - 4)})`;
            playGameBtn.disabled = false;
        }
    }

    function resetUIToDisconnected() {
        disconnectWallet();
        connectWalletBtn.textContent = 'CONNECT WALLET';
        playGameBtn.disabled = true;
    }

    // --- Connect/Disconnect Wallet button ka naya logic ---
    connectWalletBtn.addEventListener('click', async () => {
        if (walletState.userAddress) {
            // Agar pehle se connected hai, toh disconnect karo
            resetUIToDisconnected();
        } else {
            // Agar connected nahi hai, toh connect karo
            const success = await connectWallet(showMessage);
            if (success) {
                updateUIForConnection();
            }
        }
    });

    // MetaMask se account change ya disconnect detect karna
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                // User ne disconnect kiya hai
                console.log('User has disconnected their wallet.');
                resetUIToDisconnected();
            } else {
                // Account switch hua hai. UI reset karke user ko dobara connect karne ke liye bolna
                console.log('Account switched to:', accounts[0]);
                alert('You have switched accounts. Please connect again.');
                resetUIToDisconnected();
            }
        });
    }

    playGameBtn.addEventListener('click', () => {
        landingPage.style.display = 'none';
        gameContainer.style.display = 'flex';
        initStage(1);
    });
    
    getGmonadBtn.addEventListener('click', () => window.open('https://faucet.monad.xyz/', '_blank'));

    // PART 3: STAGE DATA (No changes here)
    const stageData = [
        {
            level: 1, width: 5000, height: 800,
            playerStart: { x: 150, y: 600 }, goal: { x: 4850, y: 650 },
            platforms: [{x:0,y:750,w:800},{x:950,y:700,w:200},{x:1300,y:650,w:200},{x:1650,y:700,w:150},{x:2000,y:750,w:1000},{x:2300,y:600,w:100},{x:2500,y:500,w:100},{x:2300,y:400,w:100},{x:3200,y:750,w:1700}],
            enemies: [],
        },
        {
            level: 2, width: 8000, height: 1000,
            playerStart: { x: 150, y: 800 }, goal: { x: 7850, y: 250 },
            platforms: [{x:0,y:950,w:600},{x:750,y:900,w:100},{x:1050,y:850,w:400},{x:1600,y:950,w:800},{x:2500,y:850,w:150},{x:2800,y:750,w:150},{x:3100,y:650,w:150},{x:3500,y:600,w:400,type:'moving',dist:300,s:2},{x:4200,y:950,w:1500},{x:5800,y:850,w:150},{x:6100,y:750,w:150},{x:6400,y:650,w:150},{x:6700,y:550,w:150},{x:7000,y:450,w:150},{x:7400,y:350,w:500}],
            enemies: [{x:1100,y:800,type:'patrol',dist:200,s:2},{x:1800,y:900,type:'patrol',dist:400,s:3},{x:4800,y:900,type:'patrol',dist:250,s:4}],
        },
        {
            level: 3, width: 7000, height: 1200, playerStart: { x: 100, y: 1000 }, goal: { x: 6800, y: 350 },
            platforms: [{x:0,y:1150,w:500},{x:600,y:1100,w:150,type:'falling'},{x:850,y:1050,w:150,type:'falling'},{x:1100,y:1100,w:150,type:'falling'},{x:1400,y:1150,w:800},{x:2500,y:1000,w:100},{x:2300,y:1150,w:400},{x:3000,y:1150,w:1500},{x:4800,y:1100,w:100,type:'moving',dir:'vertical',dist:300,s:3},{x:5200,y:800,w:400},{x:5800,y:700,w:100,type:'falling'},{x:6100,y:600,w:100,type:'falling'},{x:6400,y:500,w:100,type:'falling'},{x:6700,y:450,w:200}],
            enemies: [{x:1800,y:1100,type:'patrol',dist:200,s:2},{x:2500,y:950,type:'shooter'},{x:3500,y:1100,type:'patrol',dist:400,s:4},{x:5400,y:750,type:'shooter'}],
        },
    ];

    // PART 4: CORE GAME ENGINE (No changes here)
    function initStage(levelNumber) {
        const level = stageData.find(s => s.level === levelNumber);
        if (!level) { 
            gameRunning = false;
            showMessage("YOU WIN!", "Play Again?", () => initStage(1));
            return;
        }
        currentStage = levelNumber;
        currentStageData = JSON.parse(JSON.stringify(level)); 
        projectiles = []; particles = [];
        
        currentStageData.platforms.forEach(p => { p.width = p.w; p.height = p.h || 20; if (p.type === 'moving') { p.originalX = p.x; p.originalY = p.y; p.speed = p.s; p.distance = p.dist; } });
        currentStageData.enemies.forEach(e => { e.width = 40; e.height = 50; e.isDead = false; if (e.type === 'patrol') { e.originalX = e.x; e.speed = e.s; e.distance = e.dist; } if (e.type === 'shooter') { e.shootCooldown = Math.random() * 100 + 80; } });
        
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        player = { x: level.playerStart.x, y: level.playerStart.y, width: 40, height: 60, dx: 0, dy: 0, speed: 6, jumpPower: -16, onGround: false, facing: 1 };
        camera = { x: 0, y: 0, width: canvas.width, height: canvas.height, update: function () { this.x = Math.max(0, Math.min(player.x - (this.width / 2.5), currentStageData.width - this.width)); this.y = Math.max(0, Math.min(player.y - (this.height / 1.5), currentStageData.height - this.height)); } };
        
        gameRunning = true; messageBox.style.display = 'none'; gameLoop();
    }

    function gameLoop() { if (!gameRunning) return; update(); draw(); requestAnimationFrame(gameLoop); }

    function update() {
        if (keys.right) { player.dx = player.speed; player.facing = 1; } else if (keys.left) { player.dx = -player.speed; player.facing = -1; } else player.dx = 0;
        if (keys.up && player.onGround) { player.dy = player.jumpPower; createParticles(player.x + player.width / 2, player.y + player.height, 10, '#ffffff'); }
        
        player.dy += gravity; 
        const prevPlayerY = player.y;
        player.x += player.dx; 
        player.y += player.dy; 
        player.onGround = false;

        if (player.x < 0) player.x = 0; 
        if (player.x + player.width > currentStageData.width) player.x = currentStageData.width - player.width;
        if (player.y > currentStageData.height + 200) resetPlayer();
        
        currentStageData.platforms.forEach(p => { if (p.type === 'moving') { if (p.dir === 'vertical') { p.y += p.speed; if (Math.abs(p.y - p.originalY) >= p.distance) p.speed *= -1; } else { p.x += p.speed; if (Math.abs(p.x - p.originalX) >= p.distance) p.speed *= -1; } } if (p.type === 'falling' && p.isFalling) p.y += 5; });
        currentStageData.enemies.forEach(e => { if (e.isDead) return; if (e.type === 'patrol') { e.x += e.speed; if (Math.abs(e.x - e.originalX) >= e.distance) e.speed *= -1; } if (e.type === 'shooter') { e.shootCooldown--; if (e.shootCooldown <= 0) { projectiles.push({ x: e.x, y: e.y + e.height / 2, w: 15, h: 10, s: player.x < e.x ? -7 : 7 }); e.shootCooldown = 120; } } });
        projectiles.forEach((p, i) => { p.x += p.s; if (p.x < 0 || p.x > currentStageData.width) projectiles.splice(i, 1); });
        
        currentStageData.platforms.forEach(p => { 
            if (player.x + player.width > p.x && player.x < p.x + p.width && player.y + player.height > p.y && player.y < p.y + p.height) {
                if (player.dx !== 0 && (prevPlayerY + player.height > p.y && prevPlayerY < p.y + p.height)) { player.x -= player.dx; }
                if (player.dy > 0 && prevPlayerY + player.height <= p.y) { player.dy = 0; player.onGround = true; player.y = p.y - player.height; if (p.type === 'moving') player.x += p.speed; if (p.type === 'falling') p.isFalling = true; } 
                else if (player.dy < 0 && prevPlayerY >= p.y + p.height) { player.dy = 0; player.y = p.y + p.height; }
            }
        });
        
        currentStageData.enemies.forEach((e) => {
            if (e.isDead) return;
            const isColliding = player.x < e.x + e.width && player.x + player.width > e.x && player.y < e.y + e.height && player.y + player.height > e.y;
            if (isColliding) {
                const wasAbove = (prevPlayerY + player.height) <= e.y;
                if (player.dy > 0 && wasAbove) {
                    e.isDead = true; player.dy = -10; createParticles(e.x + e.width / 2, e.y, 30, '#ff4136');
                    setTimeout(() => { const index = currentStageData.enemies.indexOf(e); if (index > -1) currentStageData.enemies.splice(index, 1); }, 200);
                } else { resetPlayer(); }
            }
        });
        
        projectiles.forEach(p => { if (player.x < p.x + p.w && player.x + player.width > p.x && player.y < p.y + p.h && player.y + player.height > p.y) resetPlayer(); });
        
        const goal = currentStageData.goal; goal.w = 80; goal.h = 80;
        if (player.x + player.width > goal.x && player.x < goal.x + goal.w && player.y + player.height > goal.y && player.y < goal.y + goal.h) {
            gameRunning = false;
            createParticles(goal.x + goal.w / 2, goal.y + goal.h / 2, 100, 'gold');
            showMessage(`Stage ${currentStage} Complete!`, "Mint NFT Reward", handleMintReward);
        }
        
        camera.update(); updateParticles();
    }
    
    async function handleMintReward() {
        nextActionBtn.disabled = true; nextActionBtn.innerText = "Minting...";
        const success = await mintNFTReward(currentStage);
        if (success) {
            alert(`Congratulations! You've minted the NFT for Stage ${currentStage}!`);
            initStage(currentStage + 1);
        } else {
            // Agar minting fail hoti hai, toh button ko wapas enable kar do
            nextActionBtn.innerText = "Mint NFT Reward";
        }
        nextActionBtn.disabled = false;
    }

    function draw() {
        ctx.fillStyle = '#0d0d1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        const pFactor = 0.1; for (let i = 0; i < 50; i++) { ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5 + 0.2})`; let x = ((i * 100) - (camera.x * pFactor)) % canvas.width; let y = (i * 50 * Math.random()) % canvas.height; ctx.fillRect(x, y, 2, 2); }
        ctx.save(); ctx.translate(-camera.x, -camera.y);
        
        currentStageData.platforms.forEach(p => { if (p.type === 'moving') ctx.fillStyle = '#bada55'; else if (p.type === 'falling' && p.isFalling) ctx.fillStyle = '#f08080'; else ctx.fillStyle = '#888'; ctx.fillRect(p.x, p.y, p.width, p.height); });
        projectiles.forEach(p => { ctx.fillStyle = '#FF851B'; ctx.fillRect(p.x, p.y, p.w, p.h); });
        drawParticles(ctx);
        const goal = currentStageData.goal; goal.w = 80; goal.h = 80; ctx.fillStyle = 'gold'; ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
        currentStageData.enemies.forEach(e => { if (!e.isDead) drawAsset(e); });
        drawAsset(player);
        
        ctx.restore();
    }

    // PART 5: HELPER FUNCTIONS (No changes here)
    function resetPlayer() { createParticles(player.x + player.width / 2, player.y + player.height / 2, 50, '#ff4136'); player.x = currentStageData.playerStart.x; player.y = currentStageData.playerStart.y; player.dx = 0; player.dy = 0; }
    function createParticles(x, y, c, color) { for (let i = 0; i < c; i++)particles.push({ x: x, y: y, dx: (Math.random() - 0.5) * 8, dy: (Math.random() - 0.5) * 8, life: 30, color: color }); }
    function updateParticles() { particles.forEach((p, i) => { p.x += p.dx; p.y += p.dy; p.life--; if (p.life <= 0) particles.splice(i, 1); }); }
    function drawParticles(c) { particles.forEach(p => { c.fillStyle = p.color; c.globalAlpha = p.life / 30; c.fillRect(p.x, p.y, 3, 3); c.globalAlpha = 1; }); }
    
    function drawAsset(asset) {
        if (asset === player) {
            let bodyColor = '#00FFA3'; let headColor = '#FFFF00';
            ctx.fillStyle = bodyColor; ctx.fillRect(asset.x, asset.y + 20, asset.width, asset.height - 20); 
            ctx.fillStyle = headColor; ctx.fillRect(asset.x + 5, asset.y, asset.width - 10, 25);
            ctx.fillStyle = 'black';
            let eyeX = asset.facing > 0 ? asset.x + asset.width - 15 : asset.x + 5;
            ctx.fillRect(eyeX, asset.y + 5, 10, 10);
        } else {
            let bodyColor = '#ff4136'; let eyeColor = '#FFFFFF';
            if (asset.type === 'shooter') { bodyColor = '#FF851B'; }
            ctx.fillStyle = bodyColor; ctx.fillRect(asset.x, asset.y, asset.width, asset.height);
            ctx.fillStyle = eyeColor;
            let eyeX = (asset.speed && asset.speed > 0) || asset.type === 'shooter' ? asset.x + asset.width - 15 : asset.x + 5;
            ctx.fillRect(eyeX, asset.y + 10, 10, 10);
        }
    }

    // PART 6: KEYBOARD INPUT (No changes here)
    window.addEventListener('keydown', e => { if (e.code === 'ArrowRight') keys.right = true; else if (e.code === 'ArrowLeft') keys.left = true; else if (e.code === 'ArrowUp' || e.code === 'Space') keys.up = true; });
    window.addEventListener('keyup', e => { if (e.code === 'ArrowRight') keys.right = false; else if (e.code === 'ArrowLeft') keys.left = false; else if (e.code === 'ArrowUp' || e.code === 'Space') keys.up = false; });
};
