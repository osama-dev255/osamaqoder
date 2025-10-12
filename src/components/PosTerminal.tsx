import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Delete, 
  CreditCard, 
  ShoppingCart
} from 'lucide-react';
import { PrintReceipt } from '@/components/PrintReceipt';
import { getSheetData, updateInventoryQuantities, recordSales } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  discount: number; // Discount amount for this item
  notes: string; // Notes/comments for this item
  priceOverride: number | null; // Special price override
}

export function PosTerminal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taxRate] = useState(18);
  const [amountReceived, setAmountReceived] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from the dedicated Products sheet
        const response = await getSheetData('Products');
        
        if (response && response.data && response.data.values) {
          const rows = response.data.values;
          
          // If the sheet is empty, initialize with sample data
          if (rows.length === 0) {
            const productData = [
              {
                id: '1',
                name: 'COKE 600MLS 12S/W NP',
                price: 9700,
                stock: 100,
                category: 'PET'
              }
            ];
            setProducts(productData);
          } else {
            // Skip header row and map the data to product objects
            // Using selling price (column 3) for POS transactions
            const productData = rows.slice(1).map((row: any[], index: number) => ({
              id: row[0] || `${index + 1}`, // ID
              name: row[1] || 'Unknown Product', // Product Name
              price: parseFloat(row[3]) || 0, // Selling Price (column 3)
              stock: parseInt(row[5]) || 0, // Stock Quantity (column 5)
              category: row[2] || 'Uncategorized' // Category (column 2)
            }));
            
            setProducts(productData);
          }
        } else {
          // Initialize with sample data if no data is returned
          const sampleProducts = [
            {
              id: '1',
              name: 'COKE 600MLS 12S/W NP',
              price: 9700,
              stock: 100,
              category: 'PET'
            },
            {
              id: '2',
              name: 'SPRITE 600ML 12 S/W NP',
              price: 9700,
              stock: 85,
              category: 'PET'
            },
            {
              id: '3',
              name: 'SPAR PINENUT 350ML 24 RB',
              price: 12800,
              stock: 42,
              category: 'RGB'
            },
            {
              id: '4',
              name: 'SPRITE 350MLS CR24 RB',
              price: 12800,
              stock: 28,
              category: 'RGB'
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

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { 
          product, 
          quantity: 1,
          discount: 0,
          notes: '',
          priceOverride: null
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // New function to update discount for an item
  const updateDiscount = (productId: string, discount: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, discount: Math.max(0, discount) } 
          : item
      )
    );
  };

  // New function to update notes for an item
  const updateNotes = (productId: string, notes: string) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, notes } 
          : item
      )
    );
  };

  // New function to update price override for an item
  const updatePriceOverride = (productId: string, price: number | null) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, priceOverride: price && price > 0 ? price : null } 
          : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.priceOverride || item.product.price;
    const itemTotal = (price * item.quantity) - item.discount;
    return sum + Math.max(0, itemTotal); // Ensure we don't go negative
  }, 0);
  
  // Calculate tax (for display only, not included in total)
  const tax = subtotal * (taxRate / 100);
  
  // Total does NOT include tax (as per requirement)
  const total = subtotal;
  
  // Calculate change
  const receivedAmount = parseFloat(amountReceived) || 0;
  const change = receivedAmount - total;

  const handleCheckout = async () => {
    // Generate receipt data
    const receiptData = {
      id: `TXN-${Date.now()}`,
      date: new Date().toLocaleString(),
      items: cart.map(item => ({
        name: item.product.name,
        price: item.priceOverride || item.product.price,
        quantity: item.quantity,
        discount: item.discount,
        notes: item.notes
      })),
      subtotal,
      tax,
      total,
      paymentMethod: 'Credit Card',
      amountReceived: receivedAmount,
      change
    };

    // Update inventory quantities - decrease stock for sold items
    try {
      const inventoryUpdates = cart.map(item => ({
        productName: item.product.name,
        quantityChange: -item.quantity // Negative because we're reducing stock
      }));
      
      const response = await updateInventoryQuantities(inventoryUpdates);
      console.log('Inventory updated successfully', response);
      
      // Record sales in Sales sheet
      try {
        // Generate a unique receipt number
        const receiptNo = `R${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date();
        const currentDate = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' }); // YYYY-MM-DD format
        const currentTime = now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour12: false }); // HH:MM:SS format
        
        // Prepare sales data for each item in the cart
        const salesData = cart.map(item => {
          // Use the category from the product data (from column 2 in Products sheet)
          const category = item.product.category || 'General';
          const discount = item.discount || 0;
          const soldBy = 'Cashier'; // This could be dynamic based on user
          const status = 'completed';
          
          return {
            id: `TXN-${Date.now()}-${item.product.id}`, // Unique ID for each sale item
            receiptNo, // RECEIPT NO.
            date: currentDate, // DATE
            time: currentTime, // TIME
            category, // CARTEGORY
            product: item.product.name, // PRODUCT
            price: item.priceOverride || item.product.price, // PRICE (with override)
            discount, // Discount
            quantity: item.quantity, // QUANTITY
            totalAmount: (item.priceOverride || item.product.price) * item.quantity - discount, // TOTAL AMOUNT
            soldBy, // SOLD BY
            status, // STATUS
            amountReceived: receivedAmount, // AMOUNT RECEIVED
            change // CHANGE
          };
        });
        
        // Record the sales data through the backend API
        const salesResponse = await recordSales(salesData);
        console.log('Sales recorded successfully', salesResponse);
      } catch (salesError) {
        console.error('Failed to record sales:', salesError);
        // Don't fail the checkout if sales recording fails, just log it
      }
      
      // Show success message to user
      // In a real app, you might want to show a toast notification
    } catch (error) {
      console.error('Failed to update inventory:', error);
      // In a real app, you might want to show an error message to the user
      alert('Failed to update inventory. Please try again.');
    }

    // In a real app, you would process the payment here
    console.log('Processing payment...', receiptData);
    
    // Clear cart after checkout
    setCart([]);
    setAmountReceived(''); // Reset received amount
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading products...</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shopping Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-600">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                <p>Loading cart...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="text-red-500">{error}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Shopping Cart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-600">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                <p className="text-red-500">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Product Selection */}
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Products</CardTitle>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                      </div>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </Badge>
                    </div>
                    <Button 
                      className="w-full mt-3" 
                      size="sm"
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Shopping Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                <p>Your cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.product.id}>
                        <TableCell>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} × {formatCurrency(item.price)}
                          </div>
                          {/* Discount input */}
                          <div className="flex items-center mt-1">
                            <span className="text-xs mr-1">Disc:</span>
                            <Input
                              type="number"
                              value={item.discount}
                              onChange={(e) => updateDiscount(item.product.id, parseFloat(e.target.value) || 0)}
                              className="w-20 text-xs h-6"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                          {/* Price override input */}
                          <div className="flex items-center mt-1">
                            <span className="text-xs mr-1">Price:</span>
                            <Input
                              type="number"
                              value={item.priceOverride || ''}
                              onChange={(e) => updatePriceOverride(item.product.id, parseFloat(e.target.value) || null)}
                              className="w-20 text-xs h-6"
                              placeholder="Override"
                              min="0"
                            />
                          </div>
                          {/* Notes input */}
                          <div className="mt-1">
                            <Input
                              type="text"
                              value={item.notes}
                              onChange={(e) => updateNotes(item.product.id, e.target.value)}
                              className="w-full text-xs h-6"
                              placeholder="Notes"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {/* Manual quantity input */}
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center h-8"
                              min="1"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency((item.priceOverride || item.product.price) * item.quantity - item.discount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Delete className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({taxRate}%):</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total (excl. tax):</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  {/* Received amount input */}
                  <div className="flex justify-between items-center pt-2">
                    <span>Amount Received:</span>
                    <Input
                      type="number"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="w-32 h-8 text-right"
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                  {/* Change calculation */}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Change:</span>
                    <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(change)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <PrintReceipt data={{
                    id: `TXN-${Date.now()}`,
                    date: new Date().toLocaleString(),
                    items: cart.map(item => ({
                      name: item.product.name,
                      price: item.priceOverride || item.product.price,
                      quantity: item.quantity,
                      discount: item.discount,
                      notes: item.notes
                    })),
                    subtotal,
                    tax,
                    total,
                    paymentMethod: 'Credit Card',
                    amountReceived: receivedAmount,
                    change
                  }} />
                  <Button 
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={!amountReceived || parseFloat(amountReceived) <= 0 || change < 0} // Disable if no amount or insufficient payment
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}