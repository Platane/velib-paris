import { DB as Parent } from '../abstract'
import {auth, datastore} from 'googleapis'
import {PushStations} from './pushStations'
import {PushAvailabilities} from './pushAvailabilities'
import {ReadStations} from './readStations'

let key
try{
    key = require('../../../credentials/google.json')
}catch( e ){
try {
    key = require('../../../../credentials/google.json')
}catch( e ){
    key = {
        project_id      : process.env.project_id,
        client_email    : process.env.client_email,
        private_key     : process.env.private_key.replace( /\\n/g , '\n'),
    }
}
}

const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/datastore',
]
const version = 'v1beta2'




export class DB extends Parent {

    init() {
        if ( this._ds )
            return Promise.resolve()

        this._key = key

        return this.auth()

            // get the datastore object
            .then( () => {

                const projectId = this._key.project_id

                this._ds = datastore({
                    version,
                    projectId,
                    auth            : this._credentials,
                    params: {datasetId: projectId},
                  })

            })
    }

    auth() {

        console.log( 'auth', this._key.client_email )

        return new Promise( (resolve, reject) => {
            this._credentials = new auth.JWT( this._key.client_email, null, this._key.private_key, SCOPES )
            this._credentials.authorize( err => err ? reject( err ) : resolve() )
        })
    }

    pushAvailabilities( ) {
        return new PushAvailabilities( this._ds )
    }

    pushStations( ) {
        return new PushStations( this._ds )
    }


    readStations( ) {
        return new ReadStations( this._ds )
    }

}
