'use client';

import { useState } from 'react';
import StrategyTable from '@/components/strategies/StrategyTable';
import StrategyForm from '@/components/strategies/StrategyForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Strategy } from '@/types';

export default function StrategiesPage() {
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingStrategy(null);
    setShowForm(true);
  };

  const handleSubmit = () => {
    setEditingStrategy(null);
    setShowForm(false);
    // Trigger refresh of the table
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setEditingStrategy(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cadastros</h1>
      </div>
      
      {/* Strategy table */}
      <StrategyTable 
        onEdit={handleEdit} 
        onCreateNew={handleCreateNew}
        refreshTrigger={refreshTrigger}
      />

      {/* Strategy form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingStrategy ? 'Editar Estratégia' : 'Nova Estratégia'}
            </DialogTitle>
          </DialogHeader>
          <StrategyForm
            strategy={editingStrategy || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}