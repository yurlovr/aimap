document.addEventListener('DOMContentLoaded', function () {

  const BREAKPOINTS = {
    768: {
      spaceBetween: 20,
      coverflowEffect: { rotate: 40, stretch: 10, depth: 250, scale: 0.92, slideShadows: false },
    },
    1024: {
      spaceBetween: 32,
      coverflowEffect: { rotate: 36, stretch: 0, depth: 300, scale: 1, slideShadows: false },
    },
    1280: {
      spaceBetween: 48,
      coverflowEffect: { rotate: 32, stretch: 0, depth: 300, scale: 1, slideShadows: false },
    },
    1500: {
      spaceBetween: 48,
      coverflowEffect: { rotate: 35, stretch: 0, depth: 300, scale: 1, slideShadows: false },
    },
    1920: {
      spaceBetween: 48,
      coverflowEffect: { rotate: 40, stretch: 0, depth: 300, scale: 1, slideShadows: false },
    },
  };

  function initSlider(root) {
    const swiperEl = root.querySelector('.slider-people__slider');
    if (!swiperEl) return;

    const wrapper = swiperEl.querySelector('.swiper-wrapper');
    if (!wrapper) return;

    const slides = Array.from(wrapper.children);
    slides.forEach(s => wrapper.appendChild(s.cloneNode(true)));
    slides.forEach(s => wrapper.appendChild(s.cloneNode(true)));

    const nextEl = root.querySelector('.slider-navigation__next');
    const prevEl = root.querySelector('.slider-navigation__prev');

    new Swiper(swiperEl, {
      centeredSlides: true,
      speed: 600,
      grabCursor: true,
      effect: 'coverflow',
      initialSlide: 5,
      loop: true,
      navigation: {
        nextEl: nextEl,
        prevEl: prevEl,
        disabledClass: 'swiper-button-disabled',
      },
      keyboard: { enabled: true, onlyInViewport: true },
      slidesPerView: 'auto',
      spaceBetween: 16,
      coverflowEffect: { rotate: 30, stretch: 0, depth: 200, scale: 0.95, slideShadows: false },
      breakpoints: BREAKPOINTS,
    });
  }

  document.querySelectorAll('.slider').forEach(initSlider);

});

document.addEventListener('DOMContentLoaded', function () {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) return;

  const sliders = document.querySelectorAll('.slider-people__slider');
  if (!sliders.length) return;

  const TAP_DURATION = 400;

  const clearMap = new WeakMap();

  sliders.forEach((sliderEl) => {
    let tapTimer;

    const clearTapped = () => {
      clearTimeout(tapTimer);
      sliderEl.querySelectorAll('.swiper-slide.is-tapped')
        .forEach(el => el.classList.remove('is-tapped'));
    };

    clearMap.set(sliderEl, clearTapped);

    sliderEl.addEventListener('touchstart', (e) => {
      const slide = e.target.closest('.swiper-slide');
      if (!slide) return;

      if (!slide.classList.contains('swiper-slide-active')) return;

      clearTapped();
      slide.classList.add('is-tapped');

      tapTimer = setTimeout(clearTapped, TAP_DURATION);
    }, { passive: true });

    if (window.Swiper && sliderEl.swiper) {
      sliderEl.swiper.on('slideChangeTransitionStart', clearTapped);
    }
  });

  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.slider-people__slider')) return;
    clearMap.forEach((clearTapped) => clearTapped());
  }, { passive: true, capture: true });
});