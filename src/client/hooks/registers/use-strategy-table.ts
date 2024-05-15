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

export default function useStrategyTable({ data }: { data: IStrategy[] }) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
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

  return {
    table,
    globalFilter,
    setGlobalFilter,
  };
}
