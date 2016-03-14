import {ReadStations,} from './readStations'
import {ReadAvailabilitiesForStations} from './readAvailability'

export class Source {

    readStations() {
        return new ReadStations()
    }

    readAvailabilitiesForStations() {
        return new ReadAvailabilitiesForStations()
    }
}
