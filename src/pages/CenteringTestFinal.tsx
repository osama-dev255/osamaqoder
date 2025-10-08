export function CenteringTestFinal() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Centering Test</h1>
            <p className="text-gray-600 mb-8">This content should be perfectly centered</p>
            
            <div className="space-y-6">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">Centered Content</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-red-500 rounded-lg flex items-center justify-center shadow">
                  <span className="text-white font-medium">Box 1</span>
                </div>
                <div className="h-20 bg-green-500 rounded-lg flex items-center justify-center shadow">
                  <span className="text-white font-medium">Box 2</span>
                </div>
                <div className="h-20 bg-purple-500 rounded-lg flex items-center justify-center shadow">
                  <span className="text-white font-medium">Box 3</span>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors">
                  Centered Button
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}