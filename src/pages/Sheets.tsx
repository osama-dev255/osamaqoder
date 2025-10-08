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
import { Search, Download, Plus, Edit, Trash2 } from 'lucide-react';
import { getAllSheetsData } from '@/services/apiService';
import type { AllSheetsData } from '@/types';

export function Sheets() {
  const [sheets, setSheets] = useState<AllSheetsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true);
        const response = await getAllSheetsData();
        if (response && response.data) {
          setSheets(response.data);
        }
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch sheets data: ' + (error.message || 'Unknown error'));
        console.error('Sheets fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  // Convert sheets object to array for easier filtering
  const sheetsArray = Object.entries(sheets).map(([name, data]) => ({
    name,
    ...data
  }));

  const filteredSheets = sheetsArray.filter(sheet => 
    sheet.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sheets Management</h2>
        <p className="text-muted-foreground">
          Manage your Google Sheets data
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Sheets</CardTitle>
              <CardDescription>
                View and manage your spreadsheet sheets
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sheets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Sheet
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Loading sheets...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sheet Name</TableHead>
                  <TableHead>Range</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Columns</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSheets.length > 0 ? (
                  filteredSheets.map((sheet) => (
                    <TableRow key={sheet.name}>
                      <TableCell className="font-medium">{sheet.name}</TableCell>
                      <TableCell>{sheet.range}</TableCell>
                      <TableCell>{sheet.values?.length || 0}</TableCell>
                      <TableCell>{sheet.values?.[0]?.length || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No sheets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}