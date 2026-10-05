import { initBurgerMenu } from './components/burgerMenu.js';
import { initThemeSwitcher } from './components/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initBurgerMenu();
});