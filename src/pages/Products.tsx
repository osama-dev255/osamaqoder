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
  Package,
  AlertTriangle,
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
import { getSheetData, deleteSheetRow } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';
import { AddProductForm } from '@/components/AddProductForm';
import { EditProductForm } from '@/components/EditProductForm';
import { CategoryManagement } from '@/components/CategoryManagement';
import { TabNotification } from '@/components/TabNotification';

interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  supplier: string;
  status: string;
  description: string;
  rowIndex: number;
}

// Add this interface for the EditProductForm
interface EditableProductData {
  id: string;
  name: string;
  category: string;
  price: string; // String type for form input
  cost: string;  // String type for form input
  stock: string; // String type for form input
  supplier: string;
  status: string;
  description: string;
  rowIndex: number;
}

export function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductData | null>(null);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch products from the dedicated Products sheet
      const response = await getSheetData('Products');
      
      if (response && response.data && response.data.values) {
        const rows = response.data.values;
        
        // Skip header row and map the data to product objects
        const productData = rows.slice(1).map((row: any[], index: number) => ({
          id: row[0] || `${index + 1}`, // ID
          name: row[1] || 'Unknown Product', // Product Name
          category: row[2] || 'Uncategorized', // Category
          price: parseFloat(row[3]) || 0, // Selling Price
          cost: parseFloat(row[4]) || 0, // Purchase Cost
          stock: parseInt(row[5]) || 0, // Stock Quantity
          supplier: row[6] || 'Unknown Supplier', // Supplier
          status: row[7] || 'active', // Status
          description: row[8] || '', // Description
          rowIndex: index // Store the row index for updates
        }));
        
        setProducts(productData);
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

  const handleDeleteProduct = async (product: ProductData) => {
    try {
      // rowIndex + 2 because:
      // - rowIndex is 0-based from our data mapping
      // - +1 to skip header row
      // - +1 because Google Sheets is 1-based indexing
      await deleteSheetRow('Products', product.rowIndex + 2);
      
      // Refresh the product list
      fetchProducts();
      
      // Close the delete confirmation
      setDeletingProduct(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to delete product: ' + (error.message || 'Unknown error'));
      console.error('Product delete error:', error);
    }
  };

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
          <p className="text-gray-600">
            Loading product inventory...
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-gray-600">Loading products...</div>
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
        <h2 className="text-2xl font-bold tracking-tight">Products - Full Google Sheets View</h2>
        <p className="text-gray-600">
          Manage your product catalog and inventory
        </p>
      </div>

      {/* Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TabNotification type="info" message={`${products.length} products loaded`} />
        <TabNotification type="success" message="Inventory sync complete" />
        <TabNotification type="warning" message="3 products need reordering" />
      </div>

      {showAddForm ? (
        <AddProductForm onProductAdded={() => {
          fetchProducts();
          setShowAddForm(false);
        }} />
      ) : editingProduct ? (
        <EditProductForm 
          product={{
            ...editingProduct,
            price: editingProduct.price.toString(),
            cost: editingProduct.cost.toString(),
            stock: editingProduct.stock.toString()
          }} 
          onProductUpdated={() => {
            fetchProducts();
            setEditingProduct(null);
          }} 
          onCancel={() => setEditingProduct(null)} 
        />
      ) : showCategoryManagement ? (
        <CategoryManagement />
      ) : (
        <>
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
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
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
                        <span className="hidden sm:inline">Filter</span>
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
                  <Button onClick={() => setShowCategoryManagement(true)}>
                    <Tag className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Manage Categories</span>
                  </Button>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Add Product</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">ID</TableHead>
                      <TableHead className="whitespace-nowrap">Product</TableHead>
                      <TableHead className="whitespace-nowrap">Category</TableHead>
                      <TableHead className="whitespace-nowrap">Unit Price</TableHead>
                      <TableHead className="whitespace-nowrap">Unit Cost</TableHead>
                      <TableHead className="whitespace-nowrap">Stock</TableHead>
                      <TableHead className="whitespace-nowrap">Supplier</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
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
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setDeletingProduct(product)}
                            >
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

          {/* Delete Confirmation Dialog */}
          {deletingProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-500">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Confirm Deletion
                  </CardTitle>
                  <CardDescription>
                    Are you sure you want to delete the product "{deletingProduct.name}"?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    This action will clear the product data from the sheet. This cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setDeletingProduct(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteProduct(deletingProduct)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
