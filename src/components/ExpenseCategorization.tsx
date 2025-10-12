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
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  TrendingUp,
  Calendar,
  Tag,
  PieChart,
  BarChart3,
  Save,
  X
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending';
}

interface ExpenseCategory {
  id: string;
  name: string;
  budget?: number;
  color: string;
}

export function ExpenseCategorization() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for adding/editing categories
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    budget: '',
    color: '#3b82f6' // Default blue color
  });
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined colors for categories
  const CATEGORY_COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#64748b', // gray
    '#14b8a6'  // teal
  ];

  useEffect(() => {
    const fetchExpensesAndCategories = async () => {
      try {
        setLoading(true);
        
        // Fetch expenses data from the Expenses sheet
        const expensesResponse = await getSheetData('Expenses');
        
        if (expensesResponse && expensesResponse.data && expensesResponse.data.values) {
          const rows = expensesResponse.data.values;
          
          // Skip header row and map the data to expense objects
          const expenseData = rows.slice(1).map((row: any[], index: number) => ({
            id: row[0] || `${index + 1}`, // ID
            date: row[1] || 'Unknown Date', // Date
            category: row[2] || 'Uncategorized', // Category
            description: row[3] || 'No Description', // Description
            amount: parseFloat(row[4]) || 0, // Amount
            status: row[5] === 'paid' ? 'paid' : 'pending' // Status
          }));
          
          setExpenses(expenseData);
        }
        
        // Initialize with default categories
        const defaultCategories: ExpenseCategory[] = [
          { id: '1', name: 'Utilities', budget: 100000, color: '#3b82f6' },
          { id: '2', name: 'Rent', budget: 500000, color: '#10b981' },
          { id: '3', name: 'Supplies', budget: 50000, color: '#f59e0b' },
          { id: '4', name: 'Marketing', budget: 150000, color: '#ef4444' },
          { id: '5', name: 'Salaries', budget: 2000000, color: '#8b5cf6' },
          { id: '6', name: 'Transportation', budget: 80000, color: '#ec4899' },
          { id: '7', name: 'Maintenance', budget: 60000, color: '#06b6d4' },
          { id: '8', name: 'Insurance', budget: 40000, color: '#f97316' },
          { id: '9', name: 'Taxes', budget: 300000, color: '#64748b' },
          { id: '10', name: 'Miscellaneous', budget: 50000, color: '#14b8a6' }
        ];
        
        setCategories(defaultCategories);
        
        setError(null);
      } catch (err: unknown) {
        const error = err as Error;
        setError('Failed to fetch data: ' + (error.message || 'Unknown error'));
        console.error('Data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpensesAndCategories();
  }, []);

  useEffect(() => {
    const filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || expense.status === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredExpenses(filtered);
  }, [searchTerm, filter, expenses]);

  // Calculate expense statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate category totals
  const categoryTotals: Record<string, { total: number; count: number }> = {};
  expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = { total: 0, count: 0 };
    }
    categoryTotals[expense.category].total += expense.amount;
    categoryTotals[expense.category].count += 1;
  });
  
  // Prepare data for charts
  const categoryChartData = Object.entries(categoryTotals).map(([category, data]) => ({
    name: category,
    amount: data.total,
    count: data.count,
    color: categories.find(c => c.name === category)?.color || '#64748b'
  }));
  
  // Sort by amount descending
  categoryChartData.sort((a, b) => b.amount - a.amount);

  const validateCategoryForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!categoryFormData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (categoryFormData.budget && isNaN(parseFloat(categoryFormData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCategory = async () => {
    if (!validateCategoryForm()) {
      return;
    }
    
    try {
      const budget = categoryFormData.budget ? parseFloat(categoryFormData.budget) : undefined;
      
      if (editingCategory) {
        // Update existing category
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, name: categoryFormData.name, budget, color: categoryFormData.color } 
            : cat
        ));
        setEditingCategory(null);
      } else {
        // Add new category
        const newCategory: ExpenseCategory = {
          id: `cat-${Date.now()}`,
          name: categoryFormData.name,
          budget,
          color: categoryFormData.color
        };
        
        setCategories([...categories, newCategory]);
      }
      
      // Reset form
      setCategoryFormData({
        name: '',
        budget: '',
        color: '#3b82f6'
      });
      setShowCategoryForm(false);
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to save category: ' + (error.message || 'Unknown error'));
      console.error('Category save error:', error);
    }
  };

  const handleEditCategory = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      budget: category.budget?.toString() || '',
      color: category.color
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    } catch (err: unknown) {
      const error = err as Error;
      setError('Failed to delete category: ' + (error.message || 'Unknown error'));
      console.error('Category delete error:', error);
    }
  };

  const handleCancelCategory = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      budget: '',
      color: '#3b82f6'
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading expense data...</div>
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

  if (showCategoryForm) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </CardTitle>
              <CardDescription>
                {editingCategory ? 'Update expense category' : 'Create a new expense category'}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCancelCategory}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                Category Name *
              </Label>
              <Input
                id="category-name"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                placeholder="Enter category name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-budget" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Monthly Budget
              </Label>
              <Input
                id="category-budget"
                type="number"
                value={categoryFormData.budget}
                onChange={(e) => setCategoryFormData({...categoryFormData, budget: e.target.value})}
                placeholder="Enter monthly budget"
                className={errors.budget ? 'border-red-500' : ''}
              />
              {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${categoryFormData.color === color ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCategoryFormData({...categoryFormData, color})}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <div className="flex justify-end gap-2 p-6 pt-0">
          <Button variant="outline" onClick={handleCancelCategory}>
            Cancel
          </Button>
          <Button onClick={handleSaveCategory}>
            <Save className="mr-2 h-4 w-4" />
            {editingCategory ? 'Update Category' : 'Add Category'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Expense Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-gray-600">All recorded expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Expenses</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(paidExpenses)}</div>
            <p className="text-xs text-gray-600">Successfully paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(pendingExpenses)}</div>
            <p className="text-xs text-gray-600">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Expense Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of expenses by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Category Breakdown
            </CardTitle>
            <CardDescription>
              Expense amounts by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `TSh ${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
                />
                <Bar dataKey="amount" name="Amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                Expense Categories
              </CardTitle>
              <CardDescription>
                Manage your expense categories and budgets
              </CardDescription>
            </div>
            <Button onClick={() => setShowCategoryForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                const spent = categoryTotals[category.name]?.total || 0;
                const count = categoryTotals[category.name]?.count || 0;
                const remaining = category.budget ? category.budget - spent : 0;
                const budgetPercentage = category.budget ? (spent / category.budget) * 100 : 0;
                
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.budget ? formatCurrency(category.budget) : 'No budget'}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(spent)}</div>
                      {category.budget && (
                        <div className="text-xs text-gray-600">
                          {budgetPercentage.toFixed(1)}% of budget
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {category.budget ? (
                        <div className={remaining < 0 ? 'text-red-500 font-medium' : ''}>
                          {formatCurrency(remaining)}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{count} transactions</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense Records */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Expense Records</CardTitle>
              <CardDescription>
                View and manage your business expenses
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search expenses..."
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
                  <DropdownMenuItem onSelect={() => setFilter('paid')}>
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => {
                const category = categories.find(c => c.name === expense.category);
                
                return (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div>{expense.date}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {category && (
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                        )}
                        <Badge variant="outline">{expense.category}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{expense.description}</div>
                    </TableCell>
                    <TableCell>{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      {expense.status === 'paid' && <Badge variant="default">Paid</Badge>}
                      {expense.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}