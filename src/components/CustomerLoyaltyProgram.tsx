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
  User,
  Star,
  Trophy,
  Gift,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  orders: number;
  status: 'active' | 'inactive';
  lastPurchase: string;
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTierProgress: number; // Percentage to next tier
  rewardsAvailable: number;
  lastRewardDate?: string;
}

interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  discount: number; // Percentage
  benefits: string[];
  color: string;
}

interface Reward {
  id: string;
  name: string;
  pointsRequired: number;
  description: string;
  available: boolean;
  claimed: number;
}

export function CustomerLoyaltyProgram() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with sample data
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const sampleCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@businessproject.co.tz',
          phone: '+255 712 345 678',
          totalSpent: 1250000,
          orders: 24,
          status: 'active',
          lastPurchase: '2024-12-01',
          loyaltyPoints: 1250,
          loyaltyTier: 'gold',
          nextTierProgress: 75,
          rewardsAvailable: 3,
          lastRewardDate: '2024-11-15'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@businessproject.co.tz',
          phone: '+255 754 321 987',
          totalSpent: 875000,
          orders: 18,
          status: 'active',
          lastPurchase: '2024-11-28',
          loyaltyPoints: 875,
          loyaltyTier: 'silver',
          nextTierProgress: 75,
          rewardsAvailable: 1,
          lastRewardDate: '2024-11-10'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@businessproject.co.tz',
          phone: '+255 687 123 456',
          totalSpent: 2500000,
          orders: 42,
          status: 'active',
          lastPurchase: '2024-12-05',
          loyaltyPoints: 2500,
          loyaltyTier: 'platinum',
          nextTierProgress: 100,
          rewardsAvailable: 5,
          lastRewardDate: '2024-12-01'
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@businessproject.co.tz',
          phone: '+255 745 678 123',
          totalSpent: 320000,
          orders: 7,
          status: 'inactive',
          lastPurchase: '2024-08-15',
          loyaltyPoints: 320,
          loyaltyTier: 'bronze',
          nextTierProgress: 60,
          rewardsAvailable: 0
        },
        {
          id: '5',
          name: 'Alex Brown',
          email: 'alex.brown@businessproject.co.tz',
          phone: '+255 654 987 321',
          totalSpent: 1500000,
          orders: 32,
          status: 'active',
          lastPurchase: '2024-12-03',
          loyaltyPoints: 1500,
          loyaltyTier: 'gold',
          nextTierProgress: 50,
          rewardsAvailable: 2,
          lastRewardDate: '2024-11-20'
        }
      ];
      
      const sampleTiers: LoyaltyTier[] = [
        {
          id: '1',
          name: 'Bronze',
          minPoints: 0,
          discount: 2,
          benefits: ['2% discount on purchases', 'Birthday reward', 'Exclusive offers'],
          color: '#cd7f32'
        },
        {
          id: '2',
          name: 'Silver',
          minPoints: 500,
          discount: 5,
          benefits: ['5% discount on purchases', 'Free shipping', 'Early access to sales', 'Birthday reward'],
          color: '#c0c0c0'
        },
        {
          id: '3',
          name: 'Gold',
          minPoints: 1000,
          discount: 10,
          benefits: ['10% discount on purchases', 'Free shipping', 'Early access to sales', 'Exclusive events', 'Birthday reward', 'Priority customer service'],
          color: '#ffd700'
        },
        {
          id: '4',
          name: 'Platinum',
          minPoints: 2000,
          discount: 15,
          benefits: ['15% discount on purchases', 'Free shipping', 'Early access to sales', 'Exclusive events', 'Birthday reward', 'Priority customer service', 'Personal shopping assistant', 'Special anniversary gifts'],
          color: '#e5e4e2'
        }
      ];
      
      const sampleRewards: Reward[] = [
        {
          id: '1',
          name: '10% Off Coupon',
          pointsRequired: 100,
          description: '10% discount on your next purchase',
          available: true,
          claimed: 2
        },
        {
          id: '2',
          name: 'Free Shipping',
          pointsRequired: 200,
          description: 'Free shipping on your next order',
          available: true,
          claimed: 1
        },
        {
          id: '3',
          name: 'Free Product',
          pointsRequired: 500,
          description: 'Free product of your choice (up to TSh 50,000)',
          available: true,
          claimed: 0
        },
        {
          id: '4',
          name: 'VIP Experience',
          pointsRequired: 1000,
          description: 'Exclusive VIP shopping experience',
          available: true,
          claimed: 0
        }
      ];
      
      setCustomers(sampleCustomers);
      setTiers(sampleTiers);
      setRewards(sampleRewards);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.loyaltyTier.includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || customer.loyaltyTier === filter;
      return matchesSearch && matchesFilter;
    });
    
    setFilteredCustomers(filtered);
  }, [searchTerm, filter, customers]);

  // Calculate summary statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalPoints = customers.reduce((sum, customer) => sum + customer.loyaltyPoints, 0);
  const totalRewards = customers.reduce((sum, customer) => sum + customer.rewardsAvailable, 0);
  
  // Tier distribution for chart
  const tierDistribution = tiers.map(tier => ({
    name: tier.name,
    value: customers.filter(c => c.loyaltyTier === tier.name.toLowerCase()).length,
    color: tier.color
  }));
  
  // Points distribution by tier
  const pointsByTier = tiers.map(tier => ({
    name: tier.name,
    points: customers
      .filter(c => c.loyaltyTier === tier.name.toLowerCase())
      .reduce((sum, customer) => sum + customer.loyaltyPoints, 0)
  }));
  
  const COLORS = ['#cd7f32', '#c0c0c0', '#ffd700', '#e5e4e2'];

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return <Badge variant="outline" className="bg-amber-800 text-white">Bronze</Badge>;
      case 'silver':
        return <Badge variant="outline" className="bg-gray-400 text-white">Silver</Badge>;
      case 'gold':
        return <Badge variant="outline" className="bg-yellow-500 text-black">Gold</Badge>;
      case 'platinum':
        return <Badge variant="outline" className="bg-gray-300 text-black">Platinum</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading loyalty program data...</div>
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customer Loyalty Program</h2>
        <p className="text-gray-600">
          Manage and track customer loyalty rewards
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-gray-600">Enrolled in loyalty program</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-gray-600">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
            <p className="text-xs text-gray-600">Loyalty points earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rewards</CardTitle>
            <Gift className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRewards}</div>
            <p className="text-xs text-gray-600">Rewards to claim</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Loyalty Tier Distribution
            </CardTitle>
            <CardDescription>
              Distribution of customers across loyalty tiers
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Points by Tier
            </CardTitle>
            <CardDescription>
              Total loyalty points accumulated by tier
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pointsByTier}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString(), 'Points']}
                />
                <Bar dataKey="points" name="Points" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Loyalty Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            Loyalty Tiers
          </CardTitle>
          <CardDescription>
            Benefits and requirements for each loyalty tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <Card key={tier.id} className="border-2" style={{ borderColor: tier.color }}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{tier.name}</span>
                    <span className="text-2xl" style={{ color: tier.color }}>
                      {tier.name === 'Bronze' && '🥉'}
                      {tier.name === 'Silver' && '🥈'}
                      {tier.name === 'Gold' && '🥇'}
                      {tier.name === 'Platinum' && '🏆'}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {tier.minPoints}+ points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">{tier.discount}% Discount</div>
                    <ul className="text-sm space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="mr-2 h-5 w-5" />
            Available Rewards
          </CardTitle>
          <CardDescription>
            Rewards that customers can claim with their points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reward</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Points Required</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>
                    <div className="font-medium">{reward.name}</div>
                  </TableCell>
                  <TableCell>{reward.description}</TableCell>
                  <TableCell>{reward.pointsRequired.toLocaleString()} points</TableCell>
                  <TableCell>
                    {reward.available ? (
                      <Badge variant="default">Available</Badge>
                    ) : (
                      <Badge variant="secondary">Unavailable</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Loyalty Program Members */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Loyalty Program Members</CardTitle>
              <CardDescription>
                Customers enrolled in the loyalty program
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search customers..."
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
                  <DropdownMenuLabel>Filter by tier</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setFilter('all')}>
                    All Tiers
                  </DropdownMenuItem>
                  {tiers.map(tier => (
                    <DropdownMenuItem 
                      key={tier.id} 
                      onSelect={() => setFilter(tier.name.toLowerCase())}
                    >
                      {tier.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Rewards</TableHead>
                <TableHead>Last Purchase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{customer.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{customer.loyaltyPoints.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    {getTierBadge(customer.loyaltyTier)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${customer.nextTierProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{customer.nextTierProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Gift className="h-4 w-4 text-gray-500" />
                      <span>{customer.rewardsAvailable}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{customer.lastPurchase}</div>
                    {customer.lastRewardDate && (
                      <div className="text-xs text-gray-600">
                        Last reward: {customer.lastRewardDate}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <User className="h-12 w-12 mx-auto mb-4" />
              <p>No customers found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}