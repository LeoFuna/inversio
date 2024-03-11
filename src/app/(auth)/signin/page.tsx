'use client'
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

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
    <main className="h-dvh flex items-center">
      <Card className="mx-auto max-w-sm h-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">Login</CardTitle>
          <CardDescription>Entre com seu email e senha para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(handleFormData)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@email.com"
                required
                type="email"
                {...register('email')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senhas</Label>
              <Input
                id="password"
                required
                type="password"
                {...register('password')}
              />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

