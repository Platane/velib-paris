import {DB} from './db/googleObjectStorage'

const db = new DB()

db.init()

    // .then( () => db.pushStations( [{id:1, total:20, name:'zob', address:'zob', coordinates:[1,1]}] ) )

    .then( () => db.readAllStations(  ) )

    .then( res => console.log( 'success',res ) )

    .catch( err => console.log ( 'err', err, err.stack ) )
