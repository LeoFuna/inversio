import db from '@/server/db/localDB';
import sqlite3 from 'sqlite3';

export class TradesRepoLocal implements ITradeRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = db;
  }
  async addTrade(trade: Trade): Promise<{ id: Trade['id'] }> {
    const id = crypto.randomUUID();
    return new Promise(
      (resolve: (value: { id: Trade['id'] }) => void, reject) => {
        this.db.run(
          'INSERT INTO trades (id, code, priceInCents, quantity, date, resultInCents) VALUES (?, ?, ?, ?, ?, ?)',
          [
            id,
            trade.code,
            trade.priceInCents,
            trade.quantity,
            trade.date,
            trade.resultInCents,
          ],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve({ id });
            }
          }
        );
      }
    );
  }
}
