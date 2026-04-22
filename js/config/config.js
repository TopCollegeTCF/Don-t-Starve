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
            click: 'assets/sounds/click.wav',
            gather: 'assets/sounds/gather.wav',
            hit: 'assets/sounds/hit.wav',
            ambient: 'assets/sounds/ambient.wav',
            gameover: 'assets/sounds/gameover.wav',
            ambient_day: 'assets/sounds/ambient_day.wav',
            ambient_night: 'assets/sounds/ambient_night.wav'
        };
    }
}

window.gameConfig = new GameConfig();
console.log("⚙️ Config loaded");
