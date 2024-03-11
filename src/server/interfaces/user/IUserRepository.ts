export interface IUserRepository {
  getUserByEmail: (email: string) => Promise<{ email: string, password: string } | null>;
}