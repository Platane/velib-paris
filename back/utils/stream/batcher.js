import {Duplex} from 'stream'


/**
 * Batcher
 *
 * agregate the entities in input into array
 *
 * stream input: { <x> }    entity
 * stream ouput: { <x>[] }  list of entities
 */
export class Batcher extends Duplex {

    constructor( batchSize ){
        super({objectMode:true})

        this._q = []

        this._batchSize = batchSize

        // next stream is ready to receive data
        this._ready = false
        this._ended = false
    }

    end( ...args  ) {

        this._ended = true
        this._tryToPush()

        this.emit('end')
    }

    _write( x , _, next) {

        console.log( x )
        this._q.push( x )

        this._tryToPush()

        // ask for more data
        next()
    }

    _read() {

        this._ready = true

        this._tryToPush()
    }

    _tryToPush(){

        if ( !this._ready )
            return

        if ( this._ended && this._q.length == 0 )
            return

        if ( !this._ended && this._q.length < this._batchSize )
            return

        const batch = this._q.splice( 0, this._batchSize )

        console.log( batch.length, this._ended )

        if ( batch.length )
            this._ready = this.push( batch )
    }
}


export const batcher = ( n ) => new Batcher( n )
