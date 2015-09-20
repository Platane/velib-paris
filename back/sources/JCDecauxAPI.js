import {get} from './request'


const api_key = process.env.JCDECAUX_API_KEY


const uri = ( route, query={} ) =>
    ({
        protocol: 'https',
        host: 'api.jcdecaux.com',
        port: 80,
        pathname: 'vls/v1/'+route,
        query: { apikey:api_key, contract:'Paris', ...query },
    })

const parseStaticStations = res =>
    res.map( x => ({
        id: +x.number,
        city: 'paris',
        address:x.adress,
        name: x.name,

        loc: {
            type: 'Point',
            coordinates: [x.lat, x.lng],
        },
    }) )


export const getStaticStations = () =>

    get( uri('stations') )

        .then( parseStaticStations )



// dynamic info

const parseLiveStation = res => ({
    updated: +res.last_update,
    free: +res.available_bikes,
    total: +res.bike_stands,
})


export const getLiveStation = stationId =>

    get( uri('stations/'+ stationId) )

        .then( parseLiveStation )
