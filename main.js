const themeButtons = document.querySelectorAll('.theme-switcher__button');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    html.setAttribute('theme', 'dark');
}

themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (html.hasAttribute('theme')) {
            html.removeAttribute('theme');
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});