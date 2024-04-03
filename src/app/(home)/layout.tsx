import MainSideMenu from '@/client/components/core/MainSideMenu';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainSideMenu>{children}</MainSideMenu>;
}
