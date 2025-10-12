import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  CreditCard, 
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Database,
  Wallet,
  BarChart3,
  PieChart,
  UserCheck,
  AlertTriangle,
  Clock,
  Star,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { getSpreadsheetMetadata, getSheetData, getSalesData } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';
import type { SpreadsheetMetadata } from '@/types';
import { useNavigate } from 'react-router-dom';
import { PosTerminal } from '@/components/PosTerminal';
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
  LineChart,
  Line
} from 'recharts';

interface Sale {
  id: string;
  receiptNo: string;
  date: string;
  time: string;
  category: string;
  product: string;
  price: number;
  discount: number;
  quantity: number;
  totalAmount: number;
  soldBy: string;
  status: string;
  amountReceived: number;
  change: number;
}

interface SalesTrend {
  date: string;
  sales: number;
  revenue: number;
  averageTransaction: number;
}

interface ProductPerformance {
  name: string;
  quantity: number;
  revenue: number;
}

interface SalespersonPerformance {
  name: string;
  transactions: number;
  revenue: number;
}

interface CustomerBehavior {
  name: string;
  totalSpent: number;
  visitCount: number;
  averageOrderValue: number;
  favoriteCategory: string;
  lastPurchase: string;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// Add new interface for seasonal forecasting
interface SeasonalForecast {
  month: string;
  actualRevenue?: number;
  forecastedRevenue: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
}

export function Sales() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'terminal' | 'records' | 'analytics'>('terminal');
  
