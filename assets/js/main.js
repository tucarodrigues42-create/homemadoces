// Cabeçalho fica sólido ao rolar; barra fixa aparece depois da abertura.
(function () {
  var header = document.querySelector('[data-header]');
  var bar = document.querySelector('.sticky-bar');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle('is-solid', y > 24);
    if (bar && hero) bar.classList.toggle('is-visible', y > hero.offsetHeight * 0.6);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
