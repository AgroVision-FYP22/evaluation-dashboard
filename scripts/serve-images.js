// scripts/serve-images.js
// A simple dependency-free static file server for testing the engine's vision capabilities.
// The engine expects an `image_url` that it can fetch locally.
// Usage: node scripts/serve-images.js
// Then put your images in the `test-images/` folder and pass e.g.
// `http://localhost:8081/leaf.jpg` as the Image URL in the dashboard.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
const BASE_DIR = path.join(__dirname, '..', 'test-images');

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Basic security: prevent directory traversal
  const safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(BASE_DIR, safePath === '/' ? 'index.html' : safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('File not found\n');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      // Engine fetch shouldn't care about CORS, but just in case:
      'Access-Control-Allow-Origin': '*',
    });

    fs.createReadStream(filePath).pipe(res);
  });
}).listen(PORT, () => {
  console.log(`\n📸 Static image server running on http://localhost:${PORT}`);
  console.log(`Drop images into: ${BASE_DIR}`);
  console.log(`Then paste the URL into the dashboard (e.g. http://localhost:${PORT}/my_leaf.jpg)\n`);
});
