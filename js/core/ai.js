
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
        switch(enemy.type) {
            case 'patrol': return this.patrolBehavior(enemy, delta);
            case 'guard': return this.guardBehavior(enemy, playerX, playerY, distToPlayer);
            case 'wander': return this.wanderBehavior(enemy, delta);
            default: return { x: 0, y: 0 };
        }
    }
     patrolBehavior(enemy, delta) {
        const patrol = enemy.behavior.patrolPoints;
        if (!patrol) return { x: 0, y: 0 };
        
        const target = patrol[enemy.behavior.currentPatrolIndex];
        const distToTarget = Math.hypot(target.x - enemy.x, target.y - enemy.y);
        
        if (distToTarget < 20) {
            enemy.behavior.currentPatrolIndex = (enemy.behavior.currentPatrolIndex + 1) % patrol.length;
            return { x: 0, y: 0 };
        }
        
        const dirX = target.x - enemy.x;
        const dirY = target.y - enemy.y;
        const dist = Math.hypot(dirX, dirY);
        
        if (dist > 0.01) {
            return {
                x: (dirX / dist) * this.gameBalance.ENEMY_SPEED * 0.7,
                y: (dirY / dist) * this.gameBalance.ENEMY_SPEED * 0.7
            };
        }
        return { x: 0, y: 0 };
    }
    
    guardBehavior(enemy, playerX, playerY, distToPlayer) {
        const guardPoint = enemy.behavior.guardPoint;
        if (!guardPoint) return { x: 0, y: 0 };
        
        const distToGuard = Math.hypot(guardPoint.x - enemy.x, guardPoint.y - enemy.y);
        
        if (distToGuard > guardPoint.radius) {
            const dirX = guardPoint.x - enemy.x;
            const dirY = guardPoint.y - enemy.y;
            const dist = Math.hypot(dirX, dirY);
            if (dist > 0.01) {
                return {
                    x: (dirX / dist) * this.gameBalance.ENEMY_SPEED * 0.8,
                    y: (dirY / dist) * this.gameBalance.ENEMY_SPEED * 0.8
                };
            }
        } else if (distToPlayer < 250 && distToPlayer > 50) {
            const dirX = playerX - enemy.x;
            const dirY = playerY - enemy.y;
            const dist = Math.hypot(dirX, dirY);
            if (dist > 0.01) {
                return {
                    x: (dirX / dist) * this.gameBalance.ENEMY_SPEED * 0.5,
                    y: (dirY / dist) * this.gameBalance.ENEMY_SPEED * 0.5
                };
            }
        }
        return { x: 0, y: 0 };
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

    findNearestEnemy(playerX, playerY, range) {
        let nearest = null;
        let minDist = range;
        
        for (const e of this.gameState.enemies) {
            if (e.hp <= 0) continue;
            const dist = Math.hypot(playerX - e.x, playerY - e.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        }
        return nearest;
    }
    
    damageEnemy(enemy, damage) {
        if (!enemy) return false;
        enemy.hp -= damage;
        
        if (enemy.hp <= 0) {
            const idx = this.gameState.enemies.indexOf(enemy);
            if (idx > -1) this.gameState.enemies.splice(idx, 1);
            return true;
        }
        return false;
    }
    
    checkAttack(playerX, playerY) {
        return this.gameState.enemies.find(e => e.hp > 0 && Math.hypot(e.x - playerX, e.y - playerY) < 35) || null;
    }
    
    clearEnemies() {
        this.gameState.enemies = [];
    }
}
