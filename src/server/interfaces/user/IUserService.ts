import { IUser } from '@/server/domains/User';

type SuccessCredentails = { email: string; firstName: string };
type ErrorCredentails = { status: number; error: string };

export interface IUserService {
  checkUserCredentials: (
    email: string,
    password: string
  ) => Promise<SuccessCredentails | ErrorCredentails>;
  createUser: (user: IUser) => Promise<Pick<IUser, 'email'> | ErrorCredentails>;
}
