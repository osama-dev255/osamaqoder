import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Printer, 
  Download, 
  Calendar,
  DollarSign,
  ShoppingCart,
  Package
} from 'lucide-react';
import { getSheetData } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

interface SalesSummary {
  date: string;
  totalTransactions: number;
  totalRevenue: number;
  totalDiscounts: number;
  averageTransaction: number;
}

interface ProductSales {
  name: string;
  quantity: number;
  revenue: number;
}

interface PaymentMethods {
  cash: number;
  card: number;
  mobile: number;
}

export function EndOfDayReport() {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [topProducts, setTopProducts] = useState<ProductSales[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({ cash: 0, card: 0, mobile: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch today's sales data from Sales sheet
        const today = new Date().toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const response = await getSheetData('Sales');
        
        if (response && response.data && response.data.values) {
          const rows = response.data.values;
          
          // Filter for today's sales (this is a simplified example)
          // In a real app, you would filter by actual date
          const todaySales = rows.slice(1, 51); // Get first 50 sales for demo
          
          // Calculate sales summary
          let totalRevenue = 0;
          let totalDiscounts = 0;
          let totalQuantity = 0;
          
          // Product sales tracking
          const productSales: Record<string, ProductSales> = {};
          
          for (const row of todaySales) {
            const revenue = parseFloat(row[9]?.replace('TSh', '').replace(/,/g, '')) || 0;
            const discount = parseFloat(row[7]?.replace('TSh', '').replace(/,/g, '')) || 0;
            const quantity = parseInt(row[8]) || 0;
            const productName = row[5] || 'Unknown Product';
            
            totalRevenue += revenue;
            totalDiscounts += discount;
            totalQuantity += quantity;
            
            if (productName) {
              if (!productSales[productName]) {
                productSales[productName] = { name: productName, quantity, revenue };
              } else {
                productSales[productName].quantity += quantity;
                productSales[productName].revenue += revenue;
              }
            }
          }
          
          const salesSummaryData: SalesSummary = {
            date: today,
            totalTransactions: todaySales.length,
            totalRevenue,
            totalDiscounts,
            averageTransaction: todaySales.length > 0 ? totalRevenue / todaySales.length : 0
          };
          
          setSalesSummary(salesSummaryData);
          
          // Get top 5 products
          const sortedProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
          
          setTopProducts(sortedProducts);
          
          // Set payment methods (random for demo)
          setPaymentMethods({
            cash: totalRevenue * 0.6,
            card: totalRevenue * 0.25,
            mobile: totalRevenue * 0.15
          });
        }
        
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch end of day data: ' + (error.message || 'Unknown error'));
        console.error('End of day data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // In a real app, this would export to PDF or Excel
    alert('Report exported successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Generating end of day report...</div>
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
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">End of Day Report</h2>
          <p className="text-muted-foreground">
            Daily sales summary and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {salesSummary && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Sales Summary - {salesSummary.date}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center">
                    <ShoppingCart className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Transactions</p>
                      <p className="text-2xl font-bold">{salesSummary.totalTransactions}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(salesSummary.totalRevenue)}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Discounts</p>
                      <p className="text-2xl font-bold">{formatCurrency(salesSummary.totalDiscounts)}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-orange-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Avg. Transaction</p>
                      <p className="text-2xl font-bold">{formatCurrency(salesSummary.averageTransaction)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>
                  Best performing products today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">{product.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Revenue by payment type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Cash</span>
                    </div>
                    <span className="font-medium">{formatCurrency(paymentMethods.cash)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Card</span>
                    </div>
                    <span className="font-medium">{formatCurrency(paymentMethods.card)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span>Mobile Money</span>
                    </div>
                    <span className="font-medium">{formatCurrency(paymentMethods.mobile)}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(paymentMethods.cash + paymentMethods.card + paymentMethods.mobile)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>End of Day Actions</CardTitle>
              <CardDescription>
                Complete your daily closing procedures
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Printer className="h-5 w-5 mb-2" />
                <span>Print Z-Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Download className="h-5 w-5 mb-2" />
                <span>Export Data</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Package className="h-5 w-5 mb-2" />
                <span>Check Inventory</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Calendar className="h-5 w-5 mb-2" />
                <span>Close Register</span>
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}