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
  Filter
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

export function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from the dedicated Products sheet
        const response = await getSheetData('Products');
        
        if (response && response.data && response.data.values) {
          const rows = response.data.values;
          
          // If the sheet is empty, initialize with headers
          if (rows.length === 0) {
            const productData = [
              {
                id: '1',
                name: 'COKE 600MLS 12S/W NP',
                category: 'PET',
                price: 9700,
                cost: 8200,
                stock: 100,
                supplier: 'Coca-Cola Tanzania',
                status: 'active'
              }
            ];
            setProducts(productData);
          } else {
            // Skip header row and map the data to product objects
            const productData = rows.slice(1).map((row: any[], index: number) => ({
              id: row[0] || `${index + 1}`, // ID
              name: row[1] || 'Unknown Product', // Product Name
              category: row[2] || 'Uncategorized', // Category
              price: parseFloat(row[3]) || 0, // Selling Price
              cost: parseFloat(row[4]) || 0, // Purchase Cost
              stock: parseInt(row[5]) || 0, // Stock Quantity
              supplier: row[6] || 'Unknown Supplier', // Supplier
              status: row[7] || 'active' // Status
            }));
            
            setProducts(productData);
          }
        } else {
          // Initialize with sample data if no data is returned
          const sampleProducts = [
            {
              id: '1',
              name: 'COKE 600MLS 12S/W NP',
              category: 'PET',
              price: 9700,
              cost: 8200,
              stock: 100,
              supplier: 'Coca-Cola Tanzania',
              status: 'active'
            },
            {
              id: '2',
              name: 'SPRITE 600ML 12 S/W NP',
              category: 'PET',
              price: 9700,
              cost: 8200,
              stock: 85,
              supplier: 'Coca-Cola Tanzania',
              status: 'active'
            },
            {
              id: '3',
              name: 'SPAR PINENUT 350ML 24 RB',
              category: 'RGB',
              price: 12800,
              cost: 11000,
              stock: 42,
              supplier: 'Coca-Cola Tanzania',
              status: 'active'
            },
            {
              id: '4',
              name: 'SPRITE 350MLS CR24 RB',
              category: 'RGB',
              price: 12800,
              cost: 11000,
              stock: 28,
              supplier: 'Coca-Cola Tanzania',
              status: 'active'
            }
          ];
          setProducts(sampleProducts);
        }
        
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch products: ' + (error.message || 'Unknown error'));
        console.error('Products fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.id.includes(searchTerm);
    const matchesFilter = filter === 'all' || 
                          product.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Loading product inventory...
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading products...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
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

  // Debug: Log the first product to see the data structure
  if (products.length > 0) {
    console.log('First product data:', products[0]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Products - Full Google Sheets View</h2>
        <p className="text-muted-foreground">
          Manage your product inventory - All Google Sheets columns displayed
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Complete Product Inventory</CardTitle>
              <CardDescription>
                View and manage your products - All Google Sheets columns displayed
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
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
                    All Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('Active')}>
                    Active Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('In-Active')}>
                    Inactive Products
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{formatCurrency(product.cost)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>
                    {product.status === 'active' || product.status === 'Active' ? (
                      <Badge variant="default">Active</Badge>
                    ) : product.status === 'In-Active' || product.status === 'inactive' ? (
                      <Badge variant="secondary">Inactive</Badge>
                    ) : (
                      <Badge variant="destructive">{product.status}</Badge>
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