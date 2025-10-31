// src/api/routeMap.js
// 앱에서 호출하는 경로를 실제 API 경로로 자동 변환하는 어댑터입니다.
/*
불일치 목록 (대표)
- /auth/otp/request        -> /auth/phone/request-otp
- /auth/otp/verify         -> /auth/phone/verify
- /chat/direct             -> /chats/direct
- /store/purchases/confirm -> /payments/confirm
*/

const PATH_MAP = [
  { from: /^\/auth\/otp\/request$/, to: '/auth/phone/request-otp' },
  { from: /^\/auth\/otp\/verify$/,  to: '/auth/phone/verify' },
  { from: /^\/chat\/direct$/,       to: '/chats/direct' },
  { from: /^\/store\/purchases\/confirm$/, to: '/payments/confirm' },
];

export function mapPath(original) {
  if (!original || typeof original !== 'string') return original;
  for (const rule of PATH_MAP) {
    if (rule.from.test(original)) return original.replace(rule.from, rule.to);
  }
  return original;
}

export function applyRouteMapToAxiosConfig(config) {
  if (!config) return config;
  try {
    const isAbsolute = /^https?:\/\//i.test(config.url);
    if (!isAbsolute) {
      config.url = mapPath(config.url);
      return config;
    }
    const u = new URL(config.url);
    u.pathname = mapPath(u.pathname);
    config.url = u.toString();
    return config;
  } catch {
    return config;
  }
}
