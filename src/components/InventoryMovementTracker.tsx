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
  Filter,
  ArrowUpDown,
  Package,
  TrendingUp,
  TrendingDown
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

interface InventoryMovement {
  id: string;
  date: string;
  product: string;
  category: string;
  movementType: 'in' | 'out';
  quantity: number;
  unitPrice: number;
  totalValue: number;
  reason: string;
  reference: string;
  location: string;
}

export function InventoryMovementTracker() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<InventoryMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInventoryMovements();
  }, []);

  const fetchInventoryMovements = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple sheets to create movement history
      const [purchasesResponse, salesResponse] = await Promise.all([
        getSheetData('Purchases'),
        getSheetData('Sales')
      ]);
      
      const allMovements: InventoryMovement[] = [];
      
      // Process purchases (inventory in)
      if (purchasesResponse && purchasesResponse.data && purchasesResponse.data.values) {
        const purchaseRows = purchasesResponse.data.values.slice(1, 51); // Limit to first 50 records
        purchaseRows.forEach((row: any[], index: number) => {
          const quantity = parseInt(row[6]) || 0; // Quantity
          const unitPrice = parseFloat(row[7]?.replace('TSh', '').replace(/,/g, '')) || 0; // Cost
          
          if (quantity > 0) {
            allMovements.push({
              id: `purchase-${row[0] || index}`,
              date: row[2] || 'Unknown Date', // Date
              product: row[4] || 'Unknown Product', // Product
              category: row[5] || 'Uncategorized', // Category
              movementType: 'in',
              quantity,
              unitPrice,
              totalValue: quantity * unitPrice,
              reason: 'Purchase',
              reference: `Receipt #${row[1] || 'N/A'}`, // Receipt No.
              location: row[9] || 'Unknown' // Location
            });
          }
        });
      }
      
      // Process sales (inventory out)
      if (salesResponse && salesResponse.data && salesResponse.data.values) {
        const salesRows = salesResponse.data.values.slice(1, 51); // Limit to first 50 records
        salesRows.forEach((row: any[], index: number) => {
          const quantity = parseInt(row[8]) || 0; // Quantity
          const unitPrice = parseFloat(row[6]?.replace('TSh', '').replace(/,/g, '')) || 0; // Price
          
          if (quantity > 0) {
            allMovements.push({
              id: `sale-${row[0] || index}`,
              date: row[2] || 'Unknown Date', // Date
              product: row[5] || 'Unknown Product', // Product
              category: row[4] || 'Uncategorized', // Category (CARTEGORY)
              movementType: 'out',
              quantity,
              unitPrice,
              totalValue: quantity * unitPrice,
              reason: 'Sale',
              reference: `Receipt #${row[1] || 'N/A'}`, // Receipt No.
              location: 'POS' // Sales happen at POS
            });
          }
        });
      }
      
      // Sort by date (newest first)
      allMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setMovements(allMovements);
      setFilteredMovements(allMovements);
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to fetch inventory movements: ' + (error.message || 'Unknown error'));
      console.error('Inventory movements fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = movements.filter(movement => {
      const matchesSearch = movement.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movement.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movement.reference.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || movement.movementType === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredMovements(filtered);
  }, [searchTerm, filter, movements]);

  // Calculate summary statistics
  const totalIn = movements
    .filter(m => m.movementType === 'in')
    .reduce((sum, m) => sum + m.quantity, 0);
    
  const totalOut = movements
    .filter(m => m.movementType === 'out')
    .reduce((sum, m) => sum + m.quantity, 0);
    
  const netMovement = totalIn - totalOut;
  
  const totalValueIn = movements
    .filter(m => m.movementType === 'in')
    .reduce((sum, m) => sum + m.totalValue, 0);
    
  const totalValueOut = movements
    .filter(m => m.movementType === 'out')
    .reduce((sum, m) => sum + m.totalValue, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading inventory movements...</div>
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
        <CardTitle className="flex items-center">
          <ArrowUpDown className="mr-2 h-5 w-5" />
          Inventory Movement Tracking
        </CardTitle>
        <CardDescription>
          Track all inventory movements in and out
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total In</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{totalIn}</div>
              <p className="text-xs text-gray-600">Items received</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Out</CardTitle>
              <TrendingDown className="h-4 w-4 text-gray-500 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{totalOut}</div>
              <p className="text-xs text-gray-600">Items sold</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Movement</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netMovement >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {netMovement}
              </div>
              <p className="text-xs text-gray-600">Current change</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalValueIn - totalValueOut)}
              </div>
              <p className="text-xs text-gray-600">Net inventory value</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search movements..."
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
              <DropdownMenuLabel>Filter by movement</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setFilter('all')}>
                All Movements
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('in')}>
                Inventory In
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('out')}>
                Inventory Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Movements Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  <div>{movement.date}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{movement.product}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{movement.category}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {movement.movementType === 'in' ? (
                    <Badge variant="default" className="bg-green-500">
                      IN
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-red-500">
                      OUT
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`font-medium ${movement.movementType === 'in' ? 'text-green-500' : 'text-red-500'}`}>
                    {movement.movementType === 'in' ? '+' : '-'}{movement.quantity}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(movement.unitPrice)}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`font-medium ${movement.movementType === 'in' ? 'text-green-500' : 'text-red-500'}`}>
                    {movement.movementType === 'in' ? '+' : '-'}{formatCurrency(movement.totalValue)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{movement.reason}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">{movement.reference}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredMovements.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No inventory movements found
          </div>
        )}
      </CardContent>
    </Card>
  );
}