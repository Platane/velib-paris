import {explore, reccursivePartition}  from '../../../front/math/quadTree'
import {inTriangle}  from '../../../front/math/primitive/contains'
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
        {min:{x:0, y:0}, max:{x:50, y:50}},
    ],
    [
        [
            [
                {x:1.5, y:1.3},
                {x:12, y:21.7},
                {x:23, y:1.3},
            ]
        ],
        {min:{x:0, y:0}, max:{x:50, y:50}},
    ],
    [
        [
            [
                {x:1.5, y:1.3},
                {x:12, y:21.7},
                {x:23, y:1.3},
            ],
            [
                {x:1.5, y:1.3},
                {x:2, y:2.7},
                {x:3, y:1.3},
            ]
        ],
        {min:{x:0, y:0}, max:{x:50, y:50}},
    ],
    [
        [
            [
                {x:31.5, y:13.3},
                {x:32, y:15.7},
                {x:38, y:13.3},
            ],
        ],
        {min:{x:0, y:0}, max:{x:50, y:50}},
    ],
    [
        [
            [
                {x:21.5, y:23.3},
                {x:22, y:22.7},
                {x:23, y:23.3},
            ],
        ],
        {min:{x:0, y:0}, max:{x:50, y:50}},
    ],
    [
        [
            [
                {x:1.5, y:1.3},
                {x:2, y:2.7},
                {x:3, y:1.3},
            ],
            [
                {x:11.5, y:1.3},
                {x:12, y:2.7},
                {x:13, y:1.3},
            ],
            [
                {x:11.5, y:3.3},
                {x:12, y:2.7},
                {x:13, y:3.3},
            ],
            [
                {x:41.5, y:3.3},
                {x:42, y:2.7},
                {x:43, y:3.3},
            ],
            [
                {x:21.5, y:23.3},
                {x:22, y:22.7},
                {x:23, y:23.3},
            ],
            [
                {x:5.5, y:23.3},
                {x:22, y:22.7},
                {x:23, y:10.3},
            ],
            [
                {x:52.5, y:13.3},
                {x:22.21, y:22.7},
                {x:13, y:10.3},
            ],
            [
                {x:31.5, y:13.3},
                {x:32, y:15.7},
                {x:38, y:13.3},
            ],
        ],
        {min:{x:0, y:0}, max:{x:50, y:50}},
    ],
]

const success = samples
    .every( x => {

        const partition = reccursivePartition( x[0], x[1], 16 )

        explore( partition, x[1], {x: 22, y: 23} )

        return Array.apply(null, Array(10000))
            .map( (_, n) =>
                ({
                    x: x[1].min.x + ( x[1].max.x - x[1].min.x ) * (n%100)/100,
                    y: x[1].min.y + ( x[1].max.y - x[1].min.y ) * (0|(n/100))/100,
            }) )
            .every( p => {

                const bruteRes = x[0].filter( tr => inTriangle( tr, p ) )
                const dichoRes = explore( partition, x[1], p ).filter( tr => inTriangle( tr, p ) )

                return bruteRes.length == dichoRes.length && bruteRes.every( tr => dichoRes.indexOf( tr ) >= 0 )
            })

    })

assert( success , 'quad tree explore' )
