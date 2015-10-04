import {computeCircle}  from '../../../front/math/delaunay'
import {assert}  from '../../assert'
import {vec2} from 'gl-matrix'



const epsylon = 0.00001


const success = [
    [
        [0,10],
        [0,0],
        [10,0],
    ],
    [
        [100,10],
        [100,0],
        [110,0],
    ],
    [
        [0,10],
        [10,0],
        [0,0],
    ],
    [
        [-5,0],
        [0,5],
        [5,0],
    ],
    [
        [-15,0],
        [0,5],
        [5,0],
    ],
    [
        [100-15,0],
        [100,5],
        [105,0],
    ],
    [
        [123,120],
        [-230,1],
        [38,-522],
    ],
    [
        [-342,120],
        [21,-213],
        [438,400],
    ],
]
    .every( x => {
        const {X,r} = computeCircle( x )

        return x.every( p => Math.abs( vec2.sqrDist(p, X) - r ) < epsylon )
    })

assert( success , 'circonscrit circle' )
