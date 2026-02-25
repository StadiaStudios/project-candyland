class SFXManager {
    constructor() {
        this.soundPaths = {
            move: 'assets/sfx/move.mp3',
            pause: 'assets/sfx/pause.mp3',
            combo: 'assets/sfx/combo.mp3'
        };
        
        this.cache = {};
        this.unlocked = false;
        this.preload();
        this.setupUnlockListener();
    }

    preload() {
        for (const key in this.soundPaths) {
            const audio = new Audio(this.soundPaths[key]);
            audio.preload = 'auto';
            audio.load(); // Explicitly start loading
            this.cache[key] = audio;
        }
    }

    // Modern browsers block audio until a user interaction occurs.
    // This listener plays and immediately pauses all sounds once to "unlock" them.
    setupUnlockListener() {
        const unlock = () => {
            if (this.unlocked) return;
            
            for (const key in this.cache) {
                const audio = this.cache[key];
                audio.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {
                    // Fail silently if still blocked
                });
            }
            
            this.unlocked = true;
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('keydown', unlock);
        };

        window.addEventListener('pointerdown', unlock);
        window.addEventListener('keydown', unlock);
    }

    playMove() {
        this._play('move');
    }

    playPause() {
        this._play('pause');
    }

    playCombo(level) {
        const playbackRate = Math.min(1 + (level * 0.1), 2.0);
        this._play('combo', playbackRate);
    }

    _play(key, playbackRate = 1.0) {
        const source = this.cache[key];
        if (source) {
            // Cloning ensures sounds can overlap without cutting each other off
            const soundClone = source.cloneNode(true);
            soundClone.playbackRate = playbackRate;
            
            const playPromise = soundClone.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.warn(`SFX: Playback for ${key} failed. Browser may still be blocking audio.`);
                });
            }

            soundClone.onended = () => {
                soundClone.remove();
            };
        }
    }
}

// Create the global instance
const sfx = new SFXManager();