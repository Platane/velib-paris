import {Readable} from 'stream'


/**
 * FromPromise
 *
 * assuming the promise return an array of entities, output this entities
 *
 * stream ouput: { <x> }  entity
 */
export class FromPromise extends Readable {

    constructor( promise ){

        super({objectMode:true})

        this._ready     = false
        this._ended     = false
        this._resolved  = false

        this._q
        this.log = []

        promise
            .then( res => {
                if ( this._q )
                    return
                this._q = res
                this._tryToPush()
            })
            .catch( err => this.emit('error', err ) )
    }

    _read() {

        this.log.push( 'read' )

        this._ready = true

        this._tryToPush()
    }

    _tryToPush(){
        if ( !this._q || this._q.length == 0 || !this._ready )
            return

        this.log.push( 'push' )
        while( this._q.length && ( this._ready = this.push( this._q.shift() ) ) )
            ;
        this.log.push( 'after push' )

        console.log( this.log )

        if ( !this._ended && this._q.length == 0 ){

            this.log.push( 'end' )

            this._ended = true
            this.emit('end')
        }

    }
}

export const fromPromise = ( promise ) => new FromPromise( promise )
