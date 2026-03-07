(function() {
    const REWARD_INTERVAL = 30000;
    const GEM_ICON = 'assets/gem.png';

    let gems = parseInt(localStorage.getItem('candySwap_gems')) || 0;
    let startTime = Date.now();
    let accumulatedTime = 0;
    let gemTimer = null;

    function setupGemUI() {
        const statsGroup = document.querySelector('.stats-group');
        if (!statsGroup) return;

        const gemDisplay = document.createElement('div');
        gemDisplay.className = 'gold-display';
        gemDisplay.style.borderColor = '#ff8d8d';
        gemDisplay.style.color = '#ff0000';
        gemDisplay.style.marginTop = '5px';
        gemDisplay.style.position = 'relative';
        gemDisplay.style.overflow = 'hidden';
        gemDisplay.style.boxShadow = '4px 4px 0px rgba(0, 255, 204, 0.3)';
        
        const progressBar = document.createElement('div');
        progressBar.id = 'gem-progress-bar';
        progressBar.style.position = 'absolute';
        progressBar.style.left = '0';
        progressBar.style.bottom = '0';
        progressBar.style.height = '4px';
        progressBar.style.backgroundColor = '#ff2600';
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 1s linear';
        
        gemDisplay.innerHTML = `
            <img id="gem-icon" src="${GEM_ICON}" style="width:20px; height:20px; object-fit:contain; vertical-align: middle;">
            <span id="gems-count" style="vertical-align: middle; margin-left: 5px;">${gems}</span>
        `;
        
        gemDisplay.appendChild(progressBar);
        statsGroup.appendChild(gemDisplay);
    }

    function saveGems() {
        localStorage.setItem('candySwap_gems', gems);
        const countEl = document.getElementById('gems-count');
        if (countEl) countEl.innerText = gems;
    }

    function updateProgressUI() {
        const progressBar = document.getElementById('gem-progress-bar');
        if (!progressBar) return;

        const elapsed = Date.now() - startTime + accumulatedTime;
        const progress = Math.min((elapsed / REWARD_INTERVAL) * 100, 100);
        progressBar.style.width = `${progress}%`;
    }

    function grantGem() {
        gems++;
        saveGems();
        
        const msgEl = document.getElementById('message');
        if (msgEl) {
            msgEl.innerText = "+1 PLAYTIME GEM AWARDED!";
            msgEl.style.color = "#00ffcc";
            msgEl.classList.remove('animate');
            void msgEl.offsetWidth;
            msgEl.classList.add('animate');
            
            setTimeout(() => {
                msgEl.style.color = '';
            }, 2000);
        }

        startTime = Date.now();
        accumulatedTime = 0;
    }

    function startRewardCycle() {
        if (gemTimer) clearInterval(gemTimer);
        
        startTime = Date.now();
        
        gemTimer = setInterval(() => {
            if (!window.isPaused) {
                const now = Date.now();
                const elapsed = now - startTime + accumulatedTime;
                
                updateProgressUI();

                if (elapsed >= REWARD_INTERVAL) {
                    grantGem();
                }
            }
        }, 1000);
    }

    const originalInitGame = window.initGame;
    window.initGame = function(isRestart = false) {
        if (isRestart) {
            accumulatedTime = 0;
            startTime = Date.now();
        }
        return originalInitGame(isRestart);
    };

    window.addEventListener('load', () => {
        setupGemUI();
        startRewardCycle();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            accumulatedTime += (Date.now() - startTime);
        } else {
            startTime = Date.now();
        }
    });

})();