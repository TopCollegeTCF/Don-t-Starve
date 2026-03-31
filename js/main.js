window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // СНАЧАЛА инициализируем рендерер - он нарисует временный фон
    GameRenderer.init(ctx);
    
    // Инициализация обработчика ввода
    InputHandler.init(canvas);
    
    // Список изображений для загрузки
    const imagesToLoad = window.GameAssets.images;
    // Список звуков для загрузки
    const soundsToLoad = window.GameAssets.sounds;
    
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
    
    // Немедленно инициализируем GameState для тестовых объектов
    GameState.init();
    
    // Создаем тестовые объекты, чтобы сразу было что рисовать
    if(GameState.trees.length === 0) {
        for(let i = 0; i < 5; i++) {
            GameState.trees.push({
                x: 100 + Math.random() * 600,
                y: 100 + Math.random() * 350,
                wood: 15
            });
        }
    }
    
    if(GameState.berries.length === 0) {
        for(let i = 0; i < 4; i++) {
            GameState.berries.push({
                x: 120 + Math.random() * 600,
                y: 120 + Math.random() * 350,
                count: 8
            });
        }
    }
    
    // Рисуем тестовую сцену, пока грузятся ресурсы
    function drawTestScene() {
        if(!GameRenderer.ctx) return;
        
        // Очищаем и рисуем фон
        GameRenderer.drawGround();
        
        // Рисуем деревья
        for(let tree of GameState.trees) {
            GameRenderer.drawTree(tree.x, tree.y);
        }
        
        // Рисуем ягоды
        for(let berry of GameState.berries) {
            GameRenderer.drawBerry(berry.x, berry.y, berry.count);
        }
        
        // Рисуем игрока
        GameRenderer.drawPlayer(GameState.player.x, GameState.player.y, GameState.player.hp);
        
        // Рисуем UI
        drawUIPanel(GameRenderer.ctx, GameState.player.hp, GameState.player.hunger, GameState.player.wood, GameState.day);
        drawUIButtons(GameRenderer.ctx);
        
        requestAnimationFrame(drawTestScene);
    }
    
    // Запускаем тестовую отрисовку сразу
    drawTestScene();
    
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
    
    // Игровой цикл (будет запущен после загрузки ресурсов)
    function startGameLoop() {
        function frame(time) {
            CoreGame.gameLoop(time);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
    
    console.log("🚀 Game initialized - waiting for assets...");
};

