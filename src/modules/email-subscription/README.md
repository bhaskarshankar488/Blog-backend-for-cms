# Email Subscription Feature Module

A self-contained, production-ready email subscription endpoint for your existing
Express + Mongoose backend.

```
POST /api/v1/public/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "captchaToken": "turnstile_token"
}
```

---

## Folder structure

```
email-subscription/
├── controllers/
│   └── subscribe.controller.js   # thin HTTP layer
├── services/
│   └── subscribe.service.js      # business logic, DB writes
├── models/
│   └── subscriber.model.js       # Mongoose schema + unique index
├── validations/
│   └── subscribe.validation.js   # Joi schema + validation middleware
├── middlewares/
│   ├── turnstile.middleware.js   # Cloudflare Turnstile verification
│   └── rateLimiter.middleware.js # per-IP rate limiting
├── routes/
│   └── subscribe.route.js        # wires middleware + controller together
├── utils/
│   └── logger.js                 # structured logging (redacts secrets)
├── index.js                      # barrel export
├── .env.example
└── README.md
```

---

## 1. Install missing dependencies

Your project already has `express`, `mongoose`, `joi`, and `axios` (used here for
the Turnstile server-side verification call). You only need to add one package:

```bash
npm install express-rate-limit
```

---

## 2. Copy the folder

Copy the entire `email-subscription/` folder into your project, e.g.:

```
src/features/email-subscription/
```

---

## 3. Register the route in `app.js`

```js
import { subscriptionRouter } from './features/email-subscription/index.js';

// Required for req.ip to reflect the real client IP (and not your load
// balancer/proxy) when running behind Nginx, a cloud LB, Heroku, etc.
// Without this, rate limiting can be trivially bypassed.
app.set('trust proxy', 1);

app.use('/api/v1/public', subscriptionRouter);
```

This mounts the route at `POST /api/v1/public/subscribe`.

> Your existing global error-handling middleware should be registered **after**
> this route (as it presumably already is) — this module calls `next(err)` for
> any unexpected error and relies on your existing handler to return a safe,
> generic response.

---

## 4. Environment variables

Copy `.env.example` values into your project's `.env`:

| Variable | Required | Default | Description |
|---|---|---|---|
| `TURNSTILE_SECRET_KEY` | Yes | — | Secret key from your Cloudflare Turnstile widget. Server fails closed (500) if missing. |
| `SUBSCRIBE_RATE_LIMIT_WINDOW_MS` | No | `900000` (15 min) | Rate-limit window in ms. |
| `SUBSCRIBE_RATE_LIMIT_MAX_REQUESTS` | No | `5` | Max requests per IP per window. |

---

## 5. Start your server

That's it — no other project files need to change.

---

## Example responses

**Success — 201**
```json
{ "success": true, "message": "Subscribed successfully" }
```

**Validation failure — 400**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["email must be a valid email", "captchaToken is required"]
}
```

**CAPTCHA failure — 400**
```json
{ "success": false, "message": "CAPTCHA verification failed" }
```

**Duplicate email — 409**
```json
{ "success": false, "message": "This email is already subscribed" }
```

**Rate limited — 429**
```json
{ "success": false, "message": "Too many requests. Please try again later." }
```

---

## Security considerations

- **Mass assignment / parameter pollution**: the Joi schema uses `.unknown(false)`,
  so any request containing fields beyond `email` and `captchaToken` is rejected
  outright rather than silently stripped.
- **NoSQL injection**: Joi enforces `email`/`captchaToken` are strings before
  anything touches Mongoose, and the Mongoose schema itself types every field —
  there's no path for an attacker to inject a query operator object (e.g.
  `{"$ne": null}`) into a `find`/`create` call.
- **Duplicate protection**: enforced at the database level via a unique index
  on `email`, not just an application-level check — this avoids a race
  condition where two concurrent requests for the same email could otherwise
  both slip through.
- **CAPTCHA**: verified server-side against Cloudflare's `siteverify` endpoint
  on every request. Cloudflare itself rejects expired or already-used tokens
  (via `error-codes` like `timeout-or-duplicate`), so no separate replay-cache
  is needed or implemented client-side. The endpoint fails **closed**: if
  `TURNSTILE_SECRET_KEY` isn't configured, or Cloudflare's endpoint can't be
  reached, requests are rejected rather than allowed through.
- **Rate limiting**: applied first in the middleware chain, before validation
  or the CAPTCHA network call, to minimize the cost of abusive traffic. Keyed
  on `req.ip` — requires `app.set('trust proxy', 1)` in your `app.js` if you're
  behind a proxy/load balancer, or all requests will appear to share one IP.
- **Error handling**: this module never sends stack traces, DB error details,
  or file paths to the client. Unexpected errors are passed to your existing
  global error handler via `next(err)`.
- **Logging**: IP, user-agent, timestamp, and success/failure/validation/
  rate-limit/CAPTCHA events are logged via `utils/logger.js`. The logger
  explicitly redacts `captchaToken`, `secret`, `password`, and `token` keys
  from any logged metadata.
- **Data stored**: `email` (lowercased, trimmed), `ipAddress`, `userAgent`,
  and Mongoose-managed `createdAt`/`updatedAt` timestamps — nothing else.
- **Body size**: this module doesn't re-parse the request body, so your
  existing global `express.json()` body-size limit applies. If it's not
  already restrictive, consider `express.json({ limit: '10kb' })` in `app.js` —
  a subscription payload never needs to be larger than that.
- **Transport security (HTTPS/TLS)**: enforced at your reverse proxy /
  hosting platform level, not in this module — make sure the endpoint is only
  served over HTTPS in production.
