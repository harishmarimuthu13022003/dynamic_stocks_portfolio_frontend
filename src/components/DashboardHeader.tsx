import React from 'react';
import { PortfolioSummary } from '@/types';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  summary: PortfolioSummary;
}

export default function DashboardHeader({ summary }: DashboardHeaderProps) {
  const isGain = summary.totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <SummaryCard
        title="Total Investment"
        value={`₹${summary.totalInvestment.toLocaleString()}`}
        icon={<DollarSign className="text-blue-500" size={24} />}
      />
      <SummaryCard
        title="Current Value"
        value={`₹${summary.currentValue.toLocaleString()}`}
        icon={<PieChart className="text-purple-500" size={24} />}
      />
      <SummaryCard
        title="Total Profit/Loss"
        value={`₹${summary.totalGainLoss.toLocaleString()}`}
        subValue={`${isGain ? '+' : ''}${summary.totalGainLossPercentage.toFixed(2)}%`}
        icon={isGain ? <TrendingUp className="text-success" size={24} /> : <TrendingDown className="text-error" size={24} />}
        valueClass={isGain ? "text-success" : "text-error"}
      />
      <SummaryCard
        title="Holdings"
        value="Dynamic"
        subValue="Real-time tracking"
        icon={<TrendingUp className="text-accent" size={24} />}
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  valueClass?: string;
}

function SummaryCard({ title, value, subValue, icon, valueClass }: SummaryCardProps) {
  return (
    <div className="glass-card p-6 animate-in">
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <div className="p-2 bg-secondary rounded-lg">{icon}</div>
      </div>
      <div className="flex flex-col">
        <span className={cn("text-2xl font-bold", valueClass)}>{value}</span>
        {subValue && (
          <span className={cn("text-sm font-medium mt-1", valueClass || "text-gray-400")}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
}
