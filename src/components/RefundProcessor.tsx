import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Receipt, 
  CreditCard, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface RefundItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function RefundProcessor() {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [refundItems, setRefundItems] = useState<RefundItem[]>([]);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearchReceipt = () => {
    // In a real app, this would search for the receipt in the database
    // For demo purposes, we'll simulate finding a receipt
    if (!receiptNumber.trim()) {
      setError('Please enter a receipt number');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setSearchResult({
        id: receiptNumber,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        customer: 'John Smith',
        totalAmount: 45000,
        paymentMethod: 'Cash',
        items: [
          { id: '1', productName: 'COKE 600MLS 12S/W NP', quantity: 2, unitPrice: 9700, totalPrice: 19400 },
          { id: '2', productName: 'SPRITE 600ML 12 S/W NP', quantity: 1, unitPrice: 9700, totalPrice: 9700 },
          { id: '3', productName: 'SPAR PINENUT 350ML 24 RB', quantity: 1, unitPrice: 12800, totalPrice: 12800 },
          { id: '4', productName: 'SPRITE 350MLS CR24 RB', quantity: 1, unitPrice: 12800, totalPrice: 12800 },
        ]
      });
      setError(null);
    }, 500);
  };

  const handleItemRefundToggle = (item: RefundItem) => {
    const existingIndex = refundItems.findIndex(refundItem => refundItem.id === item.id);
    
    if (existingIndex >= 0) {
      // Remove item from refund
      const newRefundItems = [...refundItems];
      newRefundItems.splice(existingIndex, 1);
      setRefundItems(newRefundItems);
    } else {
      // Add item to refund
      setRefundItems([...refundItems, item]);
    }
  };

  const calculateRefundAmount = () => {
    const total = refundItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setRefundAmount(total);
    return total;
  };

  const handleProcessRefund = () => {
    if (refundItems.length === 0) {
      setError('Please select at least one item to refund');
      return;
    }
    
    if (!refundReason.trim()) {
      setError('Please provide a reason for the refund');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate refund processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Refund of ${formatCurrency(refundAmount)} processed successfully!`);
      
      // Reset form
      setReceiptNumber('');
      setSearchResult(null);
      setRefundItems([]);
      setRefundReason('');
      setRefundAmount(0);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Process Refund</h2>
        <p className="text-gray-600">
          Process customer refunds and returns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Find Receipt
          </CardTitle>
          <CardDescription>
            Enter receipt number to begin refund process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="receiptNumber">Receipt Number</Label>
              <div className="flex gap-2">
                <Input
                  id="receiptNumber"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="Enter receipt number"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchReceipt()}
                />
                <Button onClick={handleSearchReceipt}>Search</Button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {searchResult && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="mr-2 h-5 w-5" />
                Receipt Details
              </CardTitle>
              <CardDescription>
                Transaction #{searchResult.id} - {searchResult.date} at {searchResult.time}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{searchResult.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{searchResult.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-lg">{formatCurrency(searchResult.totalAmount)}</p>
                </div>
              </div>
              
              <div className="border rounded-md">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Product</th>
                      <th className="text-right p-3 text-sm font-medium">Qty</th>
                      <th className="text-right p-3 text-sm font-medium">Price</th>
                      <th className="text-right p-3 text-sm font-medium">Total</th>
                      <th className="text-center p-3 text-sm font-medium">Refund</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResult.items.map((item: any) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-3">{item.productName}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-3 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                        <td className="p-3 text-center">
                          <Input
                            type="checkbox"
                            checked={refundItems.some(refundItem => refundItem.id === item.id)}
                            onChange={() => handleItemRefundToggle(item)}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {refundItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Refund Summary
                </CardTitle>
                <CardDescription>
                  Review refund details before processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="refundReason">Reason for Refund</Label>
                  <Textarea
                    id="refundReason"
                    value={refundReason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRefundReason(e.target.value)}
                    placeholder="Enter reason for refund (e.g., defective product, customer dissatisfaction)"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">Refund Amount</p>
                    <p className="text-sm text-gray-600">
                      {refundItems.length} item{refundItems.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(calculateRefundAmount())}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleProcessRefund} 
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Process Refund
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRefundItems([]);
                      setRefundReason('');
                      setRefundAmount(0);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!searchResult && !error && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-gray-600">
              <Receipt className="h-12 w-12 mx-auto mb-2" />
              <p>Enter a receipt number to begin processing a refund</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}