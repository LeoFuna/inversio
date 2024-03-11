type SuccessCredentails = { email: string };
type ErrorCredentails = { status: number, error: string };

export interface IUserService {
  checkUserCredentials: (email: string, password: string) => Promise<SuccessCredentails | ErrorCredentails>
}