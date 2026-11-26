// Gera o site da HOMEMADE a partir do template e dos textos em content/*.json.
//
// Uso:  node build/build.mjs            -> gera a pasta public/ (o que a Vercel publica)
//       node build/build.mjs --preview  -> também gera dist/preview-*.html (arquivo único, para pré-visualizar)
//
// Os textos, preços, fotos e links são editados pelo painel em /admin, que grava em content/*.json.
// Não coloque conteúdo fixo aqui: tudo que a dona pode mudar vem dos arquivos JSON.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public');
const SITE_URL = 'https://homemadedoces.vercel.app/'; // trocar quando houver domínio próprio

const ler = (nome) => JSON.parse(fs.readFileSync(path.join(ROOT, 'content', `${nome}.json`), 'utf8'));
const C = {
  inicio: ler('inicio'), contato: ler('contato'), cardapio: ler('cardapio'), natal: ler('natal'),
  encomendas: ler('encomendas'), sobre: ler('sobre'), depoimentos: ler('depoimentos'), entrega: ler('entrega'),
};

// ---------- utilitários ----------
const e = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const tem = (s) => String(s ?? '').trim() !== '';
const lista = (a) => (Array.isArray(a) ? a : []);
const ativo = (v) => v !== false; // campo ausente conta como ligado
const titulo = (t, it) => `${e(t)}${tem(it) ? ` <em>${e(it)}</em>` : ''}`;
const lead = (t) => (tem(t) ? `<p class="lead">${e(t)}</p>` : '');
const paragrafo = (t) => (tem(t) ? `<p>${e(t)}</p>` : '');
const urlQuery = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`).replace(/%20/g, '+');
// Versão curta do conteúdo: muda o link quando o arquivo muda, e o navegador baixa de novo.
const versao = (txt) => crypto.createHash('sha256').update(txt).digest('hex').slice(0, 8);
const caminhoFoto = (f) => String(f || '').replace(/^\/+/, '');

const CHEVRON = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
  + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
const ICONE_WHATS = (n) => `<svg aria-hidden="true" width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-4.95A9 9 0 1 1 8 19.6L3 21z"/></svg>`;
const ESTRELA = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';

// ---------- links ----------
const K = C.contato;
const LINK = {
  pedido: K.instadelivery,
  ifood: K.ifood,
  instagram: K.instagram,
  whatsapp: tem(K.whatsapp_numero)
    ? `https://api.whatsapp.com/send/?phone=${String(K.whatsapp_numero).replace(/\D/g, '')}`
      + `${tem(K.whatsapp_mensagem) ? `&text=${urlQuery(K.whatsapp_mensagem)}` : ''}&type=phone_number&app_absent=0`
    : '',
};
const ext = (href) => `href="${e(href)}" target="_blank" rel="noopener"`;
const CIDADE = `${K.cidade}${tem(K.estado) ? `–${K.estado}` : ''}`;

function botoesGrandes(sufixo, iconeWhats) {
  const b = [];
  if (tem(LINK.pedido)) b.push(`<a class="btn btn-lg btn-light" ${ext(LINK.pedido)} data-track="pedido-${sufixo}">Fazer pedido</a>`);
  if (tem(LINK.ifood)) b.push(`<a class="btn btn-lg btn-ghost" ${ext(LINK.ifood)} data-track="ifood-${sufixo}">Pedir no iFood</a>`);
  if (tem(LINK.whatsapp)) b.push(`<a class="btn btn-lg btn-ghost" ${ext(LINK.whatsapp)} data-track="whatsapp-${sufixo}">${iconeWhats ? `\n          ${ICONE_WHATS(20)}\n          ` : ''}Encomendar no WhatsApp</a>`);
  return `<div class="hero-actions">\n        ${b.join('\n        ')}\n      </div>`;
}

// ---------- fotos e produtos ----------
function img(foto, alt, classe) {
  return `<img${classe ? ` class="${classe}"` : ''} src="${e(caminhoFoto(foto))}" width="640" height="800" loading="lazy" decoding="async" alt="${e(alt)}">`;
}
const fotoOuEspaco = (p) => (tem(p.foto) ? img(p.foto, p.foto_alt || p.nome) : `<div class="ph"><span>[FOTO: ${e(p.nome)}]</span></div>`);
const preco = (p) => (tem(p.preco) ? `<p class="price">R$ ${e(p.preco)}</p>` : '');

const ICONE_WHATS_PEQ = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
  + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>';
