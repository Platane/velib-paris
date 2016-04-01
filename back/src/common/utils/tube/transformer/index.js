import Tube_        from '../base'

class Tube extends Tube_ {

    constructor( fn= x => x, options={} ){

        super()

        this.concurency = options.concurency || Infinity
        this._n         = 0
        this.fn         = fn
    }

    onDataReady(){

        let x
        while( this._n < this.concurency && (x=this.pull()) ) {

            const {ack, data} = x
            const res = this.fn( data )

            if ( res.then ) {
                // asynch
                this._n ++
                res
                    .then( res => {
                        ack()
                        this._n --
                        res && this.push( res )
                        this.onDataReady()
                    })
                    .catch( err => {
                        if ( err )
                            return this.error( err )
                        ack( true )
                        this._n --
                        this.onDataReady()
                    })

            } else {
                // synch
                ack()
                this.push( res )
            }
        }
    }
}

export default Tube
