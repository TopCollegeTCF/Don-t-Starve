window.GameRenderer = {
    ctx: null,
    
    // Инициализация с контекстом canvas
    init: function(ctx) {
        this.ctx = ctx;
        console.log("🎨 GameRenderer initialized");
    },
    
    // Отрисовка фона земли
    drawGround: function() {
        const img = AssetLoader.getImage('ground');
        if(img && img.complete) {
            this.ctx.drawImage(img, 0, 0, 800, 600);
        } else {
            // fallback если картинка не загрузилась
            this.ctx.fillStyle = "#2d5a2c";
            this.ctx.fillRect(0, 0, 800, 600);
        }
    },
    
    // Отрисовка игрока
    drawPlayer: function(x, y, hp) {
        const img = AssetLoader.getImage('player');
        if(img && img.complete) {
            this.ctx.drawImage(img, x - 24, y - 24, 48, 48);
        }
        
        // Полоска здоровья над головой
        this.ctx.fillStyle = "#aa3333";
        this.ctx.fillRect(x - 25, y - 35, 50, 6);
        this.ctx.fillStyle = "#4caf50";
        this.ctx.fillRect(x - 25, y - 35, 50 * (hp / 100), 6);
    },
    
    // Отрисовка врага
    drawEnemy: function(x, y, hp, maxHp) {
        const img = AssetLoader.getImage('enemy');
        if(img && img.complete) {
            this.ctx.drawImage(img, x - 24, y - 24, 48, 48);
        }
        
        // Полоска здоровья
        this.ctx.fillStyle = "#aa3333";
        this.ctx.fillRect(x - 25, y - 35, 50, 5);
        this.ctx.fillStyle = "#ff6666";
        this.ctx.fillRect(x - 25, y - 35, 50 * (hp / maxHp), 5);
    },
    
    // Отрисовка дерева
    drawTree: function(x, y) {
        const img = AssetLoader.getImage('tree');
        if(img && img.complete) {
            this.ctx.drawImage(img, x - 32, y - 48, 64, 64);
        }
    },
    
    // Отрисовка ягод
    drawBerry: function(x, y, count) {
        const img = AssetLoader.getImage('berry');
        if(img && img.complete) {
            this.ctx.drawImage(img, x - 16, y - 16, 32, 32);
        }
        
        // Количество ягод
        this.ctx.fillStyle = "white";
        this.ctx.font = "10px monospace";
        this.ctx.shadowBlur = 2;
        this.ctx.fillText("🍓" + count, x - 10, y - 20);
        this.ctx.shadowBlur = 0;
    },
    
    // Отрисовка UI иконок (сердце, мясо)
    drawUIcon: function(iconName, x, y, value) {
        const img = AssetLoader.getImage(iconName);
        if(img && img.complete) {
            this.ctx.drawImage(img, x, y, 28, 28);
        }
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 18px monospace";
        this.ctx.fillText(Math.floor(value), x + 35, y + 22);
    }
};
