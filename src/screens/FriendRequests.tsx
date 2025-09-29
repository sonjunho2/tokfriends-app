// tokfriends-app/src/screens/FriendRequests.tsx
import React, { useEffect, useState } from 'react';
import { friendshipsApi, tokenStore } from '../lib/api';

type RequestRow = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: string;
};

function decodeJwtSub(token: string | null): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const json = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return json?.sub ?? null;
  } catch {
    return null;
  }
}

export default function FriendRequestsScreen() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const userId = decodeJwtSub(tokenStore.get());

  const fetchList = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await friendshipsApi.list(userId);
      if (res?.ok) {
        setRows(res.data as RequestRow[]);
      } else {
        setError('목록 불러오기 실패');
      }
    } catch (e: any) {
      setError(e?.message || '목록 조회 오류');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = async (id: string, type: 'accept' | 'decline' | 'cancel') => {
    setActingId(id);
    setError(null);
    try {
      if (type === 'accept') await friendshipsApi.accept(id);
      if (type === 'decline') await friendshipsApi.decline(id);
      if (type === 'cancel') await friendshipsApi.cancel(id);
      await fetchList();
    } catch (e: any) {
      setError(e?.message || '요청 처리 중 오류');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">친구 요청</h1>

      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded-2xl shadow divide-y">
        {rows.length === 0 && !loading && (
          <div className="p-4 text-gray-500">요청이 없습니다.</div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">요청 ID: {r.id}</div>
              <div className="text-sm text-gray-500">상태: {r.status}</div>
            </div>
            <div className="flex gap-2">
              {r.status === 'requested' && r.addresseeId === userId && (
                <>
                  <button
                    onClick={() => act(r.id, 'accept')}
                    disabled={actingId === r.id}
                    className="bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700 disabled:opacity-50"
                  >
                    수락
                  </button>
                  <button
                    onClick={() => act(r.id, 'decline')}
                    disabled={actingId === r.id}
                    className="bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700 disabled:opacity-50"
                  >
                    거절
                  </button>
                </>
              )}
              {r.status === 'requested' && r.requesterId === userId && (
                <button
                  onClick={() => act(r.id, 'cancel')}
                  disabled={actingId === r.id}
                  className="bg-gray-400 text-white rounded px-3 py-1 hover:bg-gray-500 disabled:opacity-50"
                >
                  취소
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
