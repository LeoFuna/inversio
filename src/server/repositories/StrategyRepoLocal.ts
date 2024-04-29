import db from '@/server/db/localDB';
import sqlite3 from 'sqlite3';
import { INewStrategy, IStrategy } from '../domains/Strategy';
import { IStrategyRepository } from '../interfaces/strategy/IStrategyRepository';

export class StrategyRepoLocal implements IStrategyRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = db;
  }
  async getStrategies(userEmail: string): Promise<IStrategy[]> {
    return new Promise((resolve: (value: IStrategy[]) => void, reject) => {
      this.db.all(
        'SELECT * FROM strategies WHERE userId = ?',
        [userEmail],
        (err, rows: IStrategy[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  async createStrategy(strategy: INewStrategy): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    return new Promise((resolve: (value: { id: string }) => void, reject) => {
      this.db.run(
        'INSERT INTO strategies (id, name, direction, description, userId) VALUES (?, ?, ?, ?, ?)',
        [
          id,
          strategy.name,
          strategy.direction,
          strategy.description,
          strategy.userEmail,
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({ id });
          }
        }
      );
    });
  }
}
