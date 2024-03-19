import db from '@/server/db/localDB';
import { UserRepoLocal } from '@/server/repositories/UserRepoLocal';

describe('User Repository', () => {
  describe('get user by email', () => {
    it('should return user when email exists', async () => {
      const johnDoeUser = {
        name: 'John',
        lastName: 'Doe',
        email: 'john@email.com',
        password: '123456',
      };
      const userRepository = new UserRepoLocal();
      const response = await userRepository.getUserByEmail(johnDoeUser.email);

      expect(response).toEqual({
        email: johnDoeUser.email,
        password: johnDoeUser.password,
      });
    });

    it('should return NULL when email dont exists', async () => {
      const notRegisteredUser = {
        name: 'Not',
        lastName: 'Registered',
        email: 'not-registered@email.com',
        password: '123456',
      };
      const userRepository = new UserRepoLocal();
      const response = await userRepository.getUserByEmail(
        notRegisteredUser.email
      );

      expect(response).toEqual(null);
    });

    it('should throws an Error something goes wrong on db', async () => {
      const notRegisteredUser = {
        name: 'Not',
        lastName: 'Registered',
        email: 'not-registered@email.com',
        password: '123456',
      };
      const userRepository = new UserRepoLocal();
      db.close();
      try {
        await userRepository.getUserByEmail(notRegisteredUser.email);
        //Nao deveria nunca entrar aqui
        expect(0).toBe(1);
      } catch (error: any) {
        expect(error.message).toBe('SQLITE_MISUSE: Database handle is closed');
      }
    });
  });
});
