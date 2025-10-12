import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Sheets } from './pages/Sheets';
import { Metadata } from './pages/Metadata';
import { Products } from './pages/Products';
import { Sales } from './pages/Sales';
import { Reports } from './pages/Reports';
import { Customers } from './pages/Customers';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TestStyles } from './TestStyles';
import { CenteringTest } from './pages/CenteringTest';
import { CenteringVerification } from './pages/CenteringVerification';
import { CenteringDebug } from './pages/CenteringDebug';
import { TailwindTest } from './pages/TailwindTest';
import { CenteringTestFinal } from './pages/CenteringTestFinal';
import { CenteredDashboard } from './pages/CenteredDashboard';
import { ThemeTest } from '@/pages/ThemeTest';
import { SplashScreen } from './components/SplashScreen/SplashScreen';
import { EndOfDay } from './pages/EndOfDay';
import { Refunds } from '@/pages/Refunds';
import { Inventory } from '@/pages/Inventory';
import { Purchases } from '@/pages/Purchases';
import { Expenses } from '@/pages/Expenses';
import { Cashflow } from '@/pages/Cashflow';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
// import { InventoryTest } from '@/pages/InventoryTest'; // Commented out missing component

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for splash screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/test-styles" element={<TestStyles />} />
          <Route path="/centering-test" element={
            <ProtectedRoute>
              <Layout>
                <CenteringTest />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/centering-verification" element={
            <ProtectedRoute>
              <Layout>
                <CenteringVerification />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/centering-debug" element={
            <ProtectedRoute>
              <Layout>
                <CenteringDebug />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/tailwind-test" element={
            <ProtectedRoute>
              <Layout>
                <TailwindTest />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/centering-final" element={
            <ProtectedRoute>
              <Layout>
                <CenteringTestFinal />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/centered-dashboard" element={
            <ProtectedRoute>
              <CenteredDashboard />
            </ProtectedRoute>
          } />
          <Route path="/theme-test" element={
            <ProtectedRoute>
              <Layout>
                <ThemeTest />
              </Layout>
            </ProtectedRoute>
          } />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sales" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Sales />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sheets" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Sheets />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Customers />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/metadata" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Metadata />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/end-of-day" 
            element={
              <ProtectedRoute>
                <Layout>
                  <EndOfDay />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/refunds" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Refunds />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/purchases" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Purchases />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/expenses" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cashflow" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Cashflow />
                </Layout>
              </ProtectedRoute>
            } 
          />
          {/* <Route 
            path="/inventory-test" 
            element={
              <ProtectedRoute>
                <Layout>
                  <InventoryTest />
                </Layout>
              </ProtectedRoute>
            } 
          /> */}
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;