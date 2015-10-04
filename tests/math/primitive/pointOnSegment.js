import {pointOnSegment}  from '../../../front/math/primitive/pointOnSegment'
import {assert}  from '../../assert'

let samples = [
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
]
samples = [ ...samples, ...samples.map( x => x.map( (x,i) => i==3 ? x : {x: x.x + 7234, y: x.y + 87} ) ) ]
samples = [ ...samples, ...samples.map( x => [ x[1], x[0], x[2], x[3] ]  ) ]

const success =
samples
    .every( x => pointOnSegment( ...x.slice(0,3) ) == x[3] )

assert( success , 'line pointOnSegment' )
