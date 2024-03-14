'use client'
import React from 'react'
import { Form, FormLabel } from '../core/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import ButtonWithLoading from '../core/buttonWithLoading';


export default function SignupForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      // Simulate a slow network request
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const response: any = 'after creating user, redirect to signin page'
      if (response?.error) {
        throw new Error('Email ou senha inválidos! Favor confirmar dados')
      }
      router.push('/signin')
      return response
    }
  })

  if (mutation.isError) {
    toast({
      description: 'Ops! Algo deu errado no cadastro...',
      variant: 'destructive',
      className: 'font-bold',
      duration: 3000
    })
    mutation.reset()
  }

  return (
    <Form onSubmit={handleSubmit((formData) => mutation.mutate(formData))}>
      <div className="flex flex-col space-y-4">
        <FormLabel htmlFor="username">
          Nome de usuário
          <Input
            className="mt-1"
            id="username"
            { ...register('username') }
            placeholder="Seu nome de usuário"
            type="text"
          />
        </FormLabel>
        <FormLabel htmlFor="email">
          Email
          <Input
            className="mt-1"
            id="email"
            { ...register('email') }
            placeholder="m@example.com"
            type="email"
          />
        </FormLabel>
        <FormLabel htmlFor="password">
          Senha
          <Input
            className="mt-1"
            id="password"
            { ...register('password') }
            placeholder="********"
            type="password"
          />
        </FormLabel>
        <FormLabel htmlFor="confirm-password">
          Confirmar Senha
          <Input
            className="mt-1"
            id="confirm-password"
            { ...register('confirmPassword') }
            placeholder="********"
            type="password"
          />
        </FormLabel>
        <ButtonWithLoading
          isLoading={mutation.isPending}
          title='Cadastrar'
        />
      </div>
    </Form>
  )
}