import {fromPromise}  from '../../../../back/utils/stream'
import {assert}  from '../../../assert'



const s = []
const stream = fromPromise(
    new Promise( resolve => setTimeout( () => resolve([ 'a', 'b' ]), 10 ) )
)
    .on( 'data', e => s.push( e ) )
    .on( 'end', () => s.push( 'end' ) )
    .on( 'error', () => s.push( 'error' ) )

assert( stream.on && stream.emit , 'looks like a stream' )

// async
setTimeout(
    () =>
        // assert( s && s.length == 3 && s[0] == 'a' && s[1] == 'b' && s[2] == 'end' , 'resolve' )
        console.log( s )
    , 500
)
