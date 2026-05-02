// js/core/ai.js

class GameAI {
    constructor(gameState, gameBalance, gameConfig) {
        this.gameState = gameState;
        this.gameBalance = gameBalance;
        this.gameConfig = gameConfig;
    }

    isEnemyAlive(enemy) {
        return !!enemy && enemy.hp > 0;
    }

    getWorldMargin(enemy) {
        const customMargin = enemy && enemy.behavior ? enemy.behavior.boundaryMargin : undefined;
        return Math.max(10, customMargin || 20);
    }

    separateEnemies(enemy, index) {
        const minDist = 24;

        for (let j = index + 1; j < this.gameState.enemies.length; j++) {
            const other = this.gameState.enemies[j];
            if (!this.isEnemyAlive(other)) {
                continue;
            }

            const dx = enemy.x - other.x;
            const dy = enemy.y - other.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 0.01 && dist < minDist) {
                const push = (minDist - dist) * 0.08;
                const nx = dx / dist;
                const ny = dy / dist;
                enemy.x += nx * push;
                enemy.y += ny * push;
                other.x -= nx * push;
                other.y -= ny * push;
            }
        }
    }

    updateEnemies(delta, playerX, playerY) {
        for (let i = 0; i < this.gameState.enemies.length; i++) {
            const enemy = this.gameState.enemies[i];

            if (!enemy || typeof enemy.x !== 'number' || typeof enemy.y !== 'number') {
                continue;
            }

            if (enemy.direction === undefined) {
                enemy.direction = 0;
            }

            if (!this.isEnemyAlive(enemy)) {
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

            let speedMultiplier = enemy.speedMultiplier || 1;
            if (enemy.maxHp && enemy.hp / enemy.maxHp < 0.4) {
                speedMultiplier *= 0.85;
            }
            if (distToPlayer < 90) {
                speedMultiplier *= 1.1;
            }
            moveX *= speedMultiplier;
            moveY *= speedMultiplier;

            enemy.x += moveX * delta;
            enemy.y += moveY * delta;

            this.separateEnemies(enemy, i);

            const margin = this.getWorldMargin(enemy);
            enemy.x = Math.max(margin, Math.min(this.gameConfig.WORLD_WIDTH - margin, enemy.x));
            enemy.y = Math.max(margin, Math.min(this.gameConfig.WORLD_HEIGHT - margin, enemy.y));

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

        if (enemy.behavior.patrolPauseTimer === undefined) {
            enemy.behavior.patrolPauseTimer = 0;
        }

        if (enemy.behavior.patrolPauseTimer > 0) {
            enemy.behavior.patrolPauseTimer = Math.max(0, enemy.behavior.patrolPauseTimer - delta);
            return { x: 0, y: 0 };
        }

        const target = patrol[enemy.behavior.currentPatrolIndex];

        const distToTarget = Math.hypot(
            target.x - enemy.x,
            target.y - enemy.y
        );

        if (distToTarget < 20) {
            enemy.behavior.currentPatrolIndex =
                (enemy.behavior.currentPatrolIndex + 1) % patrol.length;
            enemy.behavior.patrolPauseTimer = 0.4 + Math.random() * 0.6;

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
        const alertRadius = guardPoint.alertRadius || 250;

        const distToGuard = Math.hypot(
            guardPoint.x - enemy.x,
            guardPoint.y - enemy.y
        );

        if (distToGuard > radius) {
            const dirX = guardPoint.x - enemy.x;
            const dirY = guardPoint.y - enemy.y;
            const dist = Math.hypot(dirX, dirY);

            if (dist > 0.01) {
                const returnBoost = Math.min(1.25, 1 + (distToGuard - radius) / Math.max(radius, 1) * 0.3);
                return {
                    x: (dirX / dist) * this.gameBalance.ENEMY_SPEED * 0.8 * returnBoost,
                    y: (dirY / dist) * this.gameBalance.ENEMY_SPEED * 0.8 * returnBoost
                };
            }
        }

        if (distToPlayer < alertRadius && distToPlayer > 50) {
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

        if (enemy.behavior.wanderChangeInterval === undefined) {
            enemy.behavior.wanderChangeInterval = 2.5 + Math.random() * 1.5;
        }

        if (enemy.behavior.wanderAngle === undefined) {
            enemy.behavior.wanderAngle = Math.random() * Math.PI * 2;
        }

        const distToPlayer = Math.hypot(
            enemy.x - playerX,
            enemy.y - playerY
        );

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

        if (enemy.behavior.pauseTimer > 0) {
            enemy.behavior.pauseTimer = Math.max(0, enemy.behavior.pauseTimer - delta);
            return { x: 0, y: 0 };
        }

        const edgePadding = 40;
        if (enemy.x < edgePadding || enemy.x > this.gameConfig.WORLD_WIDTH - edgePadding ||
            enemy.y < edgePadding || enemy.y > this.gameConfig.WORLD_HEIGHT - edgePadding) {
            const centerX = this.gameConfig.WORLD_WIDTH / 2;
            const centerY = this.gameConfig.WORLD_HEIGHT / 2;
            enemy.behavior.wanderAngle = Math.atan2(centerY - enemy.y, centerX - enemy.x);
        }

        enemy.behavior.wanderTimer += delta;

        if (enemy.behavior.wanderTimer > enemy.behavior.wanderChangeInterval) {
            enemy.behavior.wanderTimer = 0;
            enemy.behavior.wanderAngle += (Math.random() - 0.5) * Math.PI;
            enemy.behavior.pauseTimer = 0.6 + Math.random() * 0.6;
            enemy.behavior.wanderChangeInterval = 2.5 + Math.random() * 1.5;
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
            if (!this.isEnemyAlive(enemy) || enemy.hidden === true) {
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
        if (!enemy || !this.isEnemyAlive(enemy) || damage <= 0) {
            return false;
        }

        enemy.hp -= damage;

        if (enemy.hp <= 0) {
            const idx = this.gameState.enemies.indexOf(enemy);

            if (idx > -1) {
                this.gameState.enemies.splice(idx, 1);
            }

            if (enemy.expReward && typeof this.gameState.exp === 'number') {
                this.gameState.exp += enemy.expReward;
            }

            return true;
        }

        return false;
    }

    checkAttack(playerX, playerY) {
        const attackRange = this.gameBalance.PLAYER_ATTACK_RANGE || 35;
        return this.gameState.enemies.find(enemy => {
            return this.isEnemyAlive(enemy) &&
                enemy.canBeHit !== false &&
                Math.hypot(enemy.x - playerX, enemy.y - playerY) < attackRange;
        }) || null;
    }

    clearEnemies() {
        this.gameState.enemies = [];
    }
}
