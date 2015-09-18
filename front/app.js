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
            }) )

        let values = res
            .map( x => x.av.split(';').slice(-1)[0].split(',').slice(-1)[0] / x.total )

        const box = boundingBox( points )

        points = points
            .map( p => ({
                x: ( p.x - box.min.x )/( box.max.x - box.min.x ) * 900 +10,
                y: ( p.y - box.min.y )/( box.max.y - box.min.y ) * 900 +10
            }) )


        const triangles = delaunay( points )

        triangles.forEach( (tr, i) => {
                ctx.beginPath()
                ctx.moveTo( tr[0].x, tr[0].y )
                ctx.lineTo( tr[1].x, tr[1].y )
                ctx.lineTo( tr[2].x, tr[2].y )
                ctx.lineTo( tr[0].x, tr[0].y )
                ctx.strokeStyle = '#333'
                ctx.stroke()
                ctx.fillStyle= `hsla( ${ Math.random()*360 }, ${ 70 }%, ${ 40 }%, 0.8 )`
                ctx.fill()
            })


        map( triangles, values, boundingBox( points ) )

    })

    .catch( err => console.error( err ))
