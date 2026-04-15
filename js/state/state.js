class GameState {
    constructor() {
        this.gameActive = true;
            this.player = {
                x: 1200, y: 900, hp: 100, hunger: 100, wood: 0,
                targetX: null, targetY: null
            };
            this.world = { trees: [], berries: [] };
            this.enemies = [];
            this.day = 1;
            this.dayTimer = 0;
            this.spawnTimer = 0;
        }
        
        init() {
            this.generateWorld();
            this.reset();
    }
    
    clampCoord(value, margin = 50) {
        return Math.max(margin, Math.min(window.gameConfig.WORLD_WIDTH - margin, value)); 
    }
    
    generateWorld() {
        this.world.trees = [];
        this.world.berries = [];
        
        // Генерация деревьев кластерами
        for (let c = 0; c < 12; c++) {
            const centerX = 200 + Math.random() * (window.gameConfig.WORLD_WIDTH - 400);
            const centerY = 150 + Math.random() * (window.gameConfig.WORLD_HEIGHT - 300);
            const clusterSize = 4 + Math.floor(Math.random() * 6);
            
            for (let i = 0; i < clusterSize; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 40 + Math.random() * 70;
                this.world.trees.push({
                    x: this.clampCoord(centerX + Math.cos(angle) * radius),
                    y: this.clampCoord(centerY + Math.sin(angle) * radius),
                    wood: 12 + Math.floor(Math.random() * 10)
                });
            }
        }
        
        // Генерация ягод
        for (let c = 0; c < 8; c++) {
            const centerX = 150 + Math.random() * (window.gameConfig.WORLD_WIDTH - 300);
            const centerY = 100 + Math.random() * (window.gameConfig.WORLD_HEIGHT - 200);
            const clusterSize = 3 + Math.floor(Math.random() * 4);
            
            for (let i = 0; i < clusterSize; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 30 + Math.random() * 50;
                this.world.berries.push({
                    x: this.clampCoord(centerX + Math.cos(angle) * radius, 40),
                    y: this.clampCoord(centerY + Math.sin(angle) * radius, 40),
                    count: 6 + Math.floor(Math.random() * 8)
                });
            }
        }
        
        console.log(`🌍 World generated: ${this.world.trees.length} trees, ${this.world.berries.length} berries`);
    }
    
    reset() {
        this.gameActive = true;
        this.player = {
            x: window.gameConfig.WORLD_WIDTH / 2,
            y: window.gameConfig.WORLD_HEIGHT / 2,
            hp: 100,
            hunger: 100,
            wood: 0,
            targetX: null,
            targetY: null
        };
        this.day = 1;
        this.dayTimer = 0;
        this.spawnTimer = 0;
        this.generateWorld();
        this.enemies = [];
        
        for (let i = 0; i < 6; i++) {
            this.spawnEnemy();
        } 
    }
    
    setPlayerTarget(screenX, screenY, cameraX, cameraY) {
        if (!this.gameActive) return;
        this.player.targetX = this.clampCoord(screenX + cameraX, 20);
        this.player.targetY = this.clampCoord(screenY + cameraY, 20);  
    }
    
    movePlayer(delta, speed) {
        if (!this.gameActive || this.player.targetX === null) return;
        
        let dx = this.player.targetX - this.player.x;
        let dy = this.player.targetY - this.player.y;
        let dist = Math.hypot(dx, dy);
        
        if (dist < 5) {
            this.player.targetX = null;
            return;
        }
        
        let move = speed * delta;
        this.player.x += (dx / dist) * move;
        this.player.y += (dy / dist) * move;
        this.player.x = this.clampCoord(this.player.x, 20);
        this.player.y = this.clampCoord(this.player.y, 20);
    }
    
    spawnEnemy() {
        const types = ['patrol', 'guard', 'wander'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let x, y;
        do {
            x = 100 + Math.random() * (window.gameConfig.WORLD_WIDTH - 200);
            y = 100 + Math.random() * (window.gameConfig.WORLD_HEIGHT - 200);
        } while (Math.hypot(x - this.player.x, y - this.player.y) < 300);
        
        const enemy = {
            id: Date.now() + Math.random(),
            x: x,
            y: y,
            hp: window.gameBalance.ENEMY_BASE_HP + Math.floor(Math.random() * 20),
            maxHp: window.gameBalance.ENEMY_BASE_HP + Math.floor(Math.random() * 20),
            type: type,
            behavior: this.createBehavior(type, x, y)
        };
        
        this.enemies.push(enemy);
        return enemy;
    }
    
    createBehavior(type, x, y) {
        switch(type) {
        case 'patrol':
            return {
                patrolPoints: [
                    { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 },
                    { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 },
                    { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 }
                ],
                currentPatrolIndex: 0
            };
        case 'guard':
            return { guardPoint: { x: x, y: y, radius: 80 } };
        case 'wander':
            return { wanderAngle: Math.random() * Math.PI * 2, wanderTimer: 0 };
        default:
            return {};
        }   
    }
    
    addWood(amount) {
        this.player.wood += amount; 
    }
    
    addHunger(amount) {
        this.player.hunger = Math.min(100, this.player.hunger + amount);
    }
    
    damagePlayer(amount) {
        this.player.hp -= amount;
        if (this.player.hp <= 0) {
            this.gameActive = false;
        }
    }
    
    healPlayer(amount) {
        this.player.hp = Math.min(100, this.player.hp + amount);
    }
    
    nextDay() {
        this.day++;
        this.healPlayer(5);
        this.addHunger(8);
        console.log(`🌞 Day ${this.day}`);
    }
    
    getTreesInRange(x, y, radius) {
        return this.world.trees.filter(tree => 
            Math.hypot(tree.x - x, tree.y - y) < radius && tree.wood > 0
    );
    }
    
    getBerriesInRange(x, y, radius) {
        return this.world.berries.filter(berry => 
            Math.hypot(berry.x - x, berry.y - y) < radius && berry.count > 0
    );
    }
    
    removeTree(tree) {
        const index = this.world.trees.indexOf(tree);
        if (index > -1) this.world.trees.splice(index, 1);
    }
    
    removeBerry(berry) {
        const index = this.world.berries.indexOf(berry);
        if (index > -1) this.world.berries.splice(index, 1);
    }

    createEnemyBehavior: function(type, x, y) {
        switch(type) {
            case 'patrol':
                return {
                    patrolPoints: [
                        { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 },
                        { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 },
                        { x: x - 100 + Math.random() * 200, y: y - 100 + Math.random() * 200 }
                    ],
                    currentPatrolIndex: 0
                };
            case 'guard':
                return {
                    guardPoint: { x: x, y: y, radius: 80 }
                };
            case 'wander':
                return {
                    wanderAngle: Math.random() * Math.PI * 2,
                    wanderTimer: 0
                };
            default:
                return {};
        }
    },
};

console.log("📊 Game State ready");
