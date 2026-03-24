function helloAI() {
    console.log("AI ready");
}
window.helloAI = function() {
    hello();
    bye();
}
function hello() {
    console.log("AI ready");
}
function bye() {
    console.log("AI ВСЕ!");
}
function helloAI() {
    console.log("🤖 AI & Logic ready");
}
window.drawSpider = function(ctx, x, y) {

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
}

window.GameAI = {
    enemies: [],
    
    addEnemy: function(x, y, hp = 100) {
        const enemy = { 
            id: Date.now() + Math.random(),
            x: x, 
            y: y, 
            hp: hp,
            maxHp: hp
        };
        this.enemies.push(enemy);
        console.log(`👾 Enemy spawned at (${x}, ${y}) with ${hp} HP`);
        return enemy;
    },
    
    updateEnemies: function() {
        for(let i = 0; i < this.enemies.length; i++) {
            // Логика движения врагов (будет позже)
            console.log(`👾 Enemy ${i} position: (${this.enemies[i].x}, ${this.enemies[i].y})`);
        }
    },
    
    getEnemies: function() {
        return this.enemies;
    },
    
    damageEnemy: function(enemyId, damage) {
        const enemy = this.enemies.find(e => e.id === enemyId);
        if(enemy) {
            enemy.hp -= damage;
            console.log(`💥 Enemy damaged: ${enemy.hp}/${enemy.maxHp} HP`);
            if(enemy.hp <= 0) {
                this.removeEnemy(enemyId);
                return true; // enemy defeated
            }
        }
        return false;
    },
    
    removeEnemy: function(enemyId) {
        const index = this.enemies.findIndex(e => e.id === enemyId);
        if(index !== -1) {
            this.enemies.splice(index, 1);
            console.log(`☠️ Enemy defeated! Remaining: ${this.enemies.length}`);
        }
    },
    
    clearEnemies: function() {
        this.enemies = [];
        console.log("🧹 All enemies cleared");
    }
};

helloAI();
