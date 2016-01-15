
import {toPromise} from '../utils/stream'

/**
 *
 * ask the static info of the stations
 *  push them into the db
 *
 */

export class UpdateStatic {

    constructor( db, src ){
        this.db = db
        this.src = src
    }

    update(){
        return toPromise(
            this.src.getStaticStations()

                // .on('data', e => console.log(e.name) )

                .pipe( this.db.pushStations() )

                .on('error', e => console.error( e ) )
        )
    }
}
