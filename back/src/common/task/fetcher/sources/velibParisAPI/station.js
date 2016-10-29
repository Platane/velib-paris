import {parseString}    from 'xml2js'
import request          from 'service/request'


const buildUrl = () =>
    ({
        host        : 'www.velib.paris',
        pathname    : '/service/carto',
    })


const parse = res =>
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


const overLimit = ( err ) =>
    typeof err == 'string' && err.match(/request fails with 403 status/)


module.exports = ( options ) =>

    request( buildUrl( ) )

        // format error
        .catch( err => Promise.reject( overLimit( err ) ? 'overLimit' : err ) )

        .then( res => parse( res ) )