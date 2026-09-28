'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface RealtimeData {
  unreadCount:        number;
  invitations:        number;
  notifications:      any[];
  pendingInvitations: any[];
  publicEvents:       any[];
  timestamp:          string;
}

export function useRealtime() {
  const [data, setData] = useState<RealtimeData>({
    unreadCount:        0,
    invitations:        0,
    notifications:      [],
    pendingInvitations: [],
    publicEvents:       [],
    timestamp:          '',
  });
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (esRef.current) {
      esRef.current.close();
    }

    const es = new EventSource('/api/sse');
    esRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'connected') {
          setConnected(true);
        } else if (payload.type === 'update') {
          setData(payload);
        }
      } catch {}
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      // Reconnexion après 5 secondes
      setTimeout(connect, 5000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
    };
  }, [connect]);

  return { data, connected };
}
