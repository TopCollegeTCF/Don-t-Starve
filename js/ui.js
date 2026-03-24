function helloUI() {
    console.log("UI ready");
}

helloUI();
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

drawHealthBar();
drawHungerBar();
drawBarText();
drawHungerHealth();
