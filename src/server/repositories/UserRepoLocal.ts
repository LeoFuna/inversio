import db from "@/server/db/localDB"
import { IUserRepository } from '../interfaces/user/IUserRepository';
import sqlite3 from "sqlite3";

export class UserRepoLocal implements IUserRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = db;
  }

  async getUserByEmail(email: string) {
    return new Promise((resolve: (value: { email: string, password: string } | null) => void, reject) => {
      this.db.get('SELECT * FROM users WHERE email = ?', [email], (err, row: { name: string, lastName: string, email: string, password: string }) => {
        if (err) {
          reject(err);
        } else {
          if (!row) return resolve(null);
          const result = { email: row.email, password: row.password };
          resolve(result);
        }
      });
    });
  }
}