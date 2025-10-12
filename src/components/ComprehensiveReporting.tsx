import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Database, 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Users,
  Package,
  CreditCard,
  TrendingDown
} from 'lucide-react';
import { getSheetData } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

interface Report {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'expenses' | 'customers' | 'performance';
  generatedDate: string;
  period: string;
  status: 'generated' | 'scheduled' | 'draft';
  format: 'pdf' | 'excel' | 'csv';
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

interface InventoryData {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface ExpenseData {
  category: string;
  amount: number;
  budget: number;
  variance: number;
}

interface CustomerData {
  segment: string;
  count: number;
  revenue: number;
  retention: number;
}

export function ComprehensiveReporting() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'inventory' | 'expenses' | 'customers'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with sample data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const sampleReports: Report[] = [
        {
          id: '1',
          name: 'Monthly Sales Report',
          type: 'sales',
          generatedDate: '2024-12-01',
          period: 'November 2024',
          status: 'generated',
          format: 'pdf'
        },
        {
          id: '2',
          name: 'Inventory Status Report',
          type: 'inventory',
          generatedDate: '2024-12-01',
          period: 'December 2024',
          status: 'generated',
          format: 'excel'
        },
        {
          id: '3',
          name: 'Quarterly Expense Analysis',
          type: 'expenses',
          generatedDate: '2024-11-30',
          period: 'Q3 2024',
          status: 'generated',
          format: 'pdf'
        },
        {
          id: '4',
          name: 'Customer Segmentation Report',
          type: 'customers',
          generatedDate: '2024-11-28',
          period: 'November 2024',
          status: 'generated',
          format: 'csv'
        },
        {
          id: '5',
          name: 'Yearly Performance Report',
          type: 'performance',
          generatedDate: '2024-12-05',
          period: '2024',
          status: 'scheduled',
          format: 'pdf'
        }
      ];
      
      setReports(sampleReports);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const filtered = reports.filter(report => {
      const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.period.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || report.type === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredReports(filtered);
  }, [searchTerm, filter, reports]);

  // Sample data for charts
  const salesData: SalesData[] = [
    { date: '2024-11-01', revenue: 2500000, orders: 45, avgOrderValue: 55555 },
    { date: '2024-11-08', revenue: 3200000, orders: 58, avgOrderValue: 55172 },
    { date: '2024-11-15', revenue: 2800000, orders: 52, avgOrderValue: 53846 },
    { date: '2024-11-22', revenue: 3500000, orders: 65, avgOrderValue: 53846 },
    { date: '2024-11-29', revenue: 4200000, orders: 78, avgOrderValue: 53846 }
  ];
  
  const inventoryData: InventoryData[] = [
    { category: 'Electronics', inStock: 150, lowStock: 25, outOfStock: 5 },
    { category: 'Clothing', inStock: 320, lowStock: 40, outOfStock: 10 },
    { category: 'Home Goods', inStock: 180, lowStock: 30, outOfStock: 8 },
    { category: 'Books', inStock: 240, lowStock: 20, outOfStock: 3 }
  ];
  
  const expenseData: ExpenseData[] = [
    { category: 'Rent', amount: 500000, budget: 500000, variance: 0 },
    { category: 'Utilities', amount: 85000, budget: 100000, variance: 15000 },
    { category: 'Salaries', amount: 2000000, budget: 2000000, variance: 0 },
    { category: 'Marketing', amount: 120000, budget: 150000, variance: 30000 },
    { category: 'Supplies', amount: 45000, budget: 50000, variance: 5000 }
  ];
  
  const customerData: CustomerData[] = [
    { segment: 'VIP', count: 25, revenue: 5000000, retention: 95 },
    { segment: 'Premium', count: 150, revenue: 3000000, retention: 85 },
    { segment: 'Regular', count: 425, revenue: 1500000, retention: 70 },
    { segment: 'New', count: 75, revenue: 250000, retention: 45 }
  ];
  
