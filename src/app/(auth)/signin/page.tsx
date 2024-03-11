'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LockClosedIcon } from "@radix-ui/react-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Login() {
  const session = useSession();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  if (session.status === 'authenticated') router.push('/');

  const handleFormData = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/',
        redirect: false,
      });
  
      if (result?.error) {
        setLoginError('Email ou senha inválidos! Favor confirmar dados');
        return
      }
    } catch (error: any) {
      setLoginError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-10.5 py-4 lg:py-16 grid place-items-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="text-3xl font-bold">Inversio</div>
          <p className="text-gray-500 dark:text-gray-400">
            Acesse a conta
          </p>
          <Avatar>
            <AvatarFallback className="bg-primary">
              <LockClosedIcon className="text-slate-50 h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-[350px] space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit(handleFormData)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                {...register('email')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                required
                type="password"
                {...register('password')}
              />
            </div>
            <Button className="w-full">Entrar</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link className="underline" href="#">
              Esqueceu a senha?
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            <Link className="underline" href="#">
              Não tem conta? Cadastre-se
            </Link>
          </div>
        </div>
      </main>
      <footer className="max-w-3xl mx-auto pb-10 grid place-items-center">
        <div className="flex flex-col gap-1 text-center text-sm">
          <p className="text-gray-500 dark:text-gray-400">© 2024 Inversio Ltda. Todos direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

