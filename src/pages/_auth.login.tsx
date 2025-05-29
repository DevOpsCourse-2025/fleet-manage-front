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
import { useLogin } from "@refinedev/core";
import { useRef, useState  } from "react";
import { Link } from "react-router-dom";
import { AdminPublic } from "@/lib/types/admin";

export function Login() {  
  const { mutate: login } = useLogin<AdminPublic>();  
  const form = useRef<HTMLFormElement>(null);  
  const [invitationCode, setInvitationCode] = useState<string>("");  
  const [isLoadingCode, setIsLoadingCode] = useState(false);  
  
  async function getInvitationCode(email: string, password: string): Promise<string> {  
    setIsLoadingCode(true);  
    try {  
      const response = await fetch(`${import.meta.env.VITE_API_ORIGIN}/admin/get/${email}`, {  
        method: "POST",  
        headers: {  
          "Content-Type": "application/json",  
        },  
      });  
  
      if (response.ok) {  
        const userData = await response.json();  
        return userData.invitationCode;  
      }  
      throw new Error("No se pudo obtener el código de invitación");  
    } catch (error) {  
      console.log(error);
      throw new Error("Error al obtener el código de invitación");  
    } finally {  
      setIsLoadingCode(false);  
    }  
  }  
  
  async function handleSubmit(e: React.FormEvent) {  
    e.preventDefault();  
    if (form.current === null) return;  
      
    const email = form.current.email.value;  
    const password = form.current.password.value;  
  
    try {  
      const code = await getInvitationCode(email, password);  
      setInvitationCode(code);  
  
      const values = {  
        email,  
        password,  
        invitationCode: code,  
      };  
  
      login(values, {  
        onSuccess: (data) => {  
          if (data.success || form.current === null) return;  
          form.current.reset();  
          (form.current.email as HTMLInputElement | undefined)?.focus();  
        },  
      });  
    } catch (error) {  
      console.error("Error en el proceso de login:", error);  
    }  
  }  

  return (
    <Card className="rounded-none border-x-0 sm:mx-auto sm:w-full sm:max-w-sm sm:rounded-lg sm:border-x">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit} ref={form}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" required type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" required type="password" />
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link className="underline" to="/register">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}