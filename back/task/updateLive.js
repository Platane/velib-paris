/**
 *
 * ask the live info of all the stations
 *  push them into the db
 *
 */


import {Transform, Writable, Duplex} from 'stream'
import {getLiveStation} from '../sources/velibparisAPI'


class Temporize extends Duplex {

    constructor(delay){
        super({objectMode:true})

        this.delay=delay || 100
        this._q = []
        this._ready = false
    }

    _write( x , _, callback) {
        this._q.push( x )
        this._tryToPush()
        callback()
    }

    _read() {
        this._ready = true
        this._tryToPush()
    }

    _tryToPush(){
        if ( this._timeout || !this._q.length || !this._ready )
            return

        this._ready = this.push( this._q.shift() )
        this._timeout = setTimeout( () => {
            this._timeout=false
            this._tryToPush()
        })
    }
}

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

        let n=1

        return new Promise( (resolve, reject) => {

            db.collection('stations')

                // find all
                .find()

                .sort({updated: 1})

                .stream()
                .on('error', reject )


                .pipe( new Temporize(1000))
                .on('error', reject )


                .pipe( new GetLiveInfo() )
                .on('error', reject )

                .on('data', x => console.log( n++, x.id ) )

                .pipe( new pushToDB( this.db ) )
                .on('error', reject )


                .on('end', resolve )

        })
    }
}
