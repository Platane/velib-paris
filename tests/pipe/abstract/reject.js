import {Tube}  from '../../../back/utils/pipe/abstract/index'
import {asyncAssert}  from '../../assert'


let res = []

class Pub extends Tube {
    _start() {
        this.push( 'a' )
        this.push( 'b' )
        this.push( 'c' )
        this.error( 'error' )
    }
}

class Sub extends Tube {
    _dataEnded( ){
        res.push('end')
        this.end()
    }
    _dataAvailable( ){

        let x
        while( x = this.pull() )
            res.push( x )
    }
}

const assert = asyncAssert( 'reject' )
;( new Pub() )

        .pipe( new Sub() )

        .start()

        .catch( err => assert( err == 'error' ) )
