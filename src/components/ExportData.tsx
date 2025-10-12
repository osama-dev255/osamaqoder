import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileJson, FileText } from 'lucide-react';
import { exportSheetsData } from '@/services/apiService';
import { useToast } from '@/components/ui/use-toast';

interface ExportDataProps {
  className?: string;
}

export function ExportData({ className = '' }: ExportDataProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setIsExporting(true);
      
      const response = await exportSheetsData(format);
      
      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pos-export.${format}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: `Data exported as ${format.toUpperCase()} successfully.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv')}
        disabled={isExporting}
        className="flex items-center"
      >
        <FileText className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('json')}
        disabled={isExporting}
        className="flex items-center"
      >
        <FileJson className="h-4 w-4 mr-2" />
        Export JSON
      </Button>
    </div>
  );
}