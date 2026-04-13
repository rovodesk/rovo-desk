# 📦 User Service

## 📚 API Routes

_Base Route_ : https://api.clerk.com/v1

---

## 👤 Users

- `GET /users` — List users
- `POST /users` — Create user
- `GET /users/count` — Get total user count

---

## 🔍 Single User

- `GET /users/{user_id}` — Get user by ID
- `PATCH /users/{user_id}` — Update user
- `DELETE /users/{user_id}` — Delete user

---

## 🚫 User Moderation

- `POST /users/{user_id}/ban` — Ban user
- `POST /users/{user_id}/unban` — Unban user

- `POST /users/ban` — Bulk ban users
- `POST /users/unban` — Bulk unban users

- `POST /users/{user_id}/lock` — Lock user
- `POST /users/{user_id}/unlock` — Unlock user

---

## 🖼️ Profile

- `POST /users/{user_id}/profile_image` — Upload profile image
- `DELETE /users/{user_id}/profile_image` — Remove profile image

- `PATCH /users/{user_id}/metadata` — Update user metadata

---

## 💳 Billing

- `GET /users/{user_id}/billing/subscription` — Get subscription
- `GET /users/{user_id}/billing/credits` — Get credits
- `POST /users/{user_id}/billing/credits` — Add credits

---

## 🔐 Authentication & Security

- `POST /users/{user_id}/verify_password` — Verify password
- `POST /users/{user_id}/verify_totp` — Verify TOTP

- `DELETE /users/{user_id}/mfa` — Remove MFA
- `DELETE /users/{user_id}/backup_code` — Delete backup code

---

## 🔑 OAuth & External Accounts

- `GET /users/{user_id}/oauth_access_tokens/{provider}` — Get OAuth token
- `DELETE /users/{user_id}/external_accounts/{external_account_id}` — Remove external account

---

## 🏢 Organization

- `GET /users/{user_id}/organization_memberships` — List memberships
- `GET /users/{user_id}/organization_invitations` — List invitations

---

## 🔐 Passkeys & Web3

- `DELETE /users/{user_id}/passkeys/{passkey_identification_id}` — Remove passkey
- `DELETE /users/{user_id}/web3_wallets/{web3_wallet_identification_id}` — Remove wallet

---

## 🔒 Password Security

- `POST /users/{user_id}/password/set_compromised` — Mark password compromised
- `POST /users/{user_id}/password/unset_compromised` — Clear compromised flag

---

## 🧾 TOTP

- `DELETE /users/{user_id}/totp` — Remove TOTP
