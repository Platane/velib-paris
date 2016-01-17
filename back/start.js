import {DB} from './db/googleObjectStorage'
// import {UpdateStatic} from './task/updateStatic'
import {Source} from './sources/velibparisAPI'
import {Transformer, Limiter} from './utils/tube'

const db = new DB()
const src = new Source()



class Logger extends Transformer {

    _transform( x ){
        console.log( x )
        this.push( x )
    }
}

class UpdateStatic {

    constructor( db, src ){
        this.db = db
        this.src = src
    }

    update(){

        return this.src.readStations()

            .pipe( new Limiter( 35 ) )

            .pipe( this.src.readAvailabilitiesForStations() )

            .pipe( new Logger() )

            .start()
    }
}

const u = new UpdateStatic( db, src )

try{
db.init()

    .then( () => u.update() )

    .then( res => console.log( 'success', res ) )

    .catch( err => console.log( 'err', err, err.stack ) )


}catch( err ){ console.error( err ) }
