import {linesIntersection}  from './primitive/linesIntersection'
import {expandBoundingBox, boundingBox}  from './primitive/bounding'
import {squareDistance}  from './primitive/point'




export const computeCircle = triangle => {

    const [A,B,C] = triangle

    // center of cisconscrit circle
    // = intersection of the three medians
    let c = linesIntersection(
        {
            x: (A.x + B.x )/2,
            y: (A.y + B.y )/2,
        },
        {
            x: (A.y - B.y ),
            y: -(A.x - B.x ),
        },
        {
            x: (C.x + B.x )/2,
            y: (C.y + B.y )/2,
        },
        {
            x: (C.y - B.y ),
            y: -(C.x - B.x ),
        }
    )

    // square radius of the cicle
    c.r = squareDistance( A, c )


    return c
}


const switchFaces = ( faces, vertices ) =>
    faces.map( face => {

        const [a, b, c] = face

        if ( ( vertices[b].x - vertices[a].x ) * ( vertices[c].y - vertices[a].y ) - ( vertices[b].y - vertices[a].y ) * ( vertices[c].x - vertices[a].x ) >= 0 )
            return face

        else
            return [a, c, b]
    })

/**
 *  /!\ be sure that no points are equals
 *
 */
export const delaunay = points => {

    //// calc a wrapping triangle

    // calc the bounding box
    let box = boundingBox( points )
    box = expandBoundingBox( box, Math.max( box.max.x - box.min.x, box.max.y - box.min.y ) * 5  )

    // get the triangle that wrap this bounding triangle
    let rootTriangle = [
        box.min,
        { x: box.min.x,                              y: box.min.y + (box.max.y - box.min.y)*2 },
        { x: box.min.x + (box.max.x - box.min.x)*2,  y: box.min.y },
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
            (squareDistance( c, A ) < c.r && arr.push(i), arr)  ,[] )


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
                !arr.some( (edge_, j) => i != j && edge[0] == edge_[0] && edge[1] == edge_[1] )
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
    points.splice( -3, 3 )

    // remove the triangles formed with the rootTriangle
    triangles = triangles
        .filter( triangle => triangle.every( i => i < points.length ) )

    // all face must be oriented positive
    triangles = switchFaces( triangles, points )

    return triangles
}





























0
