import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function getSession() {
  return getServerSession(authOptions);
}

export async function checkIfHasSession() {
  const session = await getSession();
  return !!session;
}
