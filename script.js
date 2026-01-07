document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. Button Action Example
    const startBtn = document.querySelector('.btn-primary');
    startBtn.addEventListener('click', () => {
        // In a real app, this would route to /predict or open a Login Modal
        alert("Redirecting to prediction window... (Available 9:00 - 9:30 AM IST)");
    });

    // 3. Simple animation for the "Live" badge
    const badge = document.querySelector('.live-badge span');
    setInterval(() => {
        badge.style.opacity = badge.style.opacity === '0' ? '1' : '0';
    }, 800);
});