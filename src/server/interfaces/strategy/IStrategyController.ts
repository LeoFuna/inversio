import { IStrategy } from '@/server/domains/Strategy';
import { NextRequest, NextResponse } from 'next/server';

export interface IStrategyController {
  newStrategy(
    req: NextRequest
  ): Promise<NextResponse<{ id: string } | { message: string } | null>>;
  getStrategies(
    req: NextRequest
  ): Promise<NextResponse<IStrategy[] | { message: string } | null>>;
  deleteStrategy(
    req: NextRequest,
    id: string
  ): Promise<NextResponse<{ message: string } | null>>;
  getUniqueStrategy(
    req: NextRequest,
    id: string
  ): Promise<NextResponse<IStrategy | { message: string } | null>>;
}
