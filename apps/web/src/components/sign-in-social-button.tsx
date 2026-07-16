import { authClient } from "@repo/auth/auth-client";
import { Button } from "@repo/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SocialLoginButtonProps {
  provider: string;
  icon: React.ReactNode;
  disabled?: boolean;
  callbackURL: string;
  /** Leading verb for the button label, e.g. "Login with" (default) or "Sign up with". */
  label?: string;
}

export function SignInSocialButton(props: SocialLoginButtonProps) {
  const providerLabel =
    props.provider === "github"
      ? "GitHub"
      : props.provider.charAt(0).toUpperCase() + props.provider.slice(1);

  const mutation = useMutation({
    mutationFn: async () =>
      await authClient.signIn.social(
        {
          provider: props.provider,
          callbackURL: props.callbackURL,
        },
        {
          onError: ({ error }) => {
            toast.error(error.message || `An error occurred during ${providerLabel} sign-in.`);
          },
        },
      ),
  });

  return (
    <Button
      variant="secondary"
      className="w-full"
      type="button"
      disabled={mutation.isSuccess || mutation.isPending || props.disabled}
      onClick={() => mutation.mutate()}
    >
      {props.icon}
      {props.label ?? "Login with"} {providerLabel}
    </Button>
  );
}
