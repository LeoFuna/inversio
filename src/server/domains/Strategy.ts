import { strategySchema } from '@/schemas/strategy-schemas';
import { z } from 'zod';

type StrategyType = z.infer<typeof strategySchema>;
type NewStrategyType = Omit<StrategyType, 'id'>;

export interface INewStrategy extends NewStrategyType {}

export interface IStrategy extends StrategyType {}
