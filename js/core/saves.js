class SaveSystem {
    constructor(gameState, coreGame) {
        this.gameState = gameState;
        this.coreGame = coreGame;
    }

    showMsg(msg) {
        if (this.coreGame.showNotification) {
            this.coreGame.showNotification(msg);
        } else {
            console.log(msg);
        }
    }

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
    }

    load() {
        const raw = localStorage.getItem('gameSave');

        if (!raw) {
            this.showMsg("No save found!");
            return false;
        }

        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            this.showMsg("Save corrupted!");
            return false;
        }

        // восстановление данных
        this.gameState.player.wood = data.wood ?? 0;
        this.gameState.player.stone = data.stone ?? 0;
        this.gameState.day = data.day ?? 1;
        this.gameState.dayTimer = data.dayTimer ?? 0;
        this.gameState.player.hp = data.hp ?? 100;
        this.gameState.player.hunger = data.hunger ?? 100;

        if (this.gameState.experience) {
            this.gameState.experience.level = data.level ?? 1;
        }

        // позиция
        if (data.x !== undefined && data.y !== undefined) {
            this.gameState.player.x = data.x;
            this.gameState.player.y = data.y;
        }

        // камера
        if (this.coreGame.camera?.follow) {
            this.coreGame.camera.follow(this.gameState.player);
        }

        // сброс цели
        if (this.gameState.player.target) {
            this.gameState.player.target = null;
        }

        this.showMsg("📀 Game Loaded!");
        return true;
    }
}