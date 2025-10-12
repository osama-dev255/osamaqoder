import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Plus, 
  Edit, 
  Trash2, 
  User,
  Filter,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Tag,
  TrendingUp
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
  address?: string;
  city?: string;
  country?: string;
  totalSpent: number;
  orders: number;
  status: 'active' | 'inactive';
  lastPurchase: string;
  registrationDate: string;
  notes?: string;
  category: 'regular' | 'premium' | 'vip';
}

interface CustomerPurchase {
  id: string;
  date: string;
  product: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export function CustomerProfileManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerPurchases, setCustomerPurchases] = useState<CustomerPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for adding/editing customers
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    status: 'active' as 'active' | 'inactive',
    category: 'regular' as 'regular' | 'premium' | 'vip',
    notes: ''
  });
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          address: '123 Main Street',
          city: 'Dar es Salaam',
          country: 'Tanzania',
          totalSpent: 1250000,
          orders: 24,
          status: 'active',
          lastPurchase: '2024-12-01',
          registrationDate: '2023-06-15',
          category: 'premium',
          notes: 'Preferred customer, frequent purchases'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@businessproject.co.tz',
          phone: '+255 754 321 987',
          address: '456 Oak Avenue',
          city: 'Mwanza',
          country: 'Tanzania',
          totalSpent: 875000,
          orders: 18,
          status: 'active',
          lastPurchase: '2024-11-28',
          registrationDate: '2023-09-22',
          category: 'premium'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@businessproject.co.tz',
          phone: '+255 687 123 456',
          address: '789 Pine Road',
          city: 'Arusha',
          country: 'Tanzania',
          totalSpent: 2500000,
          orders: 42,
          status: 'active',
          lastPurchase: '2024-12-05',
          registrationDate: '2022-11-10',
          category: 'vip',
          notes: 'Top customer, high-value purchases'
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
          category: 'regular'
        }
      ];
      
      const samplePurchases: CustomerPurchase[] = [
        { id: '1', date: '2024-12-01', product: 'Product A', amount: 150000, status: 'completed' },
        { id: '2', date: '2024-11-25', product: 'Product B', amount: 85000, status: 'completed' },
        { id: '3', date: '2024-11-18', product: 'Product C', amount: 220000, status: 'completed' },
        { id: '4', date: '2024-11-10', product: 'Product A', amount: 150000, status: 'completed' },
        { id: '5', date: '2024-10-28', product: 'Product D', amount: 95000, status: 'completed' }
      ];
      
      setCustomers(sampleCustomers);
      setCustomerPurchases(samplePurchases);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      const matchesFilter = filter === 'all' || customer.status === filter || customer.category === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredCustomers(filtered);
  }, [searchTerm, filter, customers]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      if (editingCustomer) {
        // Update existing customer
        const updatedCustomer: Customer = {
          ...editingCustomer,
          ...formData
        };
        
        setCustomers(customers.map(c => c.id === editingCustomer.id ? updatedCustomer : c));
        setEditingCustomer(null);
      } else {
        // Add new customer
        const newCustomer: Customer = {
          id: `customer-${Date.now()}`,
          ...formData,
          totalSpent: 0,
          orders: 0,
          lastPurchase: new Date().toISOString().split('T')[0],
          registrationDate: new Date().toISOString().split('T')[0],
        };
        
        setCustomers([...customers, newCustomer]);
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        status: 'active',
        category: 'regular',
        notes: ''
      });
      setShowForm(false);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to save customer: ' + (error.message || 'Unknown error'));
      console.error('Customer save error:', error);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      city: customer.city || '',
      country: customer.country || '',
      status: customer.status,
      category: customer.category,
      notes: customer.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }
    
    try {
      setCustomers(customers.filter(c => c.id !== customerId));
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(null);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to delete customer: ' + (error.message || 'Unknown error'));
      console.error('Customer delete error:', error);
    }
  };

  const handleViewProfile = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleBackToList = () => {
    setSelectedCustomer(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      status: 'active',
      category: 'regular',
      notes: ''
    });
    setErrors({});
  };

  // Calculate summary statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const vipCustomers = customers.filter(c => c.category === 'vip').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  // Category distribution for chart
  const categoryDistribution = [
    { name: 'Regular', value: customers.filter(c => c.category === 'regular').length },
    { name: 'Premium', value: customers.filter(c => c.category === 'premium').length },
    { name: 'VIP', value: customers.filter(c => c.category === 'vip').length }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b'];

  // Purchase history data for chart
  const purchaseHistory = customerPurchases.map(purchase => ({
    date: purchase.date,
    amount: purchase.amount
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading customer data...</div>
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

  // Show customer profile view
  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customer Profile</h2>
            <p className="text-gray-600">
              View and manage individual customer profiles
            </p>
          </div>
          <Button onClick={handleBackToList}>
            <X className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>

        {/* Customer Summary */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant={selectedCustomer.status === 'active' ? 'default' : 'secondary'}>
                        {selectedCustomer.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant={
                        selectedCustomer.category === 'vip' ? 'default' : 
                        selectedCustomer.category === 'premium' ? 'secondary' : 'outline'
                      }>
                        {selectedCustomer.category.charAt(0).toUpperCase() + selectedCustomer.category.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(selectedCustomer)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" onClick={() => handleDelete(selectedCustomer.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {selectedCustomer.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {selectedCustomer.phone}
                  </div>
                  {(selectedCustomer.address || selectedCustomer.city || selectedCustomer.country) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        {selectedCustomer.address && <div>{selectedCustomer.address}</div>}
                        <div>
                          {selectedCustomer.city}{selectedCustomer.city && selectedCustomer.country ? ', ' : ''}
                          {selectedCustomer.country}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Customer Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-medium">{formatCurrency(selectedCustomer.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium">{selectedCustomer.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Order Value</span>
                    <span className="font-medium">
                      {selectedCustomer.orders > 0 
                        ? formatCurrency(selectedCustomer.totalSpent / selectedCustomer.orders) 
                        : formatCurrency(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Purchase</span>
                    <span>{selectedCustomer.lastPurchase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Date</span>
                    <span>{selectedCustomer.registrationDate}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Notes</h4>
                {selectedCustomer.notes ? (
                  <p className="text-sm">{selectedCustomer.notes}</p>
                ) : (
                  <p className="text-sm text-gray-600">No notes available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase History Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Purchase History
            </CardTitle>
            <CardDescription>
              Customer spending trends
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={purchaseHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  tickFormatter={(value) => `TSh ${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                />
                <Bar dataKey="amount" name="Amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
            <CardDescription>
              Latest transactions by this customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.date}</TableCell>
                    <TableCell>{purchase.product}</TableCell>
                    <TableCell>{formatCurrency(purchase.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        purchase.status === 'completed' ? 'default' : 
                        purchase.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {purchase.status}
                      </Badge>
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

  // Show customer form
  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </CardTitle>
              <CardDescription>
                {editingCustomer ? 'Update customer information' : 'Create a new customer profile'}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter customer name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email address"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter street address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Enter city"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="Enter country"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes about this customer"
            />
          </div>
        </CardContent>
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {editingCustomer ? 'Update Customer' : 'Add Customer'}
          </Button>
        </div>
      </Card>
    );
  }

  // Show customer list
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customer Profile Management</h2>
        <p className="text-gray-600">
          Manage your customer database and profiles
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
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vipCustomers}</div>
            <p className="text-xs text-gray-600">High-value customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Customer Categories
            </CardTitle>
            <CardDescription>
              Distribution of customers by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryDistribution.map((entry, index) => (
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
              <Calendar className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest customer interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {customers
                .sort((a, b) => new Date(b.lastPurchase).getTime() - new Date(a.lastPurchase).getTime())
                .slice(0, 10)
                .map((customer) => (
                  <div key={customer.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-sm text-gray-600">{customer.lastPurchase}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{formatCurrency(customer.totalSpent)}</span> spent
                      </div>
                      <div className="text-xs text-gray-600">
                        {customer.orders} orders • {customer.category}
                      </div>
                    </div>
                  </div>
                ))}
              {customers.length === 0 && (
                <div className="text-center py-4 text-gray-600">
                  No recent customer activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Database */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>
                View and manage your customers
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
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setFilter('all')}>
                    All Customers
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('inactive')}>
                    Inactive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>By Category</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => setFilter('regular')}>
                    Regular
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('premium')}>
                    Premium
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('vip')}>
                    VIP
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
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
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                    {customer.city && (
                      <div className="text-xs text-gray-600">{customer.city}</div>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>
                    <Badge variant={
                      customer.category === 'vip' ? 'default' : 
                      customer.category === 'premium' ? 'secondary' : 'outline'
                    }>
                      {customer.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {customer.status === 'active' && <Badge variant="default">Active</Badge>}
                    {customer.status === 'inactive' && <Badge variant="secondary">Inactive</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewProfile(customer)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(customer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}