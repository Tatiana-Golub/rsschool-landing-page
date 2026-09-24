const PRODUCTS_URL = './data/products.json';

const VISIBLE_COUNT = { wide: 8, narrow: 4 };
const wideQuery = window.matchMedia('(min-width: 768px)');

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    if (text) element.textContent = text;
    return element;
}

function createCard(product, number) {
    const card = createElement('article', 'menu-card');

    const image = createElement('img', 'menu-card__image');
    image.src = product.image ?? `./assets/images/${product.category}-${number}.png`;
    image.alt = product.name;

    const info = createElement('div', 'menu-card__info');
    info.append(
        createElement('h2', 'menu-card__title', product.name),
        createElement('p', 'menu-card__description', product.description)
    );

    const content = createElement('div', 'menu-card__content');
    content.append(
        info,
        createElement('p', 'menu-card__price', `$${Number(product.price).toFixed(2)}`)
    );

    card.append(image, content);
    return card;
}

export async function initMenuCatalog() {
    const grid = document.querySelector('.menu__grid');
    const moreButton = document.querySelector('.menu__more');
    const categoryButtons = [...document.querySelectorAll('.category-button')];

    if (!grid || !moreButton || categoryButtons.length === 0) return;

    let products;

    try {
        const response = await fetch(PRODUCTS_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        products = await response.json();
    } catch (error) {
        console.error('Failed to load products:', error);
        grid.textContent = 'Failed to load the menu. Please try again later.';
        return;
    }

    let category = categoryButtons[0].dataset.category;
    let expanded = false;

    function getLimit() {
        return wideQuery.matches ? VISIBLE_COUNT.wide : VISIBLE_COUNT.narrow;
    }

    function render() {
        const items = products.filter((product) => product.category === category);
        const shown = expanded ? items : items.slice(0, getLimit());

        grid.replaceChildren(...shown.map((product, i) => createCard(product, i + 1)));
        moreButton.hidden = shown.length >= items.length;
    }

    function setCategory(name) {
        category = name;
        expanded = false; 

        categoryButtons.forEach((button) => {
            const isActive = button.dataset.category === name;
            button.classList.toggle('category-button--active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        render();
    }

    categoryButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.category !== category) setCategory(button.dataset.category);
        });
    });

    moreButton.addEventListener('click', () => {
        expanded = true;
        render(); 
    });

    wideQuery.addEventListener('change', () => {
        expanded = false;
        render();
    });

    setCategory(category);
}