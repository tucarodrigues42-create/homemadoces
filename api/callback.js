// Login do painel (/admin) com GitHub, passo 2: troca o código do GitHub por um token e devolve ao painel.
// Segue o protocolo de mensagens do Netlify/Decap CMS, que o Sveltia CMS usa.
const resposta = (res, status, conteudo) => {
  const msg = `authorization:github:${status}:${JSON.stringify(conteudo)}`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Set-Cookie', 'painel_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.end(`<!doctype html><meta charset="utf-8"><title>Entrando…</title><p>Entrando no painel…</p>
<script>
(function () {
  var msg = ${JSON.stringify(msg).replace(/</g, '\\u003c')};
  var origem = location.origin;
  function enviar(e) {
    if (e.origin !== origem || e.data !== 'authorizing:github') return;
    window.removeEventListener('message', enviar);
    window.opener.postMessage(msg, origem);
    setTimeout(function () { window.close(); }, 500);
  }
  if (!window.opener) { document.body.textContent = 'Abra o painel em /admin e clique em Entrar com GitHub.'; return; }
  window.addEventListener('message', enviar);
  window.opener.postMessage('authorizing:github', origem);
})();
</script>`);
};

module.exports = async (req, res) => {
  const { code, state } = req.query || {};
  const cookie = (req.headers.cookie || '').split(';').map((c) => c.trim()).find((c) => c.startsWith('painel_oauth_state='));
  const esperado = cookie ? cookie.split('=')[1] : '';
  if (!code || !state || state !== esperado) {
    resposta(res, 'error', { provider: 'github', error: 'Login expirado ou inválido. Feche esta janela e tente de novo.' });
    return;
  }
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const dados = await r.json();
    if (!dados.access_token) {
      resposta(res, 'error', { provider: 'github', error: dados.error_description || 'O GitHub não liberou o acesso.' });
      return;
    }
    resposta(res, 'success', { token: dados.access_token, provider: 'github' });
  } catch (err) {
    resposta(res, 'error', { provider: 'github', error: 'Não foi possível falar com o GitHub. Tente de novo.' });
  }
};
