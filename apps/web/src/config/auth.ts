import type { LucideIcon } from "lucide-react";
import { GalleryVerticalEndIcon } from "lucide-react";

/**
 * Branding + legal links for the auth screens (`/login`, `/signup`).
 * Edit this to re-brand the sign-in / sign-up pages for a new project.
 */
export type AuthConfig = {
  brandName: string;
  logo: LucideIcon;
  termsUrl: string;
  privacyUrl: string;
  /**
   * Whether to offer SSO on the auth screens. Authelia (self-hosted OIDC) is
   * the default provider; it is configured server-side via `AUTHELIA_*`. This
   * client-side flag only controls whether the button is rendered, so a clone
   * without Authelia doesn't show a button that cannot work.
   */
  ssoEnabled: boolean;
  /** Provider id registered in `@repo/auth`, used by `signIn.social`. */
  ssoProvider: string;
  ssoLabel: string;
};

export const authConfig: AuthConfig = {
  brandName: "Acme Inc.",
  logo: GalleryVerticalEndIcon,
  termsUrl: "#",
  privacyUrl: "#",
  ssoEnabled: import.meta.env.VITE_AUTHELIA_ENABLED === "true",
  ssoProvider: "authelia",
  ssoLabel: "Authelia",
};
