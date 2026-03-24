let nameGroup = "Core Mechanics"
// Функция для рисования тела игрока (жёлтый круг)
window.drawPlayerBody = function(ctx, x, y) {
    // TODO: Жёлтый круг радиусом 15 в точке (x, y)
    // Используй: fillStyle = 'yellow', beginPath, arc, fill
    // 👇 Твой код здесь
  console.log("Работает")

}




window.helloCore = function() {
    hello();
    bye();
}

function hello(){
    console.log("Hello from Core!");
}

function bye(){
    console.log("Bye from Core!");
}
hello()

// Функция для рисования полного игрока
window.drawPlayer = function(ctx, x, y) {
    // TODO: Вызвать drawPlayerBody и drawPlayerEyes
    window.drawPlayerBody(ctx, x, y);
    window.drawPlayerEyes(ctx, x, y);
    
    // Бонус: добавить улыбку
    // ctx.beginPath();
    // ctx.arc(x, y+5, 8, 0.1, Math.PI - 0.1);
    // ctx.strokeStyle = 'black';
    // ctx.stroke();
}

