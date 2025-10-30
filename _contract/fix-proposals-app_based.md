# tokfriends 앱 기준 교차검증 수정 제안

생성시각: 2025-10-30T03:35:11.108455Z

## 요약

- 분석한 클라이언트 호출 합계: 62
- API와 일치한 호출: 22
- **API에 없는 호출(추가 필요)**: 40
- **인증 불일치**: 5
- **클라이언트가 쓰지 않는 API(정리 후보)**: 43

## 1) API에 추가가 필요해 보이는 엔드포인트

- `POST /auth/otp/request` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:250)]
- `POST /auth/otp/verify` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:288)]
- `POST /auth/phone/confirm` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:288)]
- `POST /auth/phone/send-otp` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:250)]
- `POST /auth/phone/signup` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:327)]
- `POST /auth/signup/phone` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:327)]
- `POST /chat/direct` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:399)]
- `POST /chat/rooms` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:214)]
- `POST /chat/rooms/direct` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:399)]
- `POST /chats/rooms/direct` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:399)]
- `GET /cms/pages/{key}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:371)]
- `POST /conversations` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:214)]
- `POST /conversations/direct` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:399)]
- `POST /iap/confirm` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:469)]
- `GET /legal-documents/{key}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:371)]
- `GET /legal/{key}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:371)]
- `POST /otp/request` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:250)]
- `POST /otp/send` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:250)]
- `POST /otp/verify` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:288)]
- `POST /payments/confirm` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:469)]
- `GET /payments/products` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:442)]
- `GET /policies/{key}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:371)]
- `POST /register` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:172)]
- `POST /rooms` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:214)]
- `GET /shop/points` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:442)]
- `POST /signup` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:172)]
- `GET /store/products` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:442)]
- `GET /topics/{topicId}/posts` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:515)]
- `POST /users` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:172)]
- `POST /users/register` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:172)]
- `POST /users/signup` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:172)]
- `POST /users/signup/phone` — 앱 인증: none — 예: [(src/api/client.js, anonymous@client.js:327)]
- `GET /users/{userId}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:503)]
- `GET https://manage.tokfriends.app/api/fonts/latest` — 앱 인증: none — 예: [(src/screens/my/SettingsScreen.js, anonymous@SettingsScreen.js:123)]
- `POST {p}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, tryPostJsonSequential), (src/api/client.js, tryPostFormSequential)]
- `DELETE {url}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:120)]
- `GET {url}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:100)]
- `PATCH {url}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:115)]
- `POST {url}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:105)]
- `PUT {url}` — 앱 인증: auto-bearer — 예: [(src/api/client.js, anonymous@client.js:110)]

## 2) 인증 정책이 서로 다른 엔드포인트

- `POST /auth/phone/complete-profile` — API 요구: none, 앱 전송: bearerAuth — 예: [(src/api/client.js, anonymous@client.js:327)]
- `POST /auth/phone/verify` — API 요구: none, 앱 전송: bearerAuth — 예: [(src/api/client.js, anonymous@client.js:288)]
- `GET /gifts` — API 요구: none, 앱 전송: bearerAuth — 예: [(src/api/client.js, anonymous@client.js:519)]
- `GET /health` — API 요구: none, 앱 전송: bearerAuth — 예: [(src/api/client.js, anonymous@client.js:125)]
- `GET /store/point-products` — API 요구: none, 앱 전송: bearerAuth — 예: [(src/api/client.js, anonymous@client.js:442)]

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
- `POST /auth/users/register` — Email signup (alias of /auth/signup/email)
- `POST /auth/users/signup` — Email signup (alias of /auth/signup/email)
- `GET /chats` — List chats
- `POST /chats/chat/rooms` — Create chat room (alias of /chats/rooms)
- `POST /chats/chats/rooms` — Create chat room (alias of /chats/rooms)
- `POST /chats/conversations` — Create chat room (alias of /chats/rooms)
- `POST /chats/message` — Send message
- `GET /discover` — Discover users
- `GET /friendships` — List friend requests
- `POST /friendships` — Send friend request
- `POST /friendships/{id}/accept` — Accept friend
- `POST /friendships/{id}/cancel` — Cancel friend
- `POST /friendships/{id}/decline` — Decline friend
- `GET /icebreakers` — Get icebreakers
- `GET /legal-documents/{slug}` — Get legal document
- `GET /metrics` — Metrics summary
- `GET /metrics/dashboard` — Metrics dashboard
- `GET /topics/{id}/posts` — Posts by topic
- `POST /translate` — Translate text
- `GET /users/search` — Search users
- `GET /users/{id}` — Get user
- `PATCH /users/{id}` — Update profile
