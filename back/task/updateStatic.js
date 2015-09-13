/**
 *
 * ask the static info of the stations
 *  push them into the db
 *
 */


import {getStaticStations} from '../sources/velibparisAPI'

export class UpdateStatic {

    constructor( db ){
        this.db = db
    }

    update(){

        return getStaticStations()

            .then( stations => {

                const promises = stations
                    .map( station => this.db.setStation(station)  )


                return Promise.all( promises )
            })
    }

}
