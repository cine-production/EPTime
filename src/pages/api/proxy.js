import { createProxyMiddleware } from 'http-proxy-middleware';

export default function handler(req, res) {
  const { parkId } = req.query;

  if (!parkId) {
    return res.status(400).json({ error: 'Park ID is required' });
  }

  // Proxy vers l'API des temps d'attente du parc
  createProxyMiddleware({
    target: `https://queue-times.com/parks/${parkId}/queue_times.json`,
    changeOrigin: true,
    pathRewrite: {
      '^/api/proxy': '',
    },
    // Configuration des en-têtes CORS pour la réponse du proxy
    onProxyRes: proxyRes => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }
  })(req, res);
}