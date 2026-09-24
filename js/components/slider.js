export function initSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    const viewport = slider.querySelector('.slider__viewport');
    const track = slider.querySelector('.slider__track');
    const slides = [...slider.querySelectorAll('.slider__slide')];
    const dots = [...slider.querySelectorAll('.slider__dot')];
    const prevButton = slider.querySelector('.slider__button--prev');
    const nextButton = slider.querySelector('.slider__button--next');

    if (!track || slides.length === 0) return;

    let current = 0;

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.setProperty('--index', current);

        slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', String(i !== current));
        });

        dots.forEach((dot, i) => {
            const isActive = i === current;
            dot.classList.toggle('slider__dot--active', isActive);
            dot.setAttribute('aria-current', String(isActive));
        });
    }

    prevButton?.addEventListener('click', () => goTo(current - 1));
    nextButton?.addEventListener('click', () => goTo(current + 1));

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    let startX = 0;

    viewport.addEventListener('pointerdown', (e) => {
        startX = e.clientX;
    });

    viewport.addEventListener('pointerup', (e) => {
        const deltaX = e.clientX - startX;
        if (Math.abs(deltaX) > 50) {
            goTo(deltaX < 0 ? current + 1 : current - 1);
        }
    });

    goTo(0);
}