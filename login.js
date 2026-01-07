document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorDisplay = document.getElementById('error');

    // Handle standard Username/Password login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Reset error message
        errorDisplay.textContent = "";

        // 2. Get input values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // 3. Simple Validation Logic
        // In a real app, this is where you'd call your Next.js API route
        if (username === "admin" && password === "12345") {
            console.log("Login successful!");
            
            // 4. Feedback to user
            alert(`Welcome back, ${username}! Redirecting to dashboard...`);
            
            // 5. Redirect to your Home Page
            window.location.href = "welcomepage.html"; 
        } else {
            // Error handling
            errorDisplay.textContent = "Invalid username or password. Try admin / password123";
            
            // Shake effect for the login box (if you add the CSS)
            const loginBox = document.querySelector('.login-box');
            loginBox.classList.add('shake');
            setTimeout(() => loginBox.classList.remove('shake'), 500);
        }
    });
});