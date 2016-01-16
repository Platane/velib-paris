

export class Tube {

    constructor(){

        this._out       = null
        this._in        = null
        this._outBuffer = []
    }

    pipe( tube ){
        this._out   = tube
        tube._in    = this

        return tube
    }

    push( x ){

        this._outBuffer.push( x )

        this._out && this._out._dataAvailable( )
    }

    pull( ){
        return this._in._outBuffer.shift()
    }

    pullN( n ){
        return this._in._outBuffer.length < n
            ? this._in._outBuffer.splice( 0, n )
            : null
    }

    pullAll( ){
        return this._in._outBuffer.splice( 0, Infinity )
    }

}
