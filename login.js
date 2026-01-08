window.onload = function () {

    /* ================= GOOGLE LOGIN ================= */

    google.accounts.id.initialize({
        client_id: "441653701932-jhkk1h7bbf3so43te9sa62ercsollalv.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        {
            theme: "outline",
            size: "large",
            width: 250
        }
    );

    function handleCredentialResponse(response) {
        // JWT token received from Google
        const token = response.credential;

        // (Optional) decode token to get user info
        const payload = JSON.parse(atob(token.split(".")[1]));

        localStorage.setItem("userName", payload.name);
        localStorage.setItem("userEmail", payload.email);
        localStorage.setItem("sessionToken", token);

        window.location.href = "welcomepage.html";
    }

    /* ================= NORMAL LOGIN ================= */

    const loginForm = document.getElementById("loginForm");
    const errorDisplay = document.getElementById("error");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username === "admin" && password === "12345") {
            localStorage.setItem("userName", "Admin");
            localStorage.setItem("sessionToken", "mock-admin-token");

            window.location.href = "welcomepage.html";
        } else {
            errorDisplay.style.color = "red";
            errorDisplay.textContent = "Invalid credentials";
        }
    });
};
