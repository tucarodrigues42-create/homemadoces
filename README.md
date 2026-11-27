# HOMEMADE Confeitaria · landing page

One-page estática (HTML + CSS, sem framework) para a HOMEMADE, em Arapiraca–AL, com um painel para editar o conteúdo sem mexer em código.

## Como o site é montado

- `content/*.json`: todo o conteúdo editável (textos, cardápio, preços, fotos, links, horários, depoimentos, liga/desliga do Natal)
- `build/index.template.html`: o HTML da página, com espaços `{{...}}` preenchidos pelo conteúdo
- `build/build.mjs`: junta template + conteúdo e gera a pasta `public/` (o que vai ao ar)
- `assets/`: CSS, JS, vídeo e fotos (`assets/img/produtos/`)
- `DESIGN.md`: cores, tipografia e componentes

```
node build/build.mjs            # gera public/
node build/build.mjs --preview  # também gera dist/preview-*.html (arquivo único para pré-visualizar)
```

A Vercel roda o build sozinha a cada commit na `main` (veja `vercel.json`). `public/` não vai para o repositório.

## Painel (/admin)

- Endereço: https://homemadedoces.com.br/admin/
- Feito com [Sveltia CMS](https://sveltiacms.app/), gratuito e sem servidor próprio. Configuração em `admin/config.yml`.
- Cada "Salvar" no painel vira um commit na `main`, e a Vercel republica o site em 1 a 2 minutos.
- Fotos enviadas pelo painel são convertidas para WebP e reduzidas (até 1000×1250) antes de subir.
- Login com GitHub: `api/auth.js` e `api/callback.js` (funções da Vercel). Precisam das variáveis `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET` no projeto da Vercel, de um OAuth App do GitHub com callback `https://homemadedoces.com.br/api/callback`. Sem elas, dá para entrar com "Entrar usando token de acesso".
- Só entra quem tem permissão de escrita no repositório no GitHub.

Textos entre colchetes, como `[BAIRROS ATENDIDOS E TAXA DE ENTREGA A CONFIRMAR]`, são espaços reservados para dados reais que ainda faltam.
