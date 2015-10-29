export const packGausses = gausses => {

    // pack each gauss in 2 pixel
    //    r     g     b     a          r     g     b     a
    //     -----x-----      _           -----y-----    --v


    const pow = Math.ceil( Math.log( gausses.length ) / Math.log( 2 ) )
    const n = 1 << pow

    const canvas = document.createElement('canvas')
    canvas.setAttribute('style', `width:2048px; height:${n*8}px; image-rendering:pixelated`)
    document.body.appendChild( canvas )

    canvas.width = 256
    canvas.height = n

    const ctx = canvas.getContext('2d')
    const imgData = ctx.getImageData(0, 0, 256, n)
    const data = imgData.data


    const max = 256*256*256 / 2
    for (let i=0; i< gausses.length; i++) {

        let j

        for (j=0; j< Math.min(128, gausses[i].length); j++) {

            const cell = ( i * 256 + j * 2 ) * 4

            let k
            k = ( ( gausses[i][j].x + 1 ) * max ) >> 0

            data[ cell + 0 ] = (k>>16) % 256
            data[ cell + 1 ] = (k>>8) % 256
            data[ cell + 2 ] = k % 256


            k = ( ( gausses[i][j].y + 1 ) * max ) >> 0

            data[ cell + 4 ] = (k>>16) % 256
            data[ cell + 5 ] = (k>>8) % 256
            data[ cell + 6 ] = k % 256


            data[ cell + 3 ] = data[ cell + 7 ] = gausses[i][j].v >> 0

        }

        // for (; j<128; j++) {
        //
        //     const b = ( i * 256 + j * 2 ) * 4
        //
        //     for(let k=0; k<8; k++)
        //         data[ b+k ] = 0
        // }
    }

    ctx.putImageData( imgData, 0,0 )

    return canvas
}
