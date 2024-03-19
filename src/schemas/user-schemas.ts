import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' });

const signupSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Nome é obrigatório' }),
    lastName: z.string().trim(),
    email: z
      .string()
      .email({ message: 'Email inválido' })
      .min(1, { message: 'Email é obrigatório' }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'Senhas não coincidem',
      });
    }
  });

const signinSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .min(1, { message: 'Email é obrigatório' }),
  password: passwordSchema,
});

export { signinSchema, signupSchema };
