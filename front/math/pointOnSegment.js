const epsylon = 0.00001
export const pointOnSegment = ( A, B, N ) => {

    let ABx = B.x - A.x
    let ABy = B.y - A.y

    let ANx = N.x - A.x
    let ANy = N.y - A.y

    return Math.abs( ANx * ABy - ANy * ABx ) < epsylon && ANx * ABx + ANy * ABy > -epsylon && (N.x - B.x) * ABx - (N.x - B.x) * ABy < epsylon
}


let samples = ([
    [
        {x:0, y:1},
        {x:0, y:-1},
        {x:1, y:0},
        false
    ],
    [
        {x:0, y:1},
        {x:0, y:-1},
        {x:0, y:0.2},
        true
    ],
    [
        {x:6, y:2},
        {x:-3, y:-1},
        {x:0, y:0},
        true
    ],
    [
        {x:3, y:1},
        {x:-3, y:-1},
        {x:6, y:2},
        false
    ],
    [
        {x:3, y:1},
        {x:-3, y:-1},
        {x:-6, y:-2},
        false
    ],
    [
        {x:3, y:1},
        {x:-3, y:-1},
        {x:-3, y:-1},
        true
    ],
    [
        {x:3, y:1},
        {x:-3, y:-1},
        {x:3, y:1},
        true
    ],
])
samples = [ ...samples, ...samples.map( x => x.map( (x,i) => i==3 ? x : {x: x.x + 7234, y: x.y + 87} ) ) ]
samples = [ ...samples, ...samples.map( x => [ x[1], x[0], x[2], x[3] ]  ) ]

const success =
samples
    .every( x => pointOnSegment( ...x.slice(0,3) ) == x[3] )
console.log( ' pointOnSegment ', !success ? 'unit test failed' : 'unit test ok' )
