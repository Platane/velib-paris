import {delaunay} from './math/delaunay'
import {boundingBox} from './math/bounding'
import {get} from './service/request'


const canvas = document.createElement('canvas')
canvas.width = 600
canvas.height = 600
document.body.appendChild( canvas )
const ctx = canvas.getContext('2d')

get( 'http://localhost:8080/availability' )

    .then( res => {

        let points = res
            .map( x => ({
                x: x.lat,
                y: x.lng,
            }) )

        const box = boundingBox( points )

        points = points
            .map( p => ({
                x: ( p.x - box.min.x )/( box.max.x - box.min.x ) * 200,
                y: ( p.y - box.min.y )/( box.max.y - box.min.y ) * 200
            }) )


        return delaunay( points.slice(0, 1) )

    })


    .then( triangles => {

        triangles
            .forEach( tr => {
                ctx.beginPath()
                ctx.moveTo( tr[0].x, tr[0].y )
                ctx.lineTo( tr[1].x, tr[1].y )
                ctx.lineTo( tr[2].x, tr[2].y )
                ctx.stroke()
            })

    })

    .catch( err => console.error( err ))
