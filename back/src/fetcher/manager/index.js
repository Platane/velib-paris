import EventEmitter         from 'events'
import createReporter       from 'util/reporter'
import genUID               from 'util/uid'

const filterInPlace = ( arr, test ) => {
    for ( let i=arr.length; i--; )
        if ( !test( arr[i] ) )
            arr.splice( i, 1 )
    return arr
}

module.exports = ( request, options = {} ) => {
    
    const report         = createReporter( options.reporter )
    
    const max_concurency = options.max_concurency   || 1
    const retry_delay    = options.retry_delay      || 5*60*1000
    
    const toFetch        = []
    const pending        = []
    
    let consecutive_fails = 0
    let retry_date        = null
    let timeout           = null
    
    const loop = () => {
                
        clearTimeout( timeout )
        
        if ( retry_date && retry_date > Date.now() )
            return timeout = setTimeout( loop, retry_date - Date.now() )
        
        retry_date = null
        
        while( pending.length < max_concurency && toFetch.length ){
            
            const next = toFetch.shift()
            
            pending.push( next )
            
            request( next.param )
                
                .then( availability => {
                    
                    consecutive_fails = 0
                    
                    next.ee.emit( 'data', availability )
                })
                
                .catch( err => {
                    if ( err != 'overLimit' )
                        // unexepcted error, report
                        report( err )
                    
                    if ( consecutive_fails ++ > 10 ) {
                        report( 'reciving a lot of error from availability request' )
                        
                        // kill the whole batch
                        filterInPlace( toFetch, x => next.batch_key != x.batch_key )
                        next.ee.emit('error')
                        next.ee.emit('end')
                    }
                        
                    retry_date = Date.now() + retry_delay
                    
                    
                    // re-push into the toFetch list
                    toFetch.unshift( next )
                })
                
                .then( () => {
                    // remove from pending list
                    filterInPlace( pending, x => x != next )
                    
                    if ( !pending.some( x => next.batch_key == x.batch_key ) && !toFetch.some( x => next.batch_key == x.batch_key ) )
                        next.ee.emit( 'end' )
                        
                    loop()
                })
        }
            
    }
    
    return ( params ) => {
        
        const batch_key     = genUID()
        
        const ee            = new EventEmitter
        
        toFetch.push( ...params.map( param => ({ param, ee, batch_key }) ) )
        
        loop()
        
        ee.cancel = () =>
            filterInPlace( toFetch, x => x.batch_key != batch_key )
            
        return ee
    }
    
}