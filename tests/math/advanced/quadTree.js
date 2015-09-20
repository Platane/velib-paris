import {expore, reccursivePartition}  from '../../../front/math/quadTree'
import {inTriangle}  from '../../../front/math/contains'
import {assert}  from '../../assert'


let samples = [
    [
        [
            [
                {x:1.5, y:1.3},
                {x:2, y:2.7},
                {x:3, y:1.3},
            ]
        ],
        {max:{x:0, y:0}, min:{x:50, y:50}},
    ],
]

const success = samples
    .every( x => {

        const partition = reccursivePartition( x[0], x[1], 16 )

        return Array.apply(null, Array(10000))
            .map( (_, n) =>
                ({
                    x: x[1].min.x + ( x[1].max.x - x[1].min.x ) * (n%100)/100,
                    y: x[1].min.y + ( x[1].max.y - x[1].min.y ) * (0|(n/100))/100,
            }) )
            .every( p =>
                   x[0].some( tr => inTriangle( tr, p ) )
                == expore( partition, p ).some( tr => inTriangle( tr, p ) )
            )

    })

assert( success , 'quad tree explore' )
