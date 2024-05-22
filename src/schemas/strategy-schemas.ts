import { z } from 'zod';

const newStrategyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Nome deve ter no min 2 characteres' }),
  direction: z.enum(['ct', 'td', 'neutro']),
  description: z.string(),
});

const newStrategySchema = z.object({
  ...newStrategyFormSchema.shape,
  userEmail: z.string().email({ message: 'Email inválido' }),
});

const strategySchema = z.object({
  id: z.string().uuid(),
  active: z.boolean(),
  ...newStrategySchema.shape,
});

export { newStrategyFormSchema, newStrategySchema, strategySchema };
