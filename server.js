const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = 8080;

const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.bin': 'application/octet-stream',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm'
};

http.createServer((req, res) => {
    let urlPath = decodeURIComponent(
        req.url.split('?')[0]
    );

    if (urlPath === '/') {
        urlPath = '/index.html';
    }

    const filePath = path.join(
        root,
        urlPath
    );

    if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(404);
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();

        res.writeHead(200, {
            'Content-Type':
                mime[ext] ||
                'application/octet-stream',

            'Access-Control-Allow-Origin': '*',

            'Cross-Origin-Resource-Policy':
                'cross-origin'
        });

        fs.createReadStream(filePath).pipe(res);
    });
}).listen(port, () => {
    console.log(`
================================
 Local server
================================

http://localhost:${port}

Root:
${root}

Press Ctrl+C to stop.

================================
`);
});