  // Analytics data
  const [salesTrends, setSalesTrends] = useState<SalesTrend[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [salespersonPerformance, setSalespersonPerformance] = useState<SalespersonPerformance[]>([]);
  const [customerBehavior, setCustomerBehavior] = useState<CustomerBehavior[]>([]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      // Fetch sales data from the Sales sheet
      const response = await getSalesData();
      
      if (response && response.data && response.data.values) {
        const rows = response.data.values;
        
        // Skip header row and map the data to sale objects
        const salesData = rows.slice(1, 101).map((row: any[], index: number) => ({
          id: row[0] || `${index + 1}`, // ID
          receiptNo: row[1] || 'N/A', // Receipt Number
          date: row[2] || 'Unknown Date', // Date
          time: row[3] || 'Unknown Time', // Time
          category: row[4] || 'Uncategorized', // Category (CARTEGORY)
          product: row[5] || 'Unknown Product', // Product
          price: parseFloat(row[6]?.replace('TSh', '').replace(/,/g, '')) || 0, // Price
          discount: parseFloat(row[7]?.replace('TSh', '').replace(/,/g, '')) || 0, // Discount
          quantity: parseInt(row[8]) || 0, // Quantity
          totalAmount: parseFloat(row[9]?.replace('TSh', '').replace(/,/g, '')) || 0, // Total Amount
          soldBy: row[10] || 'Unknown', // Sold By
          status: row[11] || 'completed', // Status
          amountReceived: parseFloat(row[12]?.replace('TSh', '').replace(/,/g, '')) || 0, // Amount Received
          change: parseFloat(row[13]?.replace('TSh', '').replace(/,/g, '')) || 0, // Change
        }));
        
        setSales(salesData);
        
        // Process analytics data
        processAnalyticsData(salesData);
      }
      
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to fetch sales: ' + (error.message || 'Unknown error'));
      console.error('Sales fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (salesData: Sale[]) => {
    // Process sales trends (last 30 days)
    const trendsMap: Record<string, { sales: number; revenue: number; transactions: number }> = {};
    
    salesData.forEach(sale => {
      const date = sale.date;
      if (!trendsMap[date]) {
        trendsMap[date] = { sales: 0, revenue: 0, transactions: 0 };
      }
      trendsMap[date].sales += sale.quantity;
      trendsMap[date].revenue += sale.totalAmount;
      trendsMap[date].transactions += 1;
    });
    
    const trends: SalesTrend[] = Object.entries(trendsMap)
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        revenue: data.revenue,
        averageTransaction: data.transactions > 0 ? data.revenue / data.transactions : 0
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days
    
    setSalesTrends(trends);
    
    // Process product performance
    const productMap: Record<string, { quantity: number; revenue: number }> = {};
    
    salesData.forEach(sale => {
      const product = sale.product;
      if (!productMap[product]) {
        productMap[product] = { quantity: 0, revenue: 0 };
      }
      productMap[product].quantity += sale.quantity;
      productMap[product].revenue += sale.totalAmount;
    });
    
    const products: ProductPerformance[] = Object.entries(productMap)
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 products
    
    setProductPerformance(products);
    
    // Process salesperson performance
    const salespersonMap: Record<string, { transactions: number; revenue: number }> = {};
    
    salesData.forEach(sale => {
      const salesperson = sale.soldBy;
      if (!salespersonMap[salesperson]) {
        salespersonMap[salesperson] = { transactions: 0, revenue: 0 };
      }
      salespersonMap[salesperson].transactions += 1;
      salespersonMap[salesperson].revenue += sale.totalAmount;
    });
    
    const salespersons: SalespersonPerformance[] = Object.entries(salespersonMap)
      .map(([name, data]) => ({
        name,
        transactions: data.transactions,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 salespersons
    
    setSalespersonPerformance(salespersons);
    
    // Process customer behavior
    const customerMap: Record<string, { 
      totalSpent: number; 
      visitCount: number; 
      categories: Record<string, number>;
      lastPurchase: string;
    }> = {};
    
    salesData.forEach(sale => {
      const customer = sale.receiptNo; // Using receipt number as customer identifier for demo
      if (!customerMap[customer]) {
        customerMap[customer] = { 
          totalSpent: 0, 
          visitCount: 0, 
          categories: {},
          lastPurchase: sale.date
        };
      }
      customerMap[customer].totalSpent += sale.totalAmount;
      customerMap[customer].visitCount += 1;
      
      // Track category preferences
      if (!customerMap[customer].categories[sale.category]) {
        customerMap[customer].categories[sale.category] = 0;
      }
      customerMap[customer].categories[sale.category] += 1;
      
      // Update last purchase date if this is more recent
      if (new Date(sale.date) > new Date(customerMap[customer].lastPurchase)) {
        customerMap[customer].lastPurchase = sale.date;
      }
    });
    
    // Convert to customer behavior array
    const customers: CustomerBehavior[] = Object.entries(customerMap)
      .map(([name, data]) => {
        // Find favorite category
        const favoriteCategory = Object.entries(data.categories)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Uncategorized';
        
        // Determine loyalty tier based on total spent
        let loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
        if (data.totalSpent > 1000000) {
          loyaltyTier = 'platinum';
        } else if (data.totalSpent > 500000) {
          loyaltyTier = 'gold';
        } else if (data.totalSpent > 100000) {
          loyaltyTier = 'silver';
        }
        
        return {
          name: `Customer ${name.slice(-4)}`, // Simplified customer name
          totalSpent: data.totalSpent,
          visitCount: data.visitCount,
          averageOrderValue: data.visitCount > 0 ? data.totalSpent / data.visitCount : 0,
          favoriteCategory,
          lastPurchase: data.lastPurchase,
          loyaltyTier
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 15); // Top 15 customers
    
    setCustomerBehavior(customers);
  };

  useEffect(() => {
    if (activeTab === 'records' || activeTab === 'analytics') {
      fetchSales();
    }
  }, [activeTab]);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.soldBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || sale.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Calculate summary statistics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalTransactions = sales.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const uniqueCustomers = customerBehavior.length;

  // Generate seasonal forecast data
  const generateSeasonalForecast = (): SeasonalForecast[] => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Generate mock forecast data with some realistic patterns
    // In a real implementation, this would use actual historical data and forecasting algorithms
    const forecast: SeasonalForecast[] = [];
    const currentMonth = new Date().getMonth();
    
    // For demo purposes, we'll create a pattern where:
    // - December and January have higher sales (holiday season)
    // - July and August have moderate sales (summer)
    // - April and October are average
    // - February and November are lower
    
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth + i) % 12;
      const monthName = months[monthIndex];
      
      // Create a base revenue value with some seasonal variation
      let baseRevenue = 5000000; // Base revenue in TSh
      
      // Apply seasonal multipliers
      if (monthIndex === 11 || monthIndex === 0) { // December, January
        baseRevenue *= 1.4; // 40% increase for holidays
      } else if (monthIndex === 6 || monthIndex === 7) { // July, August
        baseRevenue *= 1.1; // 10% increase for summer
      } else if (monthIndex === 1 || monthIndex === 10) { // February, November
        baseRevenue *= 0.8; // 20% decrease
      }
      
      // Add some random variation
      const variation = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
      const forecastedRevenue = baseRevenue * variation;
      
      // Determine trend based on comparison with previous month
      let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (i > 0) {
        const prevRevenue = forecast[i-1].forecastedRevenue;
        if (forecastedRevenue > prevRevenue * 1.05) {
          trend = 'increasing';
        } else if (forecastedRevenue < prevRevenue * 0.95) {
          trend = 'decreasing';
        }
      }
      
      // Confidence level (higher for near-term forecasts)
      const confidence = Math.max(70, 100 - i * 5);
      
      forecast.push({
        month: monthName,
        forecastedRevenue,
        trend,
        confidence
      });
    }
    
    return forecast;
  };

  const seasonalForecast = generateSeasonalForecast();

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  if (activeTab === 'terminal') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sales Terminal</h2>
            <p className="text-gray-600">
              Manage your sales transactions
            </p>

          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('records')}
            >
              View Sales Records
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('analytics')}
            >
              Sales Analytics
            </Button>
          </div>
        </div>
        
        <PosTerminal />
      </div>
    );
  }

