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
  AlertTriangle
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

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                cost: 8200,
                price: 9700
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
              price: parseFloat(row[7]) || 0, // Price (was lastUpdated)
              location: row[8] || 'Unknown', // Location (was cost)
              supplier: row[9] || 'Unknown Supplier', // Supplier (was price)
              lastUpdated: row[10] || 'Unknown', // Last Updated
              status: row[11] || 'active', // Status
              cost: parseFloat(row[7]) * 0.9 || 0 // Calculate cost as 90% of price (approximation)
            }));
            
            setInventoryItems(inventoryData);
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
              cost: 8200,
              price: 9700
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
              cost: 8200,
              price: 9700
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
              cost: 11000,
              price: 12800
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
              status: 'low',
              cost: 11000,
              price: 12800
            }
          ];
          setInventoryItems(sampleInventory);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Loading inventory data...
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading inventory...</div>
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
          <p className="text-muted-foreground">
            Manage your inventory
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
        <h2 className="text-2xl font-bold tracking-tight">Inventory - Full Google Sheets View</h2>
        <p className="text-muted-foreground">
          Manage your product inventory and stock levels - All Google Sheets columns displayed
        </p>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-red-500 bg-gradient-to-r from-red-900/30 to-orange-900/30 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-red-300 font-bold text-xl">
              <AlertTriangle className="mr-3 h-6 w-6 text-red-400" />
              <span className="font-sans">Low Stock Alert</span>
            </CardTitle>
            <CardDescription className="text-red-200/80 font-medium">
              {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} below minimum stock level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-800/50 hover:bg-red-800/30 transition-all duration-200">
                  <span className="font-medium text-red-100 font-sans">{item.productName}</span>
                  <span className="text-sm text-red-200 font-mono">
                    {item.currentStock} {item.unit} <span className="text-red-300">/</span> Min: {item.minStock}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Complete Inventory Management</CardTitle>
              <CardDescription>
                View and manage your product stock levels - All Google Sheets columns displayed
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                    Filter
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
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Inventory Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell>{item.currentStock}</TableCell>
                  <TableCell>{item.minStock} / {item.maxStock}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>{formatCurrency(item.cost)}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}