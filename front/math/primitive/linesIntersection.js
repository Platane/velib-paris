import {vec2} from 'gl-matrix'


const epsylon = 0.00001
export const linesIntersection = ( A ,vA, B, vB ) => {

    // vA, vB are colinear
    if ( Math.abs( vA[0] * vB[1] - vA[1] * vB[0] ) < epsylon )

        // A and B are aligned
        return Math.abs( vA[0] * (A[1]-B[1]) - vA[1] * (A[1]-B[1]) ) < epsylon && A


    let k
    if ( Math.abs(vB[0])<epsylon )
        k = ( B[0] - A[0] ) / vA[0]

    else if ( Math.abs(vB[1])<epsylon )
        k = ( B[1] - A[1] ) / vA[1]

    else
        k = ( ( A[0] - B[0] ) / vB[0]  - ( A[1] - B[1] ) / vB[1]  ) / ( vA[1] / vB[1] - vA[0] / vB[0] )

    return vec2.scaleAndAdd( [], A, vA, k )
}
