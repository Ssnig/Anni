import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import { Heart, Sparkles, RefreshCw } from 'lucide-react'

const EVASION_MESSAGES = [
  'Wait... think carefully! 🥺',
  'System Warning: Option Deprecated ⚡',
  "Error 404: 'No' Not Found 🚀",
  'Overriding Denial Protocol... 💕',
  'Nice try! The universe says YES! ✨',
  'Resistance is mathematically impossible! 💖',
]

export function LoveQuestionToast() {
  const [hasAccepted, setHasAccepted] = useState(false)
  const [evasionCount, setEvasionCount] = useState(0)
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null)
  const yesButtonRef = useRef<HTMLButtonElement | null>(null)

  // Trigger heart confetti celebration
  const handleAccept = () => {
    setHasAccepted(true)

    // Left cannon
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#ff007f', '#00f0ff', '#ffffff', '#ff77bc'],
    })

    // Right cannon
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#ff007f', '#00f0ff', '#ffffff', '#ff77bc'],
    })

    // Center burst
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#ff007f', '#00f0ff', '#ffffff'],
      })
    }, 250)
  }

  // Teleport the 'No' button to a safe random screen position
  const dodgeNoButton = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const padding = 60
    const bubbleSize = 90
    const maxX = window.innerWidth - bubbleSize - padding
    const maxY = window.innerHeight - bubbleSize - padding
    const minX = padding
    const minY = padding

    // Get current cursor/touch position to avoid spawning right under it
    let cursorX = window.innerWidth / 2
    let cursorY = window.innerHeight / 2
    if ('clientX' in e) {
      cursorX = e.clientX
      cursorY = e.clientY
    } else if (e.touches && e.touches[0]) {
      cursorX = e.touches[0].clientX
      cursorY = e.touches[0].clientY
    }

    let newX = 0
    let newY = 0
    let attempts = 0

    // Ensure we don't spawn right on the cursor or on top of the Yes button
    while (attempts < 20) {
      newX = minX + Math.random() * (maxX - minX)
      newY = minY + Math.random() * (maxY - minY)
      const distToCursor = Math.hypot(newX - cursorX, newY - cursorY)

      const yesRect = yesButtonRef.current?.getBoundingClientRect()
      const distToYes = yesRect
        ? Math.hypot(
            newX - (yesRect.left + yesRect.width / 2),
            newY - (yesRect.top + yesRect.height / 2)
          )
        : 999

      if (distToCursor > 140 && distToYes > 130) {
        break
      }
      attempts++
    }

    setNoPosition({ x: newX, y: newY })
    setEvasionCount((prev) => prev + 1)
  }

  const resetAll = () => {
    setHasAccepted(false)
    setEvasionCount(0)
    setNoPosition(null)
  }

  return (
    <div className="relative z-20 flex flex-col items-center justify-center p-4 w-full max-w-lg select-none">
      <AnimatePresence mode="wait">
        {!hasAccepted ? (
          /* QUESTION TOAST */
          <motion.div
            key="question-toast"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full rounded-3xl p-8 backdrop-blur-2xl border border-white/10 text-center"
            style={{
              background: 'rgba(13, 8, 25, 0.75)',
              boxShadow:
                '0 0 35px rgba(255, 0, 127, 0.28), 0 0 70px rgba(0, 240, 255, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Cyber Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#00f0ff]/30 text-[10px] font-mono tracking-[0.25em] text-[#00f0ff] uppercase mb-4 drop-shadow-[0_0_6px_#00f0ff]">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              LOVE_PROTOCOL_v4 // SECURE
            </div>

            {/* The Question */}
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#00f0ff] via-white to-[#ff007f] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,0,127,0.5)] mb-3">
              Do you Love me?
            </h2>

            {/* Subtitle / Playful Warnings */}
            <p className="text-sm font-mono text-gray-300 min-h-[1.5rem] mb-8">
              {evasionCount === 0
                ? 'Select your neural confirmation below: ✨'
                : EVASION_MESSAGES[(evasionCount - 1) % EVASION_MESSAGES.length]}
            </p>

            {/* Button Ring / Tray */}
            <div className="flex items-center justify-center gap-8 relative py-4">
              {/* YES BUBBLE */}
              <motion.button
                ref={yesButtonRef}
                onClick={handleAccept}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                animate={{
                  y: [-3, 3, -3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
                className="relative w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.45) 0%, rgba(0, 240, 255, 0.25) 35%, rgba(255, 0, 127, 0.28) 70%, rgba(13, 8, 25, 0.7) 100%)',
                  boxShadow:
                    'inset 3px 4px 8px rgba(255, 255, 255, 0.8), inset -4px -5px 12px rgba(255, 0, 127, 0.6), 0 0 25px rgba(0, 240, 255, 0.5), 0 0 50px rgba(255, 0, 127, 0.3)',
                }}
              >
                {/* Specular Glint */}
                <span className="absolute top-2 left-4 w-5 h-2.5 rounded-full bg-white/80 blur-[0.6px] -rotate-40 pointer-events-none" />
                <span className="text-xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_10px_#00f0ff]">
                  YES
                </span>
                <Heart className="w-3.5 h-3.5 text-[#ff007f] fill-[#ff007f] drop-shadow-[0_0_6px_#ff007f] mt-0.5" />
              </motion.button>

              {/* NO BUBBLE (Evasive) */}
              <motion.div
                onMouseEnter={dodgeNoButton}
                onTouchStart={dodgeNoButton}
                animate={
                  noPosition
                    ? {
                        position: 'fixed',
                        left: noPosition.x,
                        top: noPosition.y,
                        transition: { type: 'spring', damping: 14, stiffness: 350 },
                      }
                    : {
                        y: [3, -3, 3],
                        transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                      }
                }
                className="cursor-not-allowed select-none z-50"
              >
                <div
                  className="relative w-24 h-24 rounded-full flex flex-col items-center justify-center pointer-events-auto"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 0, 127, 0.25) 40%, rgba(0, 240, 255, 0.2) 75%, rgba(13, 8, 25, 0.7) 100%)',
                    boxShadow:
                      'inset 3px 4px 8px rgba(255, 255, 255, 0.7), inset -4px -5px 12px rgba(0, 240, 255, 0.5), 0 0 20px rgba(255, 0, 127, 0.4)',
                  }}
                >
                  <span className="absolute top-2 left-4 w-5 h-2.5 rounded-full bg-white/80 blur-[0.6px] -rotate-40 pointer-events-none" />
                  <span className="text-xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_10px_#ff007f]">
                    NO
                  </span>
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter">
                    {evasionCount > 0 ? `dodged ×${evasionCount}` : 'locked'}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* CELEBRATION UNLOCKED CARD */
          <motion.div
            key="celebration-toast"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 280 }}
            className="relative w-full rounded-3xl p-8 backdrop-blur-2xl border border-white/10 text-center"
            style={{
              background: 'rgba(13, 8, 25, 0.85)',
              boxShadow:
                '0 0 45px rgba(255, 0, 127, 0.4), 0 0 90px rgba(0, 240, 255, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
            }}
          >
            {/* Pulsing Core */}
            <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[#ff007f]/30 blur-xl animate-pulse" />
              <Heart className="w-16 h-16 text-[#ff007f] fill-[#ff007f] drop-shadow-[0_0_20px_#ff007f] animate-bounce" />
              <Sparkles className="absolute top-0 right-0 w-6 h-6 text-[#00f0ff] animate-spin" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[10px] font-mono tracking-[0.25em] text-[#00f0ff] uppercase mb-3">
              [ NEURAL_LINK: 100% SYNCHRONIZED ]
            </div>

            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
              I Knew It! ❤️
            </h3>

            <p className="text-sm md:text-base text-gray-200 leading-relaxed font-sans max-w-sm mx-auto mb-6">
              Through every line of code, every pixel, and every heartbeat across time... my answer
              will always be <span className="text-[#00f0ff] font-bold">YES</span> for you too.
              Happy Anniversary, my love! ♾️
            </p>

            {/* Replay Button */}
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 hover:border-[#00f0ff] text-xs font-mono text-gray-300 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#00f0ff]" />
              Re-initialize Protocol
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}