/**
 *
 * ask the live info of all the stations
 *  push them into the db
 *
 */


import {Transform, Writable} from 'stream'
import {getLiveStation} from '../sources/velibparisAPI'


class GetLiveInfo extends Transform {

    constructor(){
        super({objectMode:true, highWaterMark:1})
    }

    _transform( station, encoding, callback ) {

        getLiveStation( station.id )

            .then( info => ({ id: station.id, ...info }) )

            .then( x => callback(null, x ) )
            .catch( callback )
    }
}

class pushToDB extends Writable {

    constructor( db ){
        super({objectMode:true, highWaterMark:1})
        this.db = db
    }

    _write( station, encoding, callback ) {
        this.db.pushAvailability( station )
            .then( x => callback(null, x ) )
            .catch( callback )
    }
}


export class UpdateLive {

    constructor( db ){
        this.db = db
    }

    update(){

        const db = this.db._db

        return new Promise( (resolve, reject) => {

            db.collection('stations')

                // find all
                .find()

                .stream()
                .on('error', reject )

                .pipe( new GetLiveInfo() )
                .on('error', reject )

                .pipe( new pushToDB( this.db ) )
                .on('error', reject )


                .on('end', resolve )

        })
    }
}
