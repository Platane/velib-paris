import {get as httpsGet} from 'https'
import {get as httpGet} from 'http'
import * as url from 'url'


export const get = options =>

    new Promise( (resolve, reject) =>


        ( options.protocol == 'https' ? httpsGet : httpGet )

            ( url.format(options), res => {

                let s=''

                res.setEncoding('utf8')
                res.on('data', chunk => s+=chunk )
                res.on('end', () => {

                    resolve( s )

                    resolve = reject = () => 0
                })

            })
            .on('error', err => {

                reject( err )

                resolve = reject = () => 0

            })
    )
