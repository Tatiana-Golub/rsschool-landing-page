export function initBurgerMenu() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.navigation__list');

    if (!burger || !nav) return;

    const links = nav.querySelectorAll('.navigation__link');
    const desktopQuery = window.matchMedia('(min-width: 960px)');

    function setMenu(isOpen) {
        burger.classList.toggle('burger--active', isOpen);
        nav.classList.toggle('navigation__list--open', isOpen);
        document.body.classList.toggle('menu-open', isOpen);

        burger.setAttribute('aria-expanded', String(isOpen));
        burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    burger.addEventListener('click', () => {
        setMenu(!burger.classList.contains('burger--active'));
    });

    links.forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    desktopQuery.addEventListener('change', (e) => {
        if (e.matches) setMenu(false);
    });
}