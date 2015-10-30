export const packGausses = (gausses, maxGaussesByTile = 100) => {

    // pack each gauss in 2 pixel
    //    r     g     b     a          r     g     b     a
    //     -----x-----      _           -----y-----    --v


    const n = 1 << Math.ceil( Math.log( gausses.length ) / Math.log( 2 ) )
    const line_n = 1 << Math.ceil( Math.log( maxGaussesByTile ) / Math.log( 2 ) )

    const canvas = document.createElement('canvas')
    canvas.setAttribute('style', `width:2048px; height:${n*8}px; image-rendering:pixelated`)
    document.body.appendChild( canvas )

    canvas.width = line_n*2
    canvas.height = n

    const ctx = canvas.getContext('2d')
    const imgData = ctx.getImageData(0, 0, line_n*2, n)
    const data = imgData.data


    const max = 256*256*256
    for (let i=0; i< gausses.length; i++) {

        let j

        for (j=0; j< Math.min(line_n, gausses[i].length); j++) {

            const cell = ( i * line_n*2 + j * 2 ) * 4

            let k = gausses[i][j].x == -1
                ? 0
                : Math.min( ( gausses[i][j].x + 1 ) / 2 * max , max-1 )

            k = 0|k

            data[ cell + 0 ] = (k>>16) % 256
            data[ cell + 1 ] = (k>>8) % 256
            data[ cell + 2 ] = k % 256


            k = gausses[i][j].y == -1
                ? 0
                : Math.min( ( gausses[i][j].y + 1 ) / 2 * max , max-1 )

            k = 0|k

            data[ cell + 4 ] = (k>>16) % 256
            data[ cell + 5 ] = (k>>8) % 256
            data[ cell + 6 ] = k % 256


            data[ cell + 3 ] = data[ cell + 7 ] = gausses[i][j].v >> 0

        }
    }

    ctx.putImageData( imgData, 0,0 )

    return canvas
}
