import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from './firebase';
import { Trade, TradeFormData } from '@/types';

const COLLECTION_NAME = 'trades';

// Create a new trade
export async function createTrade(
  userId: string,
  data: TradeFormData
): Promise<string> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Prepare trade data, omitting undefined strategyId
  const tradeData: any = {
    userId,
    stockType: data.stockType,
    inTime: data.inTime,
    outTime: data.outTime,
    quantity: data.quantity,
    men: data.men,
    strategyId: data?.strategyId || null,
    mep: data.mep,
    result: data.result,
    date: Timestamp.fromDate(new Date(data.date + 'T12:00:00')),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), tradeData);
  return docRef.id;
}

// Update an existing trade
export async function updateTrade(
  userId: string,
  tradeId: string,
  data: Partial<TradeFormData>
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const tradeRef = doc(db, COLLECTION_NAME, tradeId);
  
  // First verify the trade belongs to the user
  const tradeDoc = await getDoc(tradeRef);
  if (!tradeDoc.exists()) {
    throw new Error('Trade not found');
  }

  const trade = tradeDoc.data() as Trade;
  if (trade.userId !== userId) {
    throw new Error('Unauthorized: Trade does not belong to user');
  }

  const updateData: any = {
    updatedAt: Timestamp.now(),
  };

  // Add fields that are defined
  if (data.stockType !== undefined) updateData.stockType = data.stockType;
  if (data.inTime !== undefined) updateData.inTime = data.inTime;
  if (data.outTime !== undefined) updateData.outTime = data.outTime;
  if (data.quantity !== undefined) updateData.quantity = data.quantity;
  if (data.men !== undefined) updateData.men = data.men;
  if (data.mep !== undefined) updateData.mep = data.mep;
  if (data.result !== undefined) updateData.result = data.result;

  if (data.strategyId) {
    updateData.strategyId = data.strategyId;
  } else {
    updateData.strategyId = null;
  }

  // Convert date string to Timestamp if provided
  if (data.date) {
    updateData.date = Timestamp.fromDate(new Date(data.date + 'T12:00:00'));
  }

  await updateDoc(tradeRef, updateData);
}

// Delete a trade
export async function deleteTrade(
  userId: string,
  tradeId: string
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const tradeRef = doc(db, COLLECTION_NAME, tradeId);
  
  // First verify the trade belongs to the user
  const tradeDoc = await getDoc(tradeRef);
  if (!tradeDoc.exists()) {
    throw new Error('Trade not found');
  }

  const trade = tradeDoc.data() as Trade;
  if (trade.userId !== userId) {
    throw new Error('Unauthorized: Trade does not belong to user');
  }

  await deleteDoc(tradeRef);
}

// Get a single trade
export async function getTrade(
  userId: string,
  tradeId: string
): Promise<Trade | null> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const tradeRef = doc(db, COLLECTION_NAME, tradeId);
  const tradeDoc = await getDoc(tradeRef);

  if (!tradeDoc.exists()) {
    return null;
  }

  const trade = tradeDoc.data() as Omit<Trade, 'id'>;
  
  // Verify the trade belongs to the user
  if (trade.userId !== userId) {
    throw new Error('Unauthorized: Trade does not belong to user');
  }

  return {
    id: tradeDoc.id,
    ...trade,
  };
}

// Get trades with pagination and filtering
export async function getTrades(
  userId: string,
  options: {
    limitCount?: number;
    lastDoc?: DocumentSnapshot;
    searchTerm?: string;
    strategyId?: string;
    dateFrom?: string;
    dateTo?: string;
    resultType?: 'all' | 'profit' | 'loss';
  } = {}
): Promise<{
  trades: Trade[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { 
    limitCount = 10, 
    lastDoc, 
    searchTerm, 
    strategyId, 
    dateFrom, 
    dateTo,
    resultType = 'all'
  } = options;

  let q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(limitCount + 1) // Get one extra to check if there are more
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  
  // Check if there are more documents
  const hasMore = docs.length > limitCount;
  const tradesToReturn = hasMore ? docs.slice(0, -1) : docs;

  let trades: Trade[] = tradesToReturn.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Trade, 'id'>),
  }));

  // Client-side filtering
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    trades = trades.filter(
      trade =>
        trade.stockType.toLowerCase().includes(searchLower)
    );
  }

  if (strategyId && strategyId !== 'all') {
    trades = trades.filter(trade => trade.strategyId === strategyId);
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    trades = trades.filter(trade => {
      const tradeDate = trade.date.toDate();
      return tradeDate >= fromDate;
    });
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    trades = trades.filter(trade => {
      const tradeDate = trade.date.toDate();
      return tradeDate <= toDate;
    });
  }

  if (resultType !== 'all') {
    trades = trades.filter(trade => {
      if (resultType === 'profit') {
        return trade.result > 0;
      } else if (resultType === 'loss') {
        return trade.result <= 0;
      }
      return true;
    });
  }

  return {
    trades,
    lastDoc: tradesToReturn.length > 0 ? tradesToReturn[tradesToReturn.length - 1] : null,
    hasMore,
  };
}

