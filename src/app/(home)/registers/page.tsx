import ButtonWithLoading from '@/client/components/core/ButtonWithLoading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function RegistersPage() {
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
          <Input
            className="w-2/6"
            placeholder="Digite nome ou descrição"
            type="search"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Direção</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Inversão</TableCell>
              <TableCell>Contra Tendência</TableCell>
              <TableCell>Inversão de Fluxo</TableCell>
              <TableCell>
                <TrashIcon className="h-5 w-5 inline" />
                <Pencil2Icon className="h-5 w-5 inline ml-3" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Front Running</TableCell>
              <TableCell>Tendência</TableCell>
              <TableCell>Front running em algoritmo persistente</TableCell>
              <TableCell>
                <TrashIcon className="h-5 w-5 inline" />
                <Pencil2Icon className="h-5 w-5 inline ml-3" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm">1 de 6</span>
          <Button variant="secondary">{`<`}</Button>
          <Button variant="secondary">{`>`}</Button>
        </div>
      </section>
    </main>
  );
}
