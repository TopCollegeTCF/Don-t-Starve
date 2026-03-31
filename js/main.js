// Получаем canvas и контекст
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


window.AssetLoader.registerImage('player', 'assets/images/player.png');
window.AssetLoader.registerImage('tree', 'assets/images/tree.png');
window.AssetLoader.onComplete = () => console.log('Ready to render!');

window.GameState.init();
console.log("Game state:", window.GameState.getState());
window.GameState.updateScore(10);

const enemy1 = window.GameAI.addEnemy(100, 100, 50);
const enemy2 = window.GameAI.addEnemy(300, 200, 75);
window.GameAI.updateEnemies();
console.log("Enemies count:", window.GameAI.getEnemies().length);

// Игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем задний план (деревья)
    drawTree(ctx, 200, 300);
    drawTree(ctx, 500, 400);
    
    // Рисуем игрока
    drawPlayer(ctx, 400, 300);
    // Рисуем врагов
    // drawEnemy(ctx, 300, 200, 'spider');
    // drawEnemy(ctx, 600, 350, 'hound');
    drawSpider(ctx, 300, 200)

    // Рисуем эффекты
    drawPickupEffect(ctx, 450, 250);
    
    // Рисуем интерфейс ПОВЕРХ всего
    drawHungerHealth(ctx, 75, 60);
    
    requestAnimationFrame(gameLoop);
}
// Запускаем игру
gameLoop();

window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Инициализация рендерера
    GameRenderer.init(ctx);
    
    // Инициализация обработчика ввода
    InputHandler.init(canvas);
    
    // Список изображений для загрузки
    const imagesToLoad = {
        player: 'assets/images/player.png',
        enemy: 'assets/images/enemy.png',
        tree: 'assets/images/tree.png',
        berry: 'assets/images/berry.png',
        ground: 'assets/images/ground.png',
        heart: 'assets/images/heart.png',
        meat: 'assets/images/meat.png',
        button: 'assets/images/button.png'
    };
    
    // Список звуков для загрузки
    const soundsToLoad = {
        click: 'assets/audio/sounds/click.mp3',
        gather: 'assets/audio/sounds/gather.mp3',
        hit: 'assets/audio/sounds/hit.mp3',
        ambient: 'assets/audio/music/ambient.mp3',
        gameover: 'assets/audio/sounds/gameover.mp3'
    };
    
    // Загрузка всех ресурсов
    let imagesLoaded = false;
    let soundsLoaded = false;
    
    function checkAllLoaded() {
        if(imagesLoaded && soundsLoaded) {
            console.log("🎮 All resources loaded! Starting game...");
            GameState.init();
            CoreGame.start();
            SoundManager.playMusic('ambient', 0.3);
            startGameLoop();
        }
    }
    
    AssetLoader.loadAll(imagesToLoad, () => {
        console.log("✅ All images loaded");
        imagesLoaded = true;
        checkAllLoaded();
    });
    
    SoundManager.loadAll(soundsToLoad, () => {
        console.log("✅ All sounds loaded");
        soundsLoaded = true;
        checkAllLoaded();
    });
    
    // Настройка коллбэков для ввода
    InputHandler.setCallbacks({
        gather: () => CoreGame.gather(),
        attack: () => CoreGame.attack(),
        move: (x, y) => GameState.setPlayerTarget(x, y),
        restart: () => CoreGame.restart()
    });
    
    // Запуск игрового цикла
    function startGameLoop() {
        function frame(time) {
            CoreGame.gameLoop(time);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    
    console.log("🚀 Game initialized - waiting for assets...");
};
