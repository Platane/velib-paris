import createFetcher from '../index'
import request       from '../../sources/__mocks__/availability'
    
beforeEach(() => request.__setErrorChain([]) )

it('should return an event emitter which emit stations availability', done => {

    const fetch = createFetcher( request.bind( null, null ) )
    
    const res = []
    
    fetch([ 1,2,3,4 ])
        .on('data', x => res.push( x ) )
        .on('end', () => {
            try {
                expect( res.map( x => x.stationId ).sort() ).toEqual([ 1,2,3,4 ])
                done()
                
            }catch( err ){ done.fail( err ) }
            
        })
})
        
it('should retry when request fails', done => {
    
    const reported = []
    
    const fetch = createFetcher(
        request.bind( null, null ),
        {
            reporter    : { type: 'callback', callback: err => reported.push( err ) },
            retry_delay : 1,
        }
    )
    
    const res = []
    
    request.__setErrorChain([
        null,
        'error1',
        'error2',
    ])
    
    fetch([ 1,2 ])
        .on('data', x => res.push( x ) )
        .on('end', () => {
            try {
                
                expect( reported ).toEqual([
                    'error1',
                    'error2',
                ])
                
                expect( res.map( x => x.stationId ).sort() ).toEqual([ 1,2 ])
                done()
                
            }catch( err ){ done.fail( err ) }
            
        })
})

it('should abord when too much error', done => {
    
    const reported = []
    
    const fetch = createFetcher(
        request.bind( null, null ),
        {
            reporter    : { type: 'callback', callback: err => reported.push( err ) },
            retry_delay : 1,
        }
    )
    
    const res    = []
    const errors = []
    
    request.__setErrorChain( Array.from({ length: 100 }).map( ()=>'err' ) )
    
    fetch([ 1,2 ])
        .on('data',  x => res.push( x ) )
        .on('error', x => errors.push( x ) )
        .on('end', () => {
            try {
                expect( reported.length > 5 ).toBeTruthy()
                
                expect( res ).toEqual( [] )
                
                expect( errors.length ).toBe( 1 )
                
                done()
                
            }catch( err ){ done.fail( err ) }
            
        })
})