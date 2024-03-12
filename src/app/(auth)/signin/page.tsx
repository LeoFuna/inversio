'use client'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LockClosedIcon } from "@radix-ui/react-icons"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function Component() {
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
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Inversio</h1>
        <p className="mt-2 text-lg">Acesse sua conta</p>
      </div>
      <div className="mt-8">
        <Avatar>
          <AvatarFallback className="bg-inherit">
            <LockClosedIcon className="text-primary h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </div>
      <form className="mt-6 w-full max-w-xs" onSubmit={handleSubmit(handleFormData)}>
        <div className="flex flex-col space-y-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email
            <Input
              className="mt-1"
              id="email"
              placeholder="m@email.com"
              type="email"
              {...register('email')}
            />
          </label>
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Senha
            <Input
              className="mt-1"
              id="password"
              type="password"
              {...register('password')}
            />
          </label>
          <Button
            type="submit"
            className="mt-4 bg-blue-600 text-white"
          >
            Cadastrar
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        <Link className="underline" href="#">
          Esqueceu a senha?
        </Link>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <Link className="text-sm text-blue-600 hover:underline" href="/signup">
          Não tem conta? Cadastre-se
        </Link>
      </div>
      <footer className="absolute bottom-4 text-center text-xs text-gray-500">
        © 2024 Inversio Ltda. Todos direitos reservados.
      </footer>
    </div>
  )
}

