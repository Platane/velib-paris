import {vec3, vec2} from 'gl-matrix'
import {delaunay} from '../delaunay'
import {boundingBox} from '../bounding'
import {trianglePonderation} from '../contains'


export const tesselate = ( points ) => {

    const box = boundingBox( points )

    // fix resolution
    const larger = Math.max( box.max.x - box.min.x, box.max.y - box.min.y )
    points = points
        .map( p => ({
            ...p,
            x: ( p.x - box.min.x - ( box.max.x - box.min.x )/2  )/larger * 100,
            y: ( p.y - box.min.y - ( box.max.y - box.min.y )/2  )/larger * 100,
        })  )



    const triangles = delaunay(points)



    let vertices = points
        .map( p => [ p.x, p.y, p.value *3 ] )

    let faces = triangles
        .map( tri => tri.map( p => points.indexOf( p ) ) )


    // tesselate

    const minArea = 0.1

    const interpolate = ( N, _triangle ) => {

        const triangle = _triangle.map( x => ({x: x[0], y:x[1]}) )

        let pond = trianglePonderation( triangle, {x: N[0], y:N[1]} )

        pond = pond.map( x => x*x )

        const sum = pond.reduce( (sum, x) => sum + x )

        pond = pond.map( x => x/sum )

        return pond.reduce( (sum, x, i) => sum + x * _triangle[i][2] ,0)
    }

    // side effect on vertices and faces
    const tess = ( face, ABC ) => {

        const AB = vec2.subtract([], vertices[ face[1] ], vertices[ face[0] ])
        const AC = vec2.subtract([], vertices[ face[2] ], vertices[ face[0] ])

        const area = Math.abs( vec2.cross( [], AB, AC )[2] )

        if (area < minArea)
            return [face]

        // triforce split

        const mid = face
            .map( (x, i) =>
                vec2.lerp([], vertices[ face[ (i+1)%3 ] ], vertices[ face[ (i+2)%3 ] ], 0.5)  )

            .map( x => (x[2] = interpolate( x, ABC ), x) )



        const newFaces = face
            .map( (k,i) => [ k, vertices.length + (i+1)%3, vertices.length + (i+2)%3 ] )

        newFaces.push( [vertices.length+1, vertices.length, vertices.length+2] )

        vertices.push( ...mid )

        return newFaces
            .reduce( (arr, face) => arr.concat( tess( face, ABC ) ), [] )
    }

    faces = faces
        .reduce( (arr, face) => arr.concat( tess( face, face.map( k => vertices[ k ] ) ) ), [])


    return { vertices, faces }
}
