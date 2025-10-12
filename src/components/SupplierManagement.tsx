import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Building,
  Phone,
  Mail,
  MapPin,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSheetData, appendSheetData, updateSheetRange } from '@/services/apiService';
import { formatCurrency } from '@/lib/currency';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    status: 'active',
    notes: ''
  });
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      // Fetch suppliers data from the Suppliers sheet
      const response = await getSheetData('Suppliers');
      
      if (response && response.data && response.data.values) {
        const rows = response.data.values;
        
        // Skip header row and map the data to supplier objects
        const supplierData = rows.slice(1).map((row: any[], index: number) => ({
          id: row[0] || `supplier-${index + 1}`, // ID
          name: row[1] || 'Unknown Supplier', // Supplier Name
          contactPerson: row[2] || '', // Contact Person
          email: row[3] || '', // Email
          phone: row[4] || '', // Phone
          address: row[5] || '', // Address
          city: row[6] || '', // City
          country: row[7] || '', // Country
          status: row[8] === 'inactive' ? 'inactive' : 'active', // Status
          notes: row[9] || '', // Notes
          createdAt: row[10] || new Date().toISOString(), // Created At
          updatedAt: row[11] || new Date().toISOString() // Updated At
        }));
        
        setSuppliers(supplierData);
        setFilteredSuppliers(supplierData);
      }
      
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to fetch suppliers: ' + (error.message || 'Unknown error'));
      console.error('Suppliers fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = suppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || supplier.status === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredSuppliers(filtered);
  }, [searchTerm, filter, suppliers]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const now = new Date().toISOString();
      
      if (editingSupplier) {
        // Update existing supplier
        // In a real implementation, we would update the specific row in the sheet
        // For now, we'll just update the local state
        const updatedSupplier: Supplier = {
          ...editingSupplier,
          ...formData,
          updatedAt: now
        };
        
        setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? updatedSupplier : s));
        setEditingSupplier(null);
      } else {
        // Add new supplier
        const newSupplier: Supplier = {
          id: `supplier-${Date.now()}`,
          ...formData,
          createdAt: now,
          updatedAt: now
        };
        
        // Prepare data for Google Sheets
        const headerRow = [
          'ID', 'Supplier Name', 'Contact Person', 'Email', 'Phone', 
          'Address', 'City', 'Country', 'Status', 'Notes', 'Created At', 'Updated At'
        ];
        
        const dataRow = [
          newSupplier.id,
          newSupplier.name,
          newSupplier.contactPerson,
          newSupplier.email,
          newSupplier.phone,
          newSupplier.address,
          newSupplier.city,
          newSupplier.country,
          newSupplier.status,
          newSupplier.notes,
          newSupplier.createdAt,
          newSupplier.updatedAt
        ];
        
        // Add to Suppliers sheet
        await appendSheetData('Suppliers', [dataRow]);
        
        setSuppliers([...suppliers, newSupplier]);
      }
      
      // Reset form
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        status: 'active',
        notes: ''
      });
      
      setShowForm(false);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to save supplier: ' + (error.message || 'Unknown error'));
      console.error('Supplier save error:', error);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      status: supplier.status,
      notes: supplier.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (supplierId: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) {
      return;
    }
    
    try {
      // In a real implementation, we would delete the row from the sheet
      // For now, we'll just update the local state
      setSuppliers(suppliers.filter(s => s.id !== supplierId));
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to delete supplier: ' + (error.message || 'Unknown error'));
      console.error('Supplier delete error:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSupplier(null);
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      status: 'active',
      notes: ''
    });
    setErrors({});
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading suppliers...</div>
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

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </CardTitle>
              <CardDescription>
                {editingSupplier ? 'Update supplier information' : 'Create a new supplier'}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                Supplier Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter supplier name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Contact Person
              </Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                placeholder="Enter contact person name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email address"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Enter city"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="Enter country"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes about this supplier"
            />
          </div>
        </CardContent>
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Supplier Management
            </CardTitle>
            <CardDescription>
              Manage your supplier database
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
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
                <DropdownMenuItem onSelect={() => setFilter('inactive')}>
                  Inactive Suppliers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Building className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSuppliers}</div>
              <p className="text-xs text-gray-600">All suppliers in database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <User className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSuppliers}</div>
              <p className="text-xs text-gray-600">Currently active suppliers</p>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <div className="font-medium">{supplier.name}</div>
                  {supplier.notes && (
                    <div className="text-sm text-gray-600 mt-1">
                      {supplier.notes.substring(0, 50)}{supplier.notes.length > 50 ? '...' : ''}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-500" />
                    {supplier.contactPerson || 'N/A'}
                  </div>
                  {supplier.email && (
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {supplier.email}
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {supplier.phone}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {supplier.city}{supplier.city && supplier.country ? ', ' : ''}{supplier.country}
                  </div>
                  {supplier.address && (
                    <div className="text-sm text-gray-600">
                      {supplier.address}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                    {supplier.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(supplier.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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