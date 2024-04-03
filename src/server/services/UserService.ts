import { IUser } from '../domains/User';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { IUserService } from '../interfaces/user/IUserService';

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}
  async createUser(user: IUser) {
    const userFound = await this.userRepository.getUserByEmail(user.email);
    if (!!userFound) {
      return { status: 401, error: 'User already created!' };
    }
    // TO DO: validaçoes dos dados passados!
    const userCreated = await this.userRepository.createUser(user);
    return userCreated;
  }

  async checkUserCredentials(email: string, password: string) {
    const result = await this.userRepository.getUserByEmail(email);
    if (!result) return { status: 404, error: 'Not registered User' };
    if (result.password !== password)
      return { status: 401, error: 'Invalid Credentials' };

    return { email: result?.email, firstName: result?.firstName };
  }
}
