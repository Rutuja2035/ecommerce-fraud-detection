import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url, onMessage) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = url.startsWith('ws') ? url : `${protocol}://${window.location.host}${url}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch {
        /* ignore malformed messages */
      }
    };

    return () => ws.close();
  }, [url, onMessage]);

  return { connected, ws: wsRef.current };
}
