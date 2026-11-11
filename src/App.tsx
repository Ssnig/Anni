
import { HeartCursorTrail } from './components/HeartCursorTrail'
import { LiquidMercuryCanvas } from './components/LiquidMercuryCanvas'
import { CyberMatrixRain } from './components/CyberMatrixRain'

function App() {
  return (
    <main className='relative min-h-screen bg-[#020104] text-white flex flex-col items-center justify-center overflow-hidden cursor-crosshair select-none'>
      <CyberMatrixRain />
      <LiquidMercuryCanvas />
      <HeartCursorTrail />
      <div className='z-20 text-center px-6 pointer-events-none '>
        <p className='text-xs font-mono uppercase tracking-[0.3em] text-[#00f0ff] mb-3 drop-shadow-[0_0_8px_#00f0ff]'>
          [NEUTRAL LINK // ACTIVE]
        </p>
        <h1 className='text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#00f0ff] via-white to-[#ff007f] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,0,127,0.4)]'>FOREVER Synchronized</h1>
        <p className="mt-4 text-sm font-mono text-gray-400">Move your mouse around to test the heart trail!</p>

      </div>
    </main>
  )
}

export default App