
global.Promise = require('bluebird')

import fetchStations                    from 'task/fetcher/sources/googleObjectStorage/station'
import { createAvailabilityFetcher }    from 'task/fetcher'
import { createAvailabilityPusher }     from 'task/pusher'

import createReporter       from 'util/reporter'
import {wait}               from 'util/timing'
import createGos            from 'service/googleObjectStorage'
import config               from 'config'

let gos
const stationIds    = []
const report        = createReporter( config.reporter )

Promise.all([

    createGos( config.googleObjectStorage )
        .then( x => gos = x )

])
    .then( () => fetchStations( gos ).then( ({ items }) => stationIds.push( ...items.slice(0,500).map( x => x.id ) ) ) )

    .then( () => {

        const availabilityFetch        = createAvailabilityFetcher({ max_concurency: 3 })
        const availabilityPush         = createAvailabilityPusher( gos, { batch_size_max: 100 })

        const loop = () =>

            availabilityPush( availabilityFetch( stationIds ) )

                .then( () => wait( 5*60*1000 ) )

                .then( loop )



        loop()
    })

    .catch( report )
