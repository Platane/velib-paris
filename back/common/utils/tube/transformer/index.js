import {Tube} from '../abstract'

export class Transformer extends Tube {

    constructor( ){
        super()

        this._ended         = false
        this._processing    = 0
    }

    __testEnd() {
        this._ended && !this._processing && this.end()
    }

    _transform( x ){
        return Promise.resolve( x )
    }

    _dataEnded( ){

        this._ended = true
        this.__testEnd()
    }

    _dataAvailable( ){

        let x
        while( x = this.pull() ) {

            this._processing ++

            const res = this._transform( x )

            if ( res && res.then )
                res
                    .then( x => {
                        x && this.push( x )

                        this._processing --
                        this.__testEnd()
                    })
                    .catch( ( err ) => this.error( err ) )

            else {

                res && this.push( res )

                this._processing --
                this.__testEnd()
            }

        }
    }
}


Transformer.create = ( transform ) => {
    class P extends Transformer {}
    P.prototype._transform = transform
    return P
}
