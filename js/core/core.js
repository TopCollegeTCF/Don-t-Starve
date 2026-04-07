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





// После строки с trees[0].wood -= gain; добавить:
if(window.treeShakeEffects) {
    window.treeShakeEffects[`${trees[0].x},${trees[0].y}`] = { intensity: 5 };
}
