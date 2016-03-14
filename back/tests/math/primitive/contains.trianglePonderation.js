import {trianglePonderation}  from '../../../front/math/primitive/contains'
import {assert}  from '../../assert'


const epsylon = 0.0001

let samples = [

    [
        {x:0, y:10},
        {x:0, y:30},
        {x:2, y:20},

        {x:1, y:21},
    ],

    [
        {x:0, y:10},
        {x:0, y:30},
        {x:2, y:20},

        {x:100, y:21},
    ],

    [
        {x:0, y:10},
        {x:2, y:20},
        {x:0, y:30},

        {x:0, y:30},
    ],
    [
        {x:170.42721, y:170.42721 },
        {x:250.83458, y:550.83458 },
        {x:210.41682, y:210.41682 },

        {x:310.41682, y:310.41682 },
    ],
    [
        {x:31.5, y:13.3},
        {x:32, y:15.7},
        {x:38, y:13.3},

        { x: 37, y: 8.5 },
    ],
    [
        {x:21.5, y:23.3},
        {x:22, y:22.7},
        {x:23, y:23.3},

        { x: 22, y: 23 },
    ],
]
samples = [ ...samples, ...samples.map( x => [ x[1], x[2], x[0], x[3] ]  ), ...samples.map( x => [ x[2], x[0], x[1], x[3] ]  ) ]

const success =
samples
    .every( x => {
        const pond = trianglePonderation( x.slice(0,3), x[3] )

        const p = pond.reduce( (p, n, i) => {
            p.x += n * x[ i ].x
            p.y += n * x[ i ].y

            return p
        }, {x:0, y:0})

        return     Math.abs( p.x - x[3].x ) < epsylon
                && Math.abs( p.y - x[3].y ) < epsylon
                && Math.abs( pond.reduce( (sum, n) => sum+n ) -1 ) < epsylon
    })

assert( success , 'triangle ponderation' )
