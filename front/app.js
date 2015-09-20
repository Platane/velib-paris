import {heatmap} from './renderer/canvas/heatmap'
import {graph} from './renderer/canvas/graph'
import {get} from './service/request'


const canvas = document.createElement('canvas')
document.body.appendChild( canvas )

const canvas2 = document.createElement('canvas')
document.body.appendChild( canvas2 )



get( 'http://localhost:8080/availability' )
// Promise.resolve( [])

    .then( res => {

        let points = res
            .map( x => ({
                x: +x.coordinates[1],
                y: -x.coordinates[0],
                value: 0.1+ 0.9 * x.av.split(';').slice(-1)[0].split(',').slice(-1)[0] / x.total
            }) )

        canvas.width = canvas.height = 1200
        canvas2.width = canvas2.height = 1200
        heatmap( points, 200, 1200, canvas )
        graph( points, 1200, canvas2 )

    })

    .catch( err => console.error( err ))












































0
