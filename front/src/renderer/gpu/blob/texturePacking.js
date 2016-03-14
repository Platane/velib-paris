
/**
 * given a set of gauss param ( x, y, value ),
 * pack this set into something that can be passed to the shader
 *   = a texture,
 *   put information into an image
 *
 *  @param gausses  { {x,y,v}[][] }     for each tile, contains a list of gauss
 *                  x and y are in ]-1, 1]
 *                  v is in [ 0, 255 ]
 *
 *  @return {canvas}
 *
 */
export const packGausses = (canvas, gausses, maxGaussesByTile = 100) => {

    // the set is represented as such
    //
    //    -- -- -- -- -- --                 ( tile 0, 6 blocks of 2 pixels, one for each gauss )
    //    -- -- -- -- -- -- -- --           ( tile 1 ...)
    //    -- -- -- --                       ( tile 2 ...)
    //    ...

    // pack each gauss in 2 pixel
    //    r     g     b     a          r     g     b     a
    //     -----x-----      _           -----y-----    --v


    const n = 1 << Math.ceil( Math.log( gausses.length ) / Math.log( 2 ) )
    const line_n = 1 << Math.ceil( Math.log( maxGaussesByTile ) / Math.log( 2 ) )

    canvas.width = line_n*2
    canvas.height = n

    const ctx = canvas.getContext('2d')
    const imgData = ctx.getImageData(0, 0, line_n*2, n)
    const data = imgData.data


    const max = 256*256
    for (let i=0; i< gausses.length; i++) {
        // for each tile i
        let j

        for (j=0; j< Math.min(line_n, gausses[i].length); j++) {
            // for each gauss j in the tile

            // cell index base
            const cell = ( i * line_n*2 + j * 2 ) * 4

            // push x coord
            let kx = 0|Math.min( ( gausses[i][j].x + 1 ) / 2 * max , max-1 )

            data[ cell + 0 ] = (kx>>8) % 256
            data[ cell + 1 ] = (kx>>0) % 256

            // push y coord
            let ky = 0|Math.min( ( gausses[i][j].y + 1 ) / 2 * max , max-1 )

            data[ cell + 4 ] = (ky>>8) % 256
            data[ cell + 5 ] = (ky>>0) % 256

            // push value
            data[ cell + 2 ] = data[ cell + 6 ] = gausses[i][j].v >> 0

            // set alpha to 1
            data[ cell + 3 ] = data[ cell + 7 ] = 255
        }
    }

    ctx.putImageData( imgData, 0,0 )

    return canvas
}
