// ===================================================================================
// DRAWING.JS - Saare visual elements (art, effects) yahan hain
// ===================================================================================

let backgroundElements = [];
let frame = 0; // Animation ke liye frame counter

// Background ko initialize karna
export function initializeBackground(canvas) {
    backgroundElements = [];
    // Stars
    for (let i = 0; i < 100; i++) {
        backgroundElements.push({
            type: 'star',
            x: Math.random() * canvas.width * 5,
            y: Math.random() * canvas.height * 2,
            size: Math.random() * 2 + 1,
            parallax: Math.random() * 0.4 + 0.1,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
    // Gears, UFOs, Rockets
    for (let i = 0; i < 20; i++) {
        const type = ['gear', 'ufo', 'rocket'][Math.floor(Math.random() * 3)];
        backgroundElements.push({
            type: type,
            x: Math.random() * 50000,
            y: Math.random() * 2000,
            size: Math.random() * 40 + 20,
            parallax: Math.random() * 0.3 + 0.6,
            rotation: 0,
            speed: (Math.random() - 0.5) * 0.5
        });
    }
}

// Background ko draw karna
export function drawBackground(ctx, camera, canvas) {
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    frame++;

    backgroundElements.forEach(el => {
        const drawX = (el.x - camera.x * el.parallax) % (canvas.width + el.size) - el.size;
        const drawY = (el.y - camera.y * el.parallax);

        if (drawY < -el.size || drawY > canvas.height + el.size) return;
        
        ctx.globalAlpha = el.opacity || 1;
        
        if (el.type === 'star') {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(drawX, drawY, el.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (el.type === 'gear') {
             el.rotation += el.speed / 20;
             ctx.strokeStyle = '#334155';
             ctx.lineWidth = 4;
             ctx.save();
             ctx.translate(drawX, drawY);
             ctx.rotate(el.rotation);
             ctx.beginPath();
             for (let i = 0; i < 8; i++) {
                 ctx.rect(-el.size/2, -el.size/2, el.size, el.size);
             }
             ctx.stroke();
             ctx.restore();
        } else if (el.type === 'ufo') {
            el.x += el.speed;
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.ellipse(drawX, drawY, el.size, el.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.ellipse(drawX, drawY - el.size/3, el.size/2, el.size / 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    });
}

// Naya Cartoon Player
export function drawPlayer(ctx, player) {
    const x = player.x;
    const y = player.y;
    const w = player.width;
    const h = player.height;
    
    const bodyBob = player.onGround ? Math.sin(frame / 5) * 2 : 0;

    ctx.save();
    ctx.translate(x + w / 2, y + h + bodyBob);
    
    // Body
    ctx.fillStyle = '#8b5cf6'; // Purple
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.quadraticCurveTo(0, -h, w / 2, 0);
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(0, -h/2, w/4, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupil
    ctx.fillStyle = 'black';
    ctx.beginPath();
    const pupilX = player.facing > 0 ? w/12 : -w/12;
    ctx.arc(pupilX, -h/2, w/8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Naya Cartoon Enemy
export function drawEnemy(ctx, enemy) {
    const x = enemy.x;
    const y = enemy.y;
    const w = enemy.width;
    const h = enemy.height;
    
    const bob = Math.sin((frame + x) / 10) * 4;

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2 + bob);

    // Body
    if (enemy.type === 'shooter') {
        ctx.fillStyle = '#f97316'; // Orange
    } else {
        ctx.fillStyle = '#ef4444'; // Red
    }
    ctx.beginPath();
    ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
    ctx.fill();

    // Spikes (for patrol)
    if(enemy.type === 'patrol') {
        ctx.fillStyle = '#b91c1c';
        for(let i = 0; i < 8; i++) {
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-5, -h/2 - 5, 10, 10);
        }
    }

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(0, 0, w / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(0, 0, w/8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// Platform ko draw karna
export function drawPlatform(ctx, p) {
    let color = '#64748b';
    if (p.type === 'moving') color = '#0ea5e9';
    if (p.type === 'falling') color = '#f59e0b';
    
    ctx.fillStyle = color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
    // Top highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(p.x, p.y, p.width, 5);
}

// Goal ko Flag se replace kiya
export function drawFlag(ctx, goal) {
    const poleX = goal.x + 10;
    const poleY = goal.y;
    const poleHeight = goal.h || 120;
    
    // Pole
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(poleX, poleY, 10, poleHeight);

    // Flag
    const flagY = poleY + Math.sin(frame / 20) * 10;
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(poleX + 10, flagY);
    ctx.lineTo(poleX + 70, flagY + 20);
    ctx.lineTo(poleX + 10, flagY + 40);
    ctx.closePath();
    ctx.fill();
}

// Coin ko draw karna
export function drawCoin(ctx, coin) {
    const bob = Math.sin((frame + coin.x) / 8) * 3;
    const size = 30;
    
    ctx.save();
    ctx.translate(coin.x + size/2, coin.y + size/2 + bob);

    // Coin body
    ctx.fillStyle = '#facc15'; // Gold
    ctx.beginPath();
    ctx.arc(0, 0, size/2, 0, Math.PI*2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(-5, -5, size/4, 0, Math.PI*2);
    ctx.fill();
    
    ctx.restore();
}

// Score ko draw karna
export function drawScore(ctx, score, canvas) {
    ctx.font = "24px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 20, 40);
}


export function drawProjectile(ctx, p) {
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, 0, Math.PI * 2);
    ctx.fill();
}

export function drawParticles(ctx, particles) {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

