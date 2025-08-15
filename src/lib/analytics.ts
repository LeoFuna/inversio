import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Trade, Strategy } from '@/types';

const TRADES_COLLECTION = 'trades';
const STRATEGIES_COLLECTION = 'strategies';

// Interface for analytics data
export interface AnalyticsData {
  totalTrades: number;
  totalGains: number;
  totalLosses: number;
  totalProfit: number;
  winRate: number;
  averageGain: number;
  averageLoss: number;
  riskRewardRatio: number;
  averageMEN: number;
  averageMEP: number;
  tradesPerDay: number;
}

export interface StrategyPerformance {
  strategyId: string;
  strategyName: string;
  totalTrades: number;
  gains: number;
  losses: number;
  winRate: number;
  riskRewardRatio: number;
  netResult: number;
  averageGain: number;
  averageLoss: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: Date;
}

export interface MonthlyDataPoint {
  name: string;
  gain: number;
  loss: number;
  net: number;
}

// Get all user trades with optional date range and strategy filter
export async function getUserTrades(
  userId: string,
  dateFrom?: Date,
  dateTo?: Date,
  strategyId?: string
): Promise<Trade[]> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  let q = query(
    collection(db, TRADES_COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  // Add date filters if provided
  if (dateFrom) {
    q = query(q, where('date', '>=', Timestamp.fromDate(dateFrom)));
  }

  if (dateTo) {
    q = query(q, where('date', '<=', Timestamp.fromDate(dateTo)));
  }

  // Add strategy filter if provided
  if (strategyId) {
    q = query(q, where('strategyId', '==', strategyId));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Trade, 'id'>),
  }));
}

// Get user strategies
export async function getUserStrategies(userId: string): Promise<Strategy[]> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const q = query(
    collection(db, STRATEGIES_COLLECTION),
    where('userId', '==', userId),
    orderBy('name', 'asc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Strategy, 'id'>),
  }));
}

// Calculate overall analytics
export async function calculateAnalytics(
  userId: string,
  dateFrom?: Date,
  dateTo?: Date,
  strategyId?: string
): Promise<AnalyticsData> {
  const trades = await getUserTrades(userId, dateFrom, dateTo, strategyId);

  if (trades.length === 0) {
    return {
      totalTrades: 0,
      totalGains: 0,
      totalLosses: 0,
      totalProfit: 0,
      winRate: 0,
      averageGain: 0,
      averageLoss: 0,
      riskRewardRatio: 0,
      averageMEN: 0,
      averageMEP: 0,
      tradesPerDay: 0,
    };
  }

  const gains = trades.filter(trade => trade.result > 0);
  const losses = trades.filter(trade => trade.result <= 0);

  const totalProfit = trades.reduce((sum, trade) => sum + trade.result, 0);
  const totalGainAmount = gains.reduce((sum, trade) => sum + trade.result, 0);
  const totalLossAmount = Math.abs(losses.reduce((sum, trade) => sum + trade.result, 0));

  const averageGain = gains.length > 0 ? totalGainAmount / gains.length : 0;
  const averageLoss = losses.length > 0 ? totalLossAmount / losses.length : 0;

  const averageMEN = trades.reduce((sum, trade) => sum + trade.men, 0) / trades.length;
  const averageMEP = trades.reduce((sum, trade) => sum + trade.mep, 0) / trades.length;

  // Calculate trades per day
  const uniqueDates = new Set(trades.map(trade => 
    trade.date.toDate().toDateString()
  ));
  const tradesPerDay = uniqueDates.size > 0 ? trades.length / uniqueDates.size : 0;

  return {
    totalTrades: trades.length,
    totalGains: gains.length,
    totalLosses: losses.length,
    totalProfit,
    winRate: (gains.length / trades.length) * 100,
    averageGain,
    averageLoss,
    riskRewardRatio: averageLoss > 0 ? averageGain / averageLoss : 0,
    averageMEN,
    averageMEP,
    tradesPerDay: Math.round(tradesPerDay * 10) / 10,
  };
}

