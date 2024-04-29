import { IStrategy } from '@/server/domains/Strategy';
import { NextRequest, NextResponse } from 'next/server';

export interface IStrategyController {
  newStrategy(
    req: NextRequest
  ): Promise<NextResponse<{ id: string } | { message: string } | null>>;
  getStrategies(
    req: NextRequest
  ): Promise<NextResponse<IStrategy[] | { message: string } | null>>;
}
