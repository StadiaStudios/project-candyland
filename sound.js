const volumes = {
    bgm: 1.0,
    move: 0.6,
    combo: 0.4,
    pause: 0.8,
    bomb: 0.4
};

const sfxMove = new Audio('assets/sfx/move.mp3');
const sfxCombo = new Audio('assets/sfx/combo.mp3');
const sfxPause = new Audio('assets/sfx/pause.mp3');
const sfxBomb = new Audio('assets/sfx/bomb.mp3'); 
const bgm = new Audio('assets/sfx/bgm.mp3');
window.bgm = bgm; // This allows index.html to see the bgm object

bgm.loop = true;
bgm.volume = volumes.bgm;

let bgmStarted = false;

function tryStartBGM() {
    if (!bgmStarted) {
        bgm.play().then(() => {
            bgmStarted = true;
        }).catch(() => {});
    }
}

function playSound(type) {
    let sound = null;
    let vol = 1.0;

    switch(type) {
        case 'move': 
            sound = sfxMove; 
            vol = volumes.move;
            break;
        case 'combo': 
            sound = sfxCombo; 
            vol = volumes.combo;
            break;
        case 'pause': 
            sound = sfxPause; 
            vol = volumes.pause;
            break;
        case 'bomb': 
            sound = sfxBomb; 
            vol = volumes.bomb;
            break;
    }
    
    if (sound) {
        sound.currentTime = 0;
        sound.volume = vol;
        sound.play().catch(e => console.warn("Audio playback failed:", e));
    }
}

window.playSound = playSound;
window.tryStartBGM = tryStartBGM;