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
import { AddPurchaseForm } from '@/components/AddPurchaseForm';

export function Purchases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        // Fetch purchases data from the Purchases sheet
        const response = await getSheetData('Purchases');
        
        if (response && response.data && response.data.values) {
          const rows = response.data.values;
          
          // Skip header row and map the data to purchase objects
          const purchaseData = rows.slice(1, 51).map((row: any[], index: number) => ({
            id: row[0] || `${index + 1}`, // ID
            receiptNo: row[1] || 'N/A', // Receipt Number
            date: row[2] || 'Unknown Date', // Date (TAREHE)
            time: row[3] || 'Unknown Time', // Time (MUDA)
            category: row[4] || 'Uncategorized', // Category (KUNDI)
            product: row[5] || 'Unknown Product', // Product (BIDHAA)
            price: parseFloat(row[6]?.replace('TSh', '').replace(/,/g, '')) || 0, // Price (BEI1)
            quantity: parseInt(row[7]) || 0, // Quantity (IDADI)
            amount: parseFloat(row[8]?.replace('TSh', '').replace(/,/g, '')) || 0, // Amount (KIASI)
            status: 'completed' // Default status
          }));
          
          setPurchases(purchaseData);
        }
        
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch purchases: ' + (error.message || 'Unknown error'));
        console.error('Purchases fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          purchase.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          purchase.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || purchase.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Purchases</h2>
          <p className="text-muted-foreground">
            Loading purchase records...
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading purchases...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Purchases</h2>
          <p className="text-muted-foreground">
            Manage your purchase records
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
        <h2 className="text-2xl font-bold tracking-tight">Purchases</h2>
        <p className="text-muted-foreground">
          Manage your purchase records and supplier transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Purchase Records</CardTitle>
              <CardDescription>
                View and manage your purchase transactions
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search purchases..."
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
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AddPurchaseForm />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No.</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>
                    <div className="font-medium">#{purchase.receiptNo}</div>
                  </TableCell>
                  <TableCell>
                    <div>{purchase.date}</div>
                    <div className="text-sm text-muted-foreground">{purchase.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{purchase.product}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{purchase.category}</Badge>
                  </TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>{formatCurrency(purchase.price)}</TableCell>
                  <TableCell>{formatCurrency(purchase.amount)}</TableCell>
                  <TableCell>
                    {purchase.status === 'completed' && <Badge variant="default">Completed</Badge>}
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