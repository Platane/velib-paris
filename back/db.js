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

                // does the city already exist in db
                if ( count )

                    // yes, update
                    return stations.updateOne({ id: station.id}, station )

                else

                    // no, insert
                    return stations.insertOne( station )
            })
    }

    pushNvelib( station, nVelib ){

    }
}
