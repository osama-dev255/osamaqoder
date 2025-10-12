import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpenseCategorization } from '@/components/ExpenseCategorization';
import { ExpenseManagement } from '@/components/ExpenseManagement';

export function Expenses() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
        <p className="text-gray-600">
          Track and manage your business expenses
        </p>
      </div>

      <ExpenseManagement />
    </div>
  );
}
