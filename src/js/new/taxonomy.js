document.addEventListener('DOMContentLoaded', () => {
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

  const icons = document.querySelectorAll('.taxonomy__icon[data-tooltip]');

  function measureTooltipWidth(icon) {
    const styles = getComputedStyle(icon, '::after');
    const probe = document.createElement('span');

    probe.textContent = icon.dataset.tooltip || '';
    probe.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: ${styles.whiteSpace};
      font-family: ${styles.fontFamily};
      font-size: ${styles.fontSize};
      line-height: ${styles.lineHeight};
      font-weight: ${styles.fontWeight};
      letter-spacing: ${styles.letterSpacing};
      padding: ${styles.padding};
      border: ${styles.border};
      box-sizing: ${styles.boxSizing};
    `;

    document.body.appendChild(probe);
    const width = probe.offsetWidth;
    document.body.removeChild(probe);
    return width;
  }

  function computeShift(icon, tooltipWidth) {
    const rect = icon.getBoundingClientRect();
    const iconCenter = rect.left + rect.width / 2;
    const half = tooltipWidth / 2;
    const edge = 8;

    let shift = 0;

    if (iconCenter - half < edge) {
      shift = edge - (iconCenter - half);
    } else if (iconCenter + half > window.innerWidth - edge) {
      shift = (window.innerWidth - edge) - (iconCenter + half);
    }

    return shift;
  }

  function openTooltip(icon) {
    icon.classList.add('_tooltip-open');

    requestAnimationFrame(() => {
      if (!isMobile()) {
        icon.style.setProperty('--tooltip-shift', '0px');
        return;
      }
      const width = measureTooltipWidth(icon);
      const shift = computeShift(icon, width);
      icon.style.setProperty('--tooltip-shift', `${shift}px`);
    });

    clearTimeout(icon._tooltipTimer);
    icon._tooltipTimer = setTimeout(() => closeTooltip(icon), 5000);
  }

  function closeTooltip(icon) {
    icon.classList.remove('_tooltip-open');
    icon.style.removeProperty('--tooltip-shift');
    clearTimeout(icon._tooltipTimer);
  }

  function closeAllTooltips() {
    document.querySelectorAll('.taxonomy__icon._tooltip-open')
      .forEach(closeTooltip);
  }

  icons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();

      if (icon.classList.contains('_tooltip-open')) {
        closeTooltip(icon);
        return;
      }

      closeAllTooltips();
      openTooltip(icon);
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.taxonomy__icon')) {
      closeAllTooltips();
    }
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.taxonomy__icon._tooltip-open').forEach(icon => {
        const width = measureTooltipWidth(icon);
        const shift = computeShift(icon, width);
        icon.style.setProperty('--tooltip-shift', `${shift}px`);
      });
    }, 100);
  }, { passive: true });
});