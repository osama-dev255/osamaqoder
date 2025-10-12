import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CustomerProfileManagement } from './CustomerProfileManagement';
import { CustomerSegmentation } from './CustomerSegmentation';
import { CustomerLoyaltyProgram } from './CustomerLoyaltyProgram';
import { CustomerCommunicationTools } from './CustomerCommunicationTools';

export function CustomerManagement() {
  const [activeTab, setActiveTab] = useState<'profiles' | 'segmentation' | 'loyalty' | 'communication'>('profiles');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customer Management</h2>
        <p className="text-gray-600">
          Manage your customer database and profiles
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeTab === 'profiles' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('profiles')}
        >
          Customer Profiles
        </Button>
        <Button 
          variant={activeTab === 'segmentation' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('segmentation')}
        >
          Customer Segmentation
        </Button>
        <Button 
          variant={activeTab === 'loyalty' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('loyalty')}
        >
          Loyalty Program
        </Button>
        <Button 
          variant={activeTab === 'communication' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('communication')}
        >
          Communication Tools
        </Button>
      </div>

      {activeTab === 'segmentation' ? (
        <CustomerSegmentation />
      ) : activeTab === 'loyalty' ? (
        <CustomerLoyaltyProgram />
      ) : activeTab === 'communication' ? (
        <CustomerCommunicationTools />
      ) : (
        <CustomerProfileManagement />
      )}
    </div>
  );
}