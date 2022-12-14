import useAppMessage from "@daily-co/daily-js";
import { useCallback, useState, useEffect } from 'react';

export const SocketMessage = () => {
  const [messages, setMessages] = useState([]);

  const sendAppMessage = useAppMessage({
    onAppMessage: useCallback((ev) => setMessages((m) => [...m, ev]), []),
  });

  useEffect(() => {
    console.log('****MANDOU MENSAGEM****');
    sendAppMessage({ msg: 'Hi, everyone' }, '*');
  }, [sendAppMessage]);

  return (
    <ul>
      {messages.map((ev) => (
        <li>
          {ev.fromId}: {JSON.stringify(ev.data)}
        </li>
      ))}
    </ul>
  );
};
