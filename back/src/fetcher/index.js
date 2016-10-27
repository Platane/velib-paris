import createManager        from './manager'
import requestAvailability  from './sources/velibParisAPI/availability'
import requestStation       from './sources/velibParisAPI/station'

export const createStationFetcher = ( options ) =>
    createManager( requestStation.bind( null, options ), options )
    
export const createAvailabilityFetcher = ( options ) =>
    createManager( requestAvailability.bind( null, options ), options )
    