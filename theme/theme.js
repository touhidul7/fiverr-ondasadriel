
/* Theme Button Function ////////////////////////////////////// */

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkModeToggle');

    // Check for user's device preference and apply theme accordingly
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedMode = localStorage.getItem('dark-mode');

    if (savedMode === 'true') {
        applyDarkMode();
        toggle.checked = true;
    } else if (savedMode === 'false') {
        applyLightMode();
        toggle.checked = false;
    } else if (prefersDarkScheme) {  // If there's no saved mode, use device preference
        applyDarkMode();
        toggle.checked = true;
    } else {
        applyLightMode();
        toggle.checked = false;
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
        document.documentElement.style.setProperty('--color_about', '#000000'); //('--color_about', '#161d08')
        document.documentElement.style.setProperty('--color_abilities', '#202020'); //('--color_abilities', '#2d500b')
        document.documentElement.style.setProperty('--color_work', '#000000'); //('--color_work', '#41740f')
        document.documentElement.style.setProperty('--color_contact', '#202020'); //('--color_contact', '#61861b')
        document.documentElement.style.setProperty('--color_text', '#ecf87f'); //('--color_text', '#ecf87f')
        document.documentElement.style.setProperty('--color_link', '#99ffa0'); //('--color_link', '#99ffa0')
    }
    
    function applyLightMode() {
        document.documentElement.style.setProperty('--color_about', '#ffffff'); //#ecf87f
        document.documentElement.style.setProperty('--color_abilities', '#dadada'); //#bce078
        document.documentElement.style.setProperty('--color_work', '#ffffff'); //#98d15f
        document.documentElement.style.setProperty('--color_contact', '#dadada'); //#7bb145
        document.documentElement.style.setProperty('--color_text', '#161d08'); //#161d08
        document.documentElement.style.setProperty('--color_link', '#0a6b1c'); //#0a6b1c
    }
});
