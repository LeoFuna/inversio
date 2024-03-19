import { NextRequest, NextResponse } from 'next/server';
import { ITradeController } from '../interfaces/trade/ITradeController';
import { ITradeService } from '../interfaces/trade/ITradeService';

export class TradeController implements ITradeController {
  constructor(private readonly tradeService: ITradeService) {}
  async addTrade(
    req: NextRequest
  ): Promise<NextResponse<{ id: string } | { message: string } | null>> {
    const body: Trade = await req.json();
    try {
      const response = await this.tradeService.addTrade(body);
      if ('error' in response) {
        return NextResponse.json(
          { message: response.error },
          { status: response.status }
        );
      }
      return NextResponse.json(response);
    } catch (error: any) {
      return NextResponse.json(null, { status: 500 });
    }
  }
}
