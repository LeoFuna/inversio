/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { createTrade, updateTrade } from '@/lib/trades';
import { getAllUserStrategies } from '@/lib/strategies';
import { Trade, TradeFormData, Strategy } from '@/types';

interface TradeFormProps {
  trade?: Trade;
  onSubmit?: () => void;
  onCancel?: () => void;
}

// Default form values
const getDefaultFormData = (): TradeFormData => ({
  stockType: 'AÇÕES',
  date: new Date().toISOString().split('T')[0],
  inTime: "",
  outTime: "",
  quantity: 0,
  men: 0,
  mep: 0,
  result: "",
  strategyId: undefined,
});

export default function TradeForm({ trade, onSubmit, onCancel }: TradeFormProps) {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loadingStrategies, setLoadingStrategies] = useState(true);

  const [formData, setFormData] = useState<TradeFormData>(getDefaultFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData(getDefaultFormData());
    setErrors({});
  };

  // Load strategies on component mount
  useEffect(() => {
    const loadStrategies = async () => {
      if (!user) return;
      
      try {
        setLoadingStrategies(true);
        const userStrategies = await getAllUserStrategies(user.uid);
        setStrategies(userStrategies);
      } catch (error) {
        console.error('Error loading strategies:', error);
        setErrors(prev => ({ ...prev, general: 'Erro ao carregar estratégias' }));
      } finally {
        setLoadingStrategies(false);
      }
    };

    loadStrategies();
  }, [user]);

  // Reset form when trade prop changes (edit or cancel)
  useEffect(() => {
    if (trade) {
      setFormData({
        stockType: trade.stockType,
        date: trade.date.toDate().toISOString().split('T')[0],
        inTime: trade.inTime,
        outTime: trade.outTime,
        quantity: trade.quantity,
        men: trade.men,
        mep: trade.mep,
        result: trade.result,
        strategyId: trade.strategyId,
      });
    } else {
      setFormData(getDefaultFormData());
    }
    setErrors({});
  }, [trade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrors({ general: 'Usuário não autenticado' });
      return;
    }

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.stockType) newErrors.stockType = 'Ativo é obrigatório';
    if (!formData.date) newErrors.date = 'Data é obrigatória';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantidade deve ser maior que zero';
    if (!formData.inTime) newErrors.inTime = 'Hora de entrada é obrigatória';
    if (!formData.outTime) newErrors.outTime = 'Hora de saída é obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Convert result to number for API
      const dataToSave = {
        ...formData,
        result: typeof formData.result === 'string' ? parseFloat(formData.result) || 0 : formData.result
      };
      
      trade ? await updateTrade(user.uid, trade.id, dataToSave) : await createTrade(user.uid, dataToSave);
      resetForm();
      onSubmit?.();
    } catch (error) {
      console.error('Error saving trade:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'Erro ao salvar operação' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TradeFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="add-trade" className="border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <AccordionTrigger className="flex-1 p-0 hover:no-underline flex items-center justify-between [&[data-state=open]>svg]:rotate-180">
            <div className="text-left">
              <h3 className="text-lg font-semibold">Adicionar Operação</h3>
              <p className="text-sm text-gray-600">Complete os detalhes abaixo</p>
            </div>
          </AccordionTrigger>
          <Button variant="outline" size="sm" className="ml-4">
            Importar Operações
          </Button>
        </div>
        <AccordionContent className="px-4 pb-4 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {errors.general}
              </div>
            )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockType">Ativo</Label>
              <Select
                value={formData.stockType}
                onValueChange={(value) => handleInputChange('stockType', value)}
              >
                <SelectTrigger className={errors.stockType ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AÇÕES">AÇÕES</SelectItem>
                  <SelectItem value="OPÇÕES">OPÇÕES</SelectItem>
                  <SelectItem value="FUTUROS">FUTUROS</SelectItem>
                </SelectContent>
              </Select>
              {errors.stockType && (
                <p className="text-sm text-red-600">{errors.stockType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inTime">Hora da Entrada</Label>
              <Input
                id="inTime"
                type="time"
                step="1"
                value={formData.inTime}
                onChange={(e) => handleInputChange('inTime', e.target.value)}
              />
              {errors.inTime && (
                <p className="text-sm text-red-600">{errors.inTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="outTime">Hora da Saída</Label>
              <Input
                id="outTime"
                type="time"
                step="1"
                value={formData.outTime}
                onChange={(e) => handleInputChange('outTime', e.target.value)}
              />
              {errors.outTime && (
                <p className="text-sm text-red-600">{errors.outTime}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && (
                <p className="text-sm text-red-600">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="men">MEN</Label>
              <Input
                id="men"
                type="number"
                step="0.01"
                value={formData.men}
                onChange={(e) => handleInputChange('men', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mep">MEP</Label>
              <Input
                id="mep"
                type="number"
                step="0.01"
                value={formData.mep}
                onChange={(e) => handleInputChange('mep', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strategyId">Estratégia (Opcional)</Label>
              <Select
                value={formData.strategyId || 'none'}
                onValueChange={(value) => handleInputChange('strategyId', value === 'none' ? undefined : value)}
                disabled={loadingStrategies}
              >
                <SelectTrigger className={errors.strategyId ? 'border-red-500' : ''}>
                  <SelectValue placeholder={loadingStrategies ? "Carregando estratégias..." : "Deixar em branco (pode ser adicionada depois)"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem estratégia</SelectItem>
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                  {strategies.length === 0 && !loadingStrategies && (
                    <SelectItem value="none_found" disabled>
                      Nenhuma estratégia encontrada
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.strategyId && (
                <p className="text-sm text-red-600">{errors.strategyId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="result">Resultado Líquido (R$)</Label>
              <Input
                id="result"
                type="number"
                step="0.01"
                value={formData.result}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '-') {
                    handleInputChange('result', value);
                  } else {
                    const numValue = parseFloat(value);
                    handleInputChange('result', isNaN(numValue) ? 0 : numValue);
                  }
                }}
                placeholder="0.00"
                className={errors.result ? 'border-red-500' : ''}
              />
              {errors.result && (
                <p className="text-sm text-red-600">{errors.result}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 flex-1" 
              disabled={loading || loadingStrategies}
            >
              {loading ? 'Salvando...' : (trade ? 'Atualizar' : 'Adicionar')}
            </Button>
            {trade && onCancel && (
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                Cancelar
              </Button>
            )}
          </div>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}