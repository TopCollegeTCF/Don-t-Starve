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
    
    worldToScreen: function(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }
};
