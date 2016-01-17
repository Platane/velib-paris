import {buildAvailability} from './parse'

import {BatchTransformer} from '../../utils/tube'

export class PushAvailabilities extends BatchTransformer {

    constructor( ds ){
        super()

        this.nBatch = 500
        this._ds = ds
    }

    _transform( batch ){
        console.log( 'batch', batch.length )
        console.log( 'batch', batch.map( buildAvailability )[0].key )
        return new Promise( (resolve, reject) =>

            this._ds.datasets
                .commit(
                    { resource:
                        {
                            mode: 'NON_TRANSACTIONAL',
                            mutation : { upsert: batch.map( buildAvailability ) },
                        }
                    },
                    err => err ? reject( err ) : resolve()
                )
        )
    }
}