  if (activeTab === 'analytics') {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Sales Analytics</h2>
              <p className="text-muted-foreground">
                Detailed sales performance insights
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('terminal')}
              >
                Back to Terminal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('records')}
              >
                View Sales Records
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-gray-600">Loading analytics data...</div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Sales Analytics</h2>
              <p className="text-muted-foreground">
                Detailed sales performance insights
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('terminal')}
              >
                Back to Terminal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('records')}
              >
                View Sales Records
              </Button>
            </div>
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sales Analytics</h2>
            <p className="text-muted-foreground">
              Detailed sales performance insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('terminal')}
            >
              Back to Terminal
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('records')}
            >
              View Sales Records
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-gray-600">From {totalTransactions} transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-gray-600">Sales records</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(averageTransaction)}</div>
              <p className="text-xs text-gray-600">Per transaction</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItemsSold}</div>
              <p className="text-xs text-gray-600">Total quantity</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCustomers}</div>
              <p className="text-xs text-gray-600">Active customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Sales Trends
              </CardTitle>
              <CardDescription>
                Revenue and transaction volume over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        return [formatCurrency(Number(value)), 'Revenue'];
                      }
                      return [value, name === 'sales' ? 'Items Sold' : 'Avg Transaction'];
                    }}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                Top Products
              </CardTitle>
              <CardDescription>
                Best selling products by revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={productPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {productPerformance.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Customer Behavior Analysis
              </CardTitle>
              <CardDescription>
                Top spending customers and loyalty insights
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerBehavior.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'totalSpent') {
                        return [formatCurrency(Number(value)), 'Total Spent'];
                      }
                      return [value, name === 'visitCount' ? 'Visits' : 'Avg Order Value'];
                    }}
                  />
                  <Bar dataKey="totalSpent" name="Total Spent" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Customer Loyalty Distribution
              </CardTitle>
              <CardDescription>
                Customer segmentation by loyalty tier
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Bronze', value: customerBehavior.filter(c => c.loyaltyTier === 'bronze').length },
                      { name: 'Silver', value: customerBehavior.filter(c => c.loyaltyTier === 'silver').length },
                      { name: 'Gold', value: customerBehavior.filter(c => c.loyaltyTier === 'gold').length },
                      { name: 'Platinum', value: customerBehavior.filter(c => c.loyaltyTier === 'platinum').length }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell key="cell-bronze" fill="#cd7f32" />
                    <Cell key="cell-silver" fill="#c0c0c0" />
                    <Cell key="cell-gold" fill="#ffd700" />
                    <Cell key="cell-platinum" fill="#e5e4e2" />
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Top Customers
            </CardTitle>
            <CardDescription>
              Detailed customer purchase behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                  <TableHead>Favorite Category</TableHead>
                  <TableHead>Last Purchase</TableHead>
                  <TableHead>Loyalty Tier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerBehavior.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                    </TableCell>
                    <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell>{customer.visitCount}</TableCell>
                    <TableCell>{formatCurrency(customer.averageOrderValue)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.favoriteCategory}</Badge>
                    </TableCell>
                    <TableCell>{customer.lastPurchase}</TableCell>
                    <TableCell>
                      {customer.loyaltyTier === 'platinum' && (
                        <Badge variant="default" className="bg-gray-300 text-black">
                          Platinum
                        </Badge>
                      )}
                      {customer.loyaltyTier === 'gold' && (
                        <Badge variant="default" className="bg-yellow-500">
                          Gold
                        </Badge>
                      )}
                      {customer.loyaltyTier === 'silver' && (
                        <Badge variant="default" className="bg-gray-400">
                          Silver
                        </Badge>
                      )}
                      {customer.loyaltyTier === 'bronze' && (
                        <Badge variant="default" className="bg-amber-800">
                          Bronze
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Seasonal Sales Forecasting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Seasonal Sales Forecasting
            </CardTitle>
            <CardDescription>
              Predicted revenue trends for the upcoming months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seasonalForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `TSh ${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecastedRevenue" 
                  name="Forecasted Revenue" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Seasonal Forecast Details */}
        <Card>
          <CardHeader>
            <CardTitle>Forecast Details</CardTitle>
            <CardDescription>
              Monthly revenue predictions with confidence levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Forecasted Revenue</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Recommendations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seasonalForecast.map((forecast, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{forecast.month}</TableCell>
                    <TableCell>{formatCurrency(forecast.forecastedRevenue)}</TableCell>
                    <TableCell>
                      {forecast.trend === 'increasing' && (
                        <div className="flex items-center text-green-600">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          Increasing
                        </div>
                      )}
                      {forecast.trend === 'decreasing' && (
                        <div className="flex items-center text-red-600">
                          <TrendingDown className="mr-1 h-4 w-4" />
                          Decreasing
                        </div>
                      )}
                      {forecast.trend === 'stable' && (
                        <div className="flex items-center text-blue-600">
                          <BarChart3 className="mr-1 h-4 w-4" />
                          Stable
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={forecast.confidence > 85 ? "default" : forecast.confidence > 70 ? "secondary" : "outline"}>
                        {forecast.confidence}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {forecast.trend === 'increasing' && (
                        <span className="text-green-600">Plan for increased inventory</span>
                      )}
                      {forecast.trend === 'decreasing' && (
                        <span className="text-red-600">Consider promotional campaigns</span>
                      )}
                      {forecast.trend === 'stable' && (
                        <span className="text-blue-600">Maintain current operations</span>
                      )}
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

  if (activeTab === 'records') {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Sales Records</h2>
              <p className="text-gray-600">
                View and manage your sales records
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('terminal')}
              >
                Back to Terminal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('analytics')}
              >
                Sales Analytics
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading sales records...</div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Sales Records</h2>
              <p className="text-gray-600">
                View and manage your sales records
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('terminal')}
              >
                Back to Terminal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('analytics')}
              >
                Sales Analytics
              </Button>
            </div>
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sales Records</h2>
            <p className="text-gray-600">
              Manage your sales transactions and records
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('terminal')}
            >
              Back to Terminal
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('analytics')}
            >
              Sales Analytics
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Sales Transactions</CardTitle>
                <CardDescription>
                  View your sales history
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search sales..."
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
                    <DropdownMenuItem onSelect={() => setFilter('completed')}>
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSales.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-4" />
                <p>No sales records found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt No.</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Sold By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>
                            <div className="font-medium">#{sale.receiptNo}</div>
                          </TableCell>
                          <TableCell>
                            <div>{sale.date}</div>
                            <div className="text-sm text-gray-600">{sale.time}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{sale.product}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{sale.category}</Badge>
                          </TableCell>
                          <TableCell>{sale.quantity}</TableCell>
                          <TableCell>{formatCurrency(sale.price)}</TableCell>
                          <TableCell>{formatCurrency(sale.discount)}</TableCell>
                          <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>
                          <TableCell>{sale.soldBy}</TableCell>
                          <TableCell>
                            {sale.status === 'completed' && <Badge variant="default">Completed</Badge>}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {Math.min(filteredSales.length, 100)} of {sales.length} sales records
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}