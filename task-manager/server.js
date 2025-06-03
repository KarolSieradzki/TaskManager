const { createClient } = require('redis');
const WebSocket = require('ws');

const WEBSOCKET_PORT = 8080;
const REDIS_CHANNEL = 'notifications';

// Set up WebSocket server
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT }, () => {
  console.log(`[BRIDGE] WebSocket server started on ws://localhost:${WEBSOCKET_PORT}`);
});

// Set up Redis subscriber
const subscriber = createClient();

(async () => {
  try {
    await subscriber.connect();
    console.log('[BRIDGE] Connected to Redis successfully.');

    await subscriber.subscribe(REDIS_CHANNEL, (message) => {
      try {
        const parsed = JSON.parse(message);
        const info = `[BRIDGE] Notification received: Task ID ${parsed.task_id} | Event: ${parsed.event}`;
        console.log(info);

        // Send to all connected WebSocket clients
        wss.clients.forEach((ws) => {
          if (ws.readyState === ws.OPEN) {
            ws.send(message);
          }
        });

        if (wss.clients.size === 0) {
          console.log('[BRIDGE] No active WebSocket clients to notify.');
        } else {
          console.log(`[BRIDGE] Notification forwarded to ${wss.clients.size} WebSocket client(s).`);
        }
      } catch (err) {
        console.error(`[BRIDGE] Failed to parse or forward message: ${message}`, err);
      }
    });

    console.log(`[BRIDGE] Subscribed to Redis channel: "${REDIS_CHANNEL}"`);
  } catch (err) {
    console.error('[BRIDGE] Error connecting to Redis or subscribing to channel:', err);
    process.exit(1);
  }
})();

wss.on('connection', (ws, req) => {
  const clientAddress = req.socket.remoteAddress;
  console.log(`[BRIDGE] New WebSocket client connected from ${clientAddress}. Currently connected clients: ${wss.clients.size}`);

  ws.on('close', () => {
    console.log(`[BRIDGE] WebSocket client from ${clientAddress} disconnected. Remaining clients: ${wss.clients.size}`);
  });

  ws.on('error', (err) => {
    console.error(`[BRIDGE] WebSocket error for client ${clientAddress}:`, err);
  });
});

wss.on('error', (err) => {
  console.error('[BRIDGE] WebSocket server error:', err);
});
