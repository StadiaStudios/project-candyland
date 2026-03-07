(function() {
    function getMultiplier() {
        let mult = 1;
        
        // Check 10X Ultra (Prioritized)
        const exp10 = localStorage.getItem('gem_mult10_expiry');
        if (exp10 && Date.now() < parseInt(exp10)) {
            return 10;
        }

        // Check Standard 2X
        const exp2 = localStorage.getItem('gem_multiplier_expiry');
        if (exp2 && Date.now() < parseInt(exp2)) {
            mult = 2;
        }

        return mult;
    }

    const originalHandleMatches = window.handleMatches;
    if (originalHandleMatches) {
        window.handleMatches = async function(matches, combo = 1, triggeredBombs = []) {
            const currentMult = getMultiplier();
            
            if (currentMult > 1) {
                const pointsPerCandy = 10;
                const basePoints = matches.length * pointsPerCandy * combo;
                // Add the extra points (currentMult - 1) * base because originalHandleMatches adds the base
                const bonusPoints = basePoints * (currentMult - 1);
                
                if (typeof window.score !== 'undefined') {
                    window.score += Math.floor(bonusPoints);
                    const scoreEl = document.getElementById('score');
                    if (scoreEl) scoreEl.innerText = window.score;
                }
            }
            
            return originalHandleMatches(matches, combo, triggeredBombs);
        };
    }

    function updateVisualIndicator() {
        const mult = getMultiplier();
        let indicator = document.getElementById('mult-indicator');
        
        if (mult > 1) {
            const stats = document.querySelector('.stats-group');
            if (stats) {
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.id = 'mult-indicator';
                    indicator.style.fontSize = '10px';
                    indicator.style.marginTop = '5px';
                    indicator.style.padding = '4px';
                    indicator.style.border = '2px solid';
                    stats.appendChild(indicator);
                }
                
                if (mult === 10) {
                    indicator.style.color = '#ff00ff';
                    indicator.style.borderColor = '#ff00ff';
                    indicator.style.background = 'rgba(255, 0, 255, 0.2)';
                    indicator.style.textShadow = '0 0 5px #ff00ff';
                    indicator.innerText = "ULTRA 10X ACTIVE!";
                } else {
                    indicator.style.color = '#00ffcc';
                    indicator.style.borderColor = '#00ffcc';
                    indicator.style.background = 'rgba(0, 0, 0, 0.8)';
                    indicator.style.textShadow = '0 0 5px #00ffcc';
                    indicator.innerText = "2X SCORE ACTIVE!";
                }
            }
        } else if (indicator) {
            indicator.remove();
        }
    }

    window.addEventListener('load', () => {
        setInterval(updateVisualIndicator, 1000);
    });
})();