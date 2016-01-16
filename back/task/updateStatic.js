
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

        return ( this.src.readStations() )

            .pipe( this.db.pushStations() )

            .start()
    }
}
