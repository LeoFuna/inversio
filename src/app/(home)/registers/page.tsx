'use client';
import NewStrategyDialog from '@/client/components/registers/NewStrategyDialog';
import StrategiesTable from '@/client/components/registers/StrategiesTable';
import StrategyFilter from '@/client/components/registers/StrategyFilter';
import {
  useDeleteStrategy,
  useStrategies,
} from '@/client/hooks/registers/use-strategy';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IStrategy } from '@/server/domains/Strategy';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  ColumnDef,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';

// https://tanstack.com/table/latest/docs/api/features/global-filtering#filter-meta
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Compara o valor da célula com o valor do filtro
  const itemRank = rankItem(row.getValue(columnId), value);
  // Guarda a informaçao do itemRank
  addMeta({
    itemRank,
  });
  // Retorna se o item passou ou nao no filtro
  return itemRank.passed;
};

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
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const { data, refetch, isPending } = useStrategies();
  const {
    isSuccess: deleteSuccess,
    reset: resetDelete,
    mutate: mutateDelete,
  } = useDeleteStrategy();

  const columns = useMemo<ColumnDef<IStrategy, any>[]>(
    () => [
      {
        header: 'Nome',
        accessorKey: 'name',
      },
      {
        header: 'Direção',
        accessorKey: 'direction',
        enableGlobalFilter: false,
      },
      {
        header: 'Descrição',
        accessorKey: 'description',
      },
      {
        header: '',
        accessorKey: 'actions',
        enableGlobalFilter: false,
      },
    ],
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
    globalFilterFn: fuzzyFilter,
    state: {
      pagination,
      globalFilter,
    },
  });

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
          <>
            <StrategyFilter value={globalFilter} onChange={setGlobalFilter} />
            <StrategiesTable table={table} onDeleteStrategy={mutateDelete} />
          </>
        )}
      </section>
    </main>
  );
}
