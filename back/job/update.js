import {DB} from '../db'

import {UpdateLive} from '../task/updateLive'

const db = new DB()
const updateLive = new UpdateLive( db )

console.log('connecting to db ...')

db.connect()

    .then( () => console.log('connected') )

    .then( () => console.log('starting to update live stations') )

    .then( () => updateLive.update() )

    .then( () => console.log('finished to update live stations') )

    .catch( err => console.error( err && err.stack ? err.stack : err ) )

    .then( () => process.exit(0) )
