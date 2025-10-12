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
  User,
  Tag,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar
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

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  orders: number;
  status: 'active' | 'inactive';
  lastPurchase: string;
  category: 'regular' | 'premium' | 'vip';
  segment: string;
  registrationDate: string;
}

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: string;
  customerCount: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export function CustomerSegmentation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with sample data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const sampleCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@businessproject.co.tz',
          phone: '+255 712 345 678',
          totalSpent: 1250000,
          orders: 24,
          status: 'active',
          lastPurchase: '2024-12-01',
          registrationDate: '2023-06-15',
          category: 'premium',
          segment: 'High Value'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@businessproject.co.tz',
          phone: '+255 754 321 987',
          totalSpent: 875000,
          orders: 18,
          status: 'active',
          lastPurchase: '2024-11-28',
          registrationDate: '2023-09-22',
          category: 'premium',
          segment: 'High Value'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@businessproject.co.tz',
          phone: '+255 687 123 456',
          totalSpent: 2500000,
          orders: 42,
          status: 'active',
          lastPurchase: '2024-12-05',
          registrationDate: '2022-11-10',
          category: 'vip',
          segment: 'VIP'
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@businessproject.co.tz',
          phone: '+255 745 678 123',
          totalSpent: 320000,
          orders: 7,
          status: 'inactive',
          lastPurchase: '2024-08-15',
          registrationDate: '2024-03-05',
          category: 'regular',
          segment: 'Low Engagement'
        },
        {
          id: '5',
          name: 'Alex Brown',
          email: 'alex.brown@businessproject.co.tz',
          phone: '+255 654 987 321',
          totalSpent: 1500000,
          orders: 32,
          status: 'active',
          lastPurchase: '2024-12-03',
          registrationDate: '2023-01-20',
          category: 'premium',
          segment: 'High Value'
        },
        {
          id: '6',
          name: 'Emily Davis',
          email: 'emily.davis@businessproject.co.tz',
          phone: '+255 789 123 456',
          totalSpent: 75000,
          orders: 3,
          status: 'active',
          lastPurchase: '2024-11-20',
          registrationDate: '2024-10-15',
          category: 'regular',
          segment: 'New Customers'
        },
        {
          id: '7',
          name: 'David Miller',
          email: 'david.miller@businessproject.co.tz',
          phone: '+255 698 741 258',
          totalSpent: 2200000,
          orders: 38,
          status: 'active',
          lastPurchase: '2024-11-29',
          registrationDate: '2022-05-10',
          category: 'vip',
          segment: 'VIP'
        },
        {
          id: '8',
          name: 'Lisa Anderson',
          email: 'lisa.anderson@businessproject.co.tz',
          phone: '+255 721 456 987',
          totalSpent: 450000,
          orders: 12,
          status: 'active',
          lastPurchase: '2024-10-15',
          registrationDate: '2023-12-01',
          category: 'regular',
          segment: 'Medium Value'
        }
      ];
      
      const sampleSegments: CustomerSegment[] = [
        {
          id: '1',
          name: 'VIP Customers',
          description: 'High spending, frequent purchasers',
          criteria: 'Spent > TSh 2M OR Orders > 30',
          customerCount: 2,
          totalRevenue: 4700000,
          avgOrderValue: 117500
        },
        {
          id: '2',
          name: 'High Value',
          description: 'Regular customers with significant spending',
          criteria: 'Spent > TSh 1M AND Orders > 15',
          customerCount: 3,
          totalRevenue: 3625000,
          avgOrderValue: 95000
        },
        {
          id: '3',
          name: 'Medium Value',
          description: 'Steady customers with moderate spending',
          criteria: 'Spent > TSh 300K AND Orders > 8',
          customerCount: 1,
          totalRevenue: 450000,
          avgOrderValue: 37500
        },
        {
          id: '4',
          name: 'New Customers',
          description: 'Recently joined, limited purchase history',
          criteria: 'Registration within last 90 days',
          customerCount: 1,
          totalRevenue: 75000,
          avgOrderValue: 25000
        },
        {
          id: '5',
          name: 'Low Engagement',
          description: 'Inactive or infrequent customers',
          criteria: 'Inactive OR Orders < 5',
          customerCount: 1,
          totalRevenue: 320000,
          avgOrderValue: 45714
        }
      ];
      
      setCustomers(sampleCustomers);
      setSegments(sampleSegments);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.segment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || customer.segment === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredCustomers(filtered);
  }, [searchTerm, filter, customers]);

  // Calculate summary statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  
  // Segment distribution for chart
  const segmentDistribution = segments.map(segment => ({
    name: segment.name,
    value: segment.customerCount
  }));
  
  // Revenue by segment
  const revenueBySegment = segments.map(segment => ({
    name: segment.name,
    revenue: segment.totalRevenue
  }));
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading customer segments...</div>
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customer Segmentation</h2>
        <p className="text-gray-600">
          Analyze and manage customer segments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-gray-600">All customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-gray-600">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Segments</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segments.length}</div>
            <p className="text-xs text-gray-600">Defined segments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-gray-600">From all customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Customer Segments Distribution
            </CardTitle>
            <CardDescription>
              Distribution of customers across segments
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={segmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {segmentDistribution.map((entry, index) => (
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
              <BarChart3 className="mr-2 h-5 w-5" />
              Revenue by Segment
            </CardTitle>
            <CardDescription>
              Total revenue generated by each segment
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBySegment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `TSh ${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segments Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                Customer Segments
              </CardTitle>
              <CardDescription>
                Defined customer segments and metrics
              </CardDescription>
            </div>
            <Button>
              <Tag className="mr-2 h-4 w-4" />
              Create New Segment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Avg Order Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell>
                    <div className="font-medium">{segment.name}</div>
                  </TableCell>
                  <TableCell>{segment.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{segment.criteria}</Badge>
                  </TableCell>
                  <TableCell>{segment.customerCount}</TableCell>
                  <TableCell>{formatCurrency(segment.totalRevenue)}</TableCell>
                  <TableCell>{formatCurrency(segment.avgOrderValue)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Customers
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Segmented Customers */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Segmented Customers</CardTitle>
              <CardDescription>
                Customers organized by segments
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search customers..."
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
                  <DropdownMenuLabel>Filter by segment</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setFilter('all')}>
                    All Segments
                  </DropdownMenuItem>
                  {segments.map(segment => (
                    <DropdownMenuItem 
                      key={segment.id} 
                      onSelect={() => setFilter(segment.name)}
                    >
                      {segment.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />

                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{customer.phone}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.segment}</Badge>
                  </TableCell>
                  <TableCell>{customer.lastPurchase}</TableCell>
                  <TableCell>
                    {customer.status === 'active' && <Badge variant="default">Active</Badge>}
                    {customer.status === 'inactive' && <Badge variant="secondary">Inactive</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <User className="h-12 w-12 mx-auto mb-4" />
              <p>No customers found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}