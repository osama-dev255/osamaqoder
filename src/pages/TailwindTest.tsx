export function TailwindTest() {
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tailwind Test</h1>
            <p className="text-gray-600 mb-6">
              If you see a red background and white box with shadow, Tailwind is working.
            </p>
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
              <span className="text-white font-bold text-xl">Tailwind Working</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}