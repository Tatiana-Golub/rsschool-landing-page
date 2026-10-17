let modal;

export function initProductModal() {
    modal = createModal();
    document.body.append(modal);
}

export function openProductModal(product, imageSrc) {
    if (!modal || !product) return;
    fillModalContent(product, imageSrc);
    modal.showModal();
}

function closeModal() {
    modal.close();
}

function createModal() {
    const dialog = document.createElement('dialog');
    dialog.className = 'product-modal';
    dialog.setAttribute('aria-labelledby', 'product-modal-title');

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) closeModal();
    });

    return dialog;
}

function fillModalContent(product, imageSrc) {
    [...modal.children].forEach((child) => {
        if (!child.classList.contains('product-modal__close')) child.remove();
    });

    let selectedSize = Object.keys(product.sizes)[0];
    let selectedAdditives = new Set();

    const body = document.createElement('div');
    body.className = 'product-modal__body';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'product-modal__image-wrapper';

    const image = document.createElement('img');
    image.className = 'product-modal__image';
    image.src = imageSrc;
    image.alt = product.name;
    imageWrapper.append(image);

    const info = document.createElement('div');
    info.className = 'product-modal__info';

    const header = document.createElement('div');
    header.className = 'product-modal__header';

    const title = document.createElement('h2');
    title.className = 'product-modal__title';
    title.id = 'product-modal-title';
    title.textContent = product.name;

    const description = document.createElement('p');
    description.className = 'product-modal__description';
    description.textContent = product.description;

    header.append(title, description);

    const sizeGroup = createOptionGroup('Size');
    const additivesGroup = createOptionGroup('Additives');

    const total = document.createElement('div');
    total.className = 'product-modal__total';

    const totalLabel = document.createElement('span');
    totalLabel.textContent = 'Total:';

    const priceValue = document.createElement('span');
    priceValue.className = 'product-modal__total-value';

    total.append(totalLabel, priceValue);

    const disclaimer = document.createElement('div');
    disclaimer.className = 'product-modal__disclaimer';

    const disclaimerIcon = document.createElement('span');
    disclaimerIcon.className = 'product-modal__disclaimer-icon';
    disclaimerIcon.innerHTML = `<svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="8"
            cy="8"
            r="6.67"
            stroke="currentColor"
            stroke-width="1"
        />
        <path
            d="M8 7V11"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
        />
        <circle
            cx="8"
            cy="5"
            r="0.5"
            fill="currentColor"
        />
    </svg>`;
    disclaimerIcon.setAttribute('aria-hidden', 'true');

    const disclaimerText = document.createElement('p');
    disclaimerText.className = 'product-modal__disclaimer-text';
    disclaimerText.textContent =
        'The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.';

    disclaimer.append(disclaimerIcon, disclaimerText);

    const closeButton = document.createElement('button');
    closeButton.className = 'product-modal__close';
    closeButton.type = 'button';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', closeModal);

    function updatePrice() {
        const base = Number(product.price);
        const sizeAdd = Number(product.sizes[selectedSize]['add-price']);
        const additivesAdd = [...selectedAdditives].reduce((sum, name) => {
            const additive = product.additives.find((a) => a.name === name);
            return sum + (additive ? Number(additive['add-price']) : 0);
        }, 0);
        priceValue.textContent = `$${(base + sizeAdd + additivesAdd).toFixed(2)}`;
    }

    function renderSizes() {
        sizeGroup.options.replaceChildren(
            ...Object.entries(product.sizes).map(([key, value]) =>
                createOptionButton({
                    label: value.size,
                    badge: key.toUpperCase(),
                    active: key === selectedSize,
                    onClick: () => {
                        selectedSize = key;
                        renderSizes();
                        updatePrice();
                    },
                })
            )
        );
    }

    function renderAdditives() {
        additivesGroup.options.replaceChildren(
            ...product.additives.map((additive, i) =>
                createOptionButton({
                    label: additive.name,
                    badge: String(i + 1),
                    active: selectedAdditives.has(additive.name),
                    onClick: () => {
                        selectedAdditives.has(additive.name)
                            ? selectedAdditives.delete(additive.name)
                            : selectedAdditives.add(additive.name);
                        renderAdditives();
                        updatePrice();
                    },
                })
            )
        );
    }

    renderSizes();
    renderAdditives();
    updatePrice();

    info.append(header, sizeGroup.wrapper, additivesGroup.wrapper, total, disclaimer, closeButton);
    body.append(imageWrapper, info);
    modal.append(body);
}

function createOptionGroup(labelText) {
    const wrapper = document.createElement('div');
    wrapper.className = 'product-modal__option-group';

    const label = document.createElement('p');
    label.className = 'product-modal__option-label';
    label.textContent = labelText;

    const options = document.createElement('div');
    options.className = 'product-modal__options';

    wrapper.append(label, options);
    return { wrapper, options };
}

function createOptionButton({ label, badge, active, onClick }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'product-modal__option';
    button.classList.toggle('product-modal__option--active', active);
    button.setAttribute('aria-pressed', String(active));

    const badgeEl = document.createElement('span');
    badgeEl.className = 'product-modal__option-badge';
    badgeEl.textContent = badge;

    const labelEl = document.createElement('span');
    labelEl.textContent = label;

    button.append(badgeEl, labelEl);
    button.addEventListener('click', onClick);
    return button;
}