function helloSoundPro() {
    console.log("🎵 Sound & Effects Pro — с поддержкой плейлистов");
}

window.SoundManagerPro = {
    sounds: {},
    playlists: {},
    currentPlaylist: null,
    currentTrackIndex: 0,
    isShuffling: false,
    isLoopingPlaylist: false,
    volume: 0.8,
    loadedCount: 0,
    totalSounds: 0,
    
    // Регистрация одиночного звука
    registerSound: function(name, path, category = 'sfx') {
        this.totalSounds++;
        const audio = new Audio();
        audio.addEventListener('canplaythrough', () => {
            this.loadedCount++;
            console.log(`✅ [${category}] Sound loaded: ${name} (${this.loadedCount}/${this.totalSounds})`);
        });
        audio.src = path;
        audio.load();
        this.sounds[name] = {
            audio: audio,
            category: category,
            volume: 0.8
        };
        console.log(`🔊 Sound registered: ${name} [${category}]`);
    },
    
    // Создание плейлиста
    createPlaylist: function(playlistName, trackNames) {
        this.playlists[playlistName] = {
            tracks: [...trackNames],
            currentIndex: 0,
            originalOrder: [...trackNames]
        };
        console.log(`📀 Playlist created: "${playlistName}" with ${trackNames.length} tracks`);
        return this.playlists[playlistName];
    },
    
    // Добавить трек в плейлист
    addToPlaylist: function(playlistName, trackName) {
        if(this.playlists[playlistName]) {
            this.playlists[playlistName].tracks.push(trackName);
            this.playlists[playlistName].originalOrder.push(trackName);
            console.log(`➕ Added "${trackName}" to playlist "${playlistName}"`);
        } else {
            console.warn(`⚠️ Playlist not found: ${playlistName}`);
        }
    },
    
    // Воспроизведение плейлиста
    playPlaylist: function(playlistName, startFrom = 0, shuffle = false) {
        if(!this.playlists[playlistName]) {
            console.warn(`⚠️ Playlist not found: ${playlistName}`);
            return;
        }
        
        // Останавливаем текущий плейлист если играет
        if(this.currentPlaylist && this.currentPlaylist.audio) {
            this.currentPlaylist.audio.pause();
            this.currentPlaylist.audio.currentTime = 0;
        }
        
        this.currentPlaylist = playlistName;
        this.isShuffling = shuffle;
        this.currentTrackIndex = startFrom;
        
        if(shuffle) {
            this._shufflePlaylist(playlistName);
        } else {
            this.playlists[playlistName].tracks = [...this.playlists[playlistName].originalOrder];
        }
        
        this._playCurrentTrack();
        console.log(`▶️ Playing playlist "${playlistName}", shuffle: ${shuffle}`);
    },
    
    // Воспроизведение текущего трека в плейлисте
    _playCurrentTrack: function() {
        const playlist = this.playlists[this.currentPlaylist];
        if(!playlist || this.currentTrackIndex >= playlist.tracks.length) {
            if(this.isLoopingPlaylist) {
                this.currentTrackIndex = 0;
                this._playCurrentTrack();
            } else {
                this.stopPlaylist();
            }
            return;
        }
        
        const trackName = playlist.tracks[this.currentTrackIndex];
        const sound = this.sounds[trackName];
        
        if(sound && sound.audio) {
            sound.audio.currentTime = 0;
            sound.audio.volume = this.volume;
            sound.audio.play().catch(e => console.log("Audio error:", e));
            
            // Слушаем окончание трека
            sound.audio.onended = () => {
                this.nextTrack();
            };
            
            console.log(`🎵 Now playing: ${trackName} (${this.currentTrackIndex + 1}/${playlist.tracks.length})`);
        } else {
            console.warn(`⚠️ Track not found: ${trackName}, skipping...`);
            this.nextTrack();
        }
    },
    
    // Следующий трек
    nextTrack: function() {
        if(!this.currentPlaylist) return;
        
        this.currentTrackIndex++;
        this._playCurrentTrack();
    },
    
    // Предыдущий трек
    previousTrack: function() {
        if(!this.currentPlaylist) return;
        
        if(this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
        } else if(this.isLoopingPlaylist) {
            const playlist = this.playlists[this.currentPlaylist];
            this.currentTrackIndex = playlist.tracks.length - 1;
        } else {
            return;
        }
        
        this._playCurrentTrack();
    },
    
    // Остановить плейлист
    stopPlaylist: function() {
        if(this.currentPlaylist) {
            const playlist = this.playlists[this.currentPlaylist];
            const currentTrack = playlist.tracks[this.currentTrackIndex];
            if(this.sounds[currentTrack]) {
                this.sounds[currentTrack].audio.pause();
                this.sounds[currentTrack].audio.currentTime = 0;
            }
            console.log(`⏹️ Playlist "${this.currentPlaylist}" stopped`);
            this.currentPlaylist = null;
        }
    },
    
    // Перемешать плейлист
    _shufflePlaylist: function(playlistName) {
        const playlist = this.playlists[playlistName];
        const shuffled = [...playlist.originalOrder];
        for(let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        playlist.tracks = shuffled;
    },
    
    // Воспроизведение одиночного звука (SFX)
    play: function(name) {
        if(this.sounds[name] && this.sounds[name].audio) {
            const sound = this.sounds[name];
            sound.audio.currentTime = 0;
            sound.audio.volume = this.volume * (sound.volume || 1);
            sound.audio.play().catch(e => console.log("Audio error:", e));
            console.log(`🔊 Playing SFX: ${name}`);
        } else {
            console.warn(`⚠️ Sound not found: ${name}`);
        }
    },
    
    // Установка громкости
    setVolume: function(name, volume) {
        if(this.sounds[name] && this.sounds[name].audio) {
            this.sounds[name].volume = Math.max(0, Math.min(1, volume));
            this.sounds[name].audio.volume = this.volume * this.sounds[name].volume;
        }
    },
    
    setMasterVolume: function(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        // Применяем ко всем текущим звукам
        for(let name in this.sounds) {
            if(this.sounds[name].audio) {
                this.sounds[name].audio.volume = this.volume * this.sounds[name].volume;
            }
        }
        console.log(`🎚️ Master volume set to: ${this.volume}`);
    },
    
    // Получить информацию о текущем треке
    getCurrentTrackInfo: function() {
        if(!this.currentPlaylist) return null;
        
        const playlist = this.playlists[this.currentPlaylist];
        const currentTrack = playlist.tracks[this.currentTrackIndex];
        
        return {
            playlist: this.currentPlaylist,
            track: currentTrack,
            index: this.currentTrackIndex + 1,
            total: playlist.tracks.length,
            isShuffling: this.isShuffling,
            isLooping: this.isLoopingPlaylist
        };
    },
    
    // Переключение зацикливания плейлиста
    toggleLoopPlaylist: function() {
        this.isLoopingPlaylist = !this.isLoopingPlaylist;
        console.log(`🔄 Playlist loop: ${this.isLoopingPlaylist ? 'ON' : 'OFF'}`);
        return this.isLoopingPlaylist;
    },
    
    // Пауза текущего трека
    pauseCurrent: function() {
        if(this.currentPlaylist) {
            const playlist = this.playlists[this.currentPlaylist];
            const currentTrack = playlist.tracks[this.currentTrackIndex];
            if(this.sounds[currentTrack]) {
                this.sounds[currentTrack].audio.pause();
                console.log(`⏸️ Paused: ${currentTrack}`);
            }
        }
    },
    
    // Возобновление текущего трека
    resumeCurrent: function() {
        if(this.currentPlaylist) {
            const playlist = this.playlists[this.currentPlaylist];
            const currentTrack = playlist.tracks[this.currentTrackIndex];
            if(this.sounds[currentTrack]) {
                this.sounds[currentTrack].audio.play().catch(e => console.log("Audio error:", e));
                console.log(`▶️ Resumed: ${currentTrack}`);
            }
        }
    }
};

helloSoundPro();

// ============= ПРИМЕР ИСПОЛЬЗОВАНИЯ =============
/*
// Регистрация звуков
SoundManagerPro.registerSound('menu_click', '/sounds/click.mp3', 'sfx');
SoundManagerPro.registerSound('game_start', '/sounds/start.mp3', 'sfx');
SoundManagerPro.registerSound('bg_forest', '/music/forest.mp3', 'music');
SoundManagerPro.registerSound('bg_cave', '/music/cave.mp3', 'music');
SoundManagerPro.registerSound('victory', '/sounds/win.mp3', 'sfx');

// Создание плейлиста для фоновой музыки
SoundManagerPro.createPlaylist('ambient', ['bg_forest', 'bg_cave']);

// Запуск плейлиста с перемешиванием
SoundManagerPro.playPlaylist('ambient', 0, true);

// Управление
SoundManagerPro.setMasterVolume(0.5);
SoundManagerPro.nextTrack();           // следующий трек
SoundManagerPro.previousTrack();       // предыдущий трек
SoundManagerPro.toggleLoopPlaylist();  // зациклить плейлист
SoundManagerPro.pauseCurrent();        // пауза
SoundManagerPro.resumeCurrent();       // продолжить

// Получить информацию о текущем треке
console.log(SoundManagerPro.getCurrentTrackInfo());

// Одиночные SFX звуки
SoundManagerPro.play('menu_click');
SoundManagerPro.play('victory');
*/
