import { UserController } from '@/server/controllers/UserController';

describe('User Controller', () => {
  describe('check user credentials to log in', () => {
    it('should return 200 and user email when credentials are correct', async () => {
      const validBody: { email: string; password: string } = {
        email: 'valid-user@email.com',
        password: '123456',
      };
      const mockedService = {
        checkUserCredentials: jest.fn().mockResolvedValue({
          email: validBody.email,
        }),
      };

      const nextReq: any = {
        json: () => Promise.resolve(validBody),
      };
      const userController = new UserController(mockedService);
      const response = await userController.checkUserCredentials(nextReq);

      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toEqual({ email: validBody.email });
    });

    it('should return status 401 with Invalid Credential message when credential invalid', async () => {
      const validBodyWrongCredentials: { email: string; password: string } = {
        email: 'valid-user@email.com',
        password: 'wrongPassword',
      };
      const mockedUserService = {
        checkUserCredentials: jest.fn().mockResolvedValue({
          error: 'Invalid Credentials',
          status: 401,
        }),
      };

      const nextReq: any = {
        json: () => Promise.resolve(validBodyWrongCredentials),
      };
      const userController = new UserController(mockedUserService);
      const response = await userController.checkUserCredentials(nextReq);

      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({ message: 'Invalid Credentials' });
    });

    it('should return status 401 with Invalid Credential message when email or password is empty', async () => {
      const emptyPasswordBody: { email: string; password: string } = {
        email: 'valid-user@email.com',
        password: '',
      };
      const mockedUserService: any = {};

      let nextReq: any = {
        json: () => Promise.resolve(emptyPasswordBody),
      };
      const userController = new UserController(mockedUserService);
      const response = await userController.checkUserCredentials(nextReq);
      // Empty Password
      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody).toEqual({ message: 'Invalid Credentials' });
      // Empty Email
      const emptyEmailBody: { email: string; password: string } = {
        email: '',
        password: '123456',
      };
      nextReq = {
        json: () => Promise.resolve(emptyEmailBody),
      };
      const response2 = await userController.checkUserCredentials(nextReq);
      expect(response2.status).toBe(401);
      const response2Body = await response2.json();
      expect(response2Body).toEqual({ message: 'Invalid Credentials' });
    });

    it('should return status 500 with Internal Error message when unexpected error happens', async () => {
      const validBody: { email: string; password: string } = {
        email: 'valid-user@email.com',
        password: '123456',
      };
      const mockedUserService = {
        checkUserCredentials: jest
          .fn()
          .mockRejectedValue(new Error('Unexpected Error')),
      };

      const nextReq: any = {
        json: () => Promise.resolve(validBody),
      };
      const userController = new UserController(mockedUserService);
      const response = await userController.checkUserCredentials(nextReq);

      expect(response.status).toBe(500);
      const responseBody = await response.json();
      expect(responseBody).toEqual(null);
    });
  });
});
