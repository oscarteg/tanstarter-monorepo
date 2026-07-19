import "@tanstack/react-start/server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { db } from "@repo/db";
import * as schema from "@repo/db/schema";
import { betterAuth } from "better-auth/minimal";
import { genericOAuth } from "better-auth/plugins/generic-oauth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

/**
 * Authelia (self-hosted OIDC) is the default SSO provider.
 *
 * It is only registered when configured, so an unconfigured clone starts up
 * without "missing clientId or clientSecret" warnings and simply falls back to
 * email + password. Endpoints are read from Authelia's discovery document, and
 * `genericOAuth` registers it as a first-class social provider — so the client
 * signs in with the standard `signIn.social({ provider: "authelia" })`.
 */
const autheliaIssuer = process.env.AUTHELIA_ISSUER_URL;
const autheliaClientId = process.env.AUTHELIA_CLIENT_ID;
const autheliaClientSecret = process.env.AUTHELIA_CLIENT_SECRET;

export const isAutheliaConfigured = Boolean(
  autheliaIssuer && autheliaClientId && autheliaClientSecret,
);

const autheliaPlugins = isAutheliaConfigured
  ? [
      genericOAuth({
        config: [
          {
            providerId: "authelia",
            discoveryUrl: `${autheliaIssuer}/.well-known/openid-configuration`,
            clientId: autheliaClientId as string,
            clientSecret: autheliaClientSecret as string,
            scopes: ["openid", "profile", "email"],
          },
        ],
      }),
    ]
  : [];

export const auth = betterAuth({
  baseURL: process.env.VITE_BASE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  telemetry: {
    enabled: false,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  // https://better-auth.com/docs/integrations/tanstack#usage-tips
  plugins: [tanstackStartCookies(), ...autheliaPlugins],

  // https://better-auth.com/docs/concepts/session-management#session-caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // https://better-auth.com/docs/authentication/email-password
  emailAndPassword: {
    enabled: true,
  },

  experimental: {
    // https://better-auth.com/docs/adapters/drizzle#joins-experimental
    joins: true,
  },
});
