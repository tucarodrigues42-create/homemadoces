"""Gera as páginas da HOMEMADE a partir do template e do cardápio.

Uso: python3 build/build.py
Saída:
  index.html          versão com a seção Natal 2026
  sem-natal.html      mesma página sem os produtos de Natal
  dist/preview-*.html arquivos únicos (CSS, JS e imagens embutidos) para pré-visualização
"""
import base64
import html
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "build"))
from produtos import CATEGORIAS, NATAL, ENCOMENDA, DESTAQUES, DESTAQUES_NATAL  # noqa: E402

SITE_URL = "https://[DOMINIO-A-DEFINIR]/"
WHATSAPP = ("https://api.whatsapp.com/send/?phone=5582999556652&amp;text=Ol%C3%A1%21+Vim+pelo+site+da+Homemade"
            "+e+quero+fazer+uma+encomenda.&amp;type=phone_number&amp;app_absent=0")
MARQUEE_ITENS = ["Bentô cake", "Bolos de festa", "Doces", "Cookies", "Cestas", "Feito em Arapiraca"]
CHEVRON = ('<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
           'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')

e = html.escape


def todos_itens(cats):
    for c in cats:
        for nome, preco, desc in c["itens"]:
            yield nome, preco, desc


def card(nome, preco, desc, tag=None):
    tag_html = f'<span class="tag">{e(tag)}</span>' if tag else ""
    desc_html = f"<p>{e(desc)}</p>" if desc else ""
    return (f'<li class="product"><div class="ph"><span>[FOTO: {e(nome)}]</span></div>'
            f'<div class="product-body">{tag_html}<h3>{e(nome)}</h3>{desc_html}'
            f'<p class="price">R$ {preco}</p></div></li>')


def destaques(nomes, cats, tag_first=None):
    idx = {n: (n, p, d) for n, p, d in todos_itens(cats)}
    out = []
    for i, n in enumerate(nomes):
        tag = tag_first if (i == 0 and tag_first) else None
        out.append(card(*idx[n], tag=tag))
    return "\n        ".join(out)


def categoria(c, aberta=False):
    itens = "".join(
        f'<li><h4>{e(n)}</h4><p class="price">R$ {p}</p>{f"<p>{e(d)}</p>" if d else ""}</li>'
        for n, p, d in c["itens"])
    intro = f'<p class="cat-intro">{e(c["intro"])}</p>' if c["intro"] else ""
    n = len(c["itens"])
    return (f'<details class="menu-cat"{" open" if aberta else ""}><summary>{e(c["nome"])}'
            f'<span class="count">{n} {"item" if n == 1 else "itens"}</span>{CHEVRON}</summary>'
            f'{intro}<ul class="menu-list">{itens}</ul></details>')


def secao_natal():
    return f'''<section class="section section-natal" id="natal" aria-labelledby="natal-title">
    <div class="container">
      <div class="section-head">
        <div>
          <p class="kicker">Natal 2026</p>
          <h2 id="natal-title">Panetones e mimos <em>para a ceia.</em></h2>
        </div>
        <p class="lead">Edição de temporada. Peça pelo Instadelivery ou encomende para presentear.</p>
      </div>
      <ul class="product-grid">
        {destaques(DESTAQUES_NATAL, [NATAL])}
      </ul>
      <div class="menu-full">
        {categoria(NATAL, aberta=True)}
      </div>
    </div>
  </section>'''


def encomenda():
    return "\n        ".join(
        f'<li class="order-card"><div class="ph"><span>[FOTO: {e(n)}]</span></div><div class="order-body">'
        f'<h3>{e(n)}</h3><p>{e(d)}</p>'
        f'<a class="text-link" href="{WHATSAPP}" target="_blank" rel="noopener">Encomendar pelo WhatsApp</a></div></li>'
        for n, d in ENCOMENDA)


def marquee():
    itens = "".join(f'<span class="marquee-item">{e(i)}</span>' for i in MARQUEE_ITENS)
    return f'<div class="marquee-group">{itens}</div>'


def render(com_natal, inline=False):
    tpl = (ROOT / "build" / "index.template.html").read_text(encoding="utf-8")
    cardapio = '<div class="menu-columns">' + "".join(categoria(c) for c in CATEGORIAS) + "</div>"
    css = ('<style>' + (ROOT / "assets/css/styles.css").read_text(encoding="utf-8") + '</style>') if inline \
        else '<link rel="stylesheet" href="assets/css/styles.css">'
    js = ('<script>' + (ROOT / "assets/js/main.js").read_text(encoding="utf-8") + '</script>') if inline \
        else '<script src="assets/js/main.js" defer></script>'
    out = (tpl.replace("{{CSS}}", css).replace("{{JS}}", js)
           .replace("{{SITE_URL}}", SITE_URL).replace("{{WHATSAPP}}", WHATSAPP)
           .replace("{{MARQUEE}}", marquee())
           .replace("{{DESTAQUES}}", destaques(DESTAQUES, CATEGORIAS, tag_first="Mais pedido"))
           .replace("{{CARDAPIO}}", cardapio)
           .replace("{{ENCOMENDA}}", encomenda())
           .replace("{{NATAL_SECAO}}", secao_natal() if com_natal else "")
           .replace("{{NATAL_NAV}}", '<a href="#natal">Natal</a>' if com_natal else ""))
    if inline:
        for img in ["logo-homemade-branco.svg", "favicon.svg"]:
            data = base64.b64encode((ROOT / "assets/img" / img).read_bytes()).decode()
            out = out.replace(f"assets/img/{img}", f"data:image/svg+xml;base64,{data}")
        for img in ["favicon-32.png", "apple-touch-icon.png"]:
            data = base64.b64encode((ROOT / "assets/img" / img).read_bytes()).decode()
            out = out.replace(f"assets/img/{img}", f"data:image/png;base64,{data}")
    assert "{{" not in out, "placeholder sem substituir"
    return out


if __name__ == "__main__":
    (ROOT / "index.html").write_text(render(True), encoding="utf-8")
    (ROOT / "sem-natal.html").write_text(render(False), encoding="utf-8")
    dist = ROOT / "dist"
    dist.mkdir(exist_ok=True)
    (dist / "preview-com-natal.html").write_text(render(True, inline=True), encoding="utf-8")
    (dist / "preview-sem-natal.html").write_text(render(False, inline=True), encoding="utf-8")
    print("ok")
