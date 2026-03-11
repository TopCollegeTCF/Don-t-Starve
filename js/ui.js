window.helloAI = function() {
    console.log("AI ready");
}

function hello() {
    console.log("AI ready");
}

// Функция для рисования полоски здоровья
window.drawHealthBar = function(ctx, x, y, healthPercent) {
    const barWidth = 200;
    const barHeight = 20;
    const fillWidth = (healthPercent / 100) * barWidth;
    
    // TODO: Нарисовать красный прямоугольник шириной fillWidth
    // TODO: Нарисовать чёрную обводку вокруг всей полоски
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, fillWidth, barHeight);
    
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, barWidth, barHeight);
}

