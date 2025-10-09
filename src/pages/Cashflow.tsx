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
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  ArrowUpDown
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

interface CashflowItem {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  balance: number;
  reference?: string;
}

export function Cashflow() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [cashflowItems, setCashflowItems] = useState<CashflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCashflowData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from multiple sheets to create a comprehensive cashflow
        const [salesResponse, purchasesResponse, expensesResponse] = await Promise.all([
          getSheetData('Sales'), // Sales data
          getSheetData('Purchases'), // Purchases data
          getSheetData('Expenses') // Expenses data
        ]);
        
        const allItems: CashflowItem[] = [];
        
        // Process sales data (income)
        if (salesResponse && salesResponse.data && salesResponse.data.values) {
          const salesRows = salesResponse.data.values.slice(1, 51); // Limit to first 50 records
          salesRows.forEach((row: any[], index: number) => {
            const amount = parseFloat(row[9]?.replace('TSh', '').replace(/,/g, '')) || 0;
            if (amount > 0) {
              allItems.push({
                id: `sale-${row[0] || index}`,
                date: row[2] || 'Unknown Date',
                description: `Sale: ${row[5] || 'Unknown Product'}`,
                category: 'Sales',
                type: 'income',
                amount,
                balance: 0, // Will calculate later
                reference: `Receipt #${row[1] || 'N/A'}`
              });
            }
          });
        }
        
        // Process purchases data (expenses)
        if (purchasesResponse && purchasesResponse.data && purchasesResponse.data.values) {
          const purchaseRows = purchasesResponse.data.values.slice(1, 51); // Limit to first 50 records
          purchaseRows.forEach((row: any[], index: number) => {
            const amount = parseFloat(row[8]?.replace('TSh', '').replace(/,/g, '')) || 0;
            if (amount > 0) {
              allItems.push({
                id: `purchase-${row[0] || index}`,
                date: row[2] || 'Unknown Date',
                description: `Purchase: ${row[5] || 'Unknown Product'}`,
                category: 'Purchases',
                type: 'expense',
                amount,
                balance: 0, // Will calculate later
                reference: `Receipt #${row[1] || 'N/A'}`
              });
            }
          });
        }
        
        // Process expenses data (expenses)
        if (expensesResponse && expensesResponse.data && expensesResponse.data.values) {
          const expenseRows = expensesResponse.data.values.slice(1, 51); // Limit to first 50 records
          expenseRows.forEach((row: any[], index: number) => {
            const amount = parseFloat(row[4]) || 0;
            if (amount > 0) {
              allItems.push({
                id: `expense-${row[0] || index}`,
                date: row[1] || 'Unknown Date',
                description: row[3] || 'No Description',
                category: row[2] || 'Uncategorized',
                type: 'expense',
                amount,
                balance: 0, // Will calculate later
                reference: 'Expense Record'
              });
            }
          });
        }
        
        // Sort by date (newest first)
        allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Calculate running balance
        let runningBalance = 0;
        const itemsWithBalance = allItems.map(item => {
          if (item.type === 'income') {
            runningBalance += item.amount;
          } else {
            runningBalance -= item.amount;
          }
          return {
            ...item,
            balance: runningBalance
          };
        });
        
        setCashflowItems(itemsWithBalance);
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch cashflow data: ' + (error.message || 'Unknown error'));
        console.error('Cashflow fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCashflowData();
  }, []);

  const filteredItems = cashflowItems.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.reference && item.reference.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate summary statistics
  const totalIncome = cashflowItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalExpenses = cashflowItems
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const netCashflow = totalIncome - totalExpenses;
  const currentBalance = cashflowItems.length > 0 ? cashflowItems[0].balance : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cashflow</h2>
          <p className="text-muted-foreground">
            Loading cashflow data...
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading cashflow...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cashflow</h2>
          <p className="text-muted-foreground">
            Monitor your business cashflow
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
        <h2 className="text-2xl font-bold tracking-tight">Cashflow</h2>
        <p className="text-muted-foreground">
          Monitor your business cashflow and financial transactions
        </p>
      </div>

      {/* Cashflow Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentBalance)}</div>
            <p className="text-xs text-muted-foreground">Available funds</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">From sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">Purchases & expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCashflow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(netCashflow)}
            </div>
            <p className="text-xs text-muted-foreground">Income minus expenses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Cashflow Transactions</CardTitle>
              <CardDescription>
                Detailed view of all financial transactions
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
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
                  <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setFilter('all')}>
                    All Transactions
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('income')}>
                    Income Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('expense')}>
                    Expenses Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Date Range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Expense</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>{item.date}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.description}</div>
                    {item.reference && (
                      <div className="text-sm text-muted-foreground">{item.reference}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.type === 'income' ? formatCurrency(item.amount) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.type === 'expense' ? formatCurrency(item.amount) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`font-medium ${item.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(item.balance)}
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