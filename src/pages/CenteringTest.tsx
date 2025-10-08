import { Link } from 'react-router-dom';

export function CenteringTest() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Centering Test</h1>
            <p className="text-gray-600 mb-6">This content should be perfectly centered</p>
            
            <div className="space-y-4">
              <div className="h-32 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">Centered Box</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white font-medium">Box 1</span>
                </div>
                <div className="h-16 bg-purple-500 rounded flex items-center justify-center">
                  <span className="text-white font-medium">Box 2</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}