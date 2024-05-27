import { NextRequest, NextResponse } from 'next/server';
import { INewStrategy, IStrategy } from '../domains/Strategy';
import { IStrategyController } from '../interfaces/strategy/IStrategyController';
import {
  ErrorStrategy,
  IStrategyService,
} from '../interfaces/strategy/IStrategyService';

const handleKnownError = (response: ErrorStrategy) => {
  return NextResponse.json(
    { message: response.error },
    { status: response.status }
  );
};

export class StrategyController implements IStrategyController {
  constructor(private readonly strategyService: IStrategyService) {}
  async getUniqueStrategy(
    req: NextRequest,
    id: string
  ): Promise<NextResponse<IStrategy | { message: string } | null>> {
    try {
      const response = await this.strategyService.getUniqueStrategy(id);
      if ('error' in response) return handleKnownError(response);

      return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(error.message, { status: 500 });
    }
  }

  async deleteStrategy(
    req: NextRequest,
    id: string
  ): Promise<NextResponse<{ message: string }>> {
    try {
      const response = await this.strategyService.deleteStrategy(id);
      if ('error' in response) return handleKnownError(response);

      return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(error.message, { status: 500 });
    }
  }
  async getStrategies(
    _req: NextRequest
  ): Promise<NextResponse<IStrategy[] | { message: string }>> {
    try {
      const response = await this.strategyService.getStrategies();
      if ('error' in response) return handleKnownError(response);

      return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(error.message, { status: 500 });
    }
  }

  async newStrategy(
    req: NextRequest
  ): Promise<NextResponse<{ id: string } | { message: string }>> {
    const body: Omit<INewStrategy, 'userEmail'> = await req.json();

    try {
      const response = await this.strategyService.newStrategy(body);
      if ('error' in response) return handleKnownError(response);

      return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(error.message, { status: 500 });
    }
  }
}
