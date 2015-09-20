import {delaunay} from './math/delaunay'
import {map} from './math/map'
import {boundingBox} from './math/bounding'
import {get} from './service/request'


const canvas = document.createElement('canvas')
canvas.width = 1000
canvas.height = 1000
document.body.appendChild( canvas )
const ctx = canvas.getContext('2d')

get( 'http://localhost:8080/availability' )

    .then( res => {

        let points = res
            .map( x => ({
                x: +x.coordinates[0],
                y: +x.coordinates[1],
                value: 0.1+ 0.9 * x.av.split(';').slice(-1)[0].split(',').slice(-1)[0] / x.total
            }) )


        const box = boundingBox( points )

        points
            .forEach( p => {
                p.x = ( p.x - box.min.x )/( box.max.x - box.min.x ) * 900 +10
                p.y = ( p.y - box.min.y )/( box.max.y - box.min.y ) * 900 +10
            })


        const triangles = delaunay( points )

        const {m,w} = map( triangles, points, boundingBox( points ), 200 )

        m.forEach( (value, n) => {

            let x = (n% w)
            let y = (0|(n/w))

            const l = 4

            ctx.beginPath()
            ctx.rect(x*l,y*l,l,l)
            ctx.fillStyle= `hsl( ${ 360 - value*300 }, ${ 70 }%, ${ 40 }% )`
            ctx.fill()

        })

        triangles.forEach( (tr, i) => {
                ctx.beginPath()
                ctx.moveTo( tr[0].x, tr[0].y )
                ctx.lineTo( tr[1].x, tr[1].y )
                ctx.lineTo( tr[2].x, tr[2].y )
                ctx.lineTo( tr[0].x, tr[0].y )
                ctx.strokeStyle = '#333'
                ctx.stroke()
            })

        points.forEach( p => {

            ctx.beginPath()
            ctx.arc(p.x, p.y, 10, 0, Math.PI*2)
            ctx.fillStyle= `hsl( ${ 360 - p.value*300 }, ${ 70 }%, ${ 40 }% )`
            ctx.fill()
            ctx.strokeStyle = '#333'
            ctx.stroke()

        })
    })

    .catch( err => console.error( err ))












































0
