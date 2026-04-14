// Обработка ввода
window.InputHandler = {
    canvas: null,
    camera: null,
    
    init: function(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.setupEvents();
        console.log("🖱️ InputHandler initialized");
    },
    
    setupEvents: function() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            // Проверка кнопок UI
            if(x > 20 && x < 110 && y > 545 && y < 580) {
                if(window.CoreGame) CoreGame.gather();
            } else if(x > 120 && x < 210 && y > 545 && y < 580) {
                if(window.CoreGame) CoreGame.attack();
            } else if(x > 690 && x < 780 && y > 545 && y < 580) {
                if(window.CoreGame) CoreGame.restart();
            } else {
                GameState.setPlayerTarget(x, y, this.camera.x, this.camera.y);
            }
        });
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if(window.CoreGame) CoreGame.attack();
            return false;
        });
        
        window.addEventListener('keydown', (e) => {
            if(e.key === 'e' || e.key === 'E') {
                e.preventDefault();
                if(window.CoreGame) CoreGame.gather();
            }
            if(e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                if(window.CoreGame) CoreGame.restart();
            }
        });
    }
};

console.log("⌨️ Input ready");
