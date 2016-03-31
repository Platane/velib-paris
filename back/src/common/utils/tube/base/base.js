class Tube {

    constructor(){

        // chain
        this._parents     = []
        this._children    = []

        this._outBuffer   = []

        // the number of data that the current tube must ack
        this._toAck             = 0

        // the number of data that the tube have passed to its children that are witing the children to ack
        // ( keep track of this value, as the data can be reinjected into the parent, wait for it to be ack to declare an end )
        this._beingDelivered    = 0

        // the tube is ended
        this._ended             = false

        // for generator,
        // if set to true, nothing will be pushed
        // when true, wait for all data to be ack and declare the tube as ended
        this._flowOver          = false


        // in order to prevent onReady to be called twice, note when the tube start
        this._started           = false


        // params for round robin
        // to prevent deadlock
        this._k                 = 0
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
            if( reject ) {

                // round robin
                this._k = (this._k +1) %10
                if ( this._k )
                    parent._children.push( parent._children.shift() )

                parent.push( data )

            } else {
                parent._testEnd( )
                this._testEnd( )
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

        // notify all children that data is available
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
        this._started = true
        this._parents
            .filter( p => !p._started && !p._ended )
            .forEach( p => {
                p._started = true
                p.onReady()
            })
    }

    /**
     * end, declare that no data will be pushed
     * only generator should call this, transform pipe can guess when parents are ended
     */
    end(){
        this._flowOver=true
        this._testEnd()
        return this
    }

    _testEnd( ){
        if (
            ( this._parents.length || ( this._parents.length==0 && this._flowOver ) )
            && this._outBuffer.length == 0
            && this._toAck == 0
            && this._beingDelivered == 0
            && this._parents.every( p => p._ended )
        )
        {
            this._ended = true

            this._children.forEach( p => p._testEnd() )
        }
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

export default Tube
