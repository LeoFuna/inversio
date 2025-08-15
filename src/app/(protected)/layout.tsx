import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex">
        <Navbar />
        <main className="flex-1 bg-white">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}