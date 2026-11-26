// Login do painel (/admin) com GitHub, passo 1: manda a pessoa para a tela de autorização do GitHub.
// Precisa das variáveis GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET no projeto da Vercel (veja GUIA-DO-PAINEL.md).
const crypto = require('node:crypto');

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Login com GitHub ainda não configurado: falta GITHUB_CLIENT_ID na Vercel. Use “Entrar com token” por enquanto.');
    return;
  }
  const state = crypto.randomBytes(16).toString('hex');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `https://${host}/api/callback`,
    scope: 'repo,user',
    state,
  });
  res.setHeader('Set-Cookie', `painel_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.statusCode = 302;
  res.setHeader('Location', `https://github.com/login/oauth/authorize?${params}`);
  res.end();
};
