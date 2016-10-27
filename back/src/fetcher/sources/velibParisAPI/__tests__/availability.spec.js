import request      from '../availability'

    
it('should fetch availability for station', () =>
    request( {}, 4021 )
        .then( res => {
            console.log( res )
            expect( 'stationId'     in res ).toBeTruthy()
            expect( 'updated_date'  in res ).toBeTruthy()
            expect( 'free_slot'     in res ).toBeTruthy()
            expect( 'total_slot'    in res ).toBeTruthy()
        })
)
