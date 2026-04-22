// Система сохранения
class SaveSystem {
    constructor(gameState, coreGame) {
        this.gameState = gameState;
        this.coreGame = coreGame;
    }

    showMsg(msg) {
        if (this.coreGame.showNotification) this.coreGame.showNotification(msg);
        else console.log(msg);
    }
    save() {
      const data = {
          wood: this.gameState.player.wood,
          day: this.gameState.day,
          hp: this.gameState.player.hp,
          hunger: this.gameState.player.hunger,
          level: this.gameState.experience?.level || 1
      };
      localStorage.setItem('gameSave', JSON.stringify(data));
      this.showMsg("💾 Game Saved!");
    }
    load() {
      const raw = localStorage.getItem('gameSave');
      if (!raw) { 
          this.showMsg("No save found!"); 
          return false; 
      }
      const data = JSON.parse(raw);
      this.gameState.player.wood = data.wood;
      this.gameState.day = data.day;
      this.gameState.player.hp = data.hp;
      this.gameState.player.hunger = data.hunger;
      if (this.gameState.experience) this.gameState.experience.level = data.level;
        
      this.showMsg("📀 Game Loaded!");
      return true;
    }
}
