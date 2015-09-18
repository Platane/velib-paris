import {parseString} from 'xml2js'
import {get} from './request'

// static info
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
                    id: +x.$.number,
                    city: 'paris',
                    address: x.$.fullAddress,
                    name: x.$.name,
                    bonus: !!(+x.$.bonus),

                    loc: {
                        type: 'Point',
                        coordinates: [x.$.lat, x.$.lng],
                    },
                }) )

            resolve( stations )
        })
    )

export const getStaticStations = () =>

    get( staticStationsUri() )

        .then( parseStaticStations )






// dynamic info
const liveStationUri = stationId =>
    ({
        protocol: 'http',
        host: 'www.velib.paris',
        port: 80,
        pathname: 'service/stationdetails/paris/'+stationId,
    })


const parseLiveStation = res =>
    new Promise( (resolve, reject) =>
        parseString(res, (err, object) => {

            if ( err || !object || !object.station )
                return reject( err || 'station object not found' )

            const station = object.station

            resolve({
                updated: +station.updated[0],
                free: +station.free[0],
                total: +station.total[0],
            })
        })
    )

export const getLiveStation = stationId =>

    get( liveStationUri( stationId ) )

        .then( parseLiveStation )
