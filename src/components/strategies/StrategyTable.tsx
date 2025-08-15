'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getStrategies, deleteStrategy, getStrategiesCount, getStrategiesForPage } from '@/lib/strategies';
import { Strategy } from '@/types';
import { DocumentSnapshot } from 'firebase/firestore';
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

interface StrategyTableProps {
  onEdit?: (strategy: Strategy) => void;
  onCreateNew?: () => void;
  refreshTrigger?: number;
}

const ITEMS_PER_PAGE = 10;

export default function StrategyTable({ onEdit, onCreateNew, refreshTrigger }: StrategyTableProps) {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<Strategy | null>(null);

  const loadStrategies = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      
      const filterOptions = {
        searchTerm: searchTerm || undefined,
      };

      // Get total count for pagination
      const totalCount = await getStrategiesCount(user.uid, filterOptions);
      setTotalPages(Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE)));

      // Get strategies for current page
      const strategies = await getStrategiesForPage(user.uid, {
        page: currentPage,
        limitCount: ITEMS_PER_PAGE,
        ...filterOptions,
      });

      setStrategies(strategies);
    } catch (err) {
      console.error('Error loading strategies:', err);
      setError('Erro ao carregar estratégias');
    } finally {
      setLoading(false);
    }
  }, [user, currentPage, searchTerm]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

  useEffect(() => {
    loadStrategies();
  }, [user, refreshTrigger, currentPage, loadStrategies]);

  const handleEdit = (strategy: Strategy) => {
    onEdit?.(strategy);
  };

  const handleDeleteClick = (strategy: Strategy) => {
    setStrategyToDelete(strategy);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !strategyToDelete) return;

    try {
      await deleteStrategy(user.uid, strategyToDelete.id);
      // Refresh the current page
      await loadStrategies();
    } catch (err) {
      console.error('Error deleting strategy:', err);
      setError('Erro ao excluir estratégia');
    } finally {
      handleDeleteCancel();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setStrategyToDelete(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Estratégias</CardTitle>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onCreateNew}>
            Criar Estratégia
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-200">
            {error}
          </div>
        )}
        
        {loading && strategies.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Carregando estratégias...</span>
          </div>
        ) : (
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Direção</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strategies.map((strategy) => (
              <TableRow key={strategy.id}>
                <TableCell className="font-medium">{strategy.name}</TableCell>
                <TableCell>{strategy.direction}</TableCell>
                <TableCell>{strategy.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(strategy)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(strategy)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {strategies.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Nenhuma estratégia encontrada para o termo pesquisado.' : 'Nenhuma estratégia criada ainda.'}
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
              Tem certeza que deseja excluir a estratégia &ldquo;{strategyToDelete?.name}&rdquo;?
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