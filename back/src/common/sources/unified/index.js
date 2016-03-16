import {ReadStations}                           from '../velibParisAPI/readStations'
import {ReadAvailabilitiesForStations as Ra1}   from '../velibParisAPI/readAvailability'
import {ReadAvailabilitiesForStations as Ra2}   from '../JCDecauxAPI/readAvailability'

export class Source {

    readStations() {
        return new ReadStations()
    }

    readAvailabilitiesForStations() {
        return new Ra2()
    }
}
