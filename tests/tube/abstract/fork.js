import {Tube}  from '../../../back/utils/tube'
import {asyncAssert}  from '../../assert'


let res = []

class Pub extends Tube {
    _start() {
        this.push( 'a' )
        this.push( 'b' )
        this.push( 'c' )
        this.push( 'd' )
        this.push( 'e' )
        this.end( )
    }
}

class Sub extends Tube {

    constructor( id ) {
        super()
        this.id = id
        this.n  = 2
    }

    _dataEnded( ){
        res.push(this.id+'end')
        this.end()
    }
    _dataAvailable( ){
        let x
        while( this.n > 0 && (x = this.pull()) ){
            this.n --
            res.push( this.id+''+x )
        }
    }
}


const pub = new Pub()

const sub1 = new Sub(1)
const sub2 = new Sub(2)
const sub3 = new Sub(3)

const union = new Tube()

pub.pipe( sub1 ).pipe( union )
pub.pipe( sub2 ).pipe( union )
pub.pipe( sub3 ).pipe( union )

const assert = asyncAssert( 'resolve' )

union

    .start()

    .then( () => {
        assert(
            res.slice( -3 )
                .every( x => x.match( /[0-9]end/) )
            &&

            res.filter( x => x[0] ==1 ).length <= 3
            &&
            res.filter( x => x[0] ==2 ).length <= 3
            &&
            res.filter( x => x[0] ==3 ).length <= 3

        )
    })
