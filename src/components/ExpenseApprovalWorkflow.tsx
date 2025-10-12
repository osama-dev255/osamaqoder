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
  Check,
  X,
  Calendar,
  Tag,
  User,
  CheckCircle,
  Clock,
  XCircle
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
  Cell
} from 'recharts';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  priority: 'high' | 'medium' | 'low';
}

export function ExpenseApprovalWorkflow() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('pending');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with sample data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const sampleExpenses: Expense[] = [
        {
          id: '1',
          date: '2024-12-01',
          category: 'Utilities',
          description: 'Electricity Bill',
          amount: 50000,
          status: 'pending',
          requestedBy: 'John Doe',
          requestedDate: '2024-11-28',
          priority: 'medium'
        },
        {
          id: '2',
          date: '2024-12-05',
          category: 'Rent',
          description: 'Monthly Office Rent',
          amount: 250000,
          status: 'pending',
          requestedBy: 'Jane Smith',
          requestedDate: '2024-11-30',
          priority: 'high'
        },
        {
          id: '3',
          date: '2024-12-10',
          category: 'Supplies',
          description: 'Office Stationery',
          amount: 15000,
          status: 'approved',
          requestedBy: 'Mike Johnson',
          requestedDate: '2024-12-01',
          approvedBy: 'Sarah Wilson',
          approvedDate: '2024-12-02',
          priority: 'low'
        },
        {
          id: '4',
          date: '2024-12-15',
          category: 'Marketing',
          description: 'Social Media Ads',
          amount: 30000,
          status: 'rejected',
          requestedBy: 'Alex Brown',
          requestedDate: '2024-12-05',
          rejectionReason: 'Exceeds monthly marketing budget',
          priority: 'high'
        },
        {
          id: '5',
          date: '2024-12-20',
          category: 'Travel',
          description: 'Client Meeting Expenses',
          amount: 45000,
          status: 'pending',
          requestedBy: 'Emily Davis',
          requestedDate: '2024-12-10',
          priority: 'medium'
        }
      ];
      
      setExpenses(sampleExpenses);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || expense.status === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredExpenses(filtered);
  }, [searchTerm, filter, expenses]);

  // Calculate summary statistics
  const totalExpenses = expenses.length;
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const approvedExpenses = expenses.filter(e => e.status === 'approved').length;
  const rejectedExpenses = expenses.filter(e => e.status === 'rejected').length;
  const paidExpenses = expenses.filter(e => e.status === 'paid').length;
  
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingAmount = expenses
    .filter(e => e.status === 'pending')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const approvedAmount = expenses
    .filter(e => e.status === 'approved')
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Status distribution for chart
  const statusDistribution = [
    { name: 'Pending', value: pendingExpenses },
    { name: 'Approved', value: approvedExpenses },
    { name: 'Rejected', value: rejectedExpenses },
    { name: 'Paid', value: paidExpenses }
  ];

  const COLORS = ['#FFBB28', '#00C49F', '#FF8042', '#8884D8'];

  const handleApprove = async (expenseId: string) => {
    if (!confirm('Are you sure you want to approve this expense?')) {
      return;
    }
    
    try {
      setExpenses(expenses.map(expense => 
        expense.id === expenseId 
          ? { 
              ...expense, 
              status: 'approved',
              approvedBy: 'Current User', // In a real app, this would be the actual user
              approvedDate: new Date().toISOString().split('T')[0]
            } 
          : expense
      ));
      
      // Show success message
      alert('Expense approved successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to approve expense: ' + (error.message || 'Unknown error'));
      console.error('Expense approval error:', error);
    }
  };

  const handleReject = async (expenseId: string) => {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    
    if (rejectionReason === null) {
      // User cancelled
      return;
    }
    
    if (!rejectionReason.trim()) {
      alert('Rejection reason is required');
      return;
    }
    
    try {
      setExpenses(expenses.map(expense => 
        expense.id === expenseId 
          ? { 
              ...expense, 
              status: 'rejected',
              rejectionReason
            } 
          : expense
      ));
      
      // Show success message
      alert('Expense rejected successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to reject expense: ' + (error.message || 'Unknown error'));
      console.error('Expense rejection error:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending Approval</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'paid':
        return <Badge variant="default" className="bg-blue-500">Paid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading expense approvals...</div>
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
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses}</div>
            <p className="text-xs text-gray-600">All expense requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses}</div>
            <p className="text-xs text-gray-600">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{approvedExpenses}</div>
            <p className="text-xs text-gray-600">Ready for payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-gray-500 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{rejectedExpenses}</div>
            <p className="text-xs text-gray-600">Requests denied</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-gray-600">Pending approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Expense Status Distribution
            </CardTitle>
            <CardDescription>
              Distribution of expenses by approval status
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Approval Timeline
            </CardTitle>
            <CardDescription>
              Recent expense approval activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {expenses
                .filter(e => e.status !== 'pending')
                .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime())
                .slice(0, 10)
                .map((expense) => (
                  <div key={expense.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      {expense.status === 'approved' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {expense.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                      {expense.status === 'paid' && <Tag className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{expense.description}</span>
                        <span className="text-sm text-gray-600">{expense.requestedDate}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{formatCurrency(expense.amount)}</span> in {expense.category}
                      </div>
                      <div className="text-xs text-gray-600">
                        By {expense.requestedBy}
                        {expense.status === 'approved' && expense.approvedBy && ` • Approved by ${expense.approvedBy}`}
                        {expense.status === 'rejected' && expense.rejectionReason && ` • ${expense.rejectionReason}`}
                      </div>
                    </div>
                  </div>
                ))}
              {expenses.filter(e => e.status !== 'pending').length === 0 && (
                <div className="text-center py-4 text-gray-600">
                  No recent approval activities
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                Expense Approval Workflow
              </CardTitle>
              <CardDescription>
                Review and approve pending expense requests
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
                    All Expenses
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('pending')}>
                    Pending Approval
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('approved')}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('rejected')}>
                    Rejected
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('paid')}>
                    Paid
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
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div>{expense.date}</div>
                    <div className="text-xs text-muted-foreground">
                      Requested: {expense.requestedDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{expense.description}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      {expense.requestedBy}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {getStatusBadge(expense.status)}
                      {expense.status === 'rejected' && expense.rejectionReason && (
                        <div className="text-xs text-gray-600 mt-1">
                          Reason: {expense.rejectionReason}
                        </div>
                      )}
                      {expense.status === 'approved' && expense.approvedBy && (
                        <div className="text-xs text-gray-600 mt-1">
                          Approved by {expense.approvedBy}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {expense.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleApprove(expense.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleReject(expense.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No expense requests found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}