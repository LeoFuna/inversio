'use client';
import NewStrategyDialog from '@/client/components/registers/NewStrategyDialog';
import StrategiesTable from '@/client/components/registers/StrategiesTable';
import {
  useDeleteStrategy,
  useStrategies,
} from '@/client/hooks/registers/use-strategy';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonTable = () => {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full h-[20px] rounded-full" />
      <Skeleton className="w-full h-[20px] rounded-full" />
      <Skeleton className="w-full h-[20px] rounded-full" />
      <Skeleton className="w-full h-[20px] rounded-full" />
      <Skeleton className="w-full h-[20px] rounded-full" />
      <Skeleton className="w-full h-[20px] rounded-full" />
    </div>
  );
};

export default function RegistersPage() {
  const { refetch, isPending } = useStrategies();
  const {
    isSuccess: deleteSuccess,
    reset: resetDelete,
    mutate: mutateDelete,
  } = useDeleteStrategy();

  if (deleteSuccess) {
    resetDelete();
    refetch();
  }

  return (
    <main className="flex-1 p-4">
      <h1 className="text-2xl font-semibold mb-4">Cadastros</h1>
      <section className="bg-white p-4 rounded-md shadow mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold mb-4">Estratégias</h2>
          <NewStrategyDialog refetchStrategies={refetch}>
            <Button className="mb-4">Criar Estratégia</Button>
          </NewStrategyDialog>
        </div>
        {isPending ? (
          <SkeletonTable />
        ) : (
          <StrategiesTable onDeleteStrategy={mutateDelete} />
        )}
      </section>
    </main>
  );
}
