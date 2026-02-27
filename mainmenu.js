(function() {
    const pauseOverlay = document.getElementById('pause-overlay');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const restartBtn = document.getElementById('restart-btn');

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (window.playSound) window.playSound('pause');
            window.isPaused = true;
            pauseOverlay.classList.add('show');
        });
    }

    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            window.isPaused = false;
            pauseOverlay.classList.remove('show');
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            window.isPaused = false;
            pauseOverlay.classList.remove('show');
            if (typeof window.initGame === 'function') {
                window.initGame(true);
            }
        });
    }

    window.MenuSystem = {
        tryStartBGM: function() {
            if (window.tryStartBGM) window.tryStartBGM();
        }
    };
})();