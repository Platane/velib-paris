import {buildStation} from './parse'

import {Writable} from 'stream'
import {Batcher} from '../../utils/stream'



/**
 * write batch of station
 * /!\ should not have more than 500 entities in the batch ( data store limitation )
 *
 * stream input: { station[] } list of station
 */
class InsertBatch extends Writable {

    constructor( ds ){
        super({objectMode:true, highWaterMark:1})
        this._ds = ds
    }

    _write( stations, encoding, callback ) {

        const mutation = { insert: stations.map( buildStation ) }

        this._ds.datasets
            .commit(
                { resource:
                    {
                        mode: 'NON_TRANSACTIONAL',
                        mutation,
                    }
                },
                callback
            )
    }
}

export const pushStations = ( ds ) =>

    ( new Batcher( 500 ) )

        .on('error', err => console.log('error'))
        .on('end', batch => console.log('end'))
        .on('data', batch => console.log('batch', batch.length))

        // .pipe( new InsertBatch( ds ) )
