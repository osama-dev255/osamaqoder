import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExpenseCategorization } from './ExpenseCategorization';
import { RecurringExpenses } from './RecurringExpenses';
import { ExpenseApprovalWorkflow } from './ExpenseApprovalWorkflow';
import { ExpenseReporting } from './ExpenseReporting';

export function ExpenseManagement() {
  const [activeTab, setActiveTab] = useState<'categorization' | 'recurring' | 'approval' | 'reporting'>('categorization');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Expense Management</h2>
        <p className="text-gray-600">
          Track and manage your business expenses
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeTab === 'categorization' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('categorization')}
        >
          Categorization & Analytics
        </Button>
        <Button 
          variant={activeTab === 'recurring' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('recurring')}
        >
          Recurring Expenses
        </Button>
        <Button 
          variant={activeTab === 'approval' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('approval')}
        >
          Approval Workflow
        </Button>
        <Button 
          variant={activeTab === 'reporting' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('reporting')}
        >
          Reporting & Analytics
        </Button>
      </div>

      {activeTab === 'recurring' ? (
        <RecurringExpenses />
      ) : activeTab === 'approval' ? (
        <ExpenseApprovalWorkflow />
      ) : activeTab === 'reporting' ? (
        <ExpenseReporting />
      ) : (
        <ExpenseCategorization />
      )}
    </div>
  );
}