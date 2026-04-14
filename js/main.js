// Главный файл инициализации игры
window.addEventListener('DOMContentLoaded', () => {
    console.log("🎮 Starting Don't Starve Clone...");
    
    // Инициализация камеры
    window.GameCamera = window.GameCamera || {};
    if(typeof GameCamera.init === 'function') {
        GameCamera.init();
    }
    
    // Инициализация рендерера с камерой
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    GameRenderer.init(ctx, GameCamera);
    
    // Инициализация обработчика ввода с камерой
    InputHandler.init(canvas, GameCamera);
    
    // Инициализация игрового состояния
    GameState.init();
    
    // Настройка звуков (заглушка)
    SoundManager.playMusic = function(music, volume) {
        console.log(`🎵 Playing: ${music}`);
    };
    SoundManager.stopMusic = function(music) {
        console.log(`🔇 Stopping: ${music}`);
    };
    SoundManager.play = function(sound) {
        console.log(`🔊 Sound: ${sound}`);
    };
    
    // Запуск игрового цикла
    CoreGame.start();
    
    // Анимационный цикл
    function animate(timestamp) {
        CoreGame.gameLoop(timestamp);
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
    
    console.log("✅ Game initialized successfully!");
});

// Добавляем недостающие функции
window.drawPlayerBody = window.drawPlayerBody || function(ctx, x, y) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
};

window.drawPlayerEyes = window.drawPlayerEyes || function(ctx, x, y) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 3, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
};
