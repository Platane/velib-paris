import {inTriangle}  from '../../../front/math/contains'
import {assert}  from '../../assert'


const epsylon = 0.0001

let samples = [

    [
        {x:0, y:10},
        {x:0, y:30},
        {x:2, y:20},

        {x:1, y:21},
        true
    ],

    [
        {x:0, y:10},
        {x:0, y:30},
        {x:2, y:20},

        {x:100, y:21},
        false
    ],

    [
        {x:0, y:10},
        {x:2, y:20},
        {x:0, y:30},

        {x:0, y:30},
        true
    ],
    [
        {x:170.42721, y:170.42721 },
        {x:250.83458, y:550.83458 },
        {x:210.41682, y:210.41682 },

        {x:200, y:250 },
        true
    ],
    [
        {x:170.42721, y:170.42721 },
        {x:250.83458, y:550.83458 },
        {x:210.41682, y:210.41682 },

        {x:310.41682, y:310.41682 },
        false
    ],
    [
        {x:31.5, y:13.3},
        {x:32, y:15.7},
        {x:38, y:13.3},

        { x: 37, y: 8.5 },
        false
    ],
]
samples = [ ...samples, ...samples.map( x => [ x[1], x[2], x[0], ...x.slice(3) ]  ), ...samples.map( x => [ x[2], x[0], x[1], ...x.slice(3) ]  ) ]

const success =
samples
    .every( x => inTriangle(x.slice(0,3), x[3]) == x[4] )

assert( success , 'in triangle' )
