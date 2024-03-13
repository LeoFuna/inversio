'use client'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/spinner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { LockClosedIcon } from "@radix-ui/react-icons"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function Signin() {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });
  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      // Simulate a slow network request
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/',
        redirect: false,
      })
      if (response?.error) {
        throw new Error('Email ou senha inválidos! Favor confirmar dados')
      }
      router.push('/')
      return response
    }
  })

  if (mutation.isError) {
    toast({
      description: 'Email ou senha inválidos! Favor confirmar dados',
      variant: 'destructive',
      className: 'font-bold',
      duration: 3000
    })
    mutation.reset()
  }
  
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
      <form className="mt-6 w-full max-w-xs" onSubmit={handleSubmit((formData: any) => mutation.mutate(formData))}>
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
            { mutation.isPending ? <LoadingSpinner size={24} className="text-white" /> : 'Entrar' }
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

