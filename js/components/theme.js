export function initThemeSwitcher() {
    const buttons = document.querySelectorAll('.theme-switcher__button');
    const html = document.documentElement;

    if (buttons.length === 0) return;
    if (localStorage.getItem('theme') === 'dark') {
        html.setAttribute('theme', 'dark');
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const isDark = html.hasAttribute('theme');
            if (isDark) {
                html.removeAttribute('theme');
            } else {
                html.setAttribute('theme', 'dark');
            }
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    });
}