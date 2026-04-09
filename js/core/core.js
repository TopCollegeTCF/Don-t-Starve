//---------------------------------------------------------------
// Создание игрока, сбор ресурсов, смена дня и ночи, игровой цикл
//---------------------------------------------------------------

let nameGroup = "Core Mechanics"
// Функция для рисования тела игрока (жёлтый круг)
window.drawPlayerBody = function(ctx, x, y) {
    // TODO: Жёлтый круг радиусом 15 в точке (x, y)
    // Используй: fillStyle = 'yellow', beginPath, arc, fill
    // 👇 Твой код здесь
  console.log("Работает")

}

// Функция для игрового цикла (заглушка)
window.startGameLoop = function() {
    console.log("🎮 Game loop initialized");
    return true;
};

// Функция для обновления игрового состояния
window.updateGame = function(deltaTime) {
    console.log("🔄 Game update: " + deltaTime);
};

function helloCore() {
    console.log("⚙️ Core Mechanics ready");
    return { status: "ready", module: "core" };
}

// Функция для игрового цикла (заглушка)
window.startGameLoop = function() {
    console.log("🎮 Game loop initialized");
    return true;
};

// Функция для обновления игрового состояния
window.updateGame = function(deltaTime) {
    console.log("🔄 Game update: " + deltaTime);
};

// Функция для рисования полного игрока
window.drawPlayer = function(ctx, x, y) {
    // TODO: Вызвать drawPlayerBody и drawPlayerEyes
    window.drawPlayerBody(ctx, x, y);
    window.drawPlayerEyes(ctx, x, y);
    
    // Бонус: добавить улыбку
    // ctx.beginPath();
    // ctx.arc(x, y+5, 8, 0.1, Math.PI - 0.1);
    // ctx.strokeStyle = 'black';
    // ctx.stroke();
}

// Функция для рисования глаз игрока
window.drawPlayerEyes = function(ctx, x, y) {
    // TODO: Два белых круга радиусом 3 на (x-5, y-5) и (x+5, y-5)
    // TODO: Два чёрных круга радиусом 1.5 внутри них
    // 👇 Твой код здесь
    
}



// Функция для рисования тела игрока (жёлтый круг)
window.drawPlayerBody = function(ctx, x, y) {
    // TODO: Жёлтый круг радиусом 15 в точке (x, y)
    // Используй: fillStyle = 'yellow', beginPath, arc, fill
    // 👇 Твой код здесь
  console.log("Работает")

}

function helloCore() {
    console.log("⚙️ Core Mechanics ready");
}

