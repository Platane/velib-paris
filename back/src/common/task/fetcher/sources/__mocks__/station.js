
let chain = []
let err
const request = ( options ) =>
    
    !( err = chain.shift() )
        ? Promise.resolve(
            Array.from({ length: 1200 })
                .map( (_,i) =>
                    ({
                        id          : `station-${i}`,
                        address     : 'address',
                        name        : 'aaa',
                        coordinates : [10,10],
                    })
                )
            )
        : Promise.reject( err )
    
    
    
request.__setErrorChain = x =>
    chain = x

module.exports = request