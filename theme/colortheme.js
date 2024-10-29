document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Load user preference from localStorage
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    if (savedMode) {
        body.classList.add('dark-mode');
        /* Select Elements and add dark-mode class to enable darkmode here ////////*/

        toggle.checked = true;
    }

    // Toggle dark mode
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            body.classList.add('dark-mode');
        /* Select Elements and add dark-mode class to enable darkmode here ///////////*/

            localStorage.setItem('dark-mode', 'true');
        } else {
            body.classList.remove('dark-mode');
        /* Select Elements and remove dark-mode class to disable darkmode here //////////*/

            localStorage.setItem('dark-mode', 'false');
        }
    });
});