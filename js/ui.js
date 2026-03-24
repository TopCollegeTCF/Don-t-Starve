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

drawHungerBar();
