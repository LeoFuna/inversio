'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { newStrategyFormSchema } from '@/schemas/strategy-schemas';
import { INewStrategy } from '@/server/domains/Strategy';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonWithLoading from '../core/ButtonWithLoading';
import { Form, FormLabel } from '../core/form';

export default function NewStrategyDialog({
  children,
  refetchStrategies,
}: {
  children: React.ReactNode;
  refetchStrategies: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset: formReset,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      name: '',
      direction: '',
      description: '',
    },
    resolver: zodResolver(newStrategyFormSchema),
  });

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

  const onCreateStrategy = async (
    formData: Omit<INewStrategy, 'userEmail'>
  ) => {
    mutation.mutate(formData);
  };

  if (mutation.isSuccess) {
    toast({
      title: 'Criado com sucesso!',
      variant: 'success',
    });
    mutation.reset();
    refetchStrategies();
    setIsOpen(false);
  }

  if (mutation.isError) {
    toast({
      title: 'Ops...algo deu errado na criação',
      variant: 'destructive',
    });
    mutation.reset();
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        formReset();
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Estratégia</DialogTitle>
        </DialogHeader>
        <Form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onCreateStrategy)}
        >
          <FormLabel htmlFor="name" className="flex items-center gap-3">
            <h4 className="min-w-20">Nome:</h4>
            <Input
              id="name"
              placeholder="Nome da estratégia"
              {...register('name')}
            />
          </FormLabel>

          <FormField
            control={control}
            name="direction"
            render={({ field }) => (
              <FormLabel
                htmlFor="direction"
                className="flex items-center gap-3"
              >
                <h4 className="min-w-20">Direção:</h4>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            )}
          />

          <FormLabel htmlFor="description" className="flex items-center gap-3">
            <h4 className="min-w-20">Descrição:</h4>
            <Textarea
              id="description"
              maxLength={180}
              placeholder="Breve descrição..."
              {...register('description')}
            />
          </FormLabel>
          <DialogFooter>
            <ButtonWithLoading
              isLoading={mutation.isPending}
              className="min-w-24"
              disabled={mutation.isPending || !isValid}
            >
              Criar
            </ButtonWithLoading>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
