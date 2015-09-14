import {delaunay} from './math/delaunay'
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
            .slice(0, 20)
            .map( x => ({
                x: +x.lat,
                y: +x.lng,
            }) )

        const box = boundingBox( points )

        points = points
            .map( p => ({
                x: ( p.x - box.min.x )/( box.max.x - box.min.x ) * 500,
                y: ( p.y - box.min.y )/( box.max.y - box.min.y ) * 500
            }) )


        return delaunay( points )

    })


    .then( triangles => {

        triangles
            .forEach( tr => {
                ctx.beginPath()
                ctx.moveTo( tr[0].x, tr[0].y )
                ctx.lineTo( tr[1].x, tr[1].y )
                ctx.lineTo( tr[2].x, tr[2].y )
                ctx.lineTo( tr[0].x, tr[0].y )
                ctx.stroke()
                ctx.fillStyle=`hsla( ${ Math.random()*360 }, ${ 70 }%, ${ 40 }%, 0.8 )`
                ctx.fill()
            })

    })

    .catch( err => console.error( err ))
