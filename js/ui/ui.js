//--------------------------------------
// Отрисовка панели игры, зодовья, голода, ресурсов, дня; рендер иконок и кнопок, полосок здоровья и голода 
//--------------------------------------
function helloUI() {
    console.log("UI ready");
}

function helloUI() {
    console.log("🎮 UI ready");
}

// Отрисовка панели интерфейса с иконками
window.drawUIPanel = function(ctx, health, hunger, wood, day) {
    // Фон панели
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, 800, 55);
   
GameRenderer.drawUIcon('heart', 10, 8, health);   // вместо ручного рисования сердца
GameRenderer.drawUIcon('meat', 100, 8, hunger);   // вместо ручного рисования мяса
    
    // Здоровье с иконкой сердца
    const heartImg = AssetLoader.getImage('heart');
    if(heartImg && heartImg.complete) {
        ctx.drawImage(heartImg, 15, 12, 28, 28);
    } else {
        ctx.fillStyle = "#ff4444";
        ctx.fillRect(15, 12, 28, 28);
    }
    ctx.fillStyle = "white";
    ctx.font = "bold 18px monospace";
    ctx.fillText(Math.floor(health), 50, 35);
    
    // Голод с иконкой мяса
    const meatImg = AssetLoader.getImage('meat');
    if(meatImg && meatImg.complete) {
        ctx.drawImage(meatImg, 105, 12, 28, 28);
    } else {
        ctx.fillStyle = "#ffaa44";
        ctx.fillRect(105, 12, 28, 28);
    }
    ctx.fillText(Math.floor(hunger), 140, 35);
    
    // Древесина
    ctx.fillStyle = "#ffde9c";
    ctx.fillText("🪵", 210, 35);
    ctx.fillText(wood, 235, 35);
    
    // День
    ctx.fillStyle = "#ffaa66";
    ctx.fillText("🌞 Day " + day, 700, 35);

    ctx.fillText(Math.floor(health), 50, 35);   // <-- Math.floor
    ctx.fillText(Math.floor(hunger), 140, 35);  // <-- Math.floor
    ctx.fillText(wood, 235, 35);                // <-- wood уже целое число
    ctx.fillText("🌞 Day " + day, 700, 35);
    
    // Рисуем полоски здоровья и голода
    window.drawHungerHealth(ctx, hunger, health);
};

// Отрисовка кнопок UI
window.drawUIButtons = function(ctx) {
    const buttonImg = AssetLoader.getImage('button');
    
    // Кнопка GATHER
    if(buttonImg && buttonImg.complete) {
        ctx.drawImage(buttonImg, 20, 545, 90, 35);
        ctx.drawImage(buttonImg, 120, 545, 90, 35);
        ctx.drawImage(buttonImg, 690, 545, 90, 35);
    } else {
        ctx.fillStyle = "#4a3a2a";
        ctx.fillRect(20, 545, 90, 35);
        ctx.fillRect(120, 545, 90, 35);
        ctx.fillRect(690, 545, 90, 35);
    }
    
    ctx.fillStyle = "#ffde9c";
    ctx.font = "bold 14px monospace";
    ctx.fillText("GATHER", 45, 568);
    ctx.fillText("ATTACK", 150, 568);
    ctx.fillText("RESTART", 715, 568);
};

// Функция для рисования полоски здоровья
window.drawHealthBar = function(ctx, x, y, healthPercent) {
    const barWidth = 200;
    const barHeight = 20;
    const fillWidth = (healthPercent / 100) * barWidth;
    
    // TODO: Нарисовать красный прямоугольник шириной fillWidth
    // TODO: Нарисовать чёрную обводку вокруг всей полоски
    // 👇 Твой код здесь
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, fillWidth, barHeight);
    
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, barWidth, barHeight);
}

// Функция для рисования полоски голода
window.drawHungerBar = function(ctx, x, y, hungerPercent) {
    const barWidth = 200;
    const barHeight = 20;
    const fillWidth = (hungerPercent / 100) * barWidth;
    
    // TODO: Нарисовать зелёный прямоугольник шириной fillWidth
    // TODO: Нарисовать чёрную обводку вокруг всей полоски
    // 👇 Твой код здесь
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, fillWidth, barHeight);
    
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, barWidth, barHeight);
}

// Функция для подписей
window.drawBarText = function(ctx, x, y, label, value) {
    // TODO: Написать текст вида "HP: 75" справа от полоски
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`${label}: ${value}`, x + 210, y + 15);
}

// Общая функция для интерфейса
window.drawHungerHealth = function(ctx, hunger, health) {
    const startX = 10;
    const startY = 10;
    const barHeight = 20;
    
    // Рисуем здоровье
    window.drawHealthBar(ctx, startX, startY, health);
    window.drawBarText(ctx, startX, startY, 'HP', health);
    
    // Рисуем голод
    window.drawHungerBar(ctx, startX, startY + barHeight + 5, hunger);
    window.drawBarText(ctx, startX, startY + barHeight + 5, 'Hunger', hunger);
}
// Добавить после отрисовки игрока
if(GameState.player.targetX !== null) {
    const targetScaleX = GameState.player.targetX * scaleX;
    const targetScaleY = GameState.player.targetY * scaleY;
    mCtx.beginPath();
    mCtx.arc(targetScaleX, targetScaleY, 3, 0, Math.PI * 2);
    mCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
    mCtx.fill();
    mCtx.beginPath();
    mCtx.moveTo(targetScaleX - 5, targetScaleY);
    mCtx.lineTo(targetScaleX + 5, targetScaleY);
    mCtx.moveTo(targetScaleX, targetScaleY - 5);
    mCtx.lineTo(targetScaleX, targetScaleY + 5);
    mCtx.strokeStyle = "white";
    mCtx.lineWidth = 1;
    mCtx.stroke();
}
