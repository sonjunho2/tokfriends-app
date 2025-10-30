# tokfriends 앱 기준 교차검증 수정 제안

생성시각: 2025-10-30T03:05:04.698Z

## 요약

- 분석한 클라이언트 호출 합계: 77
- API와 일치한 호출: 26
- **API에 없는 호출(추가 필요)**: 51
- **인증 불일치**: 6
- **클라이언트가 쓰지 않는 API(정리 후보)**: 35

## 1) API에 추가가 필요해 보이는 엔드포인트

- `DELETE {url}` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:120')]
- `GET {url}` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:100')]
- `GET /cms/pages/{key}` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:371')]
- `GET /legal/{key}` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:371')]
- `GET /payments/products` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:442')]
- `GET /policies/{key}` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:371')]
- `GET /shop/points` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:442')]
- `GET /store/products` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:442')]
- `GET https://manage.tokfriends.app/api/fonts/latest` 추가 필요 — 예: [('src/screens/my/SettingsScreen.js', 'anonymous@SettingsScreen.js:123')]
- `PATCH {url}` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:115')]
- `POST {p}` 추가 필요 — 예: [('src/api/client.js', 'tryPostJsonSequential'), ('src/api/client.js', 'tryPostFormSequential')]
- `POST {url}` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:105')]
- `POST /auth/login` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:130')]
- `POST /auth/otp/request` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:250')]
- `POST /auth/otp/verify` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:288')]
- `POST /auth/phone/confirm` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:288')]
- `POST /auth/phone/send-otp` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:250')]
- `POST /auth/phone/signup` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:327')]
- `POST /auth/register` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:172')]
- `POST /auth/signup` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:172')]
- `POST /auth/signup/phone` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:327')]
- `POST /chat/direct` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:399')]
- `POST /chat/rooms` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:214')]
- `POST /chat/rooms/direct` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:399')]
- `POST /chats/rooms/direct` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:399')]
- `POST /conversations` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:214')]
- `POST /conversations/direct` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:399')]
- `POST /iap/confirm` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:469')]
- `POST /otp/request` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:250')]
- `POST /otp/send` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:250')]
- `POST /otp/verify` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:288')]
- `POST /payments/confirm` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:469')]
- `POST /register` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:172')]
- `POST /rooms` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:214')]
- `POST /signup` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:172')]
- `POST /users` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:172')]
- `POST /users/register` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:172')]
- `POST /users/signup` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:172')]
- `POST /users/signup/phone` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:327')]
- `PUT {url}` 추가 필요 — 예: [('src/api/client.js', 'anonymous@client.js:110')]

## 2) 인증 정책이 서로 다른 엔드포인트

- `GET /gifts` — API 요구: 없음, 앱 전송: bearer — 예: [('src/api/client.js', 'anonymous@client.js:519')]
- `GET /health` — API 요구: 없음, 앱 전송: bearer — 예: [('src/api/client.js', 'anonymous@client.js:125')]
- `GET /legal-documents/{key}` — API 요구: 없음, 앱 전송: bearer — 예: [('src/api/client.js', 'anonymous@client.js:371')]
- `GET /store/point-products` — API 요구: 없음, 앱 전송: bearer — 예: [('src/api/client.js', 'anonymous@client.js:442')]
- `POST /auth/phone/complete-profile` — API 요구: 없음, 앱 전송: bearer — 예: [('src/api/client.js', 'anonymous@client.js:327')]
- `POST /auth/phone/verify` — API 요구: 없음, 앱 전송: bearer — 예: [('src/api/client.js', 'anonymous@client.js:288')]

## 3) 앱에서 사용되지 않는 API (정리 검토)

- `GET /` — Redirect to docs
- `GET /admin/announcements` — Admin list announcements
- `POST /admin/announcements` — Create announcement
- `DELETE /admin/announcements/{id}` — Delete announcement
- `PATCH /admin/announcements/{id}` — Update announcement
- `GET /admin/refunds` — List refunds
- `POST /admin/refunds` — Create refund
- `PATCH /admin/refunds/{id}/approve` — Approve refund
- `PATCH /admin/refunds/{id}/deny` — Deny refund
- `GET /admin/reports` — Admin list reports
- `GET /admin/reports/recent` — Recent reports
- `GET /admin/users` — Admin list users
- `GET /admin/users/{id}` — Admin user detail
- `PATCH /admin/users/{id}` — Admin update user
- `POST /admin/users/{id}/actions/escalate` — Log escalate
- `POST /admin/users/{id}/actions/password-reset` — Log password reset
- `POST /admin/users/{id}/actions/resend-verification` — Log resend verification
- `POST /admin/users/{id}/notes` — Admin add note
- `PATCH /admin/users/{id}/role` — Set user role
- `PATCH /admin/users/{id}/status` — Admin update status
- `POST /auth/apple` — Apple login
- `GET /chats` — List chats
- `POST /chats/message` — Send message
- `GET /discover` — Discover users
- `GET /friendships` — List friend requests
- `POST /friendships` — Send friend request
- `POST /friendships/{id}/accept` — Accept friend
- `POST /friendships/{id}/cancel` — Cancel friend
- `POST /friendships/{id}/decline` — Decline friend
- `GET /icebreakers` — Get icebreakers
- `GET /metrics` — Metrics summary
- `GET /metrics/dashboard` — Metrics dashboard
- `POST /translate` — Translate text
- `PATCH /users/{id}` — Update profile
- `GET /users/search` — Search users
