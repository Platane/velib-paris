import {Tube, BatchTransformer}  from '../../../back/utils/tube'
import {asyncAssert}  from '../../assert'


let res = []

class Pub extends Tube {
    _start() {
        setTimeout( () => this.push( 'a' ) , 50 )
        setTimeout( () => this.push( 'b' ) , 100 )
        setTimeout( () => this.push( 'c' ) , 150 )
        setTimeout( () => this.end( 'c' ) , 200 )
    }
}

class Sub extends BatchTransformer {

    constructor(){
        super()
        this.nBatch = 2
    }

    _transform( batch ){
        res.push( batch )
    }
}

const assert = asyncAssert( 'resolve' )
;( new Pub() )

        .pipe( new Sub() )

        .start()

        .then( () => assert( res && res.length == 2 && res[0].length == 2 && res[0][0] == 'a' && res[0][1] == 'b' && res[1].length == 1 && res[1][0] == 'c' ) )
