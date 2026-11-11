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
                }
            }
        }

    })
}