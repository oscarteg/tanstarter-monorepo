# `@repo/email`

The single entry point for outbound email. Anything that sends mail — auth,
feature modules — imports `sendEmail` from here and knows nothing about the
provider behind it.

## How delivery is decided

The transport is resolved from the environment, so a fresh clone works with no
email account at all:

| Environment                     | Transport | Behaviour                                         |
| ------------------------------- | --------- | ------------------------------------------------- |
| _(nothing set)_                 | `console` | Prints the message to the terminal. Nothing sent. |
| `RESEND_API_KEY` + `EMAIL_FROM` | `resend`  | Sends over Resend's HTTP API.                     |

In development this means a password-reset link is printed to the terminal,
ready to paste into the browser — no inbox, no API key, no signup.

Setting `RESEND_API_KEY` without `EMAIL_FROM` throws rather than falling back.
A silent fallback there would mean a production deploy quietly sending nothing.

## Usage

```ts
import { sendEmail } from "@repo/email";

await sendEmail({
  to: user.email,
  subject: "Reset your password",
  text: "Follow the link to choose a new password.",
});
```

`text` is always required — it is the accessible fallback. `html` is optional.

## Using a different provider

`createResendTransport` is a plain `fetch` call, not an SDK. Copy it, change the
URL and payload, and pass the result to `sendEmail`:

```ts
await sendEmail(message, myTransport);
```

To change it globally, swap the branch in `resolveTransport`. Nothing else in
the codebase needs to know.

## Tests

`src/index.test.ts` covers transport resolution, the console transport, the
Resend payload, and provider error handling. The `fetchImpl` parameter exists so
those tests never touch the network.
