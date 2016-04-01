import {parseString} from 'xml2js'
import {get} from '../../utils/request'
import {Transformer} from '../../utils/tube/transformer'


const liveStationUri = stationId =>
    ({
        protocol    : 'http',
        host        : 'www.velib.paris',
        port        : 80,
        pathname    : 'service/stationdetails/paris/'+stationId,
    })


const parseLiveStation = (id, res) =>
    new Promise( (resolve, reject) =>
        parseString(res, (err, object) => {

            if ( err || !object || !object.station )
                return reject( err || 'station object not found' )

            const station = object.station

            resolve({
                updated     : (+station.updated[0] * 1000),
                free        : +station.free[0],
                total       : +station.total[0],
                stationId   : id,
            })
        })
    )


const overLimit = ( err ) =>
    typeof err == 'string' && err.match(/request fails with 403 status/)

const wait = delay =>
    new Promise( resolve => setTimeout( () => resolve(), delay ) )

export class ReadAvailabilitiesForStations extends Transformer {

    static maxConcurent = 1;

    _transform( station ){

        return get( liveStationUri( station.id ) )

            .then( res => parseLiveStation( station.id, res ) )

            .catch( err =>
                overLimit( err )
                    ? wait( 60000 )
                        .then( this.reject( station ) )
                    : Promise.reject( err )
            )
    }
}