import { authClient } from "@repo/auth/auth-client";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LoaderCircleIcon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as v from "valibot";

import { SignInSocialButton } from "#/components/sign-in-social-button";
import { authConfig } from "#/config/auth";

export const Route = createFileRoute("/_guest/signup")({
  component: SignupForm,
});

const SignupSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.trim(), v.minLength(1, "Please enter your name.")),
    email: v.pipe(v.string(), v.email("Enter a valid email address.")),
    password: v.pipe(v.string(), v.minLength(8, "Must be at least 8 characters long.")),
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      "Passwords do not match.",
    ),
    ["confirmPassword"],
  ),
);

type FieldErrors = Partial<Record<keyof v.InferInput<typeof SignupSchema>, string>>;

function SignupForm() {
  const { redirectUrl } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FieldErrors>({});

  const { mutate: signupMutate, isPending } = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      await authClient.signUp.email(
        {
          ...data,
          callbackURL: redirectUrl,
        },
        {
          onError: ({ error }) => {
            toast.error(error.message || "An error occurred while signing up.");
          },
          onSuccess: () => {
            queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });
            navigate({ to: redirectUrl });
          },
        },
      );
    },
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const formData = new FormData(e.currentTarget);
    const result = v.safeParse(SignupSchema, {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirm_password"),
    });

    if (!result.success) {
      const flat = v.flatten<typeof SignupSchema>(result.issues);
      setErrors({
        name: flat.nested?.name?.[0],
        email: flat.nested?.email?.[0],
        password: flat.nested?.password?.[0],
        confirmPassword: flat.nested?.confirmPassword?.[0],
      });
      return;
    }

    setErrors({});
    const { name, email, password } = result.output;
    signupMutate({ name, email, password });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                readOnly={isPending}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                readOnly={isPending}
                aria-invalid={!!errors.email}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  We&apos;ll use this to contact you. We will not share your email with anyone else.
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                readOnly={isPending}
                aria-invalid={!!errors.password}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">{errors.password}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Must be at least 8 characters long.</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                readOnly={isPending}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword ? (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Please confirm your password.</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <LoaderCircleIcon className="animate-spin" />}
                {isPending ? "Creating account..." : "Create Account"}
              </Button>
              {authConfig.ssoEnabled && (
                <SignInSocialButton
                  provider={authConfig.ssoProvider}
                  providerLabel={authConfig.ssoLabel}
                  label="Sign up with"
                  callbackURL={redirectUrl}
                  disabled={isPending}
                  icon={<ShieldCheckIcon className="size-4" />}
                />
              )}
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
