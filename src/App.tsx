import { Heart } from 'lucide-react'

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-md w-full border border-pink-200 flex flex-col items-center">
        <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-bounce mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
          Happy Anniversary! ❤️
        </h1>
        <p className="text-gray-600">
          Tailwind & Lucide are live! Ready to build the question journey.
        </p>
      </div>
    </main>
  )
}

export default App