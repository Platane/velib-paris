import {MongoClient} from 'mongodb'


const connect = () =>
    new Promise( (resolve, reject) =>
        MongoClient.connect( process.env.MONGOLAB_URI, (err, db) =>
            err ? reject( err ) : resolve( db )    ))


export class DB {

    constructor(){

    }

    connect(){

        return connect()

            .then( db => this._db = db )

    }

    setStation( station ){

        const stations = this._db.collection('stations')

        return stations.find( { id: station.id } )

            .count()

            .then( count => {

                // does the station already exist in db
                if ( count )

                    // yes, update
                    return stations.updateOne({ id: station.id}, station )

                else

                    // no, insert
                    return stations.insertOne( station )
            })
    }

    pushAvailability( stationInfo ){

        const delay = 10 * 60

        const availability = this._db.collection('availability')

        return availability.find( { id: stationInfo.id, updated: { $gt: stationInfo.updated - delay } } )

            .count()

            .then( count => {


                // does the station already have been tracked in the last 10 min
                if ( count )

                    // yes, ignore
                    return

                else

                    // no, insert
                    return availability.insertOne( stationInfo )
            })
    }
}
