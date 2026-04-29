function helloState() {
    console.log("📊 Game State ready");
}

// Initial game state setup
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
        targetX: null,  // цель для движения
        targetY: null   // цель для движения
    },

    // Мир
    trees: [],   // массив деревьев {x, y, wood}
    berries: [], // массив ягод {x, y, count}
    day: 1,
    dayTimer: 0,
    spawnTimer: 0,
    enemies: [],  // Добавим массив врагов для спавна

    // Инициализация состояния
    init: function() {
        this.reset();
    },

    // Сброс игры
    reset: function() {
        this.gameActive = true;
        this.player = {
            x: 400,
            y: 500,
            hp: 100,
            hunger: 100,
            wood: 0,
            targetX: null,
            targetY: null
        };
        this.trees = [];
        this.berries = [];
        this.day = 1;
        this.dayTimer = 0;
        this.spawnTimer = 0;
        this.enemies = [];

        // Создаем деревья
        for (let i = 0; i < 6; i++) {
            this.trees.push({
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 350,
                wood: 12 + Math.floor(Math.random() * 8)
            });
        }

        // Создаем ягоды
        for (let i = 0; i < 5; i++) {
            this.berries.push({
                x: 120 + Math.random() * 600,
                y: 120 + Math.random() * 350,
                count: 6 + Math.floor(Math.random() * 5)
            });
        }
    },

    // Установка цели движения
    setPlayerTarget: function(x, y) {
        if (this.gameActive) {
            this.player.targetX = Math.max(30, Math.min(770, x));
            this.player.targetY = Math.max(50, Math.min(540, y));
        }
    },

    // Движение игрока к цели
    movePlayer: function(delta, speed = 180) {
        if (!this.gameActive || this.player.targetX === null) return;

        let dx = this.player.targetX - this.player.x;
        let dy = this.player.targetY - this.player.y;
        let dist = Math.hypot(dx, dy);

        if (dist < 5) {
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
        if (window.SoundManager) {
            SoundManager.play('hit_player');  // Добавить звук
        }
        if (this.player.hp <= 0) {
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
        if (window.SoundManager) {
            SoundManager.play('day_change');
        }
        console.log(`🌞 Day ${this.day}`);
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
    },

    // Спавн врагов
    spawnEnemy: function() {
        const enemyTypes = ['patrol', 'guard', 'wander'];
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

        let x, y;
        let attempts = 0;
        do {
            x = 100 + Math.random() * (GameConfig.WORLD_WIDTH - 200);
            y = 100 + Math.random() * (GameConfig.WORLD_HEIGHT - 200);
            attempts++;
            if (attempts > 50) break;
        } while (Math.hypot(x - this.player.x, y - this.player.y) < 300);

        const enemy = {
            id: Date.now() + Math.random(),
            x: x,
            y: y,
            hp: GameBalance.ENEMY_BASE_HP + Math.floor(Math.random() * 20),
            maxHp: GameBalance.ENEMY_BASE_HP + Math.floor(Math.random() * 20),
            type: type,
            behavior: this.createEnemyBehavior(type, x, y)
        };

        this.enemies.push(enemy);
        console.log(`👾 ${type} enemy spawned at (${Math.floor(x)},${Math.floor(y)})`);
        return enemy;
    }
};

helloState();
