window.addEventListener('DOMContentLoaded', () => {
    console.log("🎮 Starting Don't Starve Clone...");
    
    const camera = new GameCamera();
    window.gameState.init();
    camera.reset(window.gameState.player.x, window.gameState.player.y);
    
    const gameAI = new GameAI(window.gameState, window.gameBalance, window.gameConfig);
    
    window.soundManager.loadAll(window.gameConfig.sounds, () => {
        console.log("✅ All sounds loaded!");
    });
    
    window.assetLoader.loadAll(window.gameConfig.images, () => {
        console.log("✅ All images loaded!");
    });
    
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const renderer = new GameRenderer(ctx, camera);
    
    const coreGame = new CoreGame(
        window.gameState, 
        window.gameBalance, 
        gameAI, 
        window.effectsManager, 
        window.soundManager, 
        camera
    );

    // Добавить после создания coreGame, перед inputHandler:

// Создаем мини-карту
    const minimap = new MiniMap(coreGame, camera);
    coreGame.minimap = minimap;

    // В функции animate, после отрисовки всех систем, добавить:
    if (coreGame.minimap) coreGame.minimap.draw(renderer.ctx);

    // ДОБАВИТЬ СИСТЕМЫ
    coreGame.showNotification = (msg) => {
    coreGame.notificationMsg = msg;
    coreGame.notifTimer = 2;
    };
    
    const visualEffects = new VisualEffects();
    const dayNight = new DayNightSystem();
    dayNight.initStars();
    const experience = new ExperienceSystem(window.gameState);
    const achievements = new AchievementSystem(window.gameState);
    const crafting = new CraftingSystem(window.gameState, coreGame);
    const saveSystem = new SaveSystem(window.gameState, coreGame);
    
    coreGame.visualEffects = visualEffects;
    coreGame.dayNight = dayNight;
    window.gameState.experience = experience;
    window.gameState.achievements = achievements;
    coreGame.crafting = crafting;
    coreGame.saveSystem = saveSystem;
    
    // ПАТЧИ МЕТОДОВ
    const originalGather = coreGame.gather;
    coreGame.gather = function() {
        const result = originalGather.call(this);
        if (result && this.visualEffects) {
            const trees = this.gameState.getTreesInRange(this.gameState.player.x, this.gameState.player.y, 55);
            if (trees[0]) this.visualEffects.addPickup(trees[0].x, trees[0].y);
        }
        return result;
    };
    
    const originalAttack = coreGame.attack;
    coreGame.attack = function() {
        const nearest = this.gameAI.findNearestEnemy(this.gameState.player.x, this.gameState.player.y, 60);
        const result = originalAttack.call(this);
        if (result && nearest && this.visualEffects) {
            this.visualEffects.addHit(nearest.x, nearest.y);
        }
        return result;
    };
    
    const originalDamageEnemy = gameAI.damageEnemy;
    gameAI.damageEnemy = function(enemy, damage) {
        const wasAlive = enemy && enemy.hp > 0;
        const result = originalDamageEnemy.call(this, enemy, damage);
        if (wasAlive && enemy && enemy.hp <= 0 && window.gameState) {
            if (window.gameState.experience) window.gameState.experience.addExp(25);
            if (window.gameState.achievements) window.gameState.achievements.addKill();
        }
        return result;
    };
    
    const originalAddWood = window.gameState.addWood;
    window.gameState.addWood = function(amount) {
        originalAddWood.call(this, amount);
        if (this.achievements) this.achievements.addWood(amount);
    };
    
    const inputHandler = new InputHandler(canvas, camera, coreGame);
    coreGame.start();
    
    let lastTimestamp = 0;
    
    function animate(timestamp) {
        if (lastTimestamp === 0) {
            lastTimestamp = timestamp;
            requestAnimationFrame(animate);
            return;
        }
        
        let delta = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
        
        if (delta > 0.01) {
            coreGame.update(delta);
            
            // ОБНОВЛЕНИЕ СИСТЕМ
            if (coreGame.visualEffects) coreGame.visualEffects.update(delta);
            if (coreGame.dayNight && coreGame.gameState) {
                coreGame.dayNight.update(coreGame.gameState.dayTimer, coreGame.gameBalance.DAY_DURATION);
            }
            if (coreGame.gameState.experience) coreGame.gameState.experience.update(delta);
            if (coreGame.gameState.achievements) coreGame.gameState.achievements.update(delta);
            if (coreGame.notifTimer) {
                coreGame.notifTimer -= delta;
                if (coreGame.notifTimer <= 0) coreGame.notificationMsg = null;
            }
        }
        
        lastTimestamp = timestamp;
        coreGame.render(renderer);
        
        // ОТРИСОВКА СИСТЕМ
        if (coreGame.dayNight) coreGame.dayNight.draw(renderer.ctx);
        if (coreGame.visualEffects) coreGame.visualEffects.draw(renderer.ctx, camera);
        if (coreGame.gameState.experience) {
            coreGame.gameState.experience.draw(renderer.ctx, camera, coreGame.gameState.player.x, coreGame.gameState.player.y);
        }
        if (coreGame.gameState.achievements) coreGame.gameState.achievements.draw(renderer.ctx);
        if (coreGame.crafting) coreGame.crafting.draw(renderer.ctx);
        if (coreGame.notificationMsg) {
            renderer.ctx.fillStyle = "rgba(0,0,0,0.8)";
            renderer.ctx.fillRect(250, 500, 300, 40);
            renderer.ctx.fillStyle = "#ffde9c";
            renderer.ctx.font = "14px monospace";
            renderer.ctx.fillText(coreGame.notificationMsg, 270, 525);
        }
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
    console.log("✅ Game initialized with upgrades!");
});
