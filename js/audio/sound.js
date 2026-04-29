// js/audio/sound.js
class SoundManager {
    constructor() {
        // Хранилище звуков
        this.sounds = new Map();
        // Счетчики загрузки
        this.loadedCount = 0;
        this.totalSounds = 0;
        // Колбэк завершения загрузки
        this.onComplete = null;
        // Текущая фоновая музыка
        this.currentMusic = null;
    }
    
    loadAll(soundsList, callback) {
        this.onComplete = callback;
        const entries = Object.entries(soundsList);
        this.totalSounds = entries.length;
        this.loadedCount = 0;
        
        for (let i = 0; i < entries.length; i++) {
            const name = entries[i][0];
            const path = entries[i][1];
            this.loadSound(name, path);
        }
    }
    
    loadSound(name, path) {
        const audio = new Audio();
        const self = this;
        
        audio.addEventListener('canplaythrough', function() {
            self.loadedCount++;
            console.log(`✅ Sound loaded: ${name} (${self.loadedCount}/${self.totalSounds})`);
            if (self.loadedCount === self.totalSounds && self.onComplete) {
                console.log("🔊 All sounds ready!");
                self.onComplete();
            }
        });
        
        audio.onerror = function() {
            console.error(`❌ Failed to load sound: ${name}`);
            self.loadedCount++;
        };
        
        audio.src = path;
        audio.load();
        this.sounds.set(name, audio);
    }
    
    play(name) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.currentTime = 0;  // перематываем в начало
            sound.play().catch(e => console.log("Audio error:", e));
        } else {
            console.warn(`⚠️ Sound not found: ${name}`);
        }
    }
    
    playMusic(name, volume = 0.3) {
        // Останавливаем текущую музыку
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
        
        const music = this.sounds.get(name);
        if (music) {
            music.loop = true;      // зацикливаем
            music.volume = volume;   // устанавливаем громкость
            music.play().catch(e => console.log("Music error:", e));
            this.currentMusic = music;
        } else {
            console.warn(`⚠️ Music track not found: ${name}`);
        }
    }
    
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }
}

window.soundManager = new SoundManager();
