import {linesIntersection}  from './primitive/linesIntersection'
import {expandBoundingBox, boundingBox}  from './primitive/bounding'
import {vec2} from 'gl-matrix'




const ortho = [ 0,1, -1,0 ]
export const computeCircle = triangle => {

    // center of cisconscrit circle
    // = intersection of the three medians
    const [A, B, C] = triangle

    const nAB = vec2.sub( [], B, A )
    vec2.transformMat2( nAB, nAB, ortho )

    const nAC = vec2.sub( [], C, A )
    vec2.transformMat2( nAC, nAC, ortho )

    let X = linesIntersection(

        vec2.lerp( [], A, B, 0.5 ),

        nAB,

        vec2.lerp( [], A, C, 0.5 ),

        nAC
    )

    return {
        // square radius of the cicle
        r: vec2.sqrDist( A, X ),

        // center of the circle
        X
    }
}


export const delaunay = points => {

    //// calc a wrapping triangle

    // calc the bounding box
    let box = boundingBox( points )
    expandBoundingBox( box, Math.max( box.max[0] - box.min[0], box.max[1] - box.min[1] ) * 0.2  )

    // get the triangle that wrap this bounding triangle
    let rootTriangle = [
        box.min,
        [ box.min[0], box.min[1] + (box.max[1] - box.min[1])*2 ],
        [ box.min[0] + (box.max[0] - box.min[0])*2, box.min[1] ],
    ]

    // prepare
    points.push( ...rootTriangle )

    let triangles = [ [points.length-1, points.length-2, points.length-3] ]
    let circles = [ computeCircle( rootTriangle ) ]

    points
        .slice( 0, -3 )
        .forEach( (A, i) => {

        // grab all the triangles for which p is contained in the circonscrit circle
        const concerned = circles.reduce( (arr, c, i) =>
            ( vec2.sqrDist( A, c.X ) < c.r && arr.push(i), arr)  ,[] )


        // build the convex hull with this
        const hullEdges = concerned.reduce( (arr, i) => {

                // push the all 3 edges of the triangle

                // grab the 3 edges
                const edges = triangles[i]
                    .map( (a, i, arr) => {
                        let b = arr[ (i+1)%3 ]

                        return a<b ? [ a, b ] : [ b, a ]
                    })

                return arr.concat( edges )
            }, [])

            // only keep unique edge
            .filter( (edge, i, arr) =>
                !arr.some( (edge_, j) => i != j && edge_[0] == edge_[0] && edge_[1] == edge_[1] )
            )

        // remove the triangles
        concerned
            .reverse()
            .forEach( i => {
                triangles.splice(i,1)
                circles.splice(i,1)
            })

        // form new triangles from the opened hull
        hullEdges.forEach( edge => {

            const triangle = [ edge[0], edge[1], i ]
            const circle = computeCircle( triangle.map( i => points[ i ] ) )

            triangles.push( triangle )
            circles.push( circle )
        })

    })

    // remove the root triangle
    points.slice( -3, 3 )

    // remove the triangles formed with the rootTriangle
    return triangles
        .filter( triangle => triangle.every( i => i < points.length ) )

}





























0
