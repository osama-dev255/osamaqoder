export function TestStyles() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Tailwind CSS Test</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Color Tests</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-red-500 rounded flex items-center justify-center text-white font-medium">
                  Red
                </div>
                <div className="h-16 bg-green-500 rounded flex items-center justify-center text-white font-medium">
                  Green
                </div>
                <div className="h-16 bg-blue-500 rounded flex items-center justify-center text-white font-medium">
                  Blue
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Button Tests</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Primary
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
                  Secondary
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  Success
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Typography Tests</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">Small text</p>
                <p className="text-base text-gray-700 text-center">Base text</p>
                <p className="text-lg text-gray-800 text-center">Large text</p>
                <p className="text-xl font-bold text-purple-600 text-center">Extra large bold</p>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2 text-center">Diagnostic Result</h3>
              <p className="text-yellow-700 text-center">
                If you see colored boxes, styled buttons, and varied text sizes above, 
                Tailwind CSS is working correctly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}