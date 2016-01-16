import {buildStation} from './parse'

import {Tube} from '../../utils/tube/abstract'

const insertBatch = ( ds, batch ) =>
    new Promise( (resolve, reject) =>

        ds.datasets
            .commit(
                { resource:
                    {
                        mode: 'NON_TRANSACTIONAL',
                        mutation : { insert: batch.map( buildStation ) },
                    }
                },
                err => err ? reject( err ) : resolve()
            )
    )

class PushStations extends Tube {

    constructor( ds ){
        super()

        this._ended             = false
        this._ds                = ds
        this._batchProcessing   = 0

        this._testEnd = () => {
            this._ended && !this._batchProcessing && this.end()
        }
    }

    _dataEnded( ){
        let batch

        while( batch = this.pullN( 500 ) ) {

            this._batchProcessing ++

            insertBatch( this._ds, batch )
                .then( () => this._testEnd() )
                .catch( ( err ) => this.error( err ) )
        }

        if ( batch = this.pullAll() ) {

            this._batchProcessing ++

            insertBatch( this._ds, batch )
                .then( () => this._testEnd() )
                .catch( ( err ) => this.error( err ) )
        }

        this._ended = true
        this._testEnd()
    }

    _dataAvailable( ){

        let batch
        while( batch = this.pullN( 500 ) )
            insertBatch( this._ds, batch )

    }
}

export const pushStations = ( ds ) => new PushStations( ds )
