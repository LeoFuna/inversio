import { z } from 'zod';

const signupSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: 'Nome é obrigatório' }),
  lastName: z.string()
    .trim(),
  email: z.string()
    .email({ message: 'Email inválido' })
    .min(1, { message: 'Email é obrigatório' }),
  password: z.string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
  confirmPassword: z.string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      path: ['confirmPassword'],
      code: 'custom',
      message: 'Senhas não coincidem',
    });
  }
});

export {
  signupSchema
}