// Calculate strategy performance
export async function calculateStrategyPerformance(
  userId: string,
  dateFrom?: Date,
  dateTo?: Date,
  strategyId?: string
): Promise<StrategyPerformance[]> {
  const [trades, strategies] = await Promise.all([
    getUserTrades(userId, dateFrom, dateTo, strategyId),
    getUserStrategies(userId),
  ]);

  const strategyMap = new Map(strategies.map(s => [s.id, s.name]));
  
  // Group trades by strategy
  const strategyGroups = new Map<string, Trade[]>();
  
  trades.forEach(trade => {
    if (trade.strategyId) {
      const existing = strategyGroups.get(trade.strategyId) || [];
      strategyGroups.set(trade.strategyId, [...existing, trade]);
    }
  });

  const performance: StrategyPerformance[] = [];

  strategyGroups.forEach((strategyTrades, strategyId) => {
    const gains = strategyTrades.filter(trade => trade.result > 0);
    const losses = strategyTrades.filter(trade => trade.result <= 0);

    const totalGainAmount = gains.reduce((sum, trade) => sum + trade.result, 0);
    const totalLossAmount = Math.abs(losses.reduce((sum, trade) => sum + trade.result, 0));
    const netResult = strategyTrades.reduce((sum, trade) => sum + trade.result, 0);

    const averageGain = gains.length > 0 ? totalGainAmount / gains.length : 0;
    const averageLoss = losses.length > 0 ? totalLossAmount / losses.length : 0;

    performance.push({
      strategyId,
      strategyName: strategyMap.get(strategyId) || 'Unknown Strategy',
      totalTrades: strategyTrades.length,
      gains: gains.length,
      losses: losses.length,
      winRate: (gains.length / strategyTrades.length) * 100,
      riskRewardRatio: averageLoss > 0 ? averageGain / averageLoss : 0,
      netResult,
      averageGain,
      averageLoss,
    });
  });

  return performance.sort((a, b) => b.netResult - a.netResult);
}

// Get financial evolution data (cumulative profit over time)
export async function getFinancialEvolution(
  userId: string,
  period: 'day' | 'week' | 'month' = 'day',
  dateFrom?: Date,
  dateTo?: Date,
  strategyId?: string
): Promise<ChartDataPoint[]> {
  const trades = await getUserTrades(userId, dateFrom, dateTo, strategyId);

  if (trades.length === 0) return [];

  // Sort by date ascending for cumulative calculation
  const sortedTrades = trades.sort((a, b) => 
    a.date.toMillis() - b.date.toMillis()
  );

  const dataMap = new Map<string, number>();
  let cumulativeProfit = 0;

  sortedTrades.forEach(trade => {
    cumulativeProfit += trade.result;
    const date = trade.date.toDate();
    
    let key: string;
    if (period === 'month') {
      key = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    } else if (period === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } else {
      key = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }

    dataMap.set(key, cumulativeProfit);
  });

  return Array.from(dataMap.entries()).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));
}

// Get monthly gain/loss data
export async function getMonthlyData(
  userId: string,
  dateFrom?: Date,
  dateTo?: Date,
  strategyId?: string
): Promise<MonthlyDataPoint[]> {
  const trades = await getUserTrades(userId, dateFrom, dateTo, strategyId);

  if (trades.length === 0) return [];

  const monthlyMap = new Map<string, { gain: number; loss: number }>();

  trades.forEach(trade => {
    const date = trade.date.toDate();
    const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    
    const existing = monthlyMap.get(monthKey) || { gain: 0, loss: 0 };
    
    if (trade.result > 0) {
      existing.gain += trade.result;
    } else {
      existing.loss += Math.abs(trade.result);
    }
    
    monthlyMap.set(monthKey, existing);
  });

  return Array.from(monthlyMap.entries()).map(([name, data]) => ({
    name,
    gain: Math.round(data.gain * 100) / 100,
    loss: -Math.round(data.loss * 100) / 100, // Negative for display
    net: Math.round((data.gain - data.loss) * 100) / 100,
  }));
}

// Get daily results for the current period
export async function getDailyData(
  userId: string,
  dateFrom?: Date,
  dateTo?: Date,
  strategyId?: string
): Promise<ChartDataPoint[]> {
  const trades = await getUserTrades(userId, dateFrom, dateTo, strategyId);

  if (trades.length === 0) return [];

  const dailyMap = new Map<string, number>();

  trades.forEach(trade => {
    const date = trade.date.toDate();
    const dayKey = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    
    const existing = dailyMap.get(dayKey) || 0;
    dailyMap.set(dayKey, existing + trade.result);
  });

  // Ensure we have all weekdays
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  return weekdays.map(day => ({
    name: day,
    value: Math.round((dailyMap.get(day) || 0) * 100) / 100,
  }));
}

// Get win/loss pie chart data
export async function getWinLossData(
  userId: string,
  dateFrom?: Date,
  dateTo?: Date,
  strategyId?: string
): Promise<{ name: string; value: number; color: string }[]> {
  const trades = await getUserTrades(userId, dateFrom, dateTo, strategyId);

  if (trades.length === 0) {
    return [
      { name: 'Ganho', value: 0, color: '#10b981' },
      { name: 'Perda', value: 0, color: '#ef4444' },
    ];
  }

  const gains = trades.filter(trade => trade.result > 0).length;
  const losses = trades.filter(trade => trade.result <= 0).length;
  const total = trades.length;

  const gainPercentage = Math.round((gains / total) * 100);
  const lossPercentage = Math.round((losses / total) * 100);

  return [
    { name: 'Ganho', value: gainPercentage, color: '#10b981' },
    { name: 'Perda', value: lossPercentage, color: '#ef4444' },
  ];
}