import { CenteredContent } from '@/components/CenteredContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  CreditCard, 
  Users
} from 'lucide-react';

export function CenteredDashboard() {
  // Mock data for POS dashboard
  const stats = [
    { title: "Total Revenue", value: "$45,231.89", description: "+20.1% from last month", icon: DollarSign },
    { title: "Orders", value: "12,234", description: "+19% from last month", icon: ShoppingCart },
    { title: "Products Sold", value: "1,329", description: "+180.1% from last month", icon: Package },
    { title: "Active Customers", value: "573", description: "+201 since last hour", icon: Users },
  ];

  return (
    <CenteredContent>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Centered Dashboard</h1>
          <p className="text-gray-600">This dashboard is perfectly centered on the page</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-600">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions you might need
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
    </CenteredContent>
  );
}