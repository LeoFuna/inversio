'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { createStrategy, updateStrategy } from '@/lib/strategies';
import { Strategy, StrategyFormData } from '@/types';

interface StrategyFormProps {
  strategy?: Strategy;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function StrategyForm({ strategy, onSubmit, onCancel }: StrategyFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<StrategyFormData>({
    name: strategy?.name || '',
    direction: strategy?.direction || 'Tendencia',
    description: strategy?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrors({ general: 'Usuário não autenticado' });
      return;
    }

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (strategy) {
        // Update existing strategy
        await updateStrategy(user.uid, strategy.id, formData);
      } else {
        // Create new strategy
        await createStrategy(user.uid, formData);
        
        // Reset form after successful creation
        setFormData({
          name: '',
          direction: 'Tendencia',
          description: '',
        });
      }
      
      onSubmit?.();
    } catch (error) {
      console.error('Error saving strategy:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'Erro ao salvar estratégia' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StrategyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {errors.general}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Nome:</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Nome da estratégia"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="direction">Direção:</Label>
        <Select
          value={formData.direction}
          onValueChange={(value: 'Contra Tendencia' | 'Tendencia' | 'Neutro') =>
            handleInputChange('direction', value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tendencia">Tendência</SelectItem>
            <SelectItem value="Contra Tendencia">Contra Tendência</SelectItem>
            <SelectItem value="Neutro">Neutro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição:</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Descreva a estratégia..."
          className={`w-full min-h-24 px-3 py-2 border rounded-md text-sm ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex space-x-2 pt-4">
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 flex-1" 
          disabled={loading}
        >
          {loading ? 'Salvando...' : (strategy ? 'Atualizar' : 'Criar')}
        </Button>
        {strategy && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}