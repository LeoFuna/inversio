import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PersonIcon } from '@radix-ui/react-icons';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
// TO DO: Separar em um arquivo utilitário
const firstLetterToUppercase = (text?: string) => {
  if (!text) return null;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default async function ProfileSection() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex h-[60px] items-center border-b px-6">
      <Link className="flex items-center gap-2 font-semibold" href="/profile">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            <PersonIcon className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="grid grid-cols-1">
          <span className="">{firstLetterToUppercase(session?.user.name)}</span>
          <span className="text-xs text-gray-500">Perfil</span>
        </div>
      </Link>
    </div>
  );
}