  // Calculate summary statistics
  const totalReports = reports.length;
  const generatedReports = reports.filter(r => r.status === 'generated').length;
  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = expenseData.reduce((sum, data) => sum + data.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  
  // Chart data
  const revenueByCategory = [
    { name: 'Product Sales', value: totalRevenue * 0.7 },
    { name: 'Services', value: totalRevenue * 0.2 },
    { name: 'Other', value: totalRevenue * 0.1 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleGenerateReport = (type: string) => {
    alert(`Generating ${type} report. In a real application, this would create and download the report.`);
  };

  const handleViewReport = (report: Report) => {
    alert(`Viewing report: ${report.name}. In a real application, this would open the report.`);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`Exporting current view as ${format.toUpperCase()}. In a real application, this would generate and download the export.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge variant="default">Generated</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sales':
        return <Badge variant="default" className="bg-blue-500">Sales</Badge>;
      case 'inventory':
        return <Badge variant="default" className="bg-green-500">Inventory</Badge>;
      case 'expenses':
        return <Badge variant="default" className="bg-red-500">Expenses</Badge>;
      case 'customers':
        return <Badge variant="default" className="bg-purple-500">Customers</Badge>;
      case 'performance':
        return <Badge variant="default" className="bg-yellow-500">Performance</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading reporting system...</div>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Comprehensive Reporting System</h2>
          <p className="text-gray-600">
            Generate and manage business reports
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleExport('pdf')}>
                PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('excel')}>
                Excel Spreadsheet
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleExport('csv')}>
                CSV Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-gray-600">All generated reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Reports</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generatedReports}</div>
            <p className="text-xs text-gray-600">Ready to view</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-gray-600">This period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netProfit)}</div>
            <p className="text-xs text-gray-600">Revenue - Expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeTab === 'overview' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button 
          variant={activeTab === 'sales' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('sales')}
        >
          Sales Reports
        </Button>
        <Button 
          variant={activeTab === 'inventory' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('inventory')}
        >
          Inventory Reports
        </Button>
        <Button 
          variant={activeTab === 'expenses' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('expenses')}
        >
          Expense Reports
        </Button>
        <Button 
          variant={activeTab === 'customers' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('customers')}
        >
          Customer Reports
        </Button>
      </div>

      {/* Overview Dashboard */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Revenue by Category
                </CardTitle>
                <CardDescription>
                  Distribution of revenue across categories
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={revenueByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Sales Trend
                </CardTitle>
                <CardDescription>
                  Revenue trend over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      tickFormatter={(value) => `TSh ${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Recent Reports
                  </CardTitle>
                  <CardDescription>
                    Generated and scheduled reports
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search reports..."
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
                        All Reports
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter('sales')}>
                        Sales
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter('inventory')}>
                        Inventory
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter('expenses')}>
                        Expenses
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter('customers')}>
                        Customers
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
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Generated Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="font-medium">{report.name}</div>
                      </TableCell>
                      <TableCell>{getTypeBadge(report.type)}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{report.generatedDate}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredReports.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>No reports found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                  <Button className="mt-4" onClick={() => handleGenerateReport('custom')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Reports */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Sales Performance
              </CardTitle>
              <CardDescription>
                Detailed sales metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    yAxisId="left"
                    tickFormatter={(value) => `TSh ${(value / 1000000).toFixed(1)}M`}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(Number(value)), 'Revenue'];
                      }
                      return [value, name === 'orders' ? 'Orders' : 'Avg Order Value'];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#0088FE" />
                  <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Summary</CardTitle>
                <CardDescription>
                  Key sales metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Revenue</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(totalRevenue)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Orders</TableCell>
                      <TableCell className="text-right font-medium">
                        {salesData.reduce((sum, data) => sum + data.orders, 0)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average Order Value</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(totalRevenue / salesData.reduce((sum, data) => sum + data.orders, 0))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Growth Rate</TableCell>
                      <TableCell className="text-right font-medium text-green-500">+12.5%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>
                  Best selling items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        <div>
                          <div className="font-medium">Product {item}</div>
                          <div className="text-sm text-gray-600">Category {item}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(500000 / item)}</div>
                        <div className="text-sm text-gray-600">{100 - (item * 10)} units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Inventory Reports */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Inventory Status
              </CardTitle>
              <CardDescription>
                Stock levels and inventory health
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inStock" name="In Stock" fill="#00C49F" />
                  <Bar dataKey="lowStock" name="Low Stock" fill="#FFBB28" />
                  <Bar dataKey="outOfStock" name="Out of Stock" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Inventory Value</CardTitle>
                <CardDescription>
                  Current stock value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatCurrency(15000000)}</div>
                <p className="text-sm text-gray-600">+5.2% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Low Stock Items</span>
                    <span className="font-medium">95</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out of Stock Items</span>
                    <span className="font-medium text-red-500">26</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overstocked Items</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Turnover Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.2x</div>
                <p className="text-sm text-gray-600">Inventory turns per year</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Expense Reports */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
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
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <CardTitle>Expense Analysis</CardTitle>
              <CardDescription>
                Detailed expense metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseData.map((expense) => (
                    <TableRow key={expense.category}>
                      <TableCell className="font-medium">{expense.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(expense.budget)}</TableCell>
                      <TableCell className="text-right">
                        <span className={expense.variance < 0 ? 'text-green-500' : 'text-red-500'}>
                          {formatCurrency(Math.abs(expense.variance))}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {expense.variance < 0 ? (
                          <Badge variant="default" className="bg-green-500">Under Budget</Badge>
                        ) : expense.variance > 0 ? (
                          <Badge variant="destructive">Over Budget</Badge>
                        ) : (
                          <Badge variant="secondary">On Budget</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customer Reports */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Customer Segmentation
              </CardTitle>
              <CardDescription>
                Customer distribution and value
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="count" name="Customer Count" fill="#0088FE" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Customers</TableCell>
                      <TableCell className="text-right font-medium">675</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Active Customers</TableCell>
                      <TableCell className="text-right font-medium">525</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>New Customers (30 days)</TableCell>
                      <TableCell className="text-right font-medium">75</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Customer Retention Rate</TableCell>
                      <TableCell className="text-right font-medium">78.5%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Customer Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerData.map((segment) => (
                    <div key={segment.segment} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{segment.segment}</div>
                        <div className="text-sm text-gray-600">
                          {segment.count} customers • {segment.retention}% retention
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(segment.revenue)}</div>
                        <div className="text-sm text-gray-600">
                          {((segment.revenue / totalRevenue) * 100).toFixed(1)}% of revenue
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}