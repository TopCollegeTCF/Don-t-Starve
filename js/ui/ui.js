//--------------------------------------
// UI система (панель, кнопки, полоски)
//--------------------------------------

// Тест загрузки UI
function helloUI() {
    console.log("🎮 UI ready");
}

//--------------------------------------
// ГЛАВНАЯ ПАНЕЛЬ
//--------------------------------------
window.drawUIPanel = function(ctx, health, hunger, wood, day) {

    // Фон панели
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, 800, 55);

    ctx.fillStyle = "white";
    ctx.font = "bold 18px monospace";

    // ❤️ Здоровье (иконка + текст)
    GameRenderer.drawUIcon('heart', 10, 8, health);
    ctx.fillText(Math.floor(health), 50, 35);

    // 🍖 Голод
    GameRenderer.drawUIcon('meat', 100, 8, hunger);
    ctx.fillText(Math.floor(hunger), 140, 35);

    // 🪵 Ресурс
    ctx.fillStyle = "#ffde9c";
    ctx.fillText("🪵", 210, 35);
    ctx.fillText(wood, 235, 35);

    // 🌞 День
    ctx.fillStyle = "#ffaa66";
    ctx.fillText("Day " + day, 700, 35);

    //--------------------------------------
    // 🌙 День / ночь
    //--------------------------------------
    const dayProgress = GameState.dayTimer / GameBalance.DAY_DURATION;
    const isNight = dayProgress > 0.6;

    // Иконка времени
    ctx.font = "20px monospace";
    ctx.fillStyle = isNight ? "#aaaaff" : "#ffaa44";
    ctx.fillText(isNight ? "🌙" : "☀️", 650, 35);

    // Полоска времени
    ctx.fillStyle = isNight ? "#4466aa" : "#ffcc66";
    ctx.fillRect(670, 25, 30, 6);

    const progress = isNight
        ? (dayProgress - 0.6) / 0.4
        : dayProgress / 0.6;

    ctx.fillStyle = isNight ? "#88aaff" : "#ffee88";
    ctx.fillRect(670, 25, 30 * progress, 6);

    //--------------------------------------
    // 👾 Враги
    //--------------------------------------
    ctx.fillStyle = "#ff6666";
    ctx.font = "12px monospace";
    ctx.fillText(`👾 ${GameState.enemies.length}`, 740, 50);

    //--------------------------------------
    // 📊 Полоски (чуть ниже панели)
    //--------------------------------------
    window.drawHungerHealth(ctx, hunger, health);
};

//--------------------------------------
// КНОПКИ
//--------------------------------------
window.drawUIButtons = function(ctx) {

    const buttonImg = AssetLoader.getImage('button');

    // Фон кнопок
    if (buttonImg && buttonImg.complete) {
        ctx.drawImage(buttonImg, 20, 545, 90, 35);
        ctx.drawImage(buttonImg, 120, 545, 90, 35);
        ctx.drawImage(buttonImg, 690, 545, 90, 35);
    } else {
        ctx.fillStyle = "#4a3a2a";
        ctx.fillRect(20, 545, 90, 35);
        ctx.fillRect(120, 545, 90, 35);
        ctx.fillRect(690, 545, 90, 35);
    }

    // Текст
    ctx.fillStyle = "#ffde9c";
    ctx.font = "bold 14px monospace";
    ctx.fillText("GATHER", 40, 568);
    ctx.fillText("ATTACK", 145, 568);
    ctx.fillText("RESTART", 705, 568);
};

//--------------------------------------
// ❤️ Полоска HP
//--------------------------------------
window.drawHealthBar = function(ctx, x, y, percent) {

    const w = 200;
    const h = 20;
    const fill = (percent / 100) * w;

    ctx.fillStyle = "red";          // заливка
    ctx.fillRect(x, y, fill, h);

    ctx.strokeStyle = "black";      // рамка
    ctx.strokeRect(x, y, w, h);
};

//--------------------------------------
// 🍖 Полоска голода
//--------------------------------------
window.drawHungerBar = function(ctx, x, y, percent) {

    const w = 200;
    const h = 20;
    const fill = (percent / 100) * w;

    ctx.fillStyle = "green";
    ctx.fillRect(x, y, fill, h);

    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, w, h);
};

//--------------------------------------
// 📝 Текст у полоски
//--------------------------------------
window.drawBarText = function(ctx, x, y, label, value) {

    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`${label}: ${Math.floor(value)}`, x + 210, y + 15);
};

//--------------------------------------
// 📊 Общий блок HP + Hunger
//--------------------------------------
window.drawHungerHealth = function(ctx, hunger, health) {

    const x = 10;
    const y = 65; // ниже панели
    const gap = 25;

    // HP
    window.drawHealthBar(ctx, x, y, health);
    window.drawBarText(ctx, x, y, "HP", health);

    // Hunger
    window.drawHungerBar(ctx, x, y + gap, hunger);
    window.drawBarText(ctx, x, y + gap, "Hunger", hunger);
};

//--------------------------------------
// ⚠️ Эффект низкого HP
//--------------------------------------
window.drawLowHealthOverlay = function(ctx, health) {

    if (health > 30) return;

    const intensity = 0.3 * (1 - health / 30);
    const blink = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;

    ctx.fillStyle = `rgba(255,0,0,${intensity * blink})`;
    ctx.fillRect(0, 0, 800, 600);
};
