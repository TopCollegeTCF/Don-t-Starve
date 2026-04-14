// AI врагов
window.GameAI = {
    updateEnemies: function(delta, playerX, playerY) {
        for(let enemy of GameState.enemies) {
            if(enemy.hp <= 0) continue;
            
            const dx = playerX - enemy.x;
            const dy = playerY - enemy.y;
            const distToPlayer = Math.hypot(dx, dy);
            
            let moveX = 0, moveY = 0;
            
            if(distToPlayer < 200) {
                // Агрессия - преследование
                if(distToPlayer > 0.01) {
                    moveX = (dx / distToPlayer) * GameBalance.ENEMY_SPEED;
                    moveY = (dy / distToPlayer) * GameBalance.ENEMY_SPEED;
                }
            } else {
                // Поведение в зависимости от типа
                switch(enemy.type) {
                    case 'patrol':
                        const patrolMove = this.patrolBehavior(enemy, delta);
                        moveX = patrolMove.x;
                        moveY = patrolMove.y;
                        break;
                    case 'guard':
                        const guardMove = this.guardBehavior(enemy, playerX, playerY, distToPlayer);
                        moveX = guardMove.x;
                        moveY = guardMove.y;
                        break;
                    case 'wander':
                        const wanderMove = this.wanderBehavior(enemy, delta);
                        moveX = wanderMove.x;
                        moveY = wanderMove.y;
                        break;
                }
            }
            
            enemy.x += moveX * delta;
            enemy.y += moveY * delta;
            
            enemy.x = Math.max(20, Math.min(GameConfig.WORLD_WIDTH - 20, enemy.x));
            enemy.y = Math.max(20, Math.min(GameConfig.WORLD_HEIGHT - 20, enemy.y));
        }
    },
    
    patrolBehavior: function(enemy, delta) {
        const patrol = enemy.behavior.patrolPoints;
        if(!patrol) return { x: 0, y: 0 };
        
        const target = patrol[enemy.behavior.currentPatrolIndex];
        const distToTarget = Math.hypot(target.x - enemy.x, target.y - enemy.y);
        
        if(distToTarget < 20) {
            enemy.behavior.currentPatrolIndex = (enemy.behavior.currentPatrolIndex + 1) % patrol.length;
            return { x: 0, y: 0 };
        }
        
        const dirX = target.x - enemy.x;
        const dirY = target.y - enemy.y;
        const dist = Math.hypot(dirX, dirY);
        
        if(dist > 0.01) {
            return {
                x: (dirX / dist) * GameBalance.ENEMY_SPEED * 0.7,
                y: (dirY / dist) * GameBalance.ENEMY_SPEED * 0.7
            };
        }
        return { x: 0, y: 0 };
    },
    
    guardBehavior: function(enemy, playerX, playerY, distToPlayer) {
        const guardPoint = enemy.behavior.guardPoint;
        if(!guardPoint) return { x: 0, y: 0 };
        
        const distToGuard = Math.hypot(guardPoint.x - enemy.x, guardPoint.y - enemy.y);
        
        if(distToGuard > guardPoint.radius) {
            const dirX = guardPoint.x - enemy.x;
            const dirY = guardPoint.y - enemy.y;
            const dist = Math.hypot(dirX, dirY);
            if(dist > 0.01) {
                return {
                    x: (dirX / dist) * GameBalance.ENEMY_SPEED * 0.8,
                    y: (dirY / dist) * GameBalance.ENEMY_SPEED * 0.8
                };
            }
        } else if(distToPlayer < 250 && distToPlayer > 50) {
            const dirX = playerX - enemy.x;
            const dirY = playerY - enemy.y;
            const dist = Math.hypot(dirX, dirY);
            if(dist > 0.01) {
                return {
                    x: (dirX / dist) * GameBalance.ENEMY_SPEED * 0.5,
                    y: (dirY / dist) * GameBalance.ENEMY_SPEED * 0.5
                };
            }
        }
        return { x: 0, y: 0 };
    },
    
    wanderBehavior: function(enemy, delta) {
        enemy.behavior.wanderTimer += delta;
        if(enemy.behavior.wanderTimer > 3) {
            enemy.behavior.wanderTimer = 0;
            enemy.behavior.wanderAngle += (Math.random() - 0.5) * Math.PI;
        }
        return {
            x: Math.cos(enemy.behavior.wanderAngle) * GameBalance.ENEMY_SPEED * 0.4,
            y: Math.sin(enemy.behavior.wanderAngle) * GameBalance.ENEMY_SPEED * 0.4
        };
    },
    
    findNearestEnemy: function(playerX, playerY, range) {
        let nearest = null;
        let minDist = range;
        
        for(let e of GameState.enemies) {
            if(e.hp <= 0) continue;
            const dist = Math.hypot(playerX - e.x, playerY - e.y);
            if(dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        }
        return nearest;
    },
    
    damageEnemy: function(enemy, damage) {
        if(!enemy) return false;
        enemy.hp -= damage;
        console.log(`💥 Enemy damaged: ${enemy.hp}/${enemy.maxHp} HP`);
        
        if(enemy.hp <= 0) {
            const index = GameState.enemies.indexOf(enemy);
            if(index > -1) GameState.enemies.splice(index, 1);
            console.log(`☠️ Enemy defeated! Remaining: ${GameState.enemies.length}`);
            return true;
        }
        return false;
    },
    
    checkAttack: function(playerX, playerY) {
        for(let enemy of GameState.enemies) {
            if(enemy.hp <= 0) continue;
            if(Math.hypot(enemy.x - playerX, enemy.y - playerY) < 35) {
                return enemy;
            }
        }
        return null;
    },
    
    clearEnemies: function() {
        GameState.enemies = [];
    }
};

console.log("🤖 AI ready");
