import { useEffect, useRef } from "react";
import type { HeartParticle } from "../types";

const CYBER_COLORS = [
    '#00f0ff', '#ff007f', '#ffffff', '#7928ca'
]

export function HeartCursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        const particles: HeartParticle[] = []
        let lastX = 0
        let lastY = 0
        let hasMoved = false
        let colorIndex = 0
        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            ctx.scale(dpr, dpr)
        }
        resize()
        window.addEventListener('resize', resize)

        const drawHeart = (
            x: number,
            y: number,
            size: number,
            rotation: number,
            color: string
        )=>{
            ctx.save()
            ctx.translate(x,y)
            ctx.rotate(rotation)
            ctx.scale(size/16,size/16)
            ctx.beginPath()
            ctx.moveTo(0,-4)
            ctx.bezierCurveTo(-5,-12,-14,-8,-14,0)
            ctx.bezierCurveTo(-14,6,-6,12,0,16)
            ctx.bezierCurveTo(6,12,14,6,14,0)
            ctx.bezierCurveTo(14,-8,5,-12,0,-4)
            ctx.closePath()

            ctx.shadowBlur =10
            ctx.shadowColor=color
            ctx.strokeStyle=color
            ctx.lineWidth=1.6
            ctx.stroke()
            ctx.fillStyle = color === '#ffffff' ? 'rgba(255,255,255,0.4)':`${color}33`
            ctx.fill()
            ctx.restore()
        }

        const drawSpark = (x:number,y:number,size:number,color:string)=>{
            ctx.save()
            ctx.translate(x,y)
            ctx.shadowBlur=8
            ctx.shadowColor=color
            ctx.fillStyle=color
            
            ctx.beginPath()
            ctx.moveTo(0,-size*1.5)
            ctx.lineTo(size*0.3,-size*0.3)
            ctx.lineTo(size*1.5,0)
            ctx.lineTo(size*0.3,size*0.3)
            ctx.lineTo(0,size*1.5)
            ctx.lineTo(-size*0.3,size*0.3)
            ctx.lineTo(-size*1.5,0)
            ctx.lineTo(-size*0.3,-size*0.3)
            ctx.closePath()
            ctx.fill()
            ctx.restore()
        }

        const onPointerMove=(clientX:number,clientY:number)=>{
            if(hasMoved){
                const vx = clientX - lastX
                const vy = clientY - lastY
                const speed = Math.hypot(vx,vy)
                const spawnCount = Math.min(Math.floor(speed/6)+1,4)
                for (let i=0;i<spawnCount;i++){
                    colorIndex =(colorIndex + 1)%CYBER_COLORS.length
                    const  isHeart=Math.random()>0.35

                    particles.push({
                        x:clientX+(Math.random()-0.5)*10,
                        y:clientY +(Math.random()-0.5)*10,
                        vx:vx*0.12+(Math.random()-0.5)*1.5,
                        vy:vy*0.12-Math.random()*1.4-0.5,
                        size:isHeart?Math.random()*8+8:Math.random()*3+2,
                        rotation:(Math.random()-0.5)*Math.PI,
                        rotSpeed:(Math.random()-0.5)*0.05,
                        color:CYBER_COLORS[colorIndex],
                        life:1.0,
                        decay:Math.random()*0.02+0.015,
                        isHeart,
                    })
                }
            }else{
                hasMoved = true
            }
            lastX=clientX
            lastY=clientY
        }

        const handleMouseMove = (e:MouseEvent)=>onPointerMove(e.clientX,e.clientY)
        const handleTouchMove = (e:TouchEvent)=>{if (e.touches.length>0){
            onPointerMove(e.touches[0].clientX,e.touches[0].clientY)
        }}

        window.addEventListener('mousemove',handleMouseMove)
        window.addEventListener('touchmove',handleTouchMove,{passive:true})

        const animate = ()=>{
            ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
            ctx.globalCompositeOperation = 'lighter'
            for(let i=0;i<particles.length;i++){
                for(let j=i+1;j<particles.length;j++){
                    const p1 = particles[i]
                    const p2 = particles[j]
                    const dist = Math.hypot(p1.x-p2.x,p1.y-p2.y)
                    if(dist<40){
                        const alpha = (1-dist/40)*Math.min(p1.life,p2.life)*0.25
                        ctx.strokeStyle = `rgba(0,240,255,${alpha})`
                        ctx.lineWidth = 0.8
                        ctx.beginPath()
                        ctx.moveTo(p1.x,p1.y)
                        ctx.lineTo(p2.x,p2.y)
                        ctx.stroke()
                    }
                }
                

            }
            for(let i=particles.length-1;i>=0;i--){
                const p = particles[i]
                p.x+=p.vx
                p.y+=p.vy
                p.vx*=0.96
                p.vy*=0.96
                p.rotation+=p.rotSpeed
                p.life-=p.decay

                if(p.life<=0){
                    particles.splice(i,1)
                    continue
                }
                ctx.globalAlpha = p.life
                if(p.isHeart){
                    drawHeart(p.x,p.y,p.size* p.life,p.rotation,p.color)
                }else{
                    drawSpark(p.x,p.y,p.size * p.life,p.color)
                }

            }
            ctx.globalAlpha = 1.0
            ctx.globalCompositeOperation = 'source-over'
            animationFrameId = requestAnimationFrame(animate)
        }
        animate()

        return () =>{
            window.removeEventListener('resize',resize)
            window.removeEventListener('mousemove',handleMouseMove)
            window.removeEventListener('touchmove',handleTouchMove)
            cancelAnimationFrame(animationFrameId)
        }

    },[])
    return (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full"/>    )
}