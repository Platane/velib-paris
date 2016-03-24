module.exports = Tube => {
    class TubeAsPromise extends Tube {

        start(){
            return new Promise( ( resolve, reject) => {

                this.end    = resolve
                this.error  = reject

                this.onReady()
            })
        }
    }

    return TubeAsPromise
}
