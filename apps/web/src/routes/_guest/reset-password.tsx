import { authClient } from "@repo/auth/auth-client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

import { authConfig } from "#/config/auth";

/**
 * Better Auth appends the one-time token as a query parameter, and sends
 * `?error=INVALID_TOKEN` when the link has expired or was already used.
 */
const searchSchema = v.object({
  token: v.optional(v.string()),
  error: v.optional(v.string()),
});

export const Route = createFileRoute("/_guest/reset-password")({
  component: ResetPasswordForm,
  validateSearch: searchSchema,
});

const resetSchema = v.pipe(
  v.object({
    password: v.pipe(v.string(), v.minLength(8, "Must be at least 8 characters long")),
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords do not match",
    ),
    ["confirmPassword"],
  ),
);

function ResetPasswordForm() {
  const { token, error } = Route.useSearch();
  const navigate = useNavigate();
  const Logo = authConfig.logo;

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: resetSchema },
    onSubmit: async ({ value }) => {
      if (!token) return;

      const { error: resetError } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });

      if (resetError) {
        toast.error(resetError.message ?? "Could not reset your password.");
        return;
      }

      toast.success("Password updated. You can log in now.");
      await navigate({ to: "/login" });
    },
  });

  // A missing or rejected token is the common case here — links expire, and
  // get opened twice. Send people back to request a fresh one rather than
  // showing a form that cannot succeed.
  if (!token || error) {
    return (
      <ExpiredLink
        logo={<Logo className="size-4" />}
        reason={
          error === "INVALID_TOKEN" ? "That link has expired or was already used." : undefined
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="flex items-center gap-2 self-center font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Logo className="size-4" />
        </div>
        {authConfig.brandName}
      </Link>

      <Card>
        <CardHeader className="text-center">
          {/* CardTitle renders a div, so the h1 carries the page heading. */}
          <CardTitle className="text-xl">
            <h1>Choose a new password</h1>
          </CardTitle>
          <CardDescription>Pick something you haven&apos;t used before.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <div className="grid gap-6">
              {(
                [
                  ["password", "New password"],
                  ["confirmPassword", "Confirm new password"],
                ] as const
              ).map(([name, label]) => (
                <form.Field key={name} name={name}>
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor={field.name}>{label}</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        autoComplete="new-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                </form.Field>
              ))}

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
                    {isSubmitting ? "Saving..." : "Reset password"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function FieldError({ errors }: { errors: unknown[] }) {
  const first = errors[0];
  if (!first) return null;
  const message =
    typeof first === "string" ? first : ((first as { message?: string }).message ?? "");
  return <p className="text-sm text-destructive">{message}</p>;
}

function ExpiredLink({ logo, reason }: { logo: React.ReactNode; reason?: string }) {
  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="flex items-center gap-2 self-center font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          {logo}
        </div>
        {authConfig.brandName}
      </Link>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <h1>This link is no longer valid</h1>
          </CardTitle>
          <CardDescription>{reason ?? "The reset link is missing or incomplete."}</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm">
          <Link to="/forgot-password" className="underline underline-offset-4">
            Request a new reset link
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
