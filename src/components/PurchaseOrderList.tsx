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
import { getSheetData } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  status: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes: string;
}

interface PurchaseOrderListProps {
  onViewOrder: (order: PurchaseOrder) => void;
  onEditOrder: (order: PurchaseOrder) => void;
  onDeleteOrder: (orderId: string) => void;
}

export function PurchaseOrderList({ onViewOrder, onEditOrder, onDeleteOrder }: PurchaseOrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
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
          
          orderMap[orderNumber].push({
            id: `${orderNumber}-${index}`, // Unique ID for each item
            orderNumber,
            supplier: row[1] || 'Unknown Supplier',
            orderDate: row[2] || 'Unknown Date',
            expectedDelivery: row[3] || 'Unknown Date',
            status: row[4] || 'pending',
            product: row[5] || 'Unknown Product',
            quantity: parseInt(row[7]) || 0,
            unitPrice: parseFloat(row[8]) || 0,
            total: parseFloat(row[9]) || 0,
            notes: row[10] || ''
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
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || order.status === filter;
    return matchesSearch && matchesFilter;
  });

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Purchase Orders
          </CardTitle>
          <CardDescription>
            Loading purchase orders...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading purchase orders...</div>

        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Purchase Orders
          </CardTitle>
          <CardDescription>
            Manage your purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Purchase Orders
            </CardTitle>
            <CardDescription>
              Manage your purchase orders
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
                  All
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
                <DropdownMenuItem onSelect={() => setFilter('received')}>
                  Received
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFilter('cancelled')}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>No purchase orders found</p>
            <p className="text-sm">Create a new purchase order to get started</p>
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
                const orderItems = orders.filter(order => order.orderNumber === orderNumber);
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
      </CardContent>
    </Card>
  );
}