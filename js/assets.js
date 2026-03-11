window.helloGraphics = function() {
    const img = document.getElementById('testImage');
    if (img.complete) {
        console.log("Assets & Graphics ready 🖼️ (изображение загружено)");
    } else {
        console.log("Assets & Graphics ready 🖼️");
    }
}
