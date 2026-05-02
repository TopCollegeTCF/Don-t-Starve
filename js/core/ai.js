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

            // Если игрок рядом — враг идёт к нему
            if (distToPlayer < 200) {
                if (distToPlayer > 0.01) {
                    moveX = (dx / distToPlayer) * this.gameBalance.ENEMY_SPEED;
                    moveY = (dy / distToPlayer) * this.gameBalance.ENEMY_SPEED;
                }
            } else {
                // Если игрок далеко — враг действует по своему поведению
                const move = this.getBehaviorMove(enemy, delta, playerX, playerY, distToPlayer);
                moveX = move.x;
                moveY = move.y;
            }

            // Применяем рассчитанное движение
            enemy.x += moveX * delta;
            enemy.y += moveY * delta;

            // Не даём врагу выйти за границы мира
            enemy.x = Math.max(20, Math.min(this.gameConfig.WORLD_WIDTH - 20, enemy.x));
            enemy.y = Math.max(20, Math.min(this.gameConfig.WORLD_HEIGHT - 20, enemy.y));

            // Обновляем направление врага
            if (moveX !== 0 || moveY !== 0) {
                enemy.direction = Math.atan2(moveY, moveX);
            }
        }
    }

    getBehaviorMove(enemy, delta, playerX, playerY, distToPlayer) {
        switch (enemy.type) {
            case 'patrol':
                return this.patrolBehavior(enemy, delta);

            case 'guard':
                return this.guardBehavior(enemy, playerX, playerY, distToPlayer);

            case 'wander':
                return this.wanderBehavior(enemy, delta, playerX, playerY);

            default:
                return { x: 0, y: 0 };
        }
    }

    patrolBehavior(enemy, delta) {
        if (!enemy.behavior) {
            enemy.behavior = {};
        }

        const patrol = enemy.behavior.patrolPoints;

        if (!patrol || patrol.length === 0) {
            return { x: 0, y: 0 };
        }

        if (enemy.behavior.currentPatrolIndex === undefined) {
            enemy.behavior.currentPatrolIndex = 0;
        }

        const target = patrol[enemy.behavior.currentPatrolIndex];

        const distToTarget = Math.hypot(
            target.x - enemy.x,
            target.y - enemy.y
        );

        if (distToTarget < 20) {
            enemy.behavior.currentPatrolIndex =
                (enemy.behavior.currentPatrolIndex + 1) % patrol.length;

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
        if (!enemy.behavior) {
            enemy.behavior = {};
        }

        const guardPoint = enemy.behavior.guardPoint;

        if (!guardPoint) {
            return { x: 0, y: 0 };
        }

        const radius = guardPoint.radius || 120;

        const distToGuard = Math.hypot(
            guardPoint.x - enemy.x,
            guardPoint.y - enemy.y
        );

        // Если охранник ушёл далеко от своей точки — возвращаем его назад
        if (distToGuard > radius) {
            const dirX = guardPoint.x - enemy.x;
            const dirY = guardPoint.y - enemy.y;
            const dist = Math.hypot(dirX, dirY);

            if (dist > 0.01) {
                return {
                    x: (dirX / dist) * this.gameBalance.ENEMY_SPEED * 0.8,
                    y: (dirY / dist) * this.gameBalance.ENEMY_SPEED * 0.8
                };
            }
        }

        // Если игрок рядом с зоной охраны — охранник приближается медленнее
        if (distToPlayer < 250 && distToPlayer > 50) {
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

    wanderBehavior(enemy, delta, playerX, playerY) {
        if (!enemy.behavior) {
            enemy.behavior = {};
        }

        if (enemy.behavior.wanderTimer === undefined) {
            enemy.behavior.wanderTimer = 0;
        }

        if (enemy.behavior.pauseTimer === undefined) {
            enemy.behavior.pauseTimer = 0;
        }

        if (enemy.behavior.wanderAngle === undefined) {
            enemy.behavior.wanderAngle = Math.random() * Math.PI * 2;
        }

        const distToPlayer = Math.hypot(
            enemy.x - playerX,
            enemy.y - playerY
        );

        // Если игрок близко — враг убегает
        if (distToPlayer < 150) {
            const dx = enemy.x - playerX;
            const dy = enemy.y - playerY;
            const dist = Math.hypot(dx, dy);

            if (dist > 0.01) {
                return {
                    x: (dx / dist) * this.gameBalance.ENEMY_SPEED * 0.8,
                    y: (dy / dist) * this.gameBalance.ENEMY_SPEED * 0.8
                };
            }
        }

        // Иначе случайное блуждание
        if (enemy.behavior.pauseTimer > 0) {
            enemy.behavior.pauseTimer -= delta;
            return { x: 0, y: 0 };
        }

        enemy.behavior.wanderTimer += delta;

        if (enemy.behavior.wanderTimer > 3) {
            enemy.behavior.wanderTimer = 0;
            enemy.behavior.wanderAngle += (Math.random() - 0.5) * Math.PI;
            enemy.behavior.pauseTimer = 0.6 + Math.random() * 0.6;
        }

        return {
            x: Math.cos(enemy.behavior.wanderAngle) * this.gameBalance.ENEMY_SPEED * 0.4,
            y: Math.sin(enemy.behavior.wanderAngle) * this.gameBalance.ENEMY_SPEED * 0.4
        };
    }

    findNearestEnemy(playerX, playerY, range) {
        let nearest = null;
        let minDist = range;

        for (const enemy of this.gameState.enemies) {
            if (enemy.hp <= 0) {
                continue;
            }

            const dist = Math.hypot(
                playerX - enemy.x,
                playerY - enemy.y
            );

            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        }

        return nearest;
    }

    damageEnemy(enemy, damage) {
        if (!enemy) {
            return false;
        }

        enemy.hp -= damage;

        if (enemy.hp <= 0) {
            const idx = this.gameState.enemies.indexOf(enemy);

            if (idx > -1) {
                this.gameState.enemies.splice(idx, 1);
            }

            return true;
        }

        return false;
    }

    checkAttack(playerX, playerY) {
        return this.gameState.enemies.find(enemy => {
            return enemy.hp > 0 && Math.hypot(enemy.x - playerX, enemy.y - playerY) < 35;
        }) || null;
    }

    clearEnemies() {
        this.gameState.enemies = [];
    }
}
