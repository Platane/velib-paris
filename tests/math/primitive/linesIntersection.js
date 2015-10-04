import {linesIntersection}  from '../../../front/math/primitive/linesIntersection'
import {assert}  from '../../assert'
import {vec2} from 'gl-matrix'


const epsylon = 0.00001

let samples = [
    [
        [0, 10],
        [0, 1],

        [10, 0],
        [1, 0],
    ],
    [
        [0, 10],
        [0, 6],

        [10, 0],
        [7, 0],
    ],
    [
        [13, 10],
        [13, 10],

        [17, 5],
        [-17, -5],
    ],
    [
        [2, 2],
        [1, 1],

        [-3, 3],
        [1, -1],
    ],
]
samples = samples.map( x => [ ...x, [0, 0] ]  )
samples = [ ...samples, ...samples.map( x => x.map( (x,i) => i%2 ? x : vec2.add( x, x, [1212, -75] ) ) ) ]
samples = [ ...samples, ...samples.map( x => [ x[2], x[3], x[0], x[1], x[4] ]  ) ]

const success =
samples
    .every( x => {
        const c = linesIntersection( ...x.slice(0,4) )

        return vec2.dist( c, x[4] ) < epsylon
    })

assert( success , 'line intersection' )
