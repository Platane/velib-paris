import {buildStation} from './parse'

import {BatchTransformer} from '../../utils/tube'

export class PushStations extends BatchTransformer {

    constructor( ds ){
        super()

        this.nBatch = 500
        this._ds = ds
    }

    _transform( batch ){
        return new Promise( (resolve, reject) =>

            this._ds.datasets
                .commit(
                    { resource:
                        {
                            mode: 'NON_TRANSACTIONAL',
                            mutation : { upsert: batch.map( buildStation ) },
                        }
                    },
                    err => err ? reject( err ) : resolve()
                )
        )
    }
}
