import {DB} from '../db/googleObjectStorage'
import {Source} from '../sources/velibParisAPI'
import {Transformer, Tube, Limiter} from '../utils/tube'

class Generator extends Tube {

    constructor( arr ){
        super()
        this._arr = arr
    }

    _start(){
        this.pushBatch( this._arr )
        this.end()
    }
}

export class Updater {

    constructor(){
        this._db = new DB()
        this._src = new Source()

        this._cached = []
    }

    init(){


        const CacheStation = Transformer.create( x => {
            this._cached.push({
                id              : x.id,
                lastUpdateDate  : 0
            })
            return x
        })

        return this._db.init()

            .then( () =>

                this._src.readStations()

                    .pipe( new Limiter( 10 ) )

                    .pipe( new CacheStation() )

                    .pipe( this._db.pushStations() )

                    .start()
            )

    }

    update(){

        // filter update that havn't changed,
        // update the cached if necessary
        const Filter = Transformer.create(
            x => {

                if ( this.getStationLastUpdateDate( x.stationId ) == x.updated )
                    return

                this._setStationLastUpdateDate( x.stationId, x.updated )
                return x
            }
        )

        return ( new Generator( this._cached.slice() ) )

            .pipe( this._src.readAvailabilitiesForStations() )

            .pipe( new Filter() )

            .pipe( this._db.pushAvailabilities() )

            .start()

            .then( () => {
                // sort by lastUpdateDate
                // lest recent first
                this._cached = this._cached.sort( (a, b) => a.lastUpdateDate > b.lastUpdateDate ? 1 : -1 )
            })
    }

    _setStationLastUpdateDate( id, s ){
        let i
        for ( i = this._cached.length; i-- && this._cached[ i ].id != id; )
            ;
        return i == -1
            ? this._cached.push({ id, lastUpdated : 0 })
            : this._cached[ i ].lastUpdateDate = s
    }

    getStationLastUpdateDate( id ){
        let i
        for ( i = this._cached.length; i-- && this._cached[ i ].id != id; )
            ;
        return i == -1
            ? 0
            : this._cached[ i ].lastUpdateDate
    }
}
