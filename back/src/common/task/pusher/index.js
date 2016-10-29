import createManager        from './manager'
import pushAvailability     from './target/googleObjectStorage/availability'
import pushStation          from './target/googleObjectStorage/station'

export const createStationPusher = ( gos, options ) =>
    createManager( pushStation.bind( null, gos ), options )
    
export const createAvailabilityPusher = ( gos, options ) =>
    createManager( pushAvailability.bind( null, gos ), options )
    