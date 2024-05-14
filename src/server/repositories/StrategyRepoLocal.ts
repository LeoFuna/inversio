import db from '@/server/db/localDB';
import sqlite3 from 'sqlite3';
import { INewStrategy, IStrategy } from '../domains/Strategy';
import { IStrategyRepository } from '../interfaces/strategy/IStrategyRepository';

export class StrategyRepoLocal implements IStrategyRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = db;
  }
  async deleteStrategy(id: string): Promise<void> {
    return new Promise((resolve: () => void, reject) => {
      this.db.run(
        'UPDATE strategies SET active = ? WHERE id = ? ',
        [false, id],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
  async getStrategies(userEmail: string): Promise<IStrategy[]> {
    return new Promise((resolve: (value: IStrategy[]) => void, reject) => {
      this.db.all(
        'SELECT * FROM strategies WHERE userId = ? AND active = 1',
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
    const strategyAsDBNeeds: IStrategy = {
      ...strategy,
      id,
      active: true,
    };
    return new Promise((resolve: (value: { id: string }) => void, reject) => {
      this.db.run(
        'INSERT INTO strategies (id, name, direction, description, userId, active) VALUES (?, ?, ?, ?, ?, ?)',
        [
          strategyAsDBNeeds.id,
          strategyAsDBNeeds.name,
          strategyAsDBNeeds.direction,
          strategyAsDBNeeds.description,
          strategyAsDBNeeds.userEmail,
          strategyAsDBNeeds.active,
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
