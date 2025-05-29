import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPublic } from "@/lib/types/admin";
import { useRegister } from "@refinedev/core";
import { useRef } from "react";
import { Link } from "react-router-dom";

type RegisterVariables = {
  email: string;
  password: string;
  invitation: string;
};

export function Register() {
  const { mutate: register } = useRegister<AdminPublic>();
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.current === null) return;
    const values = {
      email: form.current.email.value,
      password: form.current.password.value,
      invitationCode: form.current.invitation.value,
    };
    register(values, {
      onSuccess: (data) => {
        if (data.success || form.current === null) return;
        form.current.reset();
        (form.current.email as HTMLInputElement | undefined)?.focus();
      },
    });
  };

  return (
    <Card className="rounded-none border-x-0 sm:mx-auto sm:w-full sm:max-w-sm sm:rounded-lg sm:border-x">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit} ref={form}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invitation">Invitation token</Label>
            <Input id="invitation" name="invitation" required />
          </div>
          <Button className="w-full" type="submit">
            Create an account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}