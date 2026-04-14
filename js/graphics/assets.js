function helloGraphics() {
    console.log("🎨 Graphics & Assets ready");
}

window.AssetLoader = {
    images: {},
    loadedCount: 0,
    totalImages: 0,
    onComplete: null,
    
    // Регистрация одного изображения
    registerImage: function(name, path) {
        this.totalImages++;
        const img = new Image();
        img.onload = () => {
            this.loadedCount++;
            console.log(`✅ Loaded: ${name} (${this.loadedCount}/${this.totalImages})`);
            if(this.loadedCount === this.totalImages && this.onComplete) {
                console.log("🎉 All assets loaded!");
                this.onComplete();
            }
        };
        img.onerror = () => {
            console.error(`❌ Failed to load: ${name} from ${path}`);
            this.loadedCount++;
            if(this.loadedCount === this.totalImages && this.onComplete) {
                this.onComplete();
            }
        };
        img.src = path;
        this.images[name] = img;
    },
    
    // НОВЫЙ МЕТОД: массовая загрузка
    loadAll: function(imagesList, callback) {
        this.onComplete = callback;
        const names = Object.keys(imagesList);
        this.totalImages = names.length;
        this.loadedCount = 0;
        
        for(let i = 0; i < names.length; i++) {
            const name = names[i];
            const path = imagesList[name];
            this.registerImage(name, path);
        }
    },
    
    // Получение загруженного изображения
    getImage: function(name) {
        return this.images[name] || null;
    }
};

helloGraphics();
// Добавить после существующего кода
window.AssetLoader.loadFromConfig = function() {
    if(window.GameConfig && window.GameConfig.images) {
        console.log("🖼️ Loading images from GameConfig");
        this.loadAll(GameConfig.images, () => {
            console.log("✅ All GameConfig images loaded");
        });
    }
};

// Вызвать автоматически при загрузке
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AssetLoader.loadFromConfig();
    });
} else {
    AssetLoader.loadFromConfig();
}
