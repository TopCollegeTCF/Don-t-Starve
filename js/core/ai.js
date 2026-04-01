function helloAI() {
    console.log("AI ready");
}
window.helloAI = function() {
    hello();
    bye();
}
function hello() {
    console.log("AI ready");
}
function bye() {
    console.log("AI ВСЕ!");
}
function helloAI() {
    console.log("🤖 AI & Logic ready");
}

window.GameAI = {
    enemies: [],
    
    // Добавление врага
    addEnemy: function(x, y, hp = 45) {
        const enemy = { 
            id: Date.now() + Math.random(),
            x: x, 
            y: y, 
            hp: hp,
            maxHp: hp
        };
        this.enemies.push(enemy);
        console.log(`👾 Enemy spawned at (${x}, ${y})`);
        return enemy;
    },
    
    // ОБНОВЛЕНО: движение врагов к игроку
    updateEnemies: function(delta, playerX, playerY) {
        const speed = GameBalance.ENEMY_SPEED;
        
        for(let i = 0; i < this.enemies.length; i++) {
            const e = this.enemies[i];
            const dx = playerX - e.x;
            const dy = playerY - e.y;
            const dist = Math.hypot(dx, dy);
            
            if(dist > 0.01 && dist < 300) {  // двигаются только если игрок рядом
                const move = speed * delta;
                e.x += (dx / dist) * move;
                e.y += (dy / dist) * move;
            }
            
            // Границы карты
            e.x = Math.max(30, Math.min(770, e.x));
            e.y = Math.max(50, Math.min(540, e.y));
        }
    },
    
    // НОВЫЙ МЕТОД: спавн врага на краю карты
    spawnEnemy: function() {
        const side = Math.random() > 0.5 ? 50 : 750;
        const y = 150 + Math.random() * 350;
        const hp = GameBalance.ENEMY_BASE_HP + Math.random() * 15;
        this.addEnemy(side, y, hp);
    },
    
    // Проверка атаки врага на игрока
    checkAttack: function(playerX, playerY, radius = 42) {
        for(let e of this.enemies) {
            if(Math.hypot(playerX - e.x, playerY - e.y) < radius) {
                return e;
            }
        }
        return null;
    },
    
    // Поиск ближайшего врага для атаки игроком
    findNearestEnemy: function(playerX, playerY, range) {
        let nearest = null;
        let minDist = range;
        
        for(let e of this.enemies) {
            const dist = Math.hypot(playerX - e.x, playerY - e.y);
            if(dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        }
        return nearest;
    },
    
    // Нанесение урона врагу
    damageEnemy: function(enemyId, damage) {
        const enemy = this.enemies.find(e => e.id === enemyId);
        if(enemy) {
            enemy.hp -= damage;
            if(enemy.hp <= 0) {
                this.removeEnemy(enemyId);
                return true;  // враг побежден
            }
        }
        return false;
    },
    
    // Удаление врага
    removeEnemy: function(enemyId) {
        const index = this.enemies.findIndex(e => e.id === enemyId);
        if(index !== -1) {
            this.enemies.splice(index, 1);
            console.log(`☠️ Enemy defeated! Remaining: ${this.enemies.length}`);
        }
    },
    
    // Получение списка врагов
    getEnemies: function() {
        return this.enemies;
    },
    
    // Очистка всех врагов
    clearEnemies: function() {
        this.enemies = [];
    }
};

helloAI();

window.GameAI = {
    enemies: [],
    
    addEnemy: function(x, y, hp = 100) {
        const enemy = { 
            id: Date.now() + Math.random(),
            x: x, 
            y: y, 
            hp: hp,
            maxHp: hp
        };
        this.enemies.push(enemy);
        console.log(`👾 Enemy spawned at (${x}, ${y}) with ${hp} HP`);
        return enemy;
    },
    
   updateEnemies: function(delta, playerX, playerY) {
    const speed = GameBalance.ENEMY_SPEED;
    
    for(let i = 0; i < this.enemies.length; i++) {
        const e = this.enemies[i];
        const dx = playerX - e.x;
        const dy = playerY - e.y;
        const dist = Math.hypot(dx, dy);
        
        // Двигаться только если игрок в радиусе 300 пикселей
        if(dist > 0.01 && dist < 300) {
            const move = speed * delta;
            e.x += (dx / dist) * move;
            e.y += (dy / dist) * move;
        }
        
        // Ограничение по границам карты
        e.x = Math.max(30, Math.min(770, e.x));
        e.y = Math.max(50, Math.min(540, e.y));
    }
},
    },
    
    getEnemies: function() {
        return this.enemies;
    },
    
    damageEnemy: function(enemyId, damage) {
        const enemy = this.enemies.find(e => e.id === enemyId);
        if(enemy) {
            enemy.hp -= damage;
            console.log(`💥 Enemy damaged: ${enemy.hp}/${enemy.maxHp} HP`);
            if(enemy.hp <= 0) {
                this.removeEnemy(enemyId);
                return true; // enemy defeated
            }
        }
        return false;
    },
    
    removeEnemy: function(enemyId) {
        const index = this.enemies.findIndex(e => e.id === enemyId);
        if(index !== -1) {
            this.enemies.splice(index, 1);
            console.log(`☠️ Enemy defeated! Remaining: ${this.enemies.length}`);
        }
    },
    
    clearEnemies: function() {
        this.enemies = [];
        console.log("🧹 All enemies cleared");
    }
};

helloAI();
