// ===================================================================================
// MAIN.JS - Game ka Final Core Logic (Bina Music Ke)
// ===================================================================================

// Wallet, Stages, aur Drawing files se zaroori cheezein import karna
import { connectWallet, disconnectWallet, mintNFTReward, walletState } from './wallet.js';
import { stageData } from './stages.js';
import { 
    initializeBackground, drawBackground, drawPlayer, drawEnemy, 
    drawPlatform, drawFlag, drawParticles, drawCoin, drawScore
} from './drawing.js';

// Page load hote hi yeh function chalega
window.onload = () => {
    // === PART 1: SETUP ===
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

    let gameRunning = false, currentStage = 0, score = 0, gamePaused = false;
    let player, camera;
    let particles = [];
    let currentStageData = { platforms: [], enemies: [], goal: {}, coins: [] };
    const gravity = 0.6;
    const keys = { right: false, left: false, up: false };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeBackground(canvas);


    // === PART 2: UI & EVENT LISTENERS ===
    function showMessage(title, buttonText, onButtonClick) {
        messageTitle.innerText = title;
        nextActionBtn.innerText = buttonText;
        nextActionBtn.disabled = false;
        messageBox.style.display = 'block';
        nextActionBtn.onclick = onButtonClick;
    }

    function updateWalletButton() {
        if (walletState.userAddress) {
            connectWalletBtn.textContent = `DISCONNECT: ${walletState.userAddress.substring(0, 5)}...${walletState.userAddress.substring(walletState.userAddress.length - 4)}`;
            playGameBtn.disabled = false;
        } else {
            connectWalletBtn.textContent = 'CONNECT WALLET';
            playGameBtn.disabled = true;
        }
    }
    
    connectWalletBtn.addEventListener('click', async () => {
        if (walletState.userAddress) {
            disconnectWallet();
        } else {
            await connectWallet(showMessage);
        }
        updateWalletButton();
    });

    playGameBtn.addEventListener('click', () => {
        landingPage.style.display = 'none';
        gameContainer.style.display = 'flex';
        initStage(1);
        gameLoop();
    });
    
    getGmonadBtn.addEventListener('click', () => window.open('https://faucet.monad.xyz/', '_blank'));

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                walletState.userAddress = accounts[0];
            }
            updateWalletButton();
        });
    }

    // === PART 3: CORE GAME ENGINE ===
    function initStage(levelNumber) {
        const level = stageData.find(s => s.level === levelNumber);
        if (!level) { 
            gameRunning = false;
            showMessage("YOU WIN!", "Play Again?", () => location.reload());
            return;
        }
        currentStage = levelNumber;
        score = 0;
        currentStageData = JSON.parse(JSON.stringify(level)); 
        particles = [];
        
        if (!currentStageData.coins) currentStageData.coins = [];
        
        currentStageData.platforms.forEach(p => { 
            p.width = p.w; 
            p.height = p.h || 20; 
            if (p.type === 'moving') { p.originalX = p.x; p.originalY = p.y; p.speed = p.s; p.distance = p.dist; }
        });
        currentStageData.enemies.forEach(e => { 
            e.width = 40; e.height = 40;
            e.isDead = false; 
            if (e.type === 'patrol') { e.originalX = e.x; e.speed = e.s; e.distance = e.dist; } 
        });
        
        player = { x: level.playerStart.x, y: level.playerStart.y, width: 40, height: 60, dx: 0, dy: 0, speed: 6, jumpPower: -16, onGround: false, facing: 1 };
        camera = { 
            x: 0, y: 0, width: canvas.width, height: canvas.height, 
            update: function () {
                this.x = Math.max(0, Math.min(player.x - (this.width / 2.5), currentStageData.width - this.width));
                this.y = Math.max(0, Math.min(player.y - (this.height / 1.5), currentStageData.height - this.height));
            } 
        };
        
        gamePaused = false; 
        gameRunning = true; 
        messageBox.style.display = 'none';
    }

    function gameLoop() { 
        if (!gameRunning) return;
        update(); 
        draw(); 
        requestAnimationFrame(gameLoop); 
    }

    function update() {
        if (!player || gamePaused) return;

        if (keys.right) { player.dx = player.speed; player.facing = 1; } 
        else if (keys.left) { player.dx = -player.speed; player.facing = -1; } 
        else player.dx = 0;

        if (keys.up && player.onGround) { 
            player.dy = player.jumpPower; 
            createParticles(player.x + player.width / 2, player.y + player.height, 10, '#ffffff'); 
        }
        
        player.dy += gravity; 
        const prevPlayerY = player.y;
        player.x += player.dx; 
        player.y += player.dy; 
        player.onGround = false;

        if (player.x < 0) player.x = 0; 
        if (player.x + player.width > currentStageData.width) player.x = currentStageData.width - player.width;
        if (player.y > currentStageData.height + 200) resetPlayer();
        
        currentStageData.platforms.forEach(p => { 
            if (p.type === 'moving') { 
                if (p.dir === 'vertical') { p.y += p.speed; if (Math.abs(p.y - p.originalY) >= p.distance) p.speed *= -1; } 
                else { p.x += p.speed; if (Math.abs(p.x - p.originalX) >= p.distance) p.speed *= -1; } 
            } 
            if (p.type === 'falling' && p.isFalling) p.y += 5; 
        });
        currentStageData.enemies.forEach(e => { 
            if (e.isDead) return; 
            if (e.type === 'patrol') { e.x += e.speed; if (Math.abs(e.x - e.originalX) >= e.distance) e.speed *= -1; }
        });
        
        currentStageData.platforms.forEach(p => { 
            if (player.x + player.width > p.x && player.x < p.x + p.width && player.y + player.height > p.y && player.y < p.y + p.height) {
                if (player.dx !== 0 && (prevPlayerY + player.height > p.y && prevPlayerY < p.y + p.height)) { player.x -= player.dx; }
                if (player.dy > 0 && prevPlayerY + player.height <= p.y + 1) { 
                    player.dy = 0; player.onGround = true; player.y = p.y - player.height; 
                    if (p.type === 'moving') player.x += p.speed; 
                    if (p.type === 'falling') p.isFalling = true; 
                } 
                else if (player.dy < 0 && prevPlayerY >= p.y + p.height) { player.dy = 0; player.y = p.y + p.height; }
            }
        });
        
        currentStageData.enemies.forEach((e) => {
            if (e.isDead) return;
            const isColliding = player.x < e.x + e.width && player.x + player.width > e.x && player.y < e.y + e.height && player.y + player.height > e.y;
            if (isColliding) {
                const wasAbove = (prevPlayerY + player.height) <= e.y + 10;
                if (player.dy > 0 && wasAbove) {
                    score += 50; 
                    e.isDead = true; 
                    player.dy = -10; 
                    createParticles(e.x + e.width / 2, e.y, 30, '#ff4136');
                    setTimeout(() => { const index = currentStageData.enemies.indexOf(e); if (index > -1) currentStageData.enemies.splice(index, 1); }, 200);
                } else { 
                    resetPlayer(); 
                }
            }
        });

        currentStageData.coins.forEach((coin, i) => {
            const isColliding = player.x < coin.x + 30 && player.x + player.width > coin.x && player.y < coin.y + 30 && player.y + player.height > coin.y;
            if (isColliding) {
                score += 10;
                createParticles(coin.x + 15, coin.y + 15, 15, 'gold', 3);
                currentStageData.coins.splice(i, 1);
            }
        });
        
        const goal = currentStageData.goal; goal.w = 80; goal.h = 120;
        if (player.x + player.width > goal.x && player.x < goal.x + goal.w && player.y + player.height > goal.y && player.y < goal.y + goal.h) {
            gamePaused = true;
            createParticles(goal.x + goal.w / 2, goal.y + goal.h / 2, 100, 'gold');
            showMessage(`Stage ${currentStage} Complete! Score: ${score}`, "Mint NFT Reward", handleMintReward);
        }
        
        camera.update(); 
        updateParticles();
    }
    
    async function handleMintReward() {
        nextActionBtn.disabled = true; nextActionBtn.innerText = "Minting...";
        const success = await mintNFTReward(currentStage);
        if (success) {
            alert(`Congratulations! You've minted the NFT for Stage ${currentStage}!`);
            initStage(currentStage + 1);
        } else {
             nextActionBtn.disabled = false;
             nextActionBtn.innerText = "Mint NFT Reward";
        }
    }

    // === PART 4: DRAWING ===
    function draw() {
        if (!player) return;
        drawBackground(ctx, camera, canvas);
        
        ctx.save();
        ctx.translate(-camera.x, -camera.y);
        
        currentStageData.platforms.forEach(p => drawPlatform(ctx, p));
        currentStageData.coins.forEach(c => drawCoin(ctx, c));
        drawParticles(ctx, particles);
        drawFlag(ctx, currentStageData.goal);
        currentStageData.enemies.forEach(e => { if (!e.isDead) drawEnemy(ctx, e); });
        
        drawPlayer(ctx, player);
        
        ctx.restore();

        drawScore(ctx, score, canvas);
    }

    // === PART 5: HELPER FUNCTIONS ===
    function resetPlayer() { 
        createParticles(player.x + player.width / 2, player.y + player.height / 2, 50, '#ff4136', 5);
        initStage(currentStage);
    }

    function createParticles(x, y, count, color, size) { 
        for (let i = 0; i < count; i++) {
            particles.push({ 
                x: x, y: y, 
                dx: (Math.random() - 0.5) * 8, 
                dy: (Math.random() - 0.5) * 8, 
                life: 30, 
                color: color,
                size: size || 3
            }); 
        }
    }
    function updateParticles() { 
        particles.forEach((p, i) => { 
            p.x += p.dx; p.y += p.dy; p.life--; 
            if (p.life <= 0) particles.splice(i, 1); 
        }); 
    }
    
    // === PART 6: KEYBOARD INPUT ===
    window.addEventListener('keydown', e => { 
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true; 
        else if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true; 
        else if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keys.up = true; 
    });
    window.addEventListener('keyup', e => { 
        if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false; 
        else if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false; 
        else if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keys.up = false; 
    });
};

