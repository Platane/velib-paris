import {squareDistance} from '../../../math/primitive/point'
import {boundingBox}  from '../../../math/primitive/bounding'

export const boxCircleIntersection = ( box, c, squareRadius ) =>

    // one of the corner is in the circle
    squareDistance( box.max , c ) < squareRadius ||
    squareDistance( box.min , c ) < squareRadius ||
    squareDistance( {x:box.min.x, y:box.max.y} , c ) < squareRadius ||
    squareDistance( {x:box.max.x, y:box.min.y} , c ) < squareRadius ||

    // the center is in the square
    ( box.min.x <= c.x && c.x <= box.max.x && box.min.y <= c.y && c.y <= box.max.y )

/**
 * gridSplit -
 *  divide the space in n*n square, push the points in the corresponging squares
 *
 * @param n        {number}          nombre of division on each side
 * @param points   {point[]}         array of points
 * @param radius   {number[]}        array of radius
 * @param [box]    {BoundingBox[]}   optionnal, will be computed otherwise
 *
 * @return {array[]} grid, for each cells a list of index which point to the points array. cell are indexed as y*n + x
 *
 */
export const gridSplit = ( n, points, radius, box ) => {

    radius = Array.isArray(radius) ? radius : Array.apply(null, Array( points.length )).map( _ => radius )

    box = box ||  boundingBox( points )

    const gridSize = {
        x: (box.max.x - box.min.x) / n,
        y: (box.max.y - box.min.y) / n,
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
            bigSquare.max.x = Math.min( n-1,  Math.ceil( ( point.x + r - box.min.x )/gridSize.x) )
            bigSquare.max.y = Math.min( n-1,  Math.ceil( ( point.y + r - box.min.y )/gridSize.y) )
            bigSquare.min.x = Math.max( 0  , Math.floor( ( point.x - r - box.min.x )/gridSize.x) )
            bigSquare.min.y = Math.max( 0  , Math.floor( ( point.y - r - box.min.y )/gridSize.y) )


            // go throught each cell of the big square
            for ( let x=bigSquare.min.x; x<=bigSquare.max.x; x++ )
            for ( let y=bigSquare.min.y; y<=bigSquare.max.y; y++ ){

                // compute the cell's coordinates
                square.max.x = (x+1) * gridSize.x + box.min.x
                square.min.x = (x+0) * gridSize.x + box.min.x
                square.max.y = (y+1) * gridSize.y + box.min.y
                square.min.y = (y+0) * gridSize.y + box.min.y

                // test the collision with the circle
                if ( boxCircleIntersection(square, point, r*r) )
                    grid[ y*n + x ].push( i )

            }
        })

    return grid
}
