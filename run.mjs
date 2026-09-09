import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';

const mode = process.argv[2] ?? 'fetch';
if (!['fetch', 'xhr'].includes(mode)) {
    throw new Error('Usage: node run.mjs [fetch|xhr]');
}

// Fail instead of serving a different application or silently choosing another port.
for (const port of [4200, 4300]) {
    await new Promise((resolve, reject) => {
        const probe = createServer();
        probe.once('error', () => reject(new Error(`Port ${port} is unavailable. Stop the process using it before starting this reproduction.`)));
        probe.listen(port, '127.0.0.1', () => probe.close(resolve));
    });
}

const { server } = await import('./server.mjs');
const angular = spawn(process.execPath, [
    fileURLToPath(new URL('./node_modules/@angular/cli/bin/ng.js', import.meta.url)),
    'serve', '--configuration', mode === 'xhr' ? 'xhr' : 'development',
    '--host', '127.0.0.1', '--port', '4200',
], { cwd: fileURLToPath(new URL('.', import.meta.url)), stdio: 'inherit', windowsHide: true });

console.log(`\n${mode.toUpperCase()} mode. When Angular is ready, open http://127.0.0.1:4200`);
console.log('Port 4300 is the API only. Ctrl+C stops both servers.\n');

let stopping = false;
const stop = (code) => {
    if (stopping) return;
    stopping = true;
    process.exitCode = code;
    angular.kill();
    server.closeAllConnections();
    server.close();
};

angular.once('error', (error) => { console.error(error.message); stop(1); });
angular.once('exit', (code) => stop(code ?? 1));
server.once('error', (error) => { console.error(error.message); stop(1); });
process.once('SIGINT', () => stop(0));
process.once('SIGTERM', () => stop(0));
