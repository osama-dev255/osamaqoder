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
                status: 'active'
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
              minStock: parseInt(row[4]) || 0, // Minimum Stock Level
              maxStock: parseInt(row[5]) || 0, // Maximum Stock Level
              unit: row[6] || 'Unit', // Unit of Measurement
              lastUpdated: row[7] || 'Unknown', // Last Updated
              status: parseInt(row[3]) > parseInt(row[4]) ? 'active' : (parseInt(row[3]) > 0 ? 'low' : 'out') // Status based on stock
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
              status: 'active'
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
              status: 'active'
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
              status: 'active'
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
              status: 'low'
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
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
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
        <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
        <p className="text-muted-foreground">
          Manage your product inventory and stock levels
        </p>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-300">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>
              {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} below minimum stock level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-sm">
                    {item.currentStock} {item.unit} (Min: {item.minStock})
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
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                View and manage your product stock levels
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
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('active')}>
                    Adequate Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('low')}>
                    Low Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('out')}>
                    Out of Stock
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
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell>
                    {item.status === 'active' && <Badge variant="default">Adequate</Badge>}
                    {item.status === 'low' && <Badge variant="destructive">Low Stock</Badge>}
                    {item.status === 'out' && <Badge variant="secondary">Out of Stock</Badge>}
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