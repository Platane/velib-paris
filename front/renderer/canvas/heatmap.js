import {delaunay} from '../../math/delaunay'
import {boundingBox} from '../../math/bounding'
import {map} from '../../math/map'



export function heatmap( points, resolution, size, canvas ){

    const box = boundingBox( points )

    // fix resolution
    const larger = Math.max( box.max.x - box.min.x, box.max.y - box.min.y )
    points = points
        .map( p => ({
            ...p,
            x: ( p.x - box.min.x )/larger * 100,
            y: ( p.y - box.min.y )/larger * 100,
        })  )

    const start = Date.now()
    const {m,w} = map( delaunay(points), points, boundingBox( points ), resolution )
    console.log('map function '+(Date.now()-start)+'ms')

    const ctx = canvas.getContext('2d')

    const l = size/resolution
    m.forEach( (value, n) => {

        let x = (n% w)
        let y = (0|(n/w))

        ctx.beginPath()
        ctx.rect(x*l, y*l, l, l)
        ctx.fillStyle= `hsl( ${ 360 - value*300 }, ${ 70 }%, ${ 40 }% )`
        ctx.fill()
    })
}