window.CoreGame = {
    // Добавить свойства
    fpsCounter: 0,
    fpsTimer: 0,
    currentFPS: 0,
    lastTimestamp: 0,
    gameActive: true,
    
    // Запуск игрового цикла
    start: function() {
        this.lastTimestamp = 0;
        console.log("🎮 Game loop started");

        autoGatherResources: function() {
    if(!GameState.gameActive) return;
    
    const autoRadius = 25;  // Радиус автоподбора
    
    // Автосбор деревьев
    const trees = GameState.getTreesInRange(GameState.player.x, GameState.player.y, autoRadius);
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
    }
    
    // Автосбор ягод
    const berries = GameState.getBerriesInRange(GameState.player.x, GameState.player.y, autoRadius);
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
    }
}

    },
    
    // Игровой цикл (вызывается из requestAnimationFrame)
    gameLoop: function(currentTime) {
        if(this.lastTimestamp === 0) {
            this.lastTimestamp = currentTime;
            return;
        }
        
        let delta = Math.min(0.033, (currentTime - this.lastTimestamp) / 1000);
        if(delta > 0.01) {
            this.update(delta);
        }
        this.lastTimestamp = currentTime;
        this.render();
    },
    
    // Обновление логики игры
    update: function(delta) {
        if(!GameState.gameActive) return;

                // Добавить в начало метода
        this.fpsTimer += delta;
        if(this.fpsTimer >= 1.0) {
            this.currentFPS = Math.round(this.fpsCounter / this.fpsTimer);
            this.fpsCounter = 0;
            this.fpsTimer = 0;
        }
        this.fpsCounter++;
        
        // Движение игрока
        GameState.movePlayer(delta, GameBalance.PLAYER_SPEED);

        this.autoGatherResources();
        
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
            console.log(`🌞 Day ${GameState.day}`);
        }

        const isNight = SoundManager.isNightTime(GameState.dayTimer, GameBalance.DAY_DURATION);
        if(isNight && !this.wasNight) {
            SoundManager.playNightMusic();
            this.wasNight = true;
        } else if(!isNight && this.wasNight) {
            SoundManager.playDayMusic();
            this.wasNight = false;
        }
        
        // Спавн врагов
        GameState.spawnTimer += delta;
        if(GameState.spawnTimer >= GameBalance.ENEMY_SPAWN_DELAY && GameAI.getEnemies().length < 3) {
            GameState.spawnTimer = 0;
            GameAI.spawnEnemy();
        }
        
        // Движение врагов
        GameAI.updateEnemies(delta, GameState.player.x, GameState.player.y);
        
        // Атака врагов на игрока
        const attacker = GameAI.checkAttack(GameState.player.x, GameState.player.y);
        if(attacker) {
            GameState.damagePlayer(delta * GameBalance.ENEMY_DAMAGE);
        }
        
        // Обновление эффектов
        EffectsManager.update(delta);
        
        // Проверка смерти
        if(GameState.player.hp <= 0) {
            GameState.gameActive = false;
            SoundManager.play('gameover');
            SoundManager.stopMusic('ambient');
        }
    },
    
    // Сбор ресурсов
    gather: function() {
        if(!GameState.gameActive) return;
        
        // Поиск ближайшего дерева
        let nearestTree = null;
        let minDist = GameBalance.GATHER_RADIUS;
        
        for(let i = 0; i < GameState.trees.length; i++) {
            const tree = GameState.trees[i];
            const dist = Math.hypot(GameState.player.x - tree.x, GameState.player.y - tree.y);
            if(dist < minDist && tree.wood > 0) {
                minDist = dist;
                nearestTree = { tree, index: i };
            }
        }
        
        if(nearestTree) {
            const gain = Math.min(nearestTree.tree.wood, GameBalance.GATHER_WOOD_AMOUNT);
            nearestTree.tree.wood -= gain;
            GameState.addWood(gain);
            EffectsManager.addPickupEffect(nearestTree.tree.x, nearestTree.tree.y);
            
            if(nearestTree.tree.wood <= 0) {
                GameState.removeTree(nearestTree.index);
            }
            return true;
        }
        
        // Поиск ягод
        let nearestBerry = null;
        minDist = GameBalance.GATHER_RADIUS;
        
        for(let i = 0; i < GameState.berries.length; i++) {
            const berry = GameState.berries[i];
            const dist = Math.hypot(GameState.player.x - berry.x, GameState.player.y - berry.y);
            if(dist < minDist && berry.count > 0) {
                minDist = dist;
                nearestBerry = { berry, index: i };
            }
        }
        
        if(nearestBerry) {
            const gain = Math.min(nearestBerry.berry.count, GameBalance.GATHER_BERRY_AMOUNT);
            nearestBerry.berry.count -= gain;
            GameState.addHunger(gain * GameBalance.BERRY_HUNGER_RESTORE);
            EffectsManager.addPickupEffect(nearestBerry.berry.x, nearestBerry.berry.y);
            
            if(nearestBerry.berry.count <= 0) {
                GameState.removeBerry(nearestBerry.index);
            }
            return true;
        }
        
        return false;
    },
    
    // Атака врага
    attack: function() {
    if(!GameState.gameActive) return;
    
    const nearest = GameAI.findNearestEnemy(
        GameState.player.x, 
        GameState.player.y, 
        GameBalance.ATTACK_RADIUS
    );
    
    if(nearest) {
        const enemyId = nearest.id;
        const defeated = GameAI.damageEnemy(enemyId, GameBalance.PLAYER_DAMAGE);
        EffectsManager.addHitEffect(nearest.x, nearest.y);
        SoundManager.play('click');  // <-- Добавить эту строку
        
        if(defeated) {
            console.log("💀 Enemy defeated!");
        }
        return true;
    }
    
    return false;
},
    
    // Перезапуск игры
    restart: function() {
        GameState.reset();
        GameAI.clearEnemies();
        EffectsManager.effects = [];
        SoundManager.playMusic('ambient', 0.3);
        console.log("🔄 Game restarted!");
    },
    
    // Отрисовка (вызывается из gameLoop)
    render: function() {
        GameRenderer.drawGround();
        
        // Деревья
        for(let tree of GameState.trees) {
            GameRenderer.drawTree(tree.x, tree.y);
        }
        
        // Ягоды
        for(let berry of GameState.berries) {
            GameRenderer.drawBerry(berry.x, berry.y, berry.count);
        }
        
        // Враги
        for(let enemy of GameAI.getEnemies()) {
            GameRenderer.drawEnemy(enemy.x, enemy.y, enemy.hp, enemy.maxHp);
        }

        // Добавить после отрисовки врагов
        if(GameBalance.FOG_OF_WAR_ENABLED) {
            GameRenderer.drawFogOfWar(GameState.player.x, GameState.player.y, GameBalance.VISION_RADIUS);
        }    
        
        // Игрок
        GameRenderer.drawPlayer(GameState.player.x, GameState.player.y, GameState.player.hp);
        
        // Эффекты

        EffectsManager.draw(ctx, GameCamera);
        
        // UI панель
        drawUIPanel(GameRenderer.ctx, 
            GameState.player.hp, 
            GameState.player.hunger, 
            GameState.player.wood, 
            GameState.day
        );
        
        // Кнопки
        drawUIButtons(GameRenderer.ctx);
        
        // После отрисовки UI панели и кнопок добавить:
        // Эффекты
        EffectsManager.draw(GameRenderer.ctx);
        // Индикатор цели
        if(GameState.player.targetX !== null) {
            const ctx = GameRenderer.ctx;
            ctx.beginPath();
            ctx.arc(GameState.player.targetX, GameState.player.targetY, 8, 0, Math.PI * 2);
            ctx.strokeStyle = "#ffaa44";
            ctx.lineWidth = 2;
            ctx.stroke();
        }


                // Добавить перед Game Over экраном
        if(GameBalance.SHOW_FPS) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(5, 5, 50, 20);
            ctx.fillStyle = "#0f0";
            ctx.font = "10px monospace";
            ctx.fillText(`FPS: ${this.currentFPS}`, 8, 20);
        }
        
        // Добавить перед Game Over экраном
        drawLowHealthOverlay(ctx, GameState.player.hp);

        // Game Over
        if(!GameState.gameActive) {
            const ctx = GameRenderer.ctx;
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

helloCore();


