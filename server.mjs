import { createServer } from 'node:http';

const host = '127.0.0.1';
const port = 4300;
const responseBody = JSON.stringify({
    content: [
        {
            id: 'public-sample-document-1',
            fileName: 'public-sample.pdf',
            createdDate: '2026-01-01T12:00:00.000Z',
            createdBy: 'local-reproduction-server',
            visibleToClient: true,
        },
    ],
    page: {
        size: 5,
        number: 0,
        totalElements: 1,
        totalPages: 1,
    },
});

export const server = createServer((request, response) => {
    const requestUrl = new URL(request.url || '/', `http://${request.headers.host}`);

    if (requestUrl.pathname === '/') {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end('<!doctype html><html lang="en"><meta charset="utf-8"><title>Reproduction API</title><h1>API server only (port 4300)</h1><p>Open the Angular application at <a href="http://127.0.0.1:4200">http://127.0.0.1:4200</a> to reproduce the issue.</p><p>Start both servers with <code>pnpm repro</code>.</p></html>');
        return;
    }

    if (requestUrl.pathname === '/api/documents') {
        response.writeHead(200, {
            'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            Connection: 'close',
            'Content-Type': 'application/json; charset=utf-8',
            Expires: '0',
            Pragma: 'no-cache',
        });

        // Two writes without Content-Length intentionally produce a chunked HTTP/1.1 response.
        const splitIndex = Math.ceil(responseBody.length / 2);
        response.write(responseBody.slice(0, splitIndex));
        setTimeout(() => response.end(responseBody.slice(splitIndex)), 75);

        return;
    }

    response.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ message: 'Not found' }));
});

server.listen(port, host, () => {
    console.log(`Reproduction API listening on http://${host}:${port}`);
});
