
// export const rectFormPath = ( path, rect ) => {
//     let r
//     if( rect )
//         r = {
//             max:{x: 1, y: 1 },
//             min:{x: 0, y: 0 },
//         }
//     else
//         r = {
//             max:{x: rect.max.x, y: rect.max.y },
//             min:{x: rect.min.x, y: rect.min.y },
//         }
//
//     while( path.length ){
//
//         const axe = path.length%2 == 0 ? 'x' : 'y'
//
//         r[ +path.pop() ? 'min' : 'max' ][ axe ] = ( r.max[ axe ] + r.min[ axe ] )/2
//     }
//
//     return r
// }

/**
 *
 *  partition
 *      if leaf : { leaf: true, triangles:triangle[] }
 *      if node : [
 *              partition of the space for X is in the lower value ( < than the half )
 *              partition of the space for X is in the greater value ( > than the half )
 *      ]
 *
 */

export const explore = ( partition, rect, p, axe='x' ) => {
    if( partition.leaf )
        return partition.triangles

    const half = ( rect.max[ axe ] + rect.min[ axe ] )/2

    let re

    if ( p[ axe ] < half ) {
        const tmp = rect.max[ axe ]
        rect.max[ axe ] = half

        re = explore( partition[0], rect, p, axe == 'x' ? 'y' : 'x' )

        rect.max[ axe ] = tmp
    } else {
        const tmp = rect.min[ axe ]
        rect.min[ axe ] = half

        re = explore( partition[1], rect, p, axe == 'x' ? 'y' : 'x' )

        rect.min[ axe ] = tmp
    }

    return re
}

const min_triangle = 0
export const reccursivePartition = ( triangles, rect, k, axe = 'x' ) => {

    if ( k<=0 || triangles.length <= min_triangle )
        return {leaf: 1, triangles: triangles}


    const half = ( rect.max[ axe ] + rect.min[ axe ] )/2

    let tmp
    let o = []

    tmp = rect.max[ axe ]
    rect.max[ axe ] = half

    o[ 0 ] = reccursivePartition(
        triangles.filter( triangle => triangle.some( p => p[ axe ] <= half ) ),
        rect,
        k-1,
        axe == 'x' ? 'y' : 'x'
    )

    rect.max[ axe ] = tmp
    tmp = rect.min[ axe ]
    rect.min[ axe ] = half

    o[ 1 ] = reccursivePartition(
        triangles.filter( triangle => triangle.some( p => p[ axe ] >= half ) ),
        rect,
        k-1,
        axe == 'x' ? 'y' : 'x'
    )

    rect.min[ axe ] = tmp

    return o
}
