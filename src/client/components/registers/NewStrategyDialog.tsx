'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { INewStrategy } from '@/server/domains/Strategy';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import ButtonWithLoading from '../core/ButtonWithLoading';
import { Form, FormLabel } from '../core/form';

export default function NewStrategyDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // TO DO: fazer o formulário para gerenciar os estados do dialog

  const mutation = useMutation({
    mutationFn: async (formData: Omit<INewStrategy, 'userEmail'>) => {
      const createResponse = await fetch('/api/strategy', {
        method: 'POST',
        body: JSON.stringify(formData),
      }).then(async (data) => ({
        status: data.status,
        body: await data.json(),
      }));

      if (createResponse.status !== 201) {
        throw new Error(await createResponse.body);
      }

      return createResponse;
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Estratégia</DialogTitle>
        </DialogHeader>
        <Form
          className="flex flex-col gap-3"
          onSubmit={(e: any) => {
            setIsOpen(false);
            e.preventDefault();
          }}
        >
          <FormLabel htmlFor="name" className="flex items-center gap-3">
            <h4 className="min-w-20">Nome:</h4>
            <Input id="name" placeholder="Nome da estratégia" />
          </FormLabel>

          <FormLabel htmlFor="name" className="flex items-center gap-3">
            <h4 className="min-w-20">Direção:</h4>
            <Select>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ct">Contra Tendência</SelectItem>
                <SelectItem value="td">Tendência</SelectItem>
                <SelectItem value="neutro">Neutro</SelectItem>
              </SelectContent>
            </Select>
          </FormLabel>

          <FormLabel htmlFor="name" className="flex items-center gap-3">
            <h4 className="min-w-20">Descrição:</h4>
            <Textarea
              id="description"
              maxLength={180}
              placeholder="Breve descrição..."
            />
          </FormLabel>
          <DialogFooter>
            <ButtonWithLoading className="min-w-24">Criar</ButtonWithLoading>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
