// js/main.js
window.addEventListener('DOMContentLoaded', () => {
    console.log("🎮 Starting Don't Starve Clone...");
    
    // 1. Создаем камеру
    const camera = new GameCamera();
    
    // 2. Инициализируем состояние игры
    window.gameState.init();
    camera.reset(window.gameState.player.x, window.gameState.player.y);
    
    // 3. Создаем AI
    const gameAI = new GameAI(window.gameState, window.gameBalance, window.gameConfig);
    
    // 4. Загружаем звуки
    window.soundManager.loadAll(window.gameConfig.sounds, () => {
        console.log("✅ All sounds loaded!");
    });
    
    // 5. Загружаем изображения
    window.assetLoader.loadAll(window.gameConfig.images, () => {
        console.log("✅ All images loaded!");
    });
    
    // 6. Создаем рендерер
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const renderer = new GameRenderer(ctx, camera);
    
    // 7. Создаем основной игровой цикл
    const coreGame = new CoreGame(
        window.gameState, 
        window.gameBalance, 
        gameAI, 
        window.effectsManager, 
        window.soundManager, 
        camera
    );
    
    // 8. Создаем обработчик ввода
    const inputHandler = new InputHandler(canvas, camera, coreGame);
    
    // 9. Запускаем игру
    coreGame.start();
    
    // 10. Анимационный цикл
    let lastTimestamp = 0;
    
    function animate(timestamp) {
        if (lastTimestamp === 0) {
            lastTimestamp = timestamp;
            requestAnimationFrame(animate);
            return;
        }
        
        // Вычисляем время между кадрами (максимум 33 мс)
        let delta = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
        
        if (delta > 0.01) {
            coreGame.update(delta);
        }
        
        lastTimestamp = timestamp;
        
        // Отрисовка
        coreGame.render(renderer);
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
    
    console.log("✅ Game initialized successfully!");
});
