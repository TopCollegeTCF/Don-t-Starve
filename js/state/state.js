function helloState() {
    console.log("📊 Game State ready");
}

// Начальное состояние игры
window.GameState = {
    isRunning: false,
    score: 0,
    level: 1,
    
    init: function() {
        this.isRunning = true;
        console.log("🎯 State initialized");
        return this;
    },
    
    getState: function() {
        return {
            running: this.isRunning,
            score: this.score,
            level: this.level
        };
    },
    
    updateScore: function(points) {
        this.score += points;
        console.log(`📈 Score updated: ${this.score}`);
    }
};

helloState();
