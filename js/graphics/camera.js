// Камера
window.GameCamera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    width: 800,
    height: 600,
    
    init: function() {
        this.reset();
    },
    reset: function() {
        if(GameState && GameState.player) {
            this.x = GameState.player.x - this.width / 2;
            this.y = GameState.player.y - this.height / 2;
            this.targetX = this.x;
            this.targetY = this.y;
        }
    },
    
    update: function(playerX, playerY, delta) {
        this.targetX = playerX - this.width / 2;
        this.targetY = playerY - this.height / 2;
        
        this.targetX = Math.max(0, Math.min(GameConfig.WORLD_WIDTH - this.width, this.targetX));
        this.targetY = Math.max(0, Math.min(GameConfig.WORLD_HEIGHT - this.height, this.targetY));
        
        this.x += (this.targetX - this.x) * GameConfig.CAMERA_SMOOTH;
        this.y += (this.targetY - this.y) * GameConfig.CAMERA_SMOOTH;
    },
    worldToScreen: function(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }
};
