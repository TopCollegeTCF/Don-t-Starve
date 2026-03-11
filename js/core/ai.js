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
