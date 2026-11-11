import { CyberMatrixRain } from './components/CyberMatrixRain'
import { LiquidMercuryCanvas } from './components/LiquidMercuryCanvas'
import { HeartCursorTrail } from './components/HeartCursorTrail'
import { LoveQuestionToast } from './components/LoveQuestionToast'

function App() {
  return (
    <main className="relative min-h-screen bg-[#020104] text-white flex flex-col items-center justify-center overflow-hidden cursor-crosshair select-none">
      {/* Layer 0: Matrix Rain Background with Flashlight Spotlight */}
      <CyberMatrixRain />

      {/* Layer 1: Liquid Mercury Splash Canvas (Click-to-Splash) */}
      <LiquidMercuryCanvas />

      {/* Layer 2: Glowing Heart & Cyber Spark Cursor Trail */}
      <HeartCursorTrail />

      {/* Layer 3: Interactive Love Question Toast & Floating Bubbles */}
      <LoveQuestionToast />
    </main>
  )
}

export default App