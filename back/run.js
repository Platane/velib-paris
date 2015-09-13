import {DB} from './db'
import {UpdateStatic} from './task/updateStatic'


const db = new DB()
const updateStatic = new UpdateStatic( db )

console.log('connecting to db ...')

db.connect()

    .then( () => console.log('connected') )

    .then( () => console.log('starting to update static stations') )

    .then( () => updateStatic.update() )

    .then( () => console.log('finished to update static stations') )

    .catch( err => console.error( err.stack ))
