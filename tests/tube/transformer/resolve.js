import {Tube, Transformer}  from '../../../back/utils/tube'
import {asyncAssert}  from '../../assert'


let res = []

class Pub extends Tube {
    _start() {
        this.push( 'a' )
        this.push( 'b' )
        this.push( 'c' )
        this.end( )
    }
}

class Sub extends Transformer {

    _transform( x ){
        res.push( x )
    }
}

const assert = asyncAssert( 'resolve' )
;( new Pub() )

        .pipe( new Sub() )

        .start()

        .then( () => assert( res && res.length == 3 && res[0] == 'a' && res[1] == 'b' && res[2] == 'c' ) )
