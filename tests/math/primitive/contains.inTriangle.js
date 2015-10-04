import {inTriangle}  from '../../../front/math/primitive/contains'
import {assert}  from '../../assert'


const epsylon = 0.0001

let samples = [

    [
        [0, 10],
        [0, 30],
        [2, 20],

        [0, 10],
        true
    ],

    [
        [0, 10],
        [0, 30],
        [2, 20],

        [1, 21],
        true
    ],

    [
        [0, 10],
        [0, 30],
        [2, 20],

        [100, 21],
        false
    ],

    [
        [0, 10],
        [2, 20],
        [0, 30],

        [0, 30],
        true
    ],
    [
        [170.42721, 170.42721 ],
        [250.83458, 550.83458 ],
        [210.41682, 210.41682 ],

        [200, 250 ],
        true
    ],
    [
        [170.42721, 170.42721 ],
        [250.83458, 550.83458 ],
        [210.41682, 210.41682 ],

        [310.41682, 310.41682 ],
        false
    ],
    [
        [31.5, 13.3],
        [32, 15.7],
        [38, 13.3],

        [37,  8.5],
        false
    ],
]
samples = [ ...samples, ...samples.map( x => [ x[1], x[2], x[0], ...x.slice(3) ]  ), ...samples.map( x => [ x[2], x[0], x[1], ...x.slice(3) ]  ) ]

const success =
samples
    .every( x => inTriangle(x.slice(0,3), [1,0,2], x[3]) == x[4] )

assert( success , 'in triangle' )
