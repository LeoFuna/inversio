import { ITradeService } from "../interfaces/trade/ITradeService";

export class TradesService implements ITradeService {
  constructor(private readonly tradeRepository: ITradeRepository) {}

  async addTrade(trade: Trade): Promise<{ id: string; } | { status: number; error: string; }> {
    try {
      // TO DO: aqui fazer erros esperados!!!
      const response = await this.tradeRepository.addTrade(trade);
      return response;
    } catch (error: any) {
      return { status: 500, error: error.message };
    }
  }
}