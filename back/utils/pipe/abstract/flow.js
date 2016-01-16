import {Tube as Parent } from './pipeable'

export class Tube extends Parent {

    push( x ){

        this._outBuffer.push( x )

        this._out && this._out._dataAvailable( )
    }

    pushBatch( x ){

        this._outBuffer.push( ...x )

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

    end(){
        this._out && this._out._dataEnded()
    }

    error( err ){
        this._out && this._out.error( err )
    }

    start(){
        return new Promise( ( resolve, reject ) => {

            this._out = { _dataEnded: resolve, error: reject }

            this._start()

        })
    }
}
