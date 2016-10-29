import request          from 'service/request'

const buildUrl = ( apiKey, stationId ) =>
    ({
        protocol    : 'https:',
        host        : 'api.jcdecaux.com',
        pathname    : 'vls/v1/stations/'+stationId,
        query       : { apiKey, contract:'Paris' },
    })


const parse = (id, res) => ({
    updated_date: +res.last_update,
    free_slot   : +res.available_bike_stands,
    total_slot  : +res.bike_stands,
    stationId   : id,
})

const overLimit = ( err ) =>
    false

module.exports = ( options, stationId ) =>

    request.get( buildUrl( options.apiKey, stationId ) )

        // format error
        .catch( err => Promise.reject( overLimit( err ) ? 'overLimit' : err ) )

        .then( res => parse( stationId, res ) )
