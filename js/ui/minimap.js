class MiniMap {
    constructor(gameState, camera) {
        this.gameState = gameState;
        this.camera = camera;
        this.width = 150;
        this.height = 150;
        this.x = 620;   
        this.y = 440;   
        this.scale = 0.06; 
    }

    draw(ctx) {
        // Фон мини-карты
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#ffde9c";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Рисуем деревья
        ctx.fillStyle = "#2d8a2c";
        for (let tree of this.gameState.world.trees) {
            const mapX = this.x + tree.x * this.scale;
            const mapY = this.y + tree.y * this.scale;
            if (mapX >= this.x && mapX <= this.x + this.width &&
                mapY >= this.y && mapY <= this.y + this.height) {
                ctx.fillRect(mapX, mapY, 2, 2);
            }
        }
        
        // Рисуем ягоды
        ctx.fillStyle = "#cc3366";
        for (let berry of this.gameState.world.berries) {
            const mapX = this.x + berry.x * this.scale;
            const mapY = this.y + berry.y * this.scale;
            if (mapX >= this.x && mapX <= this.x + this.width &&
                mapY >= this.y && mapY <= this.y + this.height) {
                ctx.fillRect(mapX, mapY, 2, 2);
            }
        }
        
        // Рисуем врагов
        ctx.fillStyle = "#ff3333";
        for (let enemy of this.gameState.enemies) {
            const mapX = this.x + enemy.x * this.scale;
            const mapY = this.y + enemy.y * this.scale;
            if (mapX >= this.x && mapX <= this.x + this.width &&
                mapY >= this.y && mapY <= this.y + this.height) {
                ctx.beginPath();
                ctx.arc(mapX, mapY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Рисуем игрока
        const playerX = this.x + this.gameState.player.x * this.scale;
        const playerY = this.y + this.gameState.player.y * this.scale;
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.moveTo(playerX, playerY - 4);
        ctx.lineTo(playerX - 3, playerY + 3);
        ctx.lineTo(playerX + 3, playerY + 3);
        ctx.fill();
        
        // Область видимости камеры
        const viewX = this.x + this.camera.x * this.scale;
        const viewY = this.y + this.camera.y * this.scale;
        const viewW = 800 * this.scale;
        const viewH = 600 * this.scale;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.strokeRect(viewX, viewY, viewW, viewH);
        
        // Текст
        ctx.fillStyle = "#ffde9c";
        ctx.font = "8px monospace";
        ctx.fillText("MAP", this.x + 5, this.y + 12);
    }
}
