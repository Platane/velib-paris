import {parseStation} from './parse'

import {Tube} from '../../utils/tube'

export class ReadStations extends Tube {

    constructor( ds, project_id ){
        super()

        this._ds = ds
        this._project_id = project_id
    }

    _start() {
        const query = {
            kinds: [{name: 'station'}]
        }

        this._ds.datasets
            .runQuery(
                { datasetId: this._project_id, resource: {query} },
                (err, res) => {

                    err
                        ? this.error( err )
                        : this.pushBatch( res.batch.entityResults.map( x => parseStation( x.entity ) ) ).end()
                }
            )
    }

}
