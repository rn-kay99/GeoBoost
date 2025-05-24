// Theme Switcher
function setupThemeSwitcher() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply initial theme
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.classList.add('light-mode');
        loadCorrectImage();
    }

    // Preload images on hover
    themeToggle.addEventListener('mouseenter', preloadOppositeThemeImage, { once: true });

    // Add click event listener
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        loadCorrectImage();
    });

    // Watch for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('light-mode', !e.matches);
            loadCorrectImage();
        }
    });
}

function preloadOppositeThemeImage() {
    const bgImage = document.querySelector('.blog-bg-image');
    if (!bgImage) return;

    const isLightMode = document.body.classList.contains('light-mode');
    const lightSrc = bgImage.dataset.lightSrc;
    const darkSrc = '/images/blog_background_dark.png';

    // Preload the opposite image
    const preloadImage = new Image();
    preloadImage.src = isLightMode ? darkSrc : lightSrc;
}

function loadCorrectImage() {
    const bgImage = document.querySelector('.blog-bg-image');
    if (!bgImage) return;

    const isLightMode = document.body.classList.contains('light-mode');
    const lightSrc = bgImage.dataset.lightSrc;

    if (isLightMode && lightSrc) {
        // Switch to light image if in light mode
        if (!bgImage.src.includes('blog_background_light.png')) {
            bgImage.src = lightSrc;
        }
    } else {
        // Switch to dark image if in dark mode
        if (!bgImage.src.includes('blog_background_dark.png')) {
            bgImage.src = '/images/blog_background_dark.png';
        }
    }
}

function init() {
    setupThemeSwitcher();
    loadCorrectImage(); // Ensure correct image is loaded on initial page load
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
