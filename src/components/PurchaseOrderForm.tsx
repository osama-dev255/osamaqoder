import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  Calendar,
  User,
  Building,
  Tag,
  Hash
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { appendSheetData } from '@/services/apiService';

interface PurchaseOrderItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PurchaseOrderFormProps {
  onOrderCreated: () => void;
  onCancel: () => void;
}

export function PurchaseOrderForm({ onOrderCreated, onCancel }: PurchaseOrderFormProps) {
  // Form state
  const [orderNumber, setOrderNumber] = useState('');
  const [supplier, setSupplier] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  
  // Items state
  const [items, setItems] = useState<PurchaseOrderItem[]>([
    { id: Date.now().toString(), product: '', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.18; // 18% tax
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  // Add new item row
  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), product: '', description: '', quantity: 1, unitPrice: 0, total: 0 }
    ]);
  };

  // Remove item row
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Update item field
  const updateItem = (id: string, field: keyof PurchaseOrderItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total when quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!orderNumber.trim()) {
      newErrors.orderNumber = 'Order number is required';
    }
    
    if (!supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }
    
    if (!expectedDelivery) {
      newErrors.expectedDelivery = 'Expected delivery date is required';
    }
    
    // Validate items
    items.forEach((item, index) => {
      if (!item.product.trim()) {
        newErrors[`item-${index}-product`] = 'Product is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item-${index}-unitPrice`] = 'Unit price must be greater than 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // Prepare data for Google Sheets
      // Header row
      const headerRow = [
        'Order Number', 'Supplier', 'Order Date', 'Expected Delivery', 'Status', 
        'Product', 'Description', 'Quantity', 'Unit Price', 'Total', 'Notes'
      ];
      
      // Data rows - one row per item
      const dataRows = items.map(item => [
        orderNumber,
        supplier,
        orderDate,
        expectedDelivery,
        status,
        item.product,
        item.description,
        item.quantity.toString(),
        item.unitPrice.toString(),
        item.total.toString(),
        notes
      ]);
      
      // Add to Purchase Orders sheet
      await appendSheetData('Purchase Orders', [headerRow, ...dataRows]);
      
      // Reset form
      setOrderNumber('');
      setSupplier('');
      setOrderDate(new Date().toISOString().split('T')[0]);
      setExpectedDelivery('');
      setStatus('pending');
      setNotes('');
      setItems([{ id: Date.now().toString(), product: '', description: '', quantity: 1, unitPrice: 0, total: 0 }]);
      
      // Notify parent component
      onOrderCreated();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Failed to create purchase order. Please try again.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Create Purchase Order
            </CardTitle>
            <CardDescription>
              Fill in the details for your new purchase order
            </CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="order-number" className="flex items-center">
              <Hash className="mr-2 h-4 w-4" />
              Order Number *
            </Label>
            <Input
              id="order-number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number"
              className={errors.orderNumber ? 'border-red-500' : ''}
            />
            {errors.orderNumber && <p className="text-sm text-red-500">{errors.orderNumber}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              Supplier *
            </Label>
            <Input
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Enter supplier name"
              className={errors.supplier ? 'border-red-500' : ''}
            />
            {errors.supplier && <p className="text-sm text-red-500">{errors.supplier}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order-date" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Order Date
            </Label>
            <Input
              id="order-date"
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expected-delivery" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Expected Delivery *
            </Label>
            <Input
              id="expected-delivery"
              type="date"
              value={expectedDelivery}
              onChange={(e) => setExpectedDelivery(e.target.value)}
              className={errors.expectedDelivery ? 'border-red-500' : ''}
            />
            {errors.expectedDelivery && <p className="text-sm text-red-500">{errors.expectedDelivery}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Order Items</h3>
            <Button onClick={addItem} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor={`product-${item.id}`}>Product *</Label>
                    <Input
                      id={`product-${item.id}`}
                      value={item.product}
                      onChange={(e) => updateItem(item.id, 'product', e.target.value)}
                      placeholder="Product name"
                      className={errors[`item-${index}-product`] ? 'border-red-500' : ''}
                    />
                    {errors[`item-${index}-product`] && <p className="text-sm text-red-500">{errors[`item-${index}-product`]}</p>}
                  </div>
                  
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor={`description-${item.id}`}>Description</Label>
                    <Textarea
                      id={`description-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Product description"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`quantity-${item.id}`}>Quantity *</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className={errors[`item-${index}-quantity`] ? 'border-red-500' : ''}
                    />
                    {errors[`item-${index}-quantity`] && <p className="text-sm text-red-500">{errors[`item-${index}-quantity`]}</p>}
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`unit-price-${item.id}`}>Unit Price *</Label>
                    <Input
                      id={`unit-price-${item.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className={errors[`item-${index}-unitPrice`] ? 'border-red-500' : ''}
                    />
                    {errors[`item-${index}-unitPrice`] && <p className="text-sm text-red-500">{errors[`item-${index}-unitPrice`]}</p>}
                  </div>
                  
                  <div className="md:col-span-1 space-y-2">
                    <Label>Total</Label>
                    <div className="pt-2 font-medium">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                  
                  <div className="md:col-span-1 flex items-end">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes or instructions"
          />
        </div>
        
        {/* Order Summary */}
        <Card className="bg-muted">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%):</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </CardFooter>
    </Card>
  );
}