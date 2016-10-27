global.Promise = require('bluebird')

import { createStationFetcher, createAvailabilityFetcher }   from 'fetcher'
import { createStationPusher, createAvailabilityPusher }     from 'pusher'



import createGos    from 'service/googleObjectStorage'
import config       from 'config'
import EventEmitter from 'events'

let gos

Promise.all([
        
    createGos( config.googleObjectStorage )
        .then( x => gos = x )

])
    .then( () => {
    
        const stationFetch             = createStationFetcher()
        const availabilityFetch        = createAvailabilityFetcher({ max_concurency: 3 })
        const stationPush              = createStationPusher( gos, { batch_size_max: 500 } )
        const availabilityPush         = createAvailabilityPusher( gos, { batch_size_max: 500 } )
        
        
        
        console.log('start')
            
        const stream = new EventEmitter()
        
        let stations
        
        stationFetch([null])
            .on('data',     res => ( stations = res ).forEach( x => stream.emit('data', x ) ))
            .on('error',    res => console.log( 'error', res ))
            .on('end',      ()  => stream.emit('end') )
                
                
        const w = stationPush( stream )
            .then( () => {
                
                console.log('station pushed')
                
                return availabilityPush( availabilityFetch( stations.slice(0,10).map( x => x.id ) ) )
                    .then( () => console.log('availability pushed') )
                    
            })
        
        
        
        
        return w
    })
    
    .catch( err => console.log( 'err', err ))
