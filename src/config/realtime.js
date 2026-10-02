import { io } from 'socket.io-client';
import { apiBase, getAccessToken, refreshAccessToken, hasSession } from './authSession';

// One shared connection for the admin panel. The token is read fresh on every (re)connect, and an expired
// token is refreshed before retrying, so a long-open tab keeps receiving live updates.
let socket = null;
let users = 0;
const listeners = new Set();

const connect = () => {
  if (socket || !hasSession()) return;
  socket = io(apiBase, {
    transports: ['websocket', 'polling'],
    auth: (cb) => cb({ token: getAccessToken() }),
    reconnection: true,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 15000
  });
  socket.on('support:ticket', (e) => listeners.forEach((fn) => { try { fn(e); } catch { /* one bad listener must not stop the rest */ } }));
  socket.on('connect_error', async (err) => {
    if (/token|auth/i.test(err?.message || '')) {
      const r = await refreshAccessToken();
      if (r === 'ok' && socket && !socket.connected) socket.connect();
    }
  });
};

/** Calls handler(event) for every complaint update. Returns an unsubscribe function. */
export const subscribeSupport = (handler) => {
  listeners.add(handler);
  users += 1;
  connect();
  return () => {
    listeners.delete(handler);
    users -= 1;
    if (users <= 0 && socket) { socket.close(); socket = null; users = 0; }
  };
};

export const isRealtimeConnected = () => !!socket?.connected;