// Get trades by strategy
export async function getTradesByStrategy(
  userId: string,
  strategyId: string
): Promise<Trade[]> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    where('strategyId', '==', strategyId),
    orderBy('date', 'desc')
  );

  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Trade, 'id'>),
  }));
}

// Count total trades for pagination
export async function getTradesCount(
  userId: string,
  options: {
    searchTerm?: string;
    strategyId?: string;
    dateFrom?: string;
    dateTo?: string;
    resultType?: 'all' | 'profit' | 'loss';
    withoutStrategy?: boolean;
  } = {}
): Promise<number> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { 
    strategyId, 
    dateFrom, 
    dateTo,
    resultType = 'all',
    withoutStrategy = false
  } = options;

  let q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  // Apply strategy filter at query level  
  if (!withoutStrategy && strategyId && strategyId !== 'all') {
    q = query(q, where('strategyId', '==', strategyId));
  }

  if (withoutStrategy) {
    q = query(q, where('strategyId', '==', null));
  }

  // Apply date range filters at query level
  if (dateFrom) {
    const fromDate = Timestamp.fromDate(new Date(dateFrom + 'T00:00:00'));
    q = query(q, where('date', '>=', fromDate));
  }

  if (dateTo) {
    const toDate = Timestamp.fromDate(new Date(dateTo + 'T23:59:59.999'));
    q = query(q, where('date', '<=', toDate));
  }

  // Apply result type filter at query level
  if (resultType === 'profit') {
    q = query(q, where('result', '>', 0));
  } else if (resultType === 'loss') {
    q = query(q, where('result', '<=', 0));
  }

  // Use efficient count query
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

// Get trades for a specific page using cursor-based pagination
export async function getTradesForPage(
  userId: string,
  options: {
    page?: number;
    limitCount?: number;
    searchTerm?: string;
    strategyId?: string;
    dateFrom?: string;
    dateTo?: string;
    resultType?: 'all' | 'profit' | 'loss';
    withoutStrategy?: boolean;
  } = {}
): Promise<Trade[]> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { 
    page = 1,
    limitCount = 1,
    strategyId, 
    dateFrom, 
    dateTo,
    resultType = 'all',
    withoutStrategy = false
  } = options;

  // Regular query for other filters
  let q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  // Apply strategy filter at query level
  if (!withoutStrategy && strategyId && strategyId !== 'all') {
    q = query(q, where('strategyId', '==', strategyId));
  }

  if (!strategyId && withoutStrategy) {
    q = query(q, where('strategyId', '==', null));
  }

  // Apply date range filters at query level
  if (dateFrom) {
    const fromDate = Timestamp.fromDate(new Date(dateFrom + 'T00:00:00'));
    q = query(q, where('date', '>=', fromDate));
  }

  if (dateTo) {
    const toDate = Timestamp.fromDate(new Date(dateTo + 'T23:59:59.999'));
    q = query(q, where('date', '<=', toDate));
  }

  // Apply result type filter at query level
  if (resultType === 'profit') {
    q = query(q, where('result', '>', 0));
  } else if (resultType === 'loss') {
    q = query(q, where('result', '<=', 0));
  }

  // Add ordering and limit
  q = query(q, orderBy('date', 'desc'));

  // For page-based pagination, we need to fetch more data and slice it
  // This is not optimal for large datasets but works for smaller ones
  const fetchLimit = page * limitCount;
  q = query(q, limit(fetchLimit));

  const querySnapshot = await getDocs(q);
  const trades: Trade[] = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Trade, 'id'>),
  }));

  // No client-side filtering needed - all filters are handled by Firestore

  // Get the specific page slice
  const startIndex = (page - 1) * limitCount;
  const endIndex = startIndex + limitCount;
  
  return trades.slice(startIndex, endIndex);
}