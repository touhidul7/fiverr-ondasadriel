document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkModeToggle');

    // Load user preference from localStorage
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    if (savedMode) {
        applyDarkMode();
        toggle.checked = true;
    } else {
        applyLightMode(); // Ensure light mode is applied if not dark mode
    }

    // Toggle dark mode
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            applyDarkMode();
            localStorage.setItem('dark-mode', 'true');
        } else {
            applyLightMode();
            localStorage.setItem('dark-mode', 'false');
        }
    });

    function applyDarkMode() {
        document.documentElement.style.setProperty('--color_about', '#161d08');
        document.documentElement.style.setProperty('--color_abilities', '#2d500b');
        document.documentElement.style.setProperty('--color_work', '#41740f');
        document.documentElement.style.setProperty('--color_contact', '#61861b');
        document.documentElement.style.setProperty('--color_text', '#ecf87f');
        document.documentElement.style.setProperty('--color_link', '#99ffa0');
    }
    
    // Function to apply light mode
    function applyLightMode() {
        document.documentElement.style.setProperty('--color_about', '#ecf87f');
        document.documentElement.style.setProperty('--color_abilities', '#bce078');
        document.documentElement.style.setProperty('--color_work', '#98d15f');
        document.documentElement.style.setProperty('--color_contact', '#7bb145');
        document.documentElement.style.setProperty('--color_text', '#161d08');
        document.documentElement.style.setProperty('--color_link', '#0a6b1c');
    }
});
