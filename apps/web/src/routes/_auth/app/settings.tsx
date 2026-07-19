import { authClient } from "@repo/auth/auth-client";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { SectionHeader } from "@repo/ui/components/rams-core";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import * as v from "valibot";

export const Route = createFileRoute("/_auth/app/settings")({
  component: SettingsScreen,
});

const profileSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1, "Name is required")),
});

const passwordSchema = v.pipe(
  v.object({
    currentPassword: v.pipe(v.string(), v.minLength(1, "Enter your current password")),
    newPassword: v.pipe(v.string(), v.minLength(8, "Must be at least 8 characters long")),
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [["newPassword"], ["confirmPassword"]],
      (input) => input.newPassword === input.confirmPassword,
      "Passwords do not match",
    ),
    ["confirmPassword"],
  ),
);

/**
 * Account settings. Doubles as the template's reference example for forms:
 * TanStack Form with a Valibot schema as the validator, which is the same
 * validator used on the server (see `packages/notes/src/server.ts`).
 */
function SettingsScreen() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      <ProfileSection />
      <PasswordSection />
      <DangerSection />
    </div>
  );
}

/** Field error text, kept consistent across the three forms. */
function FieldError({ errors }: { errors: unknown[] }) {
  const first = errors[0];
  if (!first) return null;
  const message =
    typeof first === "string" ? first : ((first as { message?: string }).message ?? "");
  return <p className="text-sm text-destructive">{message}</p>;
}

function ProfileSection() {
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(authQueryOptions());

  const form = useForm({
    defaultValues: { name: user?.name ?? "" },
    validators: { onSubmit: profileSchema },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.updateUser({ name: value.name });
      if (error) {
        toast.error(error.message ?? "Could not update your profile.");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey });
      toast.success("Profile updated.");
    },
  });

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader label="Profile" />
      <form
        className="flex max-w-md flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="name">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email ?? ""} disabled readOnly />
          <p className="text-sm text-muted-foreground">Your email address cannot be changed.</p>
        </div>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-fit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Save changes
            </Button>
          )}
        </form.Subscribe>
      </form>
    </section>
  );
}

function PasswordSection() {
  const form = useForm({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validators: { onSubmit: passwordSchema },
    onSubmit: async ({ value, formApi }) => {
      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        // Keep other devices signed in; flip to true to force re-auth everywhere.
        revokeOtherSessions: false,
      });
      if (error) {
        toast.error(error.message ?? "Could not change your password.");
        return;
      }
      formApi.reset();
      toast.success("Password changed.");
    },
  });

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader label="Password" />
      <form
        className="flex max-w-md flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
      >
        {(
          [
            ["currentPassword", "Current password"],
            ["newPassword", "New password"],
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
                  autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>
        ))}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-fit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Change password
            </Button>
          )}
        </form.Subscribe>
      </form>
    </section>
  );
}

function DangerSection() {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const { error } = await authClient.deleteUser();
    if (error) {
      toast.error(error.message ?? "Could not delete your account.");
      return;
    }
    await navigate({ to: "/login" });
  };

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader label="Danger zone" />
      <div className="flex max-w-md flex-col gap-3 border border-destructive/40 p-4">
        <p className="text-sm text-muted-foreground">
          Deleting your account removes it and all of its data. This cannot be undone.
        </p>
        <Dialog>
          <DialogTrigger render={<Button variant="destructive" className="w-fit" />}>
            Delete account
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                This permanently deletes your account and all of its data. This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
              <Button variant="destructive" onClick={handleDelete}>
                Yes, delete my account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
