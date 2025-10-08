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
import { Download, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSheetData } from '@/services/apiService';

export function Reports() {
  const [dateRange, setDateRange] = useState('last-7-days');
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Fetch sales data from Mauzo sheet
        const salesResponse = await getSheetData('Mauzo', 'A1:J1000'); // Get first 1000 sales records
        
        if (salesResponse && salesResponse.data && salesResponse.data.values) {
          const sales = salesResponse.data.values;
          
          // Process sales data for charts
          // For simplicity, we'll group by date (first 100 records)
          const salesByDate: any = {};
          const categories: any = {};
          
          // Skip header row
          for (let i = 1; i < Math.min(101, sales.length); i++) {
            const row = sales[i];
            const date = row[2]; // TAREHE column
            const category = row[4]; // KUNDI column
            const amount = parseFloat(row[9].replace('TSh', '').replace(/,/g, '')) || 0; // KIASI column
            
            // Group by date
            if (date) {
              if (!salesByDate[date]) {
                salesByDate[date] = { sales: 0, revenue: 0 };
              }
              salesByDate[date].sales += 1;
              salesByDate[date].revenue += amount;
            }
            
            // Group by category
            if (category) {
              if (!categories[category]) {
                categories[category] = 0;
              }
              categories[category] += amount;
            }
          }
          
          // Convert to chart format
          const chartData = Object.entries(salesByDate).map(([date, data]: [string, any]) => ({
            name: date,
            sales: data.sales,
            revenue: data.revenue
          }));
          
          const categoryChartData = Object.entries(categories).map(([name, value]: [string, number]) => ({
            name,
            value
          }));
          
          setSalesData(chartData.slice(0, 7)); // Last 7 days
          setCategoryData(categoryChartData);
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

    fetchReportData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Loading reports and analytics...
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
          <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            View detailed reports and analytics for your business
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
        <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
        <p className="text-muted-foreground">
          View detailed reports and analytics for your business
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Sales Overview</h3>
          <p className="text-sm text-muted-foreground">
            Summary of your sales performance
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange === 'last-7-days' ? 'Last 7 Days' : 'Last 30 Days'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select date range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setDateRange('last-7-days')}>
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateRange('last-30-days')}>
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateRange('last-90-days')}>
                Last 90 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>
              Monthly sales and revenue comparison
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`TSh${Number(value).toLocaleString()}`, 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Sales Count" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue (TSh)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Categories</CardTitle>
            <CardDescription>
              Distribution of sales by customer category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`TSh${Number(value).toLocaleString()}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>
            Your best performing products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Category</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">TSh{item.value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{Math.floor(item.value / 1000)} sold</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}