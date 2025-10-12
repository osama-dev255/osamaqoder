import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabNotification, AlertNotification } from '@/components/TabNotification';

export function ThemeTest() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold">Theme Test</h1>
        <p className="text-lg text-muted-foreground mt-2 font-medium">
          Testing the enhanced dark theme typography and layout
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-extrabold">Color Palette</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Theme color examples with enhanced contrast
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="font-bold">Primary</Badge>
              <Badge variant="secondary" className="font-bold">Secondary</Badge>
              <Badge variant="destructive" className="font-bold">Destructive</Badge>
              <Badge variant="outline" className="font-bold">Outline</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 bg-indigo-500 rounded"></div>
              <div className="h-10 bg-slate-500 rounded"></div>
              <div className="h-10 bg-emerald-500 rounded"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-extrabold">Buttons</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Button variants with improved styling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button className="font-bold">Default</Button>
              <Button variant="secondary" className="font-bold">Secondary</Button>
              <Button variant="destructive" className="font-bold">Destructive</Button>
              <Button variant="outline" className="font-bold">Outline</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="font-bold">Small</Button>
              <Button size="default" className="font-bold">Default</Button>
              <Button size="lg" className="font-bold">Large</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-extrabold">Typography</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Enhanced text styles and improved readability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold mb-3">Heading 1 - Extra Bold</h1>
              <p className="text-muted-foreground font-medium text-lg">
                This is a paragraph with secondary text color. The enhanced dark theme provides significantly better contrast 
                and improved readability for the POS system. Notice how all text is now bright and clear.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-extrabold mb-3">Heading 2 - Extra Bold</h2>
              <p className="text-white font-medium text-lg">
                This is a paragraph with primary text color. All regular text now uses a heavier font weight (500) for better visibility.
                The overall design should feel more professional and easier on the eyes.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-3">Heading 3 - Bold</h3>
              <p className="text-white font-medium">
                This paragraph uses a medium font weight for better visibility. Notice how the regular text 
                is now much clearer and more legible in dark mode with pure white color.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="p-4 bg-dark-border rounded-lg">
                <h4 className="text-xl font-bold mb-3">Regular Text</h4>
                <p className="text-white font-medium">
                  Regular text has been enhanced with better font weights and pure white color for maximum visibility.
                  This should completely resolve the previous issues with faint unbolded text.
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="text-white font-medium">• List item with improved visibility</li>
                  <li className="text-white font-medium">• Another list item that's clearly visible</li>
                  <li className="text-white font-medium">• All text elements are now bright and clear</li>
                </ul>
              </div>
              
              <div className="p-4 bg-dark-border rounded-lg">
                <h4 className="text-xl font-bold mb-3">Bold Text</h4>
                <p className="text-white font-bold text-lg">
                  Bold text maintains its strong appearance while benefiting from the overall typography improvements.
                  The contrast between regular and bold text is now more distinct with font weights 500 vs 800.
                </p>
                <div className="mt-3 p-3 bg-gray-800 rounded">
                  <code className="text-white font-medium">code {`{ font-weight: 500; }`}</code>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-dark-border rounded-lg">
              <h4 className="text-xl font-bold mb-3">Text Comparison</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-white font-medium mb-2">Before (faint text):</p>
                  <p className="text-gray-400 font-normal italic">This text was hard to read in dark mode</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-2">After (bright text):</p>
                  <p className="text-white font-medium">This text is now clear and easy to read!</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Trending Indicators Section */}
      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-extrabold">Business Trending Indicators</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Color-coded styling for business metrics and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
                <h4 className="text-xl font-bold mb-2 trending-up">Revenue Growth</h4>
                <p className="text-3xl font-extrabold trending-up">+12.5%</p>
                <p className="mt-2 trending-up">↑ 2.3% from last month</p>
              </div>
              
              <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
                <h4 className="text-xl font-bold mb-2 trending-down">Expenses</h4>
                <p className="text-3xl font-extrabold trending-down">+8.2%</p>
                <p className="mt-2 trending-down">↑ 1.7% from last month</p>
              </div>
              
              <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                <h4 className="text-xl font-bold mb-2 trending-neutral">Customer Satisfaction</h4>
                <p className="text-3xl font-extrabold trending-neutral">4.7/5.0</p>
                <p className="mt-2 trending-neutral">→ Stable rating</p>
              </div>
            </div>
            
            <div className="p-4 bg-dark-border rounded-lg">
              <h4 className="text-xl font-bold mb-3">Trending Text Classes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-success text-lg font-bold mb-2">.trending-up (Green)</p>
                  <p className="text-success font-medium">Used for positive business indicators like revenue growth, profit increases, etc.</p>
                  
                  <p className="text-danger text-lg font-bold mt-4 mb-2">.trending-down (Red)</p>
                  <p className="text-danger font-medium">Used for negative business indicators like expense increases, losses, etc.</p>
                </div>
                
                <div>
                  <p className="text-info text-lg font-bold mb-2">.trending-neutral (Blue)</p>
                  <p className="text-info font-medium">Used for neutral or stable business indicators like consistent ratings, flat trends, etc.</p>
                  
                  <div className="mt-4">
                    <p className="text-warning text-lg font-bold mb-2">.text-warning (Amber)</p>
                    <p className="text-warning font-medium">Used for cautionary indicators or alerts</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-dark-border rounded-lg">
              <h4 className="text-xl font-bold mb-3">Example Business Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-dark-card border rounded">
                  <span className="font-medium">Monthly Revenue</span>
                  <span className="text-success font-bold text-lg">TSh 45,200,000</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-dark-card border rounded">
                  <span className="font-medium">Customer Growth</span>
                  <span className="trending-up font-bold text-lg">+142 customers</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-dark-card border rounded">
                  <span className="font-medium">Inventory Turnover</span>
                  <span className="trending-neutral font-bold text-lg">6.8x</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-dark-card border rounded">
                  <span className="font-medium">Operational Costs</span>
                  <span className="trending-down font-bold text-lg">↑ TSh 8,300,000</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification and Alert Styling Section */}
      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-extrabold">Notification and Alert Styling</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Color-coded notifications and alerts for front tabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Tab Notifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <TabNotification type="success" message="Operation completed successfully" />
                  <TabNotification type="error" message="Failed to save changes" />
                </div>
                <div className="space-y-3">
                  <TabNotification type="info" message="New update available" />
                  <TabNotification type="warning" message="Low inventory alert" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Alert Notifications</h3>
              <div className="space-y-4">
                <AlertNotification 
                  type="success" 
                  title="Success" 
                  message="Your changes have been saved successfully. All data is up to date." 
                />
                <AlertNotification 
                  type="error" 
                  title="Error" 
                  message="Failed to connect to the database. Please check your connection and try again." 
                />
                <AlertNotification 
                  type="info" 
                  title="Information" 
                  message="A new version of the application is available. Please refresh to update." 
                />
                <AlertNotification 
                  type="warning" 
                  title="Warning" 
                  message="Your inventory levels are running low. Please restock soon to avoid disruptions." 
                />
              </div>
            </div>
            
            <div className="p-4 bg-dark-border rounded-lg">
              <h4 className="text-xl font-bold mb-3">Implementation Examples</h4>
              <div className="bg-gray-900 p-4 rounded">
                <pre className="text-green-400 overflow-x-auto">
                  <code>{`// Tab Notifications:
<TabNotification type="success" message="Operation completed" />
<TabNotification type="error" message="Failed to save" />
<TabNotification type="info" message="New update available" />
<TabNotification type="warning" message="Low inventory" />

// Alert Notifications:
<AlertNotification 
  type="success" 
  title="Success" 
  message="Your changes have been saved" 
/>`}</code>
                </pre>
              </div>
              
              <div className="mt-4">
                <h5 className="font-bold mb-2">CSS Classes Available:</h5>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="tab-notification-success p-2 rounded">.tab-notification-success</li>
                  <li className="tab-notification-error p-2 rounded">.tab-notification-error</li>
                  <li className="tab-notification-info p-2 rounded">.tab-notification-info</li>
                  <li className="tab-notification-warning p-2 rounded">.tab-notification-warning</li>
                  <li className="alert-success p-2 rounded mt-2">.alert-success</li>
                  <li className="alert-error p-2 rounded mt-2">.alert-error</li>
                  <li className="alert-info p-2 rounded mt-2">.alert-info</li>
                  <li className="alert-warning p-2 rounded mt-2">.alert-warning</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}