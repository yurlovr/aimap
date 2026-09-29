document.addEventListener('DOMContentLoaded', function() {
  new Swiper('.related__slider', {
    slidesPerView: 1.1,
    spaceBetween: 16,
    speed: 500,
    grabCursor: true,
    watchOverflow: true,
    navigation: {
      nextEl: '[data-related-next]',
      prevEl: '[data-related-prev]',
    },
    breakpoints: {
      768:  { slidesPerView: 2, spaceBetween: 24 },
      1280: { slidesPerView: 3, spaceBetween: 24 },
    },
  });
});