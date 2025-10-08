import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  TrendingUp,
  Calendar,
  Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSheetData } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

export function Expenses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        // Fetch expenses data from the Expenses sheet
        const response = await getSheetData('Expenses');
        
        if (response && response.data && response.data.values) {
          const rows = response.data.values;
          
          // If the sheet is empty, initialize with sample data
          if (rows.length === 0) {
            const sampleExpenses = [
              {
                id: '1',
                date: '2024-12-01',
                category: 'Utilities',
                description: 'Electricity Bill',
                amount: 50000,
                status: 'paid'
              },
              {
                id: '2',
                date: '2024-12-05',
                category: 'Rent',
                description: 'Monthly Office Rent',
                amount: 250000,
                status: 'paid'
              },
              {
                id: '3',
                date: '2024-12-10',
                category: 'Supplies',
                description: 'Office Stationery',
                amount: 15000,
                status: 'paid'
              },
              {
                id: '4',
                date: '2024-12-15',
                category: 'Marketing',
                description: 'Social Media Ads',
                amount: 30000,
                status: 'pending'
              }
            ];
            setExpenses(sampleExpenses);
          } else {
            // Skip header row and map the data to expense objects
            const expenseData = rows.slice(1).map((row: any[], index: number) => ({
              id: row[0] || `${index + 1}`, // ID
              date: row[1] || 'Unknown Date', // Date
              category: row[2] || 'Uncategorized', // Category
              description: row[3] || 'No Description', // Description
              amount: parseFloat(row[4]) || 0, // Amount
              status: row[5] || 'pending' // Status
            }));
            
            setExpenses(expenseData);
          }
        } else {
          // Initialize with sample data if no data is returned
          const sampleExpenses = [
            {
              id: '1',
              date: '2024-12-01',
              category: 'Utilities',
              description: 'Electricity Bill',
              amount: 50000,
              status: 'paid'
            },
            {
              id: '2',
              date: '2024-12-05',
              category: 'Rent',
              description: 'Monthly Office Rent',
              amount: 250000,
              status: 'paid'
            },
            {
              id: '3',
              date: '2024-12-10',
              category: 'Supplies',
              description: 'Office Stationery',
              amount: 15000,
              status: 'paid'
            },
            {
              id: '4',
              date: '2024-12-15',
              category: 'Marketing',
              description: 'Social Media Ads',
              amount: 30000,
              status: 'pending'
            }
          ];
          setExpenses(sampleExpenses);
        }
        
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch expenses: ' + (error.message || 'Unknown error'));
        console.error('Expenses fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || expense.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">
            Loading expense records...
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading expenses...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">
            Manage your business expenses
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
        <p className="text-muted-foreground">
          Track and manage your business expenses
        </p>
      </div>

      {/* Expense Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">All recorded expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Expenses</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paidExpenses)}</div>
            <p className="text-xs text-muted-foreground">Successfully paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingExpenses)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Expense Records</CardTitle>
              <CardDescription>
                View and manage your business expenses
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  <DropdownMenuItem onSelect={() => setFilter('paid')}>
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div>{expense.date}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{expense.description}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    {expense.status === 'paid' && <Badge variant="default">Paid</Badge>}
                    {expense.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}