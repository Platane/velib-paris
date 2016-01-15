import {DB} from './db/googleObjectStorage'
import {UpdateStatic} from './task/updateStatic'
import * as src from './sources/velibparisAPI'

const db = new DB()
const u = new UpdateStatic( db, src )

try{
db.init()

    .then( () => u.update() )

    // .then( res => console.log( 'success', res ) )

    .catch( err => console.log( 'err', err, err.stack ) )


}catch( err ){ console.error( err ) }
