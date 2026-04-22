// js/ui/input.js
class InputHandler {
    constructor(canvas, camera, coreGame) {
        this.canvas = canvas;
        this.camera = camera;
        this.coreGame = coreGame;
        this.setupEvents();
        console.log("🖱️ InputHandler initialized");    
    }
    
    setupEvents() {
        // Клик мыши
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // Правый клик (контекстное меню)
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.coreGame.attack();
            return false;
        });
        
        // Клавиши клавиатуры
        window.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        // Проверка нажатия на кнопки UI
        if (x > 20 && x < 110 && y > 545 && y < 580) {
            this.coreGame.gather();
        } else if (x > 120 && x < 210 && y > 545 && y < 580) {
            this.coreGame.attack();
        } else if (x > 690 && x < 780 && y > 545 && y < 580) {
            this.coreGame.restart();
        } else {
            // Движение игрока
            window.gameState.setPlayerTarget(x, y, this.camera.x, this.camera.y);
        }    
    }
    
    handleKeydown(e) {
        if (e.key === 'e' || e.key === 'E') {
            e.preventDefault();
            this.coreGame.gather();
        }
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            this.coreGame.restart();
        }
         // Добавить в метод handleKeydown класса InputHandler:
 // НОВЫЕ КОМАНДЫ
        if (e.key === 'c' || e.key === 'C') {
            e.preventDefault();
            if (this.coreGame.crafting) {
                this.coreGame.crafting.toggleMenu();
            }
        }
    
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            if (this.coreGame.saveSystem) {
                this.coreGame.saveSystem.save();
            }
        }
    
        if (e.key === 'l' || e.key === 'L') {
            e.preventDefault();
            if (this.coreGame.saveSystem) {
                this.coreGame.saveSystem.load();
            }
        }
    
    // Обработка цифр для крафта
        if (this.coreGame.crafting && this.coreGame.crafting.menuOpen) {
            if (e.key === '1' || e.key === '2') {
                e.preventDefault();
                this.coreGame.crafting.handleKey(e.key);
            }
        }
    }
}
