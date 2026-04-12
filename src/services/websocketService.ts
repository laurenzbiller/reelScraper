import type { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import type { QueueJob } from '../types/queueTypes.ts';
import { jobQueue } from './queueService.ts';

const clients: Set<WebSocket> = new Set();

export function initWSS(server: Server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        clients.add(ws);
    });
    wss.on('close', (ws: WebSocket) => {
        clients.delete(ws);
    });
}

export function broadcastStateChange() {
    clients.forEach(ws => {
        ws.send(JSON.stringify(jobQueue));
    });
}
