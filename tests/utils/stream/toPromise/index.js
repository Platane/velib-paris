import {toPromise}  from '../../../../back/utils/stream'
import {assert}  from '../../../assert'
import {Stream} from 'stream'


// success
;(() => {

const src = new Stream()
src.readable = true


let res = null
toPromise( src )
    .then( x => res = x )
    .catch( err => res = err )

src.emit( 'data' , 'abc' )
src.emit( 'end' )

// async
setTimeout(
    () =>
        assert( res && res.length == 1 && res[0] == 'abc' , 'resolve' )
    , 50
)

})()


// fail
;(() => {

const src = new Stream()
src.readable = true


let res = null
toPromise( src )
    .then( x => res = x)
    .catch( err => res = err )

src.emit( 'error' , 'e' )

// async
setTimeout(
    () =>
        assert( res == 'e' , 'reject' )
    , 50
)

})()
