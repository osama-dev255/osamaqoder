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
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Building,
  Tag,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Download,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSheetData } from '@/services/apiService';
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

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'pending' | 'approved' | 'rejected' | 'ordered' | 'shipped' | 'received' | 'cancelled';
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes: string;
  requestedBy: string;
  approvedBy?: string;
  approvedDate?: string;
  shippedDate?: string;
  receivedDate?: string;
}

interface OrderTrackingEvent {
  id: string;
  orderNumber: string;
  timestamp: string;
  status: string;
  description: string;
  user: string;
}

interface ViewOrdersModuleProps {
  onViewOrder: (order: PurchaseOrder) => void;
  onEditOrder: (order: PurchaseOrder) => void;
  onDeleteOrder: (orderId: string) => void;
  onRefresh: () => void;
}

export function ViewOrdersModule({ onViewOrder, onEditOrder, onDeleteOrder, onRefresh }: ViewOrdersModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'tracking' | 'analytics'>('list');
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<OrderTrackingEvent[]>([]);

  // Use the correct sheet name without spaces
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch purchase orders data from the PurchaseOrders sheet (without space)
      const response = await getSheetData('PurchaseOrders');
      
      if (response && response.data && response.data.values) {
        const rows = response.data.values;
        
        // Check if we have data
        if (rows.length === 0) {
          setOrders([]);
          setTrackingEvents([]);
          return;
        }
        
        // Skip header row and map the data to purchase order objects
        // Group items by order number since each item is a separate row
        const orderMap: Record<string, PurchaseOrder[]> = {};
        
        rows.slice(1).forEach((row: any[], index: number) => {
          const orderNumber = row[0] || 'N/A';
          
          if (!orderMap[orderNumber]) {
            orderMap[orderNumber] = [];
          }
          
          // Map status to a more detailed set of options
          let status: PurchaseOrder['status'] = 'pending';
          const rowStatus = row[4] || 'pending';
          switch (rowStatus.toLowerCase()) {
            case 'approved':
              status = 'approved';
              break;
            case 'rejected':
              status = 'rejected';
              break;
            case 'ordered':
              status = 'ordered';
              break;
            case 'shipped':
              status = 'shipped';
              break;
            case 'received':
              status = 'received';
              break;
            case 'cancelled':
              status = 'cancelled';
              break;
            default:
              status = 'pending';
          }
          
          orderMap[orderNumber].push({
            id: `${orderNumber}-${index}`, // Unique ID for each item
            orderNumber,
            supplier: row[1] || 'Unknown Supplier',
            orderDate: row[2] || 'Unknown Date',
            expectedDelivery: row[3] || 'Unknown Date',
            status,
            product: row[5] || 'Unknown Product',
            quantity: parseInt(row[7]) || 0,
            unitPrice: parseFloat(row[8]) || 0,
            total: parseFloat(row[9]) || 0,
            notes: row[10] || '',
            requestedBy: 'System User' // In a real system, this would come from the sheet or user context
          });
        });
        
        // Flatten the grouped orders into a single array
        const flattenedOrders: PurchaseOrder[] = [];
        Object.values(orderMap).forEach(orderItems => {
          flattenedOrders.push(...orderItems);
        });
        
        setOrders(flattenedOrders);
        
        // Generate mock tracking events for demo purposes
        const mockEvents: OrderTrackingEvent[] = [];
        flattenedOrders.forEach(order => {
          mockEvents.push({
            id: `event-${order.orderNumber}-1`,
            orderNumber: order.orderNumber,
            timestamp: order.orderDate,
            status: 'Created',
            description: 'Purchase order created',
            user: order.requestedBy
          });
          
          if (order.status !== 'pending' && order.status !== 'rejected' && order.status !== 'cancelled') {
            mockEvents.push({
              id: `event-${order.orderNumber}-2`,
              orderNumber: order.orderNumber,
              timestamp: new Date(new Date(order.orderDate).getTime() + 86400000).toISOString().split('T')[0], // 1 day later
              status: 'Approved',
              description: 'Purchase order approved',
              user: 'Manager'
            });
          }
          
          if (order.status === 'ordered' || order.status === 'shipped' || order.status === 'received') {
            mockEvents.push({
              id: `event-${order.orderNumber}-3`,
              orderNumber: order.orderNumber,
              timestamp: new Date(new Date(order.orderDate).getTime() + 172800000).toISOString().split('T')[0], // 2 days later
              status: 'Ordered',
              description: 'Order placed with supplier',
              user: 'Procurement'
            });
          }
          
          if (order.status === 'shipped' || order.status === 'received') {
            mockEvents.push({
              id: `event-${order.orderNumber}-4`,
              orderNumber: order.orderNumber,
              timestamp: new Date(new Date(order.orderDate).getTime() + 259200000).toISOString().split('T')[0], // 3 days later
              status: 'Shipped',
              description: 'Order shipped by supplier',
              user: order.supplier
            });
          }
          
          if (order.status === 'received') {
            mockEvents.push({
              id: `event-${order.orderNumber}-5`,
              orderNumber: order.orderNumber,
              timestamp: order.expectedDelivery,
              status: 'Received',
              description: 'Order received and verified',
              user: 'Warehouse'
            });
          }
        });
        
        setTrackingEvents(mockEvents);
      } else {
        // No data returned
        setOrders([]);
        setTrackingEvents([]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Purchase orders fetch error:', err);
      // Provide more detailed error information
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to fetch purchase orders';
      setError(`Error loading purchase orders: ${errorMessage}`);
      setOrders([]);
      setTrackingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || order.status === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredOrders(filtered);
  }, [searchTerm, filter, orders]);

  // Get unique order numbers for display
  const uniqueOrderNumbers = Array.from(new Set(orders.map(order => order.orderNumber)));
  
  // Calculate total for each order
  const orderTotals: Record<string, number> = {};
  orders.forEach(order => {
    if (!orderTotals[order.orderNumber]) {
      orderTotals[order.orderNumber] = 0;
    }
    orderTotals[order.orderNumber] += order.total;
  });

  // Get order details for display
  const getOrderDetails = (orderNumber: string) => {
    return orders.filter(order => order.orderNumber === orderNumber);
  };

  // Get tracking events for an order
  const getOrderEvents = (orderNumber: string) => {
    return trackingEvents.filter(event => event.orderNumber === orderNumber);
  };

  // Calculate summary statistics
  const totalOrders = uniqueOrderNumbers.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const approvedOrders = orders.filter(o => o.status === 'approved').length;
  const orderedOrders = orders.filter(o => o.status === 'ordered').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const receivedOrders = orders.filter(o => o.status === 'received').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  // Status distribution for chart
  const statusDistribution = [
    { name: 'Pending', value: pendingOrders },
    { name: 'Approved', value: approvedOrders },
    { name: 'Ordered', value: orderedOrders },
    { name: 'Shipped', value: shippedOrders },
    { name: 'Received', value: receivedOrders },
    { name: 'Cancelled', value: cancelledOrders }
  ];

  const COLORS = ['#FFBB28', '#0088FE', '#00C49F', '#FF8042', '#8884D8', '#FF6B6B'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-blue-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'ordered':
        return <Badge variant="default" className="bg-purple-500">Ordered</Badge>;
      case 'shipped':
        return <Badge variant="default" className="bg-indigo-500">Shipped</Badge>;
      case 'received':
        return <Badge variant="default" className="bg-green-500">Received</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleRefresh = () => {
    fetchOrders();
    onRefresh();
  };

  const exportToCSV = () => {
    // Create CSV content
    let csvContent = 'Order Number,Supplier,Order Date,Expected Delivery,Status,Product,Quantity,Unit Price,Total,Notes\n';
    
    orders.forEach(order => {
      const row = [
        `"${order.orderNumber}"`,
        `"${order.supplier}"`,
        `"${order.orderDate}"`,
        `"${order.expectedDelivery}"`,
        `"${order.status}"`,
        `"${order.product}"`,
        `"${order.quantity}"`,
        `"${order.unitPrice}"`,
        `"${order.total}"`,
        `"${order.notes}"`
      ].join(',');
      csvContent += row + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'purchase_orders.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Purchase Orders
              </CardTitle>
              <CardDescription>
                Loading purchase orders...
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-gray-600 flex items-center">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading purchase orders...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Purchase Orders
              </CardTitle>
              <CardDescription>
                Manage your purchase orders
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="font-medium">Failed to load purchase orders</p>
            <p className="text-sm mt-2">{error}</p>
            <Button variant="outline" className="mt-4" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If we have no orders and no errors, show empty state
  if (orders.length === 0 && !loading && !error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Purchase Orders
              </CardTitle>
              <CardDescription>
                Manage your purchase orders
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p className="font-medium">No purchase orders found</p>
            <p className="text-sm mt-2">Create a new purchase order to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={viewMode === 'list' ? 'default' : 'outline'} 
          onClick={() => setViewMode('list')}
        >
          <FileText className="mr-2 h-4 w-4" />
          List View
        </Button>
        <Button 
          variant={viewMode === 'tracking' ? 'default' : 'outline'} 
          onClick={() => setViewMode('tracking')}
        >
          <Truck className="mr-2 h-4 w-4" />
          Tracking View
        </Button>
        <Button 
          variant={viewMode === 'analytics' ? 'default' : 'outline'} 
          onClick={() => setViewMode('analytics')}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Analytics
        </Button>
      </div>

      {/* Summary Cards (Analytics View) */}
      {viewMode === 'analytics' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-gray-600">All purchase orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-gray-600">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{approvedOrders}</div>
              <p className="text-xs text-gray-600">Ready to order</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ordered</CardTitle>
              <Truck className="h-4 w-4 text-gray-500 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">{orderedOrders}</div>
              <p className="text-xs text-gray-600">Sent to supplier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
              <Truck className="h-4 w-4 text-gray-500 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-500">{shippedOrders}</div>
              <p className="text-xs text-gray-600">In transit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Received</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{receivedOrders}</div>
              <p className="text-xs text-gray-600">Delivered</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts (Analytics View) */}
      {viewMode === 'analytics' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                Order Status Distribution
              </CardTitle>
              <CardDescription>
                Distribution of purchase orders by status
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusDistribution.map((entry, index) => (
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
                Order Timeline
              </CardTitle>
              <CardDescription>
                Recent purchase order activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-72 overflow-y-auto">
                {trackingEvents.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Order #{event.orderNumber}</span>
                        <span className="text-sm text-gray-600">{event.timestamp}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{event.status}:</span> {event.description}
                      </div>
                      <div className="text-xs text-gray-600">By {event.user}</div>
                    </div>
                  </div>
                ))}
                {trackingEvents.length === 0 && (
                  <div className="text-center py-4 text-gray-600">
                    No recent tracking events
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {viewMode === 'tracking' ? 'Purchase Order Tracking' : 'Purchase Orders'}
              </CardTitle>
              <CardDescription>
                {viewMode === 'tracking' 
                  ? 'Track the status of your purchase orders' 
                  : 'Manage your purchase orders'}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search orders..."
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
                    All Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('approved')}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('ordered')}>
                    Ordered
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('shipped')}>
                    Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('received')}>
                    Received
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('cancelled')}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'analytics' ? (
            <div className="text-center py-8 text-gray-600">
              <BarChart className="h-12 w-12 mx-auto mb-4" />
              <p>Switch to List or Tracking view to see order details</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uniqueOrderNumbers.map(orderNumber => {
                  const orderItems = getOrderDetails(orderNumber);
                  const firstItem = orderItems[0];
                  const itemCount = orderItems.length;
                  const totalAmount = orderTotals[orderNumber] || 0;
                  const events = getOrderEvents(orderNumber);
                  const lastEvent = events.length > 0 ? events[events.length - 1] : null;
                  
                  return (
                    <TableRow key={orderNumber}>
                      <TableCell>
                        <div className="font-medium">#{orderNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{firstItem.supplier}</div>
                      </TableCell>
                      <TableCell>{firstItem.orderDate}</TableCell>
                      <TableCell>{firstItem.expectedDelivery}</TableCell>
                      <TableCell>{itemCount} items</TableCell>
                      <TableCell className="font-medium">{formatCurrency(totalAmount)}</TableCell>
                      <TableCell>
                        {viewMode === 'tracking' 
                          ? getStatusBadge(firstItem.status)
                          : (
                            <Badge 
                              variant={
                                firstItem.status === 'pending' ? 'secondary' :
                                firstItem.status === 'approved' ? 'default' :
                                firstItem.status === 'ordered' ? 'outline' :
                                firstItem.status === 'received' ? 'default' :
                                'destructive'
                              }
                            >
                              {firstItem.status.charAt(0).toUpperCase() + firstItem.status.slice(1)}
                            </Badge>
                          )}
                        {viewMode === 'tracking' && lastEvent && (
                          <div className="text-xs text-gray-600 mt-1">
                            Last: {lastEvent.status}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onViewOrder(firstItem)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onEditOrder(firstItem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onDeleteOrder(orderNumber)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <p>No purchase orders found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}