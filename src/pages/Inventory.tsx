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
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  AlertTriangle,
  ArrowUpDown,
  FileText
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
import { InventoryMovementTracker } from '@/components/InventoryMovementTracker';
import { InventoryAuditTrail } from '@/components/InventoryAuditTrail';
import { TabNotification } from '@/components/TabNotification';

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showMovementTracker, setShowMovementTracker] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        // Fetch inventory data from the dedicated Inventory sheet
        const response = await getSheetData('Inventory');
        
        if (response && response.data && response.data.values) {
          const rows = response.data.values;
          
          // If the sheet is empty, initialize with sample data
          if (rows.length === 0) {
            const sampleInventory = [
              {
                id: '1',
                productName: 'COKE 600MLS 12S/W NP',
                category: 'PET',
                currentStock: 100,
                minStock: 20,
                maxStock: 200,
                unit: 'Pack',
                lastUpdated: '2024-12-01',
                status: 'active',
                price: 9700,
                location: 'Shelf A1',
                supplier: 'Coca-Cola Tanzania'
              }
            ];
            setInventoryItems(sampleInventory);
          } else {
            // Skip header row and map the data to inventory objects
            const inventoryData = rows.slice(1).map((row: any[], index: number) => ({
              id: row[0] || `${index + 1}`, // ID
              productName: row[1] || 'Unknown Product', // Product Name
              category: row[2] || 'Uncategorized', // Category
              currentStock: parseInt(row[3]) || 0, // Current Stock
              minStock: parseInt(row[4]) || 0, // Minimum Stock Level (RE-ORDER LEVEL)
              maxStock: parseInt(row[5]) || 0, // Maximum Stock Level
              unit: row[6] || 'Unit', // Unit of Measurement
              price: parseFloat(row[7]) || 0, // Price
              location: row[8] || 'Unknown', // Location
              supplier: row[9] || 'Unknown Supplier', // Supplier
              lastUpdated: row[10] || 'Unknown', // Last Updated
              status: row[11] || 'active' // Status
            }));
            
            setInventoryItems(inventoryData);
            
            // Generate alerts for low stock items
            const lowStockAlerts = inventoryData
              .filter(item => item.currentStock <= item.minStock)
              .map(item => ({
                id: `alert-${item.id}`,
                type: 'low_stock',
                severity: item.currentStock === 0 ? 'critical' : 'warning',
                message: `${item.productName} is below minimum stock level (${item.currentStock}/${item.minStock})`,
                product: item.productName,
                currentStock: item.currentStock,
                minStock: item.minStock
              }));
            
            setAlerts(lowStockAlerts);
          }
        } else {
          // Initialize with sample data if no data is returned
          const sampleInventory = [
            {
              id: '1',
              productName: 'COKE 600MLS 12S/W NP',
              category: 'PET',
              currentStock: 100,
              minStock: 20,
              maxStock: 200,
              unit: 'Pack',
              lastUpdated: '2024-12-01',
              status: 'active',
              price: 9700,
              location: 'Shelf A1',
              supplier: 'Coca-Cola Tanzania'
            },
            {
              id: '2',
              productName: 'SPRITE 600ML 12 S/W NP',
              category: 'PET',
              currentStock: 85,
              minStock: 15,
              maxStock: 150,
              unit: 'Pack',
              lastUpdated: '2024-12-01',
              status: 'active',
              price: 9700,
              location: 'Shelf A2',
              supplier: 'Coca-Cola Tanzania'
            },
            {
              id: '3',
              productName: 'SPAR PINENUT 350ML 24 RB',
              category: 'RGB',
              currentStock: 42,
              minStock: 10,
              maxStock: 100,
              unit: 'Pack',
              lastUpdated: '2024-12-01',
              status: 'active',
              price: 12800,
              location: 'Shelf B1',
              supplier: 'Coca-Cola Tanzania'
            },
            {
              id: '4',
              productName: 'SPRITE 350MLS CR24 RB',
              category: 'RGB',
              currentStock: 28,
              minStock: 10,
              maxStock: 80,
              unit: 'Pack',
              lastUpdated: '2024-12-01',
              status: 'active',
              price: 12800,
              location: 'Shelf B2',
              supplier: 'Coca-Cola Tanzania'
            }
          ];
          setInventoryItems(sampleInventory);
          
          // Generate alerts for sample data
          const lowStockAlerts = sampleInventory
            .filter(item => item.currentStock <= item.minStock)
            .map(item => ({
              id: `alert-${item.id}`,
              type: 'low_stock',
              severity: item.currentStock === 0 ? 'critical' : 'warning',
              message: `${item.productName} is below minimum stock level (${item.currentStock}/${item.minStock})`,
              product: item.productName,
              currentStock: item.currentStock,
              minStock: item.minStock
            }));
          
          setAlerts(lowStockAlerts);
        }
        
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch inventory: ' + (error.message || 'Unknown error'));
        console.error('Inventory fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.includes(searchTerm);
    const matchesFilter = filter === 'all' || 
                          item.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock);
  const outOfStockItems = inventoryItems.filter(item => item.currentStock === 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-gray-600">
            Loading inventory data...
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-gray-600">Loading inventory...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-gray-600">
            Manage your product inventory
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
        <h2 className="text-2xl font-bold tracking-tight">Inventory Management</h2>
        <p className="text-gray-600">
          Track and manage your inventory levels
        </p>
      </div>

      {/* Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TabNotification type="info" message={`${inventoryItems.length} items in inventory`} />
        <TabNotification type="success" message="Stock levels updated" />
        <TabNotification type="warning" message={`${alerts.length} low stock alerts`} />
        <TabNotification type="error" message="2 critical stock alerts" />
      </div>

      {showMovementTracker ? (
        <InventoryMovementTracker onBack={() => setShowMovementTracker(false)} />
      ) : showAuditTrail ? (
        <InventoryAuditTrail onBack={() => setShowAuditTrail(false)} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Current Inventory Levels</CardTitle>
                  <CardDescription>
                    View and manage your product stock levels - All Google Sheets columns displayed
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search inventory..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => setFilter('all')}>
                        All Items
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter('Active')}>
                        Active Items
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setFilter('In-Active')}>
                        Inactive Items
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={() => setShowAuditTrail(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Audit Trail</span>
                  </Button>
                  <Button onClick={() => setShowMovementTracker(true)}>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Movement Tracking</span>
                  </Button>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Add Item</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Product</TableHead>
                      <TableHead className="whitespace-nowrap">Category</TableHead>
                      <TableHead className="whitespace-nowrap">Current Stock</TableHead>
                      <TableHead className="whitespace-nowrap">Min/Max</TableHead>
                      <TableHead className="whitespace-nowrap">Unit</TableHead>
                      <TableHead className="whitespace-nowrap">Price</TableHead>
                      <TableHead className="whitespace-nowrap">Location</TableHead>
                      <TableHead className="whitespace-nowrap">Supplier</TableHead>
                      <TableHead className="whitespace-nowrap">Last Updated</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.productName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${item.currentStock <= item.minStock ? 'text-red-500' : ''}`}>
                            {item.currentStock}
                          </div>
                          {item.currentStock <= item.minStock && (
                            <div className="text-xs text-red-500 flex items-center mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low stock
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{item.minStock} / {item.maxStock}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                        <TableCell>
                          {item.status === 'active' || item.status === 'Active' ? (
                            <Badge variant="default">Active</Badge>
                          ) : item.status === 'In-Active' || item.status === 'inactive' ? (
                            <Badge variant="secondary">Inactive</Badge>
                          ) : item.status === 'low' ? (
                            <Badge variant="destructive">Low Stock</Badge>
                          ) : item.status === 'out' ? (
                            <Badge variant="secondary">Out of Stock</Badge>
                          ) : (
                            <Badge variant="default">{item.status}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
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
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}