// Link do WhatsApp com mensagem pronta citando o produto ({produto} no texto do painel vira o nome).
function whatsappProduto(nome) {
  if (!tem(K.whatsapp_numero)) return '';
  const modelo = tem(K.whatsapp_mensagem_produto) ? K.whatsapp_mensagem_produto : 'Olá! Vim pelo site da Homemade e quero encomendar: {produto}.';
  return `https://api.whatsapp.com/send/?phone=${String(K.whatsapp_numero).replace(/\D/g, '')}`
    + `&text=${urlQuery(modelo.replaceAll('{produto}', nome))}&type=phone_number&app_absent=0`;
}

function card(p) {
  const selo = tem(p.selo) ? `<span class="tag">${e(p.selo)}</span>` : '';
  const corpo = `${fotoOuEspaco(p)}<div class="product-body">${selo}<h3>${e(p.nome)}</h3>${paragrafo(p.descricao)}${preco(p)}`;
  const link = whatsappProduto(p.nome);
  if (!link) return `<li class="product">${corpo}</div></li>`;
  const rotulo = `Pedir ${p.nome} pelo WhatsApp${tem(p.preco) ? `, R$ ${p.preco}` : ''}`;
  return `<li class="product"><a class="product-link" ${ext(link)} data-track="whatsapp-produto" aria-label="${e(rotulo)}">${corpo}`
    + `<span class="product-cta">${ICONE_WHATS_PEQ}<span>Pedir<span class="cta-long"> pelo WhatsApp</span></span></span></div></a></li>`;
}
const visiveis = (itens) => lista(itens).filter((p) => ativo(p.disponivel) && tem(p.nome));
const vitrine = (itens) => visiveis(itens).filter((p) => p.destaque).map(card).join('\n        ');

function categoria(nome, intro, itens, aberta) {
  const vis = visiveis(itens);
  if (!vis.length) return '';
  const li = vis.map((p) => `<li><h4>${e(p.nome)}</h4>${preco(p)}${paragrafo(p.descricao)}</li>`).join('');
  const n = vis.length;
  return `<details class="menu-cat"${aberta ? ' open' : ''}><summary>${e(nome)}`
    + `<span class="count">${n} ${n === 1 ? 'item' : 'itens'}</span>${CHEVRON}</summary>`
    + `${tem(intro) ? `<p class="cat-intro">${e(intro)}</p>` : ''}<ul class="menu-list">${li}</ul></details>`;
}

// ---------- seções ----------
function secaoNatal() {
  const N = C.natal;
  const galeria = lista(N.galeria).filter((g) => tem(g.foto)).map((g) => `<li>${img(g.foto, g.foto_alt)}</li>`).join('');
  const whats = tem(LINK.whatsapp) && tem(N.mesa_botao) ? `\n          <a class="btn btn-ghost" ${ext(LINK.whatsapp)}>${e(N.mesa_botao)}</a>` : '';
  const mesa = (tem(N.mesa_titulo) || galeria)
    ? `
      <div class="natal-mesa">
        <div class="natal-mesa-text">
          <h3>${titulo(N.mesa_titulo, N.mesa_titulo_italico)}</h3>
          ${paragrafo(N.mesa_texto)}${whats}
        </div>
        <ul class="natal-gallery">
          ${galeria}
        </ul>
      </div>` : '';
  return `<section class="section section-natal" id="natal" aria-labelledby="natal-title">
    <div class="container">
      <div class="section-head">
        <div>
          <p class="kicker">${e(N.kicker)}</p>
          <h2 id="natal-title">${titulo(N.titulo, N.titulo_italico)}</h2>
        </div>
        ${lead(N.texto)}
      </div>
      <ul class="product-grid">
        ${vitrine(N.itens)}
      </ul>${mesa}
      <div class="menu-full">
        ${categoria(N.nome_no_cardapio || N.kicker, N.intro_no_cardapio, N.itens, true)}
      </div>
    </div>
  </section>`;
}

function encomendas() {
  return lista(C.encomendas.itens).filter((p) => tem(p.nome)).map((p) => `<li class="order-card">${fotoOuEspaco(p)}<div class="order-body">`
    + `<h3>${e(p.nome)}</h3>${paragrafo(p.descricao)}`
    + `${tem(LINK.whatsapp) ? `<a class="text-link" ${ext(LINK.whatsapp)}>Encomendar pelo WhatsApp</a>` : ''}</div></li>`).join('\n        ');
}

