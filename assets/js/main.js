// Quem abre ou recarrega o site sempre começa na abertura (topo),
// mesmo vindo de um link com âncora (#depoimentos) ou com a rolagem salva pelo navegador.
// Os links do menu continuam levando para cada seção ao clicar.
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  function topo() {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    window.scrollTo(0, 0);
  }
  topo();
  window.addEventListener('load', topo);
  window.addEventListener('pageshow', function (e) { if (e.persisted) window.scrollTo(0, 0); });
})();

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

// Vídeo da abertura: a foto (poster) aparece na hora e o vídeo só começa a baixar
// depois que a página terminou de carregar. Respeita "reduzir movimento" e "economia de dados",
// e pausa quando sai da tela.
(function () {
  var v = document.querySelector('.hero-video');
  if (!v) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reduce || saveData) return;
  function tocar() { var q = v.play && v.play(); if (q && q.catch) q.catch(function () {}); }
  function carregar() {
    v.querySelectorAll('source[data-src]').forEach(function (s) { s.src = s.getAttribute('data-src'); });
    v.load();
    tocar();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) tocar(); else v.pause(); });
      }, { threshold: 0.1 }).observe(v);
    }
  }
  function depois() { (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(carregar, { timeout: 1500 }); }
  if (document.readyState === 'complete') depois(); else window.addEventListener('load', depois);
})();

// Efeito ao rolar: cada bloco sobe e aparece quando entra na tela (uma vez só).
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('js-reveal')) return;
  if (!('IntersectionObserver' in window)) { root.classList.remove('js-reveal'); return; }
  var alvos = document.querySelectorAll([
    '.section-head', '.split-media', '.split-text', '.product', '.order-card',
    '.natal-mesa-text', '.natal-gallery li', '.menu-columns', '.menu-full',
    '.quotes li', '.info-block', '.site-footer .container'
  ].join(','));
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('is-in');
      io.unobserve(el);
      // Depois da animação, devolve o bloco ao normal (para o efeito de passar o mouse continuar funcionando).
      el.addEventListener('transitionend', function fim(ev) {
        if (ev.target !== el || ev.propertyName !== 'transform') return;
        el.removeEventListener('transitionend', fim);
        el.classList.remove('reveal', 'is-in');
        el.style.removeProperty('--reveal-delay');
      });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  alvos.forEach(function (el) {
    var irmaos = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--reveal-delay', (irmaos % 4) * 0.08 + 's');
    el.classList.add('reveal');
    io.observe(el);
  });
})();
