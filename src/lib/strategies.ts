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
import { Strategy, StrategyFormData } from '@/types';

const COLLECTION_NAME = 'strategies';

// Create a new strategy
export async function createStrategy(
  userId: string,
  data: StrategyFormData
): Promise<string> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const strategyData = {
    ...data,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), strategyData);
  return docRef.id;
}

// Update an existing strategy
export async function updateStrategy(
  userId: string,
  strategyId: string,
  data: Partial<StrategyFormData>
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const strategyRef = doc(db, COLLECTION_NAME, strategyId);
  
  // First verify the strategy belongs to the user
  const strategyDoc = await getDoc(strategyRef);
  if (!strategyDoc.exists()) {
    throw new Error('Strategy not found');
  }

  const strategy = strategyDoc.data() as Strategy;
  if (strategy.userId !== userId) {
    throw new Error('Unauthorized: Strategy does not belong to user');
  }

  const updateData = {
    ...data,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(strategyRef, updateData);
}

// Delete a strategy
export async function deleteStrategy(
  userId: string,
  strategyId: string
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const strategyRef = doc(db, COLLECTION_NAME, strategyId);
  
  const strategyDoc = await getDoc(strategyRef);
  if (!strategyDoc.exists()) {
    throw new Error('Strategy not found');
  }

  const strategy = strategyDoc.data() as Strategy;
  if (strategy.userId !== userId) {
    throw new Error('Unauthorized: Strategy does not belong to user');
  }

  await deleteDoc(strategyRef);
}

// Get a single strategy
export async function getStrategy(
  userId: string,
  strategyId: string
): Promise<Strategy | null> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const strategyRef = doc(db, COLLECTION_NAME, strategyId);
  const strategyDoc = await getDoc(strategyRef);

  if (!strategyDoc.exists()) {
    return null;
  }

  const strategy = strategyDoc.data() as Omit<Strategy, 'id'>;
  
  // Verify the strategy belongs to the user
  if (strategy.userId !== userId) {
    throw new Error('Unauthorized: Strategy does not belong to user');
  }

  return {
    id: strategyDoc.id,
    ...strategy,
  };
}

// Get strategies with pagination and filtering
export async function getStrategies(
  userId: string,
  options: {
    limitCount?: number;
    lastDoc?: DocumentSnapshot;
    searchTerm?: string;
  } = {}
): Promise<{
  strategies: Strategy[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { limitCount = 10, lastDoc, searchTerm } = options;

  let q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount + 1) // Get one extra to check if there are more
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  
  // Check if there are more documents
  const hasMore = docs.length > limitCount;
  const strategiesToReturn = hasMore ? docs.slice(0, -1) : docs;

  let strategies: Strategy[] = strategiesToReturn.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Strategy, 'id'>),
  }));

  // Client-side filtering if search term is provided
  if (searchTerm) {
    const searchLower = searchTerm;
    strategies = strategies.filter(
      strategy =>
        strategy.name.includes(searchLower)
    );
  }

  return {
    strategies,
    lastDoc: strategiesToReturn.length > 0 ? strategiesToReturn[strategiesToReturn.length - 1] : null,
    hasMore,
  };
}

// Get all strategies for a user (for dropdowns, etc.)
export async function getAllUserStrategies(userId: string): Promise<Strategy[]> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('name', 'asc')
  );

  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Strategy, 'id'>),
  }));
}

// Count total strategies for pagination
export async function getStrategiesCount(
  userId: string,
  options: {
    searchTerm?: string;
  } = {}
): Promise<number> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { searchTerm } = options;

  if (!searchTerm) {
    // Use efficient count query when no search term filtering is needed
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  // Search in name field
  const nameQuery = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    where('name', '>=', searchTerm),
    where('name', '<=', searchTerm + '\uf8ff')
  );

  const [nameSnapshot] = await Promise.all([
    getDocs(nameQuery),
  ]);

  // Combine results and remove duplicates
  const nameStrategies = nameSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Strategy, 'id'>) }));

  return nameStrategies.length;
}

// Get strategies for a specific page
export async function getStrategiesForPage(
  userId: string,
  options: {
    page?: number;
    limitCount?: number;
    searchTerm?: string;
  } = {}
): Promise<Strategy[]> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { 
    page = 1,
    limitCount = 6,
    searchTerm
  } = options;

  let allStrategies: Strategy[] = [];

  if (!searchTerm) {
    // No search term - use regular pagination
    const fetchLimit = page * limitCount;
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(fetchLimit)
    );

    const querySnapshot = await getDocs(q);
    allStrategies = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Strategy, 'id'>),
    }));
  } else {
    // Search term provided - use Firestore search queries
    const searchLower = searchTerm;
    
    // Search in name field
    const nameQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('name', '>=', searchLower),
      where('name', '<=', searchLower + '\uf8ff'),
      orderBy('name'),
      orderBy('createdAt', 'desc')
    );

    // Execute both queries
    const [nameSnapshot] = await Promise.all([
      getDocs(nameQuery),
    ]);

    // Combine results and remove duplicates
    const nameStrategies = nameSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Strategy, 'id'>) }));
    
    // Use a Set to track unique IDs and avoid duplicates
    const uniqueIds = new Set<string>();

    // Add strategies from name search
    nameStrategies.forEach(strategy => {
      if (strategy.name.includes(searchLower)) {
        uniqueIds.add(strategy.id);
        allStrategies.push(strategy);
      }
    });

    // Sort by creation date (most recent first)
    allStrategies.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  }

  // Get the specific page slice
  const startIndex = (page - 1) * limitCount;
  const endIndex = startIndex + limitCount;
  
  return allStrategies.slice(startIndex, endIndex);
}