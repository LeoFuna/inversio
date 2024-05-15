'use client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { INewStrategy } from '@/server/domains/Strategy';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { Table as ITable, flexRender } from '@tanstack/react-table';

export default function StrategiesTable({
  table,
  onDeleteStrategy,
}: {
  table: ITable<INewStrategy>;
  onDeleteStrategy: (id: string) => void;
}) {
  return (
    <>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
              <TableCell className="flex justify-end gap-x-6">
                <Button
                  variant="ghost"
                  onClick={() => onDeleteStrategy(row.id)}
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
    </>
  );
}