function secaoDepoimentos() {
  const D = C.depoimentos;
  const itens = lista(D.itens).filter((d) => tem(d.texto));
  if (!ativo(D.mostrar) || !itens.length) return '';
  const aspas = (t) => (/^["“]/.test(t.trim()) ? e(t.trim()) : `“${e(t.trim())}”`);
  return `<section class="section section-alt" id="depoimentos" aria-labelledby="depoimentos-title">
    <div class="container">
      <div class="section-head">
        <div>
          <p class="kicker">${e(D.kicker)}</p>
          <h2 id="depoimentos-title">${titulo(D.titulo, D.titulo_italico)}</h2>
        </div>
        ${lead(D.texto)}
      </div>
      <ul class="quotes">
        ${itens.map((d) => `<li><blockquote>${aspas(d.texto)}</blockquote>${paragrafo(d.nome)}</li>`).join('\n        ')}
      </ul>
    </div>
  </section>`;
}

// ---------- horários ----------
const DIAS = [
  ['seg', 'Seg', 'Segunda', 'Monday'], ['ter', 'ter', 'Terça', 'Tuesday'], ['qua', 'qua', 'Quarta', 'Wednesday'],
  ['qui', 'qui', 'Quinta', 'Thursday'], ['sex', 'sex', 'Sexta', 'Friday'], ['sab', 'sáb', 'Sábado', 'Saturday'],
  ['dom', 'dom', 'Domingo', 'Sunday'],
];
const ordemDia = (id) => DIAS.findIndex((d) => d[0] === id);
const juntar = (partes) => (partes.length <= 1 ? partes.join('') : `${partes.slice(0, -1).join(', ')} e ${partes.at(-1)}`);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function nomeDias(ids, longo) {
  const ds = [...ids].sort((a, b) => ordemDia(a) - ordemDia(b)).map((id) => DIAS[ordemDia(id)]).filter(Boolean);
  if (longo || ds.length === 1) return cap(juntar(ds.map((d, i) => (i ? d[2].toLowerCase() : d[2]))));
  return cap(juntar(ds.map((d) => d[1].toLowerCase())));
}
const hora = (h) => { const [hh, mm] = String(h || '').split(':'); return `${Number(hh)}h${mm && mm !== '00' ? mm : ''}`; };
const horarios = lista(C.entrega.horarios).filter((h) => lista(h.dias).length && tem(h.abre) && tem(h.fecha));
function linhasHorario() {
  const abertos = new Set(horarios.flatMap((h) => h.dias));
  const fechados = DIAS.map((d) => d[0]).filter((d) => !abertos.has(d));
  const linhas = horarios.map((h) => `<tr><th scope="row">${e(nomeDias(h.dias))}</th><td>${e(`${hora(h.abre)} às ${hora(h.fecha)}`)}</td></tr>`);
  if (fechados.length) linhas.push(`<tr><th scope="row">${e(nomeDias(fechados, fechados.length <= 2))}</th><td>Fechado</td></tr>`);
  return linhas.join('\n              ');
}

// ---------- dados para o Google (SEO local) ----------
function jsonld() {
  const dados = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: 'HOMEMADE Confeitaria',
    slogan: `${C.inicio.titulo} ${C.inicio.titulo_italico}`.trim(),
    url: SITE_URL,
    telephone: tem(K.whatsapp_numero) ? `+${String(K.whatsapp_numero).replace(/\D/g, '')}` : undefined,
    image: `${SITE_URL}assets/img/og-homemade-2.jpg`,
    servesCuisine: 'Confeitaria',
    address: {
      '@type': 'PostalAddress', streetAddress: K.endereco_rua, addressLocality: K.cidade, addressRegion: K.estado, addressCountry: 'BR',
    },
    areaServed: `${K.cidade}, ${K.estado}`,
    openingHoursSpecification: horarios.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...h.dias].sort((a, b) => ordemDia(a) - ordemDia(b)).map((id) => DIAS[ordemDia(id)]?.[3]).filter(Boolean),
      opens: h.abre,
      closes: h.fecha,
    })),
    hasMenu: LINK.pedido || undefined,
    sameAs: [LINK.instagram, LINK.pedido, LINK.ifood].filter(tem),
  };
  return JSON.stringify(dados, null, 2).replace(/</g, '\\u003c');
}

