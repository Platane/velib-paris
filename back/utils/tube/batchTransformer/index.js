import {Transformer} from '../transformer'


const exec = function( batch ) {
    this._processing ++

    const res = this._transform( batch )


    if ( res && res.then )
        res
            .then( x => {
                x && this.pushBatch( x )

                this._processing --
                this.__testEnd()
            })
            .catch( ( err ) => this.error( err ) )

    else {

        res && this.pushBatch( res )

        this._processing --
        this.__testEnd()
    }
}
export class BatchTransformer extends Transformer {

    _transform( arr ){
        return Promise.resolve( [] )
    }

    _dataEnded( ){

        const lastBatch = this.pullAll()

        lastBatch && exec.call( this, lastBatch )

        super._dataEnded()
    }

    _dataAvailable( ){

        let batch
        while( batch = this.pullN( this.nBatch || 1 ) )

            batch && exec.call( this, batch )

    }
}
