document.addEventListener('DOMContentLoaded', () => {

    /* ===============================
       0. SPA NAVIGATION SETUP
    =============================== */

    const navLinks = document.querySelectorAll('.nav-link');
    const content = document.getElementById('content');

    // Save HOME HTML once
    const homeHTML = content.innerHTML;

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const page = this.dataset.page;

            // 🟢 HOME → restore dashboard & re-init logic
            if (page === "home") {
                content.innerHTML = homeHTML;
                initDashboard();
                initLiveBadge();
                return;
            }

            // 🟢 LEADERBOARD → fetch HTML
            if (page === "leaderboard") {
                fetch("leaderboard.html")
                    .then(res => res.text())
                    .then(html => {
                        content.innerHTML = html;
                    })
                    .catch(() => {
                        content.innerHTML = "<h2>Leaderboard not found</h2>";
                    });
            }
        });
    });

    /* ===============================
       1. DASHBOARD INITIALIZATION
    =============================== */

    function initDashboard() {

        // 🔐 PERSONALIZATION & SECURITY
        const userName = localStorage.getItem('userName') || 'Trader';
        const sessionToken = localStorage.getItem('sessionToken');

        if (!sessionToken) {
            window.location.href = "login.html";
            return;
        }

        const welcomeText = document.querySelector('.user-info strong');
        if (welcomeText) welcomeText.textContent = userName;

        // 🧠 LIVE WORD COUNTER
        const justification = document.getElementById('justification');
        const wordCountSpan = document.getElementById('wordCount');

        if (justification && wordCountSpan) {
            justification.addEventListener('input', () => {
                const text = justification.value.trim();
                const words = text
                    ? text.split(/\s+/).filter(w => w.length > 0).length
                    : 0;

                wordCountSpan.textContent = words;
                wordCountSpan.style.color = words >= 50 ? "#22c55e" : "#ef4444";
            });
        }

        // 📤 HANDLE PREDICTION SUBMISSION
        const predictionForm = document.getElementById('predictionForm');
        const submitBtn = document.getElementById('submitBtn');

        if (predictionForm && submitBtn) {
            predictionForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const words = parseInt(wordCountSpan.textContent);
                if (words < 50) {
                    alert("Your justification must be at least 50 words.");
                    return;
                }

                const payload = {
                    stock: document.getElementById('stockSelect').value,
                    direction: document.querySelector('input[name="direction"]:checked').value,
                    justification: justification.value
                };

                try {
                    submitBtn.disabled = true;
                    submitBtn.innerText = "Processing...";

                    const response = await fetch('http://localhost:5000/api/predict', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionToken}`
                        },
                        body: JSON.stringify(payload)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert("Success! Your prediction is locked.");
                        submitBtn.innerText = "Prediction Locked ✓";
                        submitBtn.style.background = "#475569";
                        predictionForm.reset();
                    } else {
                        alert(result.error || "Submission failed");
                        submitBtn.disabled = false;
                        submitBtn.innerText = "Lock Prediction";
                    }

                } catch (err) {
                    alert("Server error. Is backend running?");
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Lock Prediction";
                }
            });
        }

        // ⏱ MOCK TIMER
        const timerDisplay = document.getElementById('timer');
        if (timerDisplay) {
            setInterval(() => {
                let [mins, secs] = timerDisplay.textContent.split(':').map(Number);

                if (secs > 0) secs--;
                else if (mins > 0) {
                    mins--;
                    secs = 59;
                }

                timerDisplay.textContent =
                    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }, 1000);
        }
    }

    /* ===============================
       2. LIVE BADGE BLINK
    =============================== */

    function initLiveBadge() {
        const badge = document.querySelector('.live-badge span');
        if (!badge) return;

        setInterval(() => {
            badge.style.opacity = badge.style.opacity === '0' ? '1' : '0';
        }, 800);
    }

    // 🔥 INITIAL LOAD
    initDashboard();
    initLiveBadge();

});
