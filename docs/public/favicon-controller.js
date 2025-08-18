// Favicon controller for theme switching
(function() {
  'use strict';

  const icons = {
    light: '/logo.svg',
    dark: '/logo-dark.svg'
  };

  function getTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setFavicon(theme) {
    // Remove only SVG favicons, keep PNG and ICO fallbacks
    const existingSvg = document.querySelectorAll('link[rel="icon"][type="image/svg+xml"]');
    existingSvg.forEach(el => el.remove());

    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = icons[theme];
    document.head.appendChild(link);
  }

  function init() {
    // Hide className-based favicons
    document.querySelectorAll('.favicon-light, .favicon-dark').forEach(el => {
      el.style.display = 'none';
    });

    setFavicon(getTheme());

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      setFavicon(getTheme());
    });
  }

  if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
