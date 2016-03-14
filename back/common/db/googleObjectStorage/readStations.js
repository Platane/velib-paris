import {parseStation} from './parse'

import {Tube} from '../../utils/tube'

export class ReadStations extends Tube {

    constructor( ds ){
        super()

        this._ds = ds
    }

    _start() {

        const query = {
            kinds: [{name: 'station'}]
        }

        this._ds.datasets
            .runQuery(
                { datasetId: this._key.project_id, resource: {query} },
                (err, res) =>
                    err
                        ? this.error( err )
                        : this.pushBatch( res.entityResults.map( parseStation ) ).end()
            )
    }

}
