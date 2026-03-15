import connectDB from './mongodb';
import Stock from '../models/Stock';

const initialStocks = [
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries',
    purchasePrice: 2450.50,
    quantity: 10,
    sector: 'Energy',
    exchange: 'NSE',
    cmp: 1280.00,
    peRatio: '24.5',
    latestEarnings: '₹68.2'
  },
  {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services',
    purchasePrice: 3200.00,
    quantity: 5,
    sector: 'Technology',
    exchange: 'NSE',
    cmp: 4100.00,
    peRatio: '28.9',
    latestEarnings: '₹124.5'
  },
  {
    symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank',
    purchasePrice: 1550.75,
    quantity: 15,
    sector: 'Financials',
    exchange: 'NSE',
    cmp: 1650.00,
    peRatio: '18.5',
    latestEarnings: '₹52.4'
  },
  {
    symbol: 'INFY.NS',
    name: 'Infosys',
    purchasePrice: 1450.00,
    quantity: 20,
    sector: 'Technology',
    exchange: 'NSE',
    cmp: 1620.00,
    peRatio: '22.1',
    latestEarnings: '₹62.3'
  },
  {
    symbol: 'ICICIBANK.NS',
    name: 'ICICI Bank',
    purchasePrice: 850.25,
    quantity: 25,
    sector: 'Financials',
    exchange: 'NSE',
    cmp: 1100.00,
    peRatio: '17.2',
    latestEarnings: '₹48.9'
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
