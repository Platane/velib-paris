const epsylon = 0.00001
export const linesIntersection = ( A ,vA, B, vB ) => {

    if ( Math.abs( vA.x * vB.y - vA.y * vB.x ) < epsylon )
        return null

    let k
    if ( Math.abs(vB.x)<epsylon )
        k = ( B.x - A.x ) / vA.x

    else if ( Math.abs(vB.y)<epsylon )
        k = ( B.y - A.y ) / vA.y

    else
        k = ( ( A.x - B.x ) / vB.x  - ( A.y - B.y ) / vB.y  ) / ( vA.y / vB.y - vA.x / vB.x )

    return {
        x: A.x + vA.x * k,
        y: A.y + vA.y * k,
    }
}



let samples = ([
    [
        {x:0, y:10},
        {x:0, y:1},

        {x:10, y:0},
        {x:1, y:0},
    ],
    [
        {x:0, y:10},
        {x:0, y:6},

        {x:10, y:0},
        {x:7, y:0},
    ],
    [
        {x:13, y:10},
        {x:13, y:10},

        {x:17, y:5},
        {x:-17, y:-5},
    ],
    [
        {x:2, y:2},
        {x:1, y:1},

        {x:-3, y:3},
        {x:1, y:-1},
    ],
])
samples = samples.map( x => [ ...x, {x:0, y:0}]  )
samples = [ ...samples, ...samples.map( x => x.map( (x,i) => i%2 ? x : {x: x.x + 7234, y: x.y + 87} ) ) ]
samples = [ ...samples, ...samples.map( x => [ x[2], x[3], x[0], x[1], x[4] ]  ) ]

const success =
samples
    .every( x => {
        const c = linesIntersection( ...x.slice(0,4) )

        return Math.abs( c.x - x[4].x ) < epsylon && Math.abs( c.y - x[4].y ) < epsylon
    })
console.log( ' intersection lines ', !success ? 'unit test failed' : 'unit test ok' )
