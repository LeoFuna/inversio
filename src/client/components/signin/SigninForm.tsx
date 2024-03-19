'use client';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { signinSchema } from '@/schemas/user-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import ButtonWithLoading from '../core/buttonWithLoading';
import { Form, FormLabel, FormMessage } from '../core/form';

export default function SigninForm() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signinSchema),
  });

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      // Simulate a slow network request
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/',
        redirect: false,
      });
      if (response?.error) {
        throw new Error('Email ou senha inválidos! Favor confirmar dados');
      }
      router.push('/');
      return response;
    },
  });

  if (mutation.isError) {
    toast({
      description: 'Email ou senha inválidos! Favor confirmar dados',
      variant: 'destructive',
      className: 'font-bold',
      duration: 3000,
    });
    mutation.reset();
  }

  return (
    <Form onSubmit={handleSubmit((formData) => mutation.mutate(formData))}>
      <div className="flex flex-col space-y-4">
        <FormLabel htmlFor="email">
          {'Email'}
          <Input
            className="mt-1"
            id="email"
            placeholder="m@email.com"
            {...register('email')}
          />
          <FormMessage message={errors.email?.message} />
        </FormLabel>
        <FormLabel htmlFor="password">
          {'Senha'}
          <Input
            className="mt-1"
            id="password"
            type="password"
            {...register('password')}
          />
          <FormMessage message={errors.password?.message} />
        </FormLabel>
        <ButtonWithLoading isLoading={mutation.isPending} title="Entrar" />
      </div>
    </Form>
  );
}
