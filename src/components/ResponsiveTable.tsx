import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ResponsiveTableProps {
  headers: string[];
  rows: any[][];
  renderRow: (row: any[], index: number) => React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ headers, rows, renderRow, className = '' }: ResponsiveTableProps) {
  // For mobile devices, we'll show a stacked view
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="border rounded-lg p-4 bg-card">
            <div className="space-y-2">
              {headers.map((header, headerIndex) => (
                <div key={headerIndex} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <span className="font-medium text-gray-600">{header}:</span>
                  <span className="font-medium">
                    {typeof row[headerIndex] === 'object' ? row[headerIndex] : String(row[headerIndex])}
                  </span>
                </div>
              ))}
            </div>
            {renderRow(row, rowIndex)}
          </div>
        ))}
      </div>
    );
  }

  // For desktop, show the regular table
  return (
    <div className={`rounded-md border overflow-x-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className="whitespace-nowrap">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className={cellIndex === row.length - 1 ? 'text-right' : ''}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}