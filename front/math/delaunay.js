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


    convexHull.splice( shared[0].i, 0, triangle[ newVertice ] )
}
export const delaunay = points => {

    let rootTriangle = boundingTriangle( points )

    let triangles = [ rootTriangle ]
    let circles = [ computeCircle( rootTriangle ) ]


    points.forEach( (point, i)  => {

        if ( i>4 )
            return

        // grab all the triangles for which p is contained in the circonscrit circle
        let concerned = circles.reduce( (arr, c, i) =>
            (squareDistance( c, point ) < c.r && arr.push(i), arr)  ,[] )


        // build the convex hull with this
        let convexHull = concerned.reduce( (hull, i) =>
            (hull.length ? expandConvexHull( hull, triangles[i] ) : hull.push( ...triangles[i] ), hull ) , [] )


        // determine if the point is on the edge of the hull
        const onEdge = convexHull.some( (x, a, arr) =>
            pointOnSegment( convexHull[a], convexHull[ (a+1)%arr.length ], point )  )


        if (!onEdge){
            // the point is not on an edge, the resulting triangle will be acceptable ( not flat )
            // delete the triangles,
            // build new one formed by joiningeach edge of the hull with the point


            concerned
                .reverse()
                .forEach( i => {
                    triangles.splice(i,1)
                    circles.splice(i,1)
                })

            convexHull.forEach( (x, a, arr) => {
                let b = (a+1)%arr.length

                const triangle = [ convexHull[a], convexHull[b], point ]
                const circle = computeCircle( triangle )

                triangles.push( triangle )
                circles.push( circle )
            })

        } else {
            // the point is not on an edge
            // find all the triangles relative to this edge ( 1 or 2 )
            // split along the edge

            concerned
                .reverse()
                .forEach( i => {
                    const triangle = triangles[i]

                    let a,b
                    const onEdge = triangle.some( (_, _a) =>
                        pointOnSegment( triangle[ a = _a ], triangle[ b = (_a+1)%3 ], point )   )

                    if (onEdge){
                        const c = ( b + 1 ) % 3

                        // delete the triangle
                        triangles.splice(i,1)
                        circles.splice(i,1)

                        // build some news
                        let tr

                        tr = [ triangle[a], triangle[c], point ]
                        circles.push( computeCircle( tr ) )
                        triangles.push( tr )

                        tr = [ triangle[c], triangle[b], point ]
                        circles.push( computeCircle( tr ) )
                        triangles.push( tr )
                    }
                })
        }
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
