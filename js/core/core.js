// js/core/core.js
class CoreGame {
    constructor(gameState, gameBalance, gameAI, effectsManager, soundManager, camera) {
        this.gameState = gameState;
        this.gameBalance = gameBalance;
        this.gameAI = gameAI;
        this.effectsManager = effectsManager;
        this.soundManager = soundManager;
        this.camera = camera;
        this.lastTimestamp = 0;
    }
    
    // Добавьте в класс CoreGame
    start() {
        this.lastTimestamp = 0;
        console.log("🎮 Game loop started");
    
    // Запускаем фоновую музыку через 1 секунду
        setTimeout(() => {
            this.soundManager.playMusic('ambient', 0.3);
        }, 1000);
    }
        // Добавьте в класс CoreGame
    update(delta) {
        if (!this.gameState.gameActive) return;
    
        // 1. Движение игрока
        this.gameState.movePlayer(delta, this.gameBalance.PLAYER_SPEED);
    
        // 2. Голод (потеря здоровья если голод 0)
        this.gameState.player.hunger -= delta * this.gameBalance.HUNGER_DRAIN_RATE;
        if (this.gameState.player.hunger <= 0) {
        this.gameState.damagePlayer(delta * 5);
        this.gameState.player.hunger = 0;
        }
    
        // 3. Дневной цикл
        this.gameState.dayTimer += delta;
        if (this.gameState.dayTimer >= this.gameBalance.DAY_DURATION) {
            this.gameState.dayTimer = 0;
            this.gameState.nextDay();
        }
    
        // 4. Спавн врагов
        this.gameState.spawnTimer += delta;
        if (this.gameState.spawnTimer >= this.gameBalance.ENEMY_SPAWN_DELAY && 
            this.gameState.enemies.length < this.gameBalance.MAX_ENEMIES) {
            this.gameState.spawnTimer = 0;
            this.gameState.spawnEnemy();
        }
    
        // 5. Обновление AI врагов
        this.gameAI.updateEnemies(delta, this.gameState.player.x, this.gameState.player.y);
    
        // 6. Атака врагов на игрока
        const attacker = this.gameAI.checkAttack(this.gameState.player.x, this.gameState.player.y);
        if (attacker) {
            this.gameState.damagePlayer(delta * this.gameBalance.ENEMY_DAMAGE);
        }
    
        // 7. Обновление камеры
        if (this.camera) {
            this.camera.update(this.gameState.player.x, this.gameState.player.y, delta);
        }
    
        // 8. Обновление визуальных эффектов
        if (this.effectsManager) {
            this.effectsManager.update(delta);
        }
    
        // 9. Проверка смерти
        if (this.gameState.player.hp <= 0) {
            this.gameState.gameActive = false;
            this.soundManager.play('gameover');
            this.soundManager.stopMusic();
        }
    }    
    
}
