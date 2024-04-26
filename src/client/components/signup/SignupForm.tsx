'use client';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { signupSchema } from '@/schemas/user-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ButtonWithLoading from '../core/ButtonWithLoading';
import { Form, FormLabel, FormMessage } from '../core/form';

export default function SignupForm() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signupSchema),
  });

  const mutation = useMutation({
    mutationFn: async (formData: z.infer<typeof signupSchema>) => {
      const { confirmPassword, ...rest } = formData;
      const createResponse = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(rest),
      }).then((data) => ({ status: data.status, body: data.json() }));

      if (createResponse.status !== 201) {
        throw new Error(await createResponse.body);
      }

      return createResponse;
    },
  });

  if (mutation.isError) {
    toast({
      description: 'Ops! Algo deu errado no cadastro...',
      variant: 'destructive',
      className: 'font-bold',
      duration: 3000,
    });
    mutation.reset();
  }
  if (mutation.isSuccess) {
    toast({
      description: 'Cadastro criado com sucesso!!',
      className: 'font-bold bg-primary text-white',
      duration: 3000,
    });
    mutation.reset();
    setTimeout(() => router.push('/signin'), 1500);
  }

  return (
    <Form
      className="max-w-xs"
      onSubmit={handleSubmit((formData) => mutation.mutate(formData))}
    >
      <div className="flex flex-col space-y-4">
        <FormLabel htmlFor="name">
          Nome
          <Input
            className="mt-1"
            id="name"
            {...register('name')}
            placeholder="Seu primeiro nome"
            type="text"
          />
          <FormMessage message={errors.name?.message} />
        </FormLabel>
        <FormLabel htmlFor="lastName">
          Sobrenome
          <Input
            className="mt-1"
            id="lastName"
            {...register('lastName')}
            placeholder="Seu nome sobrenome"
            type="text"
          />
        </FormLabel>
        <FormLabel htmlFor="email">
          Email
          <Input
            className="mt-1"
            id="email"
            {...register('email')}
            placeholder="m@example.com"
            type="email"
          />
          <FormMessage message={errors.email?.message} />
        </FormLabel>
        <FormLabel htmlFor="password">
          Senha
          <Input
            className="mt-1"
            id="password"
            {...register('password')}
            placeholder="******"
            type="password"
          />
          <FormMessage message={errors.password?.message} />
        </FormLabel>
        <FormLabel htmlFor="confirm-password">
          Confirmar Senha
          <Input
            className="mt-1"
            id="confirm-password"
            {...register('confirmPassword')}
            placeholder="******"
            type="password"
          />
          <FormMessage message={errors.confirmPassword?.message} />
        </FormLabel>
        <ButtonWithLoading isLoading={mutation.isPending}>
          Cadastrar
        </ButtonWithLoading>
      </div>
    </Form>
  );
}
