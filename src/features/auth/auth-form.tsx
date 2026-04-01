import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { authApi } from "@/shared/lib/api";

const optionalNameSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.string().min(2).optional(),
);

const authSchema = z.object({
  name: optionalNameSchema,
  email: z.string().email(),
  password: z.string().min(6),
});

type AuthFormValues = z.infer<typeof authSchema>;

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isSignup = mode === "signup";
  const authMutation = useMutation({
    mutationFn: (values: AuthFormValues) =>
      isSignup
        ? authApi.signUp({
            email: values.email,
            password: values.password,
            name: values.name,
          })
        : authApi.login({
            email: values.email,
            password: values.password,
          }),
  });

  const onSubmit = async (values: AuthFormValues) => {
    await authMutation.mutateAsync(values);
    navigate("/topics");
  };

  return (
    <Card className="w-full max-w-md border-border/70 bg-background/95 shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold">{isSignup ? "Create account" : "Welcome back"}</CardTitle>
        <CardDescription>
          {isSignup
            ? "Start building topic-based study sessions with AI help."
            : "Continue from your last session and keep the learning flow active."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input placeholder="Your name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="student@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
            {isSignup ? "Create account" : "Sign in"}
            <ArrowRight className="h-4 w-4" />
          </Button>
          {authMutation.error && (
            <p className="text-sm text-red-600">{authMutation.error.message}</p>
          )}
        </form>

        <Separator className="my-6" />

        <p className="mt-6 text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link className="font-semibold text-primary" to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Sign in" : "Create one"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
