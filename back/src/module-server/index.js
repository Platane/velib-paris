import {createServer}       from 'http'

console.log('starting server')


const server = createServer()

server.on('request', ( request, response ) => {

    response.writeHead( 200 )
    response.end( 'hello' )

})

server.listen( 80 )

