const epsylon = 0.00001
export const linesIntersection = ( A ,vA, B, vB ) => {

    if ( Math.abs( vA.x * vB.y - vA.y * vB.x ) < epsylon )
        return Math.abs( vA.x * (A.y-B.y) - vA.y * (A.y-B.y) ) < epsylon && A

    let k
    if ( Math.abs(vB.x)<epsylon )
        k = ( B.x - A.x ) / vA.x

    else if ( Math.abs(vB.y)<epsylon )
        k = ( B.y - A.y ) / vA.y

    else
        k = ( ( A.x - B.x ) / vB.x  - ( A.y - B.y ) / vB.y  ) / ( vA.y / vB.y - vA.x / vB.x )

    return {
        x: A.x + vA.x * k,
        y: A.y + vA.y * k,
    }
}
