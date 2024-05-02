import { NextRequest, NextResponse } from 'next/server';
import { INewStrategy, IStrategy } from '../domains/Strategy';
import { IStrategyController } from '../interfaces/strategy/IStrategyController';
import { IStrategyService } from '../interfaces/strategy/IStrategyService';

export class StrategyController implements IStrategyController {
  constructor(private readonly strategyService: IStrategyService) {}
  async getStrategies(
    _req: NextRequest
  ): Promise<NextResponse<IStrategy[] | { message: string } | null>> {
    try {
      const response = await this.strategyService.getStrategies();
      if ('error' in response) {
        return NextResponse.json(
          { message: response.error },
          { status: response.status }
        );
      }
      return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(null, { status: 500 });
    }
  }

  async newStrategy(
    req: NextRequest
  ): Promise<NextResponse<{ id: string } | { message: string } | null>> {
    const body: Omit<INewStrategy, 'userEmail'> = await req.json();

    try {
      const response = await this.strategyService.newStrategy(body);
      if ('error' in response) {
        return NextResponse.json(
          { message: response.error },
          { status: response.status }
        );
      }
      return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(null, { status: 500 });
    }
  }
}
