import createReporter       from 'util/reporter'

module.exports = ( push, options = {} ) => {
    
    const report         = createReporter( options.reporter )
    
    const batch_size_max = options.batch_size_max   || 1
    
    return ( stream ) =>
        new Promise( (resolve, reject, onCancel) => {
        
            const items         = []
            
            let ended           = false
            let pending         = false
            
            const loop = () => {
                
                if ( pending )
                    return
                                    
                if ( items.length >= batch_size_max || ( items.length > 0 && ended ) ) {
                    
                    pending = true
                    
                    push( items.splice( 0, batch_size_max ) )
                        .then( () => {
                            pending = false
                            loop()
                        })
                        .catch( err => {
                            report( err )
                            reject( err )
                        })
                        
                } else if ( !pending && items.length == 0 && ended )
                    resolve()
            }
        
            stream
                .on('data', item => {
                    items.push( item )
                    loop()
                })
                .on('end', () => {
                    ended = true
                    loop()
                })
        })
        
}