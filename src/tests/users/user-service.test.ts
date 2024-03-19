import { IUserRepository } from '@/server/interfaces/user/IUserRepository';
import { UserService } from '@/server/services/UserService';

describe('User Service', () => {
  describe('check user credentials to log in', () => {
    it('should return email with valid credentials', async () => {
      const validBody: { email: string; password: string } = {
        email: 'valid-user@email.com',
        password: '123456',
      };

      const mockedRepository: IUserRepository = {
        getUserByEmail: jest.fn().mockResolvedValue(validBody),
      };

      const userService = new UserService(mockedRepository);
      const response = await userService.checkUserCredentials(
        validBody.email,
        validBody.password
      );

      expect(response).toEqual({ email: validBody.email });
    });

    it('should return Invalid Credentials when email not exists', async () => {
      const invalidPayload: { email: string; password: string } = {
        email: 'not-registered-user@email.com',
        password: '123456',
      };

      const mockedRepository: IUserRepository = {
        getUserByEmail: jest.fn().mockResolvedValue(null),
      };

      const userService = new UserService(mockedRepository);
      const response = await userService.checkUserCredentials(
        invalidPayload.email,
        invalidPayload.password
      );

      expect(response).toEqual({ error: 'Not registered User', status: 404 });
    });

    it('should return Invalid Credentials when password dont match with DB', async () => {
      const invalidPayload: { email: string; password: string } = {
        email: 'valid-user@email.com',
        password: 'invalidPassword',
      };

      const mockedRepository: IUserRepository = {
        getUserByEmail: jest
          .fn()
          .mockResolvedValue({
            email: invalidPayload.email,
            password: '123456',
          }),
      };

      const userService = new UserService(mockedRepository);
      const response = await userService.checkUserCredentials(
        invalidPayload.email,
        invalidPayload.password
      );

      expect(response).toEqual({ error: 'Invalid Credentials', status: 401 });
    });
  });
});
