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
};

export const authConfig: AuthConfig = {
  brandName: "Acme Inc.",
  logo: GalleryVerticalEndIcon,
  termsUrl: "#",
  privacyUrl: "#",
};
