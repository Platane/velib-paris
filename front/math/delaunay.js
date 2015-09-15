import {linesIntersection}  from './linesIntersection'
import {pointOnSegment}  from './pointOnSegment'
import {boundingTriangle, expandBoundingBox, boundingBox}  from './bounding'
import {squareDistance}  from './point'




export const computeCircle = triangle => {

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
let history
export const getHistory = () => history
export const delaunay = points => {

    let box = boundingBox( points )
    box = expandBoundingBox( box, Math.max( box.max.x - box.min.x, box.max.y - box.min.y ) * 0.2  )

    let rootTriangle = boundingTriangle( box )

    let triangles = [ rootTriangle ]
    let circles = [ computeCircle( rootTriangle ) ]


    history = []
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


        history.push({ triangles: triangles.slice(),  circles: circles.slice() })

    })


    // remove the triangles formed with the rootTriangle
    triangles = triangles
        .filter( triangle =>   !triangle.some( x => rootTriangle.some( y => x == y ) )  )


    history.push({ triangles: triangles.slice() })

    return triangles
}





























0
