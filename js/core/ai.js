
// js/core/ai.js

class GameAI {
    constructor(gameState, gameBalance, gameConfig) {
        this.gameState = gameState;
        this.gameBalance = gameBalance;
        this.gameConfig = gameConfig;
    }

 
    updateEnemies(delta, playerX, playerY) {
        for (let i = 0; i < this.gameState.enemies.length; i++) {
            const enemy = this.gameState.enemies[i];

            // Проверяем, жив ли враг
            if (enemy.hp <= 0) {
              
                continue; 
            }

            const dx = playerX - enemy.x;
            const dy = playerY - enemy.y;
            const distToPlayer = Math.hypot(dx, dy); 

            let moveX = 0;
            let moveY = 0;

            
            if (distToPlayer < 200) {
                
                if (distToPlayer > 0.01) { 
                    moveX = (dx / distToPlayer) * this.gameBalance.ENEMY_SPEED;
                    moveY = (dy / distToPlayer) * this.gameBalance.ENEMY_SPEED;
                }
            } else {
              
                const move = this.getBehaviorMove(enemy, delta, playerX, playerY, distToPlayer);
                moveX = move.x;
                moveY = move.y;
            }

            // Применяем рассчитанное движение
            enemy.x += moveX * delta;
            enemy.y += moveY * delta;

           
            enemy.x = Math.max(20, Math.min(this.gameConfig.WORLD_WIDTH - 20, enemy.x));
            enemy.y = Math.max(20, Math.min(this.gameConfig.WORLD_HEIGHT - 20, enemy.y));

          
            if (moveX !== 0 || moveY !== 0) {
                enemy.direction = Math.atan2(moveY, moveX);
            }
        }
    }

   
    getBehaviorMove(enemy, delta, playerX, playerY, distToPlayer) {
    
        return { x: 0, y: 0 };
    }
if(enemy.hp <= 0) {
    const index = GameState.enemies.indexOf(enemy);
    if(index > -1) {
        // Дроп ресурсов
        const woodDrop = 5 + Math.floor(Math.random() * 10);
        GameState.addWood(woodDrop);
        console.log(`💰 Enemy dropped ${woodDrop} wood!`);
        
        // Эффект дропа
        if(window.EffectsManager) {
            EffectsManager.addPickupEffect(enemy.x, enemy.y);
        }
        
        GameState.enemies.splice(index, 1);
    }
    console.log(`☠️ Enemy defeated! Remaining: ${GameState.enemies.length}`);
    return true;
}
wanderBehavior: function(enemy, delta, playerX, playerY) {
    const distToPlayer = Math.hypot(enemy.x - playerX, enemy.y - playerY);
    
    // Если игрок близко - убегаем
    if(distToPlayer < 150) {
        const dx = enemy.x - playerX;
        const dy = enemy.y - playerY;
        const dist = Math.hypot(dx, dy);
        if(dist > 0.01) {
            return {
                x: (dx / dist) * GameBalance.ENEMY_SPEED * 0.8,
                y: (dy / dist) * GameBalance.ENEMY_SPEED * 0.8
            };
        }
    }
    
    // Иначе случайное блуждание
    enemy.behavior.wanderTimer += delta;
    if(enemy.behavior.wanderTimer > 3) {
        enemy.behavior.wanderTimer = 0;
        enemy.behavior.wanderAngle += (Math.random() - 0.5) * Math.PI;
    }
    return {
        x: Math.cos(enemy.behavior.wanderAngle) * GameBalance.ENEMY_SPEED * 0.4,
        y: Math.sin(enemy.behavior.wanderAngle) * GameBalance.ENEMY_SPEED * 0.4
    };
}

