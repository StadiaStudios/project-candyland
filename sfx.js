class SFXManager {
    constructor() {
        // We store the paths and a cache of the Audio objects
        this.soundPaths = {
            move: 'assets/sfx/move.mp3',
            pause: 'assets/sfx/move.mp3',
            combo: 'assets/sfx/move.mp3'
        };
        
        this.cache = {};
        this.preload();
    }

    preload() {
        for (const key in this.soundPaths) {
            const audio = new Audio(this.soundPaths[key]);
            audio.preload = 'auto';
            this.cache[key] = audio;
        }
    }

    playMove() {
        this._play('move');
    }

    playPause() {
        this._play('pause');
    }

    playCombo(level) {
        // Increase pitch slightly for higher combos
        const playbackRate = Math.min(1 + (level * 0.1), 2.0);
        this._play('combo', playbackRate);
    }

    _play(key, playbackRate = 1.0) {
        const source = this.cache[key];
        if (source) {
            // .cloneNode(true) allows the sound to overlap with itself 
            // if triggered multiple times quickly
            const soundClone = source.cloneNode(true);
            soundClone.playbackRate = playbackRate;
            
            soundClone.play().catch(e => {
                // Browsers often block audio until the first click
                console.warn("Audio playback delayed: Waiting for user interaction.");
            });

            // Clean up the element from memory once it finishes playing
            soundClone.onended = () => {
                soundClone.remove();
            };
        }
    }
}

// Create the global instance
const sfx = new SFXManager();