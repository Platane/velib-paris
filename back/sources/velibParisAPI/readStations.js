import {parseString} from 'xml2js'
import {get} from '../../utils/request'
import {Tube} from '../../utils/tube/abstract'


const staticStationsUri = ( ) =>
    ({
        protocol: 'http',
        host: 'www.velib.paris',
        port: 80,
        pathname: 'service/carto',
    })


const parseStaticStations = res =>
    new Promise( (resolve, reject) =>
        parseString(res, (err, object) => {

            if ( err || !object || !object.carto || !object.carto.markers )
                return reject( err || 'markers array not found' )

            const stations = object.carto.markers[0].marker
                .map( x => ({
                    id          : +x.$.number,
                    address     : x.$.fullAddress,
                    name        : x.$.name,
                    coordinates : [x.$.lat, x.$.lng],
                }) )

            resolve( stations )
        })
    )

export class ReadStations extends Tube {

    _start(){

        get( staticStationsUri() )

            .then( parseStaticStations )

            .catch( err => this.error( err ) )

            .then( res => {
                console.log( res.length )
                this
                    .pushBatch( res )
                    .end()
            })

    }
}
