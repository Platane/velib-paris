import {delaunay} from './math/delaunay'
import {boundingBox} from './math/bounding'
import {get} from './service/request'


const canvas = document.createElement('canvas')
canvas.width = 800
canvas.height = 800
document.body.appendChild( canvas )
const ctx = canvas.getContext('2d')

const colors=Array.apply(null, Array(100))
    .map( () => `hsla( ${ Math.random()*360 }, ${ 70 }%, ${ 40 }%, 0.8 )` )

window.drawH = ( h ) => {

    ctx.clearRect(0, 0, canvas.width, canvas.height )

    h.triangles
        .forEach( (tr, i) => {
            ctx.beginPath()
            ctx.moveTo( tr[0].x, tr[0].y )
            ctx.lineTo( tr[1].x, tr[1].y )
            ctx.lineTo( tr[2].x, tr[2].y )
            ctx.lineTo( tr[0].x, tr[0].y )
            ctx.strokeStyle = '#333'
            ctx.stroke()
            ctx.fillStyle= h.concerned && h.concerned.indexOf( i ) >= 0 ? 'rgba(100,100,100,0.4)' : colors[ i ]
            ctx.fill()
        })

    if( h.hull ) {
        ctx.beginPath()
        ctx.moveTo( h.hull[ h.hull.length-1 ].x,  h.hull[ h.hull.length-1 ].y )
        h.hull
            .forEach( (p, i, arr) =>
                ctx.lineTo( p.x, p.y )  )
        ctx.strokeStyle = '#333'
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.lineWidth = 1
    }
    if( h.point ) {
        ctx.beginPath()
        ctx.arc( h.point.x, h.point.y, 5, 0, Math.PI*2 )
        ctx.fillStyle='#333'
        ctx.fill()
    }

    // h.circles
    //     .forEach( (c, i) => {
    //         ctx.beginPath()
    //         ctx.arc( c.x, c.y, Math.sqrt(c.r), 0, Math.PI*2 )
    //         ctx.strokeStyle = colors[ i ]
    //         ctx.stroke()
    //     })
}

window.points = Array.apply(null, Array(100)).map( () => ({x: Math.random()* 500 +50, y: Math.random()* 500 +50}) )



window.hh = delaunay( window.points )

get( 'http://localhost:8080/availability' )

    .then( res => {

        let points = res
            .map( x => ({
                x: +x.lat,
                y: +x.lng,
            }) )

        const box = boundingBox( points )

        points = points
            .map( p => ({
                x: ( p.x - box.min.x )/( box.max.x - box.min.x ) * 300 +50,
                y: ( p.y - box.min.y )/( box.max.y - box.min.y ) * 300 +50
            }) )


        return delaunay( points )

    })


    .then( h => {

        window.hh = h

        window.drawH( h[16] )

    })

    .catch( err => console.error( err ))
