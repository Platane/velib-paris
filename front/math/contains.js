import {linesIntersection} from './linesIntersection'
import {squareDistance} from './point'

export const inBox = ( box, p ) =>
    box.min.x <= p.x && p.x <= box.max.x &&
    box.min.y <= p.y && p.y <= box.max.y

export const trianglePonderation = ( triangle, p ) => {

    const [A,B,C] = triangle

    const O = linesIntersection( A, {x:B.x -A.x, y:B.y -A.y}, C, {x:p.x -C.x, y:p.y -C.y} )

    if ( !O ){
        const res = trianglePonderation( [B,C,A], p )
        return [ res[2], res[0], res[1] ]
    }

    let a =  ( (B.x-O.x)*(B.x-A.x) + (B.y-O.y)*(B.y-A.y) ) / squareDistance( A, B )
    let b = 1-a

    let c =  -( (p.x-O.x)*(O.x-C.x) + (p.y-O.y)*(O.y-C.y) ) / squareDistance( O, C )

    a *= (1-c)
    b *= (1-c)

    return [a, b, c]
}

export const inTriangle = ( triangle, p ) =>
    trianglePonderation( triangle, p ).every( x => x>=0 )
