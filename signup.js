window.onload = function () {
    const signupForm = document.getElementById('signupForm');
    const errorDisplay = document.getElementById('error');

    // 1. Handle Manual Registration
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            // Connect to your backend /api/auth/signup
            try {
                const response = await fetch('http://localhost:5000/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('userName', username);
                    localStorage.setItem('sessionToken', data.token);
                    window.location.href = "welcomepage.html";
                } else {
                    errorDisplay.style.color = "#ef4444";
                    errorDisplay.textContent = data.error || "Registration failed";
                }
            } catch (err) {
                // For demo/offline:
                localStorage.setItem('userName', username);
                window.location.href = "welcomepage.html";
            }
        });
    }

    // 2. Handle Google Registration
    const googleBtn = document.getElementById('googleSignUpBtn');
    if (googleBtn) {
        googleBtn.onclick = () => {
            if (typeof google !== 'undefined') {
                google.accounts.id.initialize({
                    client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
                    callback: (res) => {
                        // Same logic as login to verify token with backend
                        handleGoogleSignup(res.credential);
                    }
                });
                google.accounts.id.prompt();
            }
        };
    }
};

async function handleGoogleSignup(token) {
    const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('sessionToken', data.token);
        localStorage.setItem('userName', data.user.name);
        window.location.href = "welcomepage.html";
    }
}