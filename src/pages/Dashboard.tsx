import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TabNotification } from '@/components/TabNotification';
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
  CheckCircle
} from 'lucide-react';
import { getSpreadsheetMetadata, getSheetData } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';
import type { SpreadsheetMetadata } from '@/types';
import { useNavigate } from 'react-router-dom';
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
  Line,
  AreaChart,
  Area
} from 'recharts';

export function Dashboard() {
  const [metadata, setMetadata] = useState<SpreadsheetMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [revenueTrendData, setRevenueTrendData] = useState<any[]>([]);
  const [productPerformanceData, setProductPerformanceData] = useState<any[]>([]);
  const [customerAnalyticsData, setCustomerAnalyticsData] = useState<any[]>([]);
  const [inventoryHealthData, setInventoryHealthData] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<number>(0);
  const [customerRetentionData, setCustomerRetentionData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch spreadsheet metadata
        const metadataResponse = await getSpreadsheetMetadata();
        if (metadataResponse && metadataResponse.data) {
          setMetadata(metadataResponse.data);
        }
        
        // Fetch spreadsheet metadata to see what sheets are available
        try {
          const metadataResponse = await getSpreadsheetMetadata();
          console.log('Available sheets:', metadataResponse);
        } catch (metadataError) {
          console.error('Metadata fetch error:', metadataError);
        }

        // Fetch sales data
        const salesResponse = await getSheetData('Sales', 'A1:J1000'); // Get first 1000 sales records
        const inventoryResponse = await getSheetData('Inventory');
        // Commenting out the Sales Forms request as it seems to be causing issues
        // const customersResponse = await getSheetData('Sales Forms');
        
        if (salesResponse && salesResponse.data && salesResponse.data.values) {
          const sales = salesResponse.data.values;
          setSalesData(sales.slice(1, 6)); // Get first 5 sales records (skip header)
          
          // Calculate total revenue and orders
          let revenue = 0;
          const headers = sales[0];
          const kiasiIndex = headers.indexOf('KIASI');
          
          for (let i = 1; i < Math.min(101, sales.length); i++) { // Calculate from first 100 records
            const row = sales[i];
            if (row[kiasiIndex]) {
              const amount = parseFloat(row[kiasiIndex].replace('TSh', '').replace(/,/g, '')) || 0;
              revenue += amount;
            }
          }
          
          setTotalRevenue(revenue);
          setTotalOrders(Math.min(100, sales.length - 1)); // First 100 orders or total if less
          
          // Process revenue trend data
          const revenueByDate: Record<string, { date: string; revenue: number; orders: number }> = {};
          
          for (let i = 1; i < Math.min(31, sales.length); i++) { // Last 30 days
            const row = sales[i];
            const date = row[2]; // TAREHE (date)
            const amount = parseFloat(row[9]?.replace('TSh', '').replace(/,/g, '')) || 0; // KIASI (amount)
            
            if (date) {
              if (!revenueByDate[date]) {
                revenueByDate[date] = { date, revenue: amount, orders: 1 };
              } else {
                revenueByDate[date].revenue += amount;
                revenueByDate[date].orders += 1;
              }
            }
          }
          
          setRevenueTrendData(Object.values(revenueByDate).slice(0, 10)); // Last 10 days
          
          // Process product performance data
          const productSales: Record<string, { name: string; revenue: number; quantity: number }> = {};
          
          for (let i = 1; i < Math.min(51, sales.length); i++) {
            const row = sales[i];
            const productName = row[5]; // BIDHAA (product name)
            const revenue = parseFloat(row[9]?.replace('TSh', '').replace(/,/g, '')) || 0; // KIASI (amount)
            const quantity = parseInt(row[8]) || 0; // IDADI (quantity)
            
            if (productName) {
              if (!productSales[productName]) {
                productSales[productName] = { name: productName, revenue, quantity };
              } else {
                productSales[productName].revenue += revenue;
                productSales[productName].quantity += quantity;
              }
            }
          }
          
          // Get top 5 products by revenue
          const sortedProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
          
          setProductPerformanceData(sortedProducts);
          
          // Process customer analytics data
          const customerData: Record<string, { name: string; purchases: number; totalSpent: number }> = {};
          
          for (let i = 1; i < Math.min(51, sales.length); i++) {
            const row = sales[i];
            const customerName = row[4]; // JINA LA MTEJA (customer name)
            const amount = parseFloat(row[9]?.replace('TSh', '').replace(/,/g, '')) || 0; // KIASI (amount)
            
            if (customerName) {
              if (!customerData[customerName]) {
                customerData[customerName] = { name: customerName, purchases: 1, totalSpent: amount };
              } else {
                customerData[customerName].purchases += 1;
                customerData[customerName].totalSpent += amount;
              }
            }
          }
          
          // Get top 5 customers by spending
          const topCustomers = Object.values(customerData)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5);
          
          setCustomerAnalyticsData(topCustomers);
          
          // Process customer retention data (simplified for demo)
          const retentionData = [
            { month: 'Jan', new: 42, returning: 28 },
            { month: 'Feb', new: 38, returning: 32 },
            { month: 'Mar', new: 45, returning: 35 },
            { month: 'Apr', new: 40, returning: 40 },
            { month: 'May', new: 52, returning: 45 },
            { month: 'Jun', new: 48, returning: 50 },
          ];
          
          setCustomerRetentionData(retentionData);
        }
        
        // Process inventory health data
        if (inventoryResponse && inventoryResponse.data && inventoryResponse.data.values) {
          const inventory = inventoryResponse.data.values;
          
          // Count low stock items
          let lowStockCount = 0;
          const categoryStock: Record<string, { category: string; count: number; lowStock: number }> = {};
          
          for (let i = 1; i < inventory.length; i++) {
            const row = inventory[i];
            const category = row[2] || 'Uncategorized'; // CATEGORY
            const currentStock = parseInt(row[3]) || 0; // CURRENTSTOCK
            const minStock = parseInt(row[4]) || 0; // RE-ORDER LEVEL
            
            // Count low stock items
            if (currentStock <= minStock) {
              lowStockCount++;
            }
            
            // Aggregate by category
            if (!categoryStock[category]) {
              categoryStock[category] = { category, count: 1, lowStock: currentStock <= minStock ? 1 : 0 };
            } else {
              categoryStock[category].count += 1;
              if (currentStock <= minStock) {
                categoryStock[category].lowStock += 1;
              }
            }
          }
          
          setLowStockItems(lowStockCount);
          setInventoryHealthData(Object.values(categoryStock).slice(0, 5));
        }
        
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch data: ' + (error.message || 'Unknown error'));
        console.error('Data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
  };

  // Calculate stats based on real data
  const stats = [
    { title: "Total Revenue", value: formatCurrency(totalRevenue), description: "+12.1% from last month", icon: DollarSign, trend: "up" },
    { title: "Orders", value: totalOrders.toString(), description: "+8% from last month", icon: ShoppingCart, trend: "up" },
    { title: "Low Stock Items", value: lowStockItems.toString(), description: "Items need reordering", icon: AlertTriangle, trend: "down" },
    { title: "Active Customers", value: "421", description: "+42 since last hour", icon: Users, trend: "up" },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your business dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/end-of-day')} className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            End of Day Report
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TabNotification type="info" message="System updated successfully" />
        <TabNotification type="success" message="32 new sales today" />
        <TabNotification type="warning" message="5 low stock items" />
        <TabNotification type="error" message="Printer offline" />
      </div>

      {/* Stats Grid - Responsive for mobile */}
      <motion.div 
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index + 0.2, duration: 0.5 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-600 flex items-center">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    ) : stat.trend === "down" ? (
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                    ) : null}
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid - Responsive for mobile */}
      <motion.div 
        className="grid gap-4 grid-cols-1 lg:grid-cols-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Revenue Trends
            </CardTitle>
            <CardDescription>
              Daily revenue performance over the last 10 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2 h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-600">Loading chart...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Top Products
            </CardTitle>
            <CardDescription>
              Best performing products by revenue
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-600">Loading chart...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={productPerformanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {productPerformanceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Customer Analytics Grid - Responsive for mobile */}
      <motion.div 
        className="grid gap-4 grid-cols-1 lg:grid-cols-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              Customer Retention
            </CardTitle>
            <CardDescription>
              New vs returning customers over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-600">Loading customer data...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={customerRetentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="new" stackId="1" stroke="#8884d8" fill="#8884d8" name="New Customers" />
                  <Area type="monotone" dataKey="returning" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Returning Customers" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              Customer Loyalty
            </CardTitle>
            <CardDescription>
              Top spending customers
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-600">Loading customer data...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerAnalyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Amount Spent']}
                    labelFormatter={(label) => `Customer: ${label}`}
                  />
                  <Bar dataKey="totalSpent" name="Total Spent" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Inventory Health Grid - Responsive for mobile */}
      <motion.div 
        className="grid gap-4 grid-cols-1 lg:grid-cols-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Inventory Health
            </CardTitle>
            <CardDescription>
              Stock levels by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-600">Loading inventory data...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={inventoryHealthData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="category"
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {inventoryHealthData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'count' ? 'Items' : name]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              Items requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading inventory alerts...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-red-500">{error}</div>
              </div>
            ) : lowStockItems > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="font-medium text-red-700 dark:text-red-300">
                      {lowStockItems} items below minimum stock level
                    </span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Please reorder these items to avoid stockouts
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleNavigation('/inventory')}
                >
                  View Inventory
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-medium text-lg">All Stock Levels Healthy</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No items are below minimum stock levels
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions Grid - Responsive for mobile */}
      <motion.div 
        className="grid gap-4 grid-cols-1 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Spreadsheet Information</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-gray-600">Loading spreadsheet information...</div>}

            {error && <div className="text-red-500">{error}</div>}

            {metadata && !loading && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Spreadsheet Details</h3>
                    <p className="text-sm text-gray-600">{metadata.title || 'N/A'}</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                  
                <div>
                  <h4 className="font-medium mb-2">Sheets ({metadata.sheets?.length || 0})</h4>
                  {metadata.sheets && metadata.sheets.length > 0 ? (
                    <div className="grid gap-2">
                      {metadata.sheets.map((sheet, index) => (
                        <motion.div
                          key={sheet.sheetId || index}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <span className="text-sm font-medium">{sheet.title || 'Untitled Sheet'}</span>
                          <span className="text-xs text-gray-600">
                            {sheet.rowCount} rows × {sheet.columnCount} columns
                          </span>

                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No sheets found</p>

                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Last updated: {metadata.lastUpdated || 'Never'}
                </p>

              </motion.div>
            )}
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.3 }}
            >
              <Button className="w-full" onClick={() => handleNavigation('/sales')}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                New Sale
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.3 }}
            >
              <Button variant="outline" className="w-full" onClick={() => handleNavigation('/purchases')}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Record Purchase
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
            >
              <Button variant="outline" className="w-full" onClick={() => handleNavigation('/expenses')}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Track Expenses
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.3 }}
            >
              <Button variant="outline" className="w-full" onClick={() => handleNavigation('/cashflow')}>
                <Wallet className="mr-2 h-4 w-4" />
                View Cashflow
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.3 }}
            >
              <Button variant="outline" className="w-full" onClick={() => handleNavigation('/products')}>
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.3 }}
            >
              <Button variant="outline" className="w-full" onClick={() => handleNavigation('/inventory')}>
                <Database className="mr-2 h-4 w-4" />
                Check Inventory
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.9, duration: 0.3 }}
            >
              <Button variant="outline" className="w-full" onClick={() => handleNavigation('/customers')}>
                <Users className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.3 }}
            >
              <Button variant="outline" className="w-full" onClick={() => handleNavigation('/refunds')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Process Refund
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.3 }}
            >
              <Button variant="outline" className="w-full" onClick={() => handleNavigation('/reports')}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.3 }}
            >
              <Button variant="outline" className="w-full" onClick={() => handleNavigation('/end-of-day')}>
                <Calendar className="mr-2 h-4 w-4" />
                End of Day
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
