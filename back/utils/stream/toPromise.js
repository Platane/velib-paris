
export const toPromise = stream =>
    new Promise( (resolve, reject) => {
        const stack = []
        stream
            .on( 'data', e => stack.push( e ) )
            .on( 'end', () => resolve( stack ) )
            .on( 'error', reject )
    })
