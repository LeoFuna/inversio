import { StrategyController } from '@/server/controllers/StrategyController';
import { StrategyRepoLocal } from '@/server/repositories/StrategyRepoLocal';
import { StrategyService } from '@/server/services/StrategyService';
import { NextRequest } from 'next/server';

const strategyController = new StrategyController(
  new StrategyService(new StrategyRepoLocal())
);

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return strategyController.deleteStrategy(request, params.id);
}
