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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Clock,
  Building
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface SupplierPerformance {
  id: string;
  name: string;
  totalPurchases: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  onTimeDelivery: number; // Percentage
  qualityRating: number; // 1-5 scale
  status: 'active' | 'inactive' | 'preferred';
}

export function SupplierPerformanceTracker() {
  const [suppliers, setSuppliers] = useState<SupplierPerformance[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierPerformance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSupplierPerformance();
  }, []);

  const fetchSupplierPerformance = async () => {
    try {
      setLoading(true);
      
      // Fetch purchases data to analyze supplier performance
      const purchasesResponse = await getSheetData('Purchases');
      
      if (purchasesResponse && purchasesResponse.data && purchasesResponse.data.values) {
        const purchaseRows = purchasesResponse.data.values.slice(1, 101); // Limit to first 100 records
        
        // Group purchases by supplier
        const supplierMap = new Map<string, any[]>();
        
        purchaseRows.forEach((row: any[]) => {
          const supplier = row[10] || 'Unknown Supplier'; // Supplier column
          if (!supplierMap.has(supplier)) {
            supplierMap.set(supplier, []);
          }
          supplierMap.get(supplier)?.push(row);
        });
        
        
        // Calculate performance metrics for each supplier
        const supplierPerformance: SupplierPerformance[] = [];
        
        supplierMap.forEach((purchases, supplierName) => {
          const totalPurchases = purchases.length;
          const totalSpent = purchases.reduce((sum, row) => {
            const amount = parseFloat(row[8]?.replace('TSh', '').replace(/,/g, '')) || 0; // Amount column
            return sum + amount;
          }, 0);
          
          const averageOrderValue = totalPurchases > 0 ? totalSpent / totalPurchases : 0;
          
          // Get the most recent order date
          const dates = purchases
            .map(row => new Date(row[2])) // Date column
            .filter(date => !isNaN(date.getTime()));
          
          const lastOrderDate = dates.length > 0 
            ? dates.reduce((latest, current) => latest > current ? latest : current)
            : new Date();
          
          // Simulate on-time delivery and quality ratings for demo
          const onTimeDelivery = Math.floor(Math.random() * 20) + 80; // 80-100%
          const qualityRating = parseFloat((Math.random() * 2 + 3).toFixed(1)); // 3.0-5.0
          
          // Determine status based on performance
          let status: 'active' | 'inactive' | 'preferred' = 'active';
          if (totalPurchases > 10 && onTimeDelivery > 90 && qualityRating > 4.0) {
            status = 'preferred';
          } else if (totalPurchases === 0) {
            status = 'inactive';
          }
          
          supplierPerformance.push({
            id: `supplier-${supplierName.replace(/\s+/g, '-')}`,
            name: supplierName,
            totalPurchases,
            totalSpent,
            averageOrderValue,
            lastOrderDate: lastOrderDate.toLocaleDateString(),
            onTimeDelivery,
            qualityRating,
            status
          });
        });
        
        // Sort by total spent (descending)
        supplierPerformance.sort((a, b) => b.totalSpent - a.totalSpent);
        
        setSuppliers(supplierPerformance);
        setFilteredSuppliers(supplierPerformance);
      }
      
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to fetch supplier performance data: ' + (error.message || 'Unknown error'));
      console.error('Supplier performance fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = suppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || supplier.status === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredSuppliers(filtered);
  }, [searchTerm, filter, suppliers]);

  // Calculate summary statistics
  const totalSuppliers = suppliers.length;
  const preferredSuppliers = suppliers.filter(s => s.status === 'preferred').length;
  const totalSpent = suppliers.reduce((sum, s) => sum + s.totalSpent, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading supplier performance data...</div>
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
          <Building className="mr-2 h-5 w-5" />
          Supplier Performance Tracking
        </CardTitle>
        <CardDescription>
          Monitor and evaluate supplier performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Building className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSuppliers}</div>
              <p className="text-xs text-gray-600">Active suppliers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preferred Suppliers</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{preferredSuppliers}</div>
              <p className="text-xs text-gray-600">Top performers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
              <p className="text-xs text-gray-600">On supplier purchases</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search suppliers..."
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
                All Suppliers
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('active')}>
                Active Suppliers
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('preferred')}>
                Preferred Suppliers
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('inactive')}>
                Inactive Suppliers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Performance Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Purchases</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="text-right">Avg Order</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="text-right">On-Time %</TableHead>
              <TableHead className="text-right">Quality</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <div className="font-medium">{supplier.name}</div>
                </TableCell>
                <TableCell className="text-right">{supplier.totalPurchases}</TableCell>
                <TableCell className="text-right">{formatCurrency(supplier.totalSpent)}</TableCell>
                <TableCell className="text-right">{formatCurrency(supplier.averageOrderValue)}</TableCell>
                <TableCell>{supplier.lastOrderDate}</TableCell>
                <TableCell className="text-right">
                  <div className={`font-medium ${supplier.onTimeDelivery >= 90 ? 'text-green-500' : supplier.onTimeDelivery >= 80 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {supplier.onTimeDelivery}%
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <span className={`font-medium ${supplier.qualityRating >= 4.5 ? 'text-green-500' : supplier.qualityRating >= 3.5 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {supplier.qualityRating}
                    </span>
                    <span className="text-gray-600 ml-1">/5</span>
                  </div>
                </TableCell>
                <TableCell>
                  {supplier.status === 'preferred' ? (
                    <Badge variant="default" className="bg-green-500">
                      Preferred
                    </Badge>
                  ) : supplier.status === 'active' ? (
                    <Badge variant="secondary">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <Building className="h-12 w-12 mx-auto mb-4" />
            <p>No suppliers found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}