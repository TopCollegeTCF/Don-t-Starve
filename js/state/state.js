function helloState() {
    console.log("📊 Game State ready");
}

// Начальное состояние игры
window.GameState = {
    isRunning: false,
    score: 0,
    level: 1,
    
    init: function() {
        this.isRunning = true;
        console.log("🎯 State initialized");
        return this;
    },
    
    getState: function() {
        return {
            running: this.isRunning,
            score: this.score,
            level: this.level
        };
    },
    
    updateScore: function(points) {
        this.score += points;
        console.log(`📈 Score updated: ${this.score}`);
    }
};

window.GameState = {
    // Игровые флаги
    gameActive: true,
    
    // Данные игрока
    player: {
        x: 400,
        y: 500,
        hp: 100,
        hunger: 100,
        wood: 0,
        targetX: null,   // цель для движения
        targetY: null
    },
    
    // Мир
    trees: [],      // массив деревьев {x, y, wood}
    berries: [],    // массив ягод {x, y, count}
    day: 1,
    dayTimer: 0,
    spawnTimer: 0,
    
    // Инициализация состояния
    init: function() {
        this.reset();
    },
    
    // Сброс игры
    reset: function() {
        this.gameActive = true;
        this.player = {
            x: 400, y: 500, hp: 100, hunger: 100, wood: 0,
            targetX: null, targetY: null
        };
        this.trees = [];
        this.berries = [];
        this.day = 1;
        this.dayTimer = 0;
        this.spawnTimer = 0;
        
        // Создаем деревья
        for(let i = 0; i < 6; i++) {
            this.trees.push({
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 350,
                wood: 12 + Math.floor(Math.random() * 8)
            });
        }
        
        // Создаем ягоды
        for(let i = 0; i < 5; i++) {
            this.berries.push({
                x: 120 + Math.random() * 600,
                y: 120 + Math.random() * 350,
                count: 6 + Math.floor(Math.random() * 5)
            });
        }
    },
    
    // Установка цели движения
    setPlayerTarget: function(x, y) {
        if(this.gameActive) {
            this.player.targetX = Math.max(30, Math.min(770, x));
            this.player.targetY = Math.max(50, Math.min(540, y));
        }
    },
    
    // Движение игрока к цели
    movePlayer: function(delta, speed = 180) {
        if(!this.gameActive || this.player.targetX === null) return;
        
        let dx = this.player.targetX - this.player.x;
        let dy = this.player.targetY - this.player.y;
        let dist = Math.hypot(dx, dy);
        
        if(dist < 5) {
            this.player.targetX = null;  // достигли цели
            return;
        }
        
        let move = speed * delta;
        this.player.x += (dx / dist) * move;
        this.player.y += (dy / dist) * move;
        
        // Ограничение по границам
        this.player.x = Math.max(30, Math.min(770, this.player.x));
        this.player.y = Math.max(50, Math.min(540, this.player.y));
    },
    
    // Добавление древесины
    addWood: function(amount) {
        this.player.wood += amount;
    },
    
    // Восстановление голода
    addHunger: function(amount) {
        this.player.hunger = Math.min(100, this.player.hunger + amount);
    },
    
    // Нанесение урона игроку
    damagePlayer: function(amount) {
        this.player.hp -= amount;
        if(this.player.hp <= 0) {
            this.gameActive = false;
        }
    },
    
    // Лечение игрока
    healPlayer: function(amount) {
        this.player.hp = Math.min(100, this.player.hp + amount);
    },
    
    // Следующий день
    nextDay: function() {
        this.day++;
        this.healPlayer(5);
        this.addHunger(8);
    },
    
    // Удаление дерева
    removeTree: function(index) {
        this.trees.splice(index, 1);
    },
    
    // Удаление ягод
    removeBerry: function(index) {
        this.berries.splice(index, 1);
    },
    
    // Получение состояния
    getState: function() {
        return {
            gameActive: this.gameActive,
            player: { ...this.player },
            trees: [...this.trees],
            berries: [...this.berries],
            day: this.day
        };
    }
};

helloState();

// Убедиться, что в методе movePlayer есть эта логика:
movePlayer: function(delta, speed = 180) {
    if(!this.gameActive || this.player.targetX === null) return;
    
    let dx = this.player.targetX - this.player.x;
    let dy = this.player.targetY - this.player.y;
    let dist = Math.hypot(dx, dy);
    
    if(dist < 5) {
        this.player.targetX = null;  // <-- остановка при достижении цели
        return;
    }
    
    let move = speed * delta;
    this.player.x += (dx / dist) * move;
    this.player.y += (dy / dist) * move;
    // ...
}
