import { Timestamp } from 'firebase/firestore';

export interface Strategy {
  id: string;              // Firestore document ID
  userId: string;          // Authentication UID - REQUIRED
  name: string;
  direction: 'Contra Tendencia' | 'Tendencia' | 'Neutro';
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Trade {
  id: string;              // Firestore document ID
  userId: string;          // Authentication UID - REQUIRED
  strategyId?: string;     // Optional reference to strategy document
  stockType: string;
  inTime: string;          // Time format: "HH:MM"
  outTime: string;         // Time format: "HH:MM"
  quantity: number;
  men: number;             // Entry price
  mep: number;             // Exit price
  date: Timestamp;
  result: number;          // User-entered profit/loss result
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Form types (without Firestore-specific fields)
export interface StrategyFormData {
  name: string;
  direction: 'Contra Tendencia' | 'Tendencia' | 'Neutro';
  description: string;
}

export interface TradeFormData {
  strategyId?: string;
  stockType: string;
  inTime: string;
  outTime: string;
  quantity: number;
  men: number;
  mep: number;
  result: number;
  date: string; // ISO date string for forms
}