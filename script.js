document.addEventListener('DOMContentLoaded', () => {
    const aboutTab = document.querySelector('.about-tab');
    const abilitiesTab = document.querySelector('.abilities-tab');
    const workTab = document.querySelector('.work-tab');
    const contactTab = document.querySelector('.contact-tab');

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedMode = localStorage.getItem('dark-mode');

    let activeColor;
    let inactiveColor;

    if (savedMode === 'true') {
        applyDarkMode();
    } else if (savedMode === 'false') {
        applyLightMode();
    } else if (prefersDarkScheme) {
        applyDarkMode();
    } else {
        applyLightMode();
    }

    function applyDarkMode() {
        activeColor = '#181818';
        inactiveColor = '#2a2a2a';
    }
    
    function applyLightMode() {
        activeColor = '#e9e9e9';
        inactiveColor = '#c4c4c4';
    }

    const updateTabColors = () => {
        const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        aboutTab.style.backgroundColor = inactiveColor;
        abilitiesTab.style.backgroundColor = inactiveColor;
        workTab.style.backgroundColor = inactiveColor;
        contactTab.style.backgroundColor = inactiveColor;

        if (scrollPercentage >= 0 && scrollPercentage < 23) {
            aboutTab.style.backgroundColor = activeColor;
        } else if (scrollPercentage >= 23 && scrollPercentage < 46) {
            abilitiesTab.style.backgroundColor = activeColor;
        } else if (scrollPercentage >= 46 && scrollPercentage < 69) {
            workTab.style.backgroundColor = activeColor;
        } else if (scrollPercentage >= 69 && scrollPercentage <= 100) {
            contactTab.style.backgroundColor = activeColor;
        }
    };

    updateTabColors();
    window.addEventListener('scroll', updateTabColors);
});