// ---------- faixa animada ----------
const H_PATH = fs.readFileSync(path.join(ROOT, 'build', 'h_path.txt'), 'utf8').trim();
const H_SVG = '<svg class="marquee-h" viewBox="21.4 53.15 26 26" aria-hidden="true">'
  + '<circle cx="34.4" cy="66.15" r="13" fill="#BC6C50"/>'
  + `<g transform="translate(34.4 66.15) scale(.95) translate(-34.4 -66.15)"><path fill="#FFF6EA" d="${H_PATH}"/></g></svg>`;
const marquee = () => `<div class="marquee-group">${lista(C.inicio.faixa).filter(tem).map((i) => `<span class="marquee-item">${e(i)}</span>${H_SVG}`).join('')}</div>`;

// ---------- página ----------
function render(comNatal, { inline = false, soAbertura = false } = {}) {
  const I = C.inicio; const CA = C.cardapio; const S = C.sobre; const EN = C.entrega;
  const tpl = fs.readFileSync(path.join(ROOT, 'build', 'index.template.html'), 'utf8');
  const cssTxt = fs.readFileSync(path.join(ROOT, 'assets/css/styles.css'), 'utf8');
  const jsTxt = fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8');

  const cardapio = `<div class="menu-columns">${lista(CA.categorias).map((c) => categoria(c.nome, c.intro, c.itens)).join('')}</div>`;
  const botoesCardapio = [
    tem(LINK.pedido) ? `<a class="btn btn-lg btn-brand" ${ext(LINK.pedido)} data-track="pedido-cardapio">Fazer pedido no Instadelivery</a>` : '',
    tem(LINK.ifood) ? `<a class="btn btn-lg btn-outline" ${ext(LINK.ifood)} data-track="ifood-cardapio">Pedir no iFood</a>` : '',
  ].join('');
  const rodape = [
    tem(LINK.pedido) && `<a ${ext(LINK.pedido)}>Instadelivery</a>`,
    tem(LINK.whatsapp) && `<a ${ext(LINK.whatsapp)}>WhatsApp</a>`,
    tem(LINK.instagram) && `<a ${ext(LINK.instagram)}>Instagram${tem(K.instagram_usuario) ? ` ${e(K.instagram_usuario)}` : ''}</a>`,
    tem(LINK.ifood) && `<a ${ext(LINK.ifood)}>Também no iFood</a>`,
  ].filter(Boolean).join('\n      ');
  const barra = [
    tem(LINK.pedido) ? `<a class="btn btn-brand" ${ext(LINK.pedido)} data-track="pedido-barra">Fazer pedido</a>` : '',
    tem(LINK.whatsapp) ? `<a class="btn btn-outline btn-icon" ${ext(LINK.whatsapp)} aria-label="Encomendar no WhatsApp" data-track="whatsapp-barra">\n    ${ICONE_WHATS(22)}\n  </a>` : '',
  ].filter(Boolean).join('\n  ');
  const fatos = lista(I.fatos).filter((f) => tem(f.valor)).map((f) => `<li><strong>${e(f.valor)}${f.estrela ? ` ${ESTRELA}` : ''}</strong><span>${e(f.texto)}</span></li>`).join('\n        ');
  const enderecoMaps = `${K.endereco_rua} - ${K.endereco_bairro}, ${K.cidade} - ${K.estado}`;
  const lista_ = lista(S.diferenciais).filter(tem);

  const v = {
    CSS: inline ? `<style>${cssTxt.replaceAll('../video/', 'assets/video/')}</style>` : `<link rel="stylesheet" href="assets/css/styles.css?v=${versao(cssTxt)}">`,
    JS: inline ? `<script>${jsTxt}</script>` : `<script src="assets/js/main.js?v=${versao(jsTxt)}" defer></script>`,
    SITE_URL,
    SEO_TITULO: e(I.seo_titulo),
    SEO_DESCRICAO: e(I.seo_descricao),
    JSONLD: jsonld(),
    INSTADELIVERY: e(LINK.pedido),
    NATAL_NAV: comNatal ? '<a href="#natal">Natal</a>' : '',
    HERO_KICKER: e(I.kicker),
    HERO_TITULO: titulo(I.titulo, I.titulo_italico),
    HERO_SUBTITULO: e(I.subtitulo),
    HERO_BOTOES: botoesGrandes('hero', true),
    HERO_FATOS: fatos,
    MARQUEE: marquee(),
    CARDAPIO_KICKER: e(CA.kicker),
    CARDAPIO_TITULO: titulo(CA.titulo, CA.titulo_italico),
    CARDAPIO_TEXTO: lead(CA.texto),
    CARDAPIO: cardapio,
    CARDAPIO_BOTOES: botoesCardapio,
    NATAL_SECAO: comNatal ? secaoNatal() : '',
    ENCOMENDAS_KICKER: e(C.encomendas.kicker),
    ENCOMENDAS_TITULO: titulo(C.encomendas.titulo, C.encomendas.titulo_italico),
    ENCOMENDAS_TEXTO: lead(C.encomendas.texto),
    ENCOMENDA: encomendas(),
    PREPARO_FOTO: tem(S.foto) ? img(S.foto, S.foto_alt, 'split-media') : '<div class="ph ph-portrait split-media"><span>[FOTO DO PREPARO]</span></div>',
    PREPARO_KICKER: e(S.kicker),
    PREPARO_TITULO: titulo(S.titulo, S.titulo_italico),
    PREPARO_TEXTO: lead(S.texto),
    PREPARO_LISTA: lista_.length ? `<ul class="checks">\n          ${lista_.map((d) => `<li>${e(d)}</li>`).join('\n          ')}\n        </ul>` : '',
    DEPOIMENTOS_SECAO: secaoDepoimentos(),
    ENTREGA_KICKER: e(EN.kicker),
    ENTREGA_TITULO: titulo(EN.titulo, EN.titulo_italico),
    ENDERECO_RUA: e(K.endereco_rua),
    ENDERECO_BAIRRO: e(K.endereco_bairro),
    ENDERECO_CIDADE: e(CIDADE),
    MAPS: e(`https://www.google.com/maps/search/?api=1&query=${urlQuery(enderecoMaps)}`),
    RETIRADA_TEXTO: paragrafo(EN.retirada_texto),
    ENTREGA_TEXTO: [paragrafo(EN.entrega_texto), paragrafo(EN.entrega_detalhes)].filter(Boolean).join('\n          '),
    HORARIOS: linhasHorario(),
    FECHAMENTO_TITULO: titulo(I.fechamento_titulo, I.fechamento_italico),
    FECHAMENTO_BOTOES: botoesGrandes('final', false),
    RODAPE_LINKS: rodape,
    ANO: String(new Date().getFullYear()),
    BARRA: barra,
  };
  let out = tpl.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => {
    if (!(k in v)) throw new Error(`espaço sem conteúdo no template: ${m}`);
    return v[k];
  });

  if (inline) {
    for (const arq of ['logo-homemade-branco.svg', 'favicon.svg']) {
      out = out.replaceAll(`assets/img/${arq}`, `data:image/svg+xml;base64,${fs.readFileSync(path.join(ROOT, 'assets/img', arq)).toString('base64')}`);
    }
    for (const arq of ['favicon-32.png', 'apple-touch-icon.png']) {
      out = out.replaceAll(`assets/img/${arq}`, `data:image/png;base64,${fs.readFileSync(path.join(ROOT, 'assets/img', arq)).toString('base64')}`);
    }
  }
  if (soAbertura) {
    out = out.slice(0, out.indexOf('<!-- HERO_END -->')) + out.slice(out.indexOf('</main>'));
    out = out.slice(0, out.indexOf('<footer')) + out.slice(out.indexOf('</footer>') + '</footer>'.length);
  }
  return out;
}

// ---------- saída ----------
function copiar(de, para) {
  const origem = path.join(ROOT, de);
  if (fs.existsSync(origem)) fs.cpSync(origem, path.join(OUT, para ?? de), { recursive: true });
}

const comNatal = ativo(C.natal.ativo);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), render(comNatal));
fs.writeFileSync(path.join(OUT, 'sem-natal.html'), render(false)); // prévia da página sem a seção de Natal
copiar('assets');
copiar('admin');
copiar('robots.txt');
const hoje = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}</loc><lastmod>${hoje}</lastmod></url>
</urlset>
`);

if (process.argv.includes('--preview')) {
  const dist = path.join(ROOT, 'dist');
  fs.mkdirSync(dist, { recursive: true });
  fs.writeFileSync(path.join(dist, 'preview-com-natal.html'), render(true, { inline: true }));
  fs.writeFileSync(path.join(dist, 'preview-sem-natal.html'), render(false, { inline: true }));
  fs.writeFileSync(path.join(dist, 'preview-abertura.html'), render(true, { inline: true, soAbertura: true }));
}
console.log(`ok: public/ gerado (${comNatal ? 'com' : 'sem'} a seção de Natal)`);
