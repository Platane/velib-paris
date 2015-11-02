import {squareDistance} from '../../../math/primitive/point'
import {boundingBox}  from '../../../math/primitive/bounding'

export const boxCircleIntersection = ( box, c, radius ) =>

    // one of the corner is in the circle
    // squareDistance( box.max , c ) < squareRadius ||
    // squareDistance( box.min , c ) < squareRadius ||
    // squareDistance( {x:box.min.x, y:box.max.y} , c ) < squareRadius ||
    // squareDistance( {x:box.max.x, y:box.min.y} , c ) < squareRadius ||

    // the center is in the square
    ( box.min.x <= c.x + radius  && c.x - radius <= box.max.x && box.min.y <= c.y + radius && c.y - radius <= box.max.y )

/**
 * gridSplit -
 *  divide the space in n*n square, push the points in the corresponging squares
 *
 * @param bigBox   {BoundingBox}     the bix box
 * @param n        {number}          nombre of division on each side
 * @param points   {point[]}         array of points
 * @param radius   {number[]}        array of radius
 *
 * @return {array[]} grid, for each cells a list of index which point to the points array. cell are indexed as y*n + x
 *
 */
export const gridSplit = ( bigBox, n, points, radius ) => {

    radius = Array.isArray(radius) ? radius : Array.apply(null, Array( points.length )).map( _ => radius )

    const gridSize = {
        x: (bigBox.max.x - bigBox.min.x) / n,
        y: (bigBox.max.y - bigBox.min.y) / n,
    }

    const grid = Array.apply(null, Array( n*n ))
        .map( _ => [] )

    const square = {max:{x:0, y:0}, min:{x:0, y:0}}
    const bigSquare = {max:{x:0, y:0}, min:{x:0, y:0}}
    points
        .forEach( (point, i) => {

            const r = radius[ i ]

            // the miniman square which contains the circle
            // in cell ( u, v )
            bigSquare.max.x = Math.min( n-1,  Math.ceil( ( point.x + r - bigBox.min.x )/gridSize.x) )
            bigSquare.max.y = Math.min( n-1,  Math.ceil( ( point.y + r - bigBox.min.y )/gridSize.y) )
            bigSquare.min.x = Math.max( 0  , Math.floor( ( point.x - r - bigBox.min.x )/gridSize.x) )
            bigSquare.min.y = Math.max( 0  , Math.floor( ( point.y - r - bigBox.min.y )/gridSize.y) )


            // go throught each cell of the big square
            for ( let x=bigSquare.min.x; x<=bigSquare.max.x; x++ )
            for ( let y=bigSquare.min.y; y<=bigSquare.max.y; y++ ){

                // compute the cell's coordinates
                square.max.x = (x+1) * gridSize.x + bigBox.min.x
                square.min.x = (x+0) * gridSize.x + bigBox.min.x
                square.max.y = (y+1) * gridSize.y + bigBox.min.y
                square.min.y = (y+0) * gridSize.y + bigBox.min.y

                // test the collision with the circle
                if ( boxCircleIntersection(square, point, r) )
                    grid[ y*n + x ].push( i )

            }
        })

    return grid
}
