
export const rectFormPath = ( path, rect ) => {
    let r
    if( rect )
        r = {
            max:{x: 1, y: 1 },
            min:{x: 0, y: 0 },
        }
    else
        r = {
            max:{x: rect.max.x, y: rect.max.y },
            min:{x: rect.min.x, y: rect.min.y },
        }

    while( path.length ){

        const axe = path.length%2 == 0 ? 'x' : 'y'

        r[ +path.pop() ? 'min' : 'max' ][ axe ] = ( r.max[ axe ] + r.min[ axe ] )/2
    }

    return r
}



export const expore = ( partition, p ) => {
    if( partition.leaf )
        return partition.contains


}

export const reccursivePartition = ( triangles, rect, k ) => {

    const oneSide = ( triangles, rect, path, k, x ) => {

        const axe = path.length%2 == 0 ? 'x' : 'y'

        const half = ( rect.max[ axe ] + rect.min[ axe ] )/2

        let t = triangles.filter( triangle => triangle.some( p => p[ axe ] >= half == x ) )

        if (t.length > 1 && k>0){


            let tmp
            let o = []

            tmp = rect.min[ axe ]
            rect.min[ axe ] = half

            o[ 0 ] = oneSide( t, rect, path+'1', k-1, true )

            rect.min[ axe ] = tmp
            tmp = rect.max[ axe ]
            rect.max[ axe ] = half

            o[ 1 ] = oneSide( t, rect, path+'0', k-1, false )

            rect.max[ axe ] = tmp

            return o
        } else
            return {leaf: 1, triangles: t}
    }

    return [
        oneSide( triangles, rect, '1', k, true  ),
        oneSide( triangles, rect, '0', k, false )
    ]
}
