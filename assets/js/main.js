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

// Vídeo da abertura: respeita "reduzir movimento" e pausa quando sai da tela.
(function () {
  var v = document.querySelector('.hero-video');
  if (!v) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { v.removeAttribute('autoplay'); v.pause(); return; }
  var p = v.play && v.play(); if (p && p.catch) p.catch(function () {});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { var q = v.play(); if (q && q.catch) q.catch(function () {}); } else { v.pause(); } });
    }, { threshold: 0.1 }).observe(v);
  }
})();
