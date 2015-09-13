import {DB} from './db'
import {UpdateLive} from './task/updateLive'
import {UpdateStatic} from './task/updateStatic'


const db = new DB()
const updateStatic = new UpdateStatic( db )
const updateLive = new UpdateLive( db )

console.log('connecting to db ...')

try{

db.connect()

    .then( () => console.log('connected') )

    .then( () => console.log('starting to update static stations') )

    .then( () => updateStatic.update() )

    .then( () => console.log('finished to update static stations') )


    .then( () => console.log('starting to update live stations') )

    .then( () => updateLive.update() )

    .then( () => console.log('finished to update live stations') )

    .catch( err => console.error( err && err.stack ? err.stack : err ) )



}catch( e ){
    console.error( e )
}
