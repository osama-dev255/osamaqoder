import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface PrintReceiptProps {
  data: {
    id: string;
    date: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
  };
}

export function PrintReceipt({ data }: PrintReceiptProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = componentRef.current;
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <>
      <Button onClick={handlePrint} className="flex items-center gap-2">
        <Printer className="h-4 w-4" />
        Print Receipt
      </Button>

      <div ref={componentRef} className="hidden">
        <div className="p-4 max-w-xs">
          <div className="text-center border-b pb-2 mb-2">
            <h2 className="text-lg font-bold">POS Store</h2>
            <p className="text-sm">123 Main Street</p>
            <p className="text-sm">City, State 12345</p>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm">
              <span>Receipt #: {data.id}</span>
              <span>{data.date}</span>
            </div>
          </div>
          
          <div className="border-t border-b py-2 my-2">
            {data.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm mb-1">
                <div>
                  <span>{item.name}</span>
                  <span className="ml-2">x{item.quantity}</span>
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(data.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatCurrency(data.tax)}</span>
            </div>
            <div className="flex justify-between font-bold mt-1 pt-1 border-t">
              <span>Total:</span>
              <span>{formatCurrency(data.total)}</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs">
            <p>Payment Method: {data.paymentMethod}</p>
            <p className="mt-2">Thank you for your purchase!</p>
          </div>
        </div>
      </div>
    </>
  );
}