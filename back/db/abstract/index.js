
const availability = {

    stationId:0,

    // availability at date
    date:0,

    // number of velib in the station
    n   :0,
}



const station = {

    id          : 0,

    total       : 0,

    name        : '',

    address     : '',

    coordinates : ['lat', 'lng'],
}
export class DB {


    init() {}

    /**
     *
     * @param   entries 	{ entry[] }
     *
     * @return {promise}
     */
    pushStationAvailability( entries ) { }

    pushStation( stations ){ }

    readAvailabilties() {}

    readAllStations() {}
}
