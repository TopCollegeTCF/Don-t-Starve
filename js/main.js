// Получаем canvas и контекст
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

window.GameState.init();
console.log("Game state:", window.GameState.getState());
window.GameState.updateScore(10);

const enemy1 = window.GameAI.addEnemy(100, 100, 50);
const enemy2 = window.GameAI.addEnemy(300, 200, 75);
window.GameAI.updateEnemies();
console.log("Enemies count:", window.GameAI.getEnemies().length);

// Игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем задний план (деревья)
    drawTree(ctx, 200, 300);
    drawTree(ctx, 500, 400);
    
    // Рисуем игрока
    drawPlayer(ctx, 400, 300);
    // Рисуем врагов
    // drawEnemy(ctx, 300, 200, 'spider');
    // drawEnemy(ctx, 600, 350, 'hound');
    drawSpider(ctx, 300, 200)

    // Рисуем эффекты
    drawPickupEffect(ctx, 450, 250);
    
    // Рисуем интерфейс ПОВЕРХ всего
    drawHungerHealth(ctx, 75, 60);
    
    requestAnimationFrame(gameLoop);
}
// Запускаем игру
gameLoop();