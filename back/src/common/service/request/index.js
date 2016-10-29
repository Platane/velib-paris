import https            from 'https'
import http             from 'http'
import * as url         from 'url'
import * as querystring from 'querystring'

const log = require('debug')('http')

// options.method
// options.pathname
// options.headers
// options.protocol
// options.host
// options.port
// options.json
module.exports = options =>

    new Promise( (resolve, reject, onCancel) => {
        
        const start = Date.now()
        log( `start ${ url.format( options ) }` )
        
        const req = ( options.protocol == 'https:' ? https : http )

            .request({ path: `${ options.pathname||'/' }?${ querystring.stringify( options.query || {} ) }`, ...options }, res => {

                if ( res.statusCode != 200 )
                    return reject( 'request fails with '+res.statusCode+' status code ('+url.format(options)+' ) ' )

                let s=''

                res.setEncoding('utf8')
                res.on('data', chunk => s+=chunk )
                res.on('end', () => {
                    
                    log( `end ${ url.format( options ) } ( ${ Date.now() - start } ms )` )
                    
                    if ( options.json ) {
                        try{
                            resolve( JSON.parse( s ) )
                        }
                        catch( err ){
                            reject( err )
                        }
                    
                    } else
                        resolve( s )
                })

            })
            .on('error', err => {
                log( `error ${ url.format( options ) } ${ err }` )
                reject( err )
            })
            
        req.end()
        onCancel && onCancel( () => req.abort() )
    })
