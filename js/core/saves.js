// Система сохранения
class SaveSystem {
    constructor(gameState, coreGame) {
        this.gameState = gameState;
        this.coreGame = coreGame;
    };

    showMsg(msg) {
        if (this.coreGame.showNotification) this.coreGame.showNotification(msg);
        else console.log(msg);
    };

    save() {
        const data = {
            wood: this.gameState.player.wood,
            stone: this.gameState.player.stone,             
            day: this.gameState.day,
            dayTimer: this.gameState.dayTimer,              
            hp: this.gameState.player.hp,
            hunger: this.gameState.player.hunger,
            level: this.gameState.experience?.level || 1,
            x: this.gameState.player.x,                      
            y: this.gameState.player.y                      
        };

        localStorage.setItem('gameSave', JSON.stringify(data));
        this.showMsg("💾 Game Saved!");
    };

    load() {
        const raw = localStorage.getItem('gameSave');
        if (!raw) { 
            this.showMsg("No save found!"); 
            return false; 
        }

        const data = JSON.parse(raw);

        this.gameState.player.wood = data.wood;
        this.gameState.player.stone = data.stone ?? 0;     
        this.gameState.day = data.day;
        this.gameState.dayTimer = data.dayTimer ?? 0;      
        this.gameState.player.hp = data.hp;
        this.gameState.player.hunger = data.hunger;

        if (this.gameState.experience) {
            this.gameState.experience.level = data.level;
        }

        //  восстановление позиции игрока
        if (data.x !== undefined && data.y !== undefined) {
            this.gameState.player.x = data.x;
            this.gameState.player.y = data.y;
        }

        //  обновление камеры (если есть)
        if (this.coreGame.camera && this.coreGame.camera.follow) {
            this.coreGame.camera.follow(this.gameState.player);
        }

        //  сброс целевой точки (если используется)
        if (this.gameState.player.target) {
            this.gameState.player.target = null;
        }

        this.showMsg("📀 Game Loaded!");
        return true;

      const data = {
          wood: this.gameState.player.wood,
          stone: this.gameState.player.stone,
          day: this.gameState.day,
          hp: this.gameState.player.hp,
          hunger: this.gameState.player.hunger,
          level: this.gameState.experience?.level || 1
      };
      localStorage.setItem('gameSave', JSON.stringify(data));
      this.showMsg("💾 Game Saved!");
    }

}
