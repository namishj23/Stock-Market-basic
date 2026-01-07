/**
 * STOCKPREDICT - LOGIN LOGIC
 * Handles Traditional Auth and Google Identity Services
 */

function handleCredentialResponse(response) {
    const errorDisplay = document.getElementById('error');
    
    // 1. Show loading state
    errorDisplay.style.color = "#22c55e";
    errorDisplay.textContent = "Verifying Google Account...";

    // 2. Send the Google Token to your Node/Express Backend
    fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
    })
    .then(res => {
        if (!res.ok) throw new Error("Backend verification failed");
        return res.json();
    })
    .then(data => {
        if (data.token) {
            // Store Session JWT and User data
            localStorage.setItem('sessionToken', data.token);
            localStorage.setItem('userName', data.user.name);
            
            errorDisplay.textContent = "Success! Redirecting...";
            
            // Automatic redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = "welcomepage.html";
            }, 1500);
        }
    })
    .catch(err => {
        errorDisplay.style.color = "#ef4444";
        errorDisplay.textContent = "Google Auth Failed: Check if Backend is running.";
        console.error(err);
    });
}

window.onload = function () {
    // Initialize Google Identity Services
    google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // REPLACE THIS
        callback: handleCredentialResponse
    });

    const loginForm = document.getElementById('loginForm');
    const errorDisplay = document.getElementById('error');
    const googleBtn = document.querySelector('button[type="button"]');

    // --- HANDLE GOOGLE BUTTON CLICK ---
    googleBtn.onclick = () => {
        google.accounts.id.prompt(); // Shows the native Google One Tap / Popup
    };

    // --- HANDLE TRADITIONAL LOGIN (ADMIN/12345) ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errorDisplay.textContent = "";

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === "admin" && password === "12345") {
            errorDisplay.style.color = "#22c55e";
            errorDisplay.textContent = `Welcome back, ${username}! Redirecting...`;
            
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerText = "Authenticating...";

            // Mock a local session for traditional login
            localStorage.setItem('userName', 'Admin');
            localStorage.setItem('sessionToken', 'mock-admin-token');

            setTimeout(() => {
                window.location.href = "welcomepage.html";
            }, 2000); 

        } else {
            errorDisplay.style.color = "#ef4444";
            errorDisplay.textContent = "Invalid credentials. Try admin / 12345";
            
            const loginBox = document.querySelector('.login-box');
            loginBox.classList.add('shake');
            setTimeout(() => loginBox.classList.remove('shake'), 500);
        }
    });
};