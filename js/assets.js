window.helloGraphics = function () {
    hello();
    bye();
}
function hello() {
    const img = document.getElementById('testImage');
    if (img.complete) {
        console.log("Assets & Graphics ready 🖼️ (изображение загружено)");
    } else {
        console.log("Assets & Graphics ready 🖼️");
    }
}
function bye() {
    const img = document.getElementById('testImage');
    if (img.complete) {
        console.log("Assets & Graphics ready 🖼️ (изображение загружено)");
    } else {
        console.log("Assets & Graphics ready 🖼️");
    }
}
