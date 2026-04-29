// Система опыта
class ExperienceSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.level = 1;
        this.exp = 0;
        this.expNeeded = 100;
        this.levelUpMsg = null;
        this.msgTimer = 0;
    }
    
    addExp(amount) {
        this.exp += amount;
        while (this.exp >= this.expNeeded) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.exp -= this.expNeeded;
        this.level++;
        this.expNeeded = Math.floor(this.expNeeded * 1.5);
        
        this.gameState.player.maxHp = (this.gameState.player.maxHp || 100) + 10;
        this.gameState.healPlayer(20);
        
        this.levelUpMsg = `🎉 LEVEL ${this.level}! +10 HP`;
        this.msgTimer = 2;
    }
    
    update(delta) {
        if (this.msgTimer > 0) {
            this.msgTimer -= delta;
            if (this.msgTimer <= 0) this.levelUpMsg = null;
        }
    }
    
    draw(ctx, camera, playerX, playerY) {
        if (this.levelUpMsg) {
            const screenX = playerX - camera.x;
            const screenY = playerY - camera.y - 50;
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 20px monospace";
            ctx.fillText(this.levelUpMsg, screenX - 80, screenY);
        }
    }
}
