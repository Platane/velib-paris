
const shouldRetry = ( err ) => {
    const overLimit = typeof err == 'string' && err.match(/request fails with 403 status/)
}

module.exports = ( Transform ) => {

    class T extends Transform {

        _transform( x ) {
            const res = super._transform( x )

            if ( !res.then )
                return res
        }
    }

}
