// Получаем canvas и контекст
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем задний план (деревья)
    drawTree(ctx, 200, 300);
    drawTree(ctx, 500, 400);
    
    // Рисуем игрока
    drawPlayer(ctx, 400, 300);
    
    requestAnimationFrame(gameLoop);
    // Рисуем врагов
    drawEnemy(ctx, 300, 200, 'spider');
    drawEnemy(ctx, 600, 350, 'hound');
    
    // Рисуем эффекты
    drawPickupEffect(ctx, 450, 250);
    
    // Рисуем интерфейс ПОВЕРХ всего
    drawHungerHealth(ctx, 75, 60);
    
    requestAnimationFrame(gameLoop);
}

// Запускаем игру
gameLoop();