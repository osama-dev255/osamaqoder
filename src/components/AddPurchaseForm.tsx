import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSheetData, addStockThroughPurchases } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  currentStock: number;
  unitCost: number;
}

interface PurchaseItem {
  id: string;
  productName: string;
  quantity: number;
  cost: number;
}

export function AddPurchaseForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    { id: '1', productName: '', quantity: 1, cost: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch products when component mounts
  useState(() => {
    const fetchProducts = async () => {
      try {
        const response = await getSheetData('Products');
        if (response && response.data && response.data.values) {
          const rows = response.data.values;
          const productData = rows.slice(1).map((row: any[], index: number) => ({
            id: row[0] || `${index + 1}`,
            name: row[1] || 'Unknown Product',
            currentStock: parseInt(row[5]) || 0,
            unitCost: parseFloat(row[4]) || 0
          }));
          setProducts(productData);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  });

  const addPurchaseItem = () => {
    setPurchaseItems([
      ...purchaseItems,
      { id: Date.now().toString(), productName: '', quantity: 1, cost: 0 }
    ]);
  };

  const removePurchaseItem = (id: string) => {
    if (purchaseItems.length > 1) {
      setPurchaseItems(purchaseItems.filter(item => item.id !== id));
    }
  };

  const updatePurchaseItem = (id: string, field: keyof PurchaseItem, value: string | number) => {
    setPurchaseItems(purchaseItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddStock = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validate inputs
      const validItems = purchaseItems.filter(item => 
        item.productName && item.quantity > 0 && item.cost >= 0
      );
      
      if (validItems.length === 0) {
        throw new Error('Please add at least one valid purchase item');
      }
      
      // Prepare purchase data
      const purchases = validItems.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        cost: item.cost
      }));
      
      // Add stock through purchases
      await addStockThroughPurchases(purchases);
      
      setSuccess(true);
      // Reset form
      setPurchaseItems([{ id: '1', productName: '', quantity: 1, cost: 0 }]);
      
      // In a real app, you might want to refresh the inventory data
    } catch (err: any) {
      setError(err.message || 'Failed to add stock');
      console.error('Failed to add stock:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Stock Through Purchase</CardTitle>
        <CardDescription>
          Increase inventory levels by recording new purchases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchaseItems.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5">
                <Label htmlFor={`product-${item.id}`}>Product</Label>
                <Select 
                  value={item.productName} 
                  onValueChange={(value) => updatePurchaseItem(item.id, 'productName', value)}
                >
                  <SelectTrigger id={`product-${item.id}`}>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.name}>
                        {product.name} (Current: {product.currentStock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                <Input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updatePurchaseItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor={`cost-${item.id}`}>Unit Cost</Label>
                <Input
                  id={`cost-${item.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.cost}
                  onChange={(e) => updatePurchaseItem(item.id, 'cost', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Total Cost</Label>
                <div className="font-medium">
                  {formatCurrency((item.quantity || 0) * (item.cost || 0))}
                </div>
              </div>
              {purchaseItems.length > 1 && (
                <div className="md:col-span-12">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removePurchaseItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={addPurchaseItem} variant="outline">
              Add Another Item
            </Button>
            <Button onClick={handleAddStock} disabled={loading}>
              {loading ? 'Processing...' : 'Add Stock'}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-500 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-500 p-2 bg-green-50 rounded">
              Stock added successfully!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}