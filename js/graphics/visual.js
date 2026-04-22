
class VisualEffects {
    constructor() {
        this.particles = [];
    }
   
    addPickup(x, y) {
        this.particles.push({ x, y, life: 0.5, type: 'pickup' });
    }
    
    addHit(x, y) {
        this.particles.push({ x, y, life: 0.3, type: 'hit' });
    }
       update(delta) {
        for (let i = this.particles.length-1; i >= 0; i--) {
            this.particles[i].life -= delta;
            if (this.particles[i].life <= 0) this.particles.splice(i,1);
        }
    }
    
    draw(ctx, camera) {
        for (let p of this.particles) {
            const alpha = p.life / (p.type === 'pickup' ? 0.5 : 0.3);
            const screenX = p.x - camera.x;
            const screenY = p.y - camera.y;
            
            ctx.fillStyle = p.type === 'pickup' ? `rgba(255,215,0,${alpha})` : `rgba(255,0,0,${alpha})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 15 * (1-alpha), 0, Math.PI*2);
            ctx.fill();
            
            if (p.type === 'pickup') {
                ctx.fillStyle = `rgba(255,215,0,${alpha})`;
                ctx.font = `${16 + 10*(1-alpha)}px monospace`;
                ctx.fillText("+", screenX-5, screenY-10);
            }
        }
    }
}

