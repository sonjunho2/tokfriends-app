// tokfriends-app/src/screens/Discover.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { discoverApi, friendshipsApi, tokenStore } from '@/lib/api';

type UserRow = {
  id: string;
  email?: string | null;
  displayName?: string | null;
  gender?: string | null;
  dob?: string | null;
  region1?: string | null;
  region2?: string | null;
};

function calcAge(dob?: string | null) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

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

export default function DiscoverScreen() {
  const [gender, setGender] = useState<string>('');
  const [ageMin, setAgeMin] = useState<string>('');
  const [ageMax, setAgeMax] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const requesterId = useMemo(() => decodeJwtSub(tokenStore.get()), []);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await discoverApi.list({
        gender: gender || undefined,
        ageMin: ageMin ? Number(ageMin) : undefined,
        ageMax: ageMax ? Number(ageMax) : undefined,
        region: region || undefined,
      });
      if (res?.ok) {
        setRows(res.data as UserRow[]);
      } else {
        setError('목록을 불러오지 못했습니다.');
      }
    } catch (e: any) {
      setError(e?.message || '목록 조회 중 오류');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSendFriend = async (addresseeId: string) => {
    if (!requesterId) {
      setError('로그인이 필요합니다.');
      return;
    }
    setSendingId(addresseeId);
    setError(null);
    try {
      const res = await friendshipsApi.send(requesterId, addresseeId);
      if (!(res as any)?.ok) throw new Error('친구 요청 실패');
      alert('친구 요청을 보냈습니다.');
    } catch (e: any) {
      setError(e?.message || '친구 요청 중 오류');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">탐색</h1>

      <div className="bg-white rounded-2xl shadow p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <select
          className="border rounded px-3 py-2"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">성별(전체)</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
        <input
          className="border rounded px-3 py-2"
          placeholder="최소 나이"
          inputMode="numeric"
          value={ageMin}
          onChange={(e) => setAgeMin(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="최대 나이"
          inputMode="numeric"
          value={ageMax}
          onChange={(e) => setAgeMax(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="지역(예: 서울)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <button
          className="md:col-span-5 bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
          onClick={fetchList}
          disabled={loading}
        >
          {loading ? '불러오는 중...' : '검색'}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="bg-white rounded-2xl shadow divide-y">
        {rows.length === 0 && !loading && (
          <div className="p-4 text-gray-500">결과가 없습니다.</div>
        )}
        {rows.map((u) => {
          const age = calcAge(u.dob);
          return (
            <div key={u.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold">
                  {u.displayName || u.email || u.id}
                  {typeof age === 'number' && <span className="text-gray-500"> · {age}세</span>}
                  {u.gender && <span className="text-gray-500"> · {u.gender}</span>}
                </div>
                <div className="text-gray-500 text-sm">
                  {(u.region1 || '') + (u.region2 ? `, ${u.region2}` : '')}
                </div>
              </div>
              <button
                className="min-w-[110px] bg-purple-600 text-white rounded px-4 py-2 hover:bg-purple-700 disabled:opacity-50"
                onClick={() => onSendFriend(u.id)}
                disabled={sendingId === u.id}
              >
                {sendingId === u.id ? '요청 중...' : '친구신청'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
