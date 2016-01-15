import { DB as Parent } from '../abstract'
import {auth, datastore} from 'googleapis'
import {buildAvailability, buildStation, parseStation, parseAvailability} from './parse'
import {pushStations} from './pushStations'

const key = require('../../../credentials/google.json')
const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/datastore',
]
const version = 'v1beta2'




export class DB extends Parent {

    init() {

        return this.auth()

            // get the datastore object
            .then( () => {

                const projectId = key.project_id

                this._ds = datastore({
                    version,
                    projectId,
                    auth            : this._credentials,
                    params: {datasetId: projectId},
                  })

            })
    }

    auth() {

        console.log( 'auth' )

        return new Promise( (resolve, reject) => {

            this._credentials = new auth.JWT( key.client_email, null, key.private_key, SCOPES )
            this._credentials.authorize( err => err ? reject( err ) : resolve() )
        })
    }

    pushAvailabilities( availabilities ) {

        const mutation = { insert: availabilities.map( buildAvailability ) }

        return new Promise( (resolve, reject) =>
            this._ds.datasets
                .commit(
                    { resource:
                        {
                            mode: 'NON_TRANSACTIONAL',
                            mutation,
                        }
                    },
                    err => err ? reject( err ) : resolve()
                )
        )
    }

    pushStations( ) {
        return pushStations( this.ds )
    }


    readAllStations( opions ) {

        const query = {
            kinds: [{name: 'station'}]
        }

        return new Promise( (resolve, reject) =>
            this._ds.datasets
                .runQuery(
                    { datasetId: key.project_id, resource: {query} },
                    (err, res) => err ? reject( err ) : resolve( res )
                )
            )
            .then( ({batch}) => {

                const {entityResults, endCursor, moreResults} = batch

                return entityResults
                    .map( x => parseStation( x.entity ) )
            })
    }

    readAvailabilties( opions ) {

        // const timeWindow = options.timeWindow || { start: 0, end: Date.now() }

        const query = {
            kinds: [{name: 'availability'}]
        }

        return new Promise( (resolve, reject) =>
            this._ds.datasets
                .runQuery(
                    { datasetId: key.project_id, resource: {query} },
                    (err, res) => err ? reject( err ) : resolve( res )
                )
            )
            .then( ({batch}) => {

                const {entityResults, endCursor, moreResults} = batch

                return entityResults
                    .map( x => parseStation( x.entity ) )
            })
    }

}
