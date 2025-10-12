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
  Filter,
  FileText,
  Calendar,
  User,
  Package
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

interface AuditRecord {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  product: string;
  oldValue: string;
  newValue: string;
  reason: string;
  reference: string;
}

export function InventoryAuditTrail() {
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AuditRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditTrail();
  }, []);

  const fetchAuditTrail = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would have a dedicated audit trail sheet
      // For this demo, we'll simulate audit records based on existing data
      const [purchasesResponse, salesResponse, inventoryResponse] = await Promise.all([
        getSheetData('Purchases'),
        getSheetData('Sales'),
        getSheetData('Inventory')
      ]);
      
      const auditData: AuditRecord[] = [];
      
      // Generate audit records from purchases
      if (purchasesResponse && purchasesResponse.data && purchasesResponse.data.values) {
        const purchaseRows = purchasesResponse.data.values.slice(1, 31); // Limit to first 30 records
        purchaseRows.forEach((row: any[], index: number) => {
          const productName = row[4] || 'Unknown Product';
          const quantity = parseInt(row[6]) || 0;
          const cost = parseFloat(row[7]?.replace('TSh', '').replace(/,/g, '')) || 0;
          
          if (quantity > 0) {
            auditData.push({
              id: `audit-purchase-${index}`,
              timestamp: `${row[2] || 'Unknown Date'} ${row[3] || 'Unknown Time'}`,
              user: 'System',
              action: 'Stock Added',
              product: productName,
              oldValue: 'N/A',
              newValue: `+${quantity} units @ ${formatCurrency(cost)}`,
              reason: 'Purchase',
              reference: `Receipt #${row[1] || 'N/A'}`
            });
          }
        });
      }
      
      // Generate audit records from sales
      if (salesResponse && salesResponse.data && salesResponse.data.values) {
        const salesRows = salesResponse.data.values.slice(1, 31); // Limit to first 30 records
        salesRows.forEach((row: any[], index: number) => {
          const productName = row[5] || 'Unknown Product';
          const quantity = parseInt(row[8]) || 0;
          const price = parseFloat(row[6]?.replace('TSh', '').replace(/,/g, '')) || 0;
          
          if (quantity > 0) {
            auditData.push({
              id: `audit-sale-${index}`,
              timestamp: `${row[2] || 'Unknown Date'} ${row[3] || 'Unknown Time'}`,
              user: row[10] || 'Unknown User', // Sold By
              action: 'Stock Removed',
              product: productName,
              oldValue: 'N/A',
              newValue: `-${quantity} units @ ${formatCurrency(price)}`,
              reason: 'Sale',
              reference: `Receipt #${row[1] || 'N/A'}`
            });
          }
        });
      }
      
      // Generate audit records from inventory updates
      if (inventoryResponse && inventoryResponse.data && inventoryResponse.data.values) {
        const inventoryRows = inventoryResponse.data.values.slice(1, 21); // Limit to first 20 records
        inventoryRows.forEach((row: any[], index: number) => {
          const productName = row[1] || 'Unknown Product';
          const lastUpdated = row[10] || 'Unknown Date';
          
          if (lastUpdated !== 'Unknown Date') {
            auditData.push({
              id: `audit-inventory-${index}`,
              timestamp: `${lastUpdated} 00:00:00`,
              user: 'System',
              action: 'Inventory Updated',
              product: productName,
              oldValue: 'N/A',
              newValue: `Stock level synchronized`,
              reason: 'System Update',
              reference: 'Inventory Sync'
            });
          }
        });
      }
      
      // Sort by timestamp (newest first)
      auditData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setAuditRecords(auditData);
      setFilteredRecords(auditData);
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to fetch audit trail: ' + (error.message || 'Unknown error'));
      console.error('Audit trail fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = auditRecords.filter(record => {
      const matchesSearch = record.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.user.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || record.action.toLowerCase().includes(filter);
      return matchesSearch && matchesFilter;
    });
    
    setFilteredRecords(filtered);
  }, [searchTerm, filter, auditRecords]);

  // Calculate summary statistics
  const totalRecords = auditRecords.length;
  const stockAdditions = auditRecords.filter(r => r.action === 'Stock Added').length;
  const stockRemovals = auditRecords.filter(r => r.action === 'Stock Removed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading audit trail...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Inventory Audit Trail
        </CardTitle>
        <CardDescription>
          Complete history of all inventory changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecords}</div>
              <p className="text-xs text-gray-600">Audit entries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Additions</CardTitle>
              <Package className="h-4 w-4 text-gray-500 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stockAdditions}</div>
              <p className="text-xs text-gray-600">Items received</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Removals</CardTitle>
              <Package className="h-4 w-4 text-gray-500 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stockRemovals}</div>
              <p className="text-xs text-gray-600">Items sold</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search audit records..."
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
              <DropdownMenuLabel>Filter by action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setFilter('all')}>
                All Actions
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('added')}>
                Stock Added
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('removed')}>
                Stock Removed
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('updated')}>
                Inventory Updated
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Audit Trail Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="font-medium">{record.timestamp}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    {record.user}
                  </div>
                </TableCell>
                <TableCell>
                  {record.action === 'Stock Added' ? (
                    <Badge variant="default" className="bg-green-500">
                      {record.action}
                    </Badge>
                  ) : record.action === 'Stock Removed' ? (
                    <Badge variant="default" className="bg-red-500">
                      {record.action}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {record.action}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{record.product}</div>
                </TableCell>
                <TableCell>
                  <div className={record.action === 'Stock Added' ? 'text-green-500' : record.action === 'Stock Removed' ? 'text-red-500' : ''}>
                    {record.newValue}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{record.reason}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">{record.reference}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No audit records found
          </div>
        )}
      </CardContent>
    </Card>
  );
}