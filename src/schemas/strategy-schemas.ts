import { z } from 'zod';

const newStrategyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Nome deve ter no min 2 characteres' }),
  direction: z.string().min(1, { message: 'Direção é obrigatória' }),
  description: z
    .string()
    .min(1, { message: 'Descrição da estratégia é obrigatória' }),
});

const newStrategySchema = z.object({
  ...newStrategyFormSchema.shape,
  userEmail: z.string().email({ message: 'Email inválido' }),
});

const strategySchema = z.object({
  id: z.string().uuid(),
  ...newStrategySchema.shape,
});

export { newStrategyFormSchema, newStrategySchema, strategySchema };
