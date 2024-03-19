import { IUser } from '@/server/domains/User';
import { NextRequest, NextResponse } from 'next/server';

export interface IUserController {
  checkUserCredentials: (
    req: NextRequest
  ) => Promise<NextResponse<{ email: string } | { message: string } | null>>;
  createUser: (
    req: NextRequest
  ) => Promise<NextResponse<Pick<IUser, 'email'> | { message: string } | null>>;
}
