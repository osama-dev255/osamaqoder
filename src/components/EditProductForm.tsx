import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Edit, 
  Package, 
  Tag, 
  DollarSign, 
  Hash,
  Building,
  AlertCircle,
  X
} from 'lucide-react';
import { updateSheetRange } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

interface ProductData {
  id: string;
  name: string;
  category: string;
  price: string;
  cost: string;
  stock: string;
  supplier: string;
  description: string;
  status: string;
  rowIndex: number;
}

interface EditProductFormProps {
  product: ProductData;
  onProductUpdated: () => void;
  onCancel: () => void;
}

export function EditProductForm({ product, onProductUpdated, onCancel }: EditProductFormProps) {
  const [formData, setFormData] = useState<ProductData>(product);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleInputChange = (field: keyof ProductData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      setError('Valid price is required');
      return false;
    }
    
    if (!formData.cost || isNaN(parseFloat(formData.cost))) {
      setError('Valid cost is required');
      return false;
    }
    
    if (!formData.stock || isNaN(parseInt(formData.stock))) {
      setError('Valid stock quantity is required');
      return false;
    }
    
    if (!formData.supplier.trim()) {
      setError('Supplier is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Prepare data for Google Sheets update
      const productData = [
        [
          formData.id,
          formData.name,
          formData.category,
          parseFloat(formData.price).toString(),
          parseFloat(formData.cost).toString(),
          parseInt(formData.stock).toString(),
          formData.supplier,
          formData.status,
          formData.description
        ]
      ];
      
      // Update the specific row in Products sheet
      // rowIndex + 2 because:
      // - rowIndex is 0-based from our data mapping
      // - +1 to skip header row
      // - +1 because Google Sheets is 1-based indexing
      const range = `Products!A${formData.rowIndex + 2}:I${formData.rowIndex + 2}`;
      await updateSheetRange('Products', range, productData);
      
      setSuccess(true);
      
      // Call callback
      setTimeout(() => {
        onProductUpdated();
      }, 1000);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to update product: ' + (error.message || 'Unknown error'));
      console.error('Product update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Edit className="mr-2 h-5 w-5" />
              Edit Product
            </CardTitle>
            <CardDescription>
              Update product details
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="flex items-center p-3 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 rounded-md">
              <Package className="h-4 w-4 mr-2" />
              Product updated successfully!
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="productId"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="Product ID"
                  className="pl-10"
                  readOnly
                />
              </div>

            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <div className="relative">
                <Package className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="productName"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Enter category"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  placeholder="Enter supplier name"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price (TSh) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Purchase Cost (TSh) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="0"
                min="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Updating Product...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Product
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}