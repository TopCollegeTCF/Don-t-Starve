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

    gather() {
        if (!this.gameState.gameActive) return false;
        
        // Поиск деревьев рядом
        const trees = this.gameState.getTreesInRange(
            this.gameState.player.x, 
            this.gameState.player.y, 
            this.gameBalance.GATHER_RADIUS
        );
        
        if (trees.length > 0) {
            const gain = Math.min(trees[0].wood, this.gameBalance.GATHER_WOOD_AMOUNT);
            trees[0].wood -= gain;
            this.gameState.addWood(gain);
            
            // Визуальный эффект
            if (this.effectsManager) {
                this.effectsManager.addPickupEffect(trees[0].x, trees[0].y);
            }
            
            // Удаляем дерево если ресурс закончился
            if (trees[0].wood <= 0) {
                this.gameState.removeTree(trees[0]);
            }
            
            this.soundManager.play('gather');
            return true;
        }
        
        // Поиск ягод рядом
        const berries = this.gameState.getBerriesInRange(
            this.gameState.player.x, 
            this.gameState.player.y, 
            this.gameBalance.GATHER_RADIUS
        );
        
        if (berries.length > 0) {
            const gain = Math.min(berries[0].count, this.gameBalance.GATHER_BERRY_AMOUNT);
            berries[0].count -= gain;
            this.gameState.addHunger(gain * this.gameBalance.BERRY_HUNGER_RESTORE);
            
            // Визуальный эффект
            if (this.effectsManager) {
                this.effectsManager.addPickupEffect(berries[0].x, berries[0].y);
            }
            
            // Удаляем куст если ягоды кончились
            if (berries[0].count <= 0) {
                this.gameState.removeBerry(berries[0]);
            }
            
            this.soundManager.play('gather');
            return true;
        }
        
        // НОВЫЙ КОД: Поиск камней рядом
        const stones = this.gameState.getStonesInRange(
            this.gameState.player.x, 
            this.gameState.player.y, 
            this.gameBalance.GATHER_RADIUS
        );
        
        if (stones.length > 0) {
            const gain = Math.min(stones[0].stone, this.gameBalance.GATHER_STONE_AMOUNT);
            stones[0].stone -= gain;
            this.gameState.addStone(gain);
            
            // Визуальный эффект
            if (this.effectsManager) {
                this.effectsManager.addPickupEffect(stones[0].x, stones[0].y);
            }
            
            // Удаляем булыжник если камень закончился
            if (stones[0].stone <= 0) {
                this.gameState.removeStone(stones[0]);
            }
            
            this.soundManager.play('gather');
            return true;
        }
        
        return false;
    }
    
    // Добавьте в класс CoreGame
    attack() {
        if (!this.gameState.gameActive) return false;
        
        // Поиск ближайшего врага
        const nearest = this.gameAI.findNearestEnemy(
            this.gameState.player.x, 
            this.gameState.player.y, 
            this.gameBalance.ATTACK_RADIUS
        );
        
        if (nearest) {
            // Наносим урон
            const defeated = this.gameAI.damageEnemy(nearest, this.gameBalance.PLAYER_DAMAGE);
            
            // Визуальный эффект удара
            if (this.effectsManager) {
                this.effectsManager.addHitEffect(nearest.x, nearest.y);
            }
            
            this.soundManager.play('hit');
            
            if (defeated) {
                console.log("💀 Enemy defeated!");
            }
            return true;
        }
        
        return false;
    }

    // Добавьте в класс CoreGame
    restart() {
        // Сбрасываем состояние игры
        this.gameState.reset();
        this.gameAI.clearEnemies();
        
        // Сбрасываем камеру
        if (this.camera) {
            this.camera.reset(this.gameState.player.x, this.gameState.player.y);
        }
        
        // Очищаем эффекты
        if (this.effectsManager) {
            this.effectsManager.effects = [];
        }
        
        // Запускаем музыку заново
        this.soundManager.playMusic('ambient', 0.3);
        
        console.log("🔄 Game restarted!");
    }

    render(renderer) {
        if (!renderer) return;
        
        // Рисуем фон
        renderer.drawGround();
        
        // Рисуем деревья
        for (let i = 0; i < this.gameState.world.trees.length; i++) {
            renderer.drawTree(this.gameState.world.trees[i].x, this.gameState.world.trees[i].y);
        }
        
        // Рисуем ягоды
        for (let i = 0; i < this.gameState.world.berries.length; i++) {
            renderer.drawBerry(this.gameState.world.berries[i].x, this.gameState.world.berries[i].y, this.gameState.world.berries[i].count);
        }
        
        // НОВЫЙ КОД: Рисуем камни
        if (this.gameState.world.stones) {
            for (let i = 0; i < this.gameState.world.stones.length; i++) {
                renderer.drawStone(this.gameState.world.stones[i].x, this.gameState.world.stones[i].y, this.gameState.world.stones[i].stone);
            }
        }
        
        // Рисуем врагов
        for (let i = 0; i < this.gameState.enemies.length; i++) {
            const e = this.gameState.enemies[i];
            renderer.drawEnemy(e.x, e.y, e.hp, e.maxHp, e.type);
        }
        
        // Рисуем игрока
        renderer.drawPlayer(this.gameState.player.x, this.gameState.player.y, this.gameState.player.hp);
        
        // Рисуем визуальные эффекты
        if (this.effectsManager && renderer.camera) {
            this.effectsManager.draw(renderer.ctx, renderer.camera);
        }
        
        // Рисуем UI
        renderer.drawUI();
        
        // Рисуем экран Game Over если нужно
        if (!this.gameState.gameActive) {
            renderer.drawGameOver();
        }
    }
}


console.log("⚙️ Core ready");

