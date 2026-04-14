//--------------------------------------
// 🖱️ Обработка ввода (мышь + клавиатура)
//--------------------------------------
window.InputHandler = {

    canvas: null,

    // Коллбэки действий
    onGather: null,
    onAttack: null,
    onMove: null,
    onRestart: null,

    //--------------------------------------
    // 🚀 Инициализация
    //--------------------------------------
    init: function(canvas) {
        this.canvas = canvas;
        this.setupEvents();
        console.log("🖱️ InputHandler initialized");
    },

    //--------------------------------------
    // 🎧 Подключение событий
    //--------------------------------------
    setupEvents: function() {

        //--------------------------------------
        // 🖱️ ЛКМ (клик)
        //--------------------------------------
        this.canvas.addEventListener('click', (e) => {

            const { x, y } = this.getMousePos(e);

            // 📦 Кнопка GATHER
            if (this.isInside(x, y, 20, 545, 90, 35)) {
                this.onGather?.();
                return;
            }

            // ⚔️ Кнопка ATTACK
            if (this.isInside(x, y, 120, 545, 90, 35)) {
                this.onAttack?.();
                return;
            }

            // 🔄 Кнопка RESTART
            if (this.isInside(x, y, 690, 545, 90, 35)) {
                this.onRestart?.();
                return;
            }

            // 📍 Клик по миру (движение)
            this.onMove?.(x, y);
        });

        //--------------------------------------
        // 🖱️ ПКМ (атака)
        //--------------------------------------
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // отключаем меню браузера
            this.onAttack?.();
        });

        //--------------------------------------
        // ⌨️ Клавиатура
        //--------------------------------------
        window.addEventListener('keydown', (e) => {

            switch (e.key.toLowerCase()) {

                case 'e': // сбор
                    e.preventDefault();
                    this.onGather?.();
                    break;

                case 'r': // рестарт
                    e.preventDefault();
                    this.onRestart?.();
                    break;
            }
        });
    },

    //--------------------------------------
    // 🎯 Получение координат мыши (с учётом масштаба)
    //--------------------------------------
    getMousePos: function(e) {

        const rect = this.canvas.getBoundingClientRect();

        return {
            x: (e.clientX - rect.left) * (800 / rect.width),
            y: (e.clientY - rect.top) * (600 / rect.height)
        };
    },

    //--------------------------------------
    // 📦 Проверка попадания в прямоугольник
    //--------------------------------------
    isInside: function(px, py, x, y, w, h) {
        return px > x && px < x + w && py > y && py < y + h;
    },

    //--------------------------------------
    // 🔗 Установка коллбэков
    //--------------------------------------
    setCallbacks: function(callbacks) {
        this.onGather = callbacks.gather;
        this.onAttack = callbacks.attack;
        this.onMove = callbacks.move;
        this.onRestart = callbacks.restart;
    }
};
