import {delaunay} from '../delaunay'
import {boundingBox} from '../primitive/bounding'

export const tesselate = ( points ) => {

    const box = boundingBox( points )

    // fix resolution
    const larger = Math.max( box.max.x - box.min.x, box.max.y - box.min.y )
    points = points
        .map( p => ({
            ...p,
            x: ( p.x - box.min.x )/larger * 100,
            y: ( p.y - box.min.y )/larger * 100,
        })  )



    const triangles = delaunay(points)



    const vertices = points
        .map( p => [ p.x, p.y, p.value ] )

    const faces = triangles.map( tri => tri.map( p => points.indexOf( p ) ) )

    return { vertices, faces }
}
