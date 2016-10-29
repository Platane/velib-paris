
let chain = []
let err
const request = ( options, stationId ) =>
    
    !( err = chain.shift() )
        ? Promise.resolve({
            updated_date: Date.now(),
            free_slot   : 20,
            total_slot  : 30,
            stationId   : stationId,
        })
        : Promise.reject( err )
    
    
    
request.__setErrorChain = x =>
    chain = x

module.exports = request