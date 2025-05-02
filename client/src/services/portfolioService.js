import { api } from './api';
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from './api';
import Papa from 'papaparse';

export const getPortfolio = async (userId) => {
  try {
    // Get latest portfolio from Firestore
    const portfoliosRef = collection(db, 'users', userId, 'portfolios');
    const q = query(portfoliosRef, orderBy('timestamp', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

export const uploadPortfolio = async (userId, file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Transform CSV data to the expected format
          const holdings = results.data.map(row => ({
            ticker: row.Ticker,
            shares: parseFloat(row.Shares),
            averageCost: parseFloat(row.AverageCost)
          }));
          
          // Validate required fields
          const isValid = holdings.every(
            holding => holding.ticker && !isNaN(holding.shares) && !isNaN(holding.averageCost)
          );
          
          if (!isValid) {
            reject(new Error('Invalid CSV format. Must include Ticker, Shares, and AverageCost columns with valid values.'));
            return;
          }
          
          // Store portfolio in Firestore
          const portfoliosRef = collection(db, 'users', userId, 'portfolios');
          const docRef = await addDoc(portfoliosRef, {
            holdings,
            timestamp: serverTimestamp()
          });
          
          // Send to backend for analysis
          const response = await api.post('/portfolio', { holdings });
          
          resolve({
            id: docRef.id,
            holdings,
            analysis: response.data.analysis
          });
        } catch (error) {
          console.error('Error processing portfolio:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      }
    });
  });
};