'use client';

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getGroupedRowModel,
  GroupingState,
} from '@tanstack/react-table';
import { Stock } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PortfolioTableProps {
  data: Stock[];
}

const columnHelper = createColumnHelper<Stock>();

export default function PortfolioTable({ data }: PortfolioTableProps) {
  const [grouping, setGrouping] = React.useState<GroupingState>(['sector']);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Particulars',
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-semibold text-white">{info.getValue()}</span>
            <span className="text-[10px] text-gray-500 font-mono">{info.row.original.symbol}</span>
          </div>
        ),
      }),
      columnHelper.accessor('purchasePrice', {
        header: 'Purchase Price',
        cell: (info) => `₹${info.getValue().toLocaleString()}`,
      }),
      columnHelper.accessor('quantity', {
        header: 'Qty',
      }),
      columnHelper.accessor('symbol', {
        id: 'investment',
        header: 'Investment',
        cell: (info) => {
          const inv = info.row.original.purchasePrice * info.row.original.quantity;
          return `₹${inv.toLocaleString()}`;
        },
      }),
      columnHelper.accessor('symbol', {
        id: 'portfolioWeight',
        header: 'Portfolio (%)',
        cell: (info) => {
          const totalInv = data.reduce((acc, s) => acc + (s.purchasePrice * s.quantity), 0);
          const stockInv = info.row.original.purchasePrice * info.row.original.quantity;
          const weight = totalInv > 0 ? (stockInv / totalInv) * 100 : 0;
          return `${weight.toFixed(2)}%`;
        },
      }),
      columnHelper.accessor('exchange', {
        header: 'NSE/BSE',
        cell: (info) => (
          <span className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider",
            info.getValue() === 'NSE' ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"
          )}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('cmp', {
        header: 'CMP',
        cell: (info) => {
          const val = info.getValue();
          return val ? `₹${val.toLocaleString()}` : <span className="animate-pulse text-gray-600">...</span>;
        },
      }),
      columnHelper.accessor('symbol', {
        id: 'presentValue',
        header: 'Present Value',
        cell: (info) => {
          const cmp = info.row.original.cmp;
          if (!cmp) return '---';
          const pv = cmp * info.row.original.quantity;
          return `₹${pv.toLocaleString()}`;
        },
      }),
      columnHelper.accessor('symbol', {
        id: 'gainLoss',
        header: 'Gain/Loss',
        cell: (info) => {
          const cmp = info.row.original.cmp;
          if (!cmp) return '---';
          const inv = info.row.original.purchasePrice * info.row.original.quantity;
          const pv = cmp * info.row.original.quantity;
          const gl = pv - inv;
          const isGain = gl >= 0;
          return (
            <span className={cn("font-medium", isGain ? "text-success" : "text-error")}>
              {isGain ? '+' : ''}{gl.toLocaleString()}
            </span>
          );
        },
      }),
      columnHelper.accessor('peRatio', {
        header: 'P/E Ratio',
        cell: (info) => <span className="text-gray-300 font-mono">{info.getValue() || 'N/A'}</span>,
      }),
      columnHelper.accessor('latestEarnings', {
        header: 'Latest Earnings',
        cell: (info) => <span className="text-gray-300 font-mono">{info.getValue() || 'N/A'}</span>,
      }),
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
    },
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  return (
    <div className="glass-card overflow-hidden animate-in" style={{ animationDelay: '0.1s' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-secondary/50 text-gray-400 text-xs uppercase tracking-wider">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-sm">
            {table.getRowModel().rows.map((row) => {
              if (row.getIsGrouped()) {
                // Calculate sector summaries
                const sectorStocks = row.subRows.map(r => r.original);
                const totalInv = sectorStocks.reduce((acc, s) => acc + (s.purchasePrice * s.quantity), 0);
                const totalPV = sectorStocks.reduce((acc, s) => acc + ((s.cmp || 0) * s.quantity), 0);
                const totalGL = totalPV - totalInv;

                return (
                  <React.Fragment key={row.id}>
                    <tr className="bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border-b border-border">
                      <td colSpan={table.getAllColumns().length} className="p-4" onClick={row.getToggleExpandedHandler()}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className="font-bold text-primary uppercase">{row.getValue('sector') as string}</span>
                            <span className="text-xs text-gray-500">({sectorStocks.length} holdings)</span>
                          </div>
                          <div className="flex gap-6 text-xs font-medium">
                            <span>Inv: <span className="text-white">₹{totalInv.toLocaleString()}</span></span>
                            <span>Val: <span className="text-white">₹{totalPV.toLocaleString()}</span></span>
                            <span>G/L: <span className={totalGL >= 0 ? "text-success" : "text-error"}>
                              {totalGL >= 0 ? '+' : ''}{totalGL.toLocaleString()}
                            </span></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {row.getIsExpanded() && row.subRows.map(subRow => (
                      <tr key={subRow.id} className="border-b border-border hover:bg-white/5 transition-colors">
                        {subRow.getVisibleCells().map(cell => (
                          <td key={cell.id} className="p-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }
              return (
                <tr key={row.id} className="border-b border-border hover:bg-white/5 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
