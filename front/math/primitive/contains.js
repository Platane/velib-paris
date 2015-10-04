import {vec2} from 'gl-matrix'
import {linesIntersection} from './linesIntersection'

const epsylon = 0.0000001

// assuming the point is contained by the triangle
export const _trianglePonderation = ( points, triangle, P ) => {

    // fast way
    const A = points[ triangle[0] ]
    const B = points[ triangle[1] ]
    const C = points[ triangle[2] ]

    const p=[
        vec2.dist( A, P ),
        vec2.dist( B, P ),
        vec2.dist( C, P ),
    ]

    const sum = p[0] + p[1] + p[2]

    p[0] = (sum-p[0])/sum
    p[1] = (sum-p[1])/sum
    p[2] = (sum-p[2])/sum

    return p
}

// assuming the point is contained by the triangle
export const trianglePonderation = ( points, triangle, P ) => {

    // fast way
    const A = points[ triangle[0] ]
    const B = points[ triangle[1] ]
    const C = points[ triangle[2] ]


    const AB = vec2.sub( [], B, A )
    const CP = vec2.sub( [], P, C )

    // AB and Cp are colinear
    if ( Math.abs( AB[0] * AB[1] - AB[1] * AB[1] ) < epsylon ) {

        // rotate
        const res = trianglePonderation( points, [ triangle[1], triangle[2], triangle[0] ], P )
        return [ res[2], res[0], res[1] ]

    }

    const O = linesIntersection( A, AB, C, CP )

    let a =  ( (B[0]-O[0])*AB[0] + (B[1]-O[1])*AB[1] ) / vec2.sqrDist( A, B )
    let b = 1-a

    let c =  -( (P[0]-O[0])*(O[0]-C[0]) + (P[1]-O[1])*(O[1]-C[1]) ) / vec2.sqrDist( O, C )

    a *= (1-c)
    b *= (1-c)

    return [a, b, c]
}


export const inTriangle = ( points, triangle, P ) => {

    // fast way
    const A = points[ triangle[0] ]
    const B = points[ triangle[1] ]
    const C = points[ triangle[2] ]

    const ABx = B[ 0 ] - A[ 0 ]
    const ABy = B[ 1 ] - A[ 1 ]

    const BCx = C[ 0 ] - B[ 0 ]
    const BCy = C[ 1 ] - B[ 1 ]

    const CAx = A[ 0 ] - C[ 0 ]
    const CAy = A[ 1 ] - C[ 1 ]

    const direct = ABx * BCy - ABy * BCx < epsylon

    return (
           ABx * ( P[1] - B[1] ) - ABy * ( P[0] - B[0] ) < epsylon == ABx * BCy - ABy * BCx < epsylon
        && BCx * ( P[1] - C[1] ) - BCy * ( P[0] - C[0] ) < epsylon == BCx * CAy - BCy * CAy < epsylon
        && CAx * ( P[1] - A[1] ) - CAy * ( P[0] - A[0] ) < epsylon == CAx * ABy - CAy * ABy < epsylon
    )
}
