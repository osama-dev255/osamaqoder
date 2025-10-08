import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { RefreshCw, Download } from 'lucide-react';
import { getSpreadsheetMetadata } from '@/services/apiService';
import type { SpreadsheetMetadata } from '@/types';

export function Metadata() {
  const [metadata, setMetadata] = useState<SpreadsheetMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const response = await getSpreadsheetMetadata();
      if (response && response.data) {
        setMetadata(response.data);
      }
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to fetch metadata: ' + (error.message || 'Unknown error'));
      console.error('Metadata fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMetadata();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Spreadsheet Metadata</h2>
        <p className="text-muted-foreground">
          Detailed information about your spreadsheet
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Spreadsheet Information</h3>
          <p className="text-sm text-muted-foreground">
            Details about your Google Sheets document
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading metadata...</div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="text-red-500">{error}</div>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : metadata ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spreadsheet Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title</span>
                  <span className="font-medium">{metadata.title || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spreadsheet ID</span>
                  <span className="font-medium text-sm">{metadata.spreadsheetId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Locale</span>
                  <span className="font-medium">{metadata.locale || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone</span>
                  <span className="font-medium">{metadata.timeZone || 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Sheets</span>
                  <span className="font-medium">{metadata.sheets?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium text-sm">
                    {metadata.properties?.modifiedTime 
                      ? new Date(metadata.properties.modifiedTime).toLocaleString() 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Sheets Information</CardTitle>
                  <CardDescription>
                    Details about each sheet in the spreadsheet
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sheet Name</TableHead>
                    <TableHead>Sheet ID</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Columns</TableHead>
                    <TableHead>Hidden</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadata.sheets?.map((sheet, index) => (
                    <TableRow key={sheet.sheetId || index}>
                      <TableCell className="font-medium">{sheet.title || 'Untitled Sheet'}</TableCell>
                      <TableCell>{sheet.sheetId}</TableCell>
                      <TableCell>{sheet.gridProperties?.rowCount || 0}</TableCell>
                      <TableCell>{sheet.gridProperties?.columnCount || 0}</TableCell>
                      <TableCell>
                        {sheet.properties?.hidden ? (
                          <Badge variant="destructive">Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No metadata available
          </CardContent>
        </Card>
      )}
    </div>
  );
}