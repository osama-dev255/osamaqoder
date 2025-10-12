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
  Check,
  X,
  FileText,
  Calendar,
  User,
  Building,
  Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSheetData, updateSheetRange } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'pending' | 'approved' | 'rejected' | 'ordered' | 'received' | 'cancelled';
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes: string;
  requestedBy: string;
  requestedDate: string;
}

export function PurchaseApprovalWorkflow() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('pending');
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch purchase orders data from the Purchase Orders sheet
      const response = await getSheetData('Purchase Orders');
      
      if (response && response.data && response.data.values) {
        const rows = response.data.values;
        
        // Skip header row and map the data to purchase order objects
        // Group items by order number since each item is a separate row
        const orderMap: Record<string, PurchaseOrder[]> = {};
        
        rows.slice(1).forEach((row: any[], index: number) => {
          const orderNumber = row[0] || 'N/A';
          
          if (!orderMap[orderNumber]) {
            orderMap[orderNumber] = [];
          }
          
          // For demo purposes, we'll add some additional fields that might be in a real system
          orderMap[orderNumber].push({
            id: `${orderNumber}-${index}`, // Unique ID for each item
            orderNumber,
            supplier: row[1] || 'Unknown Supplier',
            orderDate: row[2] || 'Unknown Date',
            expectedDelivery: row[3] || 'Unknown Date',
            status: row[4] === 'approved' ? 'approved' : 
                   row[4] === 'rejected' ? 'rejected' : 
                   row[4] === 'ordered' ? 'ordered' : 
                   row[4] === 'received' ? 'received' : 
                   row[4] === 'cancelled' ? 'cancelled' : 'pending',
            product: row[5] || 'Unknown Product',
            quantity: parseInt(row[7]) || 0,
            unitPrice: parseFloat(row[8]) || 0,
            total: parseFloat(row[9]) || 0,
            notes: row[10] || '',
            requestedBy: 'System User', // In a real system, this would come from the sheet or user context
            requestedDate: row[2] || new Date().toISOString() // Using order date as requested date
          });
        });
        
        // Flatten the grouped orders into a single array
        const flattenedOrders: PurchaseOrder[] = [];
        Object.values(orderMap).forEach(orderItems => {
          flattenedOrders.push(...orderItems);
        });
        
        setOrders(flattenedOrders);
      }
      
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to fetch purchase orders: ' + (error.message || 'Unknown error'));
      console.error('Purchase orders fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
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

  const handleApprove = async (orderNumber: string) => {
    if (!confirm(`Are you sure you want to approve purchase order #${orderNumber}?`)) {
      return;
    }
    
    try {
      // In a real implementation, we would update the status in the Google Sheet
      // For now, we'll just update the local state
      setOrders(orders.map(order => 
        order.orderNumber === orderNumber ? { ...order, status: 'approved' } : order
      ));
      
      // Show success message
      alert(`Purchase order #${orderNumber} has been approved.`);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to approve purchase order: ' + (error.message || 'Unknown error'));
      console.error('Purchase order approval error:', error);
    }
  };

  const handleReject = async (orderNumber: string) => {
    if (!confirm(`Are you sure you want to reject purchase order #${orderNumber}?`)) {
      return;
    }
    
    try {
      // In a real implementation, we would update the status in the Google Sheet
      // For now, we'll just update the local state
      setOrders(orders.map(order => 
        order.orderNumber === orderNumber ? { ...order, status: 'rejected' } : order
      ));
      
      // Show success message
      alert(`Purchase order #${orderNumber} has been rejected.`);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to reject purchase order: ' + (error.message || 'Unknown error'));
      console.error('Purchase order rejection error:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending Approval</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'ordered':
        return <Badge variant="default">Ordered</Badge>;
      case 'received':
        return <Badge variant="default" className="bg-blue-500">Received</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading purchase orders...</div>
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
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Purchase Order Approval
            </CardTitle>
            <CardDescription>
              Review and approve pending purchase orders
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
                  Pending Approval
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFilter('approved')}>
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFilter('rejected')}>
                  Rejected
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFilter('ordered')}>
                  Ordered
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFilter('received')}>
                  Received
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
              <TableHead>Requested By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueOrderNumbers.map(orderNumber => {
              const orderItems = getOrderDetails(orderNumber);
              const firstItem = orderItems[0];
              const itemCount = orderItems.length;
              const totalAmount = orderTotals[orderNumber] || 0;
              
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
                    {getStatusBadge(firstItem.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      {firstItem.requestedBy}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {firstItem.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleApprove(orderNumber)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleReject(orderNumber)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>No purchase orders found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}