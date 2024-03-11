import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IUserService } from "../interfaces/user/IUserService";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}
  
  async checkUserCredentials(email: string, password: string) {
    const result = await this.userRepository.getUserByEmail(email);
    if (!result) return { status: 404, error: "Not registered User"};
    if (result.password !== password) return { status: 401, error: "Invalid Credentials"};

    return { email: result?.email }
  }

}