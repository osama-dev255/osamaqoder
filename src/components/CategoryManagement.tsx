import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Plus, 
  Edit, 
  Trash2,
  Tag
} from 'lucide-react';
import { getSheetData } from '@/services/apiService';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: string;
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // For now, we'll get categories from the Products sheet
      // In a real implementation, you might have a separate Categories sheet
      const response = await getSheetData('Products');
      
      if (response && response.data && response.data.values) {
        const rows = response.data.values;
        
        // Extract unique categories from products
        const categoryMap = new Map<string, number>();
        
        // Skip header row (index 0) and process product rows
        for (let i = 1; i < rows.length; i++) {
          const category = rows[i][2] || 'Uncategorized'; // Category column
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        }
        
        // Convert to array of category objects
        const categoryData: Category[] = Array.from(categoryMap.entries()).map(([name, count], index) => ({
          id: `cat-${index + 1}`,
          name,
          description: `${name} category`,
          productCount: count,
          status: 'active'
        }));
        
        setCategories(categoryData);
      }
      
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to fetch categories: ' + (error.message || 'Unknown error'));
      console.error('Categories fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    try {
      // In a real implementation, you would add to a Categories sheet
      // For now, we'll just add to our local state
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: newCategory.name,
        description: newCategory.description || `${newCategory.name} category`,
        productCount: 0,
        status: 'active'
      };
      
      setCategories([...categories, newCat]);
      setNewCategory({ name: '', description: '' });
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to add category: ' + (error.message || 'Unknown error'));
      console.error('Category add error:', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      setError('Category name is required');
      return;
    }
    
    try {
      // In a real implementation, you would update the Categories sheet
      // For now, we'll just update our local state
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditingCategory(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to update category: ' + (error.message || 'Unknown error'));
      console.error('Category update error:', error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    
    try {
      // In a real implementation, you would remove from the Categories sheet
      // For now, we'll just remove from our local state
      setCategories(categories.filter(cat => cat.id !== deletingCategory.id));
      setDeletingCategory(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to delete category: ' + (error.message || 'Unknown error'));
      console.error('Category delete error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-600">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Category Management
        </CardTitle>
        <CardDescription>
          Manage product categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add Category Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="Enter category name"
              />
            </div>
            <div className="md:col-span-6">
              <Label htmlFor="categoryDescription">Description</Label>
              <Input
                id="categoryDescription"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                placeholder="Enter category description"
              />
            </div>
            <div className="md:col-span-2 flex items-end">
              <Button onClick={handleAddCategory} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Categories Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="font-medium">{category.name}</div>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setDeletingCategory(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Edit Category Dialog */}
          {editingCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Edit className="mr-2 h-5 w-5" />
                    Edit Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="editCategoryName">Category Name</Label>
                    <Input
                      id="editCategoryName"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCategoryDescription">Description</Label>
                    <Input
                      id="editCategoryDescription"
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                      placeholder="Enter category description"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateCategory}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {deletingCategory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-500">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Confirm Deletion
                  </CardTitle>
                  <CardDescription>
                    Are you sure you want to delete the category "{deletingCategory.name}"?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    This action will remove the category. Products in this category will become uncategorized.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setDeletingCategory(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteCategory}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}