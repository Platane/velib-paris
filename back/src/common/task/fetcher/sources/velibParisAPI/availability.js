import {parseString}    from 'xml2js'
import request          from 'service/request'


const buildUrl = stationId =>
    ({
        host        : 'www.velib.paris',
        pathname    : '/service/stationdetails/paris/'+stationId,
    })


const parse = (id, res) =>
    new Promise( (resolve, reject) =>
        parseString(res, (err, object) => {

            if ( err || !object || !object.station )
                return reject( err || 'station object not found' )

            const station = object.station

            resolve({
                updated_date: (+station.updated[0] * 1000),
                free_slot   : +station.free[0],
                total_slot  : +station.total[0],
                stationId   : id,
            })
        })
    )


const overLimit = ( err ) =>
    typeof err == 'string' && err.match(/request fails with 403 status/)


module.exports = ( options, stationId ) =>

    request( buildUrl( stationId ) )

        // format error
        .catch( err => Promise.reject( overLimit( err ) ? 'overLimit' : err ) )

        .then( res => parse( stationId, res ) )

