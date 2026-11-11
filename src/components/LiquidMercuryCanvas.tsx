import { useEffect, useRef } from "react";

interface MercuryWave {
    x: number
    y: number
    radius: number
    maxRadius: number
    speed: number
    amplitude: number
    decay: number
}

interface MercuryDroplet {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
    alpha: number
}

export function LiquidMercuryCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        let animationFrameId: number
        const waves: MercuryWave[] = []
        const droplets: MercuryDroplet[] = []
        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            ctx.scale(dpr, dpr)
        }
        resize()
        window.addEventListener('resize',resize)
        const createSplash = (clientX:number,clientY:number)=>{
            waves.push({
                x:clientX,
                y:clientY,
                radius:0,
                maxRadius:Math.max(window.innerWidth,window.innerHeight)*0.45,
                speed:4.5,
                amplitude:1.0,
                decay:0.012,
            })
            setTimeout(()=>{
                waves.push({
                    x:clientX,
                    y:clientY,
                    radius:0,
                    maxRadius:Math.max(window.innerWidth,window.innerHeight)*0.35,
                    speed:3.5,
                    amplitude:0.7,
                    decay:0.016,
                })
            },70)

            const dropletCount = 6 + Math.floor(Math.random()*5) 
            for(let i=0;i<dropletCount;i++){
                const angle = Math.random() * Math.PI*2
                const speed = Math.random()*4+2
                droplets.push({
                    x:clientX,
                    y:clientY,
                    vx:Math.cos(angle)*speed,
                    vy:Math.sin(angle)*speed,
                    radius:Math.random()*3+2,
                    alpha:1.0,
                })

            }
        }
        const handlePointerDown = (e:PointerEvent)=>{
            createSplash(e.clientX,e.clientY)
        }
        window.addEventListener('pointerdown',handlePointerDown)
        const animate = () =>{
            ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
            for(let i = waves.length-1;i>=0;i--){
                const w = waves[i]
                w.radius += w.speed
                w.amplitude -= w.decay

                if(w.amplitude<=0 || w.radius>=w.maxRadius){
                    waves.splice(i,1)
                    continue
                }

                ctx.save()
                ctx.beginPath()
                ctx.arc(w.x,w.y,w.radius,0,Math.PI*2)
                ctx.strokeStyle=`rgba(0,240,255,${w.amplitude*0.3})`
                ctx.lineWidth=6*w.amplitude
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(w.x,w.y,Math.max(0,w.radius-2),0,Math.PI*2)
                ctx.strokeStyle=`rgba(255,255,255,${w.amplitude*0.85})`
                ctx.shadowBlur=12*w.amplitude
                ctx.shadowColor='#00f0ff'
                ctx.lineWidth=2.5*w.amplitude
                ctx.stroke()
                ctx.beginPath()
                ctx.arc(w.x,w.y,w.radius+3,0,Math.PI*2)
                ctx.strokeStyle=`rgba(255,0,127,${w.amplitude*0.25})`
                ctx.lineWidth=4*w.amplitude
                ctx.stroke()
                ctx.restore()
            }
            for (let i=droplets.length-1;i>=0;i--){
                const d = droplets[i]
                d.x+=d.vx
                d.y+=d.vy
                d.vx*=0.94
                d.vy*=0.94
                d.alpha-=0.02
                if(d.alpha<=0){
                    droplets.splice(i,1)
                    continue
                }
                ctx.save()
                const grad = ctx.createRadialGradient(
                    d.x - d.radius * 0.3,
                    d.y - d.radius * 0.3,
                    d.radius * 0.1,
                    d.x,
                    d.y,
                    d.radius
                )
                grad.addColorStop(0,'#ffffff')
                grad.addColorStop(0.5,"#a0a5b8")
                grad.addColorStop(1,'#080910')
                ctx.beginPath()
                ctx.arc(d.x,d.y,d.radius,0,Math.PI*2)
                ctx.fillStyle=grad
                ctx.globalAlpha=d.alpha
                ctx.shadowBlur=8
                ctx.shadowColor='#00f0ff'
                ctx.fill()
                ctx.restore()
            }
            animationFrameId = requestAnimationFrame(animate)
        }
        animate()
        return()=>{
            window.removeEventListener('resize',resize)
            window.removeEventListener('pointerdown',handlePointerDown)
            cancelAnimationFrame(animationFrameId)
        }
    },[])
    return (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 w-full h-full"/>
        
    )
}