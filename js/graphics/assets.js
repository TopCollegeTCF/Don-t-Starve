
// js/graphics/assets.js
class AssetLoader {
    constructor() {
        // Хранилище загруженных изображений (ключ -> изображение)
        this.images = new Map();
        // Счетчик загруженных файлов
        this.loadedCount = 0;
        // Общее количество файлов для загрузки
        this.totalImages = 0;
        // Функция, которая вызовется после загрузки всех файлов
        this.onComplete = null;
    }
    // Добавьте этот метод ВНУТРЬ класса AssetLoader
    loadAll(imagesList, callback) {
    // Сохраняем функцию, которую нужно вызвать по завершению
        this.onComplete = callback;
    
    // Преобразуем объект в массив пар [ключ, значение]
        const entries = Object.entries(imagesList);
    
    // Устанавливаем общее количество изображений
        this.totalImages = entries.length;
    
    // Сбрасываем счетчик загруженных
         this.loadedCount = 0;
    
    // Запускаем загрузку каждого изображения
        for (let i = 0; i < entries.length; i++) {
            const name = entries[i][0];  // например: 'player'
            const path = entries[i][1];  // например: 'assets/images/player.png'
            this.loadImage(name, path);
        }
    }
    // Добавьте этот метод ВНУТРЬ класса AssetLoader
    loadImage(name, path) {
        const img = new Image();
        img.onload = () => {
            this.images.set(name, img);
            this.loadedCount++;
            console.log(`✅ Loaded: ${name} (${this.loadedCount}/${this.totalImages})`);
            if (this.loadedCount === this.totalImages && this.onComplete) {
                console.log("🎉 All assets loaded!");
                this.onComplete();
            }
        };
        img.onerror = () => {
            console.error(`❌ Failed to load: ${name} from ${path}`);
            this.loadedCount++;
            if (this.loadedCount === this.totalImages && this.onComplete) {
                this.onComplete();
            }
        };
        img.src = path;
    }
    
    getImage(name) {
        return this.images.get(name) || null;
    }
  
      // Добавьте этот метод ВНУТРЬ класса AssetLoader
    getImage(name) {
    // Возвращает изображение по имени или null если не найдено
    return this.images.get(name) || null;
    }
}

window.assetLoader = new AssetLoader();


