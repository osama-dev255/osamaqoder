import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Edit, 
  Trash2, 
  Filter,
  Plus, 
  CheckCircle,
  Clock,
  CreditCard,
  Building,
  FileText,
  Check,
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
import { getSheetData } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';
import { AddPurchaseForm } from '@/components/AddPurchaseForm';
import { SupplierPerformanceTracker } from '@/components/SupplierPerformanceTracker';
import { PurchaseOrderForm } from '@/components/PurchaseOrderForm';
import { PurchaseOrderList } from '@/components/PurchaseOrderList';
import { SupplierManagement } from '@/components/SupplierManagement';
import { PurchaseApprovalWorkflow } from '@/components/PurchaseApprovalWorkflow';
import { PurchaseOrderTracking } from '@/components/PurchaseOrderTracking';

// Define the settlement item interface
interface SettlementItem {
  id: string;
  description: string;
  amount: number;
  status: 'paid' | 'credited';
  reference?: string;
  date: string;
}

export function Purchases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Settlement cart state
  const [settlementItems, setSettlementItems] = useState<SettlementItem[]>([]);
  const [newItem, setNewItem] = useState({
    description: '',
    amount: '',
    status: 'paid' as 'paid' | 'credited',
    reference: ''
  });
  const [settlementFilter, setSettlementFilter] = useState<'all' | 'paid' | 'credited'>('all');
  
  // UI state
  const [showSupplierPerformance, setShowSupplierPerformance] = useState(false);
  const [showPurchaseOrderForm, setShowPurchaseOrderForm] = useState(false);
  const [showPurchaseOrderList, setShowPurchaseOrderList] = useState(false);
  const [showSupplierManagement, setShowSupplierManagement] = useState(false);
  const [showPurchaseApproval, setShowPurchaseApproval] = useState(false);
  const [showPurchaseTracking, setShowPurchaseTracking] = useState(false);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      // Fetch purchases data from the Purchases sheet
      const response = await getSheetData('Purchases');
      
      if (response && response.data && response.data.values) {
        const rows = response.data.values;
        
        // Skip header row and map the data to purchase objects
        const purchaseData = rows.slice(1, 51).map((row: any[], index: number) => ({
          id: row[0] || `${index + 1}`, // ID
          receiptNo: row[1] || 'N/A', // Receipt Number
          date: row[2] || 'Unknown Date', // Date (TAREHE)
          time: row[3] || 'Unknown Time', // Time (MUDA)
          product: row[4] || 'Unknown Product', // Product (BIDHAA) - Fixed mapping
          category: row[5] || 'Uncategorized', // Category (KUNDI) - Fixed mapping
          quantity: parseInt(row[6]) || 0, // Quantity (IDADI)
          price: parseFloat(row[7]?.replace('TSh', '').replace(/,/g, '')) || 0, // Cost (BEI1)
          amount: parseFloat(row[8]?.replace('TSh', '').replace(/,/g, '')) || 0, // Amount (KIASI)
          location: row[9] || 'Unknown', // Location
          supplier: row[10] || 'Unknown', // Supplier
          status: row[11] || 'completed', // Status
          purchasedBy: row[12] || 'Unknown' // Purchased By
        }));
        
        setPurchases(purchaseData);
      }
      
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to fetch purchases: ' + (error.message || 'Unknown error'));
      console.error('Purchases fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Settlement cart functions
  const addSettlementItem = () => {
    if (!newItem.description || !newItem.amount) return;
    
    const item: SettlementItem = {
      id: Date.now().toString(),
      description: newItem.description,
      amount: parseFloat(newItem.amount),
      status: newItem.status,
      reference: newItem.reference,
      date: new Date().toLocaleDateString()
    };
    
    setSettlementItems([...settlementItems, item]);
    
    // Reset form
    setNewItem({
      description: '',
      amount: '',
      status: 'paid',
      reference: ''
    });
  };

  const removeSettlementItem = (id: string) => {
    setSettlementItems(settlementItems.filter(item => item.id !== id));
  };

  const updateSettlementItemStatus = (id: string, status: 'paid' | 'credited') => {
    setSettlementItems(
      settlementItems.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const filteredSettlementItems = settlementItems.filter(item => {
    if (settlementFilter === 'all') return true;
    return item.status === settlementFilter;
  });

  const totalPaid = settlementItems
    .filter(item => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalCredited = settlementItems
    .filter(item => item.status === 'credited')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const netSettlement = totalPaid - totalCredited;

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          purchase.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          purchase.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || purchase.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Function to add a purchase to the settlement cart
  const addPurchaseToSettlement = (purchase: any) => {
    const newItem: SettlementItem = {
      id: `settlement-${Date.now()}`,
      description: `${purchase.product} - Receipt #${purchase.receiptNo}`,
      amount: purchase.amount,
      status: 'paid', // Default to paid, can be changed by user
      reference: purchase.receiptNo,
      date: new Date().toLocaleDateString()
    };
    
    setSettlementItems([...settlementItems, newItem]);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Purchases</h2>
          <p className="text-gray-600">
            Manage your purchase orders and inventory
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading purchases...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Purchases</h2>
          <p className="text-gray-600">
            Manage your purchase records
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

  // Show Purchase Order Form
  if (showPurchaseOrderForm) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Purchase Orders</h2>
          <p className="text-gray-600">
            Create a new purchase order
          </p>
        </div>
        <PurchaseOrderForm 
          onOrderCreated={() => {
            setShowPurchaseOrderForm(false);
            // Refresh purchase orders list if needed
          }} 
          onCancel={() => setShowPurchaseOrderForm(false)} 
        />
      </div>
    );
  }

  // Show Purchase Order List
  if (showPurchaseOrderList) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Purchase Orders</h2>
            <p className="text-gray-600">
              View and manage your purchase orders
            </p>
          </div>
          <Button onClick={() => setShowPurchaseOrderList(false)}>
            Back to Purchases
          </Button>
        </div>
        <PurchaseOrderList 
          onViewOrder={(order) => console.log('View order:', order)}
          onEditOrder={(order) => console.log('Edit order:', order)}
          onDeleteOrder={(orderId) => console.log('Delete order:', orderId)}
        />
      </div>
    );
  }

  // Show Purchase Approval Workflow
  if (showPurchaseApproval) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Purchase Approval</h2>
            <p className="text-gray-600">
              Manage your purchase orders and supplier relationships
            </p>
          </div>
          <Button onClick={() => setShowPurchaseApproval(false)}>
            Back to Purchases
          </Button>
        </div>
        <PurchaseApprovalWorkflow />
      </div>
    );
  }

  // Show Purchase Order Tracking
  if (showPurchaseTracking) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Purchase Order Tracking</h2>
            <p className="text-gray-600">
              Track and manage your purchase orders
            </p>
          </div>
          <Button onClick={() => setShowPurchaseTracking(false)}>
            Back to Purchases
          </Button>
        </div>
        <PurchaseOrderTracking />
      </div>
    );
  }

  // Show Supplier Management
  if (showSupplierManagement) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Supplier Management</h2>
            <p className="text-gray-600">
              Manage your purchase orders and supplier relationships
            </p>
          </div>
          <Button onClick={() => setShowSupplierManagement(false)}>
            Back to Purchases
          </Button>
        </div>
        <SupplierManagement />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Purchases</h2>
          <p className="text-gray-600">
            Manage your purchase orders and inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowPurchaseOrderForm(true)}>
            <FileText className="mr-2 h-4 w-4" />
            New Purchase Order
          </Button>
          <Button onClick={() => setShowPurchaseOrderList(true)} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View Orders
          </Button>
          <Button onClick={() => setShowPurchaseApproval(true)} variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Approve Orders
          </Button>
          <Button onClick={() => setShowPurchaseTracking(true)} variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Track Orders
          </Button>
        </div>
      </div>

      {showSupplierPerformance ? (
        <SupplierPerformanceTracker />
      ) : showSupplierManagement ? (
        <SupplierManagement />
      ) : (
        <>
          {/* Settlement Cart Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Settlement</CardTitle>
              <CardDescription>
                Track paid and credited amounts for your purchases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Settlement Summary */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                    <CheckCircle className="h-4 w-4 text-gray-500 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{formatCurrency(totalPaid)}</div>
                    <p className="text-xs text-gray-600">Amounts marked as paid</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Credited</CardTitle>
                    <Clock className="h-4 w-4 text-gray-500 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">{formatCurrency(totalCredited)}</div>
                    <p className="text-xs text-gray-600">Amounts marked as credited</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Settlement</CardTitle>
                    <CreditCard className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${netSettlement >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(netSettlement)}
                    </div>
                    <p className="text-xs text-gray-600">Paid minus credited</p>
                  </CardContent>
                </Card>
              </div>

              {/* Add New Settlement Item Form */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <Label htmlFor="settlement-description">Description</Label>
                  <Input
                    id="settlement-description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Enter item description"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="settlement-amount">Amount</Label>
                  <Input
                    id="settlement-amount"
                    type="number"
                    value={newItem.amount}
                    onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="settlement-status">Status</Label>
                  <select
                    id="settlement-status"
                    className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                    value={newItem.status}
                    onChange={(e) => setNewItem({...newItem, status: e.target.value as 'paid' | 'credited'})}
                  >
                    <option value="paid">Paid</option>
                    <option value="credited">Credited</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor="settlement-reference">Reference</Label>
                  <Input
                    id="settlement-reference"
                    value={newItem.reference}
                    onChange={(e) => setNewItem({...newItem, reference: e.target.value})}
                    placeholder="Enter reference (optional)"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <Button onClick={addSettlementItem} className="w-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Settlement Items Table */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="text-lg font-medium">Settlement Items</div>
                  <div className="flex gap-2">
                    <Button 
                      variant={settlementFilter === 'all' ? 'default' : 'outline'} 
                      onClick={() => setSettlementFilter('all')}
                    >
                      All
                    </Button>
                    <Button 
                      variant={settlementFilter === 'paid' ? 'default' : 'outline'} 
                      onClick={() => setSettlementFilter('paid')}
                    >
                      Paid
                    </Button>
                    <Button 
                      variant={settlementFilter === 'credited' ? 'default' : 'outline'} 
                      onClick={() => setSettlementFilter('credited')}
                    >
                      Credited
                    </Button>
                  </div>
                </div>
                
                {filteredSettlementItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-4" />
                    <p>No settlement items found</p>
                    <p className="text-sm">Add items to get started</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSettlementItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            <div className="font-medium">{item.description}</div>
                          </TableCell>
                          <TableCell>
                            {item.reference || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.amount)}
                          </TableCell>
                          <TableCell>
                            <select
                              className="w-full h-8 px-2 py-1 text-sm border border-input bg-background rounded"
                              value={item.status}
                              onChange={(e) => updateSettlementItemStatus(item.id, e.target.value as 'paid' | 'credited')}
                            >
                              <option value="paid">Paid</option>
                              <option value="credited">Credited</option>
                            </select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeSettlementItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Existing Purchases Section */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Purchase Records</CardTitle>
                  <CardDescription>
                    View and manage your purchase transactions
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search purchases..."
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
                      <DropdownMenuItem onSelect={() => setFilter('completed')}>
                        Completed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={() => setShowSupplierPerformance(true)}>
                    <Building className="mr-2 h-4 w-4" />
                    Supplier Performance
                  </Button>
                  <Button onClick={() => setShowSupplierManagement(true)}>
                    <Building className="mr-2 h-4 w-4" />
                    Manage Suppliers
                  </Button>
                  <AddPurchaseForm onPurchaseAdded={fetchPurchases} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt No.</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Purchased By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        <div className="font-medium">#{purchase.receiptNo}</div>
                      </TableCell>
                      <TableCell>
                        <div>{purchase.date}</div>
                        <div className="text-sm text-gray-500">{purchase.time}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{purchase.product}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{purchase.category}</Badge>
                      </TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell>{formatCurrency(purchase.price)}</TableCell>
                      <TableCell>{formatCurrency(purchase.amount)}</TableCell>
                      <TableCell>{purchase.location}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                      <TableCell>{purchase.purchasedBy}</TableCell>
                      <TableCell>
                        {purchase.status === 'completed' && <Badge variant="default">Completed</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addPurchaseToSettlement(purchase)}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}