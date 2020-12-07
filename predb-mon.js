#!/usr/bin/env node

const WebSocket = require('ws');
const readline = require('readline');

const monitor = (config) => {
    return new Promise(resolve => {
        const ws = new WebSocket('https://predb.ovh/api/v1/ws');

        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        process.stdin.on('keypress', (s, k) => {
            return ws.close();
        });

        ws.on('open', () => {
            console.log('Streaming live PreDB releases. Press any key to exit...');
        });

        ws.on('message', msg => {
            try {
                msg = JSON.parse(msg);

                if (config.debug) {
                    console.log(msg);
                }

                const filter = config.categoryFilter().test(msg.row.cat);
                if (filter) {
                    if (config.debug) {
                        console.log(`Dropping ${msg.row.name} due to category filter ${msg.row.cat}`);
                    }
                    return;
                }

                console.log(config.formatter(msg));
            } catch (e) {
                console.error(e);
            }
        });

        ws.on('close', () => {
            return resolve();
        });
    });
};

(async () => {
    const args = process.argv.slice(2);
    const config = require(args[0] || './default_config.js');
    await monitor(config);
    process.exit();
})();