import {linesIntersection}  from './linesIntersection'
import {pointOnSegment}  from './pointOnSegment'
import {boundingTriangle}  from './bounding'
import {squareDistance}  from './point'






const computeCircle = triangle => {

    // center of cisconscrit circle
    // = intersection of the three medians
    let c = linesIntersection(
        {
            x: (triangle[0].x + triangle[1].x )/2,
            y: (triangle[0].y + triangle[1].y )/2,
        },
        {
            x: (triangle[0].y - triangle[1].y ),
            y: -(triangle[0].x - triangle[1].x ),
        },
        {
            x: (triangle[2].x + triangle[1].x )/2,
            y: (triangle[2].y + triangle[1].y )/2,
        },
        {
            x: (triangle[2].y - triangle[1].y ),
            y: -(triangle[2].x - triangle[1].x ),
        }
    )

    // square radius of the cicle
    c.r = squareDistance( triangle[0], c )


    return c
}


// assuming the convexHull and the triangle share an edge
const expandConvexHull = (convexHull, triangle) => {

    let shared = []

    for( let i=convexHull.length; i--;)
        for( let j=triangle.length; j--;)
            if (convexHull[i] == triangle[j])
                shared.push({i:i, j:j})

    if ( shared.length != 2)
        throw 'no edge shared'

    let newVertice = ( shared[0].j + 1 ) % 3
    newVertice == shared[1].j && ( newVertice = ( shared[0].j + 2 ) % 3 )


    let index = Math.max( shared[0].i, shared[1].i ) + ( Math.min( shared[0].i, shared[1].i ) == 0 ? 1 : -1 )

    convexHull.splice( index, 0, triangle[ newVertice ] )
}
export const delaunay = points => {

    let rootTriangle = boundingTriangle( points )

    let triangles = [ rootTriangle ]
    let circles = [ computeCircle( rootTriangle ) ]


    points.forEach( point  => {

        // grab all the triangles for which p in contained in the circonscrit circle
        let concerned = []
        for( let i = circles.length; i--; )
            squareDistance( circles[ i ], point ) < circles[ i ].r && concerned.push( i )


        // build the convex hull with this
        let convexHull = []



        // in find all the circonscrit circle that point is on
        for( let i = circles.length; i--; )
            if ( squareDistance( circles[ i ], point ) < circles[ i ].r ) {

                // remove triangles
                circles.splice(i,1)
                const triangle = triangles.splice(i,1)[0]


                // check if the point is on a edge
                let a = 0,
                    b = 2

                // for each edge
                do {

                    if ( pointOnSegment( triangle[a], triangle[a], point ) ){
                        // the point is on the edge

                        // find all the triangles relative to this edge ( 1 or 2 )

                        return
                    }

                    a = b
                }
                while ( b-- )



                // expand the convex hull
                convexHull.length ? expandConvexHull( convexHull, triangle ) : convexHull.push( ...triangle )
            }

        // we have the empty convex hull
        let a = 0,
            b = convexHull.length -1

        // build the resulting triangles
        do {

            const triangle = [ convexHull[a], convexHull[b], point ]
            const circle = computeCircle( triangle )

            triangles.push( triangle )
            circles.push( circle )

            a = b
        }
        while ( b-- )

    })

    // remove the triangles formed with the rootTriangle
    // TODO

    return triangles
}






const epsylon = 0.00001


const success = ([
    [
        {x:0, y:10},
        {x:0, y:0},
        {x:10, y:0},
    ],
    [
        {x:100, y:10},
        {x:100, y:0},
        {x:110, y:0},
    ],
    [
        {x:0, y:10},
        {x:10, y:0},
        {x:0, y:0},
    ],
    [
        {x:-5, y:0},
        {x:0, y:5},
        {x:5, y:0},
    ],
    [
        {x:-15, y:0},
        {x:0, y:5},
        {x:5, y:0},
    ],
    [
        {x:100-15, y:0},
        {x:100, y:5},
        {x:105, y:0},
    ],
    [
        {x:123, y:120},
        {x:-230, y:1},
        {x:38, y:-522},
    ],
    [
        {x:-342, y:120},
        {x:21, y:-213},
        {x:438, y:400},
    ],
])
    .every( x => {
        const c = computeCircle( x )

        return x.every( p => Math.abs( (p.x-c.x)*(p.x-c.x) + (p.y-c.y)*(p.y-c.y)  -  c.r ) < epsylon )
    })
console.log( ' compute circonscrit circle ', !success ? 'unit test failed' : 'unit test ok' )





























0
