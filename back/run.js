import {DB} from './db'

import {UpdateLive} from './task/updateLive'
import {UpdateStatic} from './task/updateStatic'
import {GetAvailability} from './task/getAvailability'

import {createServer} from 'http'
import {parse as parseURL} from 'url'


const db = new DB()
const updateStatic = new UpdateStatic( db )
const updateLive = new UpdateLive( db )
const getAvailability = new GetAvailability( db )

console.log('connecting to db ...')

try{

db.connect()

    .then( () => console.log('connected') )

    .then( () => console.log('starting to update static stations') )

    // .then( () => updateStatic.update() )

    .then( () => console.log('finished to update static stations') )


    .then( () => console.log('starting to update live stations') )

    // .then( () => updateLive.update() )

    .then( () => console.log('finished to update live stations') )

    .catch( err => console.error( err && err.stack ? err.stack : err ) )



}catch( e ){
    console.error( e )
}





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



    getAvailability.get( query.stations )

        .then( res => {
            response.writeHead(200, {'Access-Control-Allow-Origin': '*'})
            response.end( res )
        })
        .catch( err => {
            response.writeHead(500)
            response.end( JSON.stringify( err ) )
        })
})
