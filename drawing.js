
// ===================================================================================
// DRAWING.JS - Saare advanced visual effects aur character designs yahan hain
// ===================================================================================

// --- Helper Functions ---
// Do numbers ke beech random value nikalne ke liye
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// --- Background Elements ---
// Background mein dikhne waale saare dynamic objects (stars, gears, etc.)
let bgElements = [];

export function initializeBackground(canvas) {
    // Stars banana
    for (let i = 0; i < 150; i++) {
        bgElements.push({
            type: 'star',
            x: random(0, 10000),
            y: random(0, 2000),
            size: random(1, 3),
            parallax: random(0.1, 0.3) // Dheere move honge
        });
    }
    // Gears banana
    for (let i = 0; i < 20; i++) {
        bgElements.push({
            type: 'gear',
            x: random(0, 10000),
            y: random(0, 2000),
            size: random(20, 80),
            rotation: random(0, 360),
            speed: random(-0.2, 0.2),
            parallax: random(0.4, 0.6)
        });
    }
    // UFOs aur Rockets banana
     for (let i = 0; i < 10; i++) {
        bgElements.push({
            type: i % 2 === 0 ? 'ufo' : 'rocket',
            x: random(0, 10000),
            y: random(100, canvas.height * 0.7),
            size: random(30, 60),
            speed: random(0.5, 1.5),
            parallax: random(0.7, 0.9) // Sabse tez move honge
        });
    }
}

// Poora dynamic background draw karne ka function
export function drawBackground(ctx, camera, canvas) {
    // Gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#0d0d1a');
    bgGradient.addColorStop(1, '#1a1a3d');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Saare background elements ko draw karna
    bgElements.forEach(el => {
        // Parallax effect ke liye position calculate karna
        const parallaxX = el.x - camera.x * el.parallax;
        const parallaxY = el.y - camera.y * 0.5; // Y-axis par kam parallax

        ctx.save();
        ctx.translate(parallaxX, parallaxY);

        switch (el.type) {
            case 'star':
                ctx.fillStyle = `rgba(255, 255, 255, ${random(0.5, 1)})`;
                ctx.fillRect(0, 0, el.size, el.size);
                break;
            case 'gear':
                ctx.rotate(el.rotation * Math.PI / 180);
                drawGear(ctx, el.size);
                el.rotation += el.speed; // Gear ko ghumaana
                break;
            case 'ufo':
                drawUFO(ctx, el.size);
                el.x += el.speed; // UFO ko move karna
                if (el.x > 10000) el.x = 0; // Screen se bahar jaane par wapas laana
                break;
            case 'rocket':
                 drawRocket(ctx, el.size);
                 el.x += el.speed; // Rocket ko move karna
                 if (el.x > 10000) el.x = 0;
                 break;
        }
        ctx.restore();
    });
}


// --- Game Asset Drawing Functions ---

// Naya Monad Player Character
export function drawPlayer(ctx, player) {
    const bodyHeight = player.height * 0.7;
    const headRadius = player.width / 2.5;
    const bounce = Math.sin(Date.now() / 150) * 2; // Halki si bounce animation

    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + bounce);

    // Body
    ctx.fillStyle = '#9b59b6'; // Purple color
    ctx.beginPath();
    ctx.roundRect(-player.width / 2, 0, player.width, bodyHeight, [15]);
    ctx.fill();
    
    // Glowing Eye
    const eyeX = player.facing * (player.width * 0.15);
    const eyeY = -headRadius * 0.2;
    ctx.fillStyle = 'white';
    ctx.shadowColor = '#f1c40f';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, headRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupil
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(eyeX + player.facing, eyeY, headRadius * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// Naye Enemies
export function drawEnemy(ctx, enemy) {
     ctx.save();
     ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
     
     if(enemy.type === 'patrol') { // Floating Drone
        ctx.fillStyle = '#e74c3c'; // Red
        ctx.beginPath();
        ctx.arc(0, 0, enemy.width/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillRect(-enemy.width * 0.1, -enemy.height * 0.1, enemy.width * 0.2, enemy.height*0.2);
     } else if (enemy.type === 'shooter') { // Turret
        ctx.fillStyle = '#e67e22'; // Orange
        ctx.fillRect(-enemy.width/2, 0, enemy.width, enemy.height/2);
        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.arc(0, 0, enemy.width/2.5, 0, Math.PI, true);
        ctx.fill();
        // Glowing light before shooting
        if (enemy.shootCooldown < 30) {
            ctx.fillStyle = 'red';
            ctx.shadowColor = 'red';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, enemy.height * 0.1, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
     }
     ctx.restore();
}

// Platforms
export function drawPlatform(ctx, p) {
    ctx.fillStyle = '#888';
    if (p.type === 'moving') ctx.fillStyle = '#bada55';
    else if (p.type === 'falling' && p.isFalling) ctx.fillStyle = '#f08080';
    
    ctx.fillRect(p.x, p.y, p.width, p.height);
    
    // Neon outline
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(p.x, p.y, p.width, p.height);
    ctx.globalAlpha = 1;
}

// Goal Portal
export function drawGoal(ctx, goal) {
    const time = Date.now() / 500;
    const radius = goal.w / 2;
    ctx.save();
    ctx.translate(goal.x + radius, goal.y + radius);
    
    for(let i=0; i<5; i++) {
        const angle = time + i * 0.5;
        const x = Math.cos(angle) * radius * 0.5;
        const y = Math.sin(angle) * radius * 0.5;
        ctx.fillStyle = `hsl(${ (time * 20 + i * 50) % 360 }, 100%, 70%)`;
        ctx.beginPath();
        ctx.arc(x, y, radius / 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

// Projectiles
export function drawProjectile(ctx, p) {
    const gradient = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, p.w);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, '#FF851B');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.w/2, 0, Math.PI * 2);
    ctx.fill();
}

// Particles
export function drawParticles(ctx, particles) {
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30; // Fade out effect
        ctx.fillRect(p.x, p.y, p.size || 3, p.size || 3);
        ctx.globalAlpha = 1;
    });
}

// --- Specific Asset Drawing (used by background) ---
function drawGear(ctx, size) {
    const teeth = 8;
    const innerRadius = size * 0.3;
    const outerRadius = size * 0.5;
    ctx.strokeStyle = '#6c7a89';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / teeth;
        ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    ctx.closePath();
    ctx.stroke();
}

function drawUFO(ctx, size) {
    // Dome
    ctx.fillStyle = '#a2ded0';
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, Math.PI, 0);
    ctx.fill();
    // Base
    ctx.fillStyle = '#d0d0d0';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size / 3, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawRocket(ctx, size) {
    // Body
    ctx.fillStyle = '#f2f2f2';
    ctx.beginPath();
    ctx.moveTo(-size/2, size/2);
    ctx.lineTo(size/2, size/2);
    ctx.lineTo(size/2, -size/4);
    ctx.lineTo(0, -size/2);

    ctx.closePath();
    ctx.fill();
    // Flame
     const flameSize = Math.random() * size * 0.6 + size * 0.2;
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.moveTo(-size/4, size/2);
    ctx.lineTo(size/4, size/2);
    ctx.lineTo(0, size/2 + flameSize);
    ctx.closePath();
    ctx.fill();
}
