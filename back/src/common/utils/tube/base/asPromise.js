module.exports = Tube => {
    class TubeAsPromise extends Tube {

        _testEnd(){
            super._testEnd()
            this._ended && this._resolve && this._resolve()
        }

        start(){
            return new Promise( ( resolve, reject) => {

                this.error      = reject
                this._resolve   = resolve

                this.onReady()
            })
        }
    }

    return TubeAsPromise
}
