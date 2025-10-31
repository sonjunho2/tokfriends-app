// src/api/routeMap.js
// 앱에서 호출하는 경로를 실제 API 경로로 자동 변환하는 어댑터입니다.
// (앱 요약과 API 요약의 불일치 해결)
/*
불일치 목록
- /auth/otp/request        -> /auth/phone/request-otp
- /auth/otp/verify         -> /auth/phone/verify
- /chat/direct             -> /chats/direct
- /store/purchases/confirm -> /payments/confirm (앱에 이미 /payments/confirm, /iap/confirm 등 fallback 로직 존재)
*/

const PATH_MAP = [
  { from: /^\/auth\/otp\/request$/, to: '/auth/phone/request-otp' },
  { from: /^\/auth\/otp\/verify$/,  to: '/auth/phone/verify' },
  { from: /^\/chat\/direct$/,       to: '/chats/direct' },
  { from: /^\/store\/purchases\/confirm$/, to: '/payments/confirm' },
];

// 경로 매핑 적용
export function mapPath(original) {
  if (!original || typeof original !== 'string') return original;
  for (const rule of PATH_MAP) {
    if (rule.from.test(original)) return original.replace(rule.from, rule.to);
  }
  return original;
}

// Axios 요청 인터셉터에서 사용
export function applyRouteMapToAxiosConfig(config) {
  if (!config) return config;
  // config.url이 절대URL(ex: https://...)이면 path만 추출/변경 후 재조합
  try {
    const isAbsolute = /^https?:\/\//i.test(config.url);
    if (!isAbsolute) {
      // 상대 경로만 단순 매핑
      config.url = mapPath(config.url);
      return config;
    }
    const u = new URL(config.url);
    u.pathname = mapPath(u.pathname);
    config.url = u.toString();
    return config;
  } catch {
    // URL 파싱 실패시 원본 유지
    return config;
  }
}
