const epsylon = 0.00001
export const pointOnSegment = ( A, B, N ) => {

    let ABx = B.x - A.x
    let ABy = B.y - A.y

    let ANx = N.x - A.x
    let ANy = N.y - A.y

    return Math.abs( ANx * ABy - ANy * ABx ) < epsylon && ANx * ABx + ANy * ABy > -epsylon && (N.x - B.x) * ABx - (N.x - B.x) * ABy < epsylon
}
