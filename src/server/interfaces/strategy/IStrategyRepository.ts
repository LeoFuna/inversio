import { INewStrategy, IStrategy } from '@/server/domains/Strategy';

export interface IStrategyRepository {
  createStrategy(strategy: INewStrategy): Promise<{ id: IStrategy['id'] }>;
  getStrategies(userEmail: string): Promise<IStrategy[]>;
}
