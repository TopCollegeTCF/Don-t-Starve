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
// Старый код (удалить):
// if (x > 690 && x < 780 && y > 545 && y < 580) {
//     this.coreGame.restart();
// }

// Новый код:
if (x > 680 && x < 770 && y > 10 && y < 45) {
    this.coreGame.restart();
    // Сброс камеры к игроку
    if (this.camera) {
        this.camera.resetToPlayer();
    }
}
gather() {
    const gameBalance = this.configManager.getGameBalance();
    
    // Существующий код для сбора дерева
    const treesInRange = this.world.getTreesInRange(
        this.player.x, 
        this.player.y, 
        gameBalance.GATHER_RADIUS
    );
    
    if (treesInRange.length > 0) {
        const woodAmount = treesInRange[0].gatherWood(gameBalance.GATHER_WOOD_AMOUNT);
        if (woodAmount > 0) {
            this.inventory.addWood(woodAmount);
        }
    }
    
    // НОВЫЙ КОД: Сбор камня
    const stonesInRange = this.world.getStonesInRange(
        this.player.x, 
        this.player.y, 
        gameBalance.GATHER_RADIUS
    );
    
    if (stonesInRange.length > 0) {
        const stoneAmount = stonesInRange[0].gatherStone(gameBalance.GATHER_STONE_AMOUNT);
        if (stoneAmount > 0) {
            this.inventory.addStone(stoneAmount);
        }
    }
}
class Stone {
    // ... существующий код ...
    
    gatherStone(amount) {
        const gathered = Math.min(amount, this.stone);
        this.stone -= gathered;
        return gathered;
    }
    
    isEmpty() {
        return this.stone <= 0;
    }
}
