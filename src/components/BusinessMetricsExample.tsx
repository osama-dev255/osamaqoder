import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function BusinessMetricsExample() {
  // Example data that might come from your business application
  const metrics = [
    {
      name: 'Total Revenue',
      value: 'TSh 125,400,000',
      change: '+12.5%',
      trend: 'up',
      description: 'Monthly revenue growth'
    },
    {
      name: 'New Customers',
      value: '1,240',
      change: '+8.3%',
      trend: 'up',
      description: 'New customer acquisition'
    },
    {
      name: 'Avg. Order Value',
      value: 'TSh 42,500',
      change: '-2.1%',
      trend: 'down',
      description: 'Average order value'
    },
    {
      name: 'Customer Retention',
      value: '87.5%',
      change: '0%',
      trend: 'neutral',
      description: 'Customer retention rate'
    }
  ];

  const getTrendClass = (trend: string) => {
    switch (trend) {
      case 'up': return 'trending-up';
      case 'down': return 'trending-down';
      case 'neutral': return 'trending-neutral';
      default: return '';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      case 'neutral': return '→';
      default: return '';
    }
  };

  return (
    <Card className="bg-dark-card border-dark-border">
      <CardHeader>
        <CardTitle className="text-white text-2xl font-extrabold">Business Metrics Dashboard</CardTitle>
        <CardDescription className="text-muted-foreground font-medium">
          Example of trending indicators in a real business context
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="p-4 bg-dark-border rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
            >
              <h3 className="font-bold text-white mb-2">{metric.name}</h3>
              <p className="text-2xl font-extrabold text-white mb-1">{metric.value}</p>
              <p className={`${getTrendClass(metric.trend)} font-bold flex items-center`}>
                {getTrendIcon(metric.trend)} {metric.change}
              </p>
              <p className="text-muted-foreground text-sm mt-2">{metric.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-dark-border rounded-lg">
          <h4 className="text-lg font-bold text-white mb-3">Implementation Example</h4>
          <div className="bg-gray-900 p-4 rounded">
            <pre className="text-green-400 overflow-x-auto">
              <code>{`// Usage in your components:
<span className="trending-up">Positive trend (+12.5%)</span>
<span className="trending-down">Negative trend (-2.1%)</span>
<span className="trending-neutral">Neutral trend (0%)</span>
<span className="text-success">Success message</span>
<span className="text-danger">Error message</span>
<span className="text-info">Information message</span>
<span className="text-warning">Warning message</span>`}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}