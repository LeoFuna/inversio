type Trade = {
  id: string;
  code: string,
  priceInCents: number,
  quantity: number,
  date: string,
  resultInCents: number
}

interface ITradeRepository {
  addTrade(trade: Trade): Promise<{ id: Trade['id'] }>
}