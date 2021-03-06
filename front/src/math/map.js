// import {boundingBox} from './bounding'
import {reccursivePartition, explore} from './quadTree'
import {inTriangle, trianglePonderation} from './primitive/contains'

export const map = ( triangles, points, rect, n ) => {

    const partition = reccursivePartition( triangles, rect, 12 )

    let w = rect.max.x - rect.min.x,
        h = rect.max.y - rect.min.y

    const larger = Math.max( w, h )

    w = 0|(w*n/larger)
    h = 0|(h*n/larger)



    let m=[]
    while(m.length< w*h)
        m.push(0)

    return {
        m : m
            .map( (_, n) =>
                ({
                    x: rect.min.x + larger * (n%w)/w,
                    y: rect.min.y + larger * (0|(n/w))/w,
            }) )
            .map( (p, i) => {

                const triangle = explore(partition, rect, p)
                    .filter( triangle => inTriangle( triangle, p ))[ 0 ]

                if ( !triangle )
                    return 0

                let pond = trianglePonderation( triangle, p )

                pond = pond.map( x => x*x )

                let sum = pond.reduce( (s, x) => s+x )

                pond = pond.map( x => x/sum )

                return pond
                    .reduce( (sum, pond, i) =>
                        sum + pond * triangle[i].value, 0 )
            }),
        w,
        h
    }
}
