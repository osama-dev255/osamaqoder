import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Send,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Bell,
  Check,
  X,
  Plus,
  Eye
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
  ResponsiveContainer
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
  communicationPreference: 'email' | 'sms' | 'both';
}

interface Communication {
  id: string;
  customerId: string;
  customerName: string;
  type: 'email' | 'sms' | 'notification';
  subject: string;
  content: string;
  status: 'sent' | 'scheduled' | 'draft';
  date: string;
  read?: boolean;
}

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'notification';
  subject: string;
  content: string;
  category: string;
}

export function CustomerCommunicationTools() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for sending communications
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [communicationType, setCommunicationType] = useState<'email' | 'sms' | 'notification'>('email');
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    scheduleDate: ''
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
          totalSpent: 1250000,
          orders: 24,
          status: 'active',
          lastPurchase: '2024-12-01',
          communicationPreference: 'email'
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
          communicationPreference: 'sms'
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
          communicationPreference: 'both'
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
          communicationPreference: 'email'
        }
      ];
      
      const sampleCommunications: Communication[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'John Doe',
          type: 'email',
          subject: 'Special Offer for Loyal Customers',
          content: 'Dear John, as one of our valued customers, we\'d like to offer you 15% off your next purchase...',
          status: 'sent',
          date: '2024-12-01',
          read: true
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Jane Smith',
          type: 'sms',
          subject: '',
          content: 'Hi Jane! Flash sale: 20% off all products today only. Visit us now!',
          status: 'sent',
          date: '2024-11-30',
          read: true
        },
        {
          id: '3',
          customerId: '3',
          customerName: 'Mike Johnson',
          type: 'notification',
          subject: 'VIP Event Invitation',
          content: 'Exclusive invitation to our VIP customer appreciation event this Saturday...',
          status: 'sent',
          date: '2024-11-28',
          read: false
        },
        {
          id: '4',
          customerId: '1',
          customerName: 'John Doe',
          type: 'email',
          subject: 'New Product Launch',
          content: 'We\'re excited to announce the launch of our new premium product line...',
          status: 'scheduled',
          date: '2024-12-10'
        }
      ];
      
      const sampleTemplates: CommunicationTemplate[] = [
        {
          id: '1',
          name: 'Welcome Email',
          type: 'email',
          subject: 'Welcome to Our Store!',
          content: 'Dear {{customer_name}},\n\nWelcome to our store! We\'re excited to have you as a customer...\n\nBest regards,\nThe Team',
          category: 'Onboarding'
        },
        {
          id: '2',
          name: 'Special Offer',
          type: 'email',
          subject: 'Exclusive Offer for You',
          content: 'Dear {{customer_name}},\n\nAs a valued customer, we have a special offer just for you...\n\nBest regards,\nThe Team',
          category: 'Promotions'
        },
        {
          id: '3',
          name: 'Birthday Greeting',
          type: 'sms',
          subject: '',
          content: 'Happy Birthday {{customer_name}}! Enjoy 20% off your purchase today. Thank you for being a valued customer!',
          category: 'Celebrations'
        },
        {
          id: '4',
          name: 'Order Confirmation',
          type: 'notification',
          subject: 'Order Confirmation',
          content: 'Thank you for your order #{{order_number}}. Your order has been confirmed and will be shipped soon.',
          category: 'Transactional'
        }
      ];
      
      setCustomers(sampleCustomers);
      setCommunications(sampleCommunications);
      setTemplates(sampleTemplates);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      const matchesFilter = filter === 'all' || customer.status === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredCustomers(filtered);
  }, [searchTerm, filter, customers]);

  // Calculate summary statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalCommunications = communications.length;
  const sentCommunications = communications.filter(c => c.status === 'sent').length;
  const successRate = totalCommunications > 0 ? Math.round((sentCommunications / totalCommunications) * 100) : 0;
  
  // Communications by type
  const communicationsByType = [
    { name: 'Email', count: communications.filter(c => c.type === 'email').length },
    { name: 'SMS', count: communications.filter(c => c.type === 'sms').length },
    { name: 'Notifications', count: communications.filter(c => c.type === 'notification').length }
  ];
  
  // Recent communications
  const recentCommunications = communications
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.subject.trim() && communicationType === 'email') {
      newErrors.subject = 'Subject is required for emails';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Message content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // In a real implementation, this would send the communication
      const newCommunication: Communication = {
        id: `comm-${Date.now()}`,
        customerId: selectedCustomer?.id || '',
        customerName: selectedCustomer?.name || 'Customer',
        type: communicationType,
        subject: formData.subject,
        content: formData.content,
        status: 'sent',
        date: new Date().toISOString().split('T')[0]
      };
      
      setCommunications([newCommunication, ...communications]);
      
      // Reset form
      setFormData({
        subject: '',
        content: '',
        scheduleDate: ''
      });
      setShowForm(false);
      setSelectedCustomer(null);
      
      // Show success message
      alert('Communication sent successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to send communication: ' + (error.message || 'Unknown error'));
      console.error('Communication send error:', error);
    }
  };

  const handleSchedule = async () => {
    if (!validateForm()) {
      return;
    }
    
    if (!formData.scheduleDate) {
      alert('Please select a schedule date');
      return;
    }
    
    try {
      // In a real implementation, this would schedule the communication
      const newCommunication: Communication = {
        id: `comm-${Date.now()}`,
        customerId: selectedCustomer?.id || '',
        customerName: selectedCustomer?.name || 'Customer',
        type: communicationType,
        subject: formData.subject,
        content: formData.content,
        status: 'scheduled',
        date: formData.scheduleDate
      };
      
      setCommunications([newCommunication, ...communications]);
      
      // Reset form
      setFormData({
        subject: '',
        content: '',
        scheduleDate: ''
      });
      setShowForm(false);
      setSelectedCustomer(null);
      
      // Show success message
      alert('Communication scheduled successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to schedule communication: ' + (error.message || 'Unknown error'));
      console.error('Communication schedule error:', error);
    }
  };

  const handleUseTemplate = (template: CommunicationTemplate) => {
    setCommunicationType(template.type);
    setFormData({
      subject: template.subject,
      content: template.content,
      scheduleDate: ''
    });
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedCustomer(null);
    setFormData({
      subject: '',
      content: '',
      scheduleDate: ''
    });
    setErrors({});
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'notification':
        return <Bell className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default">Sent</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading communication tools...</div>
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

  // Show communication form
  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                {getTypeIcon(communicationType)}
                <span className="ml-2">
                  {selectedCustomer 
                    ? `Send ${communicationType === 'email' ? 'Email' : communicationType === 'sms' ? 'SMS' : 'Notification'} to ${selectedCustomer.name}` 
                    : 'New Communication'}
                </span>
              </CardTitle>
              <CardDescription>
                {selectedCustomer 
                  ? `Communicating with ${selectedCustomer.name}` 
                  : 'Create a new communication'}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedCustomer && (
            <div className="space-y-2">
              <Label>Customer</Label>
              <select
                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                value={selectedCustomer?.id || ''}
                onChange={(e) => {
                  const customer = customers.find(c => c.id === e.target.value);
                  if (customer) setSelectedCustomer(customer);
                }}
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Communication Type</Label>
            <div className="flex gap-2">
              <Button
                variant={communicationType === 'email' ? 'default' : 'outline'}
                onClick={() => setCommunicationType('email')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button
                variant={communicationType === 'sms' ? 'default' : 'outline'}
                onClick={() => setCommunicationType('sms')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                SMS
              </Button>
              <Button
                variant={communicationType === 'notification' ? 'default' : 'outline'}
                onClick={() => setCommunicationType('notification')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notification
              </Button>
            </div>
          </div>
          
          {communicationType === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Subject *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Enter email subject"
                className={errors.subject ? 'border-red-500' : ''}
              />
              {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="content" className="flex items-center">
              {getTypeIcon(communicationType)}
              <span className="ml-2">
                {communicationType === 'email' ? 'Message' : 
                 communicationType === 'sms' ? 'SMS Content' : 'Notification Message'} *
              </span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder={communicationType === 'email' ? 'Enter email message' : 
                          communicationType === 'sms' ? 'Enter SMS content (keep it short)' : 
                          'Enter notification message'}
              className={`min-h-[200px] ${errors.content ? 'border-red-500' : ''}`}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="schedule-date">Schedule Date (Optional)</Label>
            <Input
              id="schedule-date"
              type="date"
              value={formData.scheduleDate}
              onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Templates</Label>
            <div className="flex flex-wrap gap-2">
              {templates.map(template => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseTemplate(template)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleSchedule} disabled={!formData.scheduleDate}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" />
            Send Now
          </Button>
        </div>
      </Card>
    );
  }

  // Show main communication dashboard
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customer Communication Tools</h2>
        <p className="text-gray-600">
          Manage and track customer communications
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
            <p className="text-xs text-gray-600">In database</p>
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
            <CardTitle className="text-sm font-medium">Total Communications</CardTitle>
            <Send className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCommunications}</div>
            <p className="text-xs text-gray-600">All communications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Check className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-gray-600">Successfully sent</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="mr-2 h-5 w-5" />
              Communications by Type
            </CardTitle>
            <CardDescription>
              Distribution of communications by channel
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={communicationsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Recent Communications
            </CardTitle>
            <CardDescription>
              Latest customer interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-72 overflow-y-auto">
              {recentCommunications.map((comm) => (
                <div key={comm.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {getTypeIcon(comm.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{comm.customerName}</span>
                      <span className="text-sm text-gray-600">{comm.date}</span>
                    </div>
                    <div className="text-sm">
                      {comm.type === 'email' ? comm.subject : comm.content.substring(0, 50) + '...'}
                    </div>
                    <div className="text-xs text-gray-600">
                      {comm.type === 'email' ? 'Email' : 
                       comm.type === 'sms' ? 'SMS' : 'Notification'}
                    </div>
                  </div>
                </div>
              ))}
              {recentCommunications.length === 0 && (
                <div className="text-center py-4 text-gray-600">
                  No recent communications
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Templates */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Communication Templates
              </CardTitle>
              <CardDescription>
                Predefined templates for common communications
              </CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div className="font-medium">{template.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <span>
                        {template.type === 'email' ? 'Email' : 
                         template.type === 'sms' ? 'SMS' : 'Notification'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.category}</Badge>
                  </TableCell>
                  <TableCell>{template.subject || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Database */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>
                View and communicate with your customers
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
                  <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
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
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => setShowForm(true)}>
                <Send className="mr-2 h-4 w-4" />
                New Communication
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
                <TableHead>Spent</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Preference</TableHead>
                <TableHead>Last Purchase</TableHead>
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
                  </TableCell>
                  <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {customer.communicationPreference === 'email' && <Mail className="h-4 w-4" />}
                      {customer.communicationPreference === 'sms' && <MessageSquare className="h-4 w-4" />}
                      {customer.communicationPreference === 'both' && (
                        <>
                          <Mail className="h-4 w-4" />
                          <MessageSquare className="h-4 w-4" />
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{customer.lastPurchase}</TableCell>
                  <TableCell>
                    {customer.status === 'active' && <Badge variant="default">Active</Badge>}
                    {customer.status === 'inactive' && <Badge variant="secondary">Inactive</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
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
                <Send className="mr-2 h-4 w-4" />
                New Communication
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}