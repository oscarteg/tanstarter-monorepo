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
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";

import { authConfig } from "#/config/auth";

export const Route = createFileRoute("/_guest/forgot-password")({
  component: ForgotPasswordForm,
});

function ForgotPasswordForm() {
  const Logo = authConfig.logo;

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });
      // Swallowed on purpose. Reporting "no such account" here would turn this
      // form into an account-enumeration oracle, so the UI shows the same
      // confirmation either way and the detail stays in the server logs.
      if (error) console.error(error);
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const email = new FormData(e.currentTarget).get("email") as string;
    if (!email) return;

    mutate(email);
  };

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
            <h1>{isSuccess ? "Check your email" : "Forgot your password?"}</h1>
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? "If that address has an account, a reset link is on its way."
              : "Enter your email and we'll send you a link to choose a new one."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <p className="text-center text-sm text-muted-foreground">
              The link expires in one hour. Nothing arrived? Check your spam folder, or{" "}
              <Link to="/forgot-password" className="underline underline-offset-4">
                try again
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    readOnly={isPending}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && <LoaderCircleIcon className="animate-spin" />}
                  {isPending ? "Sending..." : "Send reset link"}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            Remembered it?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
