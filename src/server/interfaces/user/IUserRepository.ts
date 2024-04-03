import { IUser } from '@/server/domains/User';

export interface IUserRepository {
  getUserByEmail: (
    email: string
  ) => Promise<{ email: string; password: string; firstName: string } | null>;
  createUser: (user: IUser) => Promise<Pick<IUser, 'email'>>;
}
