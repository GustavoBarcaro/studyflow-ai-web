import { AuthForm } from "@/features/auth/form";
import { AuthShell } from "@/shared/components/layout/auth-shell";

export function LoginPage() {
  return (
    <AuthShell>
      <AuthForm mode="login" />
    </AuthShell>
  );
}
