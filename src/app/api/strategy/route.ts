import { StrategyController } from '@/server/controllers/StrategyController';
import { StrategyRepoLocal } from '@/server/repositories/StrategyRepoLocal';
import { StrategyService } from '@/server/services/StrategyService';
import { NextRequest } from 'next/server';

const strategyController = new StrategyController(
  new StrategyService(new StrategyRepoLocal())
);

export async function POST(request: NextRequest) {
  return strategyController.newStrategy(request);
}

export async function GET(request: NextRequest) {
  return strategyController.getStrategies(request);
}
