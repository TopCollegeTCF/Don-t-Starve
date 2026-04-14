// Добавить в конец файла config.js
window.GameConfig = {
    WORLD_WIDTH: 2400,
    WORLD_HEIGHT: 1800,
    CAMERA_SMOOTH: 0.1,
    images: {
        player: 'assets/images/player.png',
        enemy: 'assets/images/enemy.png',
        tree: 'assets/images/tree.png',
        berry: 'assets/images/berry.png',
        ground: 'assets/images/ground.png',
        heart: 'assets/images/berry.png', // временно используем ягоду для сердца
        meat: 'assets/images/berry.png',  // временно используем ягоду для мяса
        button: 'assets/images/button.png'
    },
    sounds: {
        click: 'assets/sounds/click.mp3',
        gather: 'assets/sounds/gather.mp3',
        hit: 'assets/sounds/hit.mp3',
        ambient: 'assets/sounds/ambient.mp3',
        gameover: 'assets/sounds/gameover.mp3'
    }
};

// Загружаем изображения из GameConfig
window.addEventListener('DOMContentLoaded', () => {
    // Загрузка изображений из конфига
    if(window.GameConfig && window.GameConfig.images && window.AssetLoader) {
        console.log("🖼️ Loading images from config:", Object.keys(GameConfig.images));
        AssetLoader.loadAll(GameConfig.images, () => {
            console.log("✅ All images loaded successfully!");
        });
    }
});
