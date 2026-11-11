import { Heart } from 'lucide-react'
import { HeartCursorTrail } from './components/HeartCursorTrail'

function App() {
  return (
    <main className='relative min-h-screen bg-[#030305] text-white flex flex-col items-center justify-center overflow-hidden cursor-crosshair'>
      <HeartCursorTrail />
      <div className='z-10 text-center px-6'>
        <p className='text-xs font-mono uppercase tracking-[0.3em] text-[#00f0ff] mb-3'>
          [NEUTRAL LINK // ACTIVE]
        </p>
        <h1 className='text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#00f0ff] to-[#ff007f]
        bg-clip-text text-transparent'>FOREVER Synchronized</h1>
        <p className="mt-4 text-sm font-mono text-gray-400">Move your mouse around to test the heart trail!</p>

      </div>
    </main>
  )
}

export default App