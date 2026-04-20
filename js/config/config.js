//--------------------------------------
// Конфигурация игры
//--------------------------------------
class GameConfig {
    constructor() {
        this.WORLD_WIDTH = 2400;
        this.WORLD_HEIGHT = 1800;
        this.CAMERA_SMOOTH = 0.1;
        
        this.images = {
            player: 'assets/images/player.png',
            enemy: 'assets/images/enemy.png',
            tree: 'assets/images/tree.png',
            berry: 'assets/images/berry.png',
            ground: 'assets/images/ground.png',
            heart: 'assets/images/heart.png',
            meat: 'assets/images/meat.png',
            button: 'assets/images/button.png'
        };
        
        this.sounds = {
            click: 'assets/audio/sounds/click.mp3',
            gather: 'assets/audio/sounds/gather.mp3',
            hit: 'assets/audio/sounds/hit.mp3',
            ambient: 'assets/audio/sounds/ambient.mp3',
            gameover: 'assets/audio/sounds/gameover.mp3'
        };
    }
}

window.gameConfig = new GameConfig();
console.log("⚙️ Config loaded");
