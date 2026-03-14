import mongoose, { Schema, model, models } from 'mongoose';

export interface IStock {
  symbol: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: 'NSE' | 'BSE';
  createdAt?: Date;
}

const StockSchema = new Schema<IStock>({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  purchasePrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sector: { type: String, required: true },
  exchange: { type: String, enum: ['NSE', 'BSE'], default: 'NSE' },
  createdAt: { type: Date, default: Date.now },
});

const Stock = models.Stock || model<IStock>('Stock', StockSchema);

export default Stock;
