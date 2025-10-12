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
  Calendar,
  Tag,
  TrendingUp,
  Download,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/currency';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending';
}

interface ExpenseReport {
  period: string;
  totalExpenses: number;
  categoryBreakdown: Record<string, number>;
  topCategories: { category: string; amount: number }[];
}

export function ExpenseReporting() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportPeriod, setReportPeriod] = useState('monthly');
  
  // Initialize with sample data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const sampleExpenses: Expense[] = [
        { id: '1', date: '2024-12-01', category: 'Utilities', description: 'Electricity Bill', amount: 50000, status: 'paid' },
        { id: '2', date: '2024-12-05', category: 'Rent', description: 'Monthly Office Rent', amount: 250000, status: 'paid' },
        { id: '3', date: '2024-12-10', category: 'Supplies', description: 'Office Stationery', amount: 15000, status: 'paid' },
        { id: '4', date: '2024-12-15', category: 'Marketing', description: 'Social Media Ads', amount: 30000, status: 'pending' },
        { id: '5', date: '2024-11-01', category: 'Utilities', description: 'Electricity Bill', amount: 48000, status: 'paid' },
        { id: '6', date: '2024-11-05', category: 'Rent', description: 'Monthly Office Rent', amount: 250000, status: 'paid' },
        { id: '7', date: '2024-11-10', category: 'Supplies', description: 'Office Supplies', amount: 12000, status: 'paid' },
        { id: '8', date: '2024-11-15', category: 'Marketing', description: 'Print Ads', amount: 25000, status: 'paid' },
        { id: '9', date: '2024-10-01', category: 'Utilities', description: 'Electricity Bill', amount: 52000, status: 'paid' },
        { id: '10', date: '2024-10-05', category: 'Rent', description: 'Monthly Office Rent', amount: 250000, status: 'paid' },
        { id: '11', date: '2024-10-10', category: 'Supplies', description: 'Equipment', amount: 45000, status: 'paid' },
        { id: '12', date: '2024-10-15', category: 'Marketing', description: 'Online Campaign', amount: 35000, status: 'paid' },
        { id: '13', date: '2024-10-20', category: 'Travel', description: 'Business Trip', amount: 80000, status: 'paid' },
        { id: '14', date: '2024-09-01', category: 'Utilities', description: 'Electricity Bill', amount: 47000, status: 'paid' },
        { id: '15', date: '2024-09-05', category: 'Rent', description: 'Monthly Office Rent', amount: 250000, status: 'paid' },
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

  // Calculate expense statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate category totals
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });
  
  // Prepare data for charts
  const categoryChartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    amount
  }));
  
  // Sort by amount descending
  categoryChartData.sort((a, b) => b.amount - a.amount);
  
  // Monthly expense trend data
  const monthlyExpenses: Record<string, number> = {};
  expenses.forEach(expense => {
    const month = expense.date.substring(0, 7); // YYYY-MM
    if (!monthlyExpenses[month]) {
      monthlyExpenses[month] = 0;
    }
    monthlyExpenses[month] += expense.amount;
  });
  
  const trendData = Object.entries(monthlyExpenses)
    .map(([month, amount]) => ({
      month,
      amount
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  // Top categories
  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Generate report data
  const generateReport = (): ExpenseReport[] => {
    // For demo purposes, we'll create a simple report
    return [
      {
        period: '2024-12',
        totalExpenses: expenses
          .filter(e => e.date.startsWith('2024-12'))
          .reduce((sum, e) => sum + e.amount, 0),
        categoryBreakdown: {
          'Utilities': expenses
            .filter(e => e.date.startsWith('2024-12') && e.category === 'Utilities')
            .reduce((sum, e) => sum + e.amount, 0),
          'Rent': expenses
            .filter(e => e.date.startsWith('2024-12') && e.category === 'Rent')
            .reduce((sum, e) => sum + e.amount, 0),
          'Supplies': expenses
            .filter(e => e.date.startsWith('2024-12') && e.category === 'Supplies')
            .reduce((sum, e) => sum + e.amount, 0),
          'Marketing': expenses
            .filter(e => e.date.startsWith('2024-12') && e.category === 'Marketing')
            .reduce((sum, e) => sum + e.amount, 0)
        },
        topCategories: [
          { category: 'Rent', amount: 250000 },
          { category: 'Utilities', amount: 50000 },
          { category: 'Marketing', amount: 30000 }
        ]
      },
      {
        period: '2024-11',
        totalExpenses: expenses
          .filter(e => e.date.startsWith('2024-11'))
          .reduce((sum, e) => sum + e.amount, 0),
        categoryBreakdown: {
          'Utilities': expenses
            .filter(e => e.date.startsWith('2024-11') && e.category === 'Utilities')
            .reduce((sum, e) => sum + e.amount, 0),
          'Rent': expenses
            .filter(e => e.date.startsWith('2024-11') && e.category === 'Rent')
            .reduce((sum, e) => sum + e.amount, 0),
          'Supplies': expenses
            .filter(e => e.date.startsWith('2024-11') && e.category === 'Supplies')
            .reduce((sum, e) => sum + e.amount, 0),
          'Marketing': expenses
            .filter(e => e.date.startsWith('2024-11') && e.category === 'Marketing')
            .reduce((sum, e) => sum + e.amount, 0)
        },
        topCategories: [
          { category: 'Rent', amount: 250000 },
          { category: 'Utilities', amount: 48000 },
          { category: 'Marketing', amount: 25000 }
        ]
      }
    ];
  };

  const reports = generateReport();

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    alert(`Exporting report as ${format.toUpperCase()}. In a real application, this would generate and download the report.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading expense reports...</div>
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

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Expense Reporting & Analytics</h2>
          <p className="text-gray-600">
            Generate and analyze expense reports
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleExport('pdf')}>
                PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('csv')}>
                CSV Data
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('excel')}>
                Excel Spreadsheet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-gray-600">All recorded expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Expenses</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paidExpenses)}</div>
            <p className="text-xs text-gray-600">Successfully paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingExpenses)}</div>
            <p className="text-xs text-gray-600">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCategories[0]?.category || 'N/A'}</div>
            <p className="text-xs text-gray-600">
              {topCategories[0] ? formatCurrency(topCategories[0].amount) : 'No data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Expense Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of expenses by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Expense Trend
            </CardTitle>
            <CardDescription>
              Monthly expense patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `TSh ${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Amount" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Top Expense Categories
          </CardTitle>
          <CardDescription>
            Highest spending categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCategories.map((category, index) => {
                const percentage = totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0;
                return (
                  <TableRow key={category.category}>
                    <TableCell>
                      <div className="font-medium">{category.category}</div>
                    </TableCell>
                    <TableCell>{formatCurrency(category.amount)}</TableCell>
                    <TableCell>{percentage.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant="secondary">#{index + 1}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Periodic Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Periodic Reports
          </CardTitle>
          <CardDescription>
            Monthly expense summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Total Expenses</TableHead>
                <TableHead>Top Categories</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.period}>
                  <TableCell>
                    <div className="font-medium">{report.period}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(report.totalExpenses)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {report.topCategories.map((cat, index) => (
                        <Badge key={index} variant="outline">
                          {cat.category}: {formatCurrency(cat.amount)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Expense Records */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Detailed Expense Records</CardTitle>
              <CardDescription>
                All expense transactions
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
                  <DropdownMenuItem onSelect={() => setFilter('paid')}>
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <p>No expenses found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}