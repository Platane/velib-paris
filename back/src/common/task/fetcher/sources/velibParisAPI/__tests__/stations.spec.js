import request      from '../station'


it('should fetch stations', () =>
    request( {} )
        .then( res => {
            expect( res.length ).toBeGreaterThan( 1000 )
            res.forEach( x => {

                expect( 'id'            in x ).toBeTruthy()
                expect( 'address'       in x ).toBeTruthy()
                expect( 'name'          in x ).toBeTruthy()
                expect( 'coordinates'   in x ).toBeTruthy()
                expect( x.coordinates.length ).toBe( 2 )
            })
        })
)
