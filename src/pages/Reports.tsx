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
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Package, 
  Users,
  FileText
} from 'lucide-react';
import { getSheetData } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

export function Reports() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sales data from Sales sheet
        const salesResponse = await getSheetData('Sales', 'A1:J100');
        if (salesResponse && salesResponse.data && salesResponse.data.values) {
          const rows = salesResponse.data.values;
          
          // Process sales data by date
          const salesByDate: Record<string, { date: string; sales: number; revenue: number }> = {};
          
          for (let i = 1; i < Math.min(51, rows.length); i++) {
            const row = rows[i];
            const date = row[2]; // TAREHE (date)
            const revenue = parseFloat(row[9]?.replace('TSh', '').replace(/,/g, '')) || 0; // KIASI (amount)
            
            if (date) {
              if (!salesByDate[date]) {
                salesByDate[date] = { date, sales: 1, revenue };
              } else {
                salesByDate[date].sales += 1;
                salesByDate[date].revenue += revenue;
              }
            }
          }
          
          setSalesData(Object.values(salesByDate));
        }
        
        // Fetch product data from Sales sheet
        const productResponse = await getSheetData('Sales', 'A1:J100');
        if (productResponse && productResponse.data && productResponse.data.values) {
          const rows = productResponse.data.values;
          
          // Process product data
          const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
          
          for (let i = 1; i < Math.min(51, rows.length); i++) {
            const row = rows[i];
            const productName = row[5]; // BIDHAA (product name)
            const quantity = parseInt(row[8]) || 0; // IDADI (quantity)
            const revenue = parseFloat(row[9]?.replace('TSh', '').replace(/,/g, '')) || 0; // KIASI (amount)
            
            if (productName) {
              if (!productSales[productName]) {
                productSales[productName] = { name: productName, sales: quantity, revenue };
              } else {
                productSales[productName].sales += quantity;
                productSales[productName].revenue += revenue;
              }
            }
          }
          
          // Get top 5 products by revenue
          const sortedProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
          
          setProductData(sortedProducts);
        }
        
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch report data: ' + (error.message || 'Unknown error'));
        console.error('Report data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const reportTypes = [
    { title: "Sales Summary", description: "Daily sales performance", icon: TrendingUp },
    { title: "Product Performance", description: "Top selling products", icon: Package },
    { title: "Customer Analysis", description: "Customer purchasing patterns", icon: Users },
    { title: "Inventory Report", description: "Stock levels and reorder points", icon: FileText },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generating business insights...
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading report data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Business performance analytics
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
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Business performance analytics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {report.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {report.description}
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Performance</CardTitle>
            <CardDescription>
              Revenue and transaction volume over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return [formatCurrency(Number(value)), 'Revenue'];
                    }
                    return [value, name === 'sales' ? 'Transactions' : name];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#0088FE" />
                <Bar dataKey="sales" name="Transactions" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Revenue contribution by product
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                >
                  {productData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Generation</CardTitle>
          <CardDescription>
            Create detailed business reports
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Daily Report
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Weekly Report
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Monthly Report
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Custom Range
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}