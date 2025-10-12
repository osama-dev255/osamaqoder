import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSheetData, addStockThroughPurchases } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  unit: string;
  price: number;
  location: string;
  supplier: string;
  lastUpdated: string;
  status: string;
}

interface PurchaseItem {
  id: string;
  productName: string;
  quantity: number | null; // Allow null for validation purposes
  cost: number | null; // Allow null for validation purposes
  supplier: string; // Add supplier field
  location: string; // Add location field
  purchasedBy: string; // Add purchased by field
}

// Custom searchable dropdown component with Radix UI theme
function SearchableProductSelect({
  products,
  value,
  onValueChange,
  placeholder = "Select product"
}: {
  products: InventoryProduct[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.searchable-select')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Find selected product details for display
  const selectedProduct = products.find(p => p.name === value);

  return (
    <div className="searchable-select w-full">
      <div 
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 truncate">
          {value ? (
            <div>
              <div className="font-medium truncate">{value}</div>
              {selectedProduct && (
                <div className="text-xs text-gray-600 truncate">
                  Stock: {selectedProduct.currentStock} | Location: {selectedProduct.location}
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <span className="ml-2 text-gray-500">▼</span>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
          <div className="p-2 border-b border-border">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          
          <div className="py-1 max-h-48 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    onValueChange(product.name);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-gray-600">
                      ID: {product.id} | Category: {product.category} | Stock: {product.currentStock}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 ml-2">
                    {product.location}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-600 text-center">No products found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AddPurchaseForm({ onPurchaseAdded }: { onPurchaseAdded?: () => void }) {
  const [inventoryProducts, setInventoryProducts] = useState<InventoryProduct[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([
    { id: '1', productName: '', quantity: null, cost: null, supplier: '', location: '', purchasedBy: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch inventory products when component mounts
  useEffect(() => {
    const fetchInventoryProducts = async () => {
      try {
        const response = await getSheetData('Inventory');
        if (response && response.data && response.data.values) {
          const rows = response.data.values;
          // Skip header row and map the data to inventory product objects
          const inventoryData = rows.slice(1).map((row: any[], index: number) => ({
            id: row[0] || `${index + 1}`,
            name: row[1] || 'Unknown Product',
            category: row[2] || 'Uncategorized',
            currentStock: parseInt(row[3]) || 0,
            reorderLevel: parseInt(row[4]) || 0,
            maxStock: parseInt(row[5]) || 0,
            unit: row[6] || 'Unit',
            price: parseFloat(row[7]) || 0,
            location: row[8] || 'Unknown',
            supplier: row[9] || 'Unknown Supplier',
            lastUpdated: row[10] || 'Unknown',
            status: row[11] || 'Unknown'
          }));
          setInventoryProducts(inventoryData);
        }
      } catch (err) {
        console.error('Failed to fetch inventory products:', err);
      }
    };

    fetchInventoryProducts();
  }, []);

  const addPurchaseItem = () => {
    setPurchaseItems([
      ...purchaseItems,
      { id: Date.now().toString(), productName: '', quantity: null, cost: null, supplier: '', location: '', purchasedBy: '' }
    ]);
  };

  const removePurchaseItem = (id: string) => {
    if (purchaseItems.length > 1) {
      setPurchaseItems(purchaseItems.filter(item => item.id !== id));
    }
  };

  const updatePurchaseItem = (id: string, field: keyof PurchaseItem, value: string | number | null) => {
    setPurchaseItems(purchaseItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddStock = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Check for any items with missing fields and provide specific error
      const invalidItems = purchaseItems.filter(item => 
        !item.productName || 
        item.quantity === null || 
        item.quantity === undefined || 
        isNaN(item.quantity) || 
        item.quantity <= 0 || 
        !item.supplier || 
        item.cost === null || 
        item.cost === undefined || 
        isNaN(item.cost) || 
        item.cost < 0
      );
      
      if (invalidItems.length > 0) {
        const missingFields: string[] = [];
        invalidItems.forEach(item => {
          const missing: string[] = [];
          if (!item.productName) missing.push('product');
          if (item.quantity === null || item.quantity === undefined) {
            missing.push('quantity (required)');
          } else if (isNaN(item.quantity)) {
            missing.push('quantity (invalid number)');
          } else if (item.quantity <= 0) {
            missing.push('quantity (must be positive)');
          }
          if (item.cost === null || item.cost === undefined) {
            missing.push('cost (required)');
          } else if (isNaN(item.cost)) {
            missing.push('cost (invalid number)');
          } else if (item.cost < 0) {
            missing.push('cost (must be positive)');
          }
          if (!item.supplier) missing.push('supplier');
          missingFields.push(`Item "${item.productName || 'unnamed'}": missing ${missing.join(', ')}`);
        });
        throw new Error(`Please fill all required fields: ${missingFields.join('; ')}`);
      }
      
      // Prepare purchase data (all items are valid at this point)
      const purchases = purchaseItems.map(item => ({
        productName: item.productName,
        quantity: item.quantity!, // We've already validated it's not null
        cost: item.cost!, // We've already validated it's not null
        supplier: item.supplier, // Include supplier field
        location: item.location, // Include location field
        purchasedBy: item.purchasedBy // Include purchased by field
      }));
      
      // Add stock through purchases
      await addStockThroughPurchases(purchases);
      
      setSuccess(true);
      // Reset form
      setPurchaseItems([{ id: '1', productName: '', quantity: null, cost: null, supplier: '', location: '', purchasedBy: '' }]);
      
      // Call the callback function to refresh purchases data
      if (onPurchaseAdded) {
        onPurchaseAdded();
      }
      
      // Refresh inventory data
      const response = await getSheetData('Inventory');
      if (response && response.data && response.data.values) {
        const rows = response.data.values;
        const inventoryData = rows.slice(1).map((row: any[], index: number) => ({
          id: row[0] || `${index + 1}`,
          name: row[1] || 'Unknown Product',
          category: row[2] || 'Uncategorized',
          currentStock: parseInt(row[3]) || 0,
          reorderLevel: parseInt(row[4]) || 0,
          maxStock: parseInt(row[5]) || 0,
          unit: row[6] || 'Unit',
          price: parseFloat(row[7]) || 0,
          location: row[8] || 'Unknown',
          supplier: row[9] || 'Unknown Supplier',
          lastUpdated: row[10] || 'Unknown',
          status: row[11] || 'Unknown'
        }));
        setInventoryProducts(inventoryData);
      }
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
              <div className="md:col-span-4">
                <Label htmlFor={`product-${item.id}`}>Product</Label>
                <SearchableProductSelect
                  products={inventoryProducts}
                  value={item.productName}
                  onValueChange={(value) => updatePurchaseItem(item.id, 'productName', value)}
                  placeholder="Select product"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                <Input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity === null ? '' : item.quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Preserve empty string as null to properly validate required field
                    const quantityValue = value === '' ? null : parseInt(value);
                    updatePurchaseItem(item.id, 'quantity', quantityValue);
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`cost-${item.id}`}>Unit Cost</Label>
                <Input
                  id={`cost-${item.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.cost === null ? '' : item.cost}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Preserve empty string as null to properly validate required field
                    const costValue = value === '' ? null : parseFloat(value);
                    updatePurchaseItem(item.id, 'cost', costValue);
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`supplier-${item.id}`}>Supplier</Label>
                <Input
                  id={`supplier-${item.id}`}
                  value={item.supplier}
                  onChange={(e) => updatePurchaseItem(item.id, 'supplier', e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`location-${item.id}`}>Location</Label>
                <Input
                  id={`location-${item.id}`}
                  value={item.location}
                  onChange={(e) => updatePurchaseItem(item.id, 'location', e.target.value)}
                  placeholder="Enter location"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`purchasedBy-${item.id}`}>Purchased By</Label>
                <Input
                  id={`purchasedBy-${item.id}`}
                  value={item.purchasedBy}
                  onChange={(e) => updatePurchaseItem(item.id, 'purchasedBy', e.target.value)}
                  placeholder="Enter purchaser name"
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
