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

// let hull = [ ...hullEdges.shift() ]
// while( hullEdges.length ){
//     const A = hull[ 0 ]
//     let index
//     const isOk = hullEdges.some( (edge, i) =>
//         (index =i, ( edge[0] == A && hull.unshift( edge[1] ) ) || ( edge[1] == A && hull.unshift( edge[0] ) ) )    )
//
//     hullEdges.splice( index, 1 )
// }
export const delaunay = points => {

    let rootTriangle = boundingTriangle( points )

    let triangles = [ rootTriangle ]
    let circles = [ computeCircle( rootTriangle ) ]


    let history = []
    history.push({ triangles: triangles.slice(),  circles: circles.slice() })

    points.forEach( (point, i)  => {

        // grab all the triangles for which p is contained in the circonscrit circle
        let concerned = circles.reduce( (arr, c, i) =>
            (squareDistance( c, point ) < c.r && arr.push(i), arr)  ,[] )


        // build the convex hull with this
        let hullEdges = concerned.reduce( (arr, i) => {

                arr.push([ triangles[i][0], triangles[i][1] ])
                arr.push([ triangles[i][1], triangles[i][2] ])
                arr.push([ triangles[i][2], triangles[i][0] ])

                return arr
            }, [])

            .filter( (edge, i, arr) =>
                edge.length && !arr
                    .some( (e, j) => i != j && ( ( e[0]==edge[0] && e[1]==edge[1] ) || ( e[0]==edge[1] && e[1]==edge[0] ) )  )

            )

        // for( let i = hullEdges.length; i--; ){
        //
        //     for( let i = j-1; i--; )
        //
        //         if( ( hullEdges[i][0] == hullEdges[j][0] && hullEdges[i][1] == hullEdges[j][1] ) || ( hullEdges[i][1] == hullEdges[j][0] && hullEdges[i][0] == hullEdges[j][1] ) ){
        //
        //             hullEdges.splice(i--, 1)
        //             hullEdges.splice(j, 1)
        //
        //             break
        //         }
        // }






        // determine if the point is on the edge of the hull
        const onEdge = hullEdges.some( edge =>
            pointOnSegment( edge[0], edge[1], point )  )


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

            hullEdges.forEach( edge => {

                const triangle = [ edge[0], edge[1], point ]
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

        history.push({ triangles: triangles.slice(),  circles: circles.slice() })

    })


    // remove the triangles formed with the rootTriangle
    // TODO

    return history
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
