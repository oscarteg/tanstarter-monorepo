/**
 * The template's single entry point for outbound email.
 *
 * The transport is resolved from the environment, so a fresh clone sends
 * nothing and needs no account: without `RESEND_API_KEY` every message is
 * written to the console, which is enough to click a password-reset link in
 * development. Set `RESEND_API_KEY` + `EMAIL_FROM` and the same call goes out
 * over Resend's HTTP API — no code change, no SDK.
 *
 * To use a different provider, write a transport and pass it to `sendEmail`
 * (or swap the default in `resolveTransport`). Nothing else in the codebase
 * knows which provider is in play.
 */

export type EmailMessage = {
  to: string;
  subject: string;
  /** Plain-text body. Always required — it is the accessible fallback. */
  text: string;
  /** Optional HTML body. Providers fall back to `text` when omitted. */
  html?: string;
};

export type EmailTransport = {
  /** Identifies the transport in logs and tests. */
  readonly name: string;
  send(message: EmailMessage): Promise<void>;
};

/**
 * Writes messages to the console instead of sending them. The default in
 * development, and the reason a clone works with no email account at all:
 * reset links are printed to the terminal, ready to paste into the browser.
 */
export function createConsoleTransport(
  log: (message: string) => void = console.info,
): EmailTransport {
  return {
    name: "console",
    send(message) {
      log(
        [
          "",
          "─".repeat(60),
          "EMAIL (not sent — no transport configured)",
          `To:      ${message.to}`,
          `Subject: ${message.subject}`,
          "─".repeat(60),
          message.text,
          "─".repeat(60),
          "",
        ].join("\n"),
      );
      return Promise.resolve();
    },
  };
}

export type ResendTransportConfig = {
  apiKey: string;
  /** Verified sender, e.g. `"Acme <no-reply@acme.com>"`. */
  from: string;
  /** Injectable for tests. */
  fetchImpl?: typeof fetch;
};

/**
 * Sends over Resend's HTTP API directly. Deliberately not the SDK: one `fetch`
 * call keeps the dependency out of the template, and makes the transport
 * trivial to swap for any other provider with an HTTP endpoint.
 */
export function createResendTransport({
  apiKey,
  from,
  fetchImpl = fetch,
}: ResendTransportConfig): EmailTransport {
  return {
    name: "resend",
    async send(message) {
      const response = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: message.to,
          subject: message.subject,
          text: message.text,
          ...(message.html ? { html: message.html } : {}),
        }),
      });

      if (!response.ok) {
        // Surface the provider's own message — it names the cause (unverified
        // domain, bad key) far better than the status code alone.
        const detail = await response.text().catch(() => "");
        throw new Error(`Resend rejected the message (${response.status}): ${detail}`);
      }
    },
  };
}

/**
 * Picks a transport from the environment. Pure, so tests can pass an explicit
 * env rather than mutating `process.env`.
 */
export function resolveTransport(env: NodeJS.ProcessEnv = process.env): EmailTransport {
  const apiKey = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM;

  if (!apiKey) return createConsoleTransport();

  if (!from) {
    // Failing here beats silently falling back: a configured key with no
    // sender means production email is broken, and every message would be
    // quietly swallowed by the console transport.
    throw new Error("RESEND_API_KEY is set but EMAIL_FROM is missing — set a verified sender.");
  }

  return createResendTransport({ apiKey, from });
}

let defaultTransport: EmailTransport | undefined;

/**
 * Sends a message using the environment's transport. Resolved lazily so that
 * importing this module never throws at startup — only actually sending does.
 */
export async function sendEmail(
  message: EmailMessage,
  transport: EmailTransport = (defaultTransport ??= resolveTransport()),
): Promise<void> {
  await transport.send(message);
}
