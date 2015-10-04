import {inTriangle, trianglePonderation}  from '../../../front/math/primitive/contains'
import {assert}  from '../../assert'
import {vec2} from 'gl-matrix'


const epsylon = 0.0001

let samples = [

    [
        [0, 10],
        [0, 30],
        [2, 20],

        [0, 10],
    ],
    [
        [0, 10],
        [0, 30],
        [2, 20],

        [1, 21],
    ],

    [
        [0, 10],
        [0, 30],
        [2, 20],

        [100, 21],
    ],

    [
        [0, 10],
        [2, 20],
        [0, 30],

        [0, 30],
    ],
    [
        [170.42721, 170.42721 ],
        [250.83458, 550.83458 ],
        [210.41682, 210.41682 ],

        [310.41682, 310.41682 ],
    ],
    [
        [31.5, 13.3],
        [32, 15.7],
        [38, 13.3],

        [37, 8.5],
    ],
    [
        [21.5, 23.3],
        [22, 22.7],
        [23, 23.3],

        [22, 23],
    ],
]
samples = [ ...samples, ...samples.map( x => [ x[1], x[2], x[0], x[3] ]  ), ...samples.map( x => [ x[2], x[0], x[1], x[3] ]  ) ]

const success =
samples
    .filter( x => inTriangle( x.slice(0,3), [1,0,2], x[3] ) )
    .every( x => {
        const pond = trianglePonderation( x.slice(0,3), [1,0,2], x[3] )

        const p = pond.reduce( (X, n, i) =>

            vec2.scaleAndAdd( X, X, x[i], n)

        , [0,0])

        return     vec2.dist( p, x[3] ) < epsylon
                && Math.abs( pond.reduce( (sum, n) => sum+n ) -1 ) < epsylon
    })

assert( success , 'triangle ponderation' )
