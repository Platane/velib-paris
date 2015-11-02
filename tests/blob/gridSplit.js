import {gridSplit}  from '../../front/renderer/gpu/blob/gridSplit'
import {assert}  from '../assert'

const points = [
    {x: 0, y: 0},
    {x:10, y:30},
    {x:20, y:30},
    {x:27, y:32},
    {x:22, y:52},
    {x:12, y:82},
    {x:82, y:82},
    {x:82, y:12},
    {x:82, y:72},
    {x: 2, y:72},
    {x:32, y:22},
    {x:73, y:22},
    {x:72, y:22},
    {x:72, y:62},
    {x:78, y:72},
    {x:100, y:100},
]

gridSplit( {max:{x:100, y:100}, min:{x:0, y:0}}, 10, points, 0 )
    .forEach( (list, i) => {

        const x = i % 10
        const y = 0| (i / 10)

        list
            .forEach( j => {
                assert( x*10 <= points[j].x, 'gridsplit points' )
                assert( points[j].x <= (x+1)*10 , 'gridsplit points' )
                assert( y*10 <= points[j].y, 'gridsplit points' )
                assert( points[j].y <= (y+1)*10 , 'gridsplit points' )
            })

    })
