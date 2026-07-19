import { describe, expect, it, vi } from "vite-plus/test";

import {
  createConsoleTransport,
  createResendTransport,
  resolveTransport,
  sendEmail,
} from "./index";

const message = {
  to: "someone@example.com",
  subject: "Reset your password",
  text: "Follow the link to reset your password.",
};

describe("resolveTransport", () => {
  it("falls back to the console transport when no API key is set", () => {
    expect(resolveTransport({}).name).toBe("console");
  });

  it("uses Resend once a key and sender are configured", () => {
    const transport = resolveTransport({
      RESEND_API_KEY: "re_test",
      EMAIL_FROM: "Acme <no-reply@acme.com>",
    });

    expect(transport.name).toBe("resend");
  });

  it("refuses a key without a sender rather than silently swallowing mail", () => {
    // The dangerous case: falling back to the console here would mean a
    // production deploy quietly sends nothing at all.
    expect(() => resolveTransport({ RESEND_API_KEY: "re_test" })).toThrow(/EMAIL_FROM/);
  });
});

describe("createConsoleTransport", () => {
  it("logs the message instead of sending it", async () => {
    const log = vi.fn();

    await createConsoleTransport(log).send(message);

    expect(log).toHaveBeenCalledOnce();
    const output = log.mock.calls[0]?.[0] as string;
    expect(output).toContain(message.to);
    expect(output).toContain(message.subject);
    expect(output).toContain(message.text);
  });
});

describe("createResendTransport", () => {
  it("posts the message to Resend with the configured sender", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));

    await createResendTransport({
      apiKey: "re_test",
      from: "Acme <no-reply@acme.com>",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    }).send(message);

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer re_test");
    expect(JSON.parse(init.body as string)).toMatchObject({
      from: "Acme <no-reply@acme.com>",
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
  });

  it("omits the html field when no html body is given", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));

    await createResendTransport({
      apiKey: "re_test",
      from: "Acme <no-reply@acme.com>",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    }).send(message);

    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string)).not.toHaveProperty("html");
  });

  it("surfaces the provider's error message when a send is rejected", async () => {
    const fetchImpl = vi.fn(async () => new Response("domain is not verified", { status: 403 }));

    const transport = createResendTransport({
      apiKey: "re_test",
      from: "Acme <no-reply@acme.com>",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    await expect(transport.send(message)).rejects.toThrow(/403.*domain is not verified/);
  });
});

describe("sendEmail", () => {
  it("delegates to the transport it is given", async () => {
    const send = vi.fn(async () => {});

    await sendEmail(message, { name: "stub", send });

    expect(send).toHaveBeenCalledWith(message);
  });
});
