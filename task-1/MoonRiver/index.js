// бургер клик var's
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const closeMenuButton = document.getElementById('close-menu');
const headerInner = document.querySelector('.header__inner');
const headerTop = document.querySelector('.header__top');
const navigation = document.getElementById('nav');
const categories = document.getElementById('categories');
const menuFooter = document.getElementById('menuFooter');

const animElements = [navigation, categories, menuFooter];
let isAnimating = false;

// линия для навигации при открытом меню
const items = document.querySelectorAll('.menu-open__item');

// slider
const track = document.querySelector('.slider__images');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.prev');
const dots = Array.from(document.querySelectorAll('.slider__dot'));

const pixelShift = 83.6;
let currentOffset = 0;


// функция, чтобы убрать все классы в навигации
function removeAllClass(a) {
    a.forEach(item => {
        item.classList.remove('menu-open__item--active');
    })
}

// функционал для клика по навигации, чтобы появилась линия 
items.forEach(item => {
    item.addEventListener("click", () => {
        if (!item.classList.contains('menu-open__item--active')) {
            removeAllClass(items);
            item.classList.add('menu-open__item--active');
        }
    });
});

// добавляем подсказку относительно позиции иконки(указателя)
document.addEventListener('DOMContentLoaded', function () {
    const markers = document.querySelectorAll('.location-marker');
    const mapContainer = document.querySelector('.find-bountique__map');

    markers.forEach(marker => {
        marker.addEventListener('mouseenter', function () {
            let tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = marker.dataset.tooltip;
            mapContainer.appendChild(tooltip);

            const rect = marker.getBoundingClientRect();
            const mapRect = mapContainer.getBoundingClientRect();

            tooltip.style.top = (rect.top - mapRect.top) + 'px';
            tooltip.style.left = (rect.left - mapRect.left + rect.width / 2) + 'px';
            tooltip.style.visibility = 'visible';
        });

        marker.addEventListener('mouseleave', function () {
            const tooltip = mapContainer.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {

    const openMenu = () => {
        if (isAnimating) return;
        isAnimating = true;

        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-active');

        setTimeout(() => {
            headerInner.classList.add('menu-open');
            headerTop.classList.add('menu-open');

            setTimeout(() => {
                menu.style.display = 'block';
                requestAnimationFrame(() => {
                    menu.classList.add('menu-open');
                });

                animElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('active');
                    }, 110 * index);
                });

                const firstFocusable = menu.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
                if (firstFocusable) {
                    firstFocusable.focus();
                }

                setTimeout(() => {
                    isAnimating = false;
                }, 500 + animElements.length * 100);
            }, 500);
        }, 500);
    };

    const closeMenu = () => {
        if (isAnimating) return;
        isAnimating = true;

        menu.classList.remove('menu-open');

        animElements.slice().reverse().forEach((el, index) => {
            setTimeout(() => {
                el.classList.remove('active');
            }, 100 * index);
        });

        setTimeout(() => {
            setTimeout(() => {
                menu.style.display = 'none';
                document.body.classList.remove('menu-active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');

                headerTop.classList.remove('menu-open');
                headerInner.classList.remove('menu-open');

                isAnimating = false;
            }, 500);
        }, animElements.length * 100);
    };

    const toggleMenu = () => {
        if (!document.body.classList.contains('menu-active')) {
            openMenu();
        } else {
            closeMenu();
        }
    };

    hamburger.addEventListener('click', toggleMenu);

    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', closeMenu);
    }
});


// функция перемещения слайдера 
function moveToPosition(offset) {
    currentOffset += offset;

    if (currentOffset > (slides.length - 1) * pixelShift) {
        currentOffset = 0;
    } else if (currentOffset < 0) {
        currentOffset = (slides.length - 1) * pixelShift;
    }

    track.style.transform = 'translateX(-' + currentOffset + 'px)';
    updateDots();
}

// обновляем точки 
function updateDots() {
    const newIndex = Math.floor(currentOffset / pixelShift) % slides.length;
    dots.forEach((dot, index) => {
        dot.classList.toggle('slider__dot--active', index === newIndex);
    });
}

// активация кнопки вправо
nextButton.addEventListener('click', () => {
    moveToPosition(pixelShift);
});

// активация кнопки влево
prevButton.addEventListener('click', () => {
    moveToPosition(-pixelShift);
});

// по нажатию на точку перемещаем слайдер
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentOffset = index * pixelShift;
        track.style.transform = 'translateX(-' + currentOffset + 'px)';
        updateDots();
    });
});

updateDots();