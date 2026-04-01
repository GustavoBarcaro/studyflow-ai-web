import { AuthForm } from "@/features/auth/form";
import { AuthShell } from "@/shared/components/layout/auth-shell";

export function SignupPage() {
  return (
    <AuthShell>
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
