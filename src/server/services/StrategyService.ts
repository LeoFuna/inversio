import { getSession } from '../auth/auth';
import { INewStrategy, IStrategy } from '../domains/Strategy';
import { IStrategyRepository } from '../interfaces/strategy/IStrategyRepository';
import {
  ErrorStrategy,
  IStrategyService,
} from '../interfaces/strategy/IStrategyService';

export class StrategyService implements IStrategyService {
  constructor(private readonly strategyRepository: IStrategyRepository) {}
  async getUniqueStrategy(id: string): Promise<IStrategy | ErrorStrategy> {
    if (!id) return { status: 400, error: 'Id is required' };
    const response = await this.strategyRepository.getUniqueStrategy(id);
    return response;
  }

  async deleteStrategy(
    id: string
  ): Promise<{ message: string } | { status: number; error: string }> {
    if (!id) return { status: 400, error: 'Id is required' };
    await this.strategyRepository.deleteStrategy(id);
    return { message: 'Success on delete!' };
  }

  async getStrategies(): Promise<
    IStrategy[] | { status: number; error: string }
  > {
    const session = await getSession();
    if (!session) return { status: 401, error: 'Unauthorized' };
    const response = await this.strategyRepository.getStrategies(
      session.user.email
    );

    return response;
  }

  async newStrategy(
    strategy: Omit<INewStrategy, 'userEmail'>
  ): Promise<{ id: string } | { status: number; error: string }> {
    // TO DO: aqui fazer erros esperados!!!
    const session = await getSession();
    if (!session) return { status: 401, error: 'Unauthorized' };
    const response = await this.strategyRepository.createStrategy({
      ...strategy,
      userEmail: session.user.email,
    });
    return response;
  }
}
