import { useState } from 'react';
import { PurchaseOrderForm } from '@/components/PurchaseOrderForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TestPurchaseOrderForm() {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleOrderCreated = () => {
    setShowForm(false);
    setMessage('Purchase order created successfully!');
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Form Test</CardTitle>
          <CardDescription>
            Test the purchase order form functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}
          
          {showForm ? (
            <PurchaseOrderForm 
              onOrderCreated={handleOrderCreated}
              onCancel={handleCancel}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Button onClick={() => setShowForm(true)}>
                Open Purchase Order Form
              </Button>
              <p className="mt-4 text-sm text-gray-600">
                Click the button above to test the purchase order form
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}