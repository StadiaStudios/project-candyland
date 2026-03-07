/**
 * gempackages.js
 * Extends the Gem Shop to allow purchasing gem packages using 
 * the coin/gold system. Synchronized with index.html and shop.html.
 */

(function() {
    // Configuration for the gem packages using PNG images
    const packages = [
        { 
            id: 'crate_small',  
            name: 'Small Crate',  
            gemAmount: 20,  
            price: 20000,  
            color: '#425e14', 
            image: 'assets/icons/crates/small.png' 
        },
        { 
            id: 'crate_medium', 
            name: 'Medium Crate', 
            gemAmount: 50,  
            price: 50000, 
            color: '#9faa00', 
            image: 'assets/icons/crates/medium.png' 
        },
        { 
            id: 'crate_large',  
            name: 'Mega Crate',   
            gemAmount: 100, 
            price: 100000, 
            color: '#51ff00', 
            image: 'assets/icons/crates/mega.png' 
        }
    ];

    // Helper to format currency
    const formatMoney = (val) => new Intl.NumberFormat().format(val);

    // Main initialization function
    function initGemPackages() {
        const shopGrid = document.querySelector('.shop-grid');
        if (!shopGrid) return;

        // Create Section Header for the Packages
        const sectionHeader = document.createElement('h2');
        sectionHeader.innerText = "COIN TO GEM EXCHANGE";
        sectionHeader.style.gridColumn = "1 / -1";
        sectionHeader.style.marginTop = "40px";
        sectionHeader.style.color = "var(--neon-yellow)";
        sectionHeader.style.textShadow = "0 0 10px var(--neon-yellow)";
        sectionHeader.style.fontSize = "1rem";
        sectionHeader.style.textAlign = "center";
        shopGrid.appendChild(sectionHeader);

        // Generate Package Cards
        packages.forEach(pkg => {
            const card = document.createElement('div');
            card.className = 'shop-item';
            card.style.borderColor = pkg.color;
            card.innerHTML = `
                <div class="item-icon-container" style="height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                    <img src="${pkg.image}" alt="${pkg.name}" 
                         style="max-height: 100%; max-width: 80px; filter: drop-shadow(0 0 8px ${pkg.color});"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/80?text=CRATE';">
                </div>
                <div class="item-name" style="color: ${pkg.color}">${pkg.name}</div>
                <div class="item-desc">Buy <strong>${pkg.gemAmount} Gems</strong> using your coins.</div>
                <button class="buy-btn" id="buy-${pkg.id}" style="background: ${pkg.color}; color: #000; font-weight: bold;">
                    ${formatMoney(pkg.price)} COINS
                </button>
            `;

            // Add Click Event
            const btn = card.querySelector('button');
            btn.onclick = () => purchasePackage(pkg);

            shopGrid.appendChild(card);
        });
    }

    /**
     * Handles the logic for purchasing a gem package.
     * Uses the coin system (score/gold) to pay for gems.
     */
    function purchasePackage(pkg) {
        // Retrieve latest coin balance from index.html (score) or shop.html (gold)
        let score = parseInt(localStorage.getItem('candySwap_score')) || 0;
        let goldValue = localStorage.getItem('candySwap_gold');
        
        // Match shop.html logic: use gold if it exists, otherwise use score
        let currentCoins = (goldValue !== null) ? parseInt(goldValue) : score;
        let currentGems = parseInt(localStorage.getItem('candySwap_gems')) || 0;

        if (currentCoins >= pkg.price) {
            // Deduct from COINS (payment), add to GEMS (reward)
            currentCoins -= pkg.price;
            currentGems += pkg.gemAmount;

            // Save to all relevant keys to ensure synchronization across all pages
            localStorage.setItem('candySwap_gold', currentCoins);
            localStorage.setItem('candySwap_score', currentCoins);
            localStorage.setItem('candySwap_gems', currentGems);

            // Update the window variables so the UI on gemshop.html updates immediately
            if (typeof window.score !== 'undefined') window.score = currentCoins;
            if (typeof window.gold !== 'undefined') window.gold = currentCoins;
            if (typeof window.gems !== 'undefined') window.gems = currentGems;

            // Refresh the display using existing shop functions
            if (typeof window.updateUI === 'function') {
                window.updateUI();
            } else if (typeof window.updateHeaderStats === 'function') {
                window.updateHeaderStats();
            }

            // Sound feedback
            if (window.buySfx) {
                window.buySfx.currentTime = 0;
                window.buySfx.play().catch(() => {});
            }

            showNotification(`Spent ${pkg.price} Coins for ${pkg.gemAmount} Gems!`);
        } else {
            showNotification(`NEED ${pkg.price - currentCoins} MORE COINS!`, true);
        }
    }

    /**
     * Notification UI
     */
    function showNotification(msg, isError = false) {
        const notif = document.createElement('div');
        notif.style.position = 'fixed';
        notif.style.bottom = '120px';
        notif.style.left = '50%';
        notif.style.transform = 'translateX(-50%)';
        notif.style.background = isError ? '#ff0055' : 'var(--neon-cyan)';
        notif.style.color = '#000';
        notif.style.padding = '12px 24px';
        notif.style.fontFamily = "'Press Start 2P', cursive";
        notif.style.fontSize = '10px';
        notif.style.zIndex = '99999';
        notif.style.borderRadius = '4px';
        notif.style.boxShadow = `0 0 20px ${isError ? '#ff0055' : 'var(--neon-cyan)'}`;
        notif.style.border = '2px solid white';
        notif.innerText = msg;
        
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            notif.style.opacity = '0';
            notif.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => notif.remove(), 500);
        }, 2500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGemPackages);
    } else {
        initGemPackages();
    }
})();