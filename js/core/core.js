//---------------------------------------------------------------
// Создание игрока, сбор ресурсов, смена дня и ночи, игровой цикл
//---------------------------------------------------------------

// Основной игровой цикл
window.CoreGame = {
    lastTimestamp: 0,
    gameActive: true,
    lastFrameTime: 0,
    
    start: function() {
        this.lastTimestamp = 0;
        console.log("🎮 Game loop started");
        
        // Запускаем фоновую музыку
        setTimeout(() => {
            SoundManager.playMusic('ambient', 0.3);
        }, 1000);
    },
    
    gameLoop: function(currentTime) {
        if(this.lastTimestamp === 0) {
            this.lastTimestamp = currentTime;
            requestAnimationFrame((t) => this.gameLoop(t));
            return;
        }
        
        let delta = Math.min(0.033, (currentTime - this.lastTimestamp) / 1000);
        if(delta > 0.01) {
            this.update(delta);
        }
        this.lastTimestamp = currentTime;
        this.render();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    },
    
    update: function(delta) {
        if(!GameState.gameActive) return;
        
        // Движение игрока
        GameState.movePlayer(delta, GameBalance.PLAYER_SPEED);
        
        // Голод
        GameState.player.hunger -= delta * GameBalance.HUNGER_DRAIN_RATE;
        if(GameState.player.hunger <= 0) {
            GameState.damagePlayer(delta * 5);
            GameState.player.hunger = 0;
        }
        
        // Дневной цикл
        GameState.dayTimer += delta;
        if(GameState.dayTimer >= GameBalance.DAY_DURATION) {
            GameState.dayTimer = 0;
            GameState.nextDay();
        }
        
        // Спавн врагов
        GameState.spawnTimer += delta;
        if(GameState.spawnTimer >= GameBalance.ENEMY_SPAWN_DELAY && 
           GameState.enemies.length < GameBalance.MAX_ENEMIES) {
            GameState.spawnTimer = 0;
            GameState.spawnEnemy();
        }
        
        // Обновление AI
        GameAI.updateEnemies(delta, GameState.player.x, GameState.player.y);
        
        // Проверка атаки врагов
        const attacker = GameAI.checkAttack(GameState.player.x, GameState.player.y);
        if(attacker) {
            GameState.damagePlayer(delta * GameBalance.ENEMY_DAMAGE);
        }
        
        // Обновление камеры
        if(window.GameCamera) {
            GameCamera.update(GameState.player.x, GameState.player.y, delta);
        }
        
        // Обновление эффектов
        if(window.EffectsManager) {
            EffectsManager.update(delta);
        }
        
        // Проверка смерти
        if(GameState.player.hp <= 0) {
            GameState.gameActive = false;
            SoundManager.play('gameover');
            SoundManager.stopMusic();
        }
    },
    
    gather: function() {
        if(!GameState.gameActive) return false;
        
        // Сбор дерева
        const trees = GameState.getTreesInRange(GameState.player.x, GameState.player.y, GameBalance.GATHER_RADIUS);
        if(trees.length > 0) {
            const gain = Math.min(trees[0].wood, GameBalance.GATHER_WOOD_AMOUNT);
            trees[0].wood -= gain;
            GameState.addWood(gain);
            if(window.EffectsManager) {
                EffectsManager.addPickupEffect(trees[0].x, trees[0].y);
            }
            
            if(trees[0].wood <= 0) {
                GameState.removeTree(trees[0]);
            }
            SoundManager.play('gather');
            return true;
        }
        
        // Сбор ягод
        const berries = GameState.getBerriesInRange(GameState.player.x, GameState.player.y, GameBalance.GATHER_RADIUS);
        if(berries.length > 0) {
            const gain = Math.min(berries[0].count, GameBalance.GATHER_BERRY_AMOUNT);
            berries[0].count -= gain;
            GameState.addHunger(gain * GameBalance.BERRY_HUNGER_RESTORE);
            if(window.EffectsManager) {
                EffectsManager.addPickupEffect(berries[0].x, berries[0].y);
            }
            
            if(berries[0].count <= 0) {
                GameState.removeBerry(berries[0]);
            }
            SoundManager.play('gather');
            return true;
        }
        
        return false;
    },
    
    attack: function() {
        if(!GameState.gameActive) return false;
        
        const nearest = GameAI.findNearestEnemy(
            GameState.player.x, 
            GameState.player.y, 
            GameBalance.ATTACK_RADIUS
        );
        
        if(nearest) {
            const defeated = GameAI.damageEnemy(nearest, GameBalance.PLAYER_DAMAGE);
            if(window.EffectsManager) {
                EffectsManager.addHitEffect(nearest.x, nearest.y);
            }
            SoundManager.play('hit');
            
            if(defeated) {
                console.log("💀 Enemy defeated!");
            }
            return true;
        }
        
        return false;
    },
    
    restart: function() {
        GameState.reset();
        GameAI.clearEnemies();
        if(window.GameCamera) GameCamera.reset();
        if(window.EffectsManager) EffectsManager.effects = [];
        SoundManager.playMusic('ambient', 0.3);
        console.log("🔄 Game restarted!");
    },
    
    render: function() {
        if(!GameRenderer.ctx || !GameState) return;
        
        const ctx = GameRenderer.ctx;
        
        // Очистка и фон
        GameRenderer.drawGround();
        
        // Деревья
        for(let tree of GameState.world.trees) {
            GameRenderer.drawTree(tree.x, tree.y);
        }
        
        // Ягоды
        for(let berry of GameState.world.berries) {
            GameRenderer.drawBerry(berry.x, berry.y, berry.count);
        }
        
        // Враги
        for(let enemy of GameState.enemies) {
            GameRenderer.drawEnemy(enemy.x, enemy.y, enemy.hp, enemy.maxHp, enemy.type);
        }
        
        // Игрок
        GameRenderer.drawPlayer(GameState.player.x, GameState.player.y, GameState.player.hp);
        
        // Эффекты
        if(window.EffectsManager && GameCamera) {
            EffectsManager.draw(ctx, GameCamera);
        }
        
        // UI
        if(window.drawUIPanel) {
            drawUIPanel(ctx, 
                GameState.player.hp, 
                GameState.player.hunger, 
                GameState.player.wood, 
                GameState.day
            );
        }
        
        if(window.drawUIButtons) {
            drawUIButtons(ctx);
        }
        
        if(window.drawMinimap && GameCamera) {
            drawMinimap(ctx, GameCamera);
        }
        
        // Game Over экран
        if(!GameState.gameActive) {
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.fillRect(0, 0, 800, 600);
            ctx.fillStyle = "#ff6666";
            ctx.font = "bold 32px monospace";
            ctx.fillText("GAME OVER", 310, 300);
            ctx.font = "14px monospace";
            ctx.fillStyle = "#fff";
            ctx.fillText("Press RESTART or R", 340, 360);
        }
    }
};


console.log("⚙️ Core ready");
