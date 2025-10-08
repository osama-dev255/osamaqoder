import { useState, useEffect } from 'react';
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
  TrendingDown
} from 'lucide-react';
import { getSpreadsheetMetadata } from '@/services/apiService';
import type { SpreadsheetMetadata } from '@/types';

export function Dashboard() {
  const [metadata, setMetadata] = useState<SpreadsheetMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await getSpreadsheetMetadata();
        // Add a check to ensure we have valid data
        if (response && response.data) {
          setMetadata(response.data);
        } else {
          setError('No metadata received from API');
        }
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch spreadsheet metadata: ' + (error.message || 'Unknown error'));
        console.error('Metadata fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  // Mock data for POS dashboard
  const stats = [
    { title: "Total Revenue", value: "$45,231.89", description: "+20.1% from last month", icon: DollarSign, trend: "up" },
    { title: "Orders", value: "12,234", description: "+19% from last month", icon: ShoppingCart, trend: "up" },
    { title: "Products Sold", value: "1,329", description: "+180.1% from last month", icon: Package, trend: "up" },
    { title: "Active Customers", value: "573", description: "+201 since last hour", icon: Users, trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your Point of Sale system dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
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
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Sales chart will be displayed here
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="flex items-center" key={item}>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Product {item}</p>
                    <p className="text-sm text-muted-foreground">
                      Customer {item}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    +${(item * 99.99).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spreadsheet Information</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-muted-foreground">Loading spreadsheet information...</div>}
              
            {error && <div className="text-red-500">{error}</div>}
              
            {metadata && !loading && (
              <div className="space-y-4">
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
                        <div key={sheet.sheetId || index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="text-sm font-medium">{sheet.title || 'Untitled Sheet'}</span>
                          <span className="text-xs text-muted-foreground">
                            {sheet.gridProperties?.rowCount || 0} × {sheet.gridProperties?.columnCount || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No sheets found</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Sale
            </Button>
            <Button variant="outline" className="w-full">
              <Package className="mr-2 h-4 w-4" />
              Add Product
            </Button>
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
            <Button variant="outline" className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Process Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
