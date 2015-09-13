import {linesIntersection}  from './linesIntersection'
import {boundingTriangle}  from './bounding'






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
    let x = c.x - triangle[0].x
    let y = c.y - triangle[0].y
    c.r = x*x + y*y


    return c
}

export const delaunay = points => {

    let rootTriangle = boundingTriangle( points )

    let triangles = [ rootTriangle ]
    let circles = [ computeCircle( rootTriangle ) ]


    points.forEach( point  => {
        
    })
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
