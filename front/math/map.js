// import {boundingBox} from './bounding'
import {reccursivePartition, explore} from './quadTree'
import {inTriangle, trianglePonderation} from './contains'

export const map = ( triangles, points, rect, n ) => {

    const partition = reccursivePartition( triangles, rect, 16 )

    let w = rect.max.x - rect.min.x,
        h = rect.max.y - rect.min.y

    const r = n / Math.max( w, h )

    w *= r
    h *= r


    let m=[]
    while(m.length< w*h)
        m.push(0)

    return {
        m : m
            .map( (_, n) =>
                ({
                    x: rect.min.x + ( rect.max.x - rect.min.x ) * (n%w)/w,
                    y: rect.min.y + ( rect.max.y - rect.min.y ) * (0|(n/w))/w,
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
