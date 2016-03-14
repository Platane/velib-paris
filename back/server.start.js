import {StationGetter}      from './getter/station'
import express              from 'express'


const st = new StationGetter()

console.log('server')

st.init()
    .then( () =>

        express()
            .get('/api/v1/station', (req, res) => {

                const {startDate, endDate} = req.query

                st.get()
                    .then( stations => res.send( stations ) )

            })
            .listen(80)

    )
    .catch( err => console.log( 'err', err ) )
