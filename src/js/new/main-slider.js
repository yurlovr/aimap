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
  const sliderEl = document.querySelector('.slider-people__slider');
  if (!sliderEl) return;

  const isTouch = window.matchMedia('(hover: none)').matches;
  if (!isTouch) return; // на десктопе не вмешиваемся

  let tapTimer;

  const clearTapped = () => {
    clearTimeout(tapTimer);
    sliderEl.querySelectorAll('.swiper-slide.is-tapped')
      .forEach(el => el.classList.remove('is-tapped'));
  };

  sliderEl.addEventListener('touchstart', (e) => {
    const slide = e.target.closest('.swiper-slide');
    if (!slide) return;

    // реагируем только на активный слайд
    if (!slide.classList.contains('swiper-slide-active')) return;

    clearTapped();
    slide.classList.add('is-tapped');

    // снимаем подсветку через 300 мс
    tapTimer = setTimeout(clearTapped, 500);
  }, { passive: true });

  // снимаем подсветку при свайпе / смене слайда
  if (window.Swiper && sliderEl.swiper) {
    sliderEl.swiper.on('slideChangeTransitionStart', clearTapped);
  }

  // снимаем при тапе вне слайдера
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.slider-people__slider')) clearTapped();
  }, { passive: true, capture: true });
});