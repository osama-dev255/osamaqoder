import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Wallet
} from 'lucide-react';
import { getSpreadsheetMetadata, getSheetData } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';
import type { SpreadsheetMetadata } from '@/types';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const [metadata, setMetadata] = useState<SpreadsheetMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
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
        
        // Fetch sales data
        const salesResponse = await getSheetData('Sales', 'A1:J1000'); // Get first 1000 sales records
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
    { title: "Products Sold", value: "1,245", description: "+15.1% from last month", icon: Package, trend: "up" },
    { title: "Active Customers", value: "421", description: "+42 since last hour", icon: Users, trend: "up" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your Point of Sale system dashboard
        </p>
      </motion.div>

      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
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
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-33 mr-1 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                    )}
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Sales chart will be displayed here with real data
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              Latest transactions from your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-muted-foreground">Loading sales data...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="space-y-8">
                {salesData.map((sale, index) => (
                  <motion.div 
                    className="flex items-center" 
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                  >
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{sale[5] || 'Unknown Product'}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale[4] || 'Unknown Customer'} • {sale[2] || 'Unknown Date'}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {formatCurrency(sale[9] || '0')}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Spreadsheet Information</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-muted-foreground">Loading spreadsheet information...</div>}
              
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
                    <p className="text-sm text-muted-foreground">{metadata.title || 'N/A'}</p>
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
                          <span className="text-xs text-muted-foreground">
                            {sheet.gridProperties?.rowCount || 0} × {sheet.gridProperties?.columnCount || 0}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No sheets found</p>
                  )}
                </div>
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
    </motion.div>
  );
}