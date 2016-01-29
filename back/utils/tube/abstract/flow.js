import {Tube as Parent } from './pipeable'


export class Tube extends Parent {

    /**
    * push an items to the ouput,
    * notify the ouput that at least one item is available
    *
    * @return {self}
    */
    push( x ){

        this._outBuffer.push( x )

        // tell to every output that some dat aare available
        this._out
            .forEach( out => out._dataAvailable( ) )

        return this
    }

    pushBatch( x ){

        this._outBuffer.push( ...x )

        this._out
            .forEach( out => out._dataAvailable( ) )

        return this
    }

    /**
     * return the number of items available accross all the inputs
     *
     * @return {number}
     */
    look( ){

        return this._in.reduce( (s,inn) => s+inn._outBuffer.length , 0 )
    }

    /**
     * try to pull one unique item from one of the input
     * return null if no items are availables
     *
     * @return {<x>|null}
     */
    pull( ){
        for( let i = this._in.length; i --; )
            if ( this._in[i]._outBuffer.length )
                return this._in[i]._outBuffer.shift()
    }

    pullN( n ){

        if ( this.look( ) < n )
            return

        const stack = []

        for( let i = this._in.length; i -- ;)
            stack.push( ...this._in[i]._outBuffer.splice( 0, n-stack.length ) )

        return stack
    }

    pullAll( ){
        const stack = []

        for( let i = this._in.length; i -- ;)
            stack.push( ...this._in[i]._outBuffer.splice( 0, Infinity ) )

        return stack
    }

    /**
     * reject the item because it cannot be processed right now
     * xxx isn't that fucked up when the input tube is already ended ?
     *
     * @param {<x>}
     *
     * @return {self}
     */
    reject( x ){
        if ( this._in[0] )
            this._in[0]._outBuffer.push( x )

        return this
    }

    /**
     * declare to the output that the data flow has ended ( and is done processing for this tube )
     *
     * @return {self}
     */
    end(){
        this._out.forEach( out => out.__dataEnded() )

        return this
    }

    /**
     * declare to the output that something fucked up,
     * default behavior is to relay the error to the exit tube, and reject the promise
     *
     * @return {self}
     */
    error( err ){
        this._out.forEach( out => out.error( err ) )

        return this
    }

    /**
    * start the data flow,
    * relay the start event to the tube that generate data, so it begins generate
    * return a promise which resolve when the data flow has ended
    * or reject when an error happend
    *
    * @return {promise}
    */
    start(){
        return new Promise( ( resolve, reject ) => {

            this._out = [{
                _dataAvailable  : ()=>0,
                __dataEnded     : () => {
                    resolve()
                    resolve = reject = () => 0
                },
                error           : err => {
                    reject( err )
                    resolve = reject = () => 0
                },
            }]

            this.__start()

        })
    }
}
