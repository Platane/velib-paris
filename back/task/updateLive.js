/**
 *
 * ask the live info of all the stations
 *  push them into the db
 *
 */


import {Transform} from 'stream'
import {getLiveStation} from '../sources/velibparisAPI'

// class Transform extends Stream {
//
//     constructor(){
//         super()
//         this.writable = this.readable = true
//         this.processing = 0
//         this.ended = false
//     }
//
//     write( station ){
//         this.processing ++
//
//         this._transform( station )
//
//             .then( x => this.emit('data', x)  )
//
//             .catch( err => this.emit('error', err)  )
//
//             .then( () => {
//                 this.processing --
//                 this._checkEnd()
//             })
//     }
//
//     end(){
//         this.ended = true
//         this._checkEnd()
//     }
//
//     _checkEnd(){
//         !this.processing && this.ended && this.emit('end')
//     }
// }



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

    _flush( callback ){
        callback()
    }
}

class pushToDB extends Transform {

    constructor( db ){
        super({objectMode:true, highWaterMark:1})
        this.db = db
    }

    _transform( station, encoding, callback ) {
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
