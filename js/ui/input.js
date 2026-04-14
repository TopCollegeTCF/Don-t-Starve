window.InputHandler = {
    canvas: null,
    
    // Коллбэки для действий
    onGather: null,
    onAttack: null,
    onMove: null,
    onRestart: null,
    
    // Инициализация
    init: function(canvas) {
        this.canvas = canvas;
        this.setupEvents();
        console.log("🖱️ InputHandler initialized");
    },
    
    // Настройка обработчиков событий
    setupEvents: function() {
        // Левый клик мыши
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (800 / rect.width);
            const y = (e.clientY - rect.top) * (600 / rect.height);
            
            // Проверка нажатия на кнопки UI
            if(x > 20 && x < 110 && y > 545 && y < 580) {
                if(this.onGather) this.onGather();
            }
            else if(x > 120 && x < 210 && y > 545 && y < 580) {
                if(this.onAttack) this.onAttack();
            }
            else if(x > 690 && x < 780 && y > 545 && y < 580) {
                if(this.onRestart) this.onRestart();
            }
            else {
                if(this.onMove) this.onMove(x, y);
            }
        });
        
        // Правая кнопка мыши (атака)
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if(this.onAttack) this.onAttack();
            return false;
        });
        
        // Клавиатура
        window.addEventListener('keydown', (e) => {
            if(e.key === 'e' || e.key === 'E') {
                e.preventDefault();
                if(this.onGather) this.onGather();
            }
            if(e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                if(this.onRestart) this.onRestart();
            }
        });
    },
    
    // Установка коллбэков
    setCallbacks: function(callbacks) {
        this.onGather = callbacks.gather;
        this.onAttack = callbacks.attack;
        this.onMove = callbacks.move;
        this.onRestart = callbacks.restart;
    }
};
