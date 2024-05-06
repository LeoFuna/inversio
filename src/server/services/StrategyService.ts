import { auth } from '../auth/auth';
import { INewStrategy, IStrategy } from '../domains/Strategy';
import { IStrategyRepository } from '../interfaces/strategy/IStrategyRepository';
import { IStrategyService } from '../interfaces/strategy/IStrategyService';

export class StrategyService implements IStrategyService {
  constructor(private readonly strategyRepository: IStrategyRepository) {}
  async deleteStrategy(
    id: string
  ): Promise<{ message: string } | { status: number; error: string }> {
    try {
      if (!id) return { status: 400, error: 'Id is required' };
      await this.strategyRepository.deleteStrategy(id);
      return { message: 'Success on delete!' };
    } catch (error: any) {
      return { status: 500, error: error.message };
    }
  }
  async getStrategies(): Promise<
    IStrategy[] | { status: number; error: string }
  > {
    try {
      const session = await auth();
      if (!session) return { status: 401, error: 'Unauthorized' };
      const response = await this.strategyRepository.getStrategies(
        session.user.email
      );

      return response.map((strategy) => {
        // TO DO: separar isso em funçao especifica
        let displayDirection = '';
        if (strategy.direction === 'ct') displayDirection = 'Contra Tendência';
        if (strategy.direction === 'td') displayDirection = 'Tendência';
        if (strategy.direction === 'neutro') displayDirection = 'Neutra';
        return { ...strategy, direction: displayDirection };
      });
    } catch (error: any) {
      return { status: 500, error: error.message };
    }
  }

  async newStrategy(
    strategy: Omit<INewStrategy, 'userEmail'>
  ): Promise<{ id: string } | { status: number; error: string }> {
    try {
      // TO DO: aqui fazer erros esperados!!!
      const session = await auth();
      if (!session) return { status: 401, error: 'Unauthorized' };
      const response = await this.strategyRepository.createStrategy({
        ...strategy,
        userEmail: session.user.email,
      });
      return response;
    } catch (error: any) {
      return { status: 500, error: error.message };
    }
  }
}
