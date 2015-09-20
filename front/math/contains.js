import {linesIntersection} from './linesIntersection'
import {squareDistance} from './point'

const espylon = 0.00001

export const inBox = ( box, p ) =>
    box.min.x <= p.x && p.x <= box.max.x &&
    box.min.y <= p.y && p.y <= box.max.y

export const trianglePonderation = ( triangle, p ) => {

    const [A,B,C] = triangle

    const ABx = B.x -A.x
    const ABy = B.y -A.y

    const Cpx = p.x -C.x
    const Cpy = p.y -C.y

    if ( Math.abs( ABx * Cpy - ABy * Cpx ) < espylon ) {

        const res = trianglePonderation( [B,C,A], p )
        return [ res[2], res[0], res[1] ]

    }

    const O = linesIntersection( A, {x:ABx, y:ABy}, C, {x:Cpx, y:Cpy} )

    let a =  ( (B.x-O.x)*(ABx) + (B.y-O.y)*(ABy) ) / squareDistance( A, B )
    let b = 1-a

    let c =  -( (p.x-O.x)*(O.x-C.x) + (p.y-O.y)*(O.y-C.y) ) / squareDistance( O, C )

    a *= (1-c)
    b *= (1-c)

    return [a, b, c]
}


export const inTriangle = ( triangle, p ) =>
    trianglePonderation( triangle, p ).every( x => x>-espylon )
