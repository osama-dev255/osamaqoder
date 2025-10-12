import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  Calendar,
  Tag,
  Repeat,
  Save,
  X,
  Play,
  Pause
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/currency';

interface RecurringExpense {
  id: string;
  description: string;
  category: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextDueDate: string;
  status: 'active' | 'paused' | 'completed';
  notes?: string;
}

export function RecurringExpenses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for adding/editing recurring expenses
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize with sample data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const sampleExpenses: RecurringExpense[] = [
        {
          id: '1',
          description: 'Office Rent',
          category: 'Rent',
          amount: 250000,
          frequency: 'monthly',
          startDate: '2024-01-01',
          nextDueDate: '2024-12-01',
          status: 'active',
          notes: 'Monthly office space rental'
        },
        {
          id: '2',
          description: 'Internet Service',
          category: 'Utilities',
          amount: 50000,
          frequency: 'monthly',
          startDate: '2024-01-15',
          nextDueDate: '2024-12-15',
          status: 'active',
          notes: 'High-speed business internet'
        },
        {
          id: '3',
          description: 'Accounting Software',
          category: 'Software',
          amount: 30000,
          frequency: 'monthly',
          startDate: '2024-02-01',
          nextDueDate: '2024-12-01',
          status: 'active',
          notes: 'Monthly subscription'
        },
        {
          id: '4',
          description: 'Insurance Premium',
          category: 'Insurance',
          amount: 40000,
          frequency: 'quarterly',
          startDate: '2024-01-01',
          nextDueDate: '2025-01-01',
          status: 'active',
          notes: 'Annual insurance divided quarterly'
        }
      ];
      
      setExpenses(sampleExpenses);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || expense.status === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredExpenses(filtered);
  }, [searchTerm, filter, expenses]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateNextDueDate = (startDate: string, frequency: RecurringExpense['frequency']): string => {
    const date = new Date(startDate);
    
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    
    return date.toISOString().split('T')[0];
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const amount = parseFloat(formData.amount);
      const nextDueDate = calculateNextDueDate(formData.startDate, formData.frequency);
      
      if (editingExpense) {
        // Update existing expense
        const updatedExpense: RecurringExpense = {
          ...editingExpense,
          description: formData.description,
          category: formData.category,
          amount,
          frequency: formData.frequency,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          nextDueDate,
          notes: formData.notes
        };
        
        setExpenses(expenses.map(exp => exp.id === editingExpense.id ? updatedExpense : exp));
        setEditingExpense(null);
      } else {
        // Add new expense
        const newExpense: RecurringExpense = {
          id: `recurring-${Date.now()}`,
          description: formData.description,
          category: formData.category,
          amount,
          frequency: formData.frequency,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          nextDueDate,
          status: 'active',
          notes: formData.notes
        };
        
        setExpenses([...expenses, newExpense]);
      }
      
      // Reset form
      setFormData({
        description: '',
        category: '',
        amount: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: ''
      });
      setShowForm(false);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to save recurring expense: ' + (error.message || 'Unknown error'));
      console.error('Recurring expense save error:', error);
    }
  };

  const handleEdit = (expense: RecurringExpense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount.toString(),
      frequency: expense.frequency,
      startDate: expense.startDate,
      endDate: expense.endDate || '',
      notes: expense.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this recurring expense?')) {
      return;
    }
    
    try {
      setExpenses(expenses.filter(exp => exp.id !== expenseId));
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to delete recurring expense: ' + (error.message || 'Unknown error'));
      console.error('Recurring expense delete error:', error);
    }
  };

  const toggleStatus = async (expenseId: string) => {
    try {
      setExpenses(expenses.map(expense => {
        if (expense.id === expenseId) {
          return {
            ...expense,
            status: expense.status === 'active' ? 'paused' : 'active'
          };
        }
        return expense;
      }));
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to update expense status: ' + (error.message || 'Unknown error'));
      console.error('Expense status update error:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpense(null);
    setFormData({
      description: '',
      category: '',
      amount: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
    setErrors({});
  };

  // Calculate summary statistics
  const activeExpenses = expenses.filter(e => e.status === 'active').length;
  const monthlyRecurring = expenses
    .filter(e => e.status === 'active')
    .filter(e => e.frequency === 'monthly')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const yearlyRecurring = expenses
    .filter(e => e.status === 'active')
    .reduce((sum, expense) => {
      let multiplier = 1;
      switch (expense.frequency) {
        case 'daily': multiplier = 365; break;
        case 'weekly': multiplier = 52; break;
        case 'monthly': multiplier = 12; break;
        case 'quarterly': multiplier = 4; break;
        case 'yearly': multiplier = 1; break;
      }
      return sum + (expense.amount * multiplier);
    }, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getFrequencyLabel = (frequency: RecurringExpense['frequency']) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return frequency;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading recurring expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Repeat className="mr-2 h-5 w-5" />
                {editingExpense ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
              </CardTitle>
              <CardDescription>
                {editingExpense ? 'Update recurring expense details' : 'Create a new recurring expense'}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                Description *
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter expense description"
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                Category *
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Enter category"
                className={errors.category ? 'border-red-500' : ''}
              />
              {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                Amount (TSh) *
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="Enter amount"
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency" className="flex items-center">
                <Repeat className="mr-2 h-4 w-4" />
                Frequency
              </Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(value) => setFormData({...formData, frequency: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-date" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                End Date (Optional)
              </Label>
              <Input
                id="end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes about this recurring expense"
            />
          </div>
        </CardContent>
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Recurring</CardTitle>
            <Repeat className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeExpenses}</div>
            <p className="text-xs text-gray-600">Active expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRecurring)}</div>
            <p className="text-xs text-gray-600">Expected monthly cost</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Total</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(yearlyRecurring)}</div>
            <p className="text-xs text-gray-600">Expected annual cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Recurring Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <Repeat className="mr-2 h-5 w-5" />
                Recurring Expenses
              </CardTitle>
              <CardDescription>
                Manage your recurring business expenses
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setFilter('all')}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('paused')}>
                    Paused
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Recurring Expense
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div className="font-medium">{expense.description}</div>
                    {expense.notes && (
                      <div className="text-sm text-gray-600 mt-1">
                        {expense.notes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>{getFrequencyLabel(expense.frequency)}</TableCell>
                  <TableCell>{expense.nextDueDate}</TableCell>
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleStatus(expense.id)}
                      >
                        {expense.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <Repeat className="h-12 w-12 mx-auto mb-4" />
              <p>No recurring expenses found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Recurring Expense
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}