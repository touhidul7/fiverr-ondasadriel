
/* Active tab function------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const aboutTab = document.querySelector('.about-tab');
    const abilitiesTab = document.querySelector('.abilities-tab');
    const workTab = document.querySelector('.work-tab');
    const contactTab = document.querySelector('.contact-tab');

    const activeColor = '#10b72e';
    const inactiveColor = '#0a6b1c';

    // Function to update tab colors based on scroll percentage
    const updateTabColors = () => {
        const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        // Reset all tabs to the inactive color
        aboutTab.style.backgroundColor = inactiveColor;
        abilitiesTab.style.backgroundColor = inactiveColor;
        workTab.style.backgroundColor = inactiveColor;
        contactTab.style.backgroundColor = inactiveColor;

        // Activate the appropriate tab based on scroll percentage
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

    // Run the function initially to set the correct color on page load
    updateTabColors();

    // Update tab colors on scroll
    window.addEventListener('scroll', updateTabColors);
});
