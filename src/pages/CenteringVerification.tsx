import { Link } from 'react-router-dom';

export function CenteringVerification() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Centering Verification</h1>
            <div className="space-y-6">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Perfectly Centered</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="h-16 bg-red-500 rounded flex items-center justify-center">
                  <span className="text-white font-medium">Left</span>
                </div>
                <div className="h-16 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white font-medium">Center</span>
                </div>
                <div className="h-16 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white font-medium">Right</span>
                </div>
              </div>
              
              <p className="text-gray-600">
                If this content is centered both vertically and horizontally on the page, 
                then the centering is working correctly.
              </p>
              
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