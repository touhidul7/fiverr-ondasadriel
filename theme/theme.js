/* 
    -to use the dark theme in a section just add the id name to the element "theme"
    -the default dark theme style is given at the theme.css

    -to add custom styles for theme to any section just folow this stracture:

        .parentclass .dark-mode{
            --add styles here--
        }


*/



document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkModeToggle');
    const thmeitem = document.getElementById('theme');

    // Load user preference from localStorage
    const savedMode = localStorage.getItem('dark-mode') === 'true';
    if (savedMode) {
        thmeitem.classList.add('dark-mode');
        toggle.checked = true;
    }

    // Toggle dark mode
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            thmeitem.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'true');
        } else {
            thmeitem.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'false');
        }
    });
});