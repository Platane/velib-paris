import {DB}             from '../common/db/googleObjectStorage'
import {Transformer}    from '../common/utils/tube'

export class StationGetter {

    constructor(){
        this._db = new DB()

        this._cached = []
    }

    init(){

        const CacheStation = Transformer.create( x => (this._cached.push( x ), x) )

        return this._db.init()

            .then( () =>

                this._db.readStations()

                    .pipe( new CacheStation() )

                    .start()
            )

    }

    get(){

        return Promise.resolve( this._cached )

    }
}
