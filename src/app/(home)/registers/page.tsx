'use client';
import ButtonWithLoading from '@/client/components/core/ButtonWithLoading';
import DebouncedInput from '@/client/components/core/DebouncedInput';
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
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { rankItem } from '@tanstack/match-sorter-utils';
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

type Strategy = {
  name: string;
  direction: 'Contra Tendencia' | 'Tendencia' | 'Indefinido';
  description: string;
};

const defaultData: Strategy[] = [
  {
    name: 'Inversão',
    direction: 'Contra Tendencia',
    description: 'Inversão de Fluxo',
  },
  {
    name: 'Front Running',
    direction: 'Tendencia',
    description: 'Front running em algoritmo persistente',
  },
  {
    name: 'Abertura',
    direction: 'Indefinido',
    description: 'Abertura do dia',
  },
  {
    name: 'Exaustão',
    direction: 'Contra Tendencia',
    description: 'Exaustão de Fluxo',
  },
  {
    name: 'Pull back',
    direction: 'Contra Tendencia',
    description: 'Pull back na primeira batida',
  },
  {
    name: 'Iceberg',
    direction: 'Contra Tendencia',
    description: 'Iceberg em algoritmo persistente',
  },
  {
    name: 'Queda no vazio',
    direction: 'Tendencia',
    description: 'Mercado caindo no vazio',
  },
];

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
  const [data, _setData] = useState(() => [...defaultData]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const columns = useMemo<ColumnDef<Strategy, any>[]>(
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
  return (
    <main className="flex-1 p-4">
      <h1 className="text-2xl font-semibold mb-4">Cadastros</h1>
      <section className="bg-white p-4 rounded-md shadow mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold mb-4">Estratégias</h2>
          <ButtonWithLoading className="mb-4">
            Criar Estratégia
          </ButtonWithLoading>
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
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      alert(`Vair abrir pop-up de confirmaçao! ${row.id}`)
                    }
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => alert(`Abre ediçao de Estratégia ${row.id}`)}
                  >
                    <Pencil2Icon className="h-5 w-5 inline ml-3" />
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
