'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const handleIfIsSelected = (path: string) => {
    if (pathname === path)
      return 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50';
    return '';
  };
  return (
    <Link
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${cn(
        handleIfIsSelected(href)
      )}`}
      href={href}
    >
      {children}
    </Link>
  );
}
