class CraftingSystem {
    constructor(gameState, coreGame) {
        this.gameState = gameState;
        this.coreGame = coreGame;
        this.menuOpen = false;
    }
    craft(item) {
        if (!this.gameState.gameActive) return false;
        
        if (item === 'spear' && this.gameState.player.wood >= 25) {
            this.gameState.player.wood -= 25;
            this.coreGame.attackDamage = 28;
            this.showMsg("⚔️ Spear crafted! +8 damage");
            return true;
        }
        if (item === 'heal' && this.gameState.player.wood >= 20) {
            this.gameState.player.wood -= 20;
            this.gameState.healPlayer(20);
            this.showMsg("💚 +20 HP");
            return true;
        }
        return false;
    }
    showMsg(msg) {
        if (this.coreGame.showNotification) this.coreGame.showNotification(msg);
        else console.log(msg);
    }
    
    toggleMenu() { 
        this.menuOpen = !this.menuOpen;
        this.showMsg(this.menuOpen ? "Crafting: 1-Spear(25), 2-Heal(20)" : "Crafting closed");
    }
      draw(ctx) {
        if (!this.menuOpen) return;
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fillRect(250, 150, 300, 200);
        ctx.fillStyle = "#ffde9c";
        ctx.font = "bold 20px monospace";
        ctx.fillText("CRAFTING", 340, 190);
        ctx.font = "14px monospace";
        ctx.fillStyle = this.gameState.player.wood >= 25 ? "#4caf50" : "#888";
        ctx.fillText("1. ⚔️ Spear (25 wood)", 270, 240);
        ctx.fillStyle = this.gameState.player.wood >= 20 ? "#4caf50" : "#888";
        ctx.fillText("2. 💚 Healing (20 wood)", 270, 280);
        ctx.fillStyle = "#888";
        ctx.font = "10px monospace";
        ctx.fillText("Press C to close", 340, 330);
    }
    
    handleKey(key) {
        if (key === '1') this.craft('spear');
        if (key === '2') this.craft('heal');
    }
}
