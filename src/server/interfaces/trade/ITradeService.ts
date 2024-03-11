type SuccessTradeAdd = { id: Trade['id'] };
type ErrorTradeAdd = { status: number, error: string };

export interface ITradeService {
  addTrade(trade: Trade): Promise<SuccessTradeAdd | ErrorTradeAdd>;
}