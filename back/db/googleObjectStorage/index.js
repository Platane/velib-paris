import { DB as Parent } from '../abstract'
import {auth, datastore} from 'googleapis'
import {buildAvailability, buildStation, parseStation, parseAvailability} from './parse'

const key = require('../../../credentials/google.json')
const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/datastore',
]
const version = 'v1beta2'


const beginTransaction = ds =>
    new Promise( (resolve, reject) =>

        ds.datasets.beginTransaction(
            {
                // Execute the RPC asynchronously, and call back with either an
                // error or the RPC result.
            },
            ( err, res ) => err ? reject( err ) : resolve( res.transaction )
        )
    )


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

        const ds = this._ds

        return beginTransaction( ds )

            .then( transaction => {

                const mutation = { insert: availabilities.map( buildAvailability ) }

                return new Promise( (resolve, reject) =>
                    ds.datasets.commit( { resource: { transaction, mutation } }, err => err ? reject( err ) : resolve() )
                )
            })
    }

    pushStations( stations ) {

        const ds = this._ds

        const mutation = { insert: stations.map( buildStation ) }

        console.log( 'push station', mutation )

        return new Promise( (resolve, reject) =>
            ds.datasets
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

    readAllStations( opions ) {

        // const timeWindow = options.timeWindow || { start: 0, end: Date.now() }

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

}
