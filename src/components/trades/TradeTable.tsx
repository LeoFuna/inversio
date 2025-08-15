'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Calendar, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { deleteTrade, getTradesCount, getTradesForPage } from '@/lib/trades';
import { getAllUserStrategies } from '@/lib/strategies';
import { Trade, Strategy } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TradeTableProps {
  onEdit?: (trade: Trade) => void;
  refreshTrigger?: number;
}

const ITEMS_PER_PAGE = 10;
export default function TradeTable({ onEdit, refreshTrigger }: TradeTableProps) {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [strategyFilter, setStrategyFilter] = useState('');
  const [resultTypeFilter, setResultTypeFilter] = useState<'all' | 'profit' | 'loss'>('all');
  const [showPending, setShowPending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState<Trade | null>(null);

  const loadTrades = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      
      const filterOptions = {
        strategyId: strategyFilter || undefined,
        dateFrom: dateFromFilter || undefined,
        dateTo: dateToFilter || undefined,
        resultType: resultTypeFilter,
      };

      // Get total count for pagination
      const totalCount = await getTradesCount(user.uid, filterOptions);
      setTotalPages(Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE)));

      // Get trades for current page
      const trades = await getTradesForPage(user.uid, {
        page: currentPage,
        limitCount: ITEMS_PER_PAGE,
        ...filterOptions,
      });

      setTrades(trades);
    } catch (err) {
      console.error('Error loading trades:', err);
      setError('Erro ao carregar operações');
    } finally {
      setLoading(false);
    }
  }, [user, currentPage, strategyFilter, dateFromFilter, dateToFilter, resultTypeFilter, ITEMS_PER_PAGE]);

  const loadStrategies = useCallback(async () => {
    if (!user) return;
    
    try {
      const userStrategies = await getAllUserStrategies(user.uid);
      setStrategies(userStrategies);
    } catch (err) {
      console.error('Error loading strategies:', err);
    }
  }, [user]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [strategyFilter, dateFromFilter, dateToFilter, resultTypeFilter, showPending]);

  useEffect(() => {
    loadTrades();
  }, [user, refreshTrigger, currentPage, loadTrades]);

  useEffect(() => {
    loadStrategies();
  }, [user, loadStrategies]);

  // Apply pending filter (trades without strategies)
  let filteredTrades = trades;
  if (showPending) {
    filteredTrades = trades.filter(trade => !trade.strategyId);
  }

  const handleEdit = (trade: Trade) => {
    onEdit?.(trade);
  };

  const handleDeleteClick = (trade: Trade) => {
    setTradeToDelete(trade);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !tradeToDelete) return;

    try {
      await deleteTrade(user.uid, tradeToDelete.id);
      // Refresh the current page
      await loadTrades();
      setDeleteDialogOpen(false);
      setTradeToDelete(null);
    } catch (err) {
      console.error('Error deleting trade:', err);
      setError('Erro ao excluir operação');
      setDeleteDialogOpen(false);
      setTradeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTradeToDelete(null);
  };

  // Helper function to get strategy name by ID
  const getStrategyName = (strategyId?: string) => {
    if (!strategyId) return null;
    const strategy = strategies.find(s => s.id === strategyId);
    return strategy ? strategy.name : 'Estratégia não encontrada';
  };

  // Handle adding strategy to trade
  const handleAddStrategy = (trade: Trade) => {
    // This will be passed up to parent to handle strategy assignment
    // For now, just trigger edit which will open the form
    onEdit?.(trade);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operações</CardTitle>
        
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                placeholder="Data inicial"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                placeholder="Data final"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={strategyFilter} onValueChange={setStrategyFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estratégia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as estratégias</SelectItem>
                {strategies.map((strategy) => (
                  <SelectItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={resultTypeFilter} onValueChange={(value: 'all' | 'profit' | 'loss') => setResultTypeFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="profit">Lucro</SelectItem>
                <SelectItem value="loss">Prejuízo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Mostrar apenas sem estratégia</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPending(!showPending)}
                className="p-0"
              >
                {showPending ? (
                  <ToggleRight className="w-6 h-6 text-blue-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
              </Button>
              <span className="text-xs text-gray-500">
                Mostrar somente operações que precisam de estratégia
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-200">
            {error}
          </div>
        )}
        
        {loading && trades.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Carregando operações...</span>
          </div>
        ) : (
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ativo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Estratégia</TableHead>
              <TableHead>Hora da Entrada</TableHead>
              <TableHead>Hora da Saída</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>MEN</TableHead>
              <TableHead>MEP</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell className="font-medium">{trade.stockType}</TableCell>
                <TableCell>{trade.date.toDate().toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  {trade.strategyId ? (
                    getStrategyName(trade.strategyId)
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => handleAddStrategy(trade)}
                    >
                      + Estratégia
                    </Button>
                  )}
                </TableCell>
                <TableCell>{trade.inTime}</TableCell>
                <TableCell>{trade.outTime}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell className={trade.result > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  R$ {trade.result.toFixed(2)}
                </TableCell>
                <TableCell>{trade.men}</TableCell>
                <TableCell>{trade.mep}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(trade)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(trade)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredTrades.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  {strategyFilter || dateFromFilter || dateToFilter || resultTypeFilter !== 'all' ? 
                    'Nenhuma operação encontrada com os filtros aplicados.' : 
                    'Nenhuma operação registrada ainda.'
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        )}
        
        {/* Pagination */}
        <div className="flex items-center justify-center py-4 border-t">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '‹'
              )}
            </Button>
            <span className="text-sm text-gray-600">
              {loading ? (
                <div className="flex items-center space-x-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Carregando...</span>
                </div>
              ) : (
                totalPages > 0 ? `${currentPage} de ${totalPages}` : '0 de 0'
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || loading || totalPages === 0}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '›'
              )}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta operação?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}