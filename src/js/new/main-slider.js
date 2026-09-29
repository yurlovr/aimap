document.addEventListener('DOMContentLoaded', function () {

  function initSlider(root) {
    const swiperEl = root.querySelector('.slider-people__slider');
    if (!swiperEl) return;

    const wrapper = swiperEl.querySelector('.swiper-wrapper');
    if (!wrapper) return;

    // Ручное клонирование слайдов (2 копии)
    const slides = Array.from(wrapper.children);
    slides.forEach(s => wrapper.appendChild(s.cloneNode(true)));
    slides.forEach(s => wrapper.appendChild(s.cloneNode(true)));

    const nextEl = root.querySelector('.slider-navigation__next');
    const prevEl = root.querySelector('.slider-navigation__prev');

    // === Параметры под текущую ширину окна ===
    // Всегда slidesPerView: 'auto' — чтобы Swiper уважал CSS-ширину слайда
    // и peek соседних слайдов работал на всех разрешениях.
    function getParams() {
      const w = window.innerWidth;

      if (w < 768) {
        return {
          slidesPerView: 'auto',
          spaceBetween: 16,
          coverflowEffect: { rotate: 30, stretch: 0, depth: 200, scale: 0.95, slideShadows: false },
        };
      }
      if (w < 1024) {
        return {
          slidesPerView: 'auto',
          spaceBetween: 20,
          coverflowEffect: { rotate: 40, stretch: 10, depth: 250, scale: 0.92, slideShadows: false },
        };
      }
      if (w < 1280) {
        return {
          slidesPerView: 'auto',
          spaceBetween: 24,
          coverflowEffect: { rotate: 50, stretch: 20, depth: 300, scale: 0.9, slideShadows: false },
        };
      }
      if (w < 1440) {
        return {
          slidesPerView: 'auto',
          spaceBetween: 48,
          coverflowEffect: { rotate: 32, stretch: 0, depth: 300, scale: 1, slideShadows: false },
        };
      }
      if (w < 1920) {
        return {
          slidesPerView: 'auto',
          spaceBetween: 48,
          coverflowEffect: { rotate: 35, stretch: 0, depth: 300, scale: 1, slideShadows: false },
        };
      }
      return {
        slidesPerView: 'auto',
        spaceBetween: 48,
        coverflowEffect: { rotate: 40, stretch: 0, depth: 300, scale: 1, slideShadows: false },
      };
    }

    const baseParams = getParams();

    const swiper = new Swiper(swiperEl, {
      centeredSlides: true,
      speed: 600,
      grabCursor: true,
      effect: 'coverflow',
      initialSlide: 5,
      navigation: {
        nextEl: nextEl,
        prevEl: prevEl,
        disabledClass: 'swiper-button-disabled',
      },
      keyboard: { enabled: true, onlyInViewport: true },
      // observer / observeParents / resizeObserver НЕ включаем —
      // они конфликтуют с ручным resync
      ...baseParams,
    });

    // Контейнер, который скрываем на время пересчёта
    const viewport = swiperEl.closest('.carousel-viewport') || swiperEl;

    // === Полная синхронизация Swiper с текущим DOM/CSS ===
    function resync() {
      // 1. Скрываем viewport и отключаем transition,
      //    чтобы не было промежуточных кадров (мигания)
      viewport.style.visibility = 'hidden';
      swiper.wrapperEl.style.transitionDuration = '0ms';

      // 2. Применяем параметры под текущую ширину окна
      const p = getParams();
      swiper.params.slidesPerView = p.slidesPerView;
      swiper.params.spaceBetween = p.spaceBetween;

      if (swiper.params.coverflowEffect) {
        Object.assign(swiper.params.coverflowEffect, p.coverflowEffect);
      } else {
        swiper.params.coverflowEffect = { ...p.coverflowEffect };
      }

      // 3. Пересчитываем всё
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      swiper.slideTo(swiper.activeIndex, 0, false);

      // 4. В следующем кадре возвращаем видимость и transition
      requestAnimationFrame(() => {
        swiper.wrapperEl.style.transitionDuration = '';
        viewport.style.visibility = '';
      });
    }

    // === Реакция на смену брейкпоинта через matchMedia ===
    const breakpoints = [768, 1024, 1280, 1440, 1920];
    const mqls = breakpoints.map(bp => window.matchMedia(`(min-width: ${bp}px)`));

    let rafId = null;

    function scheduleResync() {
      if (rafId) cancelAnimationFrame(rafId);
      // Двойной rAF: гарантируем, что CSS-медиазапросы применились
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(resync);
      });
    }

    mqls.forEach(mql => {
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', scheduleResync);
      } else if (typeof mql.addListener === 'function') {
        mql.addListener(scheduleResync); // для старых Safari
      }
    });

    // === Страховка: resize-handler с debounce ===
    // На случай изменения ширины внутри одного брейкпоинта
    // (например, поворот экрана, изменение размера контейнера)
    let resizeTimer = null;
    let lastWidth = window.innerWidth;

    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        scheduleResync();
      }, 150);
    }, { passive: true });

    window.addEventListener('orientationchange', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(scheduleResync, 200);
    }, { passive: true });
  }

  document.querySelectorAll('.slider').forEach(initSlider);

});