import {parseString} from 'xml2js'
import {get} from '../../utils/request'
import {Transformer} from '../../utils/tube/transformer'

const api_key = process.env.JCDECAUX_API_KEY

const liveStationUri = ( stationId ) =>
    ({
        protocol: 'https',
        host: 'api.jcdecaux.com',
        port: 80,
        pathname: 'vls/v1/stations/'+stationId,
        query: { apiKey:api_key, contract:'Paris' },
    })

const parseJSON = str => {
    try{
        return JSON.parse( str )
    }catch( err ){
        return Promise.reject( err )
    }
}

const parseLiveStation = (id, res) => ({
    updated     : +res.last_update,
    free        : +res.available_bike_stands,
    total       : +res.bike_stands,
    stationId   : id,
})

export class ReadAvailabilitiesForStations extends Transformer {

    _transform( station ){

        return get( liveStationUri( station.id ) )

            .then( parseJSON )

            .then( res => parseLiveStation( station.id, res ) )

            .then( res => new Promise( resolve => setTimeout( () => resolve( res ), 500 ) ) )

            .catch( err => console.log( station.id, err ) )
    }
}
