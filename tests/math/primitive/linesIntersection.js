import {linesIntersection}  from '../../../front/math/linesIntersection'
import {assert}  from '../../assert'


const epsylon = 0.00001

let samples = [
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
]
samples = samples.map( x => [ ...x, {x:0, y:0}]  )
samples = [ ...samples, ...samples.map( x => x.map( (x,i) => i%2 ? x : {x: x.x + 7234, y: x.y + 87} ) ) ]
samples = [ ...samples, ...samples.map( x => [ x[2], x[3], x[0], x[1], x[4] ]  ) ]

const success =
samples
    .every( x => {
        const c = linesIntersection( ...x.slice(0,4) )

        return Math.abs( c.x - x[4].x ) < epsylon && Math.abs( c.y - x[4].y ) < epsylon
    })

assert( success , 'line intersection' )
