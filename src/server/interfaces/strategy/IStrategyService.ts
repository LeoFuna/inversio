import { INewStrategy, IStrategy } from '@/server/domains/Strategy';

type SuccessCreateStrategy = { id: IStrategy['id'] };
export type ErrorStrategy = { status: number; error: string };

export interface IStrategyService {
  newStrategy(
    strategy: Omit<INewStrategy, 'userEmail'>
  ): Promise<SuccessCreateStrategy | ErrorStrategy>;
  getStrategies(): Promise<IStrategy[] | ErrorStrategy>;
  deleteStrategy(id: string): Promise<{ message: string } | ErrorStrategy>;
  getUniqueStrategy(id: IStrategy['id']): Promise<IStrategy | ErrorStrategy>;
}
