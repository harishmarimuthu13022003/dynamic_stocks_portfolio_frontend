import connectDB from './mongodb';
import Stock from '../models/Stock';

const initialStocks = [
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries',
    purchasePrice: 2450.50,
    quantity: 10,
    sector: 'Energy',
    exchange: 'NSE'
  },
  {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services',
    purchasePrice: 3200.00,
    quantity: 5,
    sector: 'Technology',
    exchange: 'NSE'
  },
  {
    symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank',
    purchasePrice: 1550.75,
    quantity: 15,
    sector: 'Financials',
    exchange: 'NSE'
  },
  {
    symbol: 'INFY.NS',
    name: 'Infosys',
    purchasePrice: 1450.00,
    quantity: 20,
    sector: 'Technology',
    exchange: 'NSE'
  },
  {
    symbol: 'ICICIBANK.NS',
    name: 'ICICI Bank',
    purchasePrice: 850.25,
    quantity: 25,
    sector: 'Financials',
    exchange: 'NSE'
  }
];

export async function seedDatabase() {
  await connectDB();
  
  // Clear existing stocks
  await Stock.deleteMany({});
  
  // Insert initial stocks
  await Stock.insertMany(initialStocks);
  
  return initialStocks;
}
