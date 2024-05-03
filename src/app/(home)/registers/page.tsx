'use client';
import DebouncedInput from '@/client/components/core/DebouncedInput';
import NewStrategyDialog from '@/client/components/registers/NewStrategyDialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IStrategy } from '@/server/domains/Strategy';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { rankItem } from '@tanstack/match-sorter-utils';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  FilterFn,
  flexRender,
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

export default function RegistersPage() {
  const [data, setData] = useState<IStrategy[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const strategiesQuery = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const strategiesResponse = await fetch('/api/strategy').then(
        async (data) => ({ status: data.status, body: await data.json() })
      );
      setData(strategiesResponse.body);
      if (strategiesResponse.status !== 200) {
        throw new Error(await strategiesResponse.body);
      }

      return strategiesResponse;
    },
  });

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
    globalFilterFn: fuzzyFilter,
    state: {
      pagination,
      globalFilter,
    },
  });

  if (strategiesQuery.isPending) {
    return <p>Carregando...</p>;
  }

  return (
    <main className="flex-1 p-4">
      <h1 className="text-2xl font-semibold mb-4">Cadastros</h1>
      <section className="bg-white p-4 rounded-md shadow mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold mb-4">Estratégias</h2>
          <NewStrategyDialog refetchStrategies={strategiesQuery.refetch}>
            <Button className="mb-4">Criar Estratégia</Button>
          </NewStrategyDialog>
        </div>
        <div className="mb-4 flex items-center gap-3">
          <Label htmlFor="search">Buscar</Label>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className="w-2/6"
            placeholder="Digite nome ou descrição"
            type="search"
          />
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <TableHead key={column.id}>
                    {column.isPlaceholder
                      ? null
                      : flexRender(
                          column.column.columnDef.header,
                          column.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  if (!cell.column.columnDef.header?.length) return;
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
                <TableCell className="flex justify-end gap-x-6">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      alert(`Vai abrir pop-up de confirmaçao! ${row.id}`)
                    }
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => alert(`Abre ediçao de Estratégia ${row.id}`)}
                  >
                    <Pencil2Icon className="h-5 w-5 inline" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            variant="secondary"
          >{`<`}</Button>
          <span className="text-sm">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            <strong>{table.getPageCount().toLocaleString()}</strong>
          </span>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="secondary"
          >{`>`}</Button>
        </div>
      </section>
    </main>
  );
}
