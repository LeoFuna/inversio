import SignOutButton from '../../SignOutButton';
import NavMainMenu from './NavMainMenu';
import ProfileSection from './ProfileSection';
import UpgradeProCard from './UpgradeProCard';

export default function MainSideMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100/40 dark:bg-gray-800/40">
      <aside className="block border-r bg-gray-100/40 dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <ProfileSection />
          <div className="flex-1 overflow-auto py-4">
            <NavMainMenu />
          </div>
          <div className="mt-auto p-4">
            <UpgradeProCard />
            <div className="flex justify-center">
              <SignOutButton />
            </div>
          </div>
        </div>
      </aside>
      {children}
    </div>
  );
}
