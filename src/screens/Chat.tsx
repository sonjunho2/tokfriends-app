// tokfriends-app/src/screens/Chat.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ws } from '@/lib/ws';
import { tokenStore } from '@/lib/api';

type ChatMsg = {
  id?: string;
  chatId: string;
  senderId?: string;
  content: string;
  createdAt?: string;
};

export default function ChatScreen() {
  const [connected, setConnected] = useState(false);
  const [chatId, setChatId] = useState('');
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    // 토큰이 없으면 에러 표시
    if (!tokenStore.get()) {
      setError('로그인이 필요합니다.');
      return;
    }
    try {
      const socket = ws.connect(); // env.WS_BASE 또는 API_BASE
      ws.onConnected(() => {
        connectedRef.current = true;
        setConnected(true);
      });
      ws.onMessage((data: any) => {
        // 서버에서 { chatId, msg } 형태로 브로드캐스트
        const msg = (data && (data.msg || data)) as ChatMsg;
        if (!msg || !msg.chatId) return;
        setMsgs((prev) => [...prev, msg]);
      });
      ws.onTyping((_d: any) => {
        // 필요 시 타이핑 UI 처리
      });

      return () => {
        ws.disconnect();
        connectedRef.current = false;
        setConnected(false);
      };
    } catch (e: any) {
      setError(e?.message || 'WS 연결 실패');
    }
  }, []);

  const join = () => {
    if (!chatId.trim()) return;
    ws.joinChat(chatId.trim());
    // 초기화
    setMsgs([]);
  };

  const send = () => {
    if (!chatId.trim() || !input.trim()) return;
    ws.sendMessage(chatId.trim(), input.trim());
    // 낙관적 업데이트(옵션)
    setMsgs((prev) => [
      ...prev,
      { chatId: chatId.trim(), content: input.trim(), senderId: 'me', createdAt: new Date().toISOString() },
    ]);
    setInput('');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">채팅</h1>

      {!connected && !error && (
        <div className="text-gray-600">서버 연결 중...</div>
      )}
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded-2xl shadow p-4 flex gap-2 items-center">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="채팅방 ID 입력"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
          onClick={join}
          disabled={!connected || !chatId.trim()}
        >
          입장
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 h-[60vh] overflow-y-auto space-y-2">
        {msgs.length === 0 && (
          <div className="text-gray-500">메시지가 없습니다.</div>
        )}
        {msgs.map((m, i) => (
          <div
            key={m.id || i}
            className={`flex ${m.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-2xl ${
                m.senderId === 'me' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-4 flex gap-2 items-center">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder={connected ? '메시지를 입력하세요' : '연결 대기 중...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!connected || !chatId.trim()}
        />
        <button
          className="bg-purple-600 text-white rounded px-4 py-2 hover:bg-purple-700 disabled:opacity-50"
          onClick={send}
          disabled={!connected || !chatId.trim() || !input.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
}
