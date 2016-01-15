import {toPromise, fromPromise, batcher}  from '../../../../back/utils/stream'
import {assert}  from '../../../assert'


// success
;(() => {

const data = Array.apply( null, new Array( 27 ) ).map( (x, i) => i )

const stream =
    fromPromise(
        new Promise( resolve => setTimeout( () => resolve( data ), 10 ) )
    )
    .pipe( batcher( 10 ) )

assert( stream.on && stream.emit , 'looks like a stream' )

let res = null
toPromise( stream )
    .then( x => res = x )

// async
setTimeout(
    () =>
        // assert( res && res.length == 6 && res[0].length == 10 && res[1].length == 10 && res[2].length == 6, 'resolve' )
        console.log( 'res', res )
    , 50
)

})()
