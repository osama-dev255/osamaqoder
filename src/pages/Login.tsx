import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Store } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full bg-slate-800/50 backdrop-blur-lg border-slate-700 shadow-2xl shadow-indigo-500/10">
          <CardHeader className="text-center pb-6">
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative bg-slate-800 border-2 border-slate-700 rounded-2xl w-20 h-20 flex items-center justify-center">
                  <Store className="h-10 w-10 text-indigo-400" />
                </div>
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Railway POS
            </CardTitle>
            <CardDescription className="text-slate-600 mt-2">
              Enter your credentials to access your account
            </CardDescription>

          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-600 hover:text-slate-800" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-600 hover:text-slate-800" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-800/50"
                >
                  {error}
                </motion.div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <div className="text-center">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Demo Credentials</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <p className="text-xs text-slate-600">Administrator</p>
                    <p className="text-sm text-slate-700">admin@businessproject.co.tz</p>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <p className="text-xs text-slate-600">Operations Manager</p>
                    <p className="text-sm text-slate-700">manager@businessproject.co.tz</p>
                  </div>
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <p className="text-xs text-slate-600">Cashier</p>
                    <p className="text-sm text-slate-700">cashier@businessproject.co.tz</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center text-xs text-slate-600">
              <p>© 2025 Business Project Tanzania. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}