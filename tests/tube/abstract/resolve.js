import {Tube}  from '../../../back/utils/tube/abstract/index'
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

const assert = asyncAssert( 'resolve' )
;( new Pub() )

        .pipe( new Sub() )

        .start()

        .then( () => assert( res && res.length == 4 && res[0] == 'a' && res[1] == 'b' && res[3] == 'end' ) )
