import {DB} from './db'

import {GetAvailability} from './task/getAvailability'

import {createServer} from 'http'
import {parse as parseURL} from 'url'
import * as fs from 'fs'


const db = new DB()
const getAvailability = new GetAvailability( db )

// console.log('connecting to db ...')
//
// db.connect()
//
//     .then( () => console.log('connected') )





let server = createServer()

server.listen( process.env.PORT || 8080 )

// route /availability
server.on('request' , (request, response) => {

    const url = parseURL( request.url )

    if (url.pathname != '/availability')
        return


    const query = (url.query || '')
        .split('&')
        .reduce( (o,x) => {
            const s =x.split('=')
            o[ s[0] ] = s[ 1 ]
            return o
        }, {} )


    // read cache first
    try {
        const res = fs.readFileSync('./.tmp/cache')
        response.writeHead(200, {'Access-Control-Allow-Origin': '*'})
        response.end( res )
        return
    } catch( err ) {}


    getAvailability.get( query.stations )

        .then( res => {
            response.writeHead(200, {'Access-Control-Allow-Origin': '*'})
            response.end( res )

            //cache
            fs.writeFileSync('./.tmp/cache', res)
        })
        .catch( err => {
            response.writeHead(500)
            response.end( JSON.stringify( err ) )
        })
})
