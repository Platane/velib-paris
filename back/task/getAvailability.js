import {Transform, Stream} from 'stream'


class FilterStation extends Stream {

    constructor( stations ){
        super({objectMode:true})
        this.writable = this.readable = true
        this.stations = stations
    }

    write( station ) {

        if ( !this.stations || this.stations.indexOf( station.id ) >= 0 )

            this.emit('data', station)

        return true
    }

    end(){
        this.emit('end')
    }
}

class GetLastAvailability extends Transform {

    constructor( db, range ){
        super({objectMode:true})
        this.db = db
        this.range = range
    }

    _transform( station, encoding, callback ) {

        const av = []

        this.db._db.collection('availability')

            .find( { id: station.id, updated: { $gt: this.range.start, $lt: this.range.end } } )

            .forEach( x => {

                    av.push( x )
                },
                err => callback( err, (station.av=av, station) )
            )
    }
}

class Format extends Stream {

    constructor( stations ){
        super({objectMode:true})
        this.writable = this.readable = true
        this.res = []
    }

    write( station ) {

        this.res.push( station )

        return true
    }

    end(){

        const pack = this.res.map( x => ({

                id: x.id,

                lat: x.lat,
                lng: x.lng,

                total: x.av.length ? x.av[ 0 ].total : null,
                av: x.av
                    .map( x => x.updated+','+x.free )
                    .join(';')
            })
        )

        this.emit('data', JSON.stringify(pack) )
        this.emit('end')
    }
}



export class GetAvailability {

    constructor( db ){
        this.db = db
    }

    get( stations = null, range = {} ){

        const db = this.db._db

        stations = [901, 902, 903, 904, 905, 906, 907, 908, 909, 910]

        if( !range.start )
            // range.start = Date.now() / 1000 - 24 * 60 * 60
            range.start = 0

        if( !range.end )
            range.end = Date.now() / 1000

        range.start = 0|range.start
        range.end = 0|range.end

        return new Promise( (resolve, reject) => {

            db.collection('stations')

                // find all
                .find()

                .stream()
                .on('error', reject )

                .pipe( new FilterStation( stations ) )
                .on('error', reject )

                .pipe( new GetLastAvailability( this.db, range ) )
                .on('error', reject )

                .pipe( new Format( this.db ) )
                .on('error', reject )

                .on('data', resolve )

        })
    }
}
