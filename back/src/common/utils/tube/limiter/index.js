import {Tube} from '../abstract'


export class Limiter extends Tube {

    constructor( n ) {

        super()

        this._n = n
    }

    _dataEnded( ){
        if ( this._n > 0 )
            this.end()
    }
    _dataAvailable( ){

        let x
        while( this._n && ( x = this.pull() ) ) {
            this._n --
            this.push( x )
        }

        if ( this._n <= 0 )
            this.end()
    }
}
