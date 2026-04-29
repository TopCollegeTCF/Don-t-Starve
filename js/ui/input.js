class InputHandler {
    constructor(canvas, camera, coreGame) {
        this.canvas = canvas;
        this.camera = camera;
        this.coreGame = coreGame;
        this.setupEvents();
        console.log("🖱️ InputHandler initialized");    
    }
    
    setupEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.coreGame.attack();
            return false;
        });
        
        window.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // UI кнопки
        if (x > 20 && x < 110 && y > 545 && y < 580) {
            this.coreGame.gather();
        } 
        else if (x > 120 && x < 210 && y > 545 && y < 580) {
            this.coreGame.attack();
        } 
        else if (x > 680 && x < 770 && y > 10 && y < 45) {
            this.coreGame.restart();
            if (this.camera) {
                this.camera.resetToPlayer();
            }
        } 
        else {
            window.gameState.setPlayerTarget(x, y, this.camera.x, this.camera.y);
        }
    }
    
    handleKeydown(e) {
        const key = e.key.toLowerCase();

        if (key === 'e') {
            e.preventDefault();
            this.coreGame.gather();
        }

        if (key === 'r') {
            e.preventDefault();
            this.coreGame.restart();
        }

        if (key === 'c') {
            e.preventDefault();
            this.coreGame.crafting?.toggleMenu();
        }

        if (key === 's') {
            e.preventDefault();
            this.coreGame.saveSystem?.save();
        }

        if (key === 'l') {
            e.preventDefault();
            this.coreGame.saveSystem?.load();
        }

        // Крафт цифрами
        if (this.coreGame.crafting?.menuOpen) {
            if (key === '1' || key === '2') {
                e.preventDefault();
                this.coreGame.crafting.handleKey(key);
            }
        }
    }
}