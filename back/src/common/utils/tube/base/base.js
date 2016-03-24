class Tube {

    constructor(){
        this._parents     = []
        this._children    = []

        this._inBuffer    = []
        this._outBuffer   = []

        this._toAck             = 0
        this._beingDelivered    = 0
        this._ended             = false
        this._autoEnd           = false
    }

    /**
     * pull, called on a pipe A, get data from one of the pipe parent
     *   if no data is available from the parents pipe, return null
     *
     *  @return { data, ack }   ack must be called when the data have finished processing, if called with true, reject the data
     */
    pull(){

        // select the parent
        // ( one with something in the outBuffer )
        const parent = this._parents.reduce( (parent ,p) => parent || ( p._outBuffer.length && p ) , null )

        if ( !parent )
            return

        // grab the next piece of data
        const data = parent._outBuffer.shift()

        // keep track on what need to be acked
        this._toAck ++
        parent._beingDelivered ++

        // prepare the ack function
        const ack = ( reject ) => {

            // the data is no longuer waiting for ack
            this._toAck --
            parent._beingDelivered --

            // if the data is rejected, push it back to the parent outBuffer
            // else it might have been the last data for the parent
            if( reject )
                parent.push( data )

            else {
                testEnd( parent )
                testEnd( this )
            }
        }

        return { data, ack }
    }

    /**
     * push, called on a pipe A, make the data available for the output pipes
     *   if there is no children, keep the outBuffer empty
     */
    push( o ){
        this._outBuffer.push( o )
        for( let i=this._children.length; i-- && this._outBuffer.length; )
            this._children[ i ].onDataReady()
        return this
    }


    /**
     * onDataReady, to override
     */
    onDataReady(){

    }

    /**
     * start, to override in case of generator
     *
     */
    onReady(){
        this._autoEnd=true
        this._parents.forEach( p => p.onReady() )
    }

    /**
     * end, declare that no data will be pushed
     * only generator should call this, transform pipe can guess when parents are ended
     */
    end(){
        this._ended = true
        this._children.forEach( testEnd )
        return this
    }

    /**
     * buble error to children
     */
    error( err ){
        this._children.forEach( c => c.error( err ) )
        return this
    }

    pipe( child ){
        child._parents.push( this )
        this._children.push( child )
        return child
    }
}


const testEnd = p =>
    p._autoEnd && p._outBuffer.length == 0 && p._toAck == 0 && p._beingDelivered == 0 && p._parents.every( p => p._ended ) && p.end()



export default Tube
