export interface HeartParticle {
    x:number
    y:number
    vx:number
    vy:number
    size:number
    rotation:number
    rotSpeed:number
    color:string
    life:number
    decay:number
    isHeart:boolean
}

export interface MercuryRipple{
    id:number
    x:number
    y:number
    radius:number
    maxRadius:number
    alpha:number
    speed:number
    colorSheen:string

}