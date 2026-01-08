document.addEventListener('DOMContentLoaded', () => {
    // 1. PERSONALIZE DASHBOARD
    // Retrieve the name and token we saved in login.js
    const userName = localStorage.getItem('userName') || 'Trader';
    const sessionToken = localStorage.getItem('sessionToken');
    
    // Update the "Welcome" text in the Navbar
    const welcomeText = document.querySelector('.user-info strong');
    if (welcomeText) welcomeText.textContent = userName;

    // Redirect to login if no token is found (Basic Security)
    if (!sessionToken) {
        window.location.href = "login.html";
        return;
    }

    // 2. LIVE WORD COUNTER (The "Skill" Requirement)
    const justification = document.getElementById('justification');
    const wordCountSpan = document.getElementById('wordCount');

    justification.addEventListener('input', () => {
        const text = justification.value.trim();
        const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
        
        wordCountSpan.textContent = words;
        
        // Visual feedback: Green if >= 50, Red otherwise
        if (words >= 50) {
            wordCountSpan.style.color = "#22c55e";
        } else {
            wordCountSpan.style.color = "#ef4444";
        }
    });

    // 3. HANDLE PREDICTION SUBMISSION
    const predictionForm = document.getElementById('predictionForm');
    const submitBtn = document.getElementById('submitBtn');

    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const words = parseInt(wordCountSpan.textContent);
        if (words < 50) {
            alert("Your justification must be at least 50 words to prove this is a skill-based entry.");
            return;
        }

        // Prepare data for the backend
        const payload = {
            stock: document.getElementById('stockSelect').value,
            direction: document.querySelector('input[name="direction"]:checked').value,
            justification: justification.value
        };

        try {
            submitBtn.disabled = true;
            submitBtn.innerText = "Processing...";

            // Send to your Node/Express Backend
            const response = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionToken}` // Send JWT for identity
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Success! Your prediction is locked for today.");
                submitBtn.innerText = "Prediction Locked ✓";
                submitBtn.style.background = "#475569"; // Gray out after success
                predictionForm.reset();
            } else {
                // Handle "Already submitted" or "Session expired" errors
                alert(result.error || "Submission failed");
                submitBtn.disabled = false;
                submitBtn.innerText = "Lock Prediction";
            }
        } catch (err) {
            alert("Error connecting to server. Is the backend running?");
            submitBtn.disabled = false;
            submitBtn.innerText = "Lock Prediction";
        }
    });

    // 4. MOCK TIMER LOGIC (Window 9:00 - 9:30 AM)
    const timerDisplay = document.getElementById('timer');
    function updateTimer() {
        // This is a simple visual countdown for the demo
        let timeText = timerDisplay.textContent;
        let [mins, secs] = timeText.split(':').map(Number);
        
        if (secs > 0) {
            secs--;
        } else if (mins > 0) {
            mins--;
            secs = 59;
        }

        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    setInterval(updateTimer, 1000);
});