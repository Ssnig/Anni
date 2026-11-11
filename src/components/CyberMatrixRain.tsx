import { useEffect, useRef } from 'react'

interface MatrixRainProps {
    fontSize?: number
    spotlightRadius?: number
}

export function CyberMatrixRain({
    fontSize = 16,
    spotlightRadius = 220,
}: MatrixRainProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) return
        let animId: number
        let dpr = Math.min(window.devicePixelRatio || 1, 2)
        let width = 0
        let height = 0
        let scaledFontSize = fontSize * dpr
        let scaledRadius = spotlightRadius * dpr

        const ROMANTIC_CHARS = [
            '♥', '♡', '❤', '❥', '❣',
            'I', 'L', 'O', 'V', 'E', 'Y', 'O', 'U',
            '0', '1', '0', '1', '0', '1',
            '∞', '✧', '✦', '☽', '✶',
        ]
        const SPECIAL_WORDS = [
            'I LOVE YOU',
            '01001001', // 'I'
            '01001100', // 'L'
            '01101111', // 'o'
            '01110110', // 'v'
            '01100101', // 'e'
            '01011001', // 'Y'
            '01110101', // 'u'
            'FOREVER',
            'MY HEART',
            'ALWAYS',
            '♥ LOVE ♥',
        ]
        const pointer = {
            x: window.innerWidth * dpr * 0.5,
            y: window.innerHeight * dpr * 0.5,
            targetX: window.innerWidth * dpr * 0.5,
            targetY: window.innerHeight * dpr * 0.5,
            active: false,
            idleAngle: 0,
        }
        interface StreamChar {
            char: string
            mutationTimer: number
            isStatic: boolean
        }

        class Stream {
            x: number
            y!: number
            speed!: number
            length!: number
            chars!: StreamChar[]
            isRomanticPhrase!: boolean
            phrase!: string | null
            colorType!: 'pink' | 'cyan'
            constructor(x: number) {
                this.x = x
                this.reset()
            }
            reset() {
                this.y = (Math.random() * -120 - 20) * dpr
                this.speed = (Math.random() * 2.2 + 1.4) * dpr
                this.length = Math.floor(Math.random() * 22 + 12)
                this.chars = []
                this.isRomanticPhrase = Math.random() < 0.32
                this.phrase = this.isRomanticPhrase ? SPECIAL_WORDS[Math.floor(Math.random() * SPECIAL_WORDS.length)] : null
                this.colorType = Math.random() < 0.65 ? 'pink' : 'cyan'
                for (let i = 0; i < this.length; i++) {
                    let ch: string
                    if (this.isRomanticPhrase && i < this.phrase!.length) {
                        ch = this.phrase![i]

                    } else {
                        ch = ROMANTIC_CHARS[Math.floor(Math.random() * ROMANTIC_CHARS.length)]
                    }
                    this.chars.push({
                        char: ch,
                        mutationTimer: Math.floor(Math.random() * 100),
                        isStatic: Boolean(this.isRomanticPhrase && i < this.phrase!.length),
                    })
                }

            }
            update(dtRatio: number) {
                this.y += this.speed * dtRatio
                if (this.y - this.length * scaledFontSize > height) {
                    this.reset()
                }
                for (let i = 0; i < this.chars.length; i++) {
                    const item = this.chars[i]
                    if (!item.isStatic) {
                        item.mutationTimer -= dtRatio
                        if (item.mutationTimer <= 0) {
                            item.char = ROMANTIC_CHARS[Math.floor(Math.random() * ROMANTIC_CHARS.length)]
                            item.mutationTimer = Math.floor(Math.random() * 60 + 20)
                        }
                    }
                }
            }
        }

        let streams: Stream[] = []
        const handleResize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2)
            width = canvas.width = window.innerWidth * dpr
            height = canvas.height = window.innerHeight * dpr
            scaledFontSize = fontSize * dpr
            scaledRadius = spotlightRadius * dpr
            const columns = Math.floor(width / (scaledFontSize * 0.9))
            streams = []
            for (let i = 0; i < columns; i++) {
                streams.push(new Stream(i * scaledFontSize * 0.9))
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)

        const onPointerMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            pointer.targetX = (e.clientX - rect.left) * dpr
            pointer.targetY = (e.clientY - rect.top) * dpr
            pointer.active = true
        }

        const onPointerLeave = () => {
            pointer.active = false
        }

        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerleave', onPointerLeave)
        let lastTime = performance.now()

        const render = (now: number) => {
            const dt = Math.min(now - lastTime, 64)
            const dtRatio = dt / 16.67
            lastTime = now
            if (pointer.active) {
                pointer.x += (pointer.targetX - pointer.x) * (0.12 * dtRatio)
                pointer.y += (pointer.targetY - pointer.y) * (0.12 * dtRatio)
            } else {
                pointer.idleAngle += 0.012 * dtRatio
                const wanderX = width * 0.5 + Math.cos(pointer.idleAngle) * (width * 0.28)
                const wanderY = height * 0.5 + Math.sin(pointer.idleAngle * 0.7) * (height * 0.22)
                pointer.x += (wanderX - pointer.x) * (0.04 * dtRatio)
                pointer.y += (wanderY - pointer.y) * (0.04 * dtRatio)
            }
            ctx.fillStyle = '#020104'
            ctx.fillRect(0, 0, width, height)
            ctx.font = `600 ${scaledFontSize}px "Courier New", monospace`
            ctx.textAlign = 'center'
            const radiusSq = scaledRadius * scaledRadius
            for (let s = 0; s < streams.length; s++) {
                const stream = streams[s]
                stream.update(dtRatio)
                const isPink = stream.colorType === 'pink'
                for (let i = 0; i < stream.chars.length; i++) {
                    const charY = stream.y - i * scaledFontSize
                    if (charY < -scaledFontSize * 0.5) continue
                    const charX = stream.x + scaledFontSize * 0.5
                    const dx = charX - pointer.x
                    const dy = charY - pointer.y
                    const distSq = dx * dx + dy * dy
                    const trailFactor = 1 - i / stream.length
                    let illumination = 0
                    if (distSq < radiusSq) {
                        const dist = Math.sqrt(distSq)
                        illumination = Math.pow(1 - dist / scaledRadius, 1.4)
                    }
                    const baseAlpha = 0.04 + trailFactor * 0.06
                    const brightAlpha = 0.35 + trailFactor * 0.65
                    const finalAlpha = baseAlpha + illumination * (brightAlpha - baseAlpha)

                    // Check if this is the leading head glyph (i === 0) or trailing glyphs
                    if (i === 0) {
                        if (illumination > 0.25) {
                            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, finalAlpha * 1.5)})`
                        } else {
                            ctx.fillStyle = isPink
                                ? `rgba(255, 130, 200, ${finalAlpha})`
                                : `rgba(150, 240, 255, ${finalAlpha})`
                        }
                    } else {
                        if (illumination > 0.45) {
                            ctx.fillStyle = isPink
                                ? `rgba(255, 20, 147, ${finalAlpha})`
                                : `rgba(0, 245, 255, ${finalAlpha})`
                        } else if (illumination > 0.1) {
                            ctx.fillStyle = isPink
                                ? `rgba(230, 40, 130, ${finalAlpha})`
                                : `rgba(0, 210, 230, ${finalAlpha})`
                        } else {
                            ctx.fillStyle = isPink
                                ? `rgba(150, 15, 80, ${finalAlpha})`
                                : `rgba(10, 100, 130, ${finalAlpha})`
                        }
                    }

                    // Draw the character
                    ctx.fillText(stream.chars[i].char, charX, charY)
                }
            }

            // 3. Atmospheric Flashlight Aura (drawn once after all streams finish)
            ctx.save()
            ctx.globalCompositeOperation = 'lighter'
            const aura = ctx.createRadialGradient(
                pointer.x,
                pointer.y,
                0,
                pointer.x,
                pointer.y,
                scaledRadius * 1.25
            )
            aura.addColorStop(0, 'rgba(255, 45, 135, 0.18)')
            aura.addColorStop(0.35, 'rgba(0, 240, 255, 0.10)')
            aura.addColorStop(0.75, 'rgba(180, 20, 120, 0.03)')
            aura.addColorStop(1, 'rgba(0, 0, 0, 0)')

            ctx.fillStyle = aura
            ctx.beginPath()
            ctx.arc(pointer.x, pointer.y, scaledRadius * 1.25, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()

            animId = requestAnimationFrame(render)
        }

        animId = requestAnimationFrame(render)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('pointermove', onPointerMove)
            window.removeEventListener('pointerleave', onPointerLeave)
        }




    }, [fontSize, spotlightRadius])
    return (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full" />
    )

}