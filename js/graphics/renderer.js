// Добавить в начало файла
window.treeShakeEffects = {};

// В методе drawTree заменить на:
drawTree: function(worldX, worldY) {
    const screen = this.worldToScreen(worldX, worldY);
    if(screen.x + 40 < 0 || screen.x - 40 > 800 || screen.y + 50 < 0 || screen.y - 50 > 600) return;
    
    // Эффект тряски при сборе
    let shakeX = 0, shakeY = 0;
    const treeKey = `${worldX},${worldY}`;
    if(window.treeShakeEffects && window.treeShakeEffects[treeKey]) {
        const shake = window.treeShakeEffects[treeKey];
        shakeX = (Math.random() - 0.5) * shake.intensity;
        shakeY = (Math.random() - 0.5) * shake.intensity;
        shake.intensity *= 0.8;
        if(shake.intensity < 0.5) delete window.treeShakeEffects[treeKey];
    }
    
    const img = AssetLoader.getImage('tree');
    if(img && img.complete) {
        this.ctx.drawImage(img, screen.x - 32 + shakeX, screen.y - 48 + shakeY, 64, 64);
    } else {
        this.ctx.fillStyle = "#5d3a1a";
        this.ctx.fillRect(screen.x - 8 + shakeX, screen.y - 30 + shakeY, 16, 50);
        this.ctx.fillStyle = "#2d5a2c";
        this.ctx.beginPath();
        this.ctx.arc(screen.x + shakeX, screen.y - 25 + shakeY, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
}
window.GameRenderer = {
    ctx: null,
    
    // Инициализация с контекстом canvas
    init: function(ctx) {
        this.ctx = ctx;
        console.log("🎨 GameRenderer initialized");
    },
    
    // Отрисовка фона земли
    // Обновлено 06.04 @Gabryelf
    drawGround: function() {
        const img = AssetLoader.getImage('ground');
        if(img && img.complete) {
            this.ctx.drawImage(img, 0, 0, 800, 600);
        } else {
            // fallback если картинка не загрузилась
            this.ctx.fillStyle = "#2d5a2c";
            this.ctx.fillRect(0, 0, 800, 600);
            console.log("🎨 Drawing fallback ground");
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
    
    drawEnemy: function(worldX, worldY, hp, maxHp, type) {
    const screen = this.worldToScreen(worldX, worldY);
    if(screen.x + 40 < 0 || screen.x - 40 > 800 || screen.y + 40 < 0 || screen.y - 40 > 600) return;
    
    const img = AssetLoader.getImage('enemy');
    if(img && img.complete) {
        this.ctx.drawImage(img, screen.x - 24, screen.y - 24, 48, 48);
    } else {
        // Рисуем разных врагов разными цветами
        switch(type) {
            case 'guard':
                this.ctx.fillStyle = "#883333";  // Красный - страж
                break;
            case 'patrol':
                this.ctx.fillStyle = "#336688";  // Синий - патрульный
                break;
            case 'wander':
                this.ctx.fillStyle = "#668833";  // Зелёный - бродяга
                break;
            default:
                this.ctx.fillStyle = "#663366";
        }
        this.ctx.beginPath();
        this.ctx.ellipse(screen.x, screen.y, 16, 20, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Глаза
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(screen.x - 8, screen.y - 5, 4, 4);
        this.ctx.fillRect(screen.x + 4, screen.y - 5, 4, 4);
        
        // Зрачки (смотрят на игрока)
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(screen.x - 7, screen.y - 4, 2, 2);
        this.ctx.fillRect(screen.x + 5, screen.y - 4, 2, 2);
    }
    
    // Полоска здоровья
    this.ctx.fillStyle = "#aa3333";
    this.ctx.fillRect(screen.x - 28, screen.y - 38, 56, 5);
    this.ctx.fillStyle = "#ff6666";
    this.ctx.fillRect(screen.x - 28, screen.y - 38, 56 * (hp / maxHp), 5);
    
    // Иконка типа врага
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 10px monospace";
    const typeIcon = type === 'guard' ? '🛡️' : (type === 'patrol' ? '🚶' : '🌿');
    this.ctx.fillText(typeIcon, screen.x - 5, screen.y - 42);
}
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

