import {computeCircle}  from '../../../front/math/delaunay'
import {assert}  from '../../assert'



const epsylon = 0.00001


const success = [
    [
        {x:0, y:10},
        {x:0, y:0},
        {x:10, y:0},
    ],
    [
        {x:100, y:10},
        {x:100, y:0},
        {x:110, y:0},
    ],
    [
        {x:0, y:10},
        {x:10, y:0},
        {x:0, y:0},
    ],
    [
        {x:-5, y:0},
        {x:0, y:5},
        {x:5, y:0},
    ],
    [
        {x:-15, y:0},
        {x:0, y:5},
        {x:5, y:0},
    ],
    [
        {x:100-15, y:0},
        {x:100, y:5},
        {x:105, y:0},
    ],
    [
        {x:123, y:120},
        {x:-230, y:1},
        {x:38, y:-522},
    ],
    [
        {x:-342, y:120},
        {x:21, y:-213},
        {x:438, y:400},
    ],
]
    .every( x => {
        const c = computeCircle( x )

        return x.every( p => Math.abs( (p.x-c.x)*(p.x-c.x) + (p.y-c.y)*(p.y-c.y)  -  c.r ) < epsylon )
    })

assert( success , 'circonscrit circle' )
