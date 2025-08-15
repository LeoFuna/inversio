'use client';

import { useState } from 'react';
import TradeForm from '@/components/trades/TradeForm';
import TradeTable from '@/components/trades/TradeTable';
import { Trade } from '@/types';

export default function TradesPage() {
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
  };

  const handleDelete = (tradeId: string) => {
    // TODO: Implement delete logic
    console.log('Delete trade:', tradeId);
  };

  const handleSubmit = () => {
    setEditingTrade(null);
    // Trigger refresh of the table
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setEditingTrade(null);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Operações</h1>
      </div>
      
      {/* Trade form */}
      <TradeForm
        trade={editingTrade || undefined}
        onSubmit={handleSubmit}
        onCancel={editingTrade ? handleCancel : undefined}
      />

      {/* Trade table */}
      <TradeTable onEdit={handleEdit} onDelete={handleDelete} refreshTrigger={refreshTrigger} />
    </div>
  );
}