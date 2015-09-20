// import {boundingBox} from './bounding'
// import {quadTree} from './quadTree'
import {inTriangle, trianglePonderation} from './contains'

export const map = ( triangles, points, rect, n ) => {

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

                const triangle = triangles
                    .filter( triangle => inTriangle( triangle, p ))[ 0 ]

                if ( !triangle )
                    return 0

                return trianglePonderation( triangle, p )
                    .reduce( (sum, pond, i) =>
                        sum + pond * triangle[i].value, 0 )
            }),
        w,
        h
    }
}
