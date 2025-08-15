'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { 
  calculateAnalytics, 
  calculateStrategyPerformance, 
  getFinancialEvolution, 
  getMonthlyData, 
  getDailyData, 
  getWinLossData,
  getUserStrategies,
  AnalyticsData,
  StrategyPerformance
} from '@/lib/analytics';

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Dia');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Data states
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [strategyPerformance, setStrategyPerformance] = useState<StrategyPerformance[]>([]);
  const [evolutionData, setEvolutionData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);

  // Calculate date ranges based on selected period
  const getDateRange = useCallback(() => {
    const now = new Date(currentDate);
    let dateFrom: Date;
    let dateTo: Date = new Date(now);

    switch (selectedPeriod) {
      case 'Dia':
        dateFrom = new Date(now);
        dateFrom.setHours(0, 0, 0, 0);
        dateTo.setHours(23, 59, 59, 999);
        break;
      case 'Semana':
        dateFrom = new Date(now);
        dateFrom.setDate(now.getDate() - 7);
        break;
      case 'Mês':
        dateFrom = new Date(now);
        dateFrom.setMonth(now.getMonth() - 1);
        break;
      default:
        dateFrom = new Date(now);
        dateFrom.setMonth(now.getMonth() - 6); // Last 6 months by default
    }

    return { dateFrom, dateTo };
  }, [currentDate, selectedPeriod]);

  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const { dateFrom, dateTo } = getDateRange();

      // Determine strategy filter (null means all strategies)
      const strategyFilter = selectedStrategy === 'all' ? undefined : selectedStrategy;

      // Load all data in parallel
      const [
        analyticsData,
        strategyData,
        evolutionChartData,
        monthlyChartData,
        dailyChartData,
        pieChartData,
        strategiesData,
      ] = await Promise.all([
        calculateAnalytics(user.uid, dateFrom, dateTo, strategyFilter),
        calculateStrategyPerformance(user.uid, dateFrom, dateTo),
        getFinancialEvolution(user.uid, selectedPeriod === 'Mês' ? 'month' : 'day', dateFrom, dateTo, strategyFilter),
        getMonthlyData(user.uid, dateFrom, dateTo, strategyFilter),
        getDailyData(user.uid, dateFrom, dateTo, strategyFilter),
        getWinLossData(user.uid, dateFrom, dateTo, strategyFilter),
        getUserStrategies(user.uid),
      ]);

      setAnalytics(analyticsData);
      setStrategyPerformance(strategyData);
      setEvolutionData(evolutionChartData);
      setMonthlyData(monthlyChartData);
      setDailyData(dailyChartData);
      setPieData(pieChartData);
      setStrategies(strategiesData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, [user, getDateRange, selectedPeriod, selectedStrategy]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle date navigation
  const handleDateChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (selectedPeriod) {
      case 'Dia':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'Semana':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'Mês':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const formatCurrentDate = () => {
    switch (selectedPeriod) {
      case 'Dia':
        return currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      case 'Semana':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.getDate()}-${weekEnd.getDate()} ${weekStart.toLocaleDateString('pt-BR', { month: 'short' })}`;
      case 'Mês':
        return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      default:
        return currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }
  };

  if (loading && !analytics) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
          <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estratégia" />
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

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDateChange('prev')}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium px-4">{formatCurrentDate()}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDateChange('next')}
              disabled={loading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Período:</span>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dia">Dia</SelectItem>
                <SelectItem value="Semana">Semana</SelectItem>
                <SelectItem value="Mês">Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Strategy Performance Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estratégia</TableHead>
                <TableHead>Trades</TableHead>
                <TableHead>Gain</TableHead>
                <TableHead>Loss</TableHead>
                <TableHead>Acertividade</TableHead>
                <TableHead>RxG</TableHead>
                <TableHead>Res. Líquido</TableHead>
                <TableHead>M. Ganho</TableHead>
                <TableHead>M. Perda</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategyPerformance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {loading ? 'Carregando...' : 'Nenhuma estratégia com dados no período selecionado.'}
                  </TableCell>
                </TableRow>
              ) : (
                strategyPerformance.map((strategy) => (
                  <TableRow key={strategy.strategyId}>
                    <TableCell className="font-medium">{strategy.strategyName}</TableCell>
                    <TableCell>{strategy.totalTrades}</TableCell>
                    <TableCell className="text-green-600">{strategy.gains}</TableCell>
                    <TableCell className="text-red-600">{strategy.losses}</TableCell>
                    <TableCell>{strategy.winRate.toFixed(1)}%</TableCell>
                    <TableCell>{strategy.riskRewardRatio.toFixed(1)}</TableCell>
                    <TableCell className={strategy.netResult >= 0 ? "text-green-600" : "text-red-600"}>
                      R$ {strategy.netResult.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-green-600">R$ {strategy.averageGain.toFixed(2)}</TableCell>
                    <TableCell className="text-red-600">R$ {strategy.averageLoss.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Resultado Financeiro</div>
            <div className={`text-2xl font-bold ${analytics?.totalProfit && analytics.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {analytics?.totalProfit?.toFixed(2) || '0,00'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Acertividade</div>
            <div className="text-2xl font-bold text-blue-600">{analytics?.winRate?.toFixed(1) || '0'}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Ganho Médio</div>
            <div className="text-2xl font-bold text-green-600">R$ {analytics?.averageGain?.toFixed(2) || '0,00'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Perda Média</div>
            <div className="text-2xl font-bold text-red-600">R$ {analytics?.averageLoss?.toFixed(2) || '0,00'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Risco x Ganho</div>
            <div className="text-2xl font-bold text-blue-600">{analytics?.riskRewardRatio?.toFixed(1) || '0,0'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">MEN</div>
            <div className="text-2xl font-bold text-gray-900">R$ {analytics?.averageMEN?.toFixed(2) || '0,00'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">MEP</div>
            <div className="text-2xl font-bold text-gray-900">R$ {analytics?.averageMEP?.toFixed(2) || '0,00'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Trades / Dia</div>
            <div className="text-2xl font-bold text-blue-600">{analytics?.tradesPerDay || '0'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Financeira</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultado por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="gain" fill="#10b981" />
                <Bar dataKey="loss" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultado Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operações</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}