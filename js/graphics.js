function helloGraphics() {
    const img = document.getElementById('testImage');
    if (img.complete) {
        console.log("Assets & Graphics ready 🖼️ (изображение загружено)");
    } else {
        console.log("Assets & Graphics ready 🖼️");
    }
}

// Функция для рисования ствола дерева
window.drawTreeTrunk = function(ctx, x, y) {
    // TODO: Коричневый прямоугольник 10x40
    // Подсказка: ствол должен быть центрирован по x, поэтому x-5
    // 👇 Твой код здесь
    ctx.fillStyle = 'brown';
    ctx.fillRect(x - 5, y - 20, 10, 40);
}
// Функция для рисования верхушки кроны
window.drawTreeTop = function(ctx, x, y) {
    // TODO: Зелёный круг радиусом 15 в точке (x, y-30)
    // 👇 Твой код здесь
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(x, y - 30, 15, 0, Math.PI * 2);
    ctx.fill();
}
window.drawTreeSides = function(ctx, x, y) {
    ctx.fillStyle = 'green';
    
    ctx.beginPath();
    ctx.arc(x - 10, y - 20, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 10, y - 20, 12, 0, Math.PI * 2);
    ctx.fill();
}
window.drawTree = function(ctx, x, y) {
    window.drawTreeTrunk(ctx, x, y);
    window.drawTreeTop(ctx, x, y);
    window.drawTreeSides(ctx, x, y);
}
