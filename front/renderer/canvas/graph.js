import {delaunay} from '../../math/delaunay'
import {boundingBox} from '../../math/primitive/bounding'




export function graph( points, size, canvas ){

    const box = boundingBox( points )

    // fix resolution
    const larger = Math.max( box.max.x - box.min.x, box.max.y - box.min.y )
    points = points
        .map( p => ({
            ...p,
            x: ( p.x - box.min.x )/larger * 100,
            y: ( p.y - box.min.y )/larger * 100,
        })  )

    const ctx = canvas.getContext('2d')
    const proj = p => ({
        x: p.x/100*size,
        y: p.y/100*size,
    })
    const moveTo = p => {
        p = proj( p )
        ctx.moveTo( p.x, p.y )
    }
    const lineTo = p => {
        p = proj( p )
        ctx.lineTo( p.x, p.y )
    }
    const arc = (p, ...rest) => {
        p = proj( p )
        ctx.arc( p.x, p.y, ...rest )
    }

    // compute triangulation
    const triangles = delaunay( points )

    ctx.save()
    ctx.strokeStyle = '#333'
    triangles.forEach( (tr, i) => {
            ctx.beginPath()
            moveTo( tr[tr.length-1] )
            tr.forEach( lineTo )
            ctx.stroke()
        })
    ctx.restore()

    ctx.save()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 0.5
    points.forEach( p => {

        ctx.beginPath()
        arc(p, 5, 0, Math.PI*2)
        ctx.fillStyle= `hsl( ${ 360 - p.value*300 }, ${ 70 }%, ${ 40 }% )`
        ctx.fill()
        ctx.stroke()

    })
    ctx.restore()
}
