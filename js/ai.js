function helloAI() {
    console.log("AI ready");
}
window.helloAI = function() {
    hello();
    bye();
}
function hello() {
    console.log("AI ready");
}
function bye() {
    console.log("AI ВСЕ!");
}
window.drawSpider = function(ctx, x, y) {

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
}
