export const packGausses = gausses => {

    // pack each gauss in 2 pixel
    //    r     g     b     a          r     g     b     a
    //     -----x-----      _           -----y-----    --v

    const canvas = document.createElement('canvas')

    const n = Math.log( gausses.length ) / Math.log( 2 )

    canvas.width = 256
    canvas.height = n

    const ctx = canvas.getContext('2d')
    const imgData = ctx.getImageData(0, 0, 256, n)
    const data = imgData.data


    const max = 256*256*256 / 2
    for (let i=0; i<gausses.length; i++) {

        let j

        for (j=0; j<gausses[i].length; j++) {

            const b = ( i * 256 + j * 2 ) * 4

            let k
            k = ( ( gausses[i][j].x + 1 ) * max ) << 0

            data[ b + 2 ] = k % 256
            k << 1
            data[ b + 1 ] = k % 256
            k << 1
            data[ b + 0 ] = k % 256


            k = ( ( gausses[i][j].y + 1 ) * max ) << 0

            data[ b + 6 ] = k % 256
            k << 1
            data[ b + 5 ] = k % 256
            k << 1
            data[ b + 4 ] = k % 256


            data[ b + 3 ] = 0


            data[ b + 7 ] = gausses[i][j].v << 0

        }

        for (; j<128; j++) {

            const b = ( i * 256 + j * 2 ) * 4

            for(let k=0; k<8; k++)
                data[ b+k ] = 0
        }
    }

    ctx.putImageData( imgData, 0,0 )

    return canvas
}
