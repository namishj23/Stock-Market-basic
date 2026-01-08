document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const content = document.getElementById('content');

    // Save HOME content once
    const homeHTML = content.innerHTML;

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const page = this.dataset.page;

            // 🟢 HOME → restore content (NO FETCH)
            if (page === "home") {
                content.innerHTML = homeHTML;
                initLiveBadge();
                return;
            }

            // 🟢 LEADERBOARD → fetch file
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

    initLiveBadge();

    function initLiveBadge() {
        const badge = document.querySelector('.live-badge span');
        if (!badge) return;

        setInterval(() => {
            badge.style.opacity = badge.style.opacity === '0' ? '1' : '0';
        }, 800);
    }